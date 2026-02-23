import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BarChart2, Link2, TrendingUp, TrendingDown, FlaskConical } from "lucide-react";

const MOCK_HOLDINGS = [
  { symbol: "BTC",  name: "Bitcoin",        value: 18421.00, change: +3.2,  up: true,  exchange: "Coinbase", allocation: 38.5 },
  { symbol: "AAPL", name: "Apple Inc.",     value: 12350.00, change: +0.4,  up: true,  exchange: "Alpaca",   allocation: 25.8 },
  { symbol: "ETH",  name: "Ethereum",       value: 9840.00,  change: +1.8,  up: true,  exchange: "Coinbase", allocation: 20.6 },
  { symbol: "SOL",  name: "Solana",         value: 7221.50,  change: -0.9,  up: false, exchange: "Binance",  allocation: 15.1 },
];

const MOCK_ALLOCATION = [
  { label: "Crypto",  value: "$35,482.50", pct: "74.2%", color: "bg-emerald-400" },
  { label: "Stocks",  value: "$12,350.00", pct: "25.8%", color: "bg-blue-400" },
];

const MOCK_TOTAL = 47832.50;

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function PortfolioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  const { data: exchanges } = await supabase
    .from("connected_exchanges")
    .select("exchange_name, exchange_slug")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const hasExchanges = exchanges && exchanges.length > 0;

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
          {/* Demo notice */}
          <div className="flex items-center gap-2.5 glass rounded-xl px-4 py-3 border border-amber-500/20 bg-amber-500/[0.04] mb-6">
            <FlaskConical size={15} className="text-amber-400 flex-shrink-0" />
            <p className="text-amber-300 text-xs">
              <span className="font-semibold">Demo mode —</span> values below are sample data.
              Live sync with exchange APIs is coming soon.
            </p>
          </div>

          {/* Total value */}
          <div className="glass rounded-2xl p-6 mb-5">
            <p className="text-slate-400 text-sm mb-1">Total Portfolio Value</p>
            <p className="text-4xl font-bold text-white mb-1">{fmt(MOCK_TOTAL)}</p>
            <span className="text-emerald-400 text-sm flex items-center gap-1">
              <TrendingUp size={14} /> +$1,284.20 (2.76%) today
            </span>
          </div>

          {/* Allocation breakdown */}
          <div className="glass rounded-2xl p-6 mb-5">
            <h2 className="text-white font-semibold mb-4">Asset Allocation</h2>
            <div className="flex gap-2 h-3 rounded-full overflow-hidden mb-4">
              <div className="bg-emerald-400 rounded-full" style={{ width: "74.2%" }} />
              <div className="bg-blue-400 rounded-full flex-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MOCK_ALLOCATION.map((a) => (
                <div key={a.label} className="bg-white/[0.03] rounded-xl p-3">
                  <div className={`w-2 h-2 rounded-full ${a.color} mb-2`} />
                  <p className="text-white text-sm font-semibold">{a.value}</p>
                  <p className="text-slate-500 text-xs">{a.label} · {a.pct}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Holdings list */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-5">All Holdings</h2>
            <div className="space-y-4">
              {MOCK_HOLDINGS.map((h) => (
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
                        {h.up ? "+" : ""}{h.change}%
                      </span>
                    </div>
                    {/* Allocation bar */}
                    <div className="mt-2 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${h.up ? "bg-emerald-400" : "bg-rose-400"}`}
                        style={{ width: `${h.allocation}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-slate-500 text-xs w-10 text-right">{h.allocation}%</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
