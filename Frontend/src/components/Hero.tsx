'use client';

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "@/controllers/Themecontext";

// ─── Icons ─────────────────────────────────────────────────────────────────────
const PieChartIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="22" cy="26" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M22 26 L22 11 A15 15 0 0 1 36.3 18.5 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.25" />
    <path d="M22 26 L36.3 18.5 A15 15 0 0 1 34 40 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12" />
    <path d="M30 8 L36 4 L42 8" stroke="currentColor" strokeWidth="2.2" />
    <path d="M36 4 L36 14" stroke="currentColor" strokeWidth="2.2" />
    <circle cx="10" cy="14" r="1.5" fill="currentColor" opacity="0.5" />
  </svg>
);

const GrowthPlantIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 40 L24 18" stroke="currentColor" strokeWidth="2.2" />
    <path d="M24 28 C20 26, 14 27, 13 22 C12 17, 18 14, 24 20" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.2" />
    <path d="M24 22 C28 20, 34 20, 35 15 C36 10, 30 8, 24 14" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.2" />
    <path d="M14 40 L34 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 14 L25.2 11 L26.4 14 L29.5 14 L27 16 L28.2 19 L24 17 L19.8 19 L21 16 L18.5 14 L21.6 14 Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.35" />
  </svg>
);

const IndexChartIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
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

// ─── Mini Sparkline SVG ─────────────────────────────────────────────────────────
const Sparkline = ({ positive, color }: { positive: boolean; color: string }) => {
  // Generate a smooth sparkline path — rising if positive, falling if negative
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
const GoldBrickIcon = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={Math.round(size * 0.75)} viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f5d978" />
        <stop offset="100%" stopColor="#d4a017" />
      </linearGradient>
      <linearGradient id="goldFront" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e8b820" />
        <stop offset="100%" stopColor="#9a6e00" />
      </linearGradient>
      <linearGradient id="goldSide" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#c49a10" />
        <stop offset="100%" stopColor="#7a5200" />
      </linearGradient>
    </defs>
    {/* Top face */}
    <polygon points="6,8 42,8 46,2 10,2" fill="url(#goldTop)" />
    {/* Front face */}
    <polygon points="6,8 42,8 42,30 6,30" fill="url(#goldFront)" />
    {/* Right side face */}
    <polygon points="42,8 46,2 46,24 42,30" fill="url(#goldSide)" />
    {/* Top edge highlight */}
    <polygon points="6,8 42,8 46,2 10,2" fill="none" stroke="#f7e080" strokeWidth="0.6" opacity="0.7" />
    {/* Front shine */}
    <rect x="10" y="11" width="18" height="3" rx="1.5" fill="white" opacity="0.18" />
    {/* Front border lines */}
    <line x1="10" y1="19" x2="38" y2="19" stroke="#7a5200" strokeWidth="0.7" opacity="0.5" />
    <line x1="10" y1="24" x2="38" y2="24" stroke="#7a5200" strokeWidth="0.7" opacity="0.35" />
    {/* Outer stroke */}
    <polygon points="6,8 42,8 42,30 6,30" fill="none" stroke="#9a6e00" strokeWidth="0.8" />
    <polygon points="42,8 46,2 46,24 42,30" fill="none" stroke="#7a5200" strokeWidth="0.8" />
    <polygon points="6,8 42,8 46,2 10,2" fill="none" stroke="#c49a10" strokeWidth="0.8" />
  </svg>
);

// ─── 3D Silver Brick SVG Icon ────────────────────────────────────────────────
const SilverBrickIcon = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={Math.round(size * 0.75)} viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="silverTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e8eef4" />
        <stop offset="100%" stopColor="#9db0c0" />
      </linearGradient>
      <linearGradient id="silverFront" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c8d8e4" />
        <stop offset="100%" stopColor="#607080" />
      </linearGradient>
      <linearGradient id="silverSide" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#8090a0" />
        <stop offset="100%" stopColor="#445060" />
      </linearGradient>
    </defs>
    {/* Top face */}
    <polygon points="6,8 42,8 46,2 10,2" fill="url(#silverTop)" />
    {/* Front face */}
    <polygon points="6,8 42,8 42,30 6,30" fill="url(#silverFront)" />
    {/* Right side face */}
    <polygon points="42,8 46,2 46,24 42,30" fill="url(#silverSide)" />
    {/* Top edge highlight */}
    <polygon points="6,8 42,8 46,2 10,2" fill="none" stroke="#ddeaf2" strokeWidth="0.6" opacity="0.8" />
    {/* Front shine */}
    <rect x="10" y="11" width="18" height="3" rx="1.5" fill="white" opacity="0.28" />
    {/* Front border lines */}
    <line x1="10" y1="19" x2="38" y2="19" stroke="#445060" strokeWidth="0.7" opacity="0.5" />
    <line x1="10" y1="24" x2="38" y2="24" stroke="#445060" strokeWidth="0.7" opacity="0.35" />
    {/* Outer stroke */}
    <polygon points="6,8 42,8 42,30 6,30" fill="none" stroke="#607080" strokeWidth="0.8" />
    <polygon points="42,8 46,2 46,24 42,30" fill="none" stroke="#445060" strokeWidth="0.8" />
    <polygon points="6,8 42,8 46,2 10,2" fill="none" stroke="#8090a0" strokeWidth="0.8" />
  </svg>
);

