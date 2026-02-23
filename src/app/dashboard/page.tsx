import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Link2,
  Zap,
  ArrowRight,
  BarChart2,
  DollarSign,
  FlaskConical,
} from "lucide-react";
import { fetchAlpacaPortfolio } from "@/lib/exchanges/alpaca";

const MOCK_HOLDINGS = [
  { symbol: "BTC",  name: "Bitcoin",     value: 18421.00, change: +3.2,  up: true,  exchange: "Coinbase" },
  { symbol: "AAPL", name: "Apple Inc.",  value: 12350.00, change: +0.4,  up: true,  exchange: "Alpaca" },
  { symbol: "ETH",  name: "Ethereum",    value: 9840.00,  change: +1.8,  up: true,  exchange: "Coinbase" },
  { symbol: "SOL",  name: "Solana",      value: 7221.50,  change: -0.9,  up: false, exchange: "Binance" },
];
const MOCK_TOTAL      = 47832.50;
const MOCK_CHANGE     = +1284.20;
const MOCK_CHANGE_PCT = +2.76;

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function fmtPct(n: number) {
  return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  const { data: exchanges } = await supabase
    .from("connected_exchanges")
    .select("exchange_name, exchange_slug, api_key, api_secret")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const hasExchanges = exchanges && exchanges.length > 0;

  const displayName =
    user.user_metadata?.full_name?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "there";

  // Attempt real Alpaca data
  const alpacaRow = exchanges?.find(
    (e) => e.exchange_slug === "alpaca" && e.api_key && !e.api_key.startsWith("demo-key")
  );

  let realPortfolio: { totalValue: number; dayPl: number; dayPlPct: number; positions: { symbol: string; name: string; value: number; unrealizedPlPct: number; up: boolean; exchange: string }[] } | null = null;

  if (alpacaRow?.api_key && alpacaRow?.api_secret) {
    try {
      realPortfolio = await fetchAlpacaPortfolio(alpacaRow.api_key, alpacaRow.api_secret);
    } catch {
      // fall through to mock
    }
  }

  const isLive = realPortfolio !== null;

  const totalValue  = isLive ? realPortfolio!.totalValue  : MOCK_TOTAL;
  const dayPl       = isLive ? realPortfolio!.dayPl       : MOCK_CHANGE;
  const dayPlPct    = isLive ? realPortfolio!.dayPlPct    : MOCK_CHANGE_PCT;
  const topHoldings = isLive
    ? realPortfolio!.positions.slice(0, 4).map((p) => ({
        symbol: p.symbol,
        name: p.name,
        value: p.value,
        change: p.unrealizedPlPct,
        up: p.up,
        exchange: p.exchange,
      }))
    : MOCK_HOLDINGS;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Good morning, {displayName} 👋
        </h1>
        <p className="text-slate-400 text-sm">
          Here&apos;s an overview of your portfolio today.
        </p>
      </div>

      {hasExchanges ? (
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
                <span className="font-semibold">Demo mode —</span> portfolio values below are sample data.
                Connect a real Alpaca account to see live data.
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <div className="glass rounded-2xl p-5">
              <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-3">
                <DollarSign size={18} className="text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-0.5">{fmt(totalValue)}</p>
              <p className="text-slate-500 text-xs">Total Portfolio Value</p>
              <p className={`text-xs mt-1 flex items-center gap-1 ${dayPl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {dayPl >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {dayPl >= 0 ? "+" : ""}{fmt(Math.abs(dayPl))} ({fmtPct(dayPlPct)}) today
              </p>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-3">
                <TrendingUp size={18} className="text-emerald-400" />
              </div>
              <p className={`text-2xl font-bold mb-0.5 ${dayPl >= 0 ? "text-white" : "text-rose-400"}`}>
                {dayPl >= 0 ? "+" : ""}{fmt(Math.abs(dayPl))}
              </p>
              <p className="text-slate-500 text-xs">Today&apos;s Change</p>
              <p className={`text-xs mt-1 ${dayPl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{fmtPct(dayPlPct)}</p>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="w-9 h-9 bg-violet-500/10 rounded-xl flex items-center justify-center mb-3">
                <Link2 size={18} className="text-violet-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-0.5">{exchanges!.length}</p>
              <p className="text-slate-500 text-xs">Connected Exchanges</p>
              <p className="text-slate-600 text-xs mt-1">{exchanges!.map(e => e.exchange_name).join(", ")}</p>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center mb-3">
                <Zap size={18} className="text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-0.5">3</p>
              <p className="text-slate-500 text-xs">AI Insights Ready</p>
              <Link href="/dashboard/insights" className="text-amber-400 text-xs mt-1 flex items-center gap-1 hover:text-amber-300 transition-colors">
                View insights <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          {/* Top holdings */}
          <div className="glass rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Top Holdings</h2>
              <Link href="/dashboard/portfolio" className="text-emerald-400 hover:text-emerald-300 text-xs transition-colors flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {topHoldings.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No positions found.</p>
            ) : (
              <div className="space-y-3">
                {topHoldings.map((h) => (
                  <div key={h.symbol} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[11px] font-bold">{h.symbol.slice(0, 2)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium">{h.symbol}</span>
                        <span className="text-white text-sm font-medium">{fmt(h.value)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-slate-500 text-xs">{h.name} · {h.exchange}</span>
                        <span className={`text-xs flex items-center gap-0.5 ${h.up ? "text-emerald-400" : "text-rose-400"}`}>
                          {h.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {fmtPct(h.change)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/portfolio" className="glass rounded-2xl p-5 border border-blue-500/20 hover:bg-white/[0.06] transition-all group">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <BarChart2 size={20} className="text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">Full Portfolio View</h3>
              <p className="text-slate-500 text-sm mb-4">See all holdings and allocation breakdown.</p>
              <span className="text-blue-400 text-xs flex items-center gap-1 font-medium">
                Open portfolio <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
            <Link href="/dashboard/insights" className="glass rounded-2xl p-5 border border-violet-500/20 hover:bg-white/[0.06] transition-all group">
              <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center mb-4">
                <Zap size={20} className="text-violet-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">AI Insights</h3>
              <p className="text-slate-500 text-sm mb-4">Get personalised suggestions for your portfolio.</p>
              <span className="text-violet-400 text-xs flex items-center gap-1 font-medium">
                View insights <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>
        </>
      ) : (
        <>
          {/* Stats — empty state */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Portfolio Value", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Today's Change",        icon: TrendingUp,  color: "text-blue-400",   bg: "bg-blue-500/10" },
              { label: "Connected Exchanges",   icon: Link2,       color: "text-violet-400", bg: "bg-violet-500/10" },
              { label: "AI Insights",           icon: Zap,         color: "text-amber-400",  bg: "bg-amber-500/10" },
            ].map(({ label, icon: Icon, color, bg }) => (
              <div key={label} className="glass rounded-2xl p-5">
                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={18} className={color} />
                </div>
                <p className="text-2xl font-bold text-white mb-0.5">—</p>
                <p className="text-slate-500 text-xs">{label}</p>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-6 border border-emerald-500/15 bg-emerald-500/[0.03]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp size={20} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Start by connecting an exchange</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Connect your Coinbase, Binance, Kraken, or other accounts to see your real portfolio
                  value, holdings, and get AI-powered insights.
                </p>
                <Link
                  href="/dashboard/exchanges"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <Link2 size={15} />
                  Connect an exchange
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
