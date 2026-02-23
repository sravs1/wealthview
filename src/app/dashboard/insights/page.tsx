import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Zap, Link2 } from "lucide-react";

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">AI Insights</h1>
        <p className="text-slate-400 text-sm">Personalised suggestions powered by AI.</p>
      </div>

      <div className="glass rounded-2xl p-12 text-center border border-white/[0.05]">
        <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Zap size={28} className="text-violet-400" />
        </div>
        <h2 className="text-white font-semibold text-xl mb-2">AI Insights coming soon</h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto mb-6">
          Once you connect your exchanges, our AI will analyse your portfolio and provide tailored
          suggestions for growth, income, and risk management.
        </p>
        <Link
          href="/dashboard/exchanges"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
        >
          <Link2 size={15} />
          Connect exchanges first
        </Link>
      </div>
    </div>
  );
}
