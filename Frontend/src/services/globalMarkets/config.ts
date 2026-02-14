// ============================================================
// InvestBeans — Config (FINAL)
// KEY FIX: Twelve Data uses ^ prefix for indices e.g. ^DJI
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
  
  // Yahoo Finance via allorigins.win — free CORS proxy, no key needed
  // Used ONLY for VIX (^VIX not in Twelve Data free tier)
  export const YF_PROXY = (symbol: string) =>
    `https://api.allorigins.win/raw?url=${encodeURIComponent(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`
    )}`;
  
  // ── Market hours (UTC) for status indicator ────────────────
  export const MARKET_HOURS_UTC = {
    us:     { open: 13, close: 20 },
    europe: { open: 7,  close: 15 },
    asia:   { open: 0,  close: 6  },
  };