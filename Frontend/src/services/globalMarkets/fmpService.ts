// ============================================================
// InvestBeans — Bonds & Commodities Service (FIXED v2)
// FMP 403 FIXED: Now uses Twelve Data (already working ✅)
// Fallback for bonds: stooq.com (free, no key, no CORS block)
// ============================================================

import { BondYield, Commodity } from "./types";
import { API_KEYS, CACHE_MS } from "./config";

const TWELVE_BASE = "https://api.twelvedata.com";

let bondsCache:       { data: BondYield[]; ts: number } | null = null;
let commoditiesCache: { data: Commodity[]; ts: number } | null = null;

// ── BOND YIELDS ────────────────────────────────────────────
// Twelve Data supports treasury yield symbols directly

const YIELD_SYMBOLS = [
  { symbol: "US10Y",  name: "US 10Y" },
  { symbol: "US02Y",  name: "US 2Y"  },
  { symbol: "US03MY", name: "US 3M"  },
];

async function fetchYieldsViaTwelveData(): Promise<BondYield[]> {
  const symbols = YIELD_SYMBOLS.map((y) => y.symbol).join(",");
  const url = `${TWELVE_BASE}/quote?symbol=${encodeURIComponent(symbols)}&apikey=${API_KEYS.twelveData}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`TwelveData Yields HTTP ${res.status}`);
  const raw = await res.json();

  const results: BondYield[] = [];
  for (const { symbol, name } of YIELD_SYMBOLS) {
    const q = raw[symbol] ?? raw;
    if (!q || q.code || !q.close) continue;
    results.push({
      name,
      yield:  parseFloat(q.close),
      change: parseFloat(q.change ?? "0"),
    });
  }
  return results;
}

// Stooq fallback — truly free public CSV, no CORS issues
async function fetchYieldStooq(stooqSym: string): Promise<number> {
  try {
    const res = await fetch(`https://stooq.com/q/d/l/?s=${stooqSym}&i=d`);
    if (!res.ok) return 0;
    const text = await res.text();
    const lines = text.trim().split("\n");
    const last  = lines[lines.length - 1].split(",");
    return parseFloat(last[4] ?? "0");
  } catch {
    return 0;
  }
}

async function fetchYieldsWithFallback(): Promise<BondYield[]> {
  try {
    return await fetchYieldsViaTwelveData();
  } catch (primaryErr) {
    console.warn("[Bonds] Twelve Data failed, trying stooq:", primaryErr);
    const [y10, y2, y3m] = await Promise.all([
      fetchYieldStooq("^tnx"),
      fetchYieldStooq("^twoyr"),
      fetchYieldStooq("^irx"),
    ]);
    const out: BondYield[] = [];
    if (y10) out.push({ name: "US 10Y", yield: y10, change: 0 });
    if (y2)  out.push({ name: "US 2Y",  yield: y2,  change: 0 });
    if (y3m) out.push({ name: "US 3M",  yield: y3m, change: 0 });
    return out;
  }
}

export async function fetchBondYields(): Promise<BondYield[]> {
  if (bondsCache && Date.now() - bondsCache.ts < CACHE_MS) {
    return bondsCache.data;
  }
  try {
    const bonds = await fetchYieldsWithFallback();

    // Add yield spread (10Y - 2Y)
    const y10 = bonds.find((b) => b.name === "US 10Y");
    const y2  = bonds.find((b) => b.name === "US 2Y");
    if (y10 && y2) {
      bonds.push({
        name:   "Spread 10Y-2Y",
        yield:  parseFloat((y10.yield - y2.yield).toFixed(3)),
        change: 0,
      });
    }

    bondsCache = { data: bonds, ts: Date.now() };
    return bonds;
  } catch (err) {
    console.error("[Bonds] All sources failed:", err);
    return [];
  }
}

// ── COMMODITIES ────────────────────────────────────────────
// Twelve Data supports forex-style commodity pairs (XAU/USD etc.)

const COMMODITY_CONFIG = [
  { symbol: "XAU/USD",   name: "Gold",          unit: "USD/oz"    },
  { symbol: "XAG/USD",   name: "Silver",        unit: "USD/oz"    },
  { symbol: "WTI/USD",   name: "Crude Oil WTI", unit: "USD/bbl"   },
  { symbol: "BRENT/USD", name: "Brent Crude",   unit: "USD/bbl"   },
  { symbol: "XNG/USD",   name: "Natural Gas",   unit: "USD/MMBtu" },
];

export async function fetchCommodities(): Promise<Commodity[]> {
  if (commoditiesCache && Date.now() - commoditiesCache.ts < CACHE_MS) {
    return commoditiesCache.data;
  }
  try {
    const symbols = COMMODITY_CONFIG.map((c) => c.symbol).join(",");
    const url = `${TWELVE_BASE}/quote?symbol=${encodeURIComponent(symbols)}&apikey=${API_KEYS.twelveData}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`TwelveData Commodities HTTP ${res.status}`);
    const raw = await res.json();

    const commodities: Commodity[] = COMMODITY_CONFIG.flatMap(({ symbol, name, unit }) => {
      const q = raw[symbol] ?? (COMMODITY_CONFIG.length === 1 ? raw : null);
      if (!q || q.code || !q.close) return [];
      return [{
        name,
        symbol,
        price:         parseFloat(q.close),
        change:        parseFloat(q.change ?? "0"),
        changePercent: parseFloat(q.percent_change ?? "0"),
        unit,
      }];
    });

    commoditiesCache = { data: commodities, ts: Date.now() };
    return commodities;
  } catch (err) {
    console.error("[Commodities] Twelve Data failed:", err);
    return [];
  }
}

export function invalidateFmpCache() {
  bondsCache       = null;
  commoditiesCache = null;
}