// ─── SENSEX vs NIFTY Card ───────────────────────────────────────────────────────
const SensexNiftyCard = ({ cardBg, cardBorder, isLight }: any) => (
  <div style={{ background: cardBg, border: cardBorder }} className="rounded-2xl p-4 md:p-5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
    <div className="flex items-center gap-1.5 mb-3">
      <span style={{ width: 8, height: 8, borderRadius: 2, background: "#C9A84C", display: "inline-block", flexShrink: 0 }} />
      <span style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: isLight ? "#1e3a5f" : "#ffffff" }}>SENSEX vs NIFTY 50</span>
    </div>
    <div className="space-y-2 mb-3">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${isLight ? "text-navy/70" : "text-white/70"}`}>Sensex</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-base md:text-lg font-bold ${isLight ? "text-navy" : "text-white"}`}>81,250</span>
          <span className="flex items-center gap-0.5 text-emerald-400 text-xs font-semibold whitespace-nowrap">
            <TrendingUp className="w-3 h-3" /> +0.42%
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${isLight ? "text-navy/70" : "text-white/70"}`}>Nifty 50</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-base md:text-lg font-bold ${isLight ? "text-navy" : "text-white"}`}>24,720</span>
          <span className="flex items-center gap-0.5 text-emerald-400 text-xs font-semibold whitespace-nowrap">
            <TrendingUp className="w-3 h-3" /> +0.39%
          </span>
        </div>
      </div>
    </div>
    <Sparkline positive={true} color="#22c55e" />
  </div>
);

// ─── FII vs DII Card ────────────────────────────────────────────────────────────
const FiiDiiCard = ({ cardBg, cardBorder, isLight }: any) => {
  const fiiVal = -1240;
  const diiVal = 1980;
  const total = Math.abs(fiiVal) + diiVal;
  const fiiPct = Math.round((Math.abs(fiiVal) / total) * 100);
  const diiPct = 100 - fiiPct;
  return (
    <div style={{ background: cardBg, border: cardBorder }} className="rounded-2xl p-4 md:p-5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
      <div className="flex items-center gap-1.5 mb-3">
        <span style={{ width: 8, height: 8, borderRadius: 2, background: "#C9A84C", display: "inline-block", flexShrink: 0 }} />
        <span style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: isLight ? "#1e3a5f" : "#ffffff" }}>FII vs DII</span>
      </div>
      <div className="flex justify-between items-end mb-4">
        <div>
          <div className={`text-[11px] font-semibold mb-1 ${isLight ? "text-navy/50" : "text-white/40"}`}>FII</div>
          <div className="text-lg md:text-xl font-bold text-red-400">−₹1,240 Cr</div>
        </div>
        <div className="text-right">
          <div className={`text-[11px] font-semibold mb-1 ${isLight ? "text-navy/50" : "text-white/40"}`}>DII</div>
          <div className="text-lg md:text-xl font-bold text-emerald-400">+₹1,980 Cr</div>
        </div>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden flex" style={{ background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}>
        <div style={{ width: `${fiiPct}%`, background: "linear-gradient(90deg,#ef4444,#f87171)", borderRadius: "999px 0 0 999px", transition: "width 1s ease" }} />
        <div style={{ width: `${diiPct}%`, background: "linear-gradient(90deg,#a855f7,#22c55e)", borderRadius: "0 999px 999px 0", transition: "width 1s ease" }} />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-red-400/80">{fiiPct}% selling</span>
        <span className="text-[10px] text-emerald-400/80">{diiPct}% buying</span>
      </div>
    </div>
  );
};

