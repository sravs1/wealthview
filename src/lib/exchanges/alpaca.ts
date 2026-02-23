const BASE_LIVE  = "https://api.alpaca.markets";
const BASE_PAPER = "https://paper-api.alpaca.markets";

// Paper trading keys start with "PK"; live keys start with "AK"
function getBase(apiKey: string) {
  return apiKey.startsWith("PK") ? BASE_PAPER : BASE_LIVE;
}

export type AlpacaPosition = {
  symbol: string;
  name: string;
  qty: number;
  value: number;
  costBasis: number;
  unrealizedPl: number;
  unrealizedPlPct: number;
  up: boolean;
  exchange: "Alpaca";
};

export type AlpacaPortfolio = {
  totalValue: number;
  cashBalance: number;
  dayPl: number;
  dayPlPct: number;
  positions: AlpacaPosition[];
};

export async function fetchAlpacaPortfolio(
  apiKey: string,
  apiSecret: string
): Promise<AlpacaPortfolio> {
  const base = getBase(apiKey);
  const headers = {
    "APCA-API-KEY-ID": apiKey,
    "APCA-API-SECRET-KEY": apiSecret,
  };

  const [accountRes, positionsRes] = await Promise.all([
    fetch(`${base}/v2/account`, { headers, next: { revalidate: 0 } }),
    fetch(`${base}/v2/positions`, { headers, next: { revalidate: 0 } }),
  ]);

  if (!accountRes.ok) {
    const err = await accountRes.json().catch(() => ({}));
    throw new Error(err.message ?? `Alpaca account error ${accountRes.status}`);
  }
  if (!positionsRes.ok) {
    const err = await positionsRes.json().catch(() => ({}));
    throw new Error(err.message ?? `Alpaca positions error ${positionsRes.status}`);
  }

  const account = await accountRes.json();
  const rawPositions = await positionsRes.json();

  const totalValue   = parseFloat(account.portfolio_value ?? "0");
  const lastEquity   = parseFloat(account.last_equity ?? "0");
  const equity       = parseFloat(account.equity ?? "0");
  const dayPl        = equity - lastEquity;
  const dayPlPct     = lastEquity > 0 ? (dayPl / lastEquity) * 100 : 0;

  const positions: AlpacaPosition[] = (rawPositions as Record<string, string>[]).map((p) => {
    const value          = parseFloat(p.market_value ?? "0");
    const costBasis      = parseFloat(p.cost_basis ?? "0");
    const unrealizedPl   = parseFloat(p.unrealized_pl ?? "0");
    const unrealizedPlPct = parseFloat(p.unrealized_plpc ?? "0") * 100;
    return {
      symbol: p.symbol,
      name: p.symbol,
      qty: parseFloat(p.qty ?? "0"),
      value,
      costBasis,
      unrealizedPl,
      unrealizedPlPct,
      up: unrealizedPl >= 0,
      exchange: "Alpaca" as const,
    };
  });

  return { totalValue, cashBalance: parseFloat(account.cash ?? "0"), dayPl, dayPlPct, positions };
}
