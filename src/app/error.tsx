"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050a14] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-rose-400" />
        </div>
        <p className="text-rose-400 text-sm font-semibold uppercase tracking-widest mb-3">
          500
        </p>
        <h1 className="text-3xl font-bold text-white mb-3">Something went wrong</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          An unexpected error occurred. Please try refreshing the page or return home.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-white font-semibold px-5 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <RefreshCw size={15} />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-5 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <Home size={15} />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
