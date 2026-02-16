// ============================================================
// InvestBeans — Global Markets Routes (Real 15-min candles)
// ============================================================

import express from "express";
const router = express.Router();
const EXCHANGERATE_KEY = process.env.EXCHANGERATE_KEY;

// ── Cache ──────────────────────────────────────────────────
let _cache = null;
let _cacheTs = 0;
const CACHE_TTL = 5 * 60 * 1000;

// ── Yahoo Finance helpers ──────────────────────────────────
const YF_HOSTS = [
  "https://query1.finance.yahoo.com",
  "https://query2.finance.yahoo.com",
];
let yfHostIdx = 0;

const YF_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Origin": "https://finance.yahoo.com",
  "Referer": "https://finance.yahoo.com/",
  "Cache-Control": "no-cache",
};

// Fetch quote + real 15-min intraday candles for today
async function yahooQuote(symbol) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const host = YF_HOSTS[(yfHostIdx + attempt) % YF_HOSTS.length];
    // interval=15m&range=1d → today's 15-min OHLC bars (real data)
    const url = `${host}/v8/finance/chart/${encodeURIComponent(symbol)}?interval=15m&range=1d`;

    try {
      const res = await fetch(url, { headers: YF_HEADERS });

      if (res.status === 429) {
        console.warn(`[Yahoo] 429 on ${host} for ${symbol}`);
        await new Promise(r => setTimeout(r, 500));
        continue;
      }
      if (!res.ok) throw new Error(`Yahoo ${symbol} → ${res.status}`);

      const json   = await res.json();
      const result = json?.chart?.result?.[0];
      const meta   = result?.meta;
      if (!meta?.regularMarketPrice) return null;

      yfHostIdx = (yfHostIdx + 1) % YF_HOSTS.length;

      const price         = meta.regularMarketPrice;
      const prev          = meta.chartPreviousClose ?? meta.previousClose ?? price;
      const change        = parseFloat((price - prev).toFixed(2));
      const changePercent = prev ? parseFloat(((change / prev) * 100).toFixed(2)) : 0;

      // Parse real intraday 15-min OHLC candles
      const timestamps = result?.timestamp || [];
      const q          = result?.indicators?.quote?.[0] || {};
      const candles = timestamps
        .map((ts, i) => {
          const o = q.open?.[i], h = q.high?.[i], l = q.low?.[i], c = q.close?.[i];
          if (o == null || h == null || l == null || c == null) return null;
          return {
            x: ts * 1000,
            y: [
              parseFloat(o.toFixed(2)),
              parseFloat(h.toFixed(2)),
              parseFloat(l.toFixed(2)),
              parseFloat(c.toFixed(2)),
            ],
          };
        })
        .filter(Boolean);

      return {
        price, change, changePercent,
        high:    meta.regularMarketDayHigh ?? price,
        low:     meta.regularMarketDayLow  ?? price,
        candles, // real 15-min OHLC — sent to frontend
      };
    } catch (e) {
      console.error(`[Yahoo] ${symbol} attempt ${attempt + 1} failed:`, e.message);
      if (attempt === 1) return null;
    }
  }
  return null;
}

// ── Configs ────────────────────────────────────────────────
const INDEX_SYMBOLS = {
  us:     [{ symbol: "^DJI", name: "Dow Jones" }, { symbol: "^GSPC", name: "S&P 500" }, { symbol: "^IXIC", name: "Nasdaq" }],
  europe: [{ symbol: "^FTSE", name: "FTSE 100" }, { symbol: "^GDAXI", name: "DAX" }, { symbol: "^FCHI", name: "CAC 40" }],
  asia:   [{ symbol: "^N225", name: "Nikkei 225" }, { symbol: "^HSI", name: "Hang Seng" }, { symbol: "^SSEC", name: "Shanghai Composite" }],
};

const COMMODITY_CONFIG = [
  { symbol: "GC=F",  name: "Gold",          unit: "USD/oz"    },
  { symbol: "SI=F",  name: "Silver",        unit: "USD/oz"    },
  { symbol: "CL=F",  name: "Crude Oil WTI", unit: "USD/bbl"   },
  { symbol: "BZ=F",  name: "Brent Crude",   unit: "USD/bbl"   },
  { symbol: "NG=F",  name: "Natural Gas",   unit: "USD/MMBtu" },
];

