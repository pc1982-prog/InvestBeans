import Layout from '@/components/Layout';
import ForexCard from '@/components/Forexcard';
import { useGlobalMarkets } from '@/hooks/useGlobalMarkets';
import { ForexPair } from '@/services/globalMarkets/types';
import { useTheme } from '@/controllers/Themecontext';
import { useState, useMemo, useEffect } from 'react';
import {
  DollarSign, RefreshCw, Clock, TrendingUp, TrendingDown,
  Globe, Activity, Info,
} from 'lucide-react';

const G = "#2D4A35";
const O = "#C07A3A";

// ── Extended static pairs (supplement API data) ───────────────────
const STATIC_PAIRS: { pair: string; base: string; quote: string; region: string; flag: string }[] = [
  { pair: "EUR/USD", base: "EUR", quote: "USD", region: "Majors", flag: "🇪🇺" },
  { pair: "USD/JPY", base: "USD", quote: "JPY", region: "Majors", flag: "🇯🇵" },
  { pair: "GBP/USD", base: "GBP", quote: "USD", region: "Majors", flag: "🇬🇧" },
  { pair: "USD/INR", base: "USD", quote: "INR", region: "Asia",   flag: "🇮🇳" },
  { pair: "USD/CHF", base: "USD", quote: "CHF", region: "Majors", flag: "🇨🇭" },
  { pair: "AUD/USD", base: "AUD", quote: "USD", region: "Majors", flag: "🇦🇺" },
  { pair: "USD/CAD", base: "USD", quote: "CAD", region: "Majors", flag: "🇨🇦" },
  { pair: "EUR/INR", base: "EUR", quote: "INR", region: "Asia",   flag: "🇪🇺" },
  { pair: "GBP/INR", base: "GBP", quote: "INR", region: "Asia",   flag: "🇬🇧" },
  { pair: "USD/CNY", base: "USD", quote: "CNY", region: "Asia",   flag: "🇨🇳" },
];

const REGIONS = ["All", "Majors", "Asia"];

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

// Forex session hours (UTC minutes)
const SESSIONS = [
  { name: "Sydney",    openUTC:  540, closeUTC: 1200, flag: "🇦🇺", color: "#10b981" },
  { name: "Tokyo",     openUTC:    0, closeUTC:  360, flag: "🇯🇵", color: "#e74c3c" },
  { name: "London",    openUTC:  480, closeUTC:  990, flag: "🇬🇧", color: "#8e44ad" },
  { name: "New York",  openUTC:  870, closeUTC: 1260, flag: "🇺🇸", color: "#2563eb" },
];

function getSessionStatus(s: typeof SESSIONS[0]): "open"|"closed" {
  const now = new Date();
  const day = now.getUTCDay();
  if (day === 0) return "closed";
  if (day === 6 && now.getUTCHours() * 60 + now.getUTCMinutes() >= s.closeUTC) return "closed";
  const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
  return (mins >= s.openUTC && mins < s.closeUTC) ? "open" : "closed";
}

