"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical } from "lucide-react";

export default function DemoSeedButton() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSeed = async () => {
    setLoading(true);
    const res = await fetch("/api/demo/seed", { method: "POST" });
    if (res.ok) {
      setDone(true);
      setTimeout(() => {
        router.refresh();
      }, 800);
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
        <FlaskConical size={14} />
        Demo data loaded! Refreshing…
      </div>
    );
  }

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-300 text-sm font-medium px-4 py-2 rounded-xl transition-all disabled:opacity-50"
    >
      <FlaskConical size={14} />
      {loading ? "Loading…" : "Load Demo Data"}
    </button>
  );
}
