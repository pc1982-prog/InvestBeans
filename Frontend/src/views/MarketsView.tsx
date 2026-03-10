import React, { useState, useMemo, useEffect } from 'react';
import Layout from '@/components/Layout';
import CommodityCard from '@/components/Commoditycard';
import { useGlobalMarkets } from '@/hooks/useGlobalMarkets';
import { Commodity } from '@/services/globalMarkets/types';
import { useTheme } from '@/controllers/Themecontext';
import {
  TrendingUp, TrendingDown, Activity, RefreshCw,
  BarChart3, DollarSign, Flame, Zap, Clock,
} from 'lucide-react';

const G = "#2D4A35";
const O = "#C07A3A";

// ── 3D Commodity Icons (SVG) ──────────────────────────────────────────────
const GoldBarIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* Top face */}
    <polygon points="4,10 16,5 28,10 16,15" fill="#F5C518" />
    {/* Right face */}
    <polygon points="28,10 28,22 16,27 16,15" fill="#C8960C" />
    {/* Left face */}
    <polygon points="4,10 4,22 16,27 16,15" fill="#E8A800" />
    {/* Top highlight */}
    <polygon points="6,10.5 16,6.5 26,10.5 16,14.5" fill="#FFE066" opacity="0.5" />
    {/* Shine streak on top */}
    <line x1="10" y1="8" x2="22" y2="12" stroke="#FFF5A0" strokeWidth="0.8" opacity="0.6" />
    {/* Bar ridge lines on front face */}
    <line x1="8" y1="18" x2="16" y2="22" stroke="#B8860B" strokeWidth="0.5" opacity="0.5" />
    <line x1="20" y1="16" x2="28" y2="20" stroke="#B8860B" strokeWidth="0.5" opacity="0.5" />
  </svg>
);

const SilverBarIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* Top face */}
    <polygon points="4,10 16,5 28,10 16,15" fill="#D0D8E0" />
    {/* Right face */}
    <polygon points="28,10 28,22 16,27 16,15" fill="#8A9AB0" />
    {/* Left face */}
    <polygon points="4,10 4,22 16,27 16,15" fill="#A8B8C8" />
    {/* Top highlight */}
    <polygon points="6,10.5 16,6.5 26,10.5 16,14.5" fill="#F0F4F8" opacity="0.6" />
    {/* Shine streak on top */}
    <line x1="10" y1="8" x2="22" y2="12" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.7" />
    {/* Bar ridge lines */}
    <line x1="8" y1="18" x2="16" y2="22" stroke="#6A7A8A" strokeWidth="0.5" opacity="0.5" />
    <line x1="20" y1="16" x2="28" y2="20" stroke="#6A7A8A" strokeWidth="0.5" opacity="0.5" />
  </svg>
);

const OilBarrelIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* Barrel body */}
    <ellipse cx="16" cy="26" rx="10" ry="3.5" fill="#2C1A0E" />
    <rect x="6" y="8" width="20" height="18" rx="3" fill="#4A2C0A" />
    {/* Barrel highlight */}
    <rect x="6" y="8" width="20" height="18" rx="3" fill="url(#oilGrad)" />
    <defs>
      <linearGradient id="oilGrad" x1="6" y1="8" x2="26" y2="8" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#8B4513" stopOpacity="0.8" />
        <stop offset="40%" stopColor="#CD853F" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#4A2C0A" stopOpacity="1" />
      </linearGradient>
    </defs>
    {/* Top ellipse */}
    <ellipse cx="16" cy="8" rx="10" ry="3.5" fill="#8B4513" />
    <ellipse cx="16" cy="8" rx="8" ry="2.5" fill="#CD853F" />
    {/* Barrel rings */}
    <rect x="6" y="12" width="20" height="2.5" rx="1" fill="#2C1A0E" opacity="0.6" />
    <rect x="6" y="20" width="20" height="2.5" rx="1" fill="#2C1A0E" opacity="0.6" />
    {/* Shine */}
    <rect x="9" y="9" width="4" height="14" rx="2" fill="#CD853F" opacity="0.25" />
    {/* Oil drop on top */}
    <circle cx="16" cy="5" r="2" fill="#1A1A2E" opacity="0.8" />
    <ellipse cx="16.5" cy="4.5" rx="0.6" ry="0.8" fill="#555" opacity="0.5" />
  </svg>
);

const BrentBarrelIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* Barrel body — slightly darker/redder for Brent */}
    <ellipse cx="16" cy="26" rx="10" ry="3.5" fill="#1A0A0A" />
    <rect x="6" y="8" width="20" height="18" rx="3" fill="#3A0A0A" />
    <rect x="6" y="8" width="20" height="18" rx="3" fill="url(#brentGrad)" />
    <defs>
      <linearGradient id="brentGrad" x1="6" y1="8" x2="26" y2="8" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7B1A1A" stopOpacity="0.8" />
        <stop offset="40%" stopColor="#C0392B" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#3A0A0A" stopOpacity="1" />
      </linearGradient>
    </defs>
    <ellipse cx="16" cy="8" rx="10" ry="3.5" fill="#7B1A1A" />
    <ellipse cx="16" cy="8" rx="8" ry="2.5" fill="#C0392B" />
    <rect x="6" y="12" width="20" height="2.5" rx="1" fill="#1A0A0A" opacity="0.6" />
    <rect x="6" y="20" width="20" height="2.5" rx="1" fill="#1A0A0A" opacity="0.6" />
    <rect x="9" y="9" width="4" height="14" rx="2" fill="#E74C3C" opacity="0.2" />
    <circle cx="16" cy="5" r="2" fill="#1A1A2E" opacity="0.8" />
  </svg>
);

const NaturalGasIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* Gas canister body */}
    <ellipse cx="16" cy="27" rx="8" ry="2.5" fill="#1A3A2A" />
    <rect x="8" y="10" width="16" height="17" rx="4" fill="url(#gasGrad)" />
    <defs>
      <linearGradient id="gasGrad" x1="8" y1="10" x2="24" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1A5C3A" />
        <stop offset="45%" stopColor="#27AE60" />
        <stop offset="100%" stopColor="#1A3A2A" />
      </linearGradient>
    </defs>
    <ellipse cx="16" cy="10" rx="8" ry="2.8" fill="#27AE60" />
    <ellipse cx="16" cy="10" rx="6" ry="2" fill="#2ECC71" />
    {/* Valve on top */}
    <rect x="13" y="6" width="6" height="4" rx="1.5" fill="#1A5C3A" />
    <rect x="14.5" y="4" width="3" height="3" rx="1" fill="#145A32" />
    {/* Label band */}
    <rect x="8" y="16" width="16" height="5" rx="0" fill="#145A32" opacity="0.5" />
    {/* Shine */}
    <rect x="10" y="11" width="3" height="14" rx="1.5" fill="#2ECC71" opacity="0.2" />
    {/* Flame above */}
    <path d="M16 2 C14 3.5 13 5 14.5 6.5 C15 5.5 15.5 5 16 4.5 C16.5 5 17 5.5 17.5 6.5 C19 5 18 3.5 16 2Z"
      fill="#F39C12" />
    <path d="M16 3 C15.2 4 14.8 5 15.5 5.8 C15.8 5.2 16 5 16 4.5 C16 5 16.2 5.2 16.5 5.8 C17.2 5 16.8 4 16 3Z"
      fill="#F1C40F" />
  </svg>
);

// ── Market Hours ──────────────────────────────────────────────────────────
interface MarketInfo { name: string; flag: string; tz: string; localTime: string; openUTC: number; closeUTC: number; color: string; }
const MARKETS: MarketInfo[] = [
  { name: "Tokyo",    flag: "🇯🇵", tz: "JST",  localTime: "09:00–15:00", openUTC:   0, closeUTC: 360, color: "#e74c3c" },
  { name: "Shanghai", flag: "🇨🇳", tz: "CST",  localTime: "09:30–15:00", openUTC:  90, closeUTC: 420, color: "#f39c12" },
  { name: "India",    flag: "🇮🇳", tz: "IST",  localTime: "09:15–15:30", openUTC: 225, closeUTC: 570, color: "#27ae60" },
  { name: "Frankfurt",flag: "🇩🇪", tz: "CET",  localTime: "09:00–17:30", openUTC: 480, closeUTC: 990, color: "#2980b9" },
  { name: "London",   flag: "🇬🇧", tz: "GMT",  localTime: "08:00–16:30", openUTC: 480, closeUTC: 990, color: "#8e44ad" },
  { name: "New York", flag: "🇺🇸", tz: "EST",  localTime: "09:30–16:00", openUTC: 870, closeUTC:1260, color: "#2563eb" },
];
function getStatus(m: MarketInfo): "open" | "pre" | "closed" {
  const now = new Date(); const day = now.getUTCDay();
  if (day === 0 || day === 6) return "closed";
  const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
  if (mins >= m.openUTC && mins < m.closeUTC) return "open";
  if (mins >= m.openUTC - 30 && mins < m.openUTC) return "pre";
  return "closed";
}