const YIELD_SYMBOLS = [
  { symbol: "^TNX", name: "US 10Y" },
  { symbol: "^FVX", name: "US 5Y"  },
  { symbol: "^IRX", name: "US 3M"  },
];

const FOREX_PAIRS = [
  { pair: "EUR/USD", base: "EUR", quote: "USD" },
  { pair: "USD/JPY", base: "USD", quote: "JPY" },
  { pair: "GBP/USD", base: "GBP", quote: "USD" },
  { pair: "USD/INR", base: "USD", quote: "INR" },
];

const KNOWN_EVENTS = [
    { date: "2026-02-26", region: "United States", title: "US CPI Inflation Report (Jan)", impact: "High" },
    { date: "2026-02-28", region: "India", title: "RBI Monetary Policy Decision", impact: "High" },
    { date: "2026-03-05", region: "Eurozone", title: "ECB Interest Rate Decision", impact: "High" },
    { date: "2026-03-06", region: "United States", title: "Non-Farm Payrolls (Feb)", impact: "High" },
    { date: "2026-03-11", region: "United States", title: "US CPI Inflation Report (Feb)", impact: "High" },
    { date: "2026-03-15", region: "China", title: "China Loan Prime Rate Decision", impact: "Medium" },
    { date: "2026-03-18", region: "United States", title: "FOMC Rate Decision", impact: "High" },
    { date: "2026-03-19", region: "Japan", title: "BOJ Monetary Policy Decision", impact: "High" },
    { date: "2026-03-19", region: "United Kingdom", title: "BoE Interest Rate Decision", impact: "High" },
    { date: "2026-04-03", region: "United States", title: "Non-Farm Payrolls (Mar)", impact: "High" },
    { date: "2026-04-07", region: "India", title: "RBI Monetary Policy Decision", impact: "High" },
    { date: "2026-04-10", region: "United States", title: "US CPI Inflation Report (Mar)", impact: "High" },
    { date: "2026-04-15", region: "China", title: "China GDP Q1 2026", impact: "High" },
    { date: "2026-04-16", region: "Eurozone", title: "ECB Interest Rate Decision", impact: "High" },
    { date: "2026-05-07", region: "United States", title: "FOMC Rate Decision", impact: "High" },
    { date: "2026-06-17", region: "United States", title: "FOMC Rate Decision + Projections", impact: "High" },
    { date: "2026-09-16", region: "United States", title: "FOMC Rate Decision + Projections", impact: "High" },
    { date: "2026-11-04", region: "United States", title: "FOMC Rate Decision", impact: "High" },
    { date: "2026-12-16", region: "United States", title: "FOMC Rate Decision + Projections", impact: "High" },
];

function getMarketStatus() {
  const h = new Date().getUTCHours();
  const d = new Date().getUTCDay();
  const weekday = d >= 1 && d <= 5;
  return {
    us:     weekday && h >= 13 && h < 20 ? "open" : "closed",
    europe: weekday && h >= 7  && h < 15 ? "open" : "closed",
    asia:   weekday && h >= 0  && h < 7  ? "open" : "closed",
  };
}

