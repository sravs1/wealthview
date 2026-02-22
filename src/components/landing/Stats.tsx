"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 2.4,  suffix: "B+", prefix: "$", label: "Assets tracked",    desc: "Across all connected accounts" },
  { value: 50,   suffix: "K+", prefix: "",  label: "Active investors",  desc: "And growing every day" },
  { value: 15,   suffix: "+",  prefix: "",  label: "Exchanges connected", desc: "Stocks, ETFs & crypto" },
  { value: 99.8, suffix: "%",  prefix: "",  label: "Uptime",            desc: "Enterprise-grade reliability" },
];

function Counter({ target, prefix, suffix }: { target: number; prefix: string; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  const display = Number.isInteger(target)
    ? Math.round(count).toLocaleString()
    : count.toFixed(1);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/20 via-transparent to-blue-950/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="glass rounded-3xl p-12 glow-emerald">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold gradient-text-green mb-1">
                  <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="text-white font-medium mb-1">{s.label}</div>
                <div className="text-slate-500 text-sm">{s.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