// ─── India VIX Card ─────────────────────────────────────────────────────────────
const IndiaVixCard = ({ cardBg, cardBorder, isLight }: any) => {
  const vix = 13.42;
  const vixChange = -3.10;
  const sliderPct = Math.min(100, Math.max(0, ((vix - 10) / 30) * 100));
  const fearLabel = vix < 15 ? "Low" : vix < 20 ? "Moderate" : "High";
  const fearColor = vix < 15 ? "#22c55e" : vix < 20 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ background: cardBg, border: cardBorder }} className="rounded-2xl p-4 md:p-5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
      <div className="flex items-center gap-1.5 mb-3">
        <span style={{ width: 8, height: 8, borderRadius: 2, background: "#C9A84C", display: "inline-block", flexShrink: 0 }} />
        <span style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: isLight ? "#1e3a5f" : "#ffffff" }}>INDIA VIX</span>
      </div>
      <div className="flex items-end justify-between mb-3">
        <span className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isLight ? "text-navy" : "text-white"}`}>{vix}</span>
        <div className="flex flex-col items-end gap-1">
          <span className="flex items-center gap-1 text-red-400 font-bold text-sm">
            <TrendingDown className="w-3.5 h-3.5" /> {vixChange}%
          </span>
          <span className="text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${fearColor}22`, color: fearColor, border: `1px solid ${fearColor}44` }}>
            Market Fear: {fearLabel}
          </span>
        </div>
      </div>
      <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: "linear-gradient(90deg,#22c55e,#84cc16,#f59e0b,#ef4444)" }}>
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-slate-300 transition-all duration-700"
          style={{ left: `calc(${sliderPct}% - 8px)` }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-emerald-400/70">Low Fear</span>
        <span className="text-[9px] text-red-400/70">High Fear</span>
      </div>
    </div>
  );
};

// ─── GIFT NIFTY Card ────────────────────────────────────────────────────────────
const GiftNiftyCard = ({ cardBg, cardBorder, isLight }: any) => (
  <div style={{ background: cardBg, border: cardBorder }} className="rounded-2xl p-4 md:p-5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
    <div className="flex items-center gap-1.5 mb-3">
      <span style={{ width: 8, height: 8, borderRadius: 2, background: "#C9A84C", display: "inline-block", flexShrink: 0 }} />
      <span style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: isLight ? "#1e3a5f" : "#ffffff" }}>GIFT NIFTY</span>
    </div>
    <div className="flex items-end justify-between mb-1">
      <div>
        <div className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isLight ? "text-navy" : "text-white"}`}>24,760</div>
        <div className="flex items-center gap-1 mt-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-bold text-sm">+0.32%</span>
        </div>
      </div>
    </div>
    <div className={`text-[11px] font-medium mb-2 ${isLight ? "text-navy/50" : "text-white/40"}`}>Positive Opening Indicated</div>
    <Sparkline positive={true} color="#C9A84C" />
  </div>
);

// ─── USD/INR Card ───────────────────────────────────────────────────────────────
const UsdInrCard = ({ cardBg, cardBorder, isLight, liveValue }: any) => {
  const rate = liveValue || 82.94;
  const changeVal = -0.12;
  const sliderPct = Math.min(100, Math.max(0, ((rate - 80) / 6) * 100));
  return (
    <div style={{ background: cardBg, border: cardBorder }} className="rounded-2xl p-4 md:p-5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
      <div className="flex items-center gap-1.5 mb-3">
        <span style={{ width: 8, height: 8, borderRadius: 2, background: "#C9A84C", display: "inline-block", flexShrink: 0 }} />
        <span style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: isLight ? "#1e3a5f" : "#ffffff" }}>USD / INR</span>
      </div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isLight ? "text-navy" : "text-white"}`}>₹{rate.toFixed ? rate.toFixed(2) : rate}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
            <span className="text-red-400 font-bold text-sm">{changeVal}%</span>
          </div>
        </div>
      </div>
      <div className={`text-[11px] font-medium mb-2 ${isLight ? "text-navy/50" : "text-white/40"}`}>Rupee Strengthening</div>
      <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: "linear-gradient(90deg,#3b82f6,#06b6d4,#f59e0b,#ef4444)" }}>
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-slate-300 transition-all duration-700"
          style={{ left: `calc(${sliderPct}% - 8px)` }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-blue-400/70">₹80</span>
        <span className="text-[9px] text-red-400/70">₹86</span>
      </div>
    </div>
  );
};