function SectionLabel({ icon: Icon, children, isLight }: { icon?: any; children: React.ReactNode; isLight: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {Icon && (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${G}12`, border: `1px solid ${G}25` }}>
          <Icon className="w-4 h-4" style={{ color: G }} />
        </div>
      )}
      <h2 className={`text-xl font-extrabold tracking-tight ${isLight ? "text-gray-900" : "text-slate-100"}`}>{children}</h2>
      <div className={`flex-1 h-px ml-2 ${isLight ? "bg-gray-100" : "bg-white/10"}`} />
    </div>
  );
}

const MarketsView = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { data, loading, lastUpdated, refresh } = useGlobalMarkets();
  const [refreshing, setRefreshing] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  const isLoading = loading === 'idle' || loading === 'loading';
  const commodities: Commodity[] = useMemo(() => data?.commodities || [], [data?.commodities]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try { await refresh(); } catch {} finally { setRefreshing(false); }
  };

  const pageBg    = isLight ? "bg-[#F8F7F4]" : "bg-[#0c1a2e]";
  const cardBg    = isLight ? "bg-white border-gray-100" : "bg-[#0e2038] border-white/8";
  const textPrim  = isLight ? "text-gray-900" : "text-slate-100";
  const textSec   = isLight ? "text-gray-500" : "text-slate-400";
  const textMuted = isLight ? "text-gray-400" : "text-slate-500";

  // ✅ 3D commodity icons mapped by name
  const categoryIcon: Record<string, React.ReactNode> = {
    "Gold":          <GoldBarIcon size={26} />,
    "Silver":        <SilverBarIcon size={26} />,
    "Crude Oil WTI": <OilBarrelIcon size={26} />,
    "Brent Crude":   <BrentBarrelIcon size={26} />,
    "Natural Gas":   <NaturalGasIcon size={26} />,
  };

  // ✅ 3D icons also used in snapshot row (smaller)
  const categoryIconSm: Record<string, React.ReactNode> = {
    "Gold":          <GoldBarIcon size={16} />,
    "Silver":        <SilverBarIcon size={16} />,
    "Crude Oil WTI": <OilBarrelIcon size={16} />,
    "Brent Crude":   <BrentBarrelIcon size={16} />,
    "Natural Gas":   <NaturalGasIcon size={16} />,
  };

  const MARKET_ASSET_CARDS = [
    { label: "Stock Markets",    icon: <BarChart3    className="w-6 h-6 text-green-600"  />, bg: "bg-green-50",   desc: "Track global equity indices with live data & analysis.",       stat: "View in Global Markets →", href: "/global-markets" },
    { label: "Forex / Currency", icon: <DollarSign   className="w-6 h-6 text-blue-600"   />, bg: "bg-blue-50",    desc: "Monitor major & exotic currency pairs with live rates.",        stat: "View Currency Page →",     href: "/currency" },
    { label: "Commodities",      icon: <GoldBarIcon size={24} />,                            bg: "bg-amber-50",   desc: "Gold, silver, crude oil, natural gas and more.",                stat: "See below ↓",              href: "#section-commodities" },
  ];

  return (
    <Layout>
      <div className={`min-h-screen ${pageBg}`}>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <div className={`border-b ${isLight ? "bg-white border-gray-200" : "bg-[#0e2038] border-white/8"}`}>
          <div className="h-0.5" style={{ background: `linear-gradient(to right, ${G}, ${O})` }} />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3"
                  style={{ background: `${G}12`, color: G, border: `1px solid ${G}25` }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G }} />
                  LIVE MARKETS
                </div>
                <h1 className={`text-4xl sm:text-5xl font-black tracking-tight leading-none mb-2 ${textPrim}`}>
                  Markets
                  <span className="block" style={{ color: G }}>Overview</span>
                </h1>
                <p className={`text-sm ${textSec}`}>
                  Stocks · Commodities · Currencies — all in one place
                </p>
              </div>
              <div className="flex items-center gap-3">
                {lastUpdated && (
                  <div className={`flex items-center gap-1.5 text-xs ${textMuted}`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>Updated {Math.floor((Date.now() - lastUpdated) / 60000)}m ago</span>
                  </div>
                )}
                <button onClick={handleRefresh} disabled={refreshing || isLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 shadow-md"
                  style={{ background: G }}>
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 max-w-7xl">

          {/* ── Asset Category Cards ──────────────────────────────── */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {MARKET_ASSET_CARDS.map(c => (
                <a key={c.label} href={c.href}
                  className={`rounded-2xl border p-6 flex items-start gap-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${cardBg}`}>
                  <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    {c.icon}
                  </div>
                  <div>
                    <h3 className={`font-extrabold text-base mb-1 ${textPrim}`}>{c.label}</h3>
                    <p className={`text-sm leading-relaxed mb-2 ${textSec}`}>{c.desc}</p>
                    <span className="text-xs font-bold" style={{ color: G }}>{c.stat}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* ── Market Hours ─────────────────────────────────────── */}
          <section className="mb-12">
            <SectionLabel icon={Clock} isLight={isLight}>Market Hours — Open Now</SectionLabel>
            <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
              <div className={`grid grid-cols-3 sm:grid-cols-6 divide-x ${isLight ? "divide-gray-100" : "divide-white/5"}`}>
                {MARKETS.map(m => {
                  const s = getStatus(m);
                  return (
                    <div key={m.name} className={`p-4 text-center ${
                      s === 'open'   ? (isLight ? "bg-emerald-50/60" : "bg-emerald-900/10") :
                      s === 'pre'    ? (isLight ? "bg-amber-50/60"   : "bg-amber-900/10")   : ""
                    }`}>
                      <div className="text-2xl mb-1">{m.flag}</div>
                      <p className={`text-[10px] font-bold ${textPrim}`}>{m.name}</p>
                      <p className={`text-[9px] mb-2 ${textMuted}`}>{m.tz}</p>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                        s === 'open' ? "bg-emerald-100 text-emerald-700" :
                        s === 'pre'  ? "bg-amber-100 text-amber-700" :
                        isLight      ? "bg-gray-100 text-gray-400" : "bg-white/5 text-slate-500"
                      }`}>{s === 'open' ? "OPEN" : s === 'pre' ? "PRE" : "CLOSED"}</span>
                      <div className="h-0.5 rounded-full mt-2" style={{
                        background: s === 'open' ? m.color : s === 'pre' ? '#f59e0b' : isLight ? '#e5e7eb' : 'rgba(255,255,255,0.08)',
                        opacity: s === 'open' ? 1 : 0.3,
                      }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Commodities ───────────────────────────────────────── */}
          <section id="section-commodities" className="mb-12 scroll-mt-20">
            <SectionLabel icon={Flame} isLight={isLight}>Commodities</SectionLabel>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={`h-52 rounded-2xl animate-pulse border ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/5 border-white/8"}`} />
                ))}
              </div>
            ) : commodities.length > 0 ? (
              <>
                {/* Summary row */}
                <div className={`flex items-center gap-4 mb-4 px-4 py-3 rounded-xl border text-xs flex-wrap ${
                  isLight ? "bg-white border-gray-100 text-gray-500" : "bg-[#0e2038] border-white/8 text-slate-400"
                }`}>
                  <span className="font-semibold">Snapshot:</span>
                  {commodities.map(c => (
                    <span key={c.symbol} className="flex items-center gap-1.5">
                      {categoryIconSm[c.name] ?? <Activity className="w-3 h-3" />}
                      <span className={`font-bold ${isLight ? "text-gray-700" : "text-slate-300"}`}>{c.name}</span>
                      <span className={c.changePercent >= 0 ? "text-emerald-600 font-bold" : "text-red-500 font-bold"}>
                        {c.changePercent >= 0 ? "▲" : "▼"}{Math.abs(c.changePercent).toFixed(2)}%
                      </span>
                    </span>
                  ))}
                  {lastUpdated && (
                    <span className="ml-auto flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.floor((Date.now() - lastUpdated) / 60000)}m ago · ~15min delayed
                    </span>
                  )}
                </div>

                {/* ✅ Commodity cards with 3D icon passed via categoryIcon */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {commodities.map(c => (
                    <CommodityCard
                      key={c.symbol}
                      name={c.name} price={c.price} change={c.change}
                      changePercent={c.changePercent} unit={c.unit}
                      isPositive={c.changePercent >= 0}
                      candles={c.candles}
                      lastUpdated={lastUpdated ?? undefined}
                      isLight={isLight}
                      icon={categoryIcon[c.name]}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className={`rounded-2xl border py-16 flex flex-col items-center gap-3 ${isLight ? "bg-white border-gray-100" : "bg-[#0e2038] border-white/8"}`}>
                <Activity className={`w-10 h-10 ${textMuted}`} />
                <p className={`text-sm font-semibold ${textSec}`}>Commodity data unavailable</p>
                <button onClick={handleRefresh} className="text-xs font-bold px-3 py-1.5 rounded-lg"
                  style={{ background: `${G}12`, color: G }}>
                  Retry
                </button>
              </div>
            )}
          </section>

          {/* ── Navigate to other pages ──────────────────────────── */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <a href="/global-markets" className={`rounded-2xl border p-6 flex items-center gap-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${cardBg}`}>
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className={`font-extrabold text-lg mb-1 ${textPrim}`}>Global Markets</h3>
                  <p className={`text-sm ${textSec}`}>US, Europe & Asia indices with live charts, bonds, VIX & events</p>
                </div>
              </a>
              <a href="/currency" className={`rounded-2xl border p-6 flex items-center gap-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${cardBg}`}>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className={`font-extrabold text-lg mb-1 ${textPrim}`}>Currency / Forex</h3>
                  <p className={`text-sm ${textSec}`}>Live currency pairs, exchange rates, candlestick charts & more</p>
                </div>
              </a>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
};

export default MarketsView;