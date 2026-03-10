import Layout from "@/components/Layout";
import CleanChart from "@/components/CleanChart";
import TradingViewModal from "@/components/Tradingviewmodal";
import { useGlobalMarkets } from "@/hooks/useGlobalMarkets";
import { IndexQuote, BondYield, RegionSummary } from "@/services/globalMarkets/types";
import {
  TrendingUp, TrendingDown, Activity, Globe,
  Clock, MapPin, RefreshCw, AlertCircle,
  BarChart3, LineChart, Landmark, Percent, ChevronDown,
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/controllers/Themecontext";

const G = "#2D4A35";
const O = "#C07A3A";

// ── Market Hours ──────────────────────────────────────────────────
interface MktInfo { name: string; short: string; flag: string; tz: string; localTime: string; openUTC: number; closeUTC: number; color: string; }
const MARKETS: MktInfo[] = [
  { name: "Tokyo (TSE)",       short: "Tokyo",     flag: "🇯🇵", tz: "JST (UTC+9)",    localTime: "09:00–15:00", openUTC:   0, closeUTC:  360, color: "#e74c3c" },
  { name: "Shanghai (SSE)",    short: "Shanghai",  flag: "🇨🇳", tz: "CST (UTC+8)",    localTime: "09:30–15:00", openUTC:  90, closeUTC:  420, color: "#f39c12" },
  { name: "Hong Kong (HKEX)",  short: "HK",        flag: "🇭🇰", tz: "HKT (UTC+8)",    localTime: "09:30–16:00", openUTC:  90, closeUTC:  480, color: "#e67e22" },
  { name: "India (NSE/BSE)",   short: "India",     flag: "🇮🇳", tz: "IST (UTC+5:30)", localTime: "09:15–15:30", openUTC: 225, closeUTC:  570, color: "#27ae60" },
  { name: "Frankfurt (XETRA)", short: "Frankfurt", flag: "🇩🇪", tz: "CET (UTC+1)",    localTime: "09:00–17:30", openUTC: 480, closeUTC:  990, color: "#2980b9" },
  { name: "London (LSE)",      short: "London",    flag: "🇬🇧", tz: "GMT (UTC+0)",    localTime: "08:00–16:30", openUTC: 480, closeUTC:  990, color: "#8e44ad" },
  { name: "NYSE / NASDAQ",     short: "New York",  flag: "🇺🇸", tz: "EST (UTC-5)",    localTime: "09:30–16:00", openUTC: 870, closeUTC: 1260, color: "#2563eb" },
];
function mktSt(m: MktInfo): "open"|"pre"|"closed" {
  const n = new Date(), day = n.getUTCDay();
  if (day===0||day===6) return "closed";
  const mins = n.getUTCHours()*60+n.getUTCMinutes();
  if (mins>=m.openUTC&&mins<m.closeUTC) return "open";
  if (mins>=m.openUTC-30&&mins<m.openUTC) return "pre";
  return "closed";
}
function localNow(m: MktInfo): string {
  const off: Record<string,number> = {"JST (UTC+9)":9,"CST (UTC+8)":8,"HKT (UTC+8)":8,"IST (UTC+5:30)":5.5,"CET (UTC+1)":1,"GMT (UTC+0)":0,"EST (UTC-5)":-5};
  const d = new Date(Date.now()+(off[m.tz]??0)*3_600_000);
  return d.getUTCHours().toString().padStart(2,"0")+":"+d.getUTCMinutes().toString().padStart(2,"0");
}

const SECTIONS = [
  { label: "US Markets",   id: "section-us"     },
  { label: "Europe",       id: "section-europe" },
  { label: "Asia Pacific", id: "section-asia"   },
  { label: "Bonds & VIX", id: "section-bonds"  },
  { label: "Regional",     id: "section-regions"},
];
function jumpTo(id: string, c?: HTMLElement|null) {
  const el = document.getElementById(id);
  if (!el) return;
  c ? c.scrollTo({ top: el.offsetTop - 24, behavior: "smooth" }) : el.scrollIntoView({ behavior: "smooth" });
}

// ── Tiny UI helpers ────────────────────────────────────────────────
function ErrBanner({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <div className="flex items-start gap-3 p-4 mb-6 rounded-2xl bg-red-50 border border-red-200 text-sm">
      <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
      <div><strong className="block mb-0.5 font-bold text-red-800">Error loading data</strong>
        <span className="text-red-600">{error}</span></div>
    </div>
  );
}

function SecLabel({ icon: Icon, children, isLight }: { icon?: any; children: React.ReactNode; isLight?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      {Icon && (
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${G}15`, border: `1.5px solid ${G}30` }}>
          <Icon className="w-4 h-4" style={{ color: G }} />
        </div>
      )}
      <h2 className={`text-lg font-extrabold tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>{children}</h2>
      <div className={`flex-1 h-px ${isLight ? "bg-gray-200" : "bg-white/12"}`} />
    </div>
  );
}

const VIX_S: Record<string,{w:string;b:string;l:string}> = {
  low:      {w:"bg-emerald-50 border-emerald-200",b:"bg-emerald-100 text-emerald-800 border-emerald-200",l:"LOW VOLATILITY"},
  moderate: {w:"bg-amber-50 border-amber-200",   b:"bg-amber-100 text-amber-800 border-amber-200",      l:"MODERATE VOLATILITY"},
  high:     {w:"bg-orange-50 border-orange-200", b:"bg-orange-100 text-orange-800 border-orange-200",   l:"HIGH VOLATILITY"},
  extreme:  {w:"bg-red-50 border-red-200",       b:"bg-red-100 text-red-800 border-red-200",            l:"EXTREME VOLATILITY"},
};

// ══════════════════════════════════════════════════════════════════
// DESKTOP SIDEBAR — sections only, NO separate indices list
// ══════════════════════════════════════════════════════════════════
function DesktopSidebar({
  refreshing, onRefresh, lastUpdated, isLight, scrollRef,
  usMarkets, europeMarkets, asiaMarkets, isLoading,
}: {
  refreshing: boolean; onRefresh: () => void;
  lastUpdated: number | null; isLight: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
  usMarkets: IndexQuote[]; europeMarkets: IndexQuote[]; asiaMarkets: IndexQuote[];
  isLoading: boolean;
}) {
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick(n=>n+1), 30_000); return () => clearInterval(t); }, []);
  const ago = (ts: number) => { const s=Math.floor((Date.now()-ts)/1000); if(s<60) return `${s}s ago`; const m=Math.floor(s/60); return m<60?`${m}m ago`:`${Math.floor(m/60)}h ago`; };

  const bg     = isLight ? "bg-white"          : "bg-[#0b1825]";
  const bdr    = isLight ? "border-gray-200"   : "border-white/8";
  const div    = isLight ? "border-gray-100"   : "border-white/6";
  const tp     = isLight ? "text-gray-900"     : "text-slate-100";
  const tm     = isLight ? "text-gray-400"     : "text-slate-600";
  const ts     = isLight ? "text-gray-500"     : "text-slate-400";
  const secCls = isLight ? "text-gray-500 hover:text-gray-900 hover:bg-gray-50" : "text-slate-500 hover:text-slate-200 hover:bg-white/5";
  const selCls = isLight
    ? "bg-gray-50 border-gray-200 text-gray-800 focus:border-gray-400"
    : "bg-[#0c1e35] border-white/10 text-slate-300 focus:border-white/25";

  // Each group: label, section id to scroll to, markets list
  const groups = [
    { label: "🇺🇸 US",     id: "section-us",     markets: usMarkets      },
    { label: "🇪🇺 Europe", id: "section-europe", markets: europeMarkets  },
    { label: "🌏 Asia",    id: "section-asia",   markets: asiaMarkets    },
  ];

  return (
    <aside className={`hidden lg:flex flex-col w-44 shrink-0 border-r overflow-y-auto ${bg} ${bdr}`}>
      <div className="h-0.5 shrink-0" style={{ background: `linear-gradient(to right,${G},${O},#2563eb)` }} />

      {/* Brand */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: G }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G }} />Live
        </span>
        <p className={`text-sm font-black leading-tight mt-1 ${tp}`}>Global<br/>Markets</p>
      </div>

      {/* Sections */}
      <div className={`border-t px-2 pt-2 pb-1 shrink-0 ${div}`}>
        <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 px-1 ${tm}`}>Sections</p>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => jumpTo(s.id, scrollRef.current)}
            className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors mb-px ${secCls}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Markets dropdowns */}
      <div className={`border-t px-2 pt-2 pb-2 flex-1 ${div}`}>
        <p className={`text-[9px] font-bold uppercase tracking-widest mb-2 px-1 ${tm}`}>Markets</p>

        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`h-16 rounded-xl mb-2 animate-pulse ${isLight ? "bg-gray-100" : "bg-white/5"}`} />
          ))
        ) : (
          groups.map(g => {
            if (!g.markets.length) return null;
            return (
              <div key={g.id} className="mb-3">
                {/* Region label — clickable to scroll */}
                <button onClick={() => jumpTo(g.id, scrollRef.current)}
                  className={`text-[10px] font-bold mb-1 px-1 w-full text-left hover:opacity-80 transition-opacity ${ts}`}>
                  {g.label}
                </button>

                {/* Dropdown */}
                <div className="relative">
                  <select
                    defaultValue=""
                    onChange={e => {
                      // scroll to section when user picks a market
                      if (e.target.value) jumpTo(g.id, scrollRef.current);
                    }}
                    className={`w-full appearance-none pl-2.5 pr-7 py-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer outline-none transition-colors ${selCls}`}
                  >
                    <option value="" disabled>Pick index…</option>
                    {g.markets.map(m => {
                      const pos = m.changePercent >= 0;
                      return (
                        <option key={m.symbol} value={m.symbol}>
                          {m.name}  {pos ? "▲" : "▼"}{Math.abs(m.changePercent).toFixed(2)}%
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className={`pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 ${tm}`} />
                </div>


              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className={`shrink-0 border-t px-3 py-3 ${div}`}>
        {lastUpdated && <p className={`flex items-center gap-1 text-[10px] mb-2 ${tm}`}><Clock className="w-2.5 h-2.5"/>{ago(lastUpdated)}</p>}
        <button onClick={onRefresh} disabled={refreshing}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold text-white disabled:opacity-50"
          style={{ background: G }}>
          <RefreshCw className={`w-3 h-3 ${refreshing?"animate-spin":""}`}/>Refresh
        </button>
      </div>
    </aside>
  );
}

// ── Mobile section nav ────────────────────────────────────────────
function MobileNav({ isLight, scrollRef }: { isLight: boolean; scrollRef: React.RefObject<HTMLDivElement> }) {
  const bg  = isLight ? "bg-white/95 border-b border-gray-200" : "bg-[#0b1825]/95 border-b border-white/8";
  const btn = isLight ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100" : "text-slate-400 hover:text-slate-100 hover:bg-white/8";
  return (
    <div className={`lg:hidden ${bg}`}>
      <div className="flex items-center gap-0.5 px-3 py-2 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold shrink-0 mr-2"
          style={{ background: `${G}12`, color: G, border: `1px solid ${G}20` }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G }}/>Global
        </div>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => jumpTo(s.id, scrollRef.current)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors ${btn}`}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Market Hours Panel ─────────────────────────────────────────────
