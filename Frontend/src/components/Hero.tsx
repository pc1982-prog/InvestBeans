'use client';

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "@/controllers/Themecontext";

// ─── Icons ─────────────────────────────────────────────────────────────────────
const PieChartIcon = ({ className, style }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="22" cy="26" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M22 26 L22 11 A15 15 0 0 1 36.3 18.5 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.25" />
    <path d="M22 26 L36.3 18.5 A15 15 0 0 1 34 40 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12" />
    <path d="M30 8 L36 4 L42 8" stroke="currentColor" strokeWidth="2.2" />
    <path d="M36 4 L36 14" stroke="currentColor" strokeWidth="2.2" />
    <circle cx="10" cy="14" r="1.5" fill="currentColor" opacity="0.5" />
  </svg>
);

const GrowthPlantIcon = ({ className, style }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 40 L24 18" stroke="currentColor" strokeWidth="2.2" />
    <path d="M24 28 C20 26, 14 27, 13 22 C12 17, 18 14, 24 20" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.2" />
    <path d="M24 22 C28 20, 34 20, 35 15 C36 10, 30 8, 24 14" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.2" />
    <path d="M14 40 L34 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 14 L25.2 11 L26.4 14 L29.5 14 L27 16 L28.2 19 L24 17 L19.8 19 L21 16 L18.5 14 L21.6 14 Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.35" />
  </svg>
);

const IndexChartIcon = ({ className, style }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 38 L42 38" stroke="currentColor" strokeWidth="2" />
    <path d="M6 38 L6 8" stroke="currentColor" strokeWidth="2" />
    <rect x="10" y="26" width="6" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.2" />
    <rect x="20" y="20" width="6" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.2" />
    <rect x="30" y="14" width="6" height="24" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.2" />
    <path d="M13 25 L23 18 L33 11" stroke="currentColor" strokeWidth="2.2" />
    <circle cx="33" cy="11" r="2.5" fill="currentColor" />
  </svg>
);

