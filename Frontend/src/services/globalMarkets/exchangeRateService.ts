// ============================================================
// InvestBeans — Forex Service (WORKING ✅ — no changes needed)
// Source: ExchangeRate API — 1500 req/month free, CORS OK
// ============================================================

import { ForexPair } from "./types";
import { EXCHANGERATE_BASE, FOREX_PAIRS, CACHE_MS } from "./config";

let cache: { data: ForexPair[]; ts: number } | null = null;

function getPrevRate(pair: string): number | null {
  try   { const v = sessionStorage.getItem(`fx_${pair}`); return v ? +v : null; }
  catch { return null; }
}
function storePrevRate(pair: string, rate: number) {
  try   { sessionStorage.setItem(`fx_${pair}`, String(rate)); }
  catch { /* SSR */ }
}

async function fetchFromExchangeRateAPI(): Promise<ForexPair[]> {
  const res  = await fetch(`${EXCHANGERATE_BASE}/latest/USD`);
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