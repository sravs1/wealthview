import Link from "next/link";
import { TrendingUp, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050a14] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <TrendingUp size={32} className="text-emerald-400" />
        </div>
        <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">
          404
        </p>
        <h1 className="text-3xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>
    </div>
  );
}