// ─── Mini Sparkline SVG ──────────────────────────────────────────────────────
const Sparkline = ({ positive, color }) => {
  const pts = positive
    ? [0,32, 8,28, 16,30, 24,22, 32,18, 40,14, 48,16, 56,10, 64,8, 72,4]
    : [0,4, 8,8, 16,6, 24,14, 32,18, 40,22, 48,20, 56,28, 64,30, 72,34];
  let d = `M${pts[0]},${pts[1]}`;
  for (let i = 2; i < pts.length; i += 2) {
    const cx = pts[i - 2] + (pts[i] - pts[i - 2]) / 2;
    d += ` C${cx},${pts[i - 1]} ${cx},${pts[i + 1]} ${pts[i]},${pts[i + 1]}`;
  }
  const gradId = `sg-${positive ? "up" : "dn"}-${color.replace('#', '')}`;
  return (
    <svg viewBox="0 0 72 40" className="w-full h-10" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={d + ` L72,40 L0,40 Z`} fill={`url(#${gradId})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── 3D Gold Brick SVG Icon ──────────────────────────────────────────────────
const GoldBrickIcon = ({ size = 36 }) => (
  <svg width={size} height={Math.round(size * 0.75)} viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f5d978" /><stop offset="100%" stopColor="#d4a017" /></linearGradient>
      <linearGradient id="goldFront" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8b820" /><stop offset="100%" stopColor="#9a6e00" /></linearGradient>
      <linearGradient id="goldSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#c49a10" /><stop offset="100%" stopColor="#7a5200" /></linearGradient>
    </defs>
    <polygon points="6,8 42,8 46,2 10,2" fill="url(#goldTop)" />
    <polygon points="6,8 42,8 42,30 6,30" fill="url(#goldFront)" />
    <polygon points="42,8 46,2 46,24 42,30" fill="url(#goldSide)" />
    <polygon points="6,8 42,8 46,2 10,2" fill="none" stroke="#f7e080" strokeWidth="0.6" opacity="0.7" />
    <rect x="10" y="11" width="18" height="3" rx="1.5" fill="white" opacity="0.18" />
    <line x1="10" y1="19" x2="38" y2="19" stroke="#7a5200" strokeWidth="0.7" opacity="0.5" />
    <line x1="10" y1="24" x2="38" y2="24" stroke="#7a5200" strokeWidth="0.7" opacity="0.35" />
    <polygon points="6,8 42,8 42,30 6,30" fill="none" stroke="#9a6e00" strokeWidth="0.8" />
    <polygon points="42,8 46,2 46,24 42,30" fill="none" stroke="#7a5200" strokeWidth="0.8" />
    <polygon points="6,8 42,8 46,2 10,2" fill="none" stroke="#c49a10" strokeWidth="0.8" />
  </svg>
);

// ─── 3D Silver Brick SVG Icon ────────────────────────────────────────────────
const SilverBrickIcon = ({ size = 36 }) => (
  <svg width={size} height={Math.round(size * 0.75)} viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="silverTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8eef4" /><stop offset="100%" stopColor="#9db0c0" /></linearGradient>
      <linearGradient id="silverFront" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8d8e4" /><stop offset="100%" stopColor="#607080" /></linearGradient>
      <linearGradient id="silverSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#8090a0" /><stop offset="100%" stopColor="#445060" /></linearGradient>
    </defs>
    <polygon points="6,8 42,8 46,2 10,2" fill="url(#silverTop)" />
    <polygon points="6,8 42,8 42,30 6,30" fill="url(#silverFront)" />
    <polygon points="42,8 46,2 46,24 42,30" fill="url(#silverSide)" />
    <polygon points="6,8 42,8 46,2 10,2" fill="none" stroke="#ddeaf2" strokeWidth="0.6" opacity="0.8" />
    <rect x="10" y="11" width="18" height="3" rx="1.5" fill="white" opacity="0.28" />
    <line x1="10" y1="19" x2="38" y2="19" stroke="#445060" strokeWidth="0.7" opacity="0.5" />
    <line x1="10" y1="24" x2="38" y2="24" stroke="#445060" strokeWidth="0.7" opacity="0.35" />
    <polygon points="6,8 42,8 42,30 6,30" fill="none" stroke="#607080" strokeWidth="0.8" />
    <polygon points="42,8 46,2 46,24 42,30" fill="none" stroke="#445060" strokeWidth="0.8" />
    <polygon points="6,8 42,8 46,2 10,2" fill="none" stroke="#8090a0" strokeWidth="0.8" />
  </svg>
);

// ─── Kite OHLC symbols ────────────────────────────────────────────────────────
// Kite quote API: NSE:INDIA VIX, BSE:SENSEX, NSE:NIFTY 50, NSE:NIFTY BANK
// GIFT NIFTY trades on NSE_INDICES as NSE:NIFTY 50 futures proxy — use NSE:GIFT NIFTY or SGX substitute
// For USD/INR, Gold, Silver we use the existing Yahoo approach (via global endpoint)
// Kite symbols for indices: "NSE:NIFTY 50", "BSE:SENSEX", "NSE:INDIA VIX", "BSE:INDIA VIX"

const KITE_BHARAT_SYMBOLS = [
  "NSE:NIFTY 50",
  "BSE:SENSEX",
  "NSE:INDIA VIX",
  "NSE:NIFTY FIN SERVICE",  // fallback useful
];

// ─── Helper: fetch Kite OHLC/quote ──────────────────────────────────────────
async function fetchKiteQuote(API, symbols) {
  try {
    const qs = symbols.map(s => `i=${encodeURIComponent(s)}`).join("&");
    // Try OHLC first (lighter), fallback to full quote
    let r = await fetch(`${API}/kite/ohlc?${qs}`);
    if (!r.ok) r = await fetch(`${API}/kite/quote?${qs}`);
    const json = await r.json();
    return json?.data || {};
  } catch (_) {
    return {};
  }
}

// ─── SENSEX vs NIFTY Card ───────────────────────────────────────────────────
const SensexNiftyCard = ({ cardBg, cardBorder, isLight, sensex, nifty }) => {
  const fmtVal = (v) => v ? v.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "···";
  const fmtChg = (pct) => pct != null ? `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%` : "···";
  const sensexPos = (sensex?.chg ?? 0) >= 0;
  const niftyPos  = (nifty?.chg  ?? 0) >= 0;

  return (
    <div style={{ background: cardBg, border: cardBorder }} className="rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer md:p-5">
      <div className="md:hidden">
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:"linear-gradient(180deg,#4E91F6,#7ab8fa)", borderRadius:"12px 0 0 12px" }} />
        <div style={{ padding:"10px 10px 10px 14px" }}>
          <div style={{ fontSize:"8px", fontWeight:900, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4E91F6", marginBottom:8 }}>SENSEX · NIFTY 50</div>
          {[
            { label:"SENSEX", val: fmtVal(sensex?.price), chg: fmtChg(sensex?.chg), pos: sensexPos },
            { label:"NIFTY 50", val: fmtVal(nifty?.price), chg: fmtChg(nifty?.chg), pos: niftyPos },
          ].map(row => (
            <div key={row.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:"10px", fontWeight:700, color: isLight ? "#1e3a5f" : "rgba(255,255,255,0.6)" }}>{row.label}</span>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:"14px", fontWeight:800, color: isLight ? "#0d1b2a" : "#fff" }}>{row.val}</span>
                <span style={{ fontSize:"9px", fontWeight:700, color: row.pos ? "#22c55e" : "#ef4444", background: row.pos ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", border: `1px solid ${row.pos ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`, borderRadius:4, padding:"1px 5px" }}>{row.chg}</span>
              </div>
            </div>
          ))}
          <div style={{ marginTop:6, display:"flex", flexDirection:"column", gap:3 }}>
            {[sensexPos, niftyPos].map((pos, i) => (
              <div key={i} style={{ height:3, borderRadius:99, background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)", overflow:"hidden" }}>
                <div style={{ width:`${pos ? 72 : 40}%`, height:"100%", borderRadius:99, background: pos ? "linear-gradient(90deg,#22c55e,#86efac)" : "linear-gradient(90deg,#ef4444,#fca5a5)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="flex items-center gap-1.5 mb-3">
          <span style={{ width:8, height:8, borderRadius:2, background:"#4E91F6", display:"inline-block" }} />
          <span style={{ fontSize:"11px", fontWeight:900, textTransform:"uppercase", letterSpacing:"0.12em", color: isLight ? "#1e3a5f" : "#ffffff" }}>SENSEX vs NIFTY 50</span>
        </div>
        <div className="space-y-2 mb-3">
          {[
            { label:"Sensex", val: fmtVal(sensex?.price), chg: fmtChg(sensex?.chg), pos: sensexPos },
            { label:"Nifty 50", val: fmtVal(nifty?.price), chg: fmtChg(nifty?.chg), pos: niftyPos },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isLight ? "text-navy/70" : "text-white/70"}`}>{row.label}</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-base md:text-lg font-bold ${isLight ? "text-navy" : "text-white"}`}>{row.val}</span>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${row.pos ? "text-emerald-400" : "text-red-400"}`}>
                  {row.pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {row.chg}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Sparkline positive={sensexPos} color="#22c55e" />
      </div>
    </div>
  );
};

// ─── FII vs DII Card ────────────────────────────────────────────────────────
const FiiDiiCard = ({ cardBg, cardBorder, isLight }) => {
  const fiiVal = -1240; const diiVal = 1980;
  const total = Math.abs(fiiVal) + diiVal;
  const fiiPct = Math.round((Math.abs(fiiVal) / total) * 100);
  const diiPct = 100 - fiiPct;
  return (
    <div style={{ background: cardBg, border: cardBorder }} className="rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer md:p-5">
      <div className="md:hidden" style={{ padding:"10px 10px 10px 14px", position:"relative" }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:"linear-gradient(180deg,#ef4444,#a855f7,#22c55e)", borderRadius:"12px 0 0 12px" }} />
        <div style={{ fontSize:"8px", fontWeight:900, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4E91F6", marginBottom:8 }}>FII · DII FLOW</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:8 }}>
          <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"6px 8px" }}>
            <div style={{ fontSize:"8px", fontWeight:700, color:"rgba(239,68,68,0.7)", marginBottom:2 }}>FII SELL</div>
            <div style={{ fontSize:"15px", fontWeight:800, color:"#f87171" }}>₹1,240</div>
            <div style={{ fontSize:"8px", color:"rgba(239,68,68,0.6)", marginTop:2 }}>Cr outflow</div>
          </div>
          <div style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:8, padding:"6px 8px" }}>
            <div style={{ fontSize:"8px", fontWeight:700, color:"rgba(34,197,94,0.7)", marginBottom:2 }}>DII BUY</div>
            <div style={{ fontSize:"15px", fontWeight:800, color:"#4ade80" }}>₹1,980</div>
            <div style={{ fontSize:"8px", color:"rgba(34,197,94,0.6)", marginTop:2 }}>Cr inflow</div>
          </div>
        </div>
        <div style={{ height:5, borderRadius:99, overflow:"hidden", display:"flex", gap:2 }}>
          <div style={{ width:`${fiiPct}%`, background:"linear-gradient(90deg,#ef4444,#f87171)", borderRadius:99 }} />
          <div style={{ flex:1, background:"linear-gradient(90deg,#a855f7,#22c55e)", borderRadius:99 }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
          <span style={{ fontSize:"8px", color:"rgba(248,113,113,0.8)", fontWeight:600 }}>{fiiPct}% selling</span>
          <span style={{ fontSize:"8px", color:"rgba(74,222,128,0.8)", fontWeight:600 }}>{diiPct}% buying</span>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="flex items-center gap-1.5 mb-3">
          <span style={{ width:8, height:8, borderRadius:2, background:"#4E91F6", display:"inline-block" }} />
          <span style={{ fontSize:"11px", fontWeight:900, textTransform:"uppercase", letterSpacing:"0.12em", color: isLight ? "#1e3a5f" : "#ffffff" }}>FII vs DII</span>
        </div>
        <div className="flex justify-between items-end mb-4">
          <div><div className={`text-[11px] font-semibold mb-1 ${isLight ? "text-navy/50" : "text-white/40"}`}>FII</div><div className="text-lg md:text-xl font-bold text-red-400">−₹1,240 Cr</div></div>
          <div className="text-right"><div className={`text-[11px] font-semibold mb-1 ${isLight ? "text-navy/50" : "text-white/40"}`}>DII</div><div className="text-lg md:text-xl font-bold text-emerald-400">+₹1,980 Cr</div></div>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden flex" style={{ background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}>
          <div style={{ width:`${fiiPct}%`, background:"linear-gradient(90deg,#ef4444,#f87171)", borderRadius:"999px 0 0 999px" }} />
          <div style={{ width:`${diiPct}%`, background:"linear-gradient(90deg,#a855f7,#22c55e)", borderRadius:"0 999px 999px 0" }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-red-400/80">{fiiPct}% selling</span>
          <span className="text-[10px] text-emerald-400/80">{diiPct}% buying</span>
        </div>
      </div>
    </div>
  );
};

