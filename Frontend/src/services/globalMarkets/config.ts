// ============================================================
// InvestBeans — Config (FIXED)
// KEY FIX 1: Twelve Data uses ^ prefix for indices e.g. ^DJI
// KEY FIX 2: YF_PROXY (allorigins.win) REMOVED
//            allorigins.win was causing Android Chrome to show
//            "wants to connect to devices on local network"
//            permission popup. All Yahoo data now goes through
//            backend proxy at /api/v1/markets/history/:symbol
// ============================================================

export const API_KEYS = {
  twelveData:   (import.meta.env.VITE_TWELVE_DATA_KEY  as string)?.trim(),
  exchangeRate: (import.meta.env.VITE_EXCHANGERATE_KEY as string)?.trim(),
};

export const CACHE_MS = Number(import.meta.env.VITE_CACHE_DURATION) || 900_000;

// ── Twelve Data — CORRECT symbol formats ──────────────────
// Indices MUST use ^ prefix. Without it → 404/empty response.
export const INDEX_CONFIG = {
  us: [
    { symbol: "^DJI",  name: "Dow Jones"  },
    { symbol: "^GSPC", name: "S&P 500"    },
    { symbol: "^IXIC", name: "Nasdaq"     },
  ],
  europe: [
    { symbol: "^FTSE", name: "FTSE 100"   },
    { symbol: "^GDAXI",name: "DAX"        },
    { symbol: "^FCHI", name: "CAC 40"     },
  ],
  asia: [
    { symbol: "^N225", name: "Nikkei 225"        },
    { symbol: "^HSI",  name: "Hang Seng"          },
    { symbol: "^SSEC", name: "Shanghai Composite" },
  ],
};

// All symbols flat for batch call
export const ALL_INDEX_SYMBOLS = [
  ...INDEX_CONFIG.us,
  ...INDEX_CONFIG.europe,
  ...INDEX_CONFIG.asia,
];

// ── Commodities — Twelve Data forex-style pairs ────────────
export const COMMODITY_CONFIG = [
  { symbol: "XAU/USD",  name: "Gold",          unit: "USD/oz"    },
  { symbol: "XAG/USD",  name: "Silver",        unit: "USD/oz"    },
  { symbol: "USOIL",    name: "Crude Oil WTI", unit: "USD/bbl"   },
  { symbol: "UKOIL",    name: "Brent Crude",   unit: "USD/bbl"   },
  { symbol: "XNG/USD",  name: "Natural Gas",   unit: "USD/MMBtu" },
];

// ── Bond yield symbols — Twelve Data supports these ────────
export const YIELD_CONFIG = [
  { symbol: "US10Y", name: "US 10Y" },
  { symbol: "US02Y", name: "US 2Y"  },
  { symbol: "US03MY",name: "US 3M"  },
];

// ── Forex pairs ────────────────────────────────────────────
export const FOREX_PAIRS = [
  { pair: "EUR/USD", base: "EUR", quote: "USD" },
  { pair: "USD/JPY", base: "USD", quote: "JPY" },
  { pair: "GBP/USD", base: "GBP", quote: "USD" },
  { pair: "USD/INR", base: "USD", quote: "INR" },
];

// ── APIs ───────────────────────────────────────────────────
export const TWELVE_BASE       = "https://api.twelvedata.com";
export const EXCHANGERATE_BASE = `https://v6.exchangerate-api.com/v6/${API_KEYS.exchangeRate}`;

// ✅ YF_PROXY REMOVED — allorigins.win triggers Android local network
// permission popup (the "wants to connect to devices" dialog).
// All Yahoo Finance data is now fetched via your own backend:
//   GET /api/v1/markets/history/:symbol?period=1D|1W|1M|3M|1Y
// This is already implemented in marketHistory.routes.js ✓

// ── Market hours (UTC) for status indicator ────────────────
export const MARKET_HOURS_UTC = {
  us:     { open: 13, close: 20 },
  europe: { open: 7,  close: 15 },
  asia:   { open: 0,  close: 6  },
};