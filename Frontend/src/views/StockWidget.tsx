// src/views/StockWidget.tsx
// NSE stocks → Kite Connect (/api/v1/kite/markets/history/:symbol)
// US  stocks → Yahoo Finance (/api/v1/markets/history/:symbol)
// Chart rendered by CleanChart (lightweight-charts candlestick)

import { useEffect, useState } from "react";
import { useTheme } from "@/controllers/Themecontext";
import CleanChart from "@/components/CleanChart";
import { Loader2, AlertCircle } from "lucide-react";

interface StockWidgetProps {
  symbol: string;
  market: "NSE" | "US";
}

interface CandlePoint {
  x: number;
  y: [number, number, number, number]; // [open, high, low, close]
}

interface StockMeta {
  price:         number;
  previousClose: number;
  high:          number;
  low:           number;
  currency?:     string;
}

// Symbol → Yahoo Finance ticker mapping for US stocks
const US_YAHOO_MAP: Record<string, string> = {
  AAPL:  "AAPL",
  TSLA:  "TSLA",
  MSFT:  "MSFT",
  GOOGL: "GOOGL",
  AMZN:  "AMZN",
  NVDA:  "NVDA",
  META:  "META",
};

// NSE symbol → display name
const NSE_NAMES: Record<string, string> = {
  RELIANCE:   "Reliance Industries",
  TCS:        "Tata Consultancy Services",
  HDFCBANK:   "HDFC Bank",
  INFY:       "Infosys",
  ICICIBANK:  "ICICI Bank",
  WIPRO:      "Wipro",
  HINDUNILVR: "HUL",
  ITC:        "ITC Ltd",
};

const US_NAMES: Record<string, string> = {
  AAPL:  "Apple Inc.",
  TSLA:  "Tesla Inc.",
  MSFT:  "Microsoft Corp.",
  GOOGL: "Alphabet Inc.",
  AMZN:  "Amazon.com Inc.",
  NVDA:  "NVIDIA Corp.",
  META:  "Meta Platforms",
};

const BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000/api/v1";
const ROOT = BASE.replace(/\/api\/v1\/?$/, "");

const StockWidget: React.FC<StockWidgetProps> = ({ symbol, market }) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [candles, setCandles] = useState<CandlePoint[]>([]);
  const [meta,    setMeta]    = useState<StockMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let url: string;

        if (market === "NSE") {
          // Kite Connect — NSE stocks via our backend
          url = `${ROOT}/api/v1/kite/markets/history/${encodeURIComponent(symbol)}?period=1D`;
        } else {
          // Yahoo Finance proxy — US stocks
          const yahooSym = US_YAHOO_MAP[symbol] ?? symbol;
          url = `${ROOT}/api/v1/markets/history/${encodeURIComponent(yahooSym)}?period=1D`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (cancelled) return;

        const c: CandlePoint[] = data.candles ?? [];
        if (c.length === 0) throw new Error("No candles returned");

        setCandles(c);

        // Build meta from candles if API doesn't return it
        const closes   = c.map(k => k.y[3]);
        const highs    = c.map(k => k.y[1]);
        const lows     = c.map(k => k.y[2]);
        const lastClose = closes[closes.length - 1];
        const prevClose = data.meta?.previousClose ?? closes[0];

        setMeta({
          price:         data.meta?.price ?? lastClose,
          previousClose: prevClose,
          high:          data.meta?.high  ?? Math.max(...highs),
          low:           data.meta?.low   ?? Math.min(...lows),
          currency:      data.meta?.currency,
        });

      } catch (err: any) {
        if (!cancelled) setError(err.message ?? "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    // Refresh every 15 min
    const id = setInterval(load, 15 * 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, [symbol, market]);

  const displayName = market === "NSE"
    ? (NSE_NAMES[symbol] ?? symbol)
    : (US_NAMES[symbol]  ?? symbol);

  const price         = meta?.price         ?? 0;
  const previousClose = meta?.previousClose ?? price;
  const change        = price - previousClose;
  const changePct     = previousClose !== 0 ? (change / previousClose) * 100 : 0;
  const high          = meta?.high ?? price;
  const low           = meta?.low  ?? price;
  const isPositive    = change >= 0;

  // ── Loading state ───────────────────────────────────────────────
  if (loading && candles.length === 0) {
    return (
      <div className={`rounded-2xl border p-6 flex items-center justify-center min-h-[320px] ${
        isLight ? "bg-white border-slate-200" : "bg-[#0e2038] border-white/8"
      }`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#5194F6]" />
          <p className={`text-sm font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            Loading {symbol}…
          </p>
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────
  if (error && candles.length === 0) {
    return (
      <div className={`rounded-2xl border p-6 flex items-center justify-center min-h-[320px] ${
        isLight ? "bg-white border-slate-200" : "bg-[#0e2038] border-white/8"
      }`}>
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-3 text-red-400" />
          <p className={`text-sm font-semibold mb-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
            {symbol} data unavailable
          </p>
          <p className="text-xs text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  // ── Chart via CleanChart ────────────────────────────────────────
  // Pass historyUrl so CleanChart fetches correct endpoint for ALL periods (1D/1W/1M/3M/1Y)
  const historyUrl = market === "NSE"
    ? `${ROOT}/api/v1/kite/markets/history/${encodeURIComponent(symbol)}`
    : `${ROOT}/api/v1/markets/history/${encodeURIComponent(US_YAHOO_MAP[symbol] ?? symbol)}`;

  return (
    <CleanChart
      name={`${displayName} · ${market}`}
      symbol={market === "NSE" ? symbol : (US_YAHOO_MAP[symbol] ?? symbol)}
      price={price}
      change={change}
      changePercent={changePct}
      high={high}
      low={low}
      isPositive={isPositive}
      candles={candles}
      historyUrl={historyUrl}
    />
  );
};

export default StockWidget;