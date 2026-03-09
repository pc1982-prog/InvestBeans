import Layout from "@/components/Layout";
import CleanChart from "@/components/CleanChart";
import TradingViewModal from "@/components/Tradingviewmodal";
import { useGlobalMarkets } from "@/hooks/useGlobalMarkets";
import { IndexQuote, BondYield, RegionSummary } from "@/services/globalMarkets/types";
import {
  TrendingUp, TrendingDown, Activity, Globe,
  Clock, MapPin, RefreshCw, AlertCircle, BarChart3, LineChart,
  Landmark, Percent, ChevronRight,
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/controllers/Themecontext";

const G = "#2D4A35";
const O = "#C07A3A";

// ── Market Hours (UTC-based) ───────────────────────────────────────
interface MarketInfo {
  name: string;
  flag: string;
  tz: string;
  localTime: string;
  openUTC: number;   // minutes since midnight UTC
  closeUTC: number;
  note: string;
  color: string;
}

const MARKETS: MarketInfo[] = [
  { name: "Tokyo (TSE)",    flag: "🇯🇵", tz: "JST (UTC+9)",  localTime: "09:00 – 15:00",
    openUTC:   0, closeUTC: 360, note: "Asia session",  color: "#e74c3c" },
  { name: "Shanghai (SSE)", flag: "🇨🇳", tz: "CST (UTC+8)",  localTime: "09:30 – 15:00",
    openUTC:  90, closeUTC: 420, note: "Asia session",  color: "#f39c12" },
  { name: "Hong Kong (HKEX)",flag:"🇭🇰", tz: "HKT (UTC+8)",  localTime: "09:30 – 16:00",
    openUTC:  90, closeUTC: 480, note: "Asia session",  color: "#e67e22" },
  { name: "India (NSE/BSE)", flag: "🇮🇳", tz: "IST (UTC+5:30)",localTime: "09:15 – 15:30",
    openUTC: 225, closeUTC: 570, note: "India session", color: "#27ae60" },
  { name: "Frankfurt (XETRA)",flag:"🇩🇪",tz: "CET (UTC+1)",  localTime: "09:00 – 17:30",
    openUTC: 480, closeUTC: 990, note: "Europe session",color: "#2980b9" },
  { name: "London (LSE)",   flag: "🇬🇧", tz: "GMT (UTC+0)",  localTime: "08:00 – 16:30",
    openUTC: 480, closeUTC: 990, note: "Europe session",color: "#8e44ad" },
  { name: "NYSE / NASDAQ",  flag: "🇺🇸", tz: "EST (UTC-5)",  localTime: "09:30 – 16:00",
    openUTC: 870, closeUTC:1260, note: "US session",   color: "#2563eb" },
];

function getMarketOpen(market: MarketInfo): "open" | "closed" | "pre" {
  const now = new Date();
  const day = now.getUTCDay();
  if (day === 0 || day === 6) return "closed";
  const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
  if (mins >= market.openUTC && mins < market.closeUTC) return "open";
  // Pre-market: 30 min before open
  if (mins >= market.openUTC - 30 && mins < market.openUTC) return "pre";
  return "closed";
}

function formatLocalTime(market: MarketInfo): string {
  const offsets: Record<string, number> = {
    "JST (UTC+9)": 9, "CST (UTC+8)": 8, "HKT (UTC+8)": 8,
    "IST (UTC+5:30)": 5.5, "CET (UTC+1)": 1, "GMT (UTC+0)": 0, "EST (UTC-5)": -5,
  };
  const off = offsets[market.tz] ?? 0;
  const utcMs = Date.now();
  const localMs = utcMs + off * 3600 * 1000;
  const d = new Date(localMs);
  return d.getUTCHours().toString().padStart(2,'0') + ':' + d.getUTCMinutes().toString().padStart(2,'0');
}

// ── Error banner ───────────────────────────────────────────────────
function ErrorBanner({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <div className="flex items-start gap-3 p-4 mb-8 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
      <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
      <div>
        <strong className="block mb-0.5 font-bold text-red-800">Error loading data</strong>
        <span className="text-red-600">{error}</span>
      </div>
    </div>
  );
}

function SectionLabel({ icon: Icon, children, isLight }: { icon?: any; children: React.ReactNode; isLight?: boolean }) {
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

const VIX_STYLE: Record<string, { wrap: string; badge: string; label: string }> = {
  low:      { wrap: "bg-emerald-50 border-emerald-200", badge: "bg-emerald-100 text-emerald-800 border-emerald-200", label: "LOW VOLATILITY" },
  moderate: { wrap: "bg-amber-50 border-amber-200",    badge: "bg-amber-100 text-amber-800 border-amber-200",    label: "MODERATE VOLATILITY" },
  high:     { wrap: "bg-orange-50 border-orange-200",  badge: "bg-orange-100 text-orange-800 border-orange-200",  label: "HIGH VOLATILITY" },
  extreme:  { wrap: "bg-red-50 border-red-200",        badge: "bg-red-100 text-red-800 border-red-200",           label: "EXTREME VOLATILITY" },
};

// ── Market Selector ────────────────────────────────────────────────
function MarketSelector({ sectionId, title, markets, icon, onChartClick, autoSelectSymbol, isLight }: {
  sectionId: string; title: string; markets: IndexQuote[]; icon?: any;
  onChartClick: (symbol: string, name: string) => void;
  autoSelectSymbol?: string; isLight?: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    if (!autoSelectSymbol) return;
    const idx = markets.findIndex(m => m.symbol === autoSelectSymbol);
    if (idx !== -1) setSelectedIndex(idx);
  }, [autoSelectSymbol, markets]);

  if (markets.length === 0) return (
    <div className="text-center py-16">
      <Activity className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-slate-600"}`} />
      <p className={`text-sm ${isLight ? "text-gray-400" : "text-slate-500"}`}>No market data available</p>
    </div>
  );

  const sel = markets[selectedIndex];
  return (
    <section id={sectionId} className="mb-12 scroll-mt-24">
      <SectionLabel icon={icon} isLight={isLight}>{title}</SectionLabel>
      <div className="flex items-center gap-2.5 mb-5 flex-wrap">
        {markets.map((m, idx) => {
          const pos = m.changePercent >= 0;
          const active = selectedIndex === idx;
          return (
            <button key={m.symbol} onClick={() => setSelectedIndex(idx)}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 border"
              style={active
                ? { background: G, color: "#fff", borderColor: G, boxShadow: `0 4px 12px ${G}30` }
                : isLight
                  ? { background: "#fff", color: "#374151", borderColor: "#e5e7eb" }
                  : { background: "rgba(255,255,255,0.05)", color: "#94a3b8", borderColor: "rgba(255,255,255,0.1)" }
              }>
              <span className="flex items-center gap-2">
                {m.name}
                <span style={{ color: active ? "rgba(255,255,255,0.85)" : pos ? "#16a34a" : "#dc2626" }}
                  className="text-xs font-bold">
                  {pos ? "+" : ""}{m.changePercent.toFixed(2)}%
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {/* No outer onClick wrapper here — period buttons inside CleanChart stop propagation */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm ${isLight ? "border-gray-100" : "border-white/8"}`}>
        <CleanChart
          symbol={sel.symbol} name={sel.name} price={sel.price}
          change={sel.change} changePercent={sel.changePercent}
          high={sel.high} low={sel.low} isPositive={sel.changePercent >= 0}
          candles={sel.candles ?? []}
        />
      </div>
      {/* Manual "View in TradingView" button — doesn't interfere with period buttons */}
      <button
        onClick={() => onChartClick(sel.symbol, sel.name)}
        className="mt-3 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
        style={{ color: G, background: `${G}12`, border: `1px solid ${G}25` }}
      >
        <BarChart3 className="w-3.5 h-3.5" />
        Open detailed chart
        <ChevronRight className="w-3 h-3" />
      </button>
    </section>
  );
}

// ── Sticky Data Nav ────────────────────────────────────────────────
function StickyDataNav({
  usMarkets, europeMarkets, asiaMarkets,
  refreshing, isLoading, onRefresh, lastUpdated, isLight,
}: {
  usMarkets: IndexQuote[]; europeMarkets: IndexQuote[]; asiaMarkets: IndexQuote[];
  refreshing: boolean; isLoading: boolean; onRefresh: () => void;
  lastUpdated: number | null; isLight: boolean;
}) {
  const allMarkets = [...asiaMarkets, ...europeMarkets, ...usMarkets];
  const navBg     = isLight ? "bg-white/95 border-b border-gray-200" : "bg-[#0b1825]/95 border-b border-white/8";
  const textPrim  = isLight ? "text-gray-900" : "text-slate-100";
  const textSec   = isLight ? "text-gray-400" : "text-slate-500";

  const sections = [
    { label: "US Markets",     id: "section-us"     },
    { label: "Europe",         id: "section-europe" },
    { label: "Asia Pacific",   id: "section-asia"   },
    { label: "Bonds & VIX",   id: "section-bonds"  },
    { label: "Regional",       id: "section-regions"},
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const formatAgo = (ts: number) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    return m < 60 ? `${m}m ago` : `${Math.floor(m / 60)}h ago`;
  };

  return (
    <div className={`sticky top-0 z-40 backdrop-blur-md shadow-sm ${navBg}`}>
      {/* Top gradient accent */}
      <div className="h-0.5" style={{ background: `linear-gradient(to right, ${G}, ${O}, #2563eb)` }} />

      {/* Main nav bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center gap-4 py-2.5 overflow-x-auto scrollbar-hide">
          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0 mr-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
              style={{ background: `${G}12`, color: G, border: `1px solid ${G}25` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G }} />
              LIVE
            </div>
            <span className={`text-sm font-black tracking-tight hidden sm:block ${textPrim}`}>
              Global Markets
            </span>
          </div>

          {/* Divider */}
          <div className={`h-6 w-px shrink-0 ${isLight ? "bg-gray-200" : "bg-white/10"}`} />

          {/* Key indices ticker */}
          {!isLoading && allMarkets.slice(0, 7).map(m => {
            const pos = m.changePercent >= 0;
            return (
              <div key={m.symbol} className="flex items-center gap-1.5 shrink-0 cursor-default">
                <span className={`text-[11px] font-bold ${textSec}`}>{m.name}</span>
                <span className={`text-[11px] font-black ${textPrim}`}>
                  {m.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
                <span className={`text-[11px] font-bold ${pos ? "text-emerald-500" : "text-red-500"}`}>
                  {pos ? "▲" : "▼"}{Math.abs(m.changePercent).toFixed(2)}%
                </span>
              </div>
            );
          })}

          {isLoading && (
            <div className={`text-xs ${textSec} animate-pulse`}>Loading markets…</div>
          )}

          {/* Spacer */}
          <div className="flex-1 min-w-4" />

          {/* Timestamp */}
          {lastUpdated && (
            <div className={`flex items-center gap-1 text-[10px] font-medium shrink-0 ${textSec}`}>
              <Clock className="w-3 h-3" />
              {formatAgo(lastUpdated)}
            </div>
          )}

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={refreshing || isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-50 shrink-0"
            style={{ background: G }}
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Section nav links */}
        <div className={`flex items-center gap-0.5 pb-1.5 overflow-x-auto scrollbar-hide border-t ${isLight ? "border-gray-100" : "border-white/5"}`}>
          {sections.map(s => (
            <button key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`px-3 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition-colors ${
                isLight ? "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Market Hours Panel ─────────────────────────────────────────────
function MarketHoursPanel({ isLight }: { isLight: boolean }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  const cardBg = isLight ? "bg-white border-gray-100" : "bg-[#0e2038] border-white/8";

  return (
    <section id="section-market-hours" className="mb-12 scroll-mt-24">
      <SectionLabel icon={Clock} isLight={isLight}>World Market Hours</SectionLabel>
      <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
        <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-0 divide-x ${isLight ? "divide-gray-100" : "divide-white/5"}`}>
          {MARKETS.map(market => {
            const status     = getMarketOpen(market);
            const localNow   = formatLocalTime(market);
            const isOpen     = status === "open";
            const isPre      = status === "pre";
            return (
              <div key={market.name} className={`p-3 sm:p-4 flex flex-col gap-1.5 ${
                isOpen ? (isLight ? "bg-emerald-50/60" : "bg-emerald-900/10") :
                isPre  ? (isLight ? "bg-amber-50/60"   : "bg-amber-900/10")   :
                         (isLight ? "" : "")
              }`}>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-base">{market.flag}</span>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
                    isOpen ? "bg-emerald-100 text-emerald-700" :
                    isPre  ? "bg-amber-100 text-amber-700" :
                             isLight ? "bg-gray-100 text-gray-400" : "bg-white/5 text-slate-500"
                  }`}>
                    {isOpen ? "OPEN" : isPre ? "PRE" : "CLOSED"}
                  </span>
                </div>
                <p className={`text-[10px] font-bold leading-tight ${isLight ? "text-gray-700" : "text-slate-300"}`}>
                  {market.name}
                </p>
                <p className={`text-[9px] ${isLight ? "text-gray-400" : "text-slate-500"}`}>{market.tz}</p>
                <p className={`text-[9px] font-semibold ${isLight ? "text-gray-500" : "text-slate-400"}`}>
                  {market.localTime}
                </p>
                <p className={`text-[10px] font-black mt-auto ${
                  isOpen ? "text-emerald-600" : isPre ? "text-amber-600" : isLight ? "text-gray-400" : "text-slate-500"
                }`}>
                  {localNow} local
                </p>
                <div className="h-0.5 rounded-full mt-1" style={{
                  background: isOpen ? market.color : isPre ? '#f59e0b' : isLight ? '#e5e7eb' : 'rgba(255,255,255,0.08)',
                  opacity: isOpen ? 1 : 0.35,
                }} />
              </div>
            );
          })}
        </div>
        <div className={`px-5 py-3 border-t text-[10px] flex items-center gap-3 ${
          isLight ? "border-gray-50 text-gray-400 bg-gray-50" : "border-white/5 text-slate-600 bg-white/3"
        }`}>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Open now
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Pre-market (30 min window)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-300" /> Closed
          </span>
          <span className="ml-auto">Times shown in local timezone · Updates every minute</span>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
export default function GlobalView() {
  const { data, loading, error, lastUpdated, refresh } = useGlobalMarkets();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [modalSymbol, setModalSymbol] = useState("");
  const [modalName,   setModalName]   = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get("scrollTo");
    if (!scrollTo) return;
    const t = setTimeout(() => {
      document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
    return () => clearTimeout(t);
  }, [location.search]);

  const [tickerSymbol, setTickerSymbol] = useState<string | null>(null);
  const scrollDoneRef = useRef(false);
  const isLoading = loading === "idle" || loading === "loading";

  useEffect(() => {
    const state = location.state as { symbol?: string; name?: string } | null;
    if (state?.symbol) { setTickerSymbol(state.symbol); window.history.replaceState({}, ''); }
  }, []);

  const usMarkets       = useMemo(() => data?.indices?.us       || [], [data?.indices?.us]);
  const europeMarkets   = useMemo(() => data?.indices?.europe   || [], [data?.indices?.europe]);
  const asiaMarkets     = useMemo(() => data?.indices?.asia     || [], [data?.indices?.asia]);
  const bondsData       = useMemo(() => data?.bonds             || [], [data?.bonds]);
  const regionsData     = useMemo(() => data?.regions           || [], [data?.regions]);
  const eventsData      = useMemo(() => data?.events            || [], [data?.events]);

  useEffect(() => {
    if (!tickerSymbol || isLoading || scrollDoneRef.current) return;
    if (!usMarkets.length && !europeMarkets.length && !asiaMarkets.length) return;
    let sectionId: string | null = null;
    if (usMarkets.some(m => m.symbol === tickerSymbol))          sectionId = "section-us";
    else if (europeMarkets.some(m => m.symbol === tickerSymbol)) sectionId = "section-europe";
    else if (asiaMarkets.some(m => m.symbol === tickerSymbol))   sectionId = "section-asia";
    if (sectionId) {
      scrollDoneRef.current = true;
      setTimeout(() => { document.getElementById(sectionId!)?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 200);
    }
  }, [tickerSymbol, isLoading, usMarkets, europeMarkets, asiaMarkets]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try { await refresh(); } catch (e) { console.error(e); } finally { setRefreshing(false); }
  };

  const handleChartClick = (symbol: string, name: string) => {
    setModalSymbol(symbol); setModalName(name); setModalOpen(true);
  };

  const SkeletonBlock = ({ h = "h-80" }: { h?: string }) => (
    <div className={`${h} rounded-2xl animate-pulse border mb-12 ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/5 border-white/8"}`} />
  );

  return (
    <Layout>
      {/* ── Sticky Data Nav (replaces old hero) ─────────────────── */}
      <StickyDataNav
        usMarkets={usMarkets} europeMarkets={europeMarkets} asiaMarkets={asiaMarkets}
        refreshing={refreshing} isLoading={isLoading} onRefresh={handleRefresh}
        lastUpdated={lastUpdated ?? null} isLight={isLight}
      />

      <div className={`min-h-screen ${isLight ? "bg-[#F8F7F4]" : "bg-[#0c1a2e]"}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 max-w-7xl">

          <ErrorBanner error={error} />

          {/* Market Hours — top of page so user sees open/closed status */}
          <MarketHoursPanel isLight={isLight} />

          {isLoading ? <SkeletonBlock /> : (
            <MarketSelector sectionId="section-us" title="United States Markets"
              markets={usMarkets} icon={BarChart3}
              onChartClick={handleChartClick}
              autoSelectSymbol={tickerSymbol ?? undefined} isLight={isLight} />
          )}

          {isLoading ? <SkeletonBlock /> : (
            <MarketSelector sectionId="section-europe" title="European Markets"
              markets={europeMarkets} icon={LineChart}
              onChartClick={handleChartClick}
              autoSelectSymbol={tickerSymbol ?? undefined} isLight={isLight} />
          )}

          {isLoading ? <SkeletonBlock /> : (
            <MarketSelector sectionId="section-asia" title="Asia Pacific Markets"
              markets={asiaMarkets} icon={Globe}
              onChartClick={handleChartClick}
              autoSelectSymbol={tickerSymbol ?? undefined} isLight={isLight} />
          )}

          {/* BONDS + VIX */}
          <div id="section-bonds" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 scroll-mt-24">
            <div>
              <SectionLabel icon={Landmark} isLight={isLight}>Treasury Yields</SectionLabel>
              <div className={`rounded-2xl border shadow-sm overflow-hidden ${isLight ? "bg-white border-gray-100" : "bg-[#0e2038] border-white/8"}`}>
                {isLoading ? (
                  <div className={`h-64 animate-pulse ${isLight ? "bg-gray-50" : "bg-white/5"}`} />
                ) : bondsData.length > 0 ? (
                  <div className={`divide-y ${isLight ? "divide-gray-50" : "divide-white/5"}`}>
                    {bondsData.map((bond: BondYield, i: number) => {
                      const pos = bond.change >= 0;
                      return (
                        <div key={i} className={`flex items-center justify-between px-6 py-4 transition-colors ${isLight ? "hover:bg-gray-50/60" : "hover:bg-white/5"}`}>
                          <div>
                            <p className={`font-bold text-sm ${isLight ? "text-gray-900" : "text-slate-100"}`}>{bond.name}</p>
                            <p className="text-xs font-semibold mt-0.5" style={{ color: pos ? "#16a34a" : "#dc2626" }}>
                              {pos ? "+" : ""}{bond.change.toFixed(3)}%
                            </p>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <span className={`text-2xl font-black ${isLight ? "text-gray-900" : "text-slate-100"}`}>{bond.yield.toFixed(3)}%</span>
                            {pos ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className={`p-10 text-center text-sm ${isLight ? "text-gray-300" : "text-slate-600"}`}>Bond data unavailable</p>
                )}
              </div>
            </div>

            <div>
              <SectionLabel icon={Percent} isLight={isLight}>Volatility Index (VIX)</SectionLabel>
              {isLoading ? (
                <div className={`h-64 rounded-2xl animate-pulse border ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/5 border-white/8"}`} />
              ) : data?.vix ? (() => {
                const vs  = VIX_STYLE[data.vix.sentiment];
                const pos = data.vix.change >= 0;
                return (
                  <div className={`rounded-2xl border ${vs.wrap} p-10 flex flex-col items-center justify-center gap-3 shadow-sm`}>
                    <p className={`text-xs font-bold tracking-[0.18em] uppercase ${isLight ? "text-gray-400" : "text-slate-500"}`}>VIX Index</p>
                    <div className={`text-7xl font-black leading-none ${isLight ? "text-gray-900" : "text-slate-100"}`}>{data.vix.value.toFixed(2)}</div>
                    <p className={`font-bold text-sm ${isLight ? "text-gray-500" : "text-slate-400"}`}>
                      {pos ? "+" : ""}{data.vix.change.toFixed(2)} ({data.vix.changePercent.toFixed(2)}%)
                    </p>
                    <span className={`mt-1 px-5 py-1.5 rounded-full text-xs font-extrabold tracking-widest border ${vs.badge}`}>
                      {vs.label}
                    </span>
                  </div>
                );
              })() : (
                <div className={`h-64 rounded-2xl border flex items-center justify-center ${isLight ? "border-gray-100 bg-gray-50" : "border-white/8 bg-white/5"}`}>
                  <p className={`text-sm ${isLight ? "text-gray-300" : "text-slate-600"}`}>VIX data unavailable</p>
                </div>
              )}
            </div>
          </div>

          {/* REGIONAL PERFORMANCE */}
          <section id="section-regions" className="mb-12 scroll-mt-24">
            <SectionLabel icon={Globe} isLight={isLight}>Regional Performance</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={`h-56 rounded-2xl animate-pulse border ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/5 border-white/8"}`} />
                  ))
                : regionsData.map((r: RegionSummary) => {
                    const pos = r.avgChange >= 0;
                    return (
                      <div key={r.name} className={`rounded-2xl border hover:shadow-md transition-all duration-200 overflow-hidden ${isLight ? "bg-white border-gray-100 hover:border-gray-200" : "bg-[#0e2038] border-white/8 hover:border-white/15"}`}>
                        <div className="h-0.5" style={{ background: pos ? "linear-gradient(to right, #16a34a, transparent)" : "linear-gradient(to right, #dc2626, transparent)" }} />
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{r.flag}</span>
                              <div>
                                <p className={`font-extrabold text-base ${isLight ? "text-gray-900" : "text-slate-100"}`}>{r.name}</p>
                                <p className={`text-xs mt-0.5 ${isLight ? "text-gray-400" : "text-slate-500"}`}>{r.countries.join(", ")}</p>
                              </div>
                            </div>
                            <span className="text-xl font-black" style={{ color: pos ? "#16a34a" : "#dc2626" }}>
                              {pos ? "+" : ""}{r.avgChange.toFixed(2)}%
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                              <span className="text-gray-500 font-medium">Best</span>
                              <span className="text-emerald-700 font-bold text-xs">{r.best.name} ({r.best.change.toFixed(2)}%)</span>
                            </div>
                            <div className="flex justify-between items-center px-3 py-2.5 rounded-xl bg-red-50 border border-red-100">
                              <span className="text-gray-500 font-medium">Worst</span>
                              <span className="text-red-600 font-bold text-xs">{r.worst.name} ({r.worst.change.toFixed(2)}%)</span>
                            </div>
                          </div>
                          <div className={`flex justify-between text-xs mt-4 pt-4 border-t ${isLight ? "text-gray-300 border-gray-50" : "text-slate-600 border-white/5"}`}>
                            <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.countries.length} markets</div>
                            <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Live</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </section>

          {/* EVENTS CALENDAR */}
          <section className="mb-12">
            <SectionLabel isLight={isLight}>Global Events Calendar</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventsData.map((ev: any, i: number) => {
                const IC: Record<string, { bg: string; text: string; border: string }> = {
                  High:   { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200" },
                  Medium: { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
                  Low:    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
                };
                const s = IC[ev.impact] || IC.Low;
                const d = new Date(ev.date);
                const dateStr = isNaN(d.getTime()) ? ev.date : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
                return (
                  <div key={i} className={`rounded-xl border p-4 transition-all duration-150 ${isLight ? "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm" : "bg-[#0e2038] border-white/8 hover:border-white/15"}`}>
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span className={`px-2.5 py-0.5 text-[11px] font-extrabold rounded-full border ${s.bg} ${s.text} ${s.border}`}>{ev.impact}</span>
                      <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${isLight ? "bg-gray-50 text-gray-600 border-gray-100" : "bg-white/5 text-slate-400 border-white/8"}`}>{ev.region}</span>
                      <span className={`ml-auto text-xs font-medium ${isLight ? "text-gray-300" : "text-slate-600"}`}>{dateStr}</span>
                    </div>
                    <p className={`font-semibold text-sm leading-snug ${isLight ? "text-gray-800" : "text-slate-200"}`}>{ev.title}</p>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </div>

      <TradingViewModal
        isOpen={modalOpen} onClose={() => setModalOpen(false)}
        symbol={modalSymbol} name={modalName}
      />
    </Layout>
  );
}