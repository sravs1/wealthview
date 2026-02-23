import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BarChart2, Link2 } from "lucide-react";

export default async function PortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  const { data: exchanges } = await supabase
    .from("connected_exchanges")
    .select("*")
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
        <div className="glass rounded-2xl p-6">
          <p className="text-slate-400 text-sm">
            Portfolio sync is in progress. Data will appear here once your first sync completes.
          </p>
          <ul className="mt-4 space-y-2">
            {exchanges.map((ex) => (
              <li key={ex.id} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-300 text-sm">{ex.exchange_name}</span>
                <span className="text-slate-600 text-xs ml-auto">Syncing…</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