// ─── India VIX Card ─────────────────────────────────────────────────────────
const IndiaVixCard = ({ cardBg, cardBorder, isLight, vixData }) => {
  const vix = vixData?.price ?? 13.42;
  const vixChange = vixData?.chg ?? -3.10;
  const sliderPct = Math.min(100, Math.max(0, ((vix - 10) / 30) * 100));
  const fearLabel = vix < 15 ? "Low" : vix < 20 ? "Moderate" : "High";
  const fearColor = vix < 15 ? "#22c55e" : vix < 20 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ background: cardBg, border: cardBorder }} className="rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer md:p-5">
      <div className="md:hidden" style={{ padding:"10px 10px 10px 14px", position:"relative" }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:`linear-gradient(180deg,${fearColor},${fearColor}44)`, borderRadius:"12px 0 0 12px" }} />
        <div style={{ fontSize:"8px", fontWeight:900, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4E91F6", marginBottom:6 }}>INDIA VIX</div>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:"32px", fontWeight:900, color: isLight ? "#0d1b2a" : "#fff", letterSpacing:"-0.04em", lineHeight:1 }}>{vix.toFixed ? vix.toFixed(2) : vix}</span>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
            <span style={{ fontSize:"10px", fontWeight:700, color: vixChange < 0 ? "#f87171" : "#4ade80" }}>
              {vixChange < 0 ? "▼" : "▲"} {Math.abs(vixChange).toFixed(2)}%
            </span>
            <span style={{ fontSize:"8px", fontWeight:800, padding:"2px 6px", borderRadius:4, background:`${fearColor}20`, color:fearColor, border:`1px solid ${fearColor}40` }}>Fear: {fearLabel}</span>
          </div>
        </div>
        <div style={{ position:"relative", height:6, borderRadius:99, overflow:"hidden", background:"linear-gradient(90deg,#22c55e,#84cc16,#f59e0b,#ef4444)" }}>
          <div style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", left:`calc(${sliderPct}% - 5px)`, width:10, height:10, background:"#fff", borderRadius:"50%", boxShadow:"0 0 0 2px rgba(0,0,0,0.2)" }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:3 }}>
          <span style={{ fontSize:"8px", color:"rgba(34,197,94,0.7)", fontWeight:600 }}>Low Fear</span>
          <span style={{ fontSize:"8px", color:"rgba(239,68,68,0.7)", fontWeight:600 }}>High Fear</span>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="flex items-center gap-1.5 mb-3">
          <span style={{ width:8, height:8, borderRadius:2, background:"#4E91F6", display:"inline-block" }} />
          <span style={{ fontSize:"11px", fontWeight:900, textTransform:"uppercase", letterSpacing:"0.12em", color: isLight ? "#1e3a5f" : "#ffffff" }}>INDIA VIX</span>
        </div>
        <div className="flex items-end justify-between mb-3">
          <span className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isLight ? "text-navy" : "text-white"}`}>{vix.toFixed ? vix.toFixed(2) : vix}</span>
          <div className="flex flex-col items-end gap-1">
            <span className={`flex items-center gap-1 font-bold text-sm ${vixChange < 0 ? "text-red-400" : "text-emerald-400"}`}>
              {vixChange < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />} {vixChange.toFixed ? vixChange.toFixed(2) : vixChange}%
            </span>
            <span className="text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background:`${fearColor}22`, color:fearColor, border:`1px solid ${fearColor}44` }}>Market Fear: {fearLabel}</span>
          </div>
        </div>
        <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background:"linear-gradient(90deg,#22c55e,#84cc16,#f59e0b,#ef4444)" }}>
          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-slate-300 transition-all duration-700" style={{ left:`calc(${sliderPct}% - 8px)` }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-emerald-400/70">Low Fear</span>
          <span className="text-[9px] text-red-400/70">High Fear</span>
        </div>
      </div>
    </div>
  );
};

// ─── GIFT NIFTY Card ─────────────────────────────────────────────────────────
const GiftNiftyCard = ({ cardBg, cardBorder, isLight, liveGiftNifty, liveGiftChange }) => {
  const price  = liveGiftNifty ?? null;
  const change = liveGiftChange ?? null;
  const pos    = (change ?? 0) >= 0;
  const displayPrice  = price  ? price.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "···";
  const displayChange = change != null ? `${pos ? "▲ +" : "▼ "}${Math.abs(change).toFixed(2)}%` : "···";
  const sentiment     = change == null ? "Loading…" : pos ? "Positive Opening Indicated" : "Negative Opening Indicated";
  return (
    <div style={{ background: cardBg, border: cardBorder }} className="rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer md:p-5">
      <div className="md:hidden" style={{ position:"relative" }}>
        <div style={{ height:3, background:"linear-gradient(90deg,#4E91F6,#7ab8fa,transparent)", borderRadius:"12px 12px 0 0" }} />
        <div style={{ padding:"8px 10px 0 10px" }}>
          <div style={{ fontSize:"8px", fontWeight:900, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4E91F6", marginBottom:4 }}>GIFT NIFTY</div>
          <div style={{ fontSize:"28px", fontWeight:900, color: isLight ? "#0d1b2a" : "#fff", letterSpacing:"-0.03em", lineHeight:1 }}>{displayPrice}</div>
          <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:4, marginBottom:2 }}>
            <span style={{ fontSize:"9px", fontWeight:700, color: pos ? "#4ade80" : "#f87171" }}>{displayChange}</span>
            <span style={{ fontSize:"8px", color: isLight ? "rgba(13,37,64,0.45)" : "rgba(255,255,255,0.4)" }}>{sentiment}</span>
          </div>
        </div>
        <Sparkline positive={pos} color="#4E91F6" />
      </div>
      <div className="hidden md:block">
        <div className="flex items-center gap-1.5 mb-3">
          <span style={{ width:8, height:8, borderRadius:2, background:"#4E91F6", display:"inline-block" }} />
          <span style={{ fontSize:"11px", fontWeight:900, textTransform:"uppercase", letterSpacing:"0.12em", color: isLight ? "#1e3a5f" : "#ffffff" }}>GIFT NIFTY</span>
        </div>
        <div className="flex items-end justify-between mb-1">
          <div>
            <div className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isLight ? "text-navy" : "text-white"}`}>{displayPrice}</div>
            <div className="flex items-center gap-1 mt-1">
              {pos ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> : <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
              <span className={`font-bold text-sm ${pos ? "text-emerald-400" : "text-red-400"}`}>{displayChange}</span>
            </div>
          </div>
        </div>
        <div className={`text-[11px] font-medium mb-2 ${isLight ? "text-navy/50" : "text-white/40"}`}>{sentiment}</div>
        <Sparkline positive={pos} color="#4E91F6" />
      </div>
    </div>
  );
};

