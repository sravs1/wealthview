"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const perks = [
  "Free forever on 1 account",
  "No credit card required",
  "Setup in under 2 minutes",
];

export default function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire up to your waitlist/auth flow
    setSubmitted(true);
  };

  return (
    <section className="py-28 relative overflow-hidden">
      {/* Background glow blob */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">
              Join 50,000+ investors
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-5 tracking-tight leading-[1.1]">
            Take control of your{" "}
            <span className="gradient-text">financial future</span>{" "}
            today.
          </h2>

          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Connect all your accounts, track your portfolio in real time,
            and get AI-powered guidance — all in one place. Start free.
          </p>

          {/* Email form */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-8 py-5"
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div className="text-left">
                <div className="text-white font-semibold">You&apos;re on the list!</div>
                <div className="text-slate-400 text-sm">We&apos;ll be in touch very soon.</div>
              </div>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white/[0.06] border border-white/[0.10] rounded-xl px-5 py-3.5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.08] transition-all"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] whitespace-nowrap"
              >
                Get started free
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Perks */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-1.5 text-slate-500 text-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {perk}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
