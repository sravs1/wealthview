"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function DashboardHeader({ user }: { user: SupabaseUser }) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="h-16 border-b border-white/[0.05] flex items-center justify-between px-6 bg-[#050a14]/80 backdrop-blur-xl flex-shrink-0">
      {/* Left slot — page title comes from children or can be dynamic */}
      <div />

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-all">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 text-xs font-bold">{initials}</span>
            </div>
            <span className="text-white text-sm font-medium hidden sm:block max-w-[120px] truncate">
              {displayName}
            </span>
            <ChevronDown
              size={14}
              className={`text-slate-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 glass rounded-xl border border-white/[0.08] py-1.5 z-50 shadow-xl shadow-black/40">
              <div className="px-4 py-2.5 border-b border-white/[0.06]">
                <p className="text-white text-sm font-medium truncate">{displayName}</p>
                <p className="text-slate-500 text-xs truncate">{user.email}</p>
              </div>
              <Link
                href="/dashboard/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-white/[0.04] text-sm transition-colors"
              >
                <User size={14} />
                Profile
              </Link>
              <Link
                href="/dashboard/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-white/[0.04] text-sm transition-colors"
              >
                <Settings size={14} />
                Settings
              </Link>
              <div className="border-t border-white/[0.06] mt-1 pt-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/[0.06] text-sm transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
