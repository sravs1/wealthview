"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Menu, X } from "lucide-react";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Portfolio types", href: "#portfolio-types" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050a14]/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Wealth<span className="text-emerald-400">view</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/auth/signin"
            className="text-slate-400 hover:text-white text-sm transition-colors px-4 py-2"
          >
            Sign in
          </a>
          <a
            href="/auth/signup"
            className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors duration-200"
          >
            Get started free
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-slate-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#050a14]/95 backdrop-blur-xl border-b border-white/[0.06] px-6 pb-6"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-slate-400 hover:text-white py-3 text-sm transition-colors border-b border-white/[0.04] last:border-0"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/auth/signup"
              className="mt-4 block w-full text-center bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium px-5 py-3 rounded-lg transition-colors"
            >
              Get started free
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
