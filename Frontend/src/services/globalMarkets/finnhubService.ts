// ============================================================
// InvestBeans — VIX & Events Service (FINAL FIXED)
// VIX    → Yahoo Finance via allorigins.win proxy
//           Free, no key, no CORS, works from browser ✅
// Events → Hardcoded central bank calendar (reliable, no API)
// ============================================================

import { VixData, GlobalEvent } from "./types";
import { CACHE_MS, YF_PROXY } from "./config";

let vixCache:    { data: VixData | null; ts: number } = { data: null, ts: 0 };
let eventsCache: { data: GlobalEvent[];  ts: number } = { data: [],   ts: 0 };

// ── VIX via Yahoo Finance (allorigins.win proxy) ───────────
// allorigins.win adds CORS headers — free community proxy
// Yahoo Finance /v8/finance/chart gives OHLC + meta price

function scoreVix(v: number): VixData["sentiment"] {
  if (v < 20) return "low";
  if (v < 30) return "moderate";
  if (v < 40) return "high";
  return "extreme";
}

export async function fetchVix(): Promise<VixData | null> {
  if (vixCache.data && Date.now() - vixCache.ts < CACHE_MS) {
    return vixCache.data;
  }

  try {
    const url = YF_PROXY("^VIX");
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`allorigins/YF HTTP ${res.status}`);

    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;

    if (!meta?.regularMarketPrice) {
      throw new Error("Yahoo Finance VIX: no price in response");
    }

    const value  = meta.regularMarketPrice as number;
    const prev   = (meta.chartPreviousClose ?? meta.previousClose ?? value) as number;
    const change = parseFloat((value - prev).toFixed(2));
    const pct    = prev ? parseFloat(((change / prev) * 100).toFixed(2)) : 0;

    const vix: VixData = { value, change, changePercent: pct, sentiment: scoreVix(value) };
    vixCache = { data: vix, ts: Date.now() };
    return vix;
  } catch (err) {
    console.error("[VIX] Yahoo Finance proxy failed:", err);
    // Return stale cache rather than null (better UX)
    return vixCache.data;
  }
}

// ── ECONOMIC EVENTS (hardcoded) ────────────────────────────
// Central bank dates announced months ahead — no API needed.
// No CORS, no rate limits, 100% reliable.
// Update quarterly.

const KNOWN_EVENTS: GlobalEvent[] = [
  // ── Fed (FOMC) ─────────────────────────────────────────
  { date: "2026-03-18", region: "United States", title: "FOMC Rate Decision",                impact: "High"   },
  { date: "2026-05-07", region: "United States", title: "FOMC Rate Decision",                impact: "High"   },
  { date: "2026-06-17", region: "United States", title: "FOMC Rate Decision + Projections",  impact: "High"   },
  { date: "2026-07-29", region: "United States", title: "FOMC Rate Decision",                impact: "High"   },
  { date: "2026-09-16", region: "United States", title: "FOMC Rate Decision + Projections",  impact: "High"   },
  { date: "2026-11-04", region: "United States", title: "FOMC Rate Decision",                impact: "High"   },
  { date: "2026-12-16", region: "United States", title: "FOMC Rate Decision + Projections",  impact: "High"   },

  // ── US CPI ─────────────────────────────────────────────
  { date: "2026-02-26", region: "United States", title: "US CPI Inflation Report (Jan)",     impact: "High"   },
  { date: "2026-03-11", region: "United States", title: "US CPI Inflation Report (Feb)",     impact: "High"   },
  { date: "2026-04-10", region: "United States", title: "US CPI Inflation Report (Mar)",     impact: "High"   },
  { date: "2026-05-13", region: "United States", title: "US CPI Inflation Report (Apr)",     impact: "High"   },

  // ── Non-Farm Payrolls ─────────────────────────────────
  { date: "2026-03-06", region: "United States", title: "Non-Farm Payrolls (Feb)",           impact: "High"   },
  { date: "2026-04-03", region: "United States", title: "Non-Farm Payrolls (Mar)",           impact: "High"   },
  { date: "2026-05-01", region: "United States", title: "Non-Farm Payrolls (Apr)",           impact: "High"   },

  // ── ECB ───────────────────────────────────────────────
  { date: "2026-03-05", region: "Eurozone",       title: "ECB Interest Rate Decision",       impact: "High"   },
  { date: "2026-04-16", region: "Eurozone",       title: "ECB Interest Rate Decision",       impact: "High"   },
  { date: "2026-06-04", region: "Eurozone",       title: "ECB Interest Rate Decision",       impact: "High"   },
  { date: "2026-07-23", region: "Eurozone",       title: "ECB Interest Rate Decision",       impact: "High"   },

  // ── BOJ ───────────────────────────────────────────────
  { date: "2026-03-19", region: "Japan",          title: "BOJ Monetary Policy Decision",     impact: "High"   },
  { date: "2026-05-01", region: "Japan",          title: "BOJ Monetary Policy Decision",     impact: "High"   },
  { date: "2026-06-17", region: "Japan",          title: "BOJ Monetary Policy Decision",     impact: "High"   },

  // ── Bank of England ───────────────────────────────────
  { date: "2026-03-19", region: "United Kingdom", title: "BoE Interest Rate Decision",       impact: "High"   },
  { date: "2026-05-07", region: "United Kingdom", title: "BoE Interest Rate Decision",       impact: "High"   },
  { date: "2026-06-18", region: "United Kingdom", title: "BoE Interest Rate Decision",       impact: "High"   },

  // ── RBI ───────────────────────────────────────────────
  { date: "2026-02-28", region: "India",          title: "RBI Monetary Policy Decision",     impact: "High"   },
  { date: "2026-04-07", region: "India",          title: "RBI Monetary Policy Decision",     impact: "High"   },
  { date: "2026-06-05", region: "India",          title: "RBI Monetary Policy Decision",     impact: "High"   },

  // ── China ─────────────────────────────────────────────
  { date: "2026-03-15", region: "China",          title: "China Loan Prime Rate Decision",   impact: "Medium" },
  { date: "2026-04-15", region: "China",          title: "China GDP Q1 2026",                impact: "High"   },
  { date: "2026-04-16", region: "China",          title: "China Retail Sales & Industrial",  impact: "Medium" },
];

export async function fetchEconomicEvents(): Promise<GlobalEvent[]> {
  if (eventsCache.data.length && Date.now() - eventsCache.ts < CACHE_MS) {
    return eventsCache.data;
  }

  const todayTs  = new Date().setHours(0, 0, 0, 0);
  const cutoffTs = todayTs + 45 * 24 * 60 * 60 * 1000; // next 45 days

  const upcoming = KNOWN_EVENTS
    .filter((e) => {
      const ts = new Date(e.date).getTime();
      return ts >= todayTs && ts <= cutoffTs;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 12);

  eventsCache = { data: upcoming, ts: Date.now() };
  return upcoming;
}

// Backward compat export
export async function fetchForexBackup(): Promise<Record<string, number>> {
  return {};
}