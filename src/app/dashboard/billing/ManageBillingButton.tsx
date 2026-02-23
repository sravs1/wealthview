"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";

export default function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePortal = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      router.push(data.url);
    } else {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePortal}
      disabled={loading}
      className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 flex-shrink-0"
    >
      <ExternalLink size={14} />
      {loading ? "Opening…" : "Manage Subscription"}
    </button>
  );
}
