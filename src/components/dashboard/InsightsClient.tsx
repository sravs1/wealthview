"use client";

import { useState } from "react";
import {
  Zap,
  TrendingUp,
  PieChart,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Sparkles,
} from "lucide-react";

type InsightType = "risk" | "diversification" | "performance" | "recommendation";
type Severity = "positive" | "warning" | "neutral";

type Insight = {
  type: InsightType;
  title: string;
  summary: string;
  detail: string;
  severity: Severity;
};

type InsightsResult = {
  summary: string;
  insights: Insight[];
  isLive: boolean;
  generatedAt: string;
};

const TYPE_CONFIG: Record<
  InsightType,
  { icon: React.ElementType; label: string; color: string; bg: string; border: string }
> = {
  risk: {
    icon: AlertTriangle,
    label: "Risk",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  diversification: {
    icon: PieChart,
    label: "Diversification",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  performance: {
    icon: TrendingUp,
    label: "Performance",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  recommendation: {
    icon: Lightbulb,
    label: "Recommendation",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
};

const SEVERITY_COLOR: Record<Severity, string> = {
  positive: "text-emerald-400",
  warning: "text-amber-400",
  neutral: "text-slate-400",
};

export default function InsightsClient({ hasExchanges }: { hasExchanges: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<InsightsResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setState("loading");
    setError(null);
    try {
      const res = await fetch("/api/insights/generate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setState("error");
        return;
      }
      setResult(data);
      setState("done");
    } catch {
      setError("Network error. Please try again.");
      setState("error");
    }
  };

  if (state === "idle") {
    return (
      <div className="glass rounded-2xl p-12 text-center border border-white/[0.05]">
        <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Sparkles size={28} className="text-violet-400" />
        </div>
        <h2 className="text-white font-semibold text-xl mb-2">Ready to analyse your portfolio</h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto mb-6">
          {hasExchanges
            ? "Click below to get AI-powered insights on your portfolio — risk, diversification, performance, and recommendations."
            : "Load the demo portfolio to see AI insights in action, or connect a real exchange first."}
        </p>
        <button
          onClick={generate}
          className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        >
          <Zap size={15} />
          Generate AI Insights
        </button>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="space-y-4">
        <div className="glass rounded-2xl p-6 animate-pulse">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-white/[0.06] rounded-full" />
            <div className="w-20 h-3 bg-white/[0.06] rounded" />
          </div>
          <div className="space-y-2">
            <div className="w-full h-3 bg-white/[0.06] rounded" />
            <div className="w-3/4 h-3 bg-white/[0.06] rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-white/[0.04] rounded-xl flex-shrink-0" />
                <div className="space-y-1.5">
                  <div className="w-20 h-2 bg-white/[0.04] rounded" />
                  <div className="w-28 h-3 bg-white/[0.06] rounded" />
                </div>
              </div>
              <div className="w-full h-3 bg-white/[0.04] rounded mb-3" />
              <div className="space-y-1.5">
                <div className="w-full h-2 bg-white/[0.04] rounded" />
                <div className="w-full h-2 bg-white/[0.04] rounded" />
                <div className="w-2/3 h-2 bg-white/[0.04] rounded" />
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-500 text-xs pt-1">Analysing your portfolio with AI…</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="glass rounded-2xl p-12 text-center border border-rose-500/20">
        <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-rose-400" />
        </div>
        <p className="text-white font-medium mb-1">Analysis failed</p>
        <p className="text-rose-400 text-sm mb-6">{error}</p>
        <button
          onClick={generate}
          className="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      </div>
    );
  }

  // done
  return (
    <div className="space-y-4">
      {/* AI Summary card */}
      <div className="glass rounded-2xl p-6 border border-violet-500/15 bg-violet-500/[0.03]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-violet-400" />
            <span className="text-violet-300 text-xs font-semibold uppercase tracking-wider">
              AI Summary
            </span>
            {result?.isLive && (
              <span className="text-emerald-400 text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Live data
              </span>
            )}
            {!result?.isLive && (
              <span className="text-amber-400 text-[10px] bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                Demo data
              </span>
            )}
          </div>
          <button
            onClick={generate}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs transition-colors focus:outline-none"
            title="Regenerate insights"
          >
            <RefreshCw size={11} />
            Regenerate
          </button>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{result?.summary}</p>
        {result?.generatedAt && (
          <p className="text-slate-600 text-[10px] mt-2">
            Generated at {new Date(result.generatedAt).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result?.insights.map((insight, i) => {
          const config = TYPE_CONFIG[insight.type] ?? TYPE_CONFIG.recommendation;
          const Icon = config.icon;
          return (
            <div key={i} className={`glass rounded-2xl p-5 border ${config.border}`}>
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={`w-9 h-9 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}
                >
                  <Icon size={16} className={config.color} />
                </div>
                <div className="min-w-0">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider ${config.color}`}
                  >
                    {config.label}
                  </span>
                  <h3 className="text-white text-sm font-semibold leading-snug">{insight.title}</h3>
                </div>
              </div>
              <p className={`text-sm font-medium mb-2 ${SEVERITY_COLOR[insight.severity] ?? "text-slate-400"}`}>
                {insight.summary}
              </p>
              <p className="text-slate-500 text-xs leading-relaxed">{insight.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
