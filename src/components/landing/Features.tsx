"use client";

import { motion } from "framer-motion";
import {
  RefreshCw, Brain, LayoutDashboard, PieChart,
  Bell, ShieldCheck, LineChart, Sparkles,
} from "lucide-react";

const features = [
  {
    icon: RefreshCw,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    title: "Real-time sync",
    desc: "Portfolio values update every 30 seconds across all connected accounts. Never miss a market move.",
  },
  {
    icon: Brain,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    title: "AI-powered analysis",
    desc: "Claude analyzes your holdings and explains risks, opportunities, and sector concentration in plain English.",
  },
  {
    icon: LayoutDashboard,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    title: "Unified dashboard",
    desc: "One view for all your stocks, ETFs, crypto, and cash. No more juggling between 5 different apps.",
  },
  {
    icon: PieChart,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    title: "Portfolio strategies",
    desc: "Get stock suggestions tuned to your style — growth, value, or dividend — with AI-generated rationale.",
  },
  {
    icon: Bell,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20",
    title: "Smart alerts",
    desc: "Set price targets, rebalancing thresholds, or dividend payment notifications. Stay informed, not overwhelmed.",
  },
  {
    icon: ShieldCheck,
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "border-teal-400/20",
    title: "Bank-level security",
    desc: "Read-only access via Plaid. We never store your credentials, ever. SOC 2 compliant infrastructure.",
  },
  {
    icon: LineChart,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
    title: "Performance tracking",
    desc: "Track returns vs S&P 500, NASDAQ, and custom benchmarks. See exactly how your strategy is performing.",
  },
  {
    icon: Sparkles,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
    title: "Tax insights",
    desc: "Identify tax-loss harvesting opportunities and see your unrealized gains before year-end.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section id="features" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-blue-400 text-sm font-medium">Everything you need</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Built for serious investors
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From beginners learning the ropes to portfolio managers tracking
            millions — Wealthview has the tools for every stage.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={item}
                className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-colors duration-300 group"
              >
                <div className={`w-10 h-10 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