// ─── USD/INR Card ────────────────────────────────────────────────────────────
const UsdInrCard = ({ cardBg, cardBorder, isLight, liveValue, liveChange }) => {
  const rate      = liveValue  ?? 84;
  const changeVal = liveChange ?? null;
  const pos       = (changeVal ?? 0) >= 0;
  const sliderPct = Math.min(100, Math.max(0, ((rate - 82) / 8) * 100));
  return (
    <div style={{ background: cardBg, border: cardBorder }} className="rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer md:p-5">
      <div className="md:hidden" style={{ padding:"10px 10px 10px 14px", position:"relative" }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:"linear-gradient(180deg,#3b82f6,#06b6d4)", borderRadius:"12px 0 0 12px" }} />
        <div style={{ fontSize:"8px", fontWeight:900, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4E91F6", marginBottom:5 }}>USD / INR</div>
        <div style={{ display:"flex", alignItems:"baseline", gap:3, marginBottom:4 }}>
          <span style={{ fontSize:"11px", fontWeight:700, color: isLight ? "rgba(13,37,64,0.5)" : "rgba(255,255,255,0.4)" }}>₹</span>
          <span style={{ fontSize:"28px", fontWeight:900, color: isLight ? "#0d1b2a" : "#fff", letterSpacing:"-0.03em", lineHeight:1 }}>{rate.toFixed ? rate.toFixed(2) : rate}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:8 }}>
          <span style={{ fontSize:"9px", fontWeight:700, color: pos ? "#4ade80" : "#f87171" }}>
            {changeVal != null ? `${pos ? "▲ +" : "▼ "}${Math.abs(changeVal).toFixed(2)}%` : "···"}
          </span>
          <span style={{ fontSize:"8px", fontWeight:600, color:"#06b6d4", background:"rgba(6,182,212,0.1)", border:"1px solid rgba(6,182,212,0.25)", borderRadius:3, padding:"1px 5px" }}>
            {changeVal == null ? "Loading…" : pos ? "Rupee Weakening" : "Rupee Strengthening"}
          </span>
        </div>
        <div style={{ position:"relative", height:5, borderRadius:99, overflow:"hidden", background:"linear-gradient(90deg,#3b82f6,#06b6d4,#f59e0b,#ef4444)" }}>
          <div style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", left:`calc(${sliderPct}% - 5px)`, width:10, height:10, background:"#fff", borderRadius:"50%", boxShadow:"0 0 0 2px rgba(0,0,0,0.2)" }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:3 }}>
          <span style={{ fontSize:"8px", color:"rgba(59,130,246,0.7)", fontWeight:600 }}>₹82</span>
          <span style={{ fontSize:"8px", color:"rgba(239,68,68,0.7)", fontWeight:600 }}>₹90</span>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="flex items-center gap-1.5 mb-3">
          <span style={{ width:8, height:8, borderRadius:2, background:"#4E91F6", display:"inline-block" }} />
          <span style={{ fontSize:"11px", fontWeight:900, textTransform:"uppercase", letterSpacing:"0.12em", color: isLight ? "#1e3a5f" : "#ffffff" }}>USD / INR</span>
        </div>
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isLight ? "text-navy" : "text-white"}`}>₹{rate.toFixed ? rate.toFixed(2) : rate}</div>
            <div className="flex items-center gap-1 mt-1">
              {pos ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400"/> : <TrendingDown className="w-3.5 h-3.5 text-red-400"/>}
              <span className={`font-bold text-sm ${pos ? "text-emerald-400" : "text-red-400"}`}>
                {changeVal != null ? `${pos ? "+" : ""}${changeVal.toFixed(2)}%` : "···"}
              </span>
            </div>
          </div>
        </div>
        <div className={`text-[11px] font-medium mb-2 ${isLight ? "text-navy/50" : "text-white/40"}`}>
          {changeVal == null ? "Loading…" : pos ? "Rupee Weakening" : "Rupee Strengthening"}
        </div>
        <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background:"linear-gradient(90deg,#3b82f6,#06b6d4,#f59e0b,#ef4444)" }}>
          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-slate-300 transition-all duration-700" style={{ left:`calc(${sliderPct}% - 8px)` }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-blue-400/70">₹82</span>
          <span className="text-[9px] text-red-400/70">₹90</span>
        </div>
      </div>
    </div>
  );
};

// ─── Gold vs Silver Card ─────────────────────────────────────────────────────
const GoldSilverCard = ({ cardBg, cardBorder, isLight, liveGold, liveGoldChange, liveSilver, liveSilverChange }) => {
  const gold = liveGold ?? null; const silver = liveSilver ?? null;
  const goldChg = liveGoldChange ?? null; const silverChg = liveSilverChange ?? null;
  const goldPos = (goldChg ?? 0) >= 0; const silverPos = (silverChg ?? 0) >= 0;
  const fmtPrice = (v) => v ? `₹${v.toLocaleString("en-IN")}` : "···";
  const fmtChg   = (v, pos) => v != null ? `${pos ? "▲ +" : "▼ "}${Math.abs(v).toFixed(2)}%` : "···";
  return (
    <div style={{ background: cardBg, border: cardBorder }} className="rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer md:p-5">
      <div className="md:hidden" style={{ padding:"10px", position:"relative" }}>
        <div style={{ position:"absolute", top:0, right:0, width:40, height:40, background:"linear-gradient(135deg,rgba(78,145,246,0.13),transparent)", borderRadius:"0 12px 0 40px" }} />
        <div style={{ fontSize:"8px", fontWeight:900, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4E91F6", marginBottom:7 }}>GOLD · SILVER</div>
        {[
          { Icon: GoldBrickIcon, label:"Gold", price: fmtPrice(gold), chg: fmtChg(goldChg, goldPos), pos: goldPos, bar:"linear-gradient(90deg,#C9A84C,#f5d78e)", barW:"72%" },
          { Icon: SilverBrickIcon, label:"Silver", price: fmtPrice(silver), chg: fmtChg(silverChg, silverPos), pos: silverPos, bar:"linear-gradient(90deg,#94a3b8,#cbd5e1)", barW:"58%" },
        ].map(({ Icon, label, price, chg, pos, bar, barW }) => (
          <div key={label}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <Icon size={20} />
                <span style={{ fontSize:"10px", fontWeight:700, color: isLight ? "#1e3a5f" : "rgba(255,255,255,0.7)" }}>{label}</span>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:"13px", fontWeight:800, color: isLight ? "#0d1b2a" : "#fff" }}>{price}</div>
                <div style={{ fontSize:"8px", fontWeight:700, color: pos ? "#4ade80" : "#f87171" }}>{chg}</div>
              </div>
            </div>
            <div style={{ height:3, borderRadius:99, overflow:"hidden", marginBottom:6, background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)" }}>
              <div style={{ width:barW, height:"100%", borderRadius:99, background:bar }} />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block">
        <div className="flex items-center gap-1.5 mb-4">
          <span style={{ width:8, height:8, borderRadius:2, background:"#4E91F6", display:"inline-block" }} />
          <span style={{ fontSize:"11px", fontWeight:900, textTransform:"uppercase", letterSpacing:"0.12em", color: isLight ? "#1e3a5f" : "#ffffff" }}>GOLD vs SILVER</span>
        </div>
        <div className="space-y-3">
          {[
            { Icon: GoldBrickIcon, label:"Gold", price: fmtPrice(gold), chg: fmtChg(goldChg, goldPos), pos: goldPos, bar:"linear-gradient(90deg,#C9A84C,#f5d78e)", barW:"72%" },
            { Icon: SilverBrickIcon, label:"Silver", price: fmtPrice(silver), chg: fmtChg(silverChg, silverPos), pos: silverPos, bar:"linear-gradient(90deg,#94a3b8,#cbd5e1)", barW:"58%" },
          ].map(({ Icon, label, price, chg, pos, bar, barW }) => (
            <div key={label}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Icon size={40} /><span className={`font-semibold text-sm ${isLight ? "text-navy/80" : "text-white/80"}`}>{label}</span></div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-base md:text-lg font-bold ${isLight ? "text-navy" : "text-white"}`}>{price}</span>
                  {pos ? <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0"/> : <TrendingDown className="w-4 h-4 text-red-400 flex-shrink-0"/>}
                  <span className={`text-xs font-bold ${pos ? "text-emerald-400" : "text-red-400"}`}>{chg}</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden mt-1" style={{ background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}>
                <div style={{ width:barW, background:bar, borderRadius:999, height:"100%", transition:"width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── US Stat Card ────────────────────────────────────────────────────────────
const USStatCard = ({ label, value, positive, cardBg, cardBorder, isLight, path, section, onNavigate }) => {
  const isUp = positive === true; const isDown = positive === false;
  const color = isUp ? "#22c55e" : isDown ? "#ef4444" : "#4E91F6";
  const loading = value === "..." || value === "N/A";
  const clickable = !!path && !!section;
  return (
    <div style={{ background: cardBg, border: cardBorder }}
      className={`rounded-2xl p-3 sm:p-5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 ${clickable ? "cursor-pointer hover:border-accent/40" : ""}`}
      onClick={() => clickable && onNavigate?.(path, section)}>
      <div className="flex items-center gap-1.5 mb-3">
        <span style={{ width:8, height:8, borderRadius:2, background:"#4E91F6", display:"inline-block" }} />
        <span style={{ fontSize:"10px", fontWeight:900, textTransform:"uppercase", letterSpacing:"0.10em", color: isLight ? "#1e3a5f" : "#ffffff" }}>{label}</span>
      </div>
      <div className="mb-3">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: loading ? (isLight ? "#64748b" : "#94a3b8") : color }}>{loading ? "—" : value}</div>
        <div className={`text-[10px] sm:text-[11px] mt-1 ${isLight ? "text-navy/40" : "text-white/35"}`}>Today's change</div>
      </div>
      <Sparkline positive={isUp} color={color} />
      {clickable && <div style={{ fontSize:"10px", marginTop:"6px", color:"#4E91F6", opacity:0.8, fontWeight:600 }}>View details →</div>}
    </div>
  );
};

// ─── Main Hero Component ────────────────────────────────────────────────────
const Hero = () => {
  const [activeTab, setActiveTab] = useState("bharat");
  const { theme } = useTheme();
  const isLight = theme === "light";
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [usData, setUsData] = useState({
    nasdaq: "...", usdInr: "...", gold: "...", dow: "...",
    nasdaqPos: null, usdInrPos: null, goldPos: null, dowPos: null,
    usdInrRate: 84,
  });

  // ── Bharat live data from Kite ──────────────────────────────────────────────
  const [bharatData, setBharatData] = useState({
    sensex: null,   // { price, chg }
    nifty50: null,  // { price, chg }
    indiaVix: null, // { price, chg }
    giftNifty: null,
    giftNiftyChange: null,
    usdInr: null,
    usdInrChange: null,
    goldInr: null,
    goldChange: null,
    silverInr: null,
    silverChange: null,
  });

  // ── Helper: parse ohlc/quote response into { price, chg } ────────────────
  const parseKiteItem = (data, symbol) => {
    const item = data[symbol];
    if (!item) return null;
    const price = item.last_price ?? item.ohlc?.close ?? null;
    const prevClose = item.ohlc?.close ?? null;
    // Kite OHLC doesn't have change% directly; quote does
    const chg = item.change != null ? item.change
      : (price && prevClose && item.ohlc?.open)
        ? ((price - item.ohlc.open) / item.ohlc.open) * 100
        : null;
    return { price, chg };
  };

  // ── Fetch Kite live data for Bharat ─────────────────────────────────────
  useEffect(() => {
    const symbols = ["NSE:NIFTY 50", "BSE:SENSEX", "NSE:INDIA VIX"];

    const load = async () => {
      const data = await fetchKiteQuote(API, symbols);
      setBharatData(prev => ({
        ...prev,
        nifty50:  parseKiteItem(data, "NSE:NIFTY 50")  ?? prev.nifty50,
        sensex:   parseKiteItem(data, "BSE:SENSEX")     ?? prev.sensex,
        indiaVix: parseKiteItem(data, "NSE:INDIA VIX")  ?? prev.indiaVix,
      }));
    };
    load();
    // Refresh every 30s during market hours
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [API]);

  // ── Fetch US global + Yahoo-based Bharat forex/commodity data ───────────
  useEffect(() => {
    fetch(`${API}/markets/global`)
      .then(r => r.json())
      .then(data => {
        const us    = data?.indices?.us    || [];
        const forex = data?.forex          || [];
        const comms = data?.commodities    || [];
        const nasdaq = us.find(m => m.symbol === "^IXIC");
        const dow    = us.find(m => m.symbol === "^DJI");
        const usdinr = forex.find(m => m.pair === "USD/INR");
        const gold   = comms.find(m => m.symbol === "GC=F");
        const silver = comms.find(m => m.symbol === "SI=F");
        const fmt = (v) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
        setUsData({
          nasdaq:    nasdaq  ? fmt(nasdaq.changePercent)  : "N/A",
          usdInr:    usdinr?.changePercent != null ? fmt(usdinr.changePercent) : "N/A",
          gold:      gold    ? fmt(gold.changePercent)    : "N/A",
          dow:       dow     ? fmt(dow.changePercent)     : "N/A",
          nasdaqPos: nasdaq  ? nasdaq.changePercent >= 0  : null,
          usdInrPos: usdinr?.changePercent != null ? usdinr.changePercent >= 0 : null,
          goldPos:   gold    ? gold.changePercent >= 0    : null,
          dowPos:    dow     ? dow.changePercent >= 0     : null,
          usdInrRate: usdinr?.rate ? Number(usdinr.rate) : 84,
        });

        // Parse GIFT Nifty from global indices
        const india  = data?.indices?.india || [];
        const giftItem = india.find(m => m.symbol?.includes("GIFT") || m.symbol === "^NSESGX" || m.symbol === "NIFTY50.NS");
        const usdInrRate = usdinr?.rate ? Number(usdinr.rate) : 84;
        // Correct MCX conversion: GC=F (USD/troy oz) → ₹/10g; SI=F (USD/troy oz) → ₹/kg
        const goldInr   = gold?.price   ? Math.round((gold.price   / 31.1035) * 10 * usdInrRate) : null;
        const silverInr = silver?.price ? Math.round(silver.price * 32.1507 * usdInrRate)         : null;

        setBharatData(prev => ({
          ...prev,
          giftNifty:       giftItem?.price          ?? prev.giftNifty,
          giftNiftyChange: giftItem?.changePercent  ?? prev.giftNiftyChange,
          usdInr:          usdinr?.rate             ?? prev.usdInr,
          usdInrChange:    usdinr?.changePercent    ?? prev.usdInrChange,
          goldInr:         goldInr                  ?? prev.goldInr,
          goldChange:      gold?.changePercent      ?? prev.goldChange,
          silverInr:       silverInr                ?? prev.silverInr,
          silverChange:    silver?.changePercent    ?? prev.silverChange,
        }));
      })
      .catch(() => {});
  }, [API]);

  // ── Also try Yahoo directly for GIFT Nifty / USD-INR / Gold / Silver if global fails ──
  useEffect(() => {
    const PROXY = "https://query1.finance.yahoo.com/v8/finance/chart/";
    const fetchSym = async (sym) => {
      try {
        const r = await fetch(`${PROXY}${encodeURIComponent(sym)}?interval=1d&range=2d`);
        const j = await r.json();
        const meta = j?.chart?.result?.[0]?.meta;
        if (!meta || !meta.regularMarketPrice) return null;
        const price = meta.regularMarketPrice;
        const prev  = meta.chartPreviousClose ?? meta.previousClose;
        const chg   = price && prev ? ((price - prev) / prev) * 100 : null;
        return { price, chg, currency: meta.currency };
      } catch { return null; }
    };

    // Try multiple GIFT Nifty symbols — SGX Nifty / GIFT City futures
    const fetchGiftNifty = async () => {
      // Try these in order: SGX Nifty, GIFT Nifty futures, NIFTY50 spot as proxy
      const candidates = ["^NSESGX", "NIFTY50.NS", "^NSEI"];
      for (const sym of candidates) {
        const val = await fetchSym(sym);
        if (val?.price) return val;
      }
      return null;
    };

    (async () => {
      const [fx, giftResult, gold, silver] = await Promise.allSettled([
        fetchSym("USDINR=X"),
        fetchGiftNifty(),
        fetchSym("GC=F"),
        fetchSym("SI=F"),
      ]);
      const fxVal     = fx.status     === "fulfilled" ? fx.value     : null;
      const giftVal   = giftResult.status === "fulfilled" ? giftResult.value : null;
      const goldVal   = gold.status   === "fulfilled" ? gold.value   : null;
      const silverVal = silver.status === "fulfilled" ? silver.value : null;
      const usdInrRate = fxVal?.price ?? 84;

      // MCX Gold India: GC=F is per troy oz in USD → convert to ₹/10g
      // 1 troy oz = 31.1035g → price per 10g = (price_usd / 31.1035) * 10 * usd_inr
      const goldInr   = goldVal?.price
        ? Math.round((goldVal.price / 31.1035) * 10 * usdInrRate)
        : null;
      // MCX Silver: SI=F is per troy oz in USD → ₹/kg = price_usd * 32.1507 * usd_inr
      const silverInr = silverVal?.price
        ? Math.round(silverVal.price * 32.1507 * usdInrRate)
        : null;

      setBharatData(prev => ({
        ...prev,
        giftNifty:       giftVal?.price  ?? prev.giftNifty,
        giftNiftyChange: giftVal?.chg    ?? prev.giftNiftyChange,
        usdInr:          fxVal?.price    ?? prev.usdInr,
        usdInrChange:    fxVal?.chg      ?? prev.usdInrChange,
        goldInr:         goldInr         ?? prev.goldInr,
        goldChange:      goldVal?.chg    ?? prev.goldChange,
        silverInr:       silverInr       ?? prev.silverInr,
        silverChange:    silverVal?.chg  ?? prev.silverChange,
      }));
    })();
  }, []);

  // ── Theme tokens ─────────────────────────────────────────────────────────
  const sectionStyle = isLight
    ? { background:"linear-gradient(135deg,#dbe9f9 0%,#e8f2fd 30%,#edf5fe 60%,#dce8f7 100%)" }
    : { background:"linear-gradient(135deg,#101528 0%,#101528 40%,#101528 70%,#101528 100%)" };
  const sectionCls = isLight
    ? "text-navy py-10 md:py-16 lg:py-20 relative overflow-hidden"
    : "text-white py-10 md:py-16 lg:py-20 relative overflow-hidden";
  const cardBg     = isLight ? "rgba(255,255,255,0.78)" : "rgba(28,57,91,0.25)";
  const cardBorder = isLight ? "1px solid rgba(13,37,64,0.10)" : "1px solid rgba(78,145,246,0.18)";
  const tabWrapStyle = isLight
    ? { display:"inline-flex", alignItems:"center", gap:6, background:"#fff", border:"1.5px solid #CBD5E1", borderRadius:18, padding:6, boxShadow:"0 4px 24px rgba(13,27,64,0.10)" }
    : { display:"inline-flex", alignItems:"center", gap:6, background:"#101528", border:"1.5px solid #1C395B", borderRadius:18, padding:6, boxShadow:"0 4px 32px rgba(78,145,246,0.12)" };
  const activeTabStyle = { background:"linear-gradient(135deg,#1d4ed8,#4E91F6,#6366f1)", color:"#fff", fontWeight:700, boxShadow:"0 4px 20px rgba(78,145,246,0.50)", border:"none" };
  const inactiveTabStyle = isLight
    ? { background:"#F1F5F9", color:"#1E293B", fontWeight:600, border:"1.5px solid #CBD5E1" }
    : { background:"rgba(28,57,91,0.35)", color:"#c8dff8", fontWeight:600, border:"1.5px solid #1C395B" };
  const inactiveHoverStyle = isLight
    ? { background:"#E2E8F0", color:"#0F172A", border:"1.5px solid #94A3B8" }
    : { background:"#1C395B", color:"#4E91F6", border:"1.5px solid #4E91F6" };

  return (
    <section className={sectionCls} style={sectionStyle}>
      {/* Blobs */}
      <div style={{ position:"absolute", top:0, right:0, width:"32rem", height:"32rem", borderRadius:"50%", background: isLight ? "rgba(59,130,246,0.12)" : "rgba(78,145,246,0.08)", filter:"blur(80px)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:0, left:0, width:"32rem", height:"32rem", borderRadius:"50%", background: isLight ? "rgba(99,102,241,0.10)" : "rgba(28,57,91,0.60)", filter:"blur(80px)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"40%", left:"30%", width:"20rem", height:"20rem", borderRadius:"50%", background: isLight ? "rgba(14,165,233,0.07)" : "rgba(78,145,246,0.05)", filter:"blur(60px)", pointerEvents:"none" }} />
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: isLight ? `linear-gradient(#0d2540 1px,transparent 1px),linear-gradient(90deg,#0d2540 1px,transparent 1px)` : `linear-gradient(#1C395B 1px,transparent 1px),linear-gradient(90deg,#1C395B 1px,transparent 1px)`, backgroundSize:"40px 40px", opacity: isLight ? 0.04 : 0.12 }} />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">

          {/* Icons — colored to match the heading blue gradient */}
          <div className="flex justify-center items-end gap-4 md:gap-6 mb-5 md:mb-8">
            <PieChartIcon className="w-7 h-7 md:w-9 md:h-9" style={{ color: isLight ? "#1d4ed8" : "#4E91F6", filter: isLight ? "drop-shadow(0 0 10px rgba(78,145,246,0.5))" : "drop-shadow(0 0 14px rgba(78,145,246,0.80))" }} />
            <GrowthPlantIcon className="w-9 h-9 md:w-11 md:h-11" style={{ color: isLight ? "#4E91F6" : "#7ab8fa", filter: isLight ? "drop-shadow(0 0 12px rgba(78,145,246,0.55))" : "drop-shadow(0 0 18px rgba(122,184,250,0.85))" }} />
            <IndexChartIcon className="w-7 h-7 md:w-9 md:h-9" style={{ color: isLight ? "#6366f1" : "#a5c8ff", filter: isLight ? "drop-shadow(0 0 10px rgba(99,102,241,0.5))" : "drop-shadow(0 0 14px rgba(165,200,255,0.75))" }} />
          </div>

          {/* ── Heading — forced single line, shrinks to fit ── */}
          <h1
           key={theme} 
            className="font-extrabold leading-none tracking-tight whitespace-nowrap mb-3 md:mb-4"
            style={{
              fontSize: "clamp(1.1rem, 4.5vw, 4.2rem)",
              background: isLight
                ? "linear-gradient(90deg,#1d4ed8,#4E91F6,#3b82f6,#6366f1)"
                : "linear-gradient(90deg,#4E91F6,#7ab8fa,#a5c8ff,#4E91F6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
              display: "block",
            }}>
            Baazigar Banein… Sattebaaz Nahi
          </h1>

          {/* ── Subtitle ── */}
          <p
            className="mx-auto mb-7 md:mb-10 max-w-2xl"
            style={{
              fontSize: "clamp(0.78rem, 1.6vw, 1.05rem)",
              lineHeight: 1.7,
              letterSpacing: "0.01em",
              color: isLight ? "rgba(30,58,95,0.62)" : "rgba(200,223,248,0.55)",
            }}>
            Daily research-backed stock insights —{" "}
            <span style={{
              color: isLight ? "#4E91F6" : "#7ab8fa",
              fontWeight: 600,
            }}>
              where every pick is powered by analysis
            </span>
            , not assumptions.
          </p>

          {/* Tab Switcher */}
          <div style={tabWrapStyle} className="mx-auto">
            {["bharat", "us"].map((key) => {
              const active = activeTab === key;
              return (
                <button key={key} onClick={() => setActiveTab(key)}
                  style={{ ...(active ? activeTabStyle : inactiveTabStyle), display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", gap:6, padding:"9px 16px", borderRadius:12, cursor:"pointer", transition:"all 0.2s ease", outline:"none", transform: active ? "scale(1.02)" : "scale(1)", whiteSpace:"nowrap" }}
                  onMouseEnter={e => { if (!active) Object.assign(e.currentTarget.style, inactiveHoverStyle); }}
                  onMouseLeave={e => { if (!active) Object.assign(e.currentTarget.style, inactiveTabStyle); }}>
                  {active && <Sparkles style={{ width:12, height:12, flexShrink:0 }} strokeWidth={2.5} />}
                  <span style={{ fontSize:14, lineHeight:1 }}>{key === "bharat" ? "🇮🇳" : "🇺🇸"}</span>
                  <span style={{ fontSize:13, lineHeight:1, fontWeight:600 }}>{key === "bharat" ? "Bharat Stats" : "US Stats"}</span>
                </button>
              );
            })}
          </div>

          {/* ── BHARAT grid ── */}
          {activeTab === "bharat" && (
            <div className="mt-6 md:mt-10 grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-5xl mx-auto pb-4 md:pb-0 px-1 sm:px-0">
              <SensexNiftyCard cardBg={cardBg} cardBorder={cardBorder} isLight={isLight}
                sensex={bharatData.sensex} nifty={bharatData.nifty50} />
              <FiiDiiCard cardBg={cardBg} cardBorder={cardBorder} isLight={isLight} />
              <IndiaVixCard cardBg={cardBg} cardBorder={cardBorder} isLight={isLight}
                vixData={bharatData.indiaVix} />
              <GiftNiftyCard cardBg={cardBg} cardBorder={cardBorder} isLight={isLight}
                liveGiftNifty={bharatData.giftNifty} liveGiftChange={bharatData.giftNiftyChange} />
              <UsdInrCard cardBg={cardBg} cardBorder={cardBorder} isLight={isLight}
                liveValue={bharatData.usdInr ?? usData.usdInrRate}
                liveChange={bharatData.usdInrChange} />
              <GoldSilverCard cardBg={cardBg} cardBorder={cardBorder} isLight={isLight}
                liveGold={bharatData.goldInr} liveGoldChange={bharatData.goldChange}
                liveSilver={bharatData.silverInr} liveSilverChange={bharatData.silverChange} />
            </div>
          )}

          {/* ── US grid ── */}
          {activeTab === "us" && (
            <div className="mt-6 md:mt-10 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-5xl mx-auto pb-4 md:pb-0 px-1 sm:px-0">
              <USStatCard label="NASDAQ" value={usData.nasdaq} positive={usData.nasdaqPos} cardBg={cardBg} cardBorder={cardBorder} isLight={isLight}
                path="/global" section="section-us" onNavigate={(p, s) => navigate(`${p}?scrollTo=${s}`)} />
              <USStatCard label="USD / INR" value={usData.usdInr} positive={usData.usdInrPos} cardBg={cardBg} cardBorder={cardBorder} isLight={isLight}
                path="/global" section="section-forex" onNavigate={(p, s) => navigate(`${p}?scrollTo=${s}`)} />
              <USStatCard label="Gold" value={usData.gold} positive={usData.goldPos} cardBg={cardBg} cardBorder={cardBorder} isLight={isLight}
                path="/global" section="section-commodities" onNavigate={(p, s) => navigate(`${p}?scrollTo=${s}`)} />
              <USStatCard label="Dow Jones" value={usData.dow} positive={usData.dowPos} cardBg={cardBg} cardBorder={cardBorder} isLight={isLight}
                path="/global" section="section-us" onNavigate={(p, s) => navigate(`${p}?scrollTo=${s}`)} />
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Hero;