// ── MAIN ROUTE ─────────────────────────────────────────────
router.get("/global", async (req, res) => {
  try {
    if (_cache && Date.now() - _cacheTs < CACHE_TTL) {
      return res.json(_cache);
    }

    const allSymbols = [
      ...INDEX_SYMBOLS.us.map(i => i.symbol),
      ...INDEX_SYMBOLS.europe.map(i => i.symbol),
      ...INDEX_SYMBOLS.asia.map(i => i.symbol),
      ...COMMODITY_CONFIG.map(c => c.symbol),
      ...YIELD_SYMBOLS.map(y => y.symbol),
      "^VIX",
    ];

    // Stagger to avoid Yahoo rate limits
    const quotes = await Promise.all(
      allSymbols.map((symbol, i) =>
        new Promise(resolve =>
          setTimeout(() => yahooQuote(symbol).then(resolve), i * 120)
        )
      )
    );

    let idx = 0;
    const buildRegion = (region) =>
      region.map(({ symbol, name }) => {
        const q = quotes[idx++];
        if (!q) return null;
        return { symbol, name, ...q, timestamp: Date.now(), status: "closed" };
      }).filter(Boolean);

    const indices = {
      us:       buildRegion(INDEX_SYMBOLS.us),
      europe:   buildRegion(INDEX_SYMBOLS.europe),
      asia:     buildRegion(INDEX_SYMBOLS.asia),
      emerging: [],
    };

    const commodities = COMMODITY_CONFIG.map(item => {
      const q = quotes[idx++];
      if (!q) return null;
      return { ...item, ...q };
    }).filter(Boolean);

    let bonds = YIELD_SYMBOLS.map(item => {
      const q = quotes[idx++];
      if (!q) return null;
      return { name: item.name, yield: q.price, change: q.change };
    }).filter(Boolean);

    const y10 = bonds.find(b => b.name === "US 10Y");
    const y5  = bonds.find(b => b.name === "US 5Y");
    if (y10 && y5) {
      bonds.push({ name: "Spread 10Y-5Y", yield: parseFloat((y10.yield - y5.yield).toFixed(3)), change: 0 });
    }

    const vixData = quotes[quotes.length - 1];
    const vix = vixData ? {
      value:         vixData.price,
      change:        vixData.change,
      changePercent: vixData.changePercent,
      sentiment:     vixData.price < 20 ? "low" : vixData.price < 30 ? "moderate" : vixData.price < 40 ? "high" : "extreme",
    } : null;

    let forex = [];
    if (EXCHANGERATE_KEY) {
      try {
        const r = await fetch(`https://v6.exchangerate-api.com/v6/${EXCHANGERATE_KEY}/latest/USD`);
        const d = await r.json();
        if (d.result === "success") {
          const rates = d.conversion_rates;
          forex = FOREX_PAIRS.map(({ pair, base, quote }) => {
            const rate = base === "USD" ? rates[quote] : (rates[base] ? 1 / rates[base] : 0);
            return { pair, base, quote, rate, change: 0, changePercent: 0 };
          });
        }
      } catch (e) { console.error("[Forex]", e); }
    }

    const today  = new Date().setHours(0, 0, 0, 0);
    const events = KNOWN_EVENTS
      .filter(e => new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 12);

    const calculateRegions = () => [
      {
        name: "United States", flag: "🇺🇸",
        avgChange: indices.us.length ? indices.us.reduce((s, i) => s + i.changePercent, 0) / indices.us.length : 0,
        best:  indices.us.reduce((p, c) => c.changePercent > p.changePercent ? c : p, indices.us[0] || {}),
        worst: indices.us.reduce((p, c) => c.changePercent < p.changePercent ? c : p, indices.us[0] || {}),
        countries: ["USA"],
      },
      {
        name: "Europe", flag: "🇪🇺",
        avgChange: indices.europe.length ? indices.europe.reduce((s, i) => s + i.changePercent, 0) / indices.europe.length : 0,
        best:  indices.europe.reduce((p, c) => c.changePercent > p.changePercent ? c : p, indices.europe[0] || {}),
        worst: indices.europe.reduce((p, c) => c.changePercent < p.changePercent ? c : p, indices.europe[0] || {}),
        countries: ["UK", "Germany", "France"],
      },
      {
        name: "Asia", flag: "🌏",
        avgChange: indices.asia.length ? indices.asia.reduce((s, i) => s + i.changePercent, 0) / indices.asia.length : 0,
        best:  indices.asia.reduce((p, c) => c.changePercent > p.changePercent ? c : p, indices.asia[0] || {}),
        worst: indices.asia.reduce((p, c) => c.changePercent < p.changePercent ? c : p, indices.asia[0] || {}),
        countries: ["Japan", "Hong Kong", "China"],
      },
    ].map(r => ({
      ...r,
      avgChange: parseFloat(r.avgChange.toFixed(2)),
      best:  { name: r.best?.name  || "—", change: parseFloat((r.best?.changePercent  || 0).toFixed(2)) },
      worst: { name: r.worst?.name || "—", change: parseFloat((r.worst?.changePercent || 0).toFixed(2)) },
    }));

    const responseData = {
      indices, commodities, bonds, vix, forex, events,
      regions:      calculateRegions(),
      marketStatus: getMarketStatus(),
      lastUpdated:  Date.now(),
    };

    _cache   = responseData;
    _cacheTs = Date.now();
    res.json(responseData);

  } catch (err) {
    console.error("[GlobalMarkets] CRITICAL ERROR:", err);
    res.status(500).json({ error: "Failed to fetch global market data" });
  }
});

export default router;