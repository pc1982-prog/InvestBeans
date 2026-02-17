// ============================================================
// InvestBeans — Forex Service
// FIX: sessionStorage → in-memory Map
//      sessionStorage was causing Android Chrome to show
//      "wants to look for and connect to any device on your
//       local network" permission popup.
// ============================================================

import { ForexPair } from "./types";
import { EXCHANGERATE_BASE, FOREX_PAIRS, CACHE_MS } from "./config";

let cache: { data: ForexPair[]; ts: number } | null = null;

// ✅ FIX: In-memory store instead of sessionStorage
//    sessionStorage access on mobile can trigger local network
//    permission requests in some Android Chrome versions.
const prevRates = new Map<string, number>();

function getPrevRate(pair: string): number | null {
  return prevRates.get(pair) ?? null;
}

function storePrevRate(pair: string, rate: number) {
  prevRates.set(pair, rate);
}

async function fetchFromExchangeRateAPI(): Promise<ForexPair[]> {
  const res = await fetch(`${EXCHANGERATE_BASE}/latest/USD`);
  if (!res.ok) throw new Error(`ExchangeRate API HTTP ${res.status}`);

  const data = await res.json();
  if (data.result !== "success") throw new Error("ExchangeRate API error");

  const rates = data.conversion_rates as Record<string, number>;

  return FOREX_PAIRS.map(({ pair, base, quote }): ForexPair => {
    const rate = base === "USD" ? (rates[quote] ?? 0) : (rates[base] ? 1 / rates[base] : 0);
    const prev = getPrevRate(pair);
    const change        = prev ? rate - prev : 0;
    const changePercent = prev ? ((rate - prev) / prev) * 100 : 0;
    if (rate) storePrevRate(pair, rate);
    return { pair, base, quote, rate, change, changePercent };
  });
}

export async function fetchForexRates(): Promise<ForexPair[]> {
  if (cache && Date.now() - cache.ts < CACHE_MS) return cache.data;
  try {
    const pairs = await fetchFromExchangeRateAPI();
    cache = { data: pairs, ts: Date.now() };
    return pairs;
  } catch (err) {
    console.error("[Forex] Failed:", err);
    return cache?.data ?? [];
  }
}