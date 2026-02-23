"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function BillingActions({
  plan,
  highlighted,
}: {
  plan: string;
  highlighted: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) {
      router.push(data.url);
    } else {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 ${
        highlighted
          ? "bg-emerald-500 hover:bg-emerald-400 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          : "bg-white/[0.06] hover:bg-white/[0.10] text-white border border-white/[0.08]"
      }`}
    >
      {loading ? "Redirecting…" : "Upgrade now"}
      {!loading && <ArrowRight size={14} />}
    </button>
  );
}
