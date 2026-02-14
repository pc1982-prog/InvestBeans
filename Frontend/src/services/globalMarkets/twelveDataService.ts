// ============================================================
// InvestBeans — Twelve Data Service (FINAL FIXED)
// Covers: Indices, Bond Yields, Commodities
// Fix: Correct symbol formats (^DJI, ^GSPC, US10Y, XAU/USD)
// ============================================================

import { IndexQuote, BondYield, Commodity } from "./types";
import {
  API_KEYS, CACHE_MS, TWELVE_BASE,
  INDEX_CONFIG, ALL_INDEX_SYMBOLS,
  YIELD_CONFIG, COMMODITY_CONFIG,
} from "./config";

// ── Caches ─────────────────────────────────────────────────
let indicesCache:     { data: Record<string, IndexQuote>; ts: number } | null = null;
let bondsCache:       { data: BondYield[];  ts: number } | null = null;
let commoditiesCache: { data: Commodity[];  ts: number } | null = null;

// ── Market status from exchange hours ──────────────────────
function deriveStatus(symbol: string): IndexQuote["status"] {
  const now   = new Date();
  const hour  = now.getUTCHours();
  const day   = now.getUTCDay();
  if (day === 0 || day === 6) return "closed";

  // Asian indices
  if (["%5EN225", "^N225", "^HSI", "^SSEC"].some(s => symbol.includes(s.replace("^", "")))) {
    return hour >= 0 && hour < 7 ? "open" : "closed";
  }
  // European indices
  if (["^FTSE", "^GDAXI", "^FCHI"].includes(symbol)) {
    return hour >= 7 && hour < 15 ? "open" : "closed";
  }
  // US default
  return hour >= 13 && hour < 20 ? "open" : "closed";
}

// ── Generic Twelve Data batch quote fetch ──────────────────
async function fetchTwelveBatch(
  symbols: string[]
): Promise<Record<string, any>> {
  const joined = symbols.join(",");
  const url = `${TWELVE_BASE}/quote?symbol=${encodeURIComponent(joined)}&apikey=${API_KEYS.twelveData}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Twelve Data HTTP ${res.status}`);

  const raw = await res.json();

  // Single symbol → object directly; multiple → keyed object
  if (symbols.length === 1) {
    return { [symbols[0]]: raw };
  }
  return raw;
}

// ── INDICES ────────────────────────────────────────────────

async function fetchAllIndices(): Promise<Record<string, IndexQuote>> {
  if (indicesCache && Date.now() - indicesCache.ts < CACHE_MS) {
    return indicesCache.data;
  }

  const symbols = ALL_INDEX_SYMBOLS.map((s) => s.symbol);
  const raw = await fetchTwelveBatch(symbols);

  const parsed: Record<string, IndexQuote> = {};

  for (const { symbol, name } of ALL_INDEX_SYMBOLS) {
    const q = raw[symbol];
    // Skip if API returned error or no price
    if (!q || q.code || !q.close || q.close === "NaN") continue;

    parsed[symbol] = {
      symbol,
      name,
      price:         parseFloat(q.close),
      change:        parseFloat(q.change        ?? "0"),
      changePercent: parseFloat(q.percent_change ?? "0"),
      high:          parseFloat(q.high          ?? q.close),
      low:           parseFloat(q.low           ?? q.close),
      timestamp:     Date.now(),
      status:        deriveStatus(symbol),
    };
  }

  indicesCache = { data: parsed, ts: Date.now() };
  return parsed;
}

export async function fetchUSIndices(): Promise<IndexQuote[]> {
  const all = await fetchAllIndices();
  return INDEX_CONFIG.us.map((s) => all[s.symbol]).filter(Boolean) as IndexQuote[];
}

export async function fetchEuropeIndices(): Promise<IndexQuote[]> {
  const all = await fetchAllIndices();
  return INDEX_CONFIG.europe.map((s) => all[s.symbol]).filter(Boolean) as IndexQuote[];
}

export async function fetchAsiaIndices(): Promise<IndexQuote[]> {
  const all = await fetchAllIndices();
  return INDEX_CONFIG.asia.map((s) => all[s.symbol]).filter(Boolean) as IndexQuote[];
}

export function invalidateIndicesCache() {
  indicesCache = null;
}

// ── BOND YIELDS ────────────────────────────────────────────

export async function fetchBondYields(): Promise<BondYield[]> {
  if (bondsCache && Date.now() - bondsCache.ts < CACHE_MS) {
    return bondsCache.data;
  }

  try {
    const symbols = YIELD_CONFIG.map((y) => y.symbol);
    const raw     = await fetchTwelveBatch(symbols);

    const bonds: BondYield[] = [];

    for (const { symbol, name } of YIELD_CONFIG) {
      const q = raw[symbol];
      if (!q || q.code || !q.close || q.close === "NaN") continue;
      bonds.push({
        name,
        yield:  parseFloat(q.close),
        change: parseFloat(q.change ?? "0"),
      });
    }

    // Yield spread (10Y − 2Y)
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
    console.error("[Bonds] Twelve Data failed:", err);
    return [];
  }
}

// ── COMMODITIES ────────────────────────────────────────────

export async function fetchCommodities(): Promise<Commodity[]> {
  if (commoditiesCache && Date.now() - commoditiesCache.ts < CACHE_MS) {
    return commoditiesCache.data;
  }

  try {
    const symbols = COMMODITY_CONFIG.map((c) => c.symbol);
    const raw     = await fetchTwelveBatch(symbols);

    const commodities: Commodity[] = [];

    for (const { symbol, name, unit } of COMMODITY_CONFIG) {
      const q = raw[symbol];
      if (!q || q.code || !q.close || q.close === "NaN") continue;
      commodities.push({
        name,
        symbol,
        price:         parseFloat(q.close),
        change:        parseFloat(q.change         ?? "0"),
        changePercent: parseFloat(q.percent_change ?? "0"),
        unit,
      });
    }

    commoditiesCache = { data: commodities, ts: Date.now() };
    return commodities;
  } catch (err) {
    console.error("[Commodities] Twelve Data failed:", err);
    return [];
  }
}

export function invalidateAllCaches() {
  indicesCache     = null;
  bondsCache       = null;
  commoditiesCache = null;
}