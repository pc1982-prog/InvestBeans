
import { GlobalMarketData } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const CACHE_MS = 60000; 

let cache: { data: GlobalMarketData | null; ts: number } = { 
  data: null, 
  ts: 0 
};

export async function fetchGlobalMarkets(): Promise<GlobalMarketData> {
 
  if (cache.data && Date.now() - cache.ts < CACHE_MS) {

    return cache.data;
  }

  

  const res = await fetch(`${API_BASE}/markets/global`);
  
  if (!res.ok) {
    throw new Error(`Backend error: ${res.status} ${res.statusText}`);
  }

  const raw = await res.json();
 

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