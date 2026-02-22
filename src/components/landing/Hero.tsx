"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Lock, Zap, TrendingUp, TrendingDown } from "lucide-react";

/* ── Mini sparkline chart using SVG ── */
function Sparkline({ positive = true }: { positive?: boolean }) {
  const path = positive
    ? "M0,40 C20,35 30,28 50,22 C70,16 80,18 100,10 C120,4 130,8 150,5 C170,2 180,0 200,0"
    : "M0,5 C20,8 30,12 50,18 C70,24 80,20 100,28 C120,34 130,30 150,38 C170,44 180,40 200,40";
  return (
    <svg viewBox="0 0 200 45" className="w-full h-10" preserveAspectRatio="none">
      <defs>
        <linearGradient id={positive ? "grad-up" : "grad-down"} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={positive ? "#10b981" : "#f43f5e"} stopOpacity="0.3" />
          <stop offset="100%" stopColor={positive ? "#10b981" : "#f43f5e"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={path + " L200,45 L0,45 Z"}
        fill={`url(#${positive ? "grad-up" : "grad-down"})`}
      />
      <path
        d={path}
        fill="none"
        stroke={positive ? "#10b981" : "#f43f5e"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Animated portfolio value ── */
function PortfolioDashboard() {
  const holdings = [
    { symbol: "AAPL", name: "Apple Inc.", value: "$31,242", change: "+2.4%", up: true, pct: 67 },
    { symbol: "BTC",  name: "Bitcoin",   value: "$18,921", change: "-0.8%", up: false, pct: 40 },
    { symbol: "MSFT", name: "Microsoft", value: "$14,832", change: "+1.2%", up: true, pct: 53 },
    { symbol: "ETH",  name: "Ethereum",  value: "$9,140",  change: "+3.1%", up: true, pct: 30 },
  ];

  return (
    <div className="relative w-full max-w-[520px]">
      {/* Glow behind card */}
      <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-3xl" />
      <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full" />

      {/* Main portfolio card */}
      <motion.div
        className="animate-float glass rounded-2xl p-6 relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-slate-400 text-xs font-medium">Total Portfolio Value</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            <span className="text-emerald-400 text-xs">Live</span>
          </div>
        </div>

        <div className="text-3xl font-bold text-white tracking-tight mb-0.5">$124,532.40</div>
        <div className="flex items-center gap-1.5 mb-4">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-medium">+$2,341.20 (1.91%) today</span>
        </div>

        {/* Sparkline */}
        <div className="mb-5">
          <Sparkline positive={true} />
        </div>

        {/* Asset breakdown */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: "Stocks", value: "$84,231", pct: "67.6%", color: "bg-emerald-400" },
            { label: "Crypto", value: "$28,742", pct: "23.1%", color: "bg-blue-400" },
            { label: "ETFs",   value: "$11,559", pct: "9.3%",  color: "bg-violet-400" },
          ].map((item) => (
            <div key={item.label} className="bg-white/[0.04] rounded-xl p-3">
              <div className={`w-2 h-2 rounded-full ${item.color} mb-2`} />
              <div className="text-white text-sm font-semibold">{item.value}</div>
              <div className="text-slate-500 text-xs">{item.label}</div>
              <div className="text-slate-400 text-xs mt-0.5">{item.pct}</div>
            </div>
          ))}
        </div>

        {/* Holdings list */}
        <div className="space-y-2.5">
          <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">Top Holdings</div>
          {holdings.map((h) => (
            <div key={h.symbol} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-bold">{h.symbol.slice(0,2)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-white text-xs font-medium">{h.symbol}</span>
                  <span className="text-white text-xs font-medium">{h.value}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <div className="w-24 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${h.up ? "bg-emerald-400" : "bg-rose-400"}`}
                      style={{ width: `${h.pct}%` }}
                    />
                  </div>
                  <span className={`text-xs ${h.up ? "text-emerald-400" : "text-rose-400"}`}>
                    {h.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating AI suggestion card */}
      <motion.div
        className="glass rounded-xl p-3.5 absolute -bottom-12 -left-10 w-56"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div>
            <div className="text-white text-xs font-medium mb-0.5">AI Suggestion</div>
            <div className="text-slate-400 text-[11px] leading-relaxed">
              Add $VYM to boost dividend yield by 0.8%
            </div>
          </div>
        </div>
      </motion.div>

      {/* Connected exchanges badge */}
      <motion.div
        className="glass rounded-xl p-3 absolute -top-6 -right-6 flex items-center gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <div className="flex -space-x-1.5">
          {["F","R","C","S"].map((l, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border border-white/10 flex items-center justify-center"
            >
              <span className="text-white text-[9px] font-bold">{l}</span>
            </div>
          ))}
        </div>
        <span className="text-white text-xs font-medium">4 connected</span>
      </motion.div>
    </div>
  );
}

/* ── Hero section ── */
export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-grid">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/8 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-violet-500/6 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left: copy */}
        <div>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">Now in public beta</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6"
          >
            Your entire wealth,{" "}
            <span className="gradient-text">intelligently</span>{" "}
            unified.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg"
          >
            Connect Fidelity, Robinhood, Coinbase and 15+ more exchanges.
            Get real-time portfolio updates and AI-powered suggestions tailored
            to your investment strategy — growth, value, or dividend.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <a
              href="#"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] text-white font-medium px-6 py-3.5 rounded-xl transition-all duration-200"
            >
              See how it works
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            {[
              { icon: Shield, label: "Bank-level security" },
              { icon: Lock, label: "256-bit encryption" },
              { icon: Zap, label: "Real-time sync" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-slate-500 text-sm">
                <Icon className="w-3.5 h-3.5 text-slate-600" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex justify-center lg:justify-end"
        >
          <PortfolioDashboard />
        </motion.div>
      </div>
    </section>
  );
}
