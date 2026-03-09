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

// ── Market Hours (same as GlobalView) ─────────────────────────────
interface MarketInfo { name: string; flag: string; tz: string; localTime: string; openUTC: number; closeUTC: number; color: string; }
const MARKETS: MarketInfo[] = [
  { name: "Tokyo",    flag: "🇯🇵", tz: "JST",  localTime: "09:00–15:00", openUTC:   0, closeUTC: 360, color: "#e74c3c" },
  { name: "Shanghai", flag: "🇨🇳", tz: "CST",  localTime: "09:30–15:00", openUTC:  90, closeUTC: 420, color: "#f39c12" },
  { name: "India",    flag: "🇮🇳", tz: "IST",  localTime: "09:15–15:30", openUTC: 225, closeUTC: 570, color: "#27ae60" },
  { name: "Frankfurt",flag: "🇩🇪", tz: "CET",  localTime: "09:00–17:30", openUTC: 480, closeUTC: 990, color: "#2980b9" },
  { name: "London",   flag: "🇬🇧", tz: "GMT",  localTime: "08:00–16:30", openUTC: 480, closeUTC: 990, color: "#8e44ad" },
  { name: "New York", flag: "🇺🇸", tz: "EST",  localTime: "09:30–16:00", openUTC: 870, closeUTC:1260, color: "#2563eb" },
];
function getStatus(m: MarketInfo): "open"|"pre"|"closed" {
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

  // Commodity category icons
  const categoryIcon: Record<string, React.ReactNode> = {
    "Gold":          <span className="text-base">🥇</span>,
    "Silver":        <span className="text-base">🥈</span>,
    "Crude Oil WTI": <Flame className="w-4 h-4 text-orange-500" />,
    "Brent Crude":   <Flame className="w-4 h-4 text-red-500" />,
    "Natural Gas":   <Zap   className="w-4 h-4 text-yellow-500" />,
  };

  const MARKET_ASSET_CARDS = [
    { label: "Stock Markets",    icon: <BarChart3    className="w-6 h-6 text-green-600"  />, bg: "bg-green-50",   desc: "Track global equity indices with live data & analysis.",       stat: "View in Global Markets →", href: "/global-markets" },
    { label: "Forex / Currency", icon: <DollarSign   className="w-6 h-6 text-blue-600"   />, bg: "bg-blue-50",    desc: "Monitor major & exotic currency pairs with live rates.",        stat: "View Currency Page →",     href: "/currency" },
    { label: "Commodities",      icon: <Flame        className="w-6 h-6 text-orange-600" />, bg: "bg-orange-50",  desc: "Gold, silver, crude oil, natural gas and more.",                stat: "See below ↓",              href: "#section-commodities" },
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
                <div className={`flex items-center gap-4 mb-4 px-4 py-3 rounded-xl border text-xs ${
                  isLight ? "bg-white border-gray-100 text-gray-500" : "bg-[#0e2038] border-white/8 text-slate-400"
                }`}>
                  <span className="font-semibold">Snapshot:</span>
                  {commodities.map(c => (
                    <span key={c.symbol} className="flex items-center gap-1">
                      {categoryIcon[c.name] ?? <Activity className="w-3 h-3" />}
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