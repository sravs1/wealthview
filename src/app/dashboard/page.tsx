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
} from "lucide-react";

async function getConnectedExchangesCount(userId: string) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("connected_exchanges")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_active", true);
  return count ?? 0;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const exchangeCount = await getConnectedExchangesCount(user.id);

  const displayName =
    user.user_metadata?.full_name?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "there";

  const stats = [
    {
      label: "Total Portfolio Value",
      value: exchangeCount > 0 ? "$0.00" : "—",
      sub: exchangeCount > 0 ? "Connect exchanges to sync" : "Connect an exchange to start",
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Today's Change",
      value: "—",
      sub: "No data yet",
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Connected Exchanges",
      value: String(exchangeCount),
      sub: exchangeCount === 0 ? "None connected yet" : `${exchangeCount} active`,
      icon: Link2,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "AI Insights",
      value: "—",
      sub: "Connect portfolio first",
      icon: Zap,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  const quickActions = [
    {
      title: "Connect an Exchange",
      description: "Link your crypto & brokerage accounts to start tracking.",
      href: "/dashboard/exchanges",
      icon: Link2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "View Portfolio",
      description: "See your full asset allocation across all connected accounts.",
      href: "/dashboard/portfolio",
      icon: BarChart2,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "AI Insights",
      description: "Get personalised suggestions tailored to your strategy.",
      href: "/dashboard/insights",
      icon: Zap,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
  ];

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

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
            <p className="text-slate-500 text-xs">{label}</p>
            <p className="text-slate-600 text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map(({ title, description, href, icon: Icon, color, bg, border }) => (
            <Link
              key={href}
              href={href}
              className={`glass rounded-2xl p-5 border ${border} hover:bg-white/[0.06] transition-all duration-200 group`}
            >
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon size={20} className={color} />
              </div>
              <h3 className="text-white font-semibold mb-1.5">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{description}</p>
              <div className={`flex items-center gap-1.5 text-xs font-medium ${color}`}>
                Get started
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Empty state notice */}
      {exchangeCount === 0 && (
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
      )}
    </div>
  );
}
