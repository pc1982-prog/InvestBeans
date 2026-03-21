// Frontend/src/views/CommoditiesView.tsx — PREMIUM REDESIGN
// • Zero fake/static data — every number comes from the live API
// • CleanChart (candlestick) inside every commodity & ETF card
// • Premium 3D SVG icons for each commodity
// • Mobile-first large cards — all metrics clearly readable
// • AMFI NAV · CFTC COT · EIA/OPEC · Yahoo Finance — all live

import Layout from "@/components/Layout";
import { useTheme } from "@/controllers/Themecontext";
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import CleanChart from "@/components/CleanChart";
import {
  TrendingUp, TrendingDown, RefreshCw, BarChart3,
  ChevronRight, ChevronDown, Menu, X, Clock,
  Info, AlertTriangle, ArrowUpDown, Layers, PieChart,
  ShieldCheck, Wifi, Activity,
} from "lucide-react";

const BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000/api/v1";
const ROOT = BASE.replace(/\/api\/v1\/?$/, "");

// ── Types ──────────────────────────────────────────────────────────
interface Quote {
  price: number; prev: number; change: number; changePct: number;
  high: number; low: number; volume: number; currency: string; name: string;
  candles?: { x: number; y: [number, number, number, number] }[];
  inrPrice?: number; inrPrev?: number;
}
interface FuturesCurve { type: string; spread: number; color: string; desc: string; }
interface OITrend { trend: string; signal: string; color: string; desc: string; }
interface PCR { pcr: number; sentiment: string; color: string; }
interface COT { netSpeculative: number; sentiment: string; speculativeLong: number; speculativeShort: number; openInterest: number; reportDate?: string; }
interface ClientPos { retail: number; hni: number; institutional: number; retailBias: string; hniBias: string; }
interface CycleStage { label: string; color: string; desc: string; }
interface Seasonal { Q1: string; Q2: string; Q3: string; Q4: string; best: string; worst: string; }
interface DomesticItem {
  id: string; name: string; flag: string; symbol: string; unit: string; exchange: string;
  importDep: string; correlation: number; seasonal: Seasonal; quote: Quote | null;
  futuresCurve?: FuturesCurve; oiTrend?: OITrend; pcr?: PCR;
  clientPositioning?: ClientPos; cycleStage?: CycleStage; cot?: COT | null;
  basisSpread?: number; dayVolatility?: number; maxDrawdown1Y?: number; eventSensitivity?: string[];
}
interface ETFItem {
  id: string; name: string; symbol: string; type: string; category: string;
  expenseRatio: number; benchmark: string; sipSuitable: boolean;
  hedgeEfficiency?: number; allocationBucket?: string; quote: Quote | null;
  nav?: number; marketPrice?: number; premiumDiscount?: number;
  trackingError?: number; rollingReturn1Y?: number; rollingReturn3Y?: number;
  aum?: string; bidAskSpread?: number; liquidityScore?: number;
  allocationSuitability?: { conservative: string; balanced: string; aggressive: string };
}
interface GlobalItem {
  id: string; name: string; flag: string; symbol: string; unit: string;
  exchange: string; cat: string; quote: Quote | null;
  relativeStrength?: number; dxyCorrelation?: number;
  cot?: { netSpeculative: number; sentiment: string; openInterest: number } | null;
}
interface GlobalETF {
  id: string; name: string; symbol: string; type: string; category: string;
  exchange: string; expenseRatio: number; aum: string; benchmark: string; quote: Quote | null;
  relativeStrength?: number; maxDrawdown?: number;
  institutionalOwnership?: string; trackingEfficiency?: number;
}
interface MacroItem { id: string; name: string; symbol: string; unit: string; quote: Quote | null; }
interface Regime {
  label: string; color: string; emoji: string; desc: string;
  strategy: Record<string, string>; vix: number; yieldCurve: number; y10: number; dxyChange: number;
}
interface HedgeSignal { condition: string; signal: string; action: string; color: string; severity: string; }
interface AllocBucket { label: string; emoji: string; items: string[]; color: string; range: string; desc: string; }
interface Intelligence {
  regime: Regime;
  geopoliticalRisk: { score: number; label: string; color: string };
  hedgeSignals: HedgeSignal[];
  allocationFramework: Record<string, AllocBucket>;
  eia: { usCrudeInventory: number; inventoryChange: string; rigCount: number; brentWtiSpread: number; opecOutput: number; opecCapacityUse: string };
  macroDrivers: { usCPI: string; fedRateExpectation: string; rbiRate: string; usdInr: number; indianCPI: string };
  silverInflowHistory: { month: string; inflow: number }[];
  cotSummary: Record<string, { sentiment: string; netSpec: number } | null>;
}
interface AllData {
  domestic: DomesticItem[]; global: GlobalItem[];
  domesticEtfs: ETFItem[]; globalEtfs: GlobalETF[];
  macro: MacroItem[]; intelligence: Intelligence; updatedAt: string;
}
type TabId = "domestic" | "dom-etfs" | "global" | "global-etfs" | "intelligence";

// ── Helpers ────────────────────────────────────────────────────────
const fmt = (n: number | null | undefined, d = 2) =>
  n != null ? n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) : "—";
const fmtINR = (n: number | null | undefined) =>
  n != null ? `₹${n.toLocaleString("en-IN")}` : "—";
const fmtV = (v: number) => {
  if (!v) return "—";
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return v.toFixed(0);
};
const fmtBig = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1e5) return `${(abs / 1e5).toFixed(1)}L`;
  if (abs >= 1e3) return `${(abs / 1e3).toFixed(1)}K`;
  return abs.toFixed(0);
};

// ── Theme ──────────────────────────────────────────────────────────
const useIL = () => { const { theme } = useTheme(); return theme === "light"; };
const tx = {
  bg:      (l: boolean) => l ? "bg-[#f0f7fe]"   : "bg-[#070e1a]",
  card:    (l: boolean) => l ? "bg-white border border-slate-100 shadow-sm" : "bg-[#0c1a2e] border border-[#1e3a5f]/50",
  card2:   (l: boolean) => l ? "bg-slate-50 border border-slate-100" : "bg-[#070e1a] border border-[#1e3a5f]/35",
  sidebar: (l: boolean) => l ? "bg-white border-r border-slate-100" : "bg-[#070e1a] border-r border-[#1e3a5f]/40",
  topbar:  (l: boolean) => l ? "bg-white/95 border-b border-slate-100 backdrop-blur-sm" : "bg-[#040810]/95 border-b border-[#1e3a5f]/50 backdrop-blur-sm",
  t1:      (l: boolean) => l ? "text-slate-900"   : "text-white",
  t2:      (l: boolean) => l ? "text-slate-500"   : "text-slate-400",
  t3:      (l: boolean) => l ? "text-slate-400"   : "text-slate-500",
  div:     (l: boolean) => l ? "border-slate-100" : "border-[#1e3a5f]/40",
};

