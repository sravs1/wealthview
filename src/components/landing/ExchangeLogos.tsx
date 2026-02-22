"use client";

import { motion } from "framer-motion";

const exchanges = [
  { name: "Fidelity",             color: "text-green-400" },
  { name: "Robinhood",            color: "text-emerald-400" },
  { name: "Coinbase",             color: "text-blue-400" },
  { name: "Charles Schwab",       color: "text-blue-300" },
  { name: "E*TRADE",              color: "text-purple-400" },
  { name: "Interactive Brokers",  color: "text-red-400" },
  { name: "Webull",               color: "text-teal-400" },
  { name: "Alpaca",               color: "text-yellow-400" },
  { name: "Crypto.com",           color: "text-indigo-400" },
  { name: "Binance",              color: "text-yellow-300" },
  { name: "Kraken",               color: "text-violet-400" },
  { name: "Gemini",               color: "text-cyan-400" },
];

function LogoStrip({ reversed = false }: { reversed?: boolean }) {
  const items = [...exchanges, ...exchanges]; // duplicate for seamless loop
  return (
    <div className="overflow-hidden py-3">
      <div className={`flex gap-6 w-max ${reversed ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {items.map((ex, i) => (
          <div
            key={i}
            className="flex-shrink-0 glass rounded-xl px-5 py-2.5 flex items-center gap-2"
          >
            <div className={`w-2 h-2 rounded-full ${ex.color.replace("text-", "bg-")} opacity-80`} />
            <span className="text-slate-300 text-sm font-medium whitespace-nowrap">{ex.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ExchangeLogos() {
  return (
    <section className="py-16 relative overflow-hidden border-y border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 text-sm uppercase tracking-widest"
        >
          Connects securely to 15+ brokerages &amp; exchanges
        </motion.p>
      </div>

      {/* Left/right fades */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#050a14] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#050a14] to-transparent pointer-events-none" />
        <LogoStrip />
        <LogoStrip reversed />
      </div>
    </section>
  );
}
