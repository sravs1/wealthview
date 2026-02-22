"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle, MessageSquare, Mail, BookOpen,
  ChevronDown, ExternalLink, Headphones,
} from "lucide-react";

const faqs = [
  {
    q: "Is my financial data safe?",
    a: "Absolutely. We connect via Plaid, the same technology used by Venmo, Betterment, and thousands of other apps. We only request read-only access — we can never move money or make trades. Your credentials are never stored on our servers.",
  },
  {
    q: "Which brokerages and exchanges are supported?",
    a: "We currently support Fidelity, Robinhood, Coinbase, Charles Schwab, E*TRADE, Interactive Brokers, Webull, Alpaca, Crypto.com, Binance, Kraken, Gemini, and more. We're adding new connections every month.",
  },
  {
    q: "How often does my portfolio update?",
    a: "During market hours, your stock and ETF positions update every 30 seconds. Crypto positions update in real time. Outside of market hours, positions reflect the last closing price.",
  },
  {
    q: "Are the AI stock suggestions actual financial advice?",
    a: "No — and we're very clear about that. Wealthview's AI suggestions are for informational and educational purposes only. Always do your own research and consult a licensed financial advisor before making investment decisions.",
  },
  {
    q: "Can I use Wealthview for free?",
    a: "Yes! Our free plan lets you connect one account and access the core dashboard. Upgrade to Pro to connect unlimited accounts, unlock AI suggestions, real-time sync, and advanced analytics.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "You can delete your account and all associated data at any time from your settings page. We comply fully with GDPR and CCPA data deletion requests.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.06] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-white font-medium text-sm group-hover:text-emerald-400 transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-slate-400 text-sm leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const channels = [
  {
    icon: MessageSquare,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    title: "Live chat",
    desc: "Chat with our support team right in the app. Average response time: under 3 minutes.",
    cta: "Start a chat",
  },
  {
    icon: Mail,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    title: "Email support",
    desc: "Send us a detailed question and we'll respond within one business day.",
    cta: "support@wealthview.app",
    href: "mailto:support@wealthview.app",
  },
  {
    icon: BookOpen,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    title: "Help center",
    desc: "Browse 200+ step-by-step guides, tutorials, and troubleshooting articles.",
    cta: "Browse articles",
  },
];

export default function Help() {
  return (
    <section id="help" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/8 to-transparent pointer-events-none" />

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
            <Headphones className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">We&apos;re here to help</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Help &amp; support
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Have a question? We&apos;ve got answers. Reach out anytime — our team
            is available 7 days a week.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: FAQ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-slate-400" />
              <h3 className="text-white font-semibold text-lg">Frequently asked questions</h3>
            </div>
            <div className="glass rounded-2xl px-6">
              {faqs.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </motion.div>

          {/* Right: Contact channels */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-white font-semibold text-lg mb-6">Contact us</h3>
            {channels.map((ch) => {
              const Icon = ch.icon;
              return (
                <div
                  key={ch.title}
                  className="glass rounded-2xl p-6 hover:bg-white/[0.06] transition-colors duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${ch.bg} border ${ch.border} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-5 h-5 ${ch.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium mb-1">{ch.title}</div>
                      <div className="text-slate-400 text-sm mb-3">{ch.desc}</div>
                      {ch.href ? (
                        <a
                          href={ch.href}
                          className={`inline-flex items-center gap-1.5 text-sm font-medium ${ch.color} hover:opacity-80 transition-opacity`}
                        >
                          {ch.cta}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <button
                          className={`inline-flex items-center gap-1.5 text-sm font-medium ${ch.color} hover:opacity-80 transition-opacity`}
                        >
                          {ch.cta}
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Response time badge */}
            <div className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <div>
                <div className="text-white text-sm font-medium">All systems operational</div>
                <div className="text-slate-500 text-xs">
                  Average response time today: <span className="text-emerald-400">2m 14s</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
