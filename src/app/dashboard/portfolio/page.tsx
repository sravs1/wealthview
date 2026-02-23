import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BarChart2, Link2, TrendingUp, TrendingDown, FlaskConical } from "lucide-react";
import { fetchAlpacaPortfolio, type AlpacaPosition } from "@/lib/exchanges/alpaca";

const MOCK_HOLDINGS = [
  { symbol: "BTC",  name: "Bitcoin",        value: 18421.00, unrealizedPlPct: +3.2,  up: true,  exchange: "Coinbase", allocation: 38.5 },
  { symbol: "AAPL", name: "Apple Inc.",     value: 12350.00, unrealizedPlPct: +0.4,  up: true,  exchange: "Alpaca",   allocation: 25.8 },
  { symbol: "ETH",  name: "Ethereum",       value: 9840.00,  unrealizedPlPct: +1.8,  up: true,  exchange: "Coinbase", allocation: 20.6 },
  { symbol: "SOL",  name: "Solana",         value: 7221.50,  unrealizedPlPct: -0.9,  up: false, exchange: "Binance",  allocation: 15.1 },
];
const MOCK_TOTAL = 47832.50;

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function fmtPct(n: number) {
  return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
}

type Holding = {
  symbol: string;
  name: string;
  value: number;
  unrealizedPlPct: number;
  up: boolean;
  exchange: string;
  allocation: number;
};

export default async function PortfolioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  const { data: exchanges } = await supabase
    .from("connected_exchanges")
    .select("exchange_name, exchange_slug, api_key, api_secret")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const hasExchanges = exchanges && exchanges.length > 0;

  // Attempt real Alpaca data
  let realPortfolio: { totalValue: number; dayPl: number; dayPlPct: number; positions: AlpacaPosition[] } | null = null;
  const alpacaRow = exchanges?.find((e) => e.exchange_slug === "alpaca" && e.api_key && !e.api_key.startsWith("demo-key"));

  if (alpacaRow?.api_key && alpacaRow?.api_secret) {
    try {
      realPortfolio = await fetchAlpacaPortfolio(alpacaRow.api_key, alpacaRow.api_secret);
    } catch {
      // fall through to mock
    }
  }

  const isLive = realPortfolio !== null;

  // Build display holdings
  let holdings: Holding[];
  let totalValue: number;

  if (isLive && realPortfolio) {
    totalValue = realPortfolio.totalValue;
    const posTotal = realPortfolio.positions.reduce((sum, p) => sum + p.value, 0) || 1;
    holdings = realPortfolio.positions.map((p) => ({
      symbol: p.symbol,
      name: p.name,
      value: p.value,
      unrealizedPlPct: p.unrealizedPlPct,
      up: p.up,
      exchange: p.exchange,
      allocation: (p.value / posTotal) * 100,
    }));
  } else {
    totalValue = MOCK_TOTAL;
    holdings = MOCK_HOLDINGS;
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Portfolio</h1>
        <p className="text-slate-400 text-sm">Your consolidated holdings across all exchanges.</p>
      </div>

      {!hasExchanges ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/[0.05]">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <BarChart2 size={28} className="text-blue-400" />
          </div>
          <h2 className="text-white font-semibold text-xl mb-2">No portfolio data yet</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto mb-6">
            Connect at least one exchange or brokerage account to see your real-time portfolio
            breakdown, asset allocation, and performance metrics.
          </p>
          <Link
            href="/dashboard/exchanges"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Link2 size={15} />
            Connect an exchange
          </Link>
        </div>
      ) : (
        <>
          {/* Live / demo notice */}
          {isLive ? (
            <div className="flex items-center gap-2.5 glass rounded-xl px-4 py-3 border border-emerald-500/20 bg-emerald-500/[0.04] mb-6">
              <TrendingUp size={15} className="text-emerald-400 flex-shrink-0" />
              <p className="text-emerald-300 text-xs">
                <span className="font-semibold">Live data —</span> portfolio synced from your Alpaca account.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 glass rounded-xl px-4 py-3 border border-amber-500/20 bg-amber-500/[0.04] mb-6">
              <FlaskConical size={15} className="text-amber-400 flex-shrink-0" />
              <p className="text-amber-300 text-xs">
                <span className="font-semibold">Demo mode —</span> values below are sample data.
                Connect a real Alpaca account to see live holdings.
              </p>
            </div>
          )}

          {/* Total value */}
          <div className="glass rounded-2xl p-6 mb-5">
            <p className="text-slate-400 text-sm mb-1">Total Portfolio Value</p>
            <p className="text-4xl font-bold text-white mb-1">{fmt(totalValue)}</p>
            {isLive && realPortfolio && (
              <span className={`text-sm flex items-center gap-1 ${realPortfolio.dayPl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {realPortfolio.dayPl >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {fmt(Math.abs(realPortfolio.dayPl))} ({fmtPct(realPortfolio.dayPlPct)}) today
              </span>
            )}
            {!isLive && (
              <span className="text-emerald-400 text-sm flex items-center gap-1">
                <TrendingUp size={14} /> +$1,284.20 (2.76%) today
              </span>
            )}
          </div>

          {/* Allocation breakdown */}
          {holdings.length > 0 && (
            <div className="glass rounded-2xl p-6 mb-5">
              <h2 className="text-white font-semibold mb-4">Asset Allocation</h2>
              <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-4">
                {holdings.map((h, i) => {
                  const colors = ["bg-emerald-400", "bg-blue-400", "bg-violet-400", "bg-amber-400", "bg-rose-400"];
                  return (
                    <div
                      key={h.symbol}
                      className={`${colors[i % colors.length]} rounded-full`}
                      style={{ width: `${h.allocation.toFixed(1)}%` }}
                    />
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {holdings.slice(0, 4).map((h, i) => {
                  const colors = ["bg-emerald-400", "bg-blue-400", "bg-violet-400", "bg-amber-400"];
                  return (
                    <div key={h.symbol} className="bg-white/[0.03] rounded-xl p-3">
                      <div className={`w-2 h-2 rounded-full ${colors[i % colors.length]} mb-2`} />
                      <p className="text-white text-sm font-semibold">{fmt(h.value)}</p>
                      <p className="text-slate-500 text-xs">{h.symbol} · {h.allocation.toFixed(1)}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Holdings list */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-5">All Holdings</h2>
            {holdings.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No positions found in your account.</p>
            ) : (
              <div className="space-y-4">
                {holdings.map((h) => (
                  <div key={h.symbol} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{h.symbol.slice(0, 2)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm font-medium">{h.symbol}</span>
                        <span className="text-white text-sm font-medium">{fmt(h.value)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs">{h.name} · {h.exchange}</span>
                        <span className={`text-xs flex items-center gap-0.5 ${h.up ? "text-emerald-400" : "text-rose-400"}`}>
                          {h.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {fmtPct(h.unrealizedPlPct)}
                        </span>
                      </div>
                      <div className="mt-2 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${h.up ? "bg-emerald-400" : "bg-rose-400"}`}
                          style={{ width: `${Math.min(h.allocation, 100).toFixed(1)}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-slate-500 text-xs w-10 text-right">{h.allocation.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