export default function CurrencyView() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { data, loading, lastUpdated, refresh } = useGlobalMarkets();
  const [refreshing,  setRefreshing]  = useState(false);
  const [activeRegion, setRegion]     = useState("All");
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const isLoading = loading === 'idle' || loading === 'loading';
  const apiForex: ForexPair[] = useMemo(() => data?.forex || [], [data?.forex]);

  // Merge API data into static pairs list (API takes priority for rates)
  const enrichedPairs = useMemo(() => {
    return STATIC_PAIRS
      .filter(sp => activeRegion === "All" || sp.region === activeRegion)
      .map(sp => {
        const live = apiForex.find(f => f.pair === sp.pair);
        return live
          ? { ...sp, rate: live.rate, change: live.change, changePercent: live.changePercent }
          : null;
      })
      .filter(Boolean) as (typeof STATIC_PAIRS[0] & { rate: number; change: number; changePercent: number })[];
  }, [apiForex, activeRegion]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try { await refresh(); } catch {} finally { setRefreshing(false); }
  };

  const pageBg   = isLight ? "bg-[#F8F7F4]" : "bg-[#0c1a2e]";
  const cardBg   = isLight ? "bg-white border-gray-100" : "bg-[#0e2038] border-white/8";
  const textPrim = isLight ? "text-gray-900" : "text-slate-100";
  const textSec  = isLight ? "text-gray-500" : "text-slate-400";
  const textMute = isLight ? "text-gray-400" : "text-slate-500";

  // Top movers from API data
  const topGainer = apiForex.length > 0
    ? apiForex.reduce((p, c) => c.changePercent > p.changePercent ? c : p)
    : null;
  const topLoser = apiForex.length > 0
    ? apiForex.reduce((p, c) => c.changePercent < p.changePercent ? c : p)
    : null;

  return (
    <Layout>
      <div className={`min-h-screen ${pageBg}`}>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <div className={`border-b ${isLight ? "bg-white border-gray-200" : "bg-[#0e2038] border-white/8"}`}>
          <div className="h-0.5" style={{ background: `linear-gradient(to right, ${G}, #2563eb, ${O})` }} />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3"
                  style={{ background: `${G}12`, color: G, border: `1px solid ${G}25` }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G }} />
                  LIVE RATES
                </div>
                <h1 className={`text-4xl sm:text-5xl font-black tracking-tight leading-none mb-2 ${textPrim}`}>
                  Currency &
                  <span className="block" style={{ color: "#2563eb" }}>Forex</span>
                </h1>
                <p className={`text-sm ${textSec}`}>
                  Live exchange rates · Major & exotic pairs · 24-hour candles
                </p>
              </div>
              <div className="flex items-center gap-3">
                {lastUpdated && (
                  <div className={`flex items-center gap-1.5 text-xs ${textMute}`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{Math.floor((Date.now() - lastUpdated) / 60000)}m ago</span>
                  </div>
                )}
                <button onClick={handleRefresh} disabled={refreshing || isLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 shadow-md"
                  style={{ background: "#2563eb" }}>
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* ── Forex Session Status ── */}
            <div className="flex items-center gap-3 mt-6 flex-wrap">
              {SESSIONS.map(s => {
                const open = getSessionStatus(s) === "open";
                return (
                  <div key={s.name} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                    open
                      ? (isLight ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-emerald-900/20 border-emerald-700/30 text-emerald-400")
                      : (isLight ? "bg-gray-50 border-gray-200 text-gray-400"          : "bg-white/5 border-white/8 text-slate-500")
                  }`}>
                    <span>{s.flag}</span>
                    <span>{s.name}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`} />
                  </div>
                );
              })}
              <span className={`text-[10px] ml-2 ${textMute}`}>Forex session hours (UTC)</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 max-w-7xl">

          {/* ── Top Movers ───────────────────────────────────────── */}
          {(topGainer || topLoser) && !isLoading && (
            <section className="mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topGainer && (
                  <div className={`rounded-2xl border p-5 flex items-center gap-4 ${isLight ? "bg-emerald-50 border-emerald-100" : "bg-emerald-900/10 border-emerald-700/20"}`}>
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-0.5">Top Gainer</p>
                      <p className={`text-lg font-black ${textPrim}`}>{topGainer.pair}</p>
                      <p className="text-emerald-600 text-sm font-bold">
                        +{topGainer.changePercent.toFixed(2)}% · {topGainer.rate.toFixed(4)}
                      </p>
                    </div>
                  </div>
                )}
                {topLoser && (
                  <div className={`rounded-2xl border p-5 flex items-center gap-4 ${isLight ? "bg-red-50 border-red-100" : "bg-red-900/10 border-red-700/20"}`}>
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-0.5">Top Loser</p>
                      <p className={`text-lg font-black ${textPrim}`}>{topLoser.pair}</p>
                      <p className="text-red-600 text-sm font-bold">
                        {topLoser.changePercent.toFixed(2)}% · {topLoser.rate.toFixed(4)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Currency Pairs ───────────────────────────────────── */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <SectionLabel icon={DollarSign} isLight={isLight}>Currency Pairs</SectionLabel>
              {/* Region filter */}
              <div className="flex items-center gap-1.5">
                {REGIONS.map(r => (
                  <button key={r} onClick={() => setRegion(r)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border"
                    style={activeRegion === r
                      ? { background: G, color: "#fff", borderColor: G }
                      : isLight
                        ? { background: "#fff", color: "#374151", borderColor: "#e5e7eb" }
                        : { background: "rgba(255,255,255,0.05)", color: "#94a3b8", borderColor: "rgba(255,255,255,0.1)" }
                    }>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={`h-44 rounded-2xl animate-pulse border ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/5 border-white/8"}`} />
                ))}
              </div>
            ) : enrichedPairs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {enrichedPairs.map(fx => (
                  <ForexCard
                    key={fx.pair}
                    pair={fx.pair} rate={fx.rate} change={fx.change}
                    changePercent={fx.changePercent} isPositive={fx.changePercent >= 0}
                    lastUpdated={lastUpdated ?? undefined}
                    isLight={isLight}
                  />
                ))}
              </div>
            ) : (
              <div className={`rounded-2xl border py-16 flex flex-col items-center gap-3 ${cardBg}`}>
                <Activity className={`w-10 h-10 ${textMute}`} />
                <p className={`text-sm font-semibold ${textSec}`}>
                  {apiForex.length === 0
                    ? "Set EXCHANGERATE_KEY in backend .env for live forex rates"
                    : "No pairs match the selected filter"
                  }
                </p>
                {apiForex.length === 0 && (
                  <div className={`flex items-start gap-2 px-4 py-3 rounded-xl border text-xs max-w-sm text-center ${
                    isLight ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-amber-900/10 border-amber-700/30 text-amber-400"
                  }`}>
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Get a free key at exchangerate-api.com and add it to your backend <code>.env</code> as EXCHANGERATE_KEY</span>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ── Cross-Rate Table ─────────────────────────────────── */}
          {apiForex.length > 0 && !isLoading && (
            <section className="mb-10">
              <SectionLabel icon={Globe} isLight={isLight}>Live Rate Table</SectionLabel>
              <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
                <div className={`grid grid-cols-5 gap-0 px-5 py-3 border-b text-xs font-bold uppercase tracking-widest ${
                  isLight ? "bg-gray-50 border-gray-100 text-gray-400" : "bg-white/5 border-white/8 text-slate-500"
                }`}>
                  <div className="col-span-2">Pair</div>
                  <div className="text-right">Rate</div>
                  <div className="text-right">Change</div>
                  <div className="text-right">% Change</div>
                </div>
                {apiForex.map((fx, i) => {
                  const pos = fx.changePercent >= 0;
                  return (
                    <div key={fx.pair}
                      className={`grid grid-cols-5 gap-0 px-5 py-3.5 items-center text-sm transition-colors ${
                        i < apiForex.length - 1 ? (isLight ? "border-b border-gray-50" : "border-b border-white/5") : ""
                      } ${isLight ? "hover:bg-gray-50/60" : "hover:bg-white/5"}`}>
                      <div className="col-span-2">
                        <p className={`font-black ${textPrim}`}>{fx.pair}</p>
                        <p className={`text-xs ${textMute}`}>{fx.base} → {fx.quote}</p>
                      </div>
                      <div className={`text-right font-black font-mono ${textPrim}`}>{fx.rate.toFixed(4)}</div>
                      <div className={`text-right font-bold text-sm ${pos ? "text-emerald-600" : "text-red-500"}`}>
                        {fx.change > 0 ? "+" : ""}{fx.change.toFixed(4)}
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 text-xs font-extrabold px-2 py-1 rounded-lg ${
                          pos ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                        }`}>
                          {pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {pos ? "+" : ""}{fx.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {lastUpdated && (
                <p className={`text-[10px] mt-2 flex items-center gap-1 ${textMute}`}>
                  <Clock className="w-3 h-3" />
                  Rates from ExchangeRate-API · Updated {Math.floor((Date.now() - lastUpdated) / 60000)}m ago · Daily change from Yahoo Finance
                </p>
              )}
            </section>
          )}

          {/* ── Disclaimer ───────────────────────────────────────── */}
          <div className={`rounded-xl border p-4 text-xs flex items-start gap-2 ${
            isLight ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-amber-900/10 border-amber-700/30 text-amber-400"
          }`}>
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Forex rates are indicative and may differ from actual traded rates. Candle charts are estimated from daily change data.
              Not financial advice.
            </span>
          </div>

        </div>
      </div>
    </Layout>
  );
}