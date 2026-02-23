"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  TrendingUp,
  LayoutDashboard,
  PieChart,
  Link2,
  Zap,
  Settings,
  LogOut,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: PieChart },
  { label: "Exchanges", href: "/dashboard/exchanges", icon: Link2 },
  { label: "AI Insights", href: "/dashboard/insights", icon: Zap },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const TIER_STYLES = {
  free:       { label: "Free",       color: "text-slate-400",   bg: "bg-slate-500/10" },
  pro:        { label: "Pro",        color: "text-emerald-400", bg: "bg-emerald-500/15" },
  enterprise: { label: "Enterprise", color: "text-violet-400",  bg: "bg-violet-500/15" },
};

type Tier = "free" | "pro" | "enterprise";

export default function Sidebar({ tier = "free" }: { tier?: Tier }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const tierStyle = TIER_STYLES[tier] ?? TIER_STYLES.free;

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside
      className={`relative flex flex-col h-screen sticky top-0 transition-all duration-300 ${
        collapsed ? "w-[70px]" : "w-[240px]"
      } bg-[#070d1a] border-r border-white/[0.05] flex-shrink-0`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.05] flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <span className="text-white font-semibold text-base tracking-tight truncate">
              Wealth<span className="text-emerald-400">view</span>
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group ${
                active
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Icon
                className={`flex-shrink-0 ${
                  active ? "text-emerald-400" : "text-slate-500 group-hover:text-white"
                }`}
                size={18}
              />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Tier badge + Sign out */}
      <div className="py-3 px-2 border-t border-white/[0.05] space-y-2">
        {/* Subscription tier */}
        {!collapsed && (
          <Link
            href="/dashboard/billing"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl ${tierStyle.bg} transition-all hover:opacity-80`}
          >
            <Crown size={14} className={tierStyle.color} />
            <span className={`text-xs font-semibold ${tierStyle.color}`}>
              {tierStyle.label} Plan
            </span>
            {tier === "free" && (
              <span className="ml-auto text-[10px] text-slate-500 hover:text-slate-400">
                Upgrade →
              </span>
            )}
          </Link>
        )}

        <button
          onClick={handleSignOut}
          disabled={signingOut}
          title={collapsed ? "Sign out" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/[0.06] transition-all duration-150"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>{signingOut ? "Signing out…" : "Sign out"}</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#0d1526] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
