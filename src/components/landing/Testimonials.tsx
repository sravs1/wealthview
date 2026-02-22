"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "I had accounts at Fidelity, Robinhood, and Coinbase. Keeping track of everything was a nightmare. Wealthview made it embarrassingly simple.",
    name: "Marcus T.",
    title: "Software engineer · self-directed investor",
    avatar: "MT",
    color: "bg-emerald-500",
    portfolio: "Growth portfolio · $180K tracked",
  },
  {
    quote:
      "The AI suggestions are genuinely useful. It told me my dividend portfolio had too much telecom concentration and suggested REITs instead. Spot on.",
    name: "Sarah K.",
    title: "Retired teacher · dividend investor",
    avatar: "SK",
    color: "bg-blue-500",
    portfolio: "Dividend portfolio · $420K tracked",
  },
  {
    quote:
      "As someone just starting out, having the AI explain WHY a stock fits my strategy was a game-changer. I finally understand what I own.",
    name: "James L.",
    title: "Recent grad · new investor",
    avatar: "JL",
    color: "bg-violet-500",
    portfolio: "Value portfolio · $12K tracked",
  },
  {
    quote:
      "I manage my family's investments across 6 different accounts. Wealthview replaced my entire spreadsheet system in one afternoon.",
    name: "Priya M.",
    title: "Financial analyst · personal portfolio",
    avatar: "PM",
    color: "bg-amber-500",
    portfolio: "Multi-strategy · $2.1M tracked",
  },
  {
    quote:
      "The real-time sync is shockingly fast. I can watch my crypto and stock positions update simultaneously. Nothing else comes close.",
    name: "David R.",
    title: "Day trader & crypto enthusiast",
    avatar: "DR",
    color: "bg-rose-500",
    portfolio: "Growth + Crypto · $95K tracked",
  },
  {
    quote:
      "Finally connected my E*TRADE and Coinbase in one place. The sector breakdown alone is worth the subscription — I had no idea I was so overweight in tech.",
    name: "Lisa C.",
    title: "Product manager · passive investor",
    avatar: "LC",
    color: "bg-teal-500",
    portfolio: "Mixed portfolio · $240K tracked",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/8 to-transparent pointer-events-none" />

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
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">
              4.9 / 5 from 1,200+ reviews
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Loved by investors everywhere
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From first-time investors to seasoned portfolio managers,
            Wealthview is changing how people track their wealth.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass rounded-2xl p-6 flex flex-col hover:bg-white/[0.06] transition-colors duration-300"
            >
              <Stars />
              <blockquote className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div
                  className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white text-xs font-bold">{t.avatar}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-white text-sm font-medium">{t.name}</div>
                  <div className="text-slate-500 text-xs truncate">{t.title}</div>
                  <div className="text-emerald-500/70 text-xs mt-0.5">{t.portfolio}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
