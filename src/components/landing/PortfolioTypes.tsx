"use client";

import { motion } from "framer-motion";
import {
  TrendingUp, Scale, DollarSign, Zap, Layers,
  ArrowRight, Target,
} from "lucide-react";

const types = [
  {
    icon: TrendingUp,
    label: "Growth",
    tagline: "High conviction, high upside",
    keyFocus: "High earnings potential",
    color: "text-emerald-400",
    border: "border-emerald-400/30",
    bg: "bg-emerald-400/5",
    focusBg: "bg-emerald-400/8",
    glow: "rgba(16,185,129,0.15)",
    badge: "bg-emerald-400/15 text-emerald-300",
    picks: ["NVDA", "META", "TSLA", "AMZN", "GOOGL"],
    picksLabel: "Sample stocks",
    desc: "For investors seeking long-term capital appreciation. Targets companies with accelerating revenue, expanding margins, and large addressable markets.",
    target: "12–18% annually",
    horizon: "5–10+ year horizon",
    risk: "High",
    riskColor: "text-rose-400",
  },
  {
    icon: Scale,
    label: "Value",
    tagline: "Buy good companies cheap",
    keyFocus: "Buying quality at a discount",
    color: "text-blue-400",
    border: "border-blue-400/30",
    bg: "bg-blue-400/5",
    focusBg: "bg-blue-400/8",
    glow: "rgba(59,130,246,0.15)",
    badge: "bg-blue-400/15 text-blue-300",
    picks: ["BRK.B", "JPM", "JNJ", "BAC", "WMT"],
    picksLabel: "Sample stocks",
    desc: "Classic Buffett-style investing. Find solid businesses trading below their intrinsic value and hold until the market recognizes their worth.",
    target: "8–12% annually",
    horizon: "3–7 year horizon",
    risk: "Moderate",
    riskColor: "text-amber-400",
    featured: true,
  },
  {
    icon: DollarSign,
    label: "Dividend",
    tagline: "Earn while you sleep",
    keyFocus: "Current cashflow & income",
    color: "text-amber-400",
    border: "border-amber-400/30",
    bg: "bg-amber-400/5",
    focusBg: "bg-amber-400/8",
    glow: "rgba(251,191,36,0.15)",
    badge: "bg-amber-400/15 text-amber-300",
    picks: ["VYM", "O", "KO", "T", "ABBV"],
    picksLabel: "Sample stocks",
    desc: "Build a reliable passive income stream with high-quality dividend payers. Reinvest dividends to supercharge long-term compounding and income growth.",
    target: "3.5–6% yield + growth",
    horizon: "Long-term, income-focused",
    risk: "Low–Moderate",
    riskColor: "text-emerald-400",
  },
  {
    icon: Zap,
    label: "Momentum",
    tagline: "Ride the winners, cut the losers",
    keyFocus: "Following upward price trends",
    color: "text-rose-400",
    border: "border-rose-400/30",
    bg: "bg-rose-400/5",
    focusBg: "bg-rose-400/8",
    glow: "rgba(244,63,94,0.15)",
    badge: "bg-rose-400/15 text-rose-300",
    picks: ["MTUM", "CRWD", "AXON", "CELH", "ASML"],
    picksLabel: "Sample picks",
    desc: "Systematically buy stocks in strong uptrends and exit when momentum fades. Based on the research-backed principle that recent winners tend to keep winning — until they don't.",
    target: "12–22% (variable)",
    horizon: "3–12 month cycles",
    risk: "High",
    riskColor: "text-rose-400",
  },
  {
    icon: Layers,
    label: "Index",
    tagline: "Simple, diversified, low-cost",
    keyFocus: "Matching market returns",
    color: "text-cyan-400",
    border: "border-cyan-400/30",
    bg: "bg-cyan-400/5",
    focusBg: "bg-cyan-400/8",
    glow: "rgba(34,211,238,0.15)",
    badge: "bg-cyan-400/15 text-cyan-300",
    picks: ["SPY", "QQQ", "VTI", "VXUS", "BND"],
    picksLabel: "Sample ETFs",
    desc: "Capture the full return of the market with near-zero fees. Proven to beat most actively managed funds over the long run — the strategy of choice for Buffett's estate.",
    target: "7–10% annually",
    horizon: "10+ year horizon",
    risk: "Low–Moderate",
    riskColor: "text-emerald-400",
  },
];

function TypeCard({ type, i }: { type: typeof types[0]; i: number }) {
  const Icon = type.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: i * 0.1, duration: 0.55 }}
      className="relative h-full"
    >
      {/* "Most popular" badge */}
      {type.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
          <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            Most popular
          </span>
        </div>
      )}

      <div
        className={`glass rounded-2xl p-6 h-full flex flex-col transition-all duration-300
          hover:bg-white/[0.07] border ${type.border}
          ${type.featured ? "ring-1 ring-blue-400/20" : ""}`}
        style={{ boxShadow: type.featured ? `0 0 40px ${type.glow}` : undefined }}
      >
        {/* Icon + name */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-11 h-11 rounded-xl ${type.bg} border ${type.border} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${type.color}`} />
          </div>
          <div>
            <div className="text-white font-bold text-lg leading-tight">{type.label}</div>
            <div className="text-slate-500 text-xs">{type.tagline}</div>
          </div>
        </div>

        {/* Key focus — the new highlighted row */}
        <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${type.focusBg} border ${type.border} mb-4`}>
          <Target className={`w-3.5 h-3.5 ${type.color} flex-shrink-0`} />
          <div className="text-xs">
            <span className="text-slate-500">Key focus: </span>
            <span className={`font-semibold ${type.color}`}>{type.keyFocus}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1">{type.desc}</p>

        {/* Picks */}
        <div className="mb-5">
          <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">
            {type.picksLabel}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {type.picks.map((s) => (
              <span
                key={s}
                className={`text-xs font-mono px-2.5 py-1 rounded-lg ${type.badge}`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5 pb-5 border-b border-white/[0.06]">
          <div>
            <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Return</div>
            <div className="text-white text-xs font-semibold">{type.target}</div>
          </div>
          <div>
            <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Horizon</div>
            <div className="text-white text-xs font-semibold">{type.horizon}</div>
          </div>
          <div>
            <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Risk</div>
            <div className={`text-xs font-semibold ${type.riskColor}`}>{type.risk}</div>
          </div>
        </div>

        {/* CTA */}
        <button
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
            ${type.bg} border ${type.border} ${type.color}
            text-sm font-medium hover:brightness-125 transition-all duration-200`}
        >
          Explore {type.label}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export default function PortfolioTypes() {
  return (
    <section id="portfolio-types" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/8 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-amber-400 text-sm font-medium">AI-powered strategies</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Invest your way
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Tell Wealthview your strategy and our AI surfaces the right stocks.
            Every suggestion comes with a plain-English explanation of why it fits your goals.
          </p>
        </motion.div>

        {/* Row 1 — Growth · Value · Dividend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {types.slice(0, 3).map((type, i) => (
            <TypeCard key={type.label} type={type} i={i} />
          ))}
        </div>

        {/* Row 2 — Momentum · Index  (2 cards, centered at ⅔ width) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:max-w-[66.8%] md:mx-auto">
          {types.slice(3).map((type, i) => (
            <TypeCard key={type.label} type={type} i={i + 3} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-slate-600 text-xs mt-10"
        >
          All suggestions are for informational purposes only. Not financial advice.
        </motion.p>
      </div>
    </section>
  );
}
