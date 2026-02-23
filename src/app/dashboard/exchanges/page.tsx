"use client";

import { useState, useEffect, useCallback } from "react";
import { Link2, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ExchangeCard from "@/components/exchanges/ExchangeCard";
import ConnectModal, { type Exchange } from "@/components/exchanges/ConnectModal";

const ALL_EXCHANGES: Exchange[] = [
  // ── Crypto ─────────────────────────────────────────────────────────
  {
    slug: "coinbase",
    name: "Coinbase",
    category: "crypto",
    connectionType: "api_key",
    color: "#0052FF",
    docsUrl: "https://docs.cdp.coinbase.com/advanced-trade/docs/auth",
  },
  {
    slug: "binance",
    name: "Binance",
    category: "crypto",
    connectionType: "api_key",
    color: "#F3BA2F",
    docsUrl: "https://www.binance.com/en/support/faq/how-to-create-api-360002502072",
  },
  {
    slug: "kraken",
    name: "Kraken",
    category: "crypto",
    connectionType: "api_key",
    color: "#5741D9",
    docsUrl: "https://support.kraken.com/hc/en-us/articles/360000919966",
  },
  {
    slug: "kucoin",
    name: "KuCoin",
    category: "crypto",
    connectionType: "api_key",
    hasPassphrase: true,
    color: "#00A478",
    docsUrl: "https://www.kucoin.com/account/api",
  },
  {
    slug: "bybit",
    name: "Bybit",
    category: "crypto",
    connectionType: "api_key",
    color: "#F7A600",
    docsUrl: "https://www.bybit.com/app/user/api-management",
  },
  {
    slug: "gemini",
    name: "Gemini",
    category: "crypto",
    connectionType: "api_key",
    color: "#00DCFA",
    docsUrl: "https://docs.gemini.com/rest-api/#private-api-invocation",
  },
  {
    slug: "crypto_com",
    name: "Crypto.com",
    category: "crypto",
    connectionType: "api_key",
    color: "#002D74",
    docsUrl: "https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html",
  },
  // ── Brokerages ─────────────────────────────────────────────────────
  {
    slug: "alpaca",
    name: "Alpaca",
    category: "brokerage",
    connectionType: "api_key",
    color: "#FFCD33",
    docsUrl: "https://alpaca.markets/learn/authentication-with-oauth/",
  },
  {
    slug: "interactive_brokers",
    name: "Interactive Brokers",
    category: "brokerage",
    connectionType: "coming_soon",
    color: "#E8242D",
  },
  {
    slug: "schwab",
    name: "Charles Schwab",
    category: "brokerage",
    connectionType: "coming_soon",
    color: "#00A0DC",
  },
  {
    slug: "etrade",
    name: "E*TRADE",
    category: "brokerage",
    connectionType: "coming_soon",
    color: "#562C82",
  },
  {
    slug: "robinhood",
    name: "Robinhood",
    category: "brokerage",
    connectionType: "coming_soon",
    color: "#00C805",
  },
  {
    slug: "fidelity",
    name: "Fidelity",
    category: "brokerage",
    connectionType: "coming_soon",
    color: "#006940",
  },
  {
    slug: "webull",
    name: "Webull",
    category: "brokerage",
    connectionType: "coming_soon",
    color: "#00BCEC",
  },
];

export default function ExchangesPage() {
  const [connectedSlugs, setConnectedSlugs] = useState<Set<string>>(new Set());
  const [loadingExchanges, setLoadingExchanges] = useState(true);
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const fetchConnected = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("connected_exchanges")
      .select("exchange_slug")
      .eq("is_active", true);
    setConnectedSlugs(new Set((data ?? []).map((r: { exchange_slug: string }) => r.exchange_slug)));
    setLoadingExchanges(false);
  }, []);

  useEffect(() => {
    fetchConnected();
  }, [fetchConnected]);

  const handleDisconnect = async (slug: string) => {
    setDisconnecting(slug);
    const res = await fetch("/api/exchanges/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exchangeSlug: slug }),
    });
    if (res.ok) {
      setConnectedSlugs((prev) => {
        const next = new Set(prev);
        next.delete(slug);
        return next;
      });
    }
    setDisconnecting(null);
  };

  const cryptoExchanges = ALL_EXCHANGES.filter((e) => e.category === "crypto");
  const brokerageExchanges = ALL_EXCHANGES.filter((e) => e.category === "brokerage");
  const connectedCount = connectedSlugs.size;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Exchanges</h1>
          <p className="text-slate-400 text-sm">
            Connect your crypto exchanges and brokerage accounts.
            {connectedCount > 0 && (
              <span className="ml-2 text-emerald-400 font-medium">
                {connectedCount} connected
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchConnected}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] px-4 py-2 rounded-xl transition-all"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Security notice */}
      <div className="glass rounded-2xl p-4 border border-blue-500/15 bg-blue-500/[0.03] mb-8 flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Link2 size={15} className="text-blue-400" />
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          <span className="text-white font-medium">Read-only access only.</span>{" "}
          Wealthview only requests portfolio read permissions. We never ask for withdrawal or trading
          permissions. Your funds are always safe.
        </p>
      </div>

      {/* Crypto Exchanges */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Crypto Exchanges
        </h2>
        {loadingExchanges ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5 animate-pulse h-[168px]">
                <div className="w-11 h-11 bg-white/[0.04] rounded-xl mb-4" />
                <div className="w-24 h-3 bg-white/[0.04] rounded mb-2" />
                <div className="w-16 h-2 bg-white/[0.04] rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cryptoExchanges.map((exchange) => (
              <ExchangeCard
                key={exchange.slug}
                exchange={exchange}
                connected={connectedSlugs.has(exchange.slug)}
                onConnect={setSelectedExchange}
                onDisconnect={handleDisconnect}
                disconnecting={disconnecting === exchange.slug}
              />
            ))}
          </div>
        )}
      </section>

      {/* Brokerage Accounts */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Brokerage Accounts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {brokerageExchanges.map((exchange) => (
            <ExchangeCard
              key={exchange.slug}
              exchange={exchange}
              connected={connectedSlugs.has(exchange.slug)}
              onConnect={setSelectedExchange}
              onDisconnect={handleDisconnect}
              disconnecting={disconnecting === exchange.slug}
            />
          ))}
        </div>
      </section>

      {/* Connect modal */}
      {selectedExchange && (
        <ConnectModal
          exchange={selectedExchange}
          onClose={() => setSelectedExchange(null)}
          onSuccess={() => {
            setConnectedSlugs((prev) => new Set([...prev, selectedExchange.slug]));
            setSelectedExchange(null);
          }}
        />
      )}
    </div>
  );
}