// ─── Gold vs Silver Card ────────────────────────────────────────────────────────
const GoldSilverCard = ({ cardBg, cardBorder, isLight, liveGold, liveSilver }: any) => {
  const gold = liveGold || 74200;
  const silver = liveSilver || 83900;
  return (
    <div style={{ background: cardBg, border: cardBorder }} className="rounded-2xl p-4 md:p-5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
      <div className="flex items-center gap-1.5 mb-4">
        <span style={{ width: 8, height: 8, borderRadius: 2, background: "#C9A84C", display: "inline-block", flexShrink: 0 }} />
        <span style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: isLight ? "#1e3a5f" : "#ffffff" }}>GOLD vs SILVER</span>
      </div>
      <div className="space-y-3">
        {/* Gold row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GoldBrickIcon size={40} />
            <span className={`font-semibold text-sm ${isLight ? "text-navy/80" : "text-white/80"}`}>Gold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-base md:text-lg font-bold ${isLight ? "text-navy" : "text-white"}`}>₹{gold.toLocaleString()}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          </div>
        </div>
        {/* Gold bar */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}>
          <div style={{ width: "72%", background: "linear-gradient(90deg,#C9A84C,#f5d78e)", borderRadius: 999, height: "100%", transition: "width 1s ease" }} />
        </div>
        {/* Silver row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SilverBrickIcon size={40} />
            <span className={`font-semibold text-sm ${isLight ? "text-navy/80" : "text-white/80"}`}>Silver</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-base md:text-lg font-bold ${isLight ? "text-navy" : "text-white"}`}>₹{silver.toLocaleString()}</span>
            <TrendingDown className="w-4 h-4 text-red-400 flex-shrink-0" />
          </div>
        </div>
        {/* Silver bar */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}>
          <div style={{ width: "58%", background: "linear-gradient(90deg,#94a3b8,#cbd5e1)", borderRadius: 999, height: "100%", transition: "width 1s ease" }} />
        </div>
      </div>
    </div>
  );
};

// ─── US Stats Cards ─────────────────────────────────────────────────────────────
interface USStatCardProps { label: string; value: string; positive: boolean | null; cardBg: any; cardBorder: any; isLight: boolean; path?: string; section?: string; onNavigate?: (path: string, section: string) => void; }
const USStatCard = ({ label, value, positive, cardBg, cardBorder, isLight, path, section, onNavigate }: USStatCardProps) => {
  const isUp = positive === true;
  const isDown = positive === false;
  const color = isUp ? "#22c55e" : isDown ? "#ef4444" : "#C9A84C";
  const loading = value === "..." || value === "N/A";
  const clickable = !!path && !!section;
  return (
    <div
      style={{ background: cardBg, border: cardBorder }}
      className={`rounded-2xl p-5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 ${clickable ? "cursor-pointer hover:border-accent/40" : ""}`}
      onClick={() => clickable && onNavigate?.(path!, section!)}
    >
      <div className="flex items-center gap-1.5 mb-3">
        <span style={{ width: 8, height: 8, borderRadius: 2, background: "#C9A84C", display: "inline-block" }} />
        <span style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: isLight ? "#1e3a5f" : "#ffffff" }}>{label}</span>
      </div>
      <div className="mb-3">
        <div className="text-3xl font-extrabold tracking-tight" style={{ color: loading ? (isLight ? "#64748b" : "#94a3b8") : color }}>
          {loading ? "—" : value}
        </div>
        <div className={`text-[11px] mt-1 ${isLight ? "text-navy/40" : "text-white/35"}`}>Today's change</div>
      </div>
      <Sparkline positive={isUp} color={color} />
      {clickable && (
        <div style={{ fontSize: "10px", marginTop: "6px", color: "#C9A84C", opacity: 0.8, fontWeight: 600 }}>
          View details →
        </div>
      )}
    </div>
  );
};