function MktHours({ isLight }: { isLight: boolean }) {
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick(n=>n+1), 60_000); return () => clearInterval(t); }, []);

  const card  = isLight ? "bg-white border-gray-200"                    : "bg-[#0e2038] border-white/8";
  const divR  = isLight ? "divide-gray-100"                              : "divide-white/5";
  const tp    = isLight ? "text-gray-800"                                : "text-slate-200";
  const ts    = isLight ? "text-gray-500"                                : "text-slate-400";
  const tm    = isLight ? "text-gray-400"                                : "text-slate-500";
  const foot  = isLight ? "bg-gray-50 border-gray-100 text-gray-400"    : "bg-white/2 border-white/5 text-slate-600";

  const Badge = ({ st }: { st: "open"|"pre"|"closed" }) => (
    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap ${
      st==="open"?"bg-emerald-100 text-emerald-700":st==="pre"?"bg-amber-100 text-amber-700":isLight?"bg-gray-100 text-gray-400":"bg-white/5 text-slate-500"
    }`}>{st==="open"?"● OPEN":st==="pre"?"◐ PRE":"CLOSED"}</span>
  );
  const Bar = ({ st, color }: { st: string; color: string }) => (
    <div className="h-0.5 rounded-full mt-auto" style={{ background: st==="open"?color:st==="pre"?"#f59e0b":isLight?"#e5e7eb":"rgba(255,255,255,0.08)", opacity: st==="open"?1:0.35 }}/>
  );
  const Footer = () => (
    <div className={`px-4 py-2.5 border-t text-[10px] flex items-center gap-3 flex-wrap ${foot}`}>
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"/>Open now</span>
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"/>Pre-market</span>
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-300"/>Closed</span>
      <span className="ml-auto hidden sm:block">Local times · updates every minute</span>
    </div>
  );

  return (
    <section id="section-hours" className="mb-10 scroll-mt-4">
      <SecLabel icon={Clock} isLight={isLight}>World Market Hours</SecLabel>

      {/* Mobile: compact 2-col */}
      <div className={`sm:hidden rounded-2xl border shadow-sm overflow-hidden ${card}`}>
        <div className={`grid grid-cols-2 divide-x divide-y ${divR}`}>
          {MARKETS.map(m => {
            const st = mktSt(m);
            return (
              <div key={m.name} className={`flex items-center gap-2 px-3 py-2.5 ${st==="open"?(isLight?"bg-emerald-50/40":"bg-emerald-900/10"):st==="pre"?(isLight?"bg-amber-50/30":"bg-amber-900/8"):""}`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${st==="open"?"bg-emerald-500 animate-pulse":st==="pre"?"bg-amber-400":"bg-gray-400"}`}/>
                <div className="flex-1 min-w-0">
                  <p className={`text-[11px] font-bold leading-tight truncate ${tp}`}>{m.flag} {m.short}</p>
                  <p className={`text-[10px] leading-tight ${tm}`}>{m.localTime}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-[10px] font-black ${st==="open"?"text-emerald-500":st==="pre"?"text-amber-500":tm}`}>{localNow(m)}</p>
                  <p className={`text-[9px] font-bold uppercase ${st==="open"?"text-emerald-500":st==="pre"?"text-amber-500":tm}`}>{st==="open"?"open":st==="pre"?"pre":"closed"}</p>
                </div>
              </div>
            );
          })}
        </div>
        <Footer/>
      </div>

      {/* Desktop: 7-col */}
      <div className={`hidden sm:block rounded-2xl border shadow-sm overflow-hidden ${card}`}>
        <div className={`grid grid-cols-4 lg:grid-cols-7 divide-x ${divR}`}>
          {MARKETS.map(m => {
            const st = mktSt(m);
            return (
              <div key={m.name} className={`p-3 flex flex-col gap-1.5 ${st==="open"?(isLight?"bg-emerald-50/40":"bg-emerald-900/10"):st==="pre"?(isLight?"bg-amber-50/30":"bg-amber-900/8"):""}`}>
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <span className="text-lg">{m.flag}</span>
                  <Badge st={st}/>
                </div>
                <p className={`text-[10px] font-bold leading-tight ${tp}`}>{m.name}</p>
                <p className={`text-[9px] ${tm}`}>{m.tz}</p>
                <p className={`text-[10px] ${ts}`}>{m.localTime}</p>
                <p className={`text-[11px] font-black mt-1 ${st==="open"?"text-emerald-600":st==="pre"?"text-amber-600":tm}`}>{localNow(m)}</p>
                <Bar st={st} color={m.color}/>
              </div>
            );
          })}
        </div>
        <Footer/>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
// MARKET SELECTOR — original pill buttons (no dropdown on right side)
// ══════════════════════════════════════════════════════════════════
function MktSelector({ sectionId, title, markets, icon, onChart, autoSym, isLight }: {
  sectionId: string; title: string; markets: IndexQuote[]; icon?: any;
  onChart: (sym: string, name: string) => void;
  autoSym?: string; isLight?: boolean;
}) {
  const [sel, setSel] = useState(0);
  useEffect(() => {
    if (!autoSym) return;
    const i = markets.findIndex(m => m.symbol === autoSym);
    if (i !== -1) setSel(i);
  }, [autoSym, markets]);

  if (!markets.length) return (
    <div className="py-10 text-center">
      <Activity className={`w-8 h-8 mx-auto mb-2 ${isLight?"text-gray-300":"text-slate-600"}`}/>
      <p className={`text-sm ${isLight?"text-gray-400":"text-slate-500"}`}>No data</p>
    </div>
  );

  const s = markets[sel];

  return (
    <section id={sectionId} className="mb-10 scroll-mt-4">
      <SecLabel icon={icon} isLight={isLight}>{title}</SecLabel>

      {/* ── Pill buttons — original style ─────────────────────── */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {markets.map((m, i) => {
          const pos = m.changePercent >= 0, active = sel === i;
          return (
            <button key={m.symbol}
              onClick={e => { e.stopPropagation(); setSel(i); }}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all border"
              style={active
                ? { background: G, color: "#fff", borderColor: G, boxShadow: `0 4px 12px ${G}30` }
                : isLight
                  ? { background: "#fff", color: "#374151", borderColor: "#e5e7eb" }
                  : { background: "rgba(255,255,255,0.05)", color: "#94a3b8", borderColor: "rgba(255,255,255,0.1)" }
              }>
              <span className="flex items-center gap-1.5">
                {m.name}
                <span className="text-xs font-bold" style={{ color: active ? "rgba(255,255,255,0.85)" : pos ? "#16a34a" : "#dc2626" }}>
                  {pos ? "+" : ""}{m.changePercent.toFixed(2)}%
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Chart — click opens modal ──────────────────────────── */}
      <div
        onClick={() => onChart(s.symbol, s.name)}
        className="cursor-pointer"
        title="Tap to open full TradingView chart"
      >
        <CleanChart
          symbol={s.symbol} name={s.name} price={s.price}
          change={s.change} changePercent={s.changePercent}
          high={s.high} low={s.low}
          isPositive={s.changePercent >= 0}
          candles={s.candles ?? []}
        />
      </div>
      <p className={`text-[10px] mt-1.5 ml-1 ${isLight?"text-gray-400":"text-slate-600"}`}>
        Tap chart to open full view · Period buttons only change timeframe
      </p>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
export default function GlobalView() {
  const { data, loading, error, lastUpdated, refresh } = useGlobalMarkets();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [refreshing,  setRefreshing]  = useState(false);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [modalSymbol, setModalSymbol] = useState("");
  const [modalName,   setModalName]   = useState("");
  const location  = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("scrollTo");
    if (!id) return;
    const t = setTimeout(() => jumpTo(id, scrollRef.current), 400);
    return () => clearTimeout(t);
  }, [location.search]);

  const [tickerSym, setTickerSym] = useState<string|null>(null);
  const scrollDone = useRef(false);
  const isLoading  = loading === "idle" || loading === "loading";

  useEffect(() => {
    const st = location.state as {symbol?:string}|null;
    if (st?.symbol) { setTickerSym(st.symbol); window.history.replaceState({},""); }
  }, []);

  const usM  = useMemo(() => data?.indices?.us     || [], [data?.indices?.us]);
  const euM  = useMemo(() => data?.indices?.europe || [], [data?.indices?.europe]);
  const asM  = useMemo(() => data?.indices?.asia   || [], [data?.indices?.asia]);
  const bnds = useMemo(() => data?.bonds           || [], [data?.bonds]);
  const regs = useMemo(() => data?.regions         || [], [data?.regions]);
  const evts = useMemo(() => data?.events          || [], [data?.events]);

  useEffect(() => {
    if (!tickerSym || isLoading || scrollDone.current) return;
    const all = [...usM,...euM,...asM];
    if (!all.length) return;
    const id = usM.some(m=>m.symbol===tickerSym)?"section-us":euM.some(m=>m.symbol===tickerSym)?"section-europe":asM.some(m=>m.symbol===tickerSym)?"section-asia":null;
    if (id) { scrollDone.current=true; setTimeout(()=>jumpTo(id,scrollRef.current),200); }
  }, [tickerSym,isLoading,usM,euM,asM]);

  const doRefresh = async () => { setRefreshing(true); try { await refresh(); } catch(e){console.error(e);} finally { setRefreshing(false); } };
  const openChart = (sym: string, name: string) => { setModalSymbol(sym); setModalName(name); setModalOpen(true); };

  const pageBg = isLight ? "bg-[#F8F7F4]" : "bg-[#0c1a2e]";
  const Sk = ({ h="h-96" }: {h?:string}) => (
    <div className={`${h} rounded-2xl animate-pulse border mb-10 ${isLight?"bg-gray-50 border-gray-100":"bg-white/5 border-white/8"}`}/>
  );

  return (
    <Layout>
      <div className={`flex overflow-hidden ${pageBg}`} style={{ height: "calc(100vh - var(--header-height, 108px))" }}>

        {/* ── Sidebar with grouped market dropdowns ─────────────── */}
        <DesktopSidebar
          refreshing={refreshing} onRefresh={doRefresh}
          lastUpdated={lastUpdated??null} isLight={isLight}
          scrollRef={scrollRef}
          usMarkets={usM} europeMarkets={euM} asiaMarkets={asM}
          isLoading={isLoading}
        />

        {/* ── Main content ──────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <MobileNav isLight={isLight} scrollRef={scrollRef}/>

          <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8 max-w-5xl w-full mx-auto">

              <ErrBanner error={error}/>
              <MktHours isLight={isLight}/>

              {isLoading ? <Sk h="h-96"/> : <MktSelector sectionId="section-us" title="United States Markets" markets={usM} icon={BarChart3} onChart={openChart} autoSym={tickerSym??undefined} isLight={isLight}/>}
              {isLoading ? <Sk h="h-96"/> : <MktSelector sectionId="section-europe" title="European Markets" markets={euM} icon={LineChart} onChart={openChart} autoSym={tickerSym??undefined} isLight={isLight}/>}
              {isLoading ? <Sk h="h-96"/> : <MktSelector sectionId="section-asia" title="Asia Pacific Markets" markets={asM} icon={Globe} onChart={openChart} autoSym={tickerSym??undefined} isLight={isLight}/>}

              {/* Bonds + VIX */}
              <div id="section-bonds" className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10 scroll-mt-4">
                <div>
                  <SecLabel icon={Landmark} isLight={isLight}>Treasury Yields</SecLabel>
                  <div className={`rounded-2xl border shadow-sm overflow-hidden ${isLight?"bg-white border-gray-200":"bg-[#0e2038] border-white/8"}`}>
                    {isLoading ? <div className={`h-52 animate-pulse ${isLight?"bg-gray-50":"bg-white/5"}`}/> :
                     bnds.length > 0 ? (
                      <div className={`divide-y ${isLight?"divide-gray-50":"divide-white/5"}`}>
                        {bnds.map((b:BondYield,i:number) => {
                          const p = b.change>=0;
                          return (
                            <div key={i} className={`flex items-center justify-between px-5 py-3.5 ${isLight?"hover:bg-gray-50/60":"hover:bg-white/4"}`}>
                              <div>
                                <p className={`font-bold text-sm ${isLight?"text-gray-900":"text-slate-100"}`}>{b.name}</p>
                                <p className="text-xs font-semibold mt-0.5" style={{color:p?"#16a34a":"#dc2626"}}>{p?"+":""}{b.change.toFixed(3)}%</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xl font-black ${isLight?"text-gray-900":"text-slate-100"}`}>{b.yield.toFixed(3)}%</span>
                                {p?<TrendingUp className="w-4 h-4 text-emerald-500"/>:<TrendingDown className="w-4 h-4 text-red-500"/>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : <p className={`p-8 text-center text-sm ${isLight?"text-gray-400":"text-slate-600"}`}>Unavailable</p>}
                  </div>
                </div>
                <div>
                  <SecLabel icon={Percent} isLight={isLight}>Volatility Index (VIX)</SecLabel>
                  {isLoading ? <div className={`h-52 rounded-2xl animate-pulse border ${isLight?"bg-gray-50 border-gray-100":"bg-white/5 border-white/8"}`}/> :
                   data?.vix ? (() => { const vs=VIX_S[data.vix.sentiment]; const p=data.vix.change>=0; return (
                    <div className={`rounded-2xl border ${vs.w} p-8 flex flex-col items-center justify-center gap-2 shadow-sm`}>
                      <p className="text-xs font-bold tracking-widest uppercase text-gray-400">VIX Index</p>
                      <div className="text-6xl font-black text-gray-900">{data.vix.value.toFixed(2)}</div>
                      <p className="font-bold text-sm text-gray-500">{p?"+":""}{data.vix.change.toFixed(2)} ({data.vix.changePercent.toFixed(2)}%)</p>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-widest border ${vs.b}`}>{vs.l}</span>
                    </div>
                  );})() : <div className={`h-52 rounded-2xl border flex items-center justify-center ${isLight?"border-gray-100 bg-gray-50":"border-white/8 bg-white/5"}`}><p className={`text-sm ${isLight?"text-gray-300":"text-slate-600"}`}>VIX unavailable</p></div>}
                </div>
              </div>

              {/* Regional */}
              <section id="section-regions" className="mb-10 scroll-mt-4">
                <SecLabel icon={Globe} isLight={isLight}>Regional Performance</SecLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {isLoading ? Array.from({length:3}).map((_,i)=><div key={i} className={`h-44 rounded-2xl animate-pulse border ${isLight?"bg-gray-50 border-gray-100":"bg-white/5 border-white/8"}`}/>) :
                   regs.map((r:RegionSummary) => {
                    const p = r.avgChange>=0;
                    return (
                      <div key={r.name} className={`rounded-2xl border hover:shadow-md transition-all overflow-hidden ${isLight?"bg-white border-gray-200":"bg-[#0e2038] border-white/8"}`}>
                        <div className="h-0.5" style={{background:p?"linear-gradient(to right,#16a34a,transparent)":"linear-gradient(to right,#dc2626,transparent)"}}/>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{r.flag}</span>
                              <div>
                                <p className={`font-extrabold text-sm ${isLight?"text-gray-900":"text-slate-100"}`}>{r.name}</p>
                                <p className={`text-[11px] mt-0.5 ${isLight?"text-gray-400":"text-slate-500"}`}>{r.countries.join(", ")}</p>
                              </div>
                            </div>
                            <span className="text-base font-black" style={{color:p?"#16a34a":"#dc2626"}}>{p?"+":""}{r.avgChange.toFixed(2)}%</span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-2.5 py-2 rounded-lg bg-emerald-50 border border-emerald-100">
                              <span className="text-gray-500 text-xs">Best</span>
                              <span className="text-emerald-700 font-bold text-xs">{r.best.name} ({r.best.change.toFixed(2)}%)</span>
                            </div>
                            <div className="flex justify-between items-center px-2.5 py-2 rounded-lg bg-red-50 border border-red-100">
                              <span className="text-gray-500 text-xs">Worst</span>
                              <span className="text-red-600 font-bold text-xs">{r.worst.name} ({r.worst.change.toFixed(2)}%)</span>
                            </div>
                          </div>
                          <div className={`flex justify-between text-[11px] mt-3 pt-3 border-t ${isLight?"text-gray-300 border-gray-100":"text-slate-600 border-white/5"}`}>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{r.countries.length} markets</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>Live</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Events */}
              <section className="mb-10">
                <SecLabel isLight={isLight}>Global Events Calendar</SecLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {evts.map((ev:any,i:number) => {
                    const IC:Record<string,{bg:string;tc:string;bc:string}> = {High:{bg:"bg-red-50",tc:"text-red-700",bc:"border-red-200"},Medium:{bg:"bg-amber-50",tc:"text-amber-700",bc:"border-amber-200"},Low:{bg:"bg-emerald-50",tc:"text-emerald-700",bc:"border-emerald-200"}};
                    const s = IC[ev.impact]||IC.Low;
                    const d = new Date(ev.date);
                    const ds = isNaN(d.getTime())?ev.date:d.toLocaleDateString("en-IN",{day:"2-digit",month:"short"});
                    return (
                      <div key={i} className={`rounded-xl border p-3.5 ${isLight?"bg-white border-gray-200 hover:shadow-sm":"bg-[#0e2038] border-white/8 hover:border-white/15"}`}>
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${s.bg} ${s.tc} ${s.bc}`}>{ev.impact}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${isLight?"bg-gray-50 text-gray-600 border-gray-100":"bg-white/5 text-slate-400 border-white/8"}`}>{ev.region}</span>
                          <span className={`ml-auto text-xs ${isLight?"text-gray-400":"text-slate-500"}`}>{ds}</span>
                        </div>
                        <p className={`font-semibold text-sm leading-snug ${isLight?"text-gray-800":"text-slate-200"}`}>{ev.title}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      <TradingViewModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} symbol={modalSymbol} name={modalName}/>
    </Layout>
  );
}