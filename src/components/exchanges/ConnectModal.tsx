"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, Eye, EyeOff, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";

export type Exchange = {
  slug: string;
  name: string;
  category: "crypto" | "brokerage";
  connectionType: "api_key" | "oauth" | "coming_soon";
  hasPassphrase?: boolean;
  color: string;
  docsUrl?: string;
};

type Props = {
  exchange: Exchange;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ConnectModal({ exchange, onClose, onSuccess }: Props) {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [apiPassphrase, setApiPassphrase] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "success">("form");

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim() || !apiSecret.trim()) {
      setError("API Key and Secret are required.");
      return;
    }
    if (exchange.hasPassphrase && !apiPassphrase.trim()) {
      setError("API Passphrase is required for this exchange.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/exchanges/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exchangeSlug: exchange.slug,
        exchangeName: exchange.name,
        connectionType: "api_key",
        apiKey: apiKey.trim(),
        apiSecret: apiSecret.trim(),
        apiPassphrase: apiPassphrase.trim() || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to connect. Please check your credentials.");
      setLoading(false);
    } else {
      setStep("success");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md glass rounded-2xl border border-white/[0.10] shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{ background: `${exchange.color}20`, color: exchange.color }}
              >
                {exchange.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-white font-semibold">Connect {exchange.name}</h2>
                <p className="text-slate-500 text-xs">API Key connection</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>

          {step === "success" ? (
            <div className="p-8 text-center">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">Connected!</h3>
              <p className="text-slate-400 text-sm">
                {exchange.name} has been linked to your account.
              </p>
            </div>
          ) : (
            <form onSubmit={handleConnect} className="p-6 space-y-4">
              {/* Info banner */}
              <div className="bg-blue-500/[0.08] border border-blue-500/20 rounded-xl p-3.5 flex items-start gap-2.5">
                <Key size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-blue-300 text-xs leading-relaxed">
                  Create a <strong>read-only</strong> API key in your {exchange.name} account.
                  Never grant withdrawal permissions to third-party apps.
                  {exchange.docsUrl && (
                    <>
                      {" "}
                      <a
                        href={exchange.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-200 inline-flex items-center gap-0.5"
                      >
                        View guide <ExternalLink size={10} />
                      </a>
                    </>
                  )}
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                  <AlertCircle size={14} className="text-rose-400 flex-shrink-0" />
                  <p className="text-rose-400 text-sm">{error}</p>
                </div>
              )}

              {/* API Key */}
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">API Key</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your API key here"
                  required
                  autoComplete="off"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all font-mono"
                />
              </div>

              {/* API Secret */}
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">API Secret</label>
                <div className="relative">
                  <input
                    type={showSecret ? "text" : "password"}
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                    placeholder="Paste your API secret here"
                    required
                    autoComplete="off"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 pr-12 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Passphrase (KuCoin etc.) */}
              {exchange.hasPassphrase && (
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">API Passphrase</label>
                  <input
                    type="password"
                    value={apiPassphrase}
                    onChange={(e) => setApiPassphrase(e.target.value)}
                    placeholder="Your API passphrase"
                    autoComplete="off"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all font-mono"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] mt-2"
              >
                {loading ? "Connecting…" : `Connect ${exchange.name}`}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
