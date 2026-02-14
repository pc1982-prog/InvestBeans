// ============================================================
// FINAL WORKING VERSION - Backend Proxy Only
// ============================================================

import { GlobalMarketData } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const CACHE_MS = 60000; // 1 minute cache

let cache: { data: GlobalMarketData | null; ts: number } = { 
  data: null, 
  ts: 0 
};

export async function fetchGlobalMarkets(): Promise<GlobalMarketData> {
  // Return cache if fresh
  if (cache.data && Date.now() - cache.ts < CACHE_MS) {
    console.log("📦 Returning cached data");
    return cache.data;
  }

  console.log("🔄 Fetching from backend:", `${API_BASE}/api/v1/markets/global`);

  const res = await fetch(`${API_BASE}/api/v1/markets/global`);
  
  if (!res.ok) {
    throw new Error(`Backend error: ${res.status} ${res.statusText}`);
  }

  const raw = await res.json();
  console.log("✅ Backend response:", raw);

  const data: GlobalMarketData = {
    indices: raw.indices || { us: [], europe: [], asia: [], emerging: [] },
    forex: raw.forex || [],
    bonds: raw.bonds || [],
    commodities: raw.commodities || [],
    vix: raw.vix || null,
    events: raw.events || [],
    regions: raw.regions || [],
    lastUpdated: raw.lastUpdated || Date.now(),
    marketStatus: raw.marketStatus || { us: "closed", europe: "closed", asia: "closed" }
  };

  cache = { data, ts: Date.now() };
  return data;
}

export function invalidateCache() {
  cache = { data: null, ts: 0 };
}