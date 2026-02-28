import Layout from "@/components/Layout";
import CleanChart from "@/components/CleanChart";
import ForexCard from "@/components/Forexcard";
import CommodityCard from "@/components/Commoditycard";
import TradingViewModal from "@/components/Tradingviewmodal";
import { useGlobalMarkets } from "@/hooks/useGlobalMarkets";
import { IndexQuote, ForexPair, BondYield, Commodity, RegionSummary } from "@/services/globalMarkets/types";
import {
  TrendingUp, TrendingDown, Activity, Globe,
  Clock, MapPin, RefreshCw, AlertCircle, Wifi, WifiOff,
  Landmark, DollarSign, BarChart3, LineChart, Percent, Briefcase,
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/controllers/Themecontext";

const G = "#2D4A35";
const O = "#C07A3A";

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
          <Icon className="w-4.5 h-4.5" style={{ color: G }} />
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

// ── Market Selector ───────────────────────────────────────────
interface MarketSelectorProps {
  sectionId: string;
  title: string;
  markets: IndexQuote[];
  icon?: any;
  onChartClick: (symbol: string, name: string) => void;
  autoSelectSymbol?: string;
  isLight?: boolean;
}

function MarketSelector({ sectionId, title, markets, icon, onChartClick, autoSelectSymbol, isLight }: MarketSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!autoSelectSymbol) return;
    const idx = markets.findIndex(m => m.symbol === autoSelectSymbol);
    if (idx !== -1) setSelectedIndex(idx);
  }, [autoSelectSymbol, markets]);

  if (markets.length === 0) {
    return (
      <div className="text-center py-16 text-gray-300">
        <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className={`text-sm ${isLight ? "text-gray-400" : "text-slate-500"}`}>No market data available</p>
      </div>
    );
  }

  const sel = markets[selectedIndex];

  return (
    <section id={sectionId} className="mb-12 scroll-mt-32">
      <SectionLabel icon={icon} isLight={isLight}>{title}</SectionLabel>
      <div className="flex items-center gap-2.5 mb-5 flex-wrap">
        {markets.map((m, idx) => {
          const pos = m.changePercent >= 0;
          const active = selectedIndex === idx;
          return (
            <button
              key={m.symbol}
              onClick={() => setSelectedIndex(idx)}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 border"
              style={
                active
                  ? { background: G, color: "#fff", borderColor: G, boxShadow: `0 4px 12px ${G}30` }
                  : isLight
                    ? { background: "#fff", color: "#374151", borderColor: "#e5e7eb" }
                    : { background: "rgba(255,255,255,0.05)", color: "#94a3b8", borderColor: "rgba(255,255,255,0.1)" }
              }
            >
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
      <div
        onClick={() => onChartClick(sel.symbol, sel.name)}
        className={`cursor-pointer rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${isLight ? "border-gray-100" : "border-white/8"}`}
      >
        <CleanChart
          symbol={sel.symbol}
          name={sel.name}
          price={sel.price}
          change={sel.change}
          changePercent={sel.changePercent}
          high={sel.high}
          low={sel.low}
          isPositive={sel.changePercent >= 0}
          candles={sel.candles ?? []}
        />
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
export default function GlobalView() {
  const { data, loading, error, lastUpdated, refresh } = useGlobalMarkets();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSymbol, setModalSymbol] = useState("");
  const [modalName, setModalName] = useState("");
  const location = useLocation();

  // Ticker se aaya symbol
  const [tickerSymbol, setTickerSymbol] = useState<string | null>(null);
  const scrollDoneRef = useRef(false);

  const isLoading = loading === "idle" || loading === "loading";

  // Step 1: mount par location.state read karo — sirf symbol save karo, modal mat kholo
  useEffect(() => {
    const state = location.state as { symbol?: string; name?: string } | null;
    if (state?.symbol) {
      setTickerSymbol(state.symbol);
      window.history.replaceState({}, '');
    }
  }, []);

  const usMarkets       = useMemo(() => data?.indices?.us       || [], [data?.indices?.us]);
  const europeMarkets   = useMemo(() => data?.indices?.europe   || [], [data?.indices?.europe]);
  const asiaMarkets     = useMemo(() => data?.indices?.asia     || [], [data?.indices?.asia]);
  const forexData       = useMemo(() => data?.forex             || [], [data?.forex]);
  const commoditiesData = useMemo(() => data?.commodities       || [], [data?.commodities]);
  const bondsData       = useMemo(() => data?.bonds             || [], [data?.bonds]);
  const regionsData     = useMemo(() => data?.regions           || [], [data?.regions]);
  const eventsData      = useMemo(() => data?.events            || [], [data?.events]);

  // Step 2: data load hone ke baad — sahi section dhundho aur smooth scroll karo
  useEffect(() => {
    if (!tickerSymbol || isLoading || scrollDoneRef.current) return;
    if (!usMarkets.length && !europeMarkets.length && !asiaMarkets.length) return;

    let sectionId: string | null = null;
    if (usMarkets.some(m => m.symbol === tickerSymbol))          sectionId = "section-us";
    else if (europeMarkets.some(m => m.symbol === tickerSymbol)) sectionId = "section-europe";
    else if (asiaMarkets.some(m => m.symbol === tickerSymbol))   sectionId = "section-asia";

    if (sectionId) {
      scrollDoneRef.current = true;
      setTimeout(() => {
        document.getElementById(sectionId!)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [tickerSymbol, isLoading, usMarkets, europeMarkets, asiaMarkets]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try { await refresh(); } catch (e) { console.error(e); } finally { setRefreshing(false); }
  };

  // Chart par click → modal (ticker click se nahi, sirf manual click se)
  const handleChartClick = (symbol: string, name: string) => {
    setModalSymbol(symbol); setModalName(name); setModalOpen(true);
  };

  const SkeletonBlock = ({ h = "h-80" }: { h?: string }) => (
    <div className={`${h} rounded-2xl animate-pulse border mb-12 ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/5 border-white/8"}`} />
  );

  return (
    <Layout>
      <div className={`min-h-screen ${isLight ? "bg-[#F8F7F4]" : "bg-[#0c1a2e]"}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">

          {/* HERO */}
          <div className={`mb-12 rounded-2xl overflow-hidden border shadow-sm ${isLight ? "border-gray-200" : "border-white/8"}`}>
            <div className="h-1" style={{ background: `linear-gradient(to right, ${G}, ${O})` }} />
            <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-8 py-9 ${isLight ? "bg-white" : "bg-[#0e2038]"}`}>
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4"
                  style={{ background: `${G}12`, color: G, border: `1px solid ${G}25` }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G }} />
                  LIVE MARKETS
                </div>
                <h1 className={`text-4xl sm:text-5xl font-black tracking-tight leading-none mb-3 ${isLight ? "text-gray-900" : "text-slate-100"}`}>
                  Global Financial
                  <span className="block" style={{ color: G }}>Markets</span>
                </h1>
                <p className={`text-sm font-normal ${isLight ? "text-gray-400" : "text-slate-400"}`}>
                  Real-time data · Click any chart for detailed analysis
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing || isLoading}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 shadow-lg"
                style={{ background: G, boxShadow: `0 8px 24px ${G}35` }}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh Data
              </button>
            </div>
          </div>

          <ErrorBanner error={error} />

          {isLoading ? <SkeletonBlock /> : (
            <MarketSelector sectionId="section-us" title="United States Markets"
              markets={usMarkets} icon={BarChart3} onChartClick={handleChartClick}
              autoSelectSymbol={tickerSymbol ?? undefined} isLight={isLight} />
          )}

          {isLoading ? <SkeletonBlock /> : (
            <MarketSelector sectionId="section-europe" title="European Markets"
              markets={europeMarkets} icon={LineChart} onChartClick={handleChartClick}
              autoSelectSymbol={tickerSymbol ?? undefined} isLight={isLight} />
          )}

          {isLoading ? <SkeletonBlock /> : (
            <MarketSelector sectionId="section-asia" title="Asia Pacific Markets"
              markets={asiaMarkets} icon={Globe} onChartClick={handleChartClick}
              autoSelectSymbol={tickerSymbol ?? undefined} isLight={isLight} />
          )}

          {/* FOREX */}
          <section className="mb-12">
            <SectionLabel icon={DollarSign} isLight={isLight}>Foreign Exchange</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={`h-44 rounded-2xl animate-pulse border ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/5 border-white/8"}`} />
                  ))
                : forexData.map((fx: ForexPair) => (
                    <div key={fx.pair} onClick={() => handleChartClick(fx.pair, fx.pair)}
                      className="cursor-pointer rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                      <ForexCard pair={fx.pair} rate={fx.rate} change={fx.change}
                        changePercent={fx.changePercent} isPositive={fx.changePercent >= 0} />
                    </div>
                  ))}
            </div>
          </section>

          {/* COMMODITIES */}
          <section className="mb-12">
            <SectionLabel icon={Briefcase} isLight={isLight}>Key Commodities</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`h-44 rounded-2xl animate-pulse border ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/5 border-white/8"}`} />
                  ))
                : commoditiesData.map((c: Commodity) => (
                    <div key={c.symbol} onClick={() => handleChartClick(c.symbol, c.name)}
                      className="cursor-pointer rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                      <CommodityCard name={c.name} price={c.price} change={c.change}
                        changePercent={c.changePercent} unit={c.unit}
                        isPositive={c.changePercent >= 0} candles={c.candles} />
                    </div>
                  ))}
            </div>
          </section>

          {/* BONDS + VIX */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
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
                const vs = VIX_STYLE[data.vix.sentiment];
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
          <section className="mb-12">
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
              {eventsData.map((ev, i) => {
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

          {/* STATUS BAR */}
          <div className={`rounded-2xl border shadow-sm overflow-hidden ${isLight ? "bg-white border-gray-100" : "bg-[#0e2038] border-white/8"}`}>
            <div className="h-0.5" style={{ background: `linear-gradient(to right, ${G}, ${O}, transparent)` }} />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 text-sm">
              <div className={`flex items-center gap-2.5 ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                <Activity className="w-4 h-4" style={{ color: G }} />
                <span className="font-medium">
                  Last updated:{" "}
                  <span className={`font-semibold ${isLight ? "text-gray-600" : "text-slate-300"}`}>
                    {lastUpdated ? lastUpdated.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Fetching…"}
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-5">
                {data && (["us", "europe", "asia"] as const).map((region) => {
                  const open = data.marketStatus[region] === "open";
                  return (
                    <div key={region} className="flex items-center gap-1.5">
                      {open ? <Wifi className="w-3.5 h-3.5 text-emerald-500" /> : <WifiOff className={`w-3.5 h-3.5 ${isLight ? "text-gray-300" : "text-slate-600"}`} />}
                      <span className={`uppercase font-bold text-xs ${open ? "text-emerald-600" : (isLight ? "text-gray-300" : "text-slate-600")}`}>
                        {region} {data.marketStatus[region]}
                      </span>
                    </div>
                  );
                })}
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${loading === "loading" || refreshing ? "bg-amber-400 animate-pulse" : "bg-emerald-500"}`} />
                  <span className={`font-extrabold text-xs tracking-widest ${loading === "loading" || refreshing ? "text-amber-500" : "text-emerald-600"}`}>
                    {loading === "loading" || refreshing ? "UPDATING" : "LIVE"}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal — sirf chart par manual click se khulega */}
      <TradingViewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        symbol={modalSymbol}
        name={modalName}
      />
    </Layout>
  );
}