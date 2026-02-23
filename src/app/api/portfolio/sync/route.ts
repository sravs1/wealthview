import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { fetchAlpacaPortfolio } from "@/lib/exchanges/alpaca";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Look up Alpaca credentials
  const { data: alpacaRow } = await supabase
    .from("connected_exchanges")
    .select("api_key, api_secret")
    .eq("user_id", user.id)
    .eq("exchange_slug", "alpaca")
    .eq("is_active", true)
    .single();

  if (!alpacaRow?.api_key || !alpacaRow?.api_secret) {
    return NextResponse.json({ source: "none" });
  }

  // Reject demo/seed keys
  if (alpacaRow.api_key.startsWith("demo-key")) {
    return NextResponse.json({ source: "demo" });
  }

  try {
    const portfolio = await fetchAlpacaPortfolio(alpacaRow.api_key, alpacaRow.api_secret);

    // Persist a snapshot
    await supabase.from("portfolio_snapshots").insert({
      user_id: user.id,
      exchange_slug: "alpaca",
      total_value_usd: portfolio.totalValue,
      assets: portfolio.positions,
    });

    return NextResponse.json({ source: "alpaca", portfolio });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ source: "error", error: message }, { status: 200 });
  }
}
