import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchAlpacaPortfolio } from "@/lib/exchanges/alpaca";

const MOCK_HOLDINGS = [
  { symbol: "BTC",  name: "Bitcoin",    value: 18421.00, unrealizedPlPct:  3.2,  allocation: 38.5, exchange: "Coinbase" },
  { symbol: "AAPL", name: "Apple Inc.", value: 12350.00, unrealizedPlPct:  0.4,  allocation: 25.8, exchange: "Alpaca"   },
  { symbol: "ETH",  name: "Ethereum",   value:  9840.00, unrealizedPlPct:  1.8,  allocation: 20.6, exchange: "Coinbase" },
  { symbol: "SOL",  name: "Solana",     value:  7221.50, unrealizedPlPct: -0.9,  allocation: 15.1, exchange: "Binance"  },
];
const MOCK_TOTAL = 47832.50;

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "AI service not configured." }, { status: 503 });
  }

  // Get connected exchanges
  const { data: exchanges } = await supabase
    .from("connected_exchanges")
    .select("exchange_name, exchange_slug, api_key, api_secret")
    .eq("user_id", user.id)
    .eq("is_active", true);

  // Attempt real Alpaca data
  let realPortfolio: Awaited<ReturnType<typeof fetchAlpacaPortfolio>> | null = null;
  const alpacaRow = exchanges?.find(
    (e) => e.exchange_slug === "alpaca" && e.api_key && !e.api_key.startsWith("demo-key"),
  );
  if (alpacaRow?.api_key && alpacaRow?.api_secret) {
    try {
      realPortfolio = await fetchAlpacaPortfolio(alpacaRow.api_key, alpacaRow.api_secret);
    } catch { /* fall through to mock */ }
  }

  const isLive = realPortfolio !== null;
  const totalValue = isLive ? realPortfolio!.totalValue : MOCK_TOTAL;
  const holdings = isLive
    ? realPortfolio!.positions.map((p) => ({
        symbol: p.symbol,
        name: p.name,
        value: p.value,
        unrealizedPlPct: p.unrealizedPlPct,
        allocation: totalValue > 0 ? (p.value / totalValue) * 100 : 0,
        exchange: p.exchange,
      }))
    : MOCK_HOLDINGS;

  const holdingsList = holdings
    .map(
      (h) =>
        `- ${h.symbol} (${h.name}) via ${h.exchange}: $${h.value.toFixed(2)} (${h.allocation.toFixed(1)}%) — ${h.unrealizedPlPct >= 0 ? "+" : ""}${h.unrealizedPlPct.toFixed(2)}% unrealized P&L`,
    )
    .join("\n");

  const prompt = `You are a professional portfolio analyst. Analyse this investment portfolio and provide exactly 4 actionable insights.

Portfolio (${isLive ? "live data" : "sample demo data"}):
Total Value: $${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
Holdings:
${holdingsList}

Respond with ONLY a valid JSON object — no markdown, no explanation:
{
  "summary": "2-sentence overall portfolio assessment",
  "insights": [
    {
      "type": "risk",
      "title": "Short title (max 6 words)",
      "summary": "One sentence summary",
      "detail": "2-3 sentences of actionable analysis",
      "severity": "positive"
    }
  ]
}

Rules:
- Use these types exactly: "risk", "diversification", "performance", "recommendation"
- Use these severities exactly: "positive", "warning", "neutral"
- Return exactly 4 insights
- Pure JSON only — no markdown fences`;

  try {
    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://wealthview.app",
        "X-Title": "Wealthview",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-haiku",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!aiRes.ok) {
      const err = await aiRes.text();
      console.error("OpenRouter error:", err);
      return NextResponse.json({ error: "AI service error. Please try again." }, { status: 502 });
    }

    const aiData = await aiRes.json();
    const content: string = aiData.choices?.[0]?.message?.content ?? "";

    let parsed: { summary: string; insights: unknown[] };
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) {
        return NextResponse.json({ error: "Failed to parse AI response." }, { status: 502 });
      }
      parsed = JSON.parse(match[0]);
    }

    return NextResponse.json({
      summary: parsed.summary,
      insights: parsed.insights,
      isLive,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Insights generation error:", err);
    return NextResponse.json({ error: "Failed to generate insights." }, { status: 500 });
  }
}
