"use client";

import { motion } from "framer-motion";
import { Link2, BarChart3, Sparkles } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Link2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    glow: "rgba(16, 185, 129, 0.2)",
    title: "Connect your accounts",
    desc: "Securely link Fidelity, Robinhood, Coinbase, and more with one click through Plaid's bank-grade authentication. Read-only access, always.",
    detail: "Takes less than 2 minutes",
  },
  {
    num: "02",
    icon: BarChart3,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    glow: "rgba(59, 130, 246, 0.2)",
    title: "See everything in one place",
    desc: "Your unified dashboard shows real-time values, performance, allocation breakdown, and historical returns across every account.",
    detail: "Updates every 30 seconds",
  },
  {
    num: "03",
    icon: Sparkles,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    glow: "rgba(139, 92, 246, 0.2)",
    title: "Get AI-powered suggestions",
    desc: "Tell Wealthview your strategy — growth, value, or dividend — and our AI surfaces stocks that fit, with plain-English explanations for every pick.",
    detail: "Not financial advice · For reference only",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-violet-400 text-sm font-medium">Simple setup</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Up and running in minutes
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            No CSV exports, no manual data entry, no spreadsheets.
            Just connect and go.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-10 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px bg-gradient-to-r from-emerald-400/30 via-blue-400/30 to-violet-400/30" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative"
              >
                {/* Step card */}
                <div className="glass rounded-2xl p-8 h-full hover:bg-white/[0.06] transition-colors duration-300">
                  {/* Icon + number */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl ${step.bg} flex items-center justify-center`}
                      style={{ boxShadow: `0 0 20px ${step.glow}` }}
                    >
                      <Icon className={`w-6 h-6 ${step.color}`} />
                    </div>
                    <span className="text-5xl font-bold text-white/[0.06] font-mono">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-white font-semibold text-xl mb-3">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{step.desc}</p>
                  <div className={`text-xs ${step.color} opacity-70`}>{step.detail}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
