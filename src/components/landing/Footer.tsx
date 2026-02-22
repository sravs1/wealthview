"use client";

import { motion } from "framer-motion";
import { TrendingUp, Twitter, Github, Linkedin } from "lucide-react";

const links = {
  Product: [
    { label: "Features",        href: "#features" },
    { label: "How it works",    href: "#how-it-works" },
    { label: "Portfolio types", href: "#portfolio-types" },
    { label: "Pricing",         href: "#pricing" },
    { label: "Changelog",       href: "#" },
  ],
  Company: [
    { label: "About",    href: "#" },
    { label: "Blog",     href: "#" },
    { label: "Careers",  href: "#" },
    { label: "Press",    href: "#" },
    { label: "Contact",  href: "#help" },
  ],
  Support: [
    { label: "Help center",     href: "#help" },
    { label: "Documentation",   href: "#" },
    { label: "Status",          href: "#" },
    { label: "Community",       href: "#" },
    { label: "API reference",   href: "#" },
  ],
  Legal: [
    { label: "Privacy policy",    href: "#" },
    { label: "Terms of service",  href: "#" },
    { label: "Cookie policy",     href: "#" },
    { label: "Disclosures",       href: "#" },
  ],
};

const socials = [
  { icon: Twitter,  label: "Twitter",  href: "#" },
  { icon: Github,   label: "GitHub",   href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-16">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-2 md:col-span-3 lg:col-span-2"
          >
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">
                Wealth<span className="text-emerald-400">view</span>
              </span>
            </a>

            <p className="text-slate-500 text-sm leading-relaxed mb-5 max-w-xs">
              The intelligent portfolio tracker that connects all your
              brokerages, exchanges, and crypto wallets in one unified view.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <div className="text-white text-sm font-semibold mb-4">{category}</div>
              <ul className="space-y-3">
                {items.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} Wealthview, Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-600 text-xs">All systems operational</span>
          </div>

          <p className="text-slate-700 text-xs text-center sm:text-right max-w-xs">
            Not financial advice. Investment suggestions are for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
