"use client";

import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import type { Exchange } from "./ConnectModal";

type Props = {
  exchange: Exchange;
  connected: boolean;
  onConnect: (exchange: Exchange) => void;
  onDisconnect: (slug: string) => void;
  disconnecting: boolean;
};

export default function ExchangeCard({
  exchange,
  connected,
  onConnect,
  onDisconnect,
  disconnecting,
}: Props) {
  const isComingSoon = exchange.connectionType === "coming_soon";

  return (
    <div
      className={`glass rounded-2xl p-5 border transition-all duration-200 ${
        connected
          ? "border-emerald-500/25 bg-emerald-500/[0.03]"
          : isComingSoon
          ? "border-white/[0.04] opacity-60"
          : "border-white/[0.06] hover:border-white/[0.12]"
      }`}
    >
      {/* Exchange identity */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{ background: `${exchange.color}20`, color: exchange.color }}
        >
          {exchange.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-white font-medium text-sm truncate">{exchange.name}</p>
          <p className="text-slate-500 text-xs capitalize">
            {exchange.category === "crypto" ? "Crypto exchange" : "Brokerage"}
          </p>
        </div>
        {connected && (
          <CheckCircle size={16} className="text-emerald-400 ml-auto flex-shrink-0" />
        )}
        {isComingSoon && (
          <Clock size={16} className="text-slate-600 ml-auto flex-shrink-0" />
        )}
      </div>

      {/* Status badge */}
      <div className="mb-4">
        {connected ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Connected
          </span>
        ) : isComingSoon ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-white/[0.04] px-2.5 py-1 rounded-full">
            <Clock size={10} />
            Coming soon
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-white/[0.04] px-2.5 py-1 rounded-full">
            <AlertCircle size={10} />
            Not connected
          </span>
        )}
      </div>

      {/* Action */}
      {connected ? (
        <button
          onClick={() => onDisconnect(exchange.slug)}
          disabled={disconnecting}
          className="w-full text-center py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 bg-white/[0.03] hover:bg-rose-500/[0.06] border border-white/[0.06] hover:border-rose-500/20 transition-all disabled:opacity-50"
        >
          {disconnecting ? "Disconnecting…" : "Disconnect"}
        </button>
      ) : isComingSoon ? (
        <button
          disabled
          className="w-full text-center py-2 rounded-xl text-xs font-medium text-slate-600 bg-white/[0.02] border border-white/[0.04] cursor-not-allowed"
        >
          Coming soon
        </button>
      ) : (
        <button
          onClick={() => onConnect(exchange)}
          className="w-full text-center py-2 rounded-xl text-xs font-medium text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/30 transition-all"
        >
          Connect
        </button>
      )}
    </div>
  );
}