// ─── Main Hero Component ────────────────────────────────────────────────────────
const Hero = () => {
  const [activeTab, setActiveTab] = useState<"bharat" | "us">("bharat");
  const { theme } = useTheme();
  const isLight = theme === "light";
  const navigate = useNavigate();

  const [usData, setUsData] = useState({ nasdaq: "...", usdInr: "...", gold: "...", dow: "...", nasdaqPos: null as boolean | null, usdInrPos: null as boolean | null, goldPos: null as boolean | null, dowPos: null as boolean | null, usdInrRate: 82.94 });

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
    fetch(`${API}/markets/global`)
      .then(r => r.json())
      .then(data => {
        const us    = data?.indices?.us    || [];
        const forex = data?.forex          || [];
        const comms = data?.commodities    || [];
        const nasdaq = us.find((m: any) => m.symbol === "^IXIC");
        const dow    = us.find((m: any) => m.symbol === "^DJI");
        const usdinr = forex.find((m: any) => m.pair === "USD/INR");
        const gold   = comms.find((m: any) => m.symbol === "GC=F");
        const fmt = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
        setUsData({
          nasdaq:    nasdaq  ? fmt(nasdaq.changePercent)       : "N/A",
          usdInr:    usdinr?.changePercent != null ? fmt(usdinr.changePercent) : usdinr?.rate != null ? fmt(0) : "N/A",
          gold:      gold    ? fmt(gold.changePercent)         : "N/A",
          dow:       dow     ? fmt(dow.changePercent)          : "N/A",
          nasdaqPos: nasdaq  ? nasdaq.changePercent >= 0       : null,
          usdInrPos: usdinr?.changePercent != null ? usdinr.changePercent >= 0 : null,
          goldPos:   gold    ? gold.changePercent >= 0         : null,
          dowPos:    dow     ? dow.changePercent >= 0          : null,
          usdInrRate: usdinr?.rate ? Number(usdinr.rate) : 82.94,
        });
      })
      .catch(() => {});
  }, []);

  // ── Theme tokens ───────────────────────────────────────────────────────────
  const sectionStyle: React.CSSProperties = isLight
    ? { background: "linear-gradient(135deg,#dbe9f9 0%,#e8f2fd 30%,#edf5fe 60%,#dce8f7 100%)" }
    : {};
  const sectionCls = isLight
    ? "text-navy py-10 md:py-16 lg:py-20 relative overflow-hidden"
    : "gradient-hero text-white py-10 md:py-16 lg:py-20 relative overflow-hidden";

  const gridOpacity = isLight ? "opacity-[0.04]" : "opacity-[0.06]";
  const gridColor   = isLight ? "#0d2540" : "white";

  const cardBg = isLight ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.05)";
  const cardBorder = isLight ? "1px solid rgba(13,37,64,0.10)" : "1px solid rgba(255,255,255,0.10)";

  const iconGlow = isLight
    ? { filter: "drop-shadow(0 0 10px rgba(217,119,6,0.55))" }
    : { filter: "drop-shadow(0 0 14px rgba(212,168,67,0.80))" };

  const lineCls = isLight
    ? "h-px w-10 bg-accent rounded-full shadow-[0_0_8px_rgba(212,168,67,0.7)]"
    : "h-px w-10 bg-accent rounded-full shadow-[0_0_10px_rgba(212,168,67,0.85)]";

  const tabWrapStyle: React.CSSProperties = isLight
    ? { display:"inline-flex", alignItems:"center", gap:6, background:"#fff", border:"1.5px solid #CBD5E1", borderRadius:18, padding:6, boxShadow:"0 4px 24px rgba(13,27,64,0.10)" }
    : { display:"inline-flex", alignItems:"center", gap:6, background:"#1E293B", border:"1.5px solid #334155", borderRadius:18, padding:6, boxShadow:"0 4px 24px rgba(0,0,0,0.40)" };

  const activeTabStyle: React.CSSProperties = { background:"linear-gradient(135deg,#C9A84C,#e8c96a)", color:"#0D1117", fontWeight:700, boxShadow:"0 4px 16px rgba(201,168,76,0.40)", border:"none" };
  const inactiveTabStyle: React.CSSProperties = isLight
    ? { background:"#F1F5F9", color:"#1E293B", fontWeight:600, border:"1.5px solid #CBD5E1" }
    : { background:"#0F172A", color:"#E2E8F0", fontWeight:600, border:"1.5px solid #475569" };
  const inactiveHoverStyle: React.CSSProperties = isLight
    ? { background:"#E2E8F0", color:"#0F172A", border:"1.5px solid #94A3B8" }
    : { background:"#1E3A5F", color:"#F8FAFC", border:"1.5px solid #64748B" };

  return (
    <section className={sectionCls} style={sectionStyle}>
      {/* Blobs */}
      <div className={isLight ? "absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-blue-200/50" : "absolute top-0 right-0 w-96 h-96 bg-accent/18 rounded-full blur-3xl pointer-events-none"} />
      <div className={isLight ? "absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-indigo-200/40" : "absolute bottom-0 left-0 w-96 h-96 bg-accent/12 rounded-full blur-3xl pointer-events-none"} />
      {/* Grid */}
      <div className={`absolute inset-0 pointer-events-none ${gridOpacity}`}
        style={{ backgroundImage: `linear-gradient(${gridColor} 1px,transparent 1px),linear-gradient(90deg,${gridColor} 1px,transparent 1px)`, backgroundSize:"40px 40px" }} />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">

          {/* 3 Icons */}
          <div className="flex justify-center items-end gap-4 md:gap-6 mb-5 md:mb-8">
            <PieChartIcon className={`w-7 h-7 md:w-9 md:h-9 ${isLight ? "text-amber-500" : "text-accent"}`} style={iconGlow} />
            <GrowthPlantIcon className={`w-9 h-9 md:w-11 md:h-11 ${isLight ? "text-amber-500" : "text-accent"}`} style={iconGlow} />
            <IndexChartIcon className={`w-7 h-7 md:w-9 md:h-9 ${isLight ? "text-amber-500" : "text-accent"}`} style={iconGlow} />
          </div>

          {/* Punchline */}
          <div className="flex justify-center items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <span className={lineCls} />
            <p className="text-[10px] md:text-xs lg:text-sm font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase"
              style={{ color:"#D4A843", textShadow: isLight ? "0 0 16px rgba(212,168,67,0.6),0 0 32px rgba(212,168,67,0.3)" : "0 0 20px rgba(212,168,67,0.85),0 0 40px rgba(212,168,67,0.5)" }}>
              Baazigar Banein… Sattebaaz Nahi
            </p>
            <span className={lineCls} />
          </div>

          {/* Heading */}
          <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-3 md:mb-4 leading-none tracking-tight ${isLight ? "text-navy" : "text-white"}`}>
            Beans<span className="text-accent">Index</span>
          </h1>

          {/* Subheading */}
          <p className={`text-base md:text-lg lg:text-xl mb-7 md:mb-10 leading-relaxed max-w-2xl mx-auto px-2 md:px-0 ${isLight ? "text-navy/70" : "text-white/80"}`}>
            Daily research-backed stock insights — where every pick is powered by analysis, not assumptions.
          </p>

          {/* Tab Switcher */}
          <div style={tabWrapStyle} className="flex-wrap justify-center">
            {(["bharat", "us"] as const).map((key) => {
              const active = activeTab === key;
              return (
                <button key={key} onClick={() => setActiveTab(key)}
                  style={{ ...(active ? activeTabStyle : inactiveTabStyle), display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:12, fontSize:13, cursor:"pointer", transition:"all 0.2s ease", outline:"none", transform: active ? "scale(1.02)" : "scale(1)" }}
                  className="sm:!px-[22px] sm:!py-[10px] sm:!text-[14px] sm:gap-[8px]"
                  onMouseEnter={(e) => { if (!active) Object.assign((e.currentTarget as HTMLButtonElement).style, inactiveHoverStyle); }}
                  onMouseLeave={(e) => { if (!active) Object.assign((e.currentTarget as HTMLButtonElement).style, inactiveTabStyle); }}
                >
                  {active && <Sparkles style={{ width:13, height:13 }} strokeWidth={2.5} />}
                  <span style={{ fontSize:15 }}>{key === "bharat" ? "🇮🇳" : "🇺🇸"}</span>
                  <span>{key === "bharat" ? "Bharat BeansIndex" : "US BeansIndex"}</span>
                </button>
              );
            })}
          </div>

          {/* ── BHARAT Stats Grid ── */}
          {activeTab === "bharat" && (
            <div className="mt-6 md:mt-10 grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto pb-4 md:pb-0">
              <SensexNiftyCard cardBg={cardBg} cardBorder={cardBorder} isLight={isLight} />
              <FiiDiiCard cardBg={cardBg} cardBorder={cardBorder} isLight={isLight} />
              <IndiaVixCard cardBg={cardBg} cardBorder={cardBorder} isLight={isLight} />
              <GiftNiftyCard cardBg={cardBg} cardBorder={cardBorder} isLight={isLight} />
              <UsdInrCard cardBg={cardBg} cardBorder={cardBorder} isLight={isLight} liveValue={usData.usdInrRate} />
              <GoldSilverCard cardBg={cardBg} cardBorder={cardBorder} isLight={isLight} />
            </div>
          )}

          {/* ── US Stats Grid ── */}
          {activeTab === "us" && (
            <div className="mt-6 md:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto pb-4 md:pb-0">
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