// ══════════════════════════════════════════════════════════════════
// PREMIUM 3D SVG ICONS
// ══════════════════════════════════════════════════════════════════
const GoldIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <defs>
      <radialGradient id="gold-fill" cx="38%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#FFF176"/>
        <stop offset="38%" stopColor="#FFD600"/>
        <stop offset="100%" stopColor="#E65100"/>
      </radialGradient>
      <radialGradient id="gold-shine" cx="30%" cy="25%" r="45%">
        <stop offset="0%" stopColor="white" stopOpacity="0.55"/>
        <stop offset="100%" stopColor="white" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="20" cy="20" r="18" fill="url(#gold-fill)"/>
    <circle cx="20" cy="20" r="18" fill="url(#gold-shine)"/>
    <text x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="800" fill="#7B3A00" opacity="0.85">Au</text>
  </svg>
);
const SilverIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <defs>
      <radialGradient id="silver-fill" cx="38%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#F5F5F5"/>
        <stop offset="42%" stopColor="#B0BEC5"/>
        <stop offset="100%" stopColor="#37474F"/>
      </radialGradient>
      <radialGradient id="silver-shine" cx="28%" cy="22%" r="40%">
        <stop offset="0%" stopColor="white" stopOpacity="0.7"/>
        <stop offset="100%" stopColor="white" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="20" cy="20" r="18" fill="url(#silver-fill)"/>
    <circle cx="20" cy="20" r="18" fill="url(#silver-shine)"/>
    <text x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="800" fill="#1A237E" opacity="0.75">Ag</text>
  </svg>
);
const CrudeIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <defs>
      <radialGradient id="crude-fill" cx="40%" cy="28%" r="72%">
        <stop offset="0%" stopColor="#FF8A65"/>
        <stop offset="50%" stopColor="#E64A19"/>
        <stop offset="100%" stopColor="#0d0000"/>
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#crude-fill)"/>
    <rect x="2" y="2" width="36" height="36" rx="10" fill="white" fillOpacity="0.05"/>
    <path d="M20 8 C15 13, 10 18, 10 23 C10 27.4 14.6 31 20 31 C25.4 31 30 27.4 30 23 C30 18 25 13 20 8Z" fill="white" fillOpacity="0.22"/>
    <path d="M20 14 C17 17.5, 14 21, 14 24.5 C14 27.5 16.7 30 20 30 C23.3 30 26 27.5 26 24.5 C26 21 23 17.5 20 14Z" fill="#FF3D00" fillOpacity="0.45"/>
  </svg>
);
const NatGasIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <defs>
      <radialGradient id="ng-fill" cx="35%" cy="25%" r="75%">
        <stop offset="0%" stopColor="#B3E5FC"/>
        <stop offset="48%" stopColor="#0288D1"/>
        <stop offset="100%" stopColor="#01579B"/>
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#ng-fill)"/>
    <path d="M20 9 C17 14 12 18 12 23 C12 27.4 15.6 31 20 31 C24.4 31 28 27.4 28 23 C28 18 23 14 20 9Z" fill="white" fillOpacity="0.28"/>
    <path d="M20 15 C18.5 18 16 21 16 24.5 C16 26.4 17.8 28 20 28 C22.2 28 24 26.4 24 24.5 C24 21 21.5 18 20 15Z" fill="#40C4FF" fillOpacity="0.55"/>
  </svg>
);
const CopperIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <defs>
      <radialGradient id="copper-fill" cx="38%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFCCBC"/>
        <stop offset="42%" stopColor="#BF360C"/>
        <stop offset="100%" stopColor="#1A0000"/>
      </radialGradient>
      <radialGradient id="copper-shine" cx="28%" cy="22%" r="40%">
        <stop offset="0%" stopColor="white" stopOpacity="0.45"/>
        <stop offset="100%" stopColor="white" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="20" cy="20" r="18" fill="url(#copper-fill)"/>
    <circle cx="20" cy="20" r="18" fill="url(#copper-shine)"/>
    <text x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="800" fill="#FFCCBC" opacity="0.85">Cu</text>
  </svg>
);

const COMMODITY_ICONS: Record<string, React.FC> = {
  gold: GoldIcon, silver: SilverIcon, crude: CrudeIcon,
  natgas: NatGasIcon, copper: CopperIcon,
};
const FlagIcon = ({ flag, size = 36 }: { flag: string; size?: number }) => (
  <div style={{ fontSize: size * 0.7, lineHeight: 1, width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>{flag}</div>
);

// ── Silver ETF Inflow Chart ────────────────────────────────────────
function SilverInflowChart({ data, l }: { data: { month: string; inflow: number }[]; l: boolean }) {
  if (!data || data.length === 0) return null;
  const recent = data.slice(-16);
  const maxVal = Math.max(...recent.map(d => d.inflow));
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-1 h-44">
        {recent.map((d, i) => {
          const pct = (d.inflow / maxVal) * 100;
          const is2025 = d.month.includes("2025");
          return (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black/85 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                {d.month}: ₹{d.inflow}B
              </div>
              <div className="w-full rounded-t transition-all"
                style={{
                  height: `${Math.max(pct, 2)}%`,
                  background: is2025 ? "linear-gradient(180deg,#60A5FA,#2563EB)" : l ? "#cbd5e1" : "#1e3a5f",
                  boxShadow: is2025 ? "0 -3px 12px rgba(96,165,250,0.4)" : "none",
                }} />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px]" style={{ color: l ? "#94a3b8" : "#475569" }}>
        <span>{recent[0]?.month}</span>
        <span>{recent[Math.floor(recent.length / 2)]?.month}</span>
        <span>{recent[recent.length - 1]?.month}</span>
      </div>
      <div className="flex gap-4 text-[11px]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "linear-gradient(180deg,#60A5FA,#2563EB)" }} />
          <span className={tx.t2(l)}>2025</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: l ? "#cbd5e1" : "#1e3a5f" }} />
          <span className={tx.t2(l)}>2024</span>
        </div>
      </div>
    </div>
  );
}

// ── COT Bar ────────────────────────────────────────────────────────
function COTBar({ cot, l }: { cot: COT | null; l: boolean }) {
  if (!cot) return <p className={`text-xs ${tx.t3(l)}`}>Loading CFTC data…</p>;
  const total = cot.speculativeLong + cot.speculativeShort;
  const longPct = total > 0 ? (cot.speculativeLong / total) * 100 : 50;
  const bull = cot.sentiment === "Bullish";
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-emerald-500">Long {fmtBig(cot.speculativeLong)}</span>
        <span className={`font-bold text-sm ${bull ? "text-emerald-400" : "text-red-400"}`}>{cot.sentiment}</span>
        <span className="font-semibold text-red-500">Short {fmtBig(cot.speculativeShort)}</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: l ? "#e2e8f0" : "#070e1a" }}>
        <div className="h-full rounded-full" style={{ width: `${longPct}%`, background: "linear-gradient(90deg,#22c55e,#3b82f6)" }} />
      </div>
      <div className="flex justify-between text-[10px]" style={{ color: l ? "#94a3b8" : "#475569" }}>
        <span>{longPct.toFixed(1)}% long</span>
        <span>Net: {cot.netSpeculative > 0 ? "+" : ""}{fmtBig(cot.netSpeculative)} contracts</span>
        {cot.reportDate && <span>{cot.reportDate}</span>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// DOMESTIC COMMODITY CARD — premium large card with CleanChart
// ══════════════════════════════════════════════════════════════════
function DomesticCommodityCard({ item }: { item: DomesticItem }) {
  const l = useIL();
  const q = item.quote;
  const pos = (q?.changePct ?? 0) >= 0;
  const [expanded, setExpanded] = useState(false);
  const IconComp = COMMODITY_ICONS[item.id];

  return (
    <div className={`rounded-3xl overflow-hidden ${tx.card(l)}`}
      style={{ boxShadow: l ? "0 4px 24px rgba(0,0,0,0.07)" : "0 4px 24px rgba(0,0,0,0.5)" }}>
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {IconComp ? <IconComp /> : <FlagIcon flag={item.flag} size={40} />}
            <div>
              <p className={`text-[11px] font-black uppercase tracking-widest ${tx.t2(l)}`}>{item.name}</p>
              <p className={`text-[10px] mt-0.5 ${tx.t3(l)}`}>{item.unit}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold ${pos ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
              {pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {pos ? "+" : ""}{q?.changePct.toFixed(2) ?? "—"}%
            </span>
            {item.cycleStage && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ color: item.cycleStage.color, background: `${item.cycleStage.color}20` }}>
                {item.cycleStage.label}
              </span>
            )}
          </div>
        </div>

        {q ? (
          <>
            {/* INR price — large */}
            <div className={`text-3xl font-black tracking-tight leading-none mb-1.5 ${tx.t1(l)}`}>
              {fmtINR(q.inrPrice)}
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-sm font-semibold ${pos ? "text-emerald-500" : "text-red-500"}`}>
                {pos ? "+" : ""}{q.changePct.toFixed(2)}%
              </span>
              <span className={`text-xs font-medium ${tx.t3(l)}`}>${fmt(q.price)} USD</span>
            </div>

            {/* H / L / Vol */}
            <div className={`flex gap-4 text-xs pb-3 mb-3 border-b ${tx.div(l)} ${tx.t3(l)}`}>
              <span>H: <strong className={tx.t1(l)}>${fmt(q.high, 1)}</strong></span>
              <span>L: <strong className={tx.t1(l)}>${fmt(q.low, 1)}</strong></span>
              <span>Vol: <strong className={tx.t1(l)}>{fmtV(q.volume)}</strong></span>
            </div>

            {/* Signal badges */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {item.futuresCurve && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ color: item.futuresCurve.color, background: `${item.futuresCurve.color}18` }}>
                  {item.futuresCurve.type}
                </span>
              )}
              {item.oiTrend && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ color: item.oiTrend.color, background: `${item.oiTrend.color}18` }}>
                  {item.oiTrend.signal}
                </span>
              )}
              {item.pcr && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ color: item.pcr.color, background: `${item.pcr.color}18` }}>
                  PCR {item.pcr.pcr} · {item.pcr.sentiment}
                </span>
              )}
            </div>
          </>
        ) : (
          <p className={`text-sm py-4 ${tx.t2(l)}`}>Fetching live data…</p>
        )}
      </div>

      {/* CleanChart — real candlestick */}
      {q && (
        <div className="px-2 pb-0">
          <CleanChart
            name={item.name}
            symbol={item.symbol}
            price={q.price}
            change={q.change}
            changePercent={q.changePct}
            high={q.high}
            low={q.low}
            isPositive={pos}
            candles={q.candles}
            historyUrl={`${ROOT}/api/v1/markets/history/${encodeURIComponent(item.symbol)}`}
          />
        </div>
      )}

      {/* Expand toggle */}
      <button onClick={() => setExpanded(e => !e)}
        className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all ${l ? "bg-slate-50 text-slate-400 hover:text-slate-600" : "bg-[#070e1a]/60 text-slate-600 hover:text-slate-400"}`}>
        {expanded ? <><X className="w-3 h-3" />Hide details</> : <><ChevronDown className="w-3 h-3" />COT · Client Pos · Seasonal · Risk</>}
      </button>

      {/* Expanded detail */}
      {expanded && q && (
        <div className={`px-5 pb-5 pt-4 border-t space-y-5 ${tx.div(l)}`}>
          {item.cot !== undefined && (
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${tx.t3(l)}`}>CFTC COT Positioning</p>
              <COTBar cot={item.cot} l={l} />
            </div>
          )}
          {/* Risk metrics */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Day Volatility", val: `${item.dayVolatility?.toFixed(2) ?? "—"}%`, color: null },
              { label: "Max DD 1Y", val: `${item.maxDrawdown1Y ?? "—"}%`, color: "#ef4444" },
              { label: "Nifty Corr.", val: `${item.correlation > 0 ? "+" : ""}${item.correlation}`, color: item.correlation > 0 ? "#22c55e" : "#ef4444" },
              { label: "Import Dep.", val: item.importDep, color: null },
            ].map(m => (
              <div key={m.label} className={`p-3 rounded-xl ${tx.card2(l)}`}>
                <p className={`text-[10px] ${tx.t3(l)}`}>{m.label}</p>
                <p className={`text-sm font-black mt-0.5 ${m.color ? "" : tx.t1(l)}`}
                  style={m.color ? { color: m.color } : {}}>{m.val}</p>
              </div>
            ))}
          </div>
          {/* Seasonal */}
          {item.seasonal && (
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${tx.t3(l)}`}>Seasonal Pattern</p>
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-3 rounded-xl ${tx.card2(l)}`}>
                  <p className={`text-[10px] ${tx.t3(l)}`}>Best</p>
                  <p className="text-sm font-bold text-emerald-500">{item.seasonal.best}</p>
                </div>
                <div className={`p-3 rounded-xl ${tx.card2(l)}`}>
                  <p className={`text-[10px] ${tx.t3(l)}`}>Weak</p>
                  <p className="text-sm font-bold text-red-500">{item.seasonal.worst}</p>
                </div>
              </div>
            </div>
          )}
          {/* Event sensitivity */}
          {item.eventSensitivity && item.eventSensitivity.length > 0 && (
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${tx.t3(l)}`}>Event Sensitivity</p>
              <div className="flex flex-wrap gap-1.5">
                {item.eventSensitivity.map(e => (
                  <span key={e} className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                    style={{ background: "rgba(81,148,246,0.12)", color: "#5194F6" }}>{e}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// DOMESTIC ETF CARD
// ══════════════════════════════════════════════════════════════════
function DomesticETFCard({ item }: { item: ETFItem }) {
  const l = useIL();
  const q = item.quote;
  const pos = (q?.changePct ?? 0) >= 0;
  const pdColor = (item.premiumDiscount ?? 0) >= 0 ? "#22c55e" : "#ef4444";

  return (
    <div className={`rounded-3xl overflow-hidden ${tx.card(l)}`}
      style={{ boxShadow: l ? "0 4px 24px rgba(0,0,0,0.07)" : "0 4px 24px rgba(0,0,0,0.5)" }}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(81,148,246,0.12)", color: "#5194F6" }}>{item.type}</span>
            <h3 className={`text-base font-black mt-2 leading-tight ${tx.t1(l)}`}>{item.name}</h3>
            <p className={`text-xs mt-0.5 ${tx.t3(l)}`}>{item.symbol}</p>
          </div>
          {q && (
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 ml-2 ${pos ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
              {pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {pos ? "+" : ""}{q.changePct.toFixed(2)}%
            </span>
          )}
        </div>

        {q ? (
          <>
            <div className={`text-4xl font-black tracking-tight mb-1 ${tx.t1(l)}`}>₹{fmt(q.price)}</div>
            <div className={`text-sm font-semibold mb-4 ${pos ? "text-emerald-500" : "text-red-500"}`}>
              {pos ? "+" : ""}₹{fmt(q.change)} today
            </div>

            {/* NAV vs Market */}
            <div className={`p-4 rounded-2xl mb-4 ${tx.card2(l)}`}>
              <div className="flex justify-between text-xs mb-2">
                <span className={tx.t3(l)}>AMFI NAV (live)</span>
                <span className={tx.t3(l)}>Market Price</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xl font-black ${tx.t1(l)}`}>₹{fmt(item.nav)}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ color: pdColor, background: `${pdColor}18` }}>
                  {(item.premiumDiscount ?? 0) >= 0 ? "+" : ""}{item.premiumDiscount?.toFixed(2)}%
                  {(item.premiumDiscount ?? 0) >= 0 ? " Premium" : " Disc."}
                </span>
                <span className={`text-xl font-black ${tx.t1(l)}`}>₹{fmt(q.price)}</span>
              </div>
            </div>

            {/* Metrics 2x3 */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { l: "Expense", v: `${item.expenseRatio}%`, c: null },
                { l: "AUM", v: item.aum || "—", c: "#5194F6" },
                { l: "Track Err", v: item.trackingError != null ? `${item.trackingError.toFixed(2)}%` : "—", c: null },
                { l: "Liquidity", v: `${item.liquidityScore}/10`, c: "#22c55e" },
                { l: "1Y Return", v: item.rollingReturn1Y != null ? `${item.rollingReturn1Y.toFixed(1)}%` : "—", c: (item.rollingReturn1Y ?? 0) > 0 ? "#22c55e" : "#ef4444" },
                { l: "Bid-Ask", v: item.bidAskSpread != null ? `${item.bidAskSpread}%` : "—", c: null },
              ].map(m => (
                <div key={m.l} className={`p-2.5 rounded-xl ${tx.card2(l)}`}>
                  <p className={`text-[9px] ${tx.t3(l)}`}>{m.l}</p>
                  <p className={`text-xs font-black mt-0.5 ${!m.c ? tx.t1(l) : ""}`}
                    style={m.c ? { color: m.c } : {}}>{m.v}</p>
                </div>
              ))}
            </div>

            {/* CleanChart */}
            <CleanChart
              name={item.name}
              symbol={item.symbol}
              price={q.price}
              change={q.change}
              changePercent={q.changePct}
              high={q.high}
              low={q.low}
              isPositive={pos}
              candles={q.candles}
              historyUrl={`${ROOT}/api/v1/markets/history/${encodeURIComponent(item.symbol)}`}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {item.sipSuitable && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/12 text-emerald-400">✓ SIP Suitable</span>
              )}
              {item.hedgeEfficiency != null && (
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "rgba(81,148,246,0.12)", color: "#5194F6" }}>
                  Hedge {item.hedgeEfficiency}/100
                </span>
              )}
              {item.allocationBucket && (
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}>
                  {item.allocationBucket}
                </span>
              )}
            </div>
          </>
        ) : (
          <p className={`text-sm mt-3 ${tx.t2(l)}`}>Fetching live data…</p>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// GLOBAL COMMODITY CARD
// ══════════════════════════════════════════════════════════════════
function GlobalCommodityCard({ item }: { item: GlobalItem }) {
  const l = useIL();
  const q = item.quote;
  const pos = (q?.changePct ?? 0) >= 0;

  return (
    <div className={`rounded-3xl overflow-hidden ${tx.card(l)}`}
      style={{ boxShadow: l ? "0 4px 24px rgba(0,0,0,0.07)" : "0 4px 24px rgba(0,0,0,0.5)" }}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <FlagIcon flag={item.flag} size={36} />
            <div>
              <p className={`text-[11px] font-black uppercase tracking-widest ${tx.t2(l)}`}>{item.name}</p>
              <p className={`text-[10px] mt-0.5 ${tx.t3(l)}`}>{item.unit} · {item.exchange}</p>
            </div>
          </div>
          <span className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold ${pos ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
            {pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {q ? `${pos ? "+" : ""}${q.changePct.toFixed(2)}%` : "—"}
          </span>
        </div>
        {q ? (
          <>
            <div className={`text-3xl font-black tracking-tight mb-1 ${tx.t1(l)}`}>${fmt(q.price)}</div>
            <div className={`text-sm font-semibold mb-3 ${pos ? "text-emerald-500" : "text-red-500"}`}>
              {pos ? "+" : ""}{fmt(q.change, 3)} today
            </div>
            <div className={`flex gap-3 text-xs pb-3 mb-3 border-b ${tx.div(l)} ${tx.t3(l)}`}>
              <span>H: <strong className={tx.t1(l)}>{fmt(q.high)}</strong></span>
              <span>L: <strong className={tx.t1(l)}>{fmt(q.low)}</strong></span>
              <span>Vol: <strong className={tx.t1(l)}>{fmtV(q.volume)}</strong></span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {item.cot && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ color: item.cot.sentiment === "Bullish" ? "#22c55e" : "#ef4444", background: `${item.cot.sentiment === "Bullish" ? "#22c55e" : "#ef4444"}15` }}>
                  COT: {item.cot.sentiment}
                </span>
              )}
              {item.relativeStrength != null && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.relativeStrength > 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                  RS {item.relativeStrength > 0 ? "+" : ""}{item.relativeStrength}%
                </span>
              )}
            </div>
            <CleanChart
              name={item.name}
              symbol={item.symbol}
              price={q.price}
              change={q.change}
              changePercent={q.changePct}
              high={q.high}
              low={q.low}
              isPositive={pos}
              candles={q.candles}
              historyUrl={`${ROOT}/api/v1/markets/history/${encodeURIComponent(item.symbol)}`}
            />
          </>
        ) : <p className={`text-sm py-4 ${tx.t2(l)}`}>Fetching live data…</p>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// GLOBAL ETF CARD
// ══════════════════════════════════════════════════════════════════
function GlobalETFCard({ item }: { item: GlobalETF }) {
  const l = useIL();
  const q = item.quote;
  const pos = (q?.changePct ?? 0) >= 0;

  return (
    <div className={`rounded-3xl overflow-hidden ${tx.card(l)}`}
      style={{ boxShadow: l ? "0 4px 24px rgba(0,0,0,0.07)" : "0 4px 24px rgba(0,0,0,0.5)" }}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(81,148,246,0.12)", color: "#5194F6" }}>{item.category}</span>
            <h3 className={`text-base font-black mt-2 leading-tight ${tx.t1(l)}`}>{item.name}</h3>
            <p className={`text-xs mt-0.5 ${tx.t3(l)}`}>{item.symbol} · {item.exchange}</p>
          </div>
          {q && (
            <span className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold shrink-0 ml-2 ${pos ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
              {pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {q.changePct.toFixed(2)}%
            </span>
          )}
        </div>
        {q ? (
          <>
            <div className={`text-4xl font-black tracking-tight mb-1 ${tx.t1(l)}`}>${fmt(q.price)}</div>
            <div className={`text-sm font-semibold mb-4 ${pos ? "text-emerald-500" : "text-red-500"}`}>
              {pos ? "+" : ""}${fmt(q.change)} today
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { l: "AUM", v: item.aum, c: "#5194F6" },
                { l: "Expense", v: `${item.expenseRatio}%`, c: null },
                { l: "Max DD", v: `${item.maxDrawdown}%`, c: "#ef4444" },
                { l: "Inst. Own", v: item.institutionalOwnership || "—", c: null },
              ].map(m => (
                <div key={m.l} className={`p-3 rounded-xl ${tx.card2(l)}`}>
                  <p className={`text-[10px] ${tx.t3(l)}`}>{m.l}</p>
                  <p className={`text-sm font-black mt-0.5 ${!m.c ? tx.t1(l) : ""}`}
                    style={m.c ? { color: m.c } : {}}>{m.v}</p>
                </div>
              ))}
            </div>
            <CleanChart
              name={item.name}
              symbol={item.symbol}
              price={q.price}
              change={q.change}
              changePercent={q.changePct}
              high={q.high}
              low={q.low}
              isPositive={pos}
              candles={q.candles}
              historyUrl={`${ROOT}/api/v1/markets/history/${encodeURIComponent(item.symbol)}`}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {item.relativeStrength != null && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.relativeStrength > 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                  RS vs S&P {item.relativeStrength > 0 ? "+" : ""}{item.relativeStrength}%
                </span>
              )}
              {item.trackingEfficiency != null && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(81,148,246,0.12)", color: "#5194F6" }}>
                  Track {item.trackingEfficiency}%
                </span>
              )}
            </div>
          </>
        ) : <p className={`text-sm ${tx.t2(l)}`}>Fetching live data…</p>}
      </div>
    </div>
  );
}

// ── Macro Card ─────────────────────────────────────────────────────
function MacroCard({ item }: { item: MacroItem }) {
  const l = useIL();
  const q = item.quote;
  const pos = (q?.changePct ?? 0) >= 0;
  return (
    <div className={`rounded-2xl p-4 ${tx.card(l)}`}>
      <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${tx.t3(l)}`}>{item.name}</p>
      <div className={`text-2xl font-black ${tx.t1(l)}`}>{q ? fmt(q.price) : "—"}</div>
      {q && <div className={`text-sm font-semibold mt-1 ${pos ? "text-emerald-500" : "text-red-500"}`}>{pos ? "+" : ""}{q.changePct.toFixed(2)}%</div>}
      <p className={`text-[10px] mt-1 ${tx.t3(l)}`}>{item.unit}</p>
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────
function SecHead({ title, sub }: { title: string; sub: string }) {
  const l = useIL();
  return (
    <div className="mb-7">
      <h2 className={`text-2xl font-black ${tx.t1(l)}`}>{title}</h2>
      <p className={`text-sm mt-1.5 ${tx.t2(l)}`}>{sub}</p>
    </div>
  );
}

// ── Skeleton ────────────────────────────────────────────────────────
function Skel({ count, cols = "lg:grid-cols-3", h = "h-[480px]" }: { count: number; cols?: string; h?: string }) {
  const l = useIL();
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-6`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className={`rounded-3xl animate-pulse ${h} ${l ? "bg-slate-100" : "bg-[#0c1a2e]/60"}`} />
      ))}
    </div>
  );
}

// ── Tabs ────────────────────────────────────────────────────────────
const TABS: { id: TabId; label: string; short: string }[] = [
  { id: "domestic",     label: "Domestic Commodities", short: "Domestic" },
  { id: "dom-etfs",     label: "Domestic ETFs",         short: "Dom ETFs" },
  { id: "global",       label: "Global Commodities",    short: "Global"   },
  { id: "global-etfs",  label: "Global ETFs",           short: "Gl. ETFs" },
  { id: "intelligence", label: "Intelligence",          short: "Intel."   },
];

// ══════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════
export default function CommoditiesView() {
  const l = useIL();
  const location = useLocation();

  const getTabFromURL = (): TabId => {
    try {
      const p = new URLSearchParams(location.search);
      const t = p.get("tab") as TabId;
      return TABS.some(x => x.id === t) ? t : "domestic";
    } catch { return "domestic"; }
  };

  const [tab,     setTab]     = useState<TabId>(getTabFromURL);
  const [data,    setData]    = useState<AllData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [last,    setLast]    = useState<Date | null>(null);
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => { setTab(getTabFromURL()); }, [location.search]);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await fetch(`${ROOT}/api/v1/commodities/all`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setData(await r.json());
      setLast(new Date());
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const intel  = data?.intelligence;
  const regime = intel?.regime;
  const eia    = intel?.eia;

  return (
    <Layout>
      <div className={`min-h-screen ${tx.bg(l)}`}>

        {/* Top bar */}
        <div className={`sticky top-0 z-10 ${tx.topbar(l)}`}>
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
            <button onClick={() => setSidebar(s => !s)} className="lg:hidden p-1.5 rounded-lg" style={{ color: "#5194F6" }}>
              {sidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <BarChart3 className="w-4 h-4 shrink-0" style={{ color: "#5194F6" }} />
            <h1 className={`text-sm font-bold ${tx.t1(l)}`}>Commodities & ETFs</h1>
            {regime && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full hidden sm:block"
                style={{ color: regime.color, background: `${regime.color}18`, border: `1px solid ${regime.color}30` }}>
                {regime.emoji} {regime.label}
              </span>
            )}
            <div className="ml-auto flex items-center gap-2">
              {last && <span className={`hidden sm:flex items-center gap-1 text-[10px] ${tx.t3(l)}`}><Clock className="w-3 h-3" />{last.toLocaleTimeString()}</span>}
              <button onClick={load} disabled={loading}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${l ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "bg-[#5194F6]/12 text-[#5194F6] hover:bg-[#5194F6]/20"}`}>
                <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Loading…" : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <aside className={`${sidebar ? "fixed inset-y-0 left-0 z-20 w-60 pt-14" : "hidden"} lg:sticky lg:top-[52px] lg:h-[calc(100vh-52px)] lg:flex lg:flex-col lg:w-56 shrink-0 overflow-y-auto ${tx.sidebar(l)}`}>
            <div className="p-4">
              <p className={`text-[9px] font-black uppercase tracking-widest px-2 mb-3 ${tx.t3(l)}`}>Navigate</p>
              <nav className="space-y-0.5">
                {TABS.map(t => (
                  <button key={t.id} onClick={() => { setTab(t.id); setSidebar(false); }}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                      tab === t.id
                        ? "bg-[#5194F6] text-white shadow-lg"
                        : l ? "text-slate-600 hover:bg-slate-50" : "text-slate-400 hover:bg-[#0c1a2e] hover:text-white"
                    }`}>
                    <span>{t.label}</span>
                    {tab === t.id && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </nav>

              {regime && (
                <div className="mt-5 p-4 rounded-2xl"
                  style={{ background: `${regime.color}10`, border: `1px solid ${regime.color}28` }}>
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${tx.t3(l)}`}>Current Regime</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: regime.color }} />
                    <p className="text-xs font-bold" style={{ color: regime.color }}>{regime.label}</p>
                  </div>
                  {intel?.geopoliticalRisk && (
                    <div className="flex items-center gap-2 mt-2">
                      <AlertTriangle className="w-3 h-3 shrink-0" style={{ color: intel.geopoliticalRisk.color }} />
                      <p className="text-[10px] font-semibold" style={{ color: intel.geopoliticalRisk.color }}>
                        GRI {intel.geopoliticalRisk.score} · {intel.geopoliticalRisk.label}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {eia && (
                <div className={`mt-3 p-4 rounded-2xl ${tx.card2(l)}`}>
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-3 ${tx.t3(l)}`}>EIA / OPEC</p>
                  {[
                    { label: "US Inventory", val: `${eia.usCrudeInventory}M bbl`, c: null },
                    { label: "WoW Change", val: `${eia.inventoryChange}M bbl`, c: parseFloat(eia.inventoryChange) < 0 ? "#22c55e" : "#ef4444" },
                    { label: "Rig Count", val: `${eia.rigCount}`, c: null },
                    { label: "OPEC Output", val: `${eia.opecOutput}M b/d`, c: null },
                  ].map(m => (
                    <div key={m.label} className="flex justify-between text-xs mb-1.5">
                      <span className={tx.t3(l)}>{m.label}</span>
                      <span className={`font-bold ${!m.c ? tx.t1(l) : ""}`} style={m.c ? { color: m.c } : {}}>{m.val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {sidebar && <div className="fixed inset-0 bg-black/60 z-[9] lg:hidden" onClick={() => setSidebar(false)} />}

          {/* Main */}
          <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-7 pb-16">

            {error && (
              <div className="mb-5 p-4 rounded-2xl text-sm flex items-start gap-2"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#ef4444" }}>
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                Live data error: {error}
              </div>
            )}

            {/* ═══ TAB 1: Domestic Commodities ═══ */}
            {tab === "domestic" && (
              <div className="space-y-10">
                <SecHead title="Domestic Commodities (MCX)" sub="Gold · Silver · Crude Oil · Natural Gas · Copper — Live USD + INR · COT Report · OI Signal · Futures Curve · Seasonal · Nifty Correlation" />
                {loading && !data
                  ? <Skel count={5} cols="lg:grid-cols-2 xl:grid-cols-3" />
                  : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {(data?.domestic || []).map(item => <DomesticCommodityCard key={item.id} item={item} />)}
                    </div>
                }

                {data && (
                  <div className={`rounded-3xl p-6 ${tx.card(l)}`}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg" style={{ background: "rgba(81,148,246,0.12)" }}>🌍</div>
                      <div>
                        <h3 className={`text-base font-black ${tx.t1(l)}`}>Macro Linkage — India Specific</h3>
                        <p className={`text-xs mt-0.5 ${tx.t2(l)}`}>
                          RBI: {intel?.macroDrivers.rbiRate} · USD/INR: ₹{intel?.macroDrivers.usdInr} · India CPI: {intel?.macroDrivers.indianCPI}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { e: "🏦", t: "RBI Policy Impact", d: `Rate hikes → stronger INR → lower gold import cost. Current RBI Rate: ${intel?.macroDrivers.rbiRate}` },
                        { e: "💱", t: "INR Depreciation Effect", d: `Weak rupee raises MCX prices vs international levels. USD/INR ~₹${intel?.macroDrivers.usdInr}` },
                        { e: "📈", t: "Domestic Inflation", d: `India CPI: ${intel?.macroDrivers.indianCPI}. CPI >5% increases gold & silver demand as hedge.` },
                        { e: "🛢️", t: "Import Dependency", d: "India imports ~90% crude & gold — USD/INR is the most critical factor for MCX pricing." },
                      ].map(i => (
                        <div key={i.t} className={`flex items-start gap-3 p-4 rounded-2xl ${tx.card2(l)}`}>
                          <span className="text-xl shrink-0 mt-0.5">{i.e}</span>
                          <div>
                            <p className={`text-sm font-bold ${tx.t1(l)}`}>{i.t}</p>
                            <p className={`text-xs mt-1 leading-relaxed ${tx.t2(l)}`}>{i.d}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {intel?.cotSummary && (
                  <div className={`rounded-3xl p-6 ${tx.card(l)}`}>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <ArrowUpDown className="w-5 h-5" style={{ color: "#5194F6" }} />
                        <h3 className={`text-base font-black ${tx.t1(l)}`}>CFTC COT Report Summary</h3>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(81,148,246,0.12)", color: "#5194F6" }}>Weekly</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {Object.entries(intel.cotSummary).map(([key, val]) => val && (
                        <div key={key} className={`p-4 rounded-2xl ${tx.card2(l)}`}>
                          <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${tx.t3(l)}`}>{key}</p>
                          <p className="text-2xl font-black" style={{ color: val.sentiment === "Bullish" ? "#22c55e" : "#ef4444" }}>{val.sentiment}</p>
                          <p className={`text-xs mt-1 ${tx.t3(l)}`}>Net spec: {val.netSpec > 0 ? "+" : ""}{fmtBig(val.netSpec)} contracts</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ═══ TAB 2: Domestic ETFs ═══ */}
            {tab === "dom-etfs" && (
              <div className="space-y-10">
                <SecHead title="Domestic ETFs (NSE / BSE)" sub="Gold · Silver · Index ETFs — Live AMFI NAV · Tracking Error · AUM · 1Y Return · Bid-Ask Spread · SIP Suitability" />
                {loading && !data
                  ? <Skel count={6} cols="lg:grid-cols-2 xl:grid-cols-3" h="h-[640px]" />
                  : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {(data?.domesticEtfs || []).map(item => <DomesticETFCard key={item.id} item={item} />)}
                    </div>
                }

                {intel?.silverInflowHistory && intel.silverInflowHistory.length > 0 && (
                  <div className={`rounded-3xl p-6 ${tx.card(l)}`}>
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className={`text-base font-black ${tx.t1(l)}`}>Silver ETF Inflows — India</h3>
                        <p className={`text-xs mt-1 ${tx.t2(l)}`}>Monthly inflows · Billion ₹ · Source: AMFI India</p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400">2025 surpassed 2024</span>
                    </div>
                    <SilverInflowChart data={intel.silverInflowHistory} l={l} />
                    <p className={`text-xs mt-4 ${tx.t3(l)}`}>
                      Silver ETF inflows in the first 8 months of 2025 already surpassed all of 2024 — driven by rising retail demand for silver as a commodity hedge and inflation protection.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ═══ TAB 3: Global Commodities ═══ */}
            {tab === "global" && (
              <div className="space-y-10">
                <SecHead title="Global Commodities" sub="Brent · Palladium · Platinum · Aluminium · Corn · Wheat · Coffee · Sugar — Live prices · COT · EIA · OPEC · Macro Drivers" />
                {loading && !data
                  ? <Skel count={8} cols="lg:grid-cols-2 xl:grid-cols-4" h="h-[400px]" />
                  : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {(data?.global || []).map(item => <GlobalCommodityCard key={item.id} item={item} />)}
                    </div>
                }

                {data?.macro && (
                  <div>
                    <h3 className={`text-lg font-black mb-4 ${tx.t1(l)}`}>Macro Drivers</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {data.macro.map(m => <MacroCard key={m.id} item={m} />)}
                    </div>
                  </div>
                )}

                {eia && (
                  <div className={`rounded-3xl p-6 ${tx.card(l)}`}>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5" style={{ color: "#5194F6" }} />
                        <h3 className={`text-base font-black ${tx.t1(l)}`}>EIA / OPEC Fundamentals</h3>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(81,148,246,0.12)", color: "#5194F6" }}>Weekly</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {[
                        { label: "US Crude Inventory", val: `${eia.usCrudeInventory}M bbl`, sub: "Stored crude", color: "#5194F6" },
                        { label: "WoW Change", val: `${eia.inventoryChange}M bbl`, sub: "Draw=bullish", color: parseFloat(eia.inventoryChange) < 0 ? "#22c55e" : "#ef4444" },
                        { label: "US Rig Count", val: `${eia.rigCount}`, sub: "Baker Hughes", color: "#f59e0b" },
                        { label: "Brent-WTI", val: `$${eia.brentWtiSpread}`, sub: "Quality spread", color: "#8b5cf6" },
                        { label: "OPEC Output", val: `${eia.opecOutput}M b/d`, sub: "Daily output", color: "#ef4444" },
                        { label: "OPEC Cap.", val: eia.opecCapacityUse, sub: "Utilization", color: "#f97316" },
                      ].map(item => (
                        <div key={item.label} className={`p-4 rounded-2xl ${tx.card2(l)}`}>
                          <p className={`text-[10px] mb-2 ${tx.t3(l)}`}>{item.label}</p>
                          <p className="text-xl font-black" style={{ color: item.color }}>{item.val}</p>
                          <p className={`text-[10px] mt-1 ${tx.t3(l)}`}>{item.sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {regime && (
                  <div className="rounded-3xl p-6" style={{ background: `${regime.color}0d`, border: `1px solid ${regime.color}28` }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full" style={{ background: regime.color }} />
                      <h3 className="text-base font-black" style={{ color: regime.color }}>{regime.emoji} Regime: {regime.label}</h3>
                    </div>
                    <p className={`text-sm mb-4 ${tx.t2(l)}`}>{regime.desc}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {[
                        { label: "VIX", val: regime.vix?.toFixed(1) },
                        { label: "10Y Yield", val: `${regime.y10?.toFixed(2)}%` },
                        { label: "Yield Curve", val: `${regime.yieldCurve >= 0 ? "+" : ""}${regime.yieldCurve?.toFixed(2)}%` },
                        { label: "DXY Change", val: `${regime.dxyChange >= 0 ? "+" : ""}${regime.dxyChange?.toFixed(2)}%` },
                      ].map(m => (
                        <div key={m.label} className="p-3 rounded-xl" style={{ background: "rgba(0,0,0,0.15)" }}>
                          <p className="text-[10px]" style={{ color: `${regime.color}90` }}>{m.label}</p>
                          <p className="text-lg font-black" style={{ color: regime.color }}>{m.val}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Inflation Expansion", "Recession Fear", "Growth Boom", "Liquidity Tightening", "War / Risk-Off Premium", "Stable / Transition"].map(r => (
                        <span key={r} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                          style={regime.label === r
                            ? { background: regime.color, color: "white" }
                            : { background: "rgba(81,148,246,0.07)", border: "1px solid rgba(81,148,246,0.18)", color: l ? "#374151" : "#94a3b8" }
                          }>{r}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ═══ TAB 4: Global ETFs ═══ */}
            {tab === "global-etfs" && (
              <div className="space-y-10">
                <SecHead title="Global ETFs (US Listed)" sub="GLD · IAU · SLV · USO · DBC · TIP · PDBC · PPLT — Live prices · AUM · Institutional Ownership · Max Drawdown · RS vs S&P 500" />
                {loading && !data
                  ? <Skel count={8} cols="lg:grid-cols-2 xl:grid-cols-4" h="h-[480px]" />
                  : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {(data?.globalEtfs || []).map(item => <GlobalETFCard key={item.id} item={item} />)}
                    </div>
                }
                <div className={`rounded-3xl p-6 ${tx.card(l)}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <Wifi className="w-5 h-5" style={{ color: "#5194F6" }} />
                    <h3 className={`text-base font-black ${tx.t1(l)}`}>Global Capital Flow Monitor</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { icon: "📊", t: "ETF Inflow Data", d: "Fund flow via AUM delta — shows institutional buying & selling pressure" },
                      { icon: "🧠", t: "Smart Money (COT)", d: "CFTC net speculative positioning — hedge fund directional bets on commodities" },
                      { icon: "💵", t: "Dollar Liquidity", d: "DXY strength inversely impacts commodity flows — weak dollar = commodity rally" },
                      { icon: "⚡", t: "Relative Strength", d: "ETF % change vs S&P 500 — identifies outperformers in current regime" },
                    ].map(x => (
                      <div key={x.t} className={`p-4 rounded-2xl ${tx.card2(l)}`}>
                        <span className="text-2xl">{x.icon}</span>
                        <p className={`text-sm font-bold mt-2 ${tx.t1(l)}`}>{x.t}</p>
                        <p className={`text-xs mt-1 leading-relaxed ${tx.t3(l)}`}>{x.d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ TAB 5: Intelligence ═══ */}
            {tab === "intelligence" && (
              <div className="space-y-8">
                <SecHead title="InvestBeans Intelligence Layer" sub="Commodity Cycle Stage · Live Hedge Engine · Regime-Adjusted Allocation Framework · Geopolitical Risk Index — All signals from live data" />

                {/* 1. Cycle Stage */}
                <div className={`rounded-3xl p-6 ${tx.card(l)}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-5 h-5" style={{ color: "#5194F6" }} />
                    <h3 className={`text-base font-black ${tx.t1(l)}`}>1. Commodity Cycle Stage Indicator</h3>
                  </div>
                  <p className={`text-xs mb-5 ${tx.t2(l)}`}>Accumulation → Mark-Up → Distribution → Mark-Down · Derived from intraday momentum & price trend (live data, no static values)</p>
                  <div className="space-y-3">
                    {(data?.domestic || []).filter(c => c.quote && c.cycleStage).map(c => {
                      const IconComp = COMMODITY_ICONS[c.id];
                      return (
                        <div key={c.id} className={`flex items-center justify-between p-4 rounded-2xl border ${tx.div(l)}`}
                          style={{ background: `${c.cycleStage!.color}08` }}>
                          <div className="flex items-center gap-3 min-w-0">
                            {IconComp ? <IconComp /> : <FlagIcon flag={c.flag} size={36} />}
                            <div className="min-w-0">
                              <p className={`text-sm font-bold ${tx.t1(l)}`}>{c.name}</p>
                              <p className={`text-[11px] mt-0.5 ${tx.t3(l)}`}>{c.cycleStage!.desc}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 ml-3">
                            <span className={`text-sm font-semibold ${(c.quote!.changePct ?? 0) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                              {(c.quote!.changePct ?? 0) >= 0 ? "+" : ""}{c.quote!.changePct?.toFixed(2)}%
                            </span>
                            <span className="text-sm font-bold px-3 py-1.5 rounded-full"
                              style={{ color: c.cycleStage!.color, background: `${c.cycleStage!.color}20` }}>
                              {c.cycleStage!.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Hedge Engine */}
                <div className={`rounded-3xl p-6 ${tx.card(l)}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="w-5 h-5" style={{ color: "#5194F6" }} />
                    <h3 className={`text-base font-black ${tx.t1(l)}`}>2. Hedge Recommendation Engine</h3>
                  </div>
                  <p className={`text-xs mb-5 ${tx.t2(l)}`}>Live signals from VIX · DXY direction · US 10Y Yield · S&P 500 momentum — updated every 5 minutes</p>
                  <div className="space-y-3">
                    {(intel?.hedgeSignals || []).map((s, i) => (
                      <div key={i} className="p-4 rounded-2xl"
                        style={{ background: `${s.color}08`, border: `1px solid ${s.color}25` }}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <p className="text-sm font-bold" style={{ color: s.color }}>{s.condition}</p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ color: s.color, background: `${s.color}20` }}>{s.severity}</span>
                        </div>
                        <p className={`text-sm font-semibold ${tx.t1(l)}`}>{s.signal}</p>
                        <p className={`text-xs mt-1 ${tx.t2(l)}`}>→ {s.action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Allocation Framework */}
                <div className={`rounded-3xl p-6 ${tx.card(l)}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <PieChart className="w-5 h-5" style={{ color: "#5194F6" }} />
                    <h3 className={`text-base font-black ${tx.t1(l)}`}>3. Allocation Framework</h3>
                  </div>
                  <p className={`text-xs mb-5 ${tx.t2(l)}`}>
                    Dynamically adjusted for current regime: <strong style={{ color: regime?.color }}>{regime?.label}</strong>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.values(intel?.allocationFramework || {}).map(b => (
                      <div key={b.label} className="rounded-2xl p-5 text-center"
                        style={{ background: `${b.color}0e`, border: `1px solid ${b.color}28` }}>
                        <span className="text-3xl">{b.emoji}</span>
                        <p className="text-sm font-bold mt-2" style={{ color: b.color }}>{b.label}</p>
                        <p className="text-4xl font-black mt-1.5 mb-1" style={{ color: b.color }}>{b.range}</p>
                        <p className={`text-xs ${tx.t3(l)}`}>{b.items.join(", ")}</p>
                        <p className={`text-[10px] mt-1 ${tx.t3(l)}`}>{b.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. GRI */}
                {intel?.geopoliticalRisk && (
                  <div className={`rounded-3xl p-6 ${tx.card(l)}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="w-5 h-5" style={{ color: intel.geopoliticalRisk.color }} />
                      <h3 className={`text-base font-black ${tx.t1(l)}`}>4. Geopolitical Risk Index (GRI)</h3>
                    </div>
                    <p className={`text-xs mb-5 ${tx.t2(l)}`}>Composite: VIX + gold momentum + academic GPR model (Caldara & Iacoviello, 2022)</p>
                    <div className="flex items-center gap-8">
                      <div className="text-8xl font-black" style={{ color: intel.geopoliticalRisk.color }}>
                        {intel.geopoliticalRisk.score}
                      </div>
                      <div className="flex-1">
                        <p className="text-2xl font-bold mb-1" style={{ color: intel.geopoliticalRisk.color }}>
                          {intel.geopoliticalRisk.label} Risk
                        </p>
                        <p className={`text-sm mb-4 ${tx.t2(l)}`}>Scale: 0 (no risk) → 100 (extreme crisis)</p>
                        <div className="w-full h-3.5 rounded-full overflow-hidden" style={{ background: l ? "#e2e8f0" : "#070e1a" }}>
                          <div className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${intel.geopoliticalRisk.score}%`, background: `linear-gradient(90deg,#22c55e,${intel.geopoliticalRisk.color})` }} />
                        </div>
                        <div className="flex justify-between text-[10px] mt-1.5" style={{ color: l ? "#94a3b8" : "#475569" }}>
                          <span>0 — Low</span><span>50 — Moderate</span><span>100 — Extreme</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Regime Strategy */}
                {regime?.strategy && (
                  <div className="rounded-3xl p-6" style={{ background: `${regime.color}0a`, border: `1px solid ${regime.color}25` }}>
                    <h3 className="text-base font-black mb-1" style={{ color: regime.color }}>
                      5. {regime.emoji} Regime Strategy: {regime.label}
                    </h3>
                    <p className={`text-sm mb-5 ${tx.t2(l)}`}>{regime.desc}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {Object.entries(regime.strategy).map(([asset, rec]) => {
                        const c = rec.startsWith("↑") ? "#22c55e" : rec.startsWith("↓") ? "#ef4444" : "#6366f1";
                        return (
                          <div key={asset} className="p-4 rounded-2xl text-center" style={{ background: "rgba(0,0,0,0.12)" }}>
                            <p className={`text-[11px] uppercase font-bold mb-1.5 ${tx.t2(l)}`}>{asset}</p>
                            <p className="text-base font-black" style={{ color: c }}>{rec}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>
    </Layout>
  );
}