// CurrencyView.tsx — Redesigned in DomesticView style
// Data: same useGlobalMarkets hook — only design changed

import Layout from "@/components/Layout";
import ForexCard from "@/components/Forexcard";
import { useGlobalMarkets } from "@/hooks/useGlobalMarkets";
import { ForexPair } from "@/services/globalMarkets/types";
import { useTheme } from "@/controllers/Themecontext";
import { useState, useMemo, useEffect } from "react";
import {
  DollarSign, RefreshCw, Clock, TrendingUp, TrendingDown,
  Globe, Activity, Info, Menu, X, ChevronRight,
} from "lucide-react";

// ── Static pairs (same data as original) ─────────────────────────
const STATIC_PAIRS: { pair: string; base: string; quote: string; region: string; flag: string }[] = [
  { pair:"EUR/USD", base:"EUR", quote:"USD", region:"Majors", flag:"🇪🇺" },
  { pair:"USD/JPY", base:"USD", quote:"JPY", region:"Majors", flag:"🇯🇵" },
  { pair:"GBP/USD", base:"GBP", quote:"USD", region:"Majors", flag:"🇬🇧" },
  { pair:"USD/INR", base:"USD", quote:"INR", region:"Asia",   flag:"🇮🇳" },
  { pair:"USD/CHF", base:"USD", quote:"CHF", region:"Majors", flag:"🇨🇭" },
  { pair:"AUD/USD", base:"AUD", quote:"USD", region:"Majors", flag:"🇦🇺" },
  { pair:"USD/CAD", base:"USD", quote:"CAD", region:"Majors", flag:"🇨🇦" },
  { pair:"EUR/INR", base:"EUR", quote:"INR", region:"Asia",   flag:"🇪🇺" },
  { pair:"GBP/INR", base:"GBP", quote:"INR", region:"Asia",   flag:"🇬🇧" },
  { pair:"USD/CNY", base:"USD", quote:"CNY", region:"Asia",   flag:"🇨🇳" },
];
const REGIONS = ["All", "Majors", "Asia"];

// Forex sessions
const SESSIONS = [
  { name:"Sydney",   openUTC:540,  closeUTC:1200, flag:"🇦🇺", color:"#10b981" },
  { name:"Tokyo",    openUTC:0,    closeUTC:360,  flag:"🇯🇵", color:"#e74c3c" },
  { name:"London",   openUTC:480,  closeUTC:990,  flag:"🇬🇧", color:"#8e44ad" },
  { name:"New York", openUTC:870,  closeUTC:1260, flag:"🇺🇸", color:"#2563eb" },
];
function getSessionStatus(s: typeof SESSIONS[0]): "open"|"closed" {
  const now = new Date(), day = now.getUTCDay();
  if (day===0) return "closed";
  if (day===6 && now.getUTCHours()*60+now.getUTCMinutes()>=s.closeUTC) return "closed";
  const mins = now.getUTCHours()*60+now.getUTCMinutes();
  return (mins>=s.openUTC&&mins<s.closeUTC)?"open":"closed";
}

const NAV_SECTIONS = [
  { id:"section-sessions", label:"Forex Sessions", icon: Globe      },
  { id:"section-pairs",    label:"Currency Pairs",  icon: DollarSign },
  { id:"section-table",    label:"Rate Table",      icon: Activity   },
];

function jumpTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
}

// ── Theme tokens — identical to DomesticView ──────────────────────
const useIL = () => { const { theme } = useTheme(); return theme === "light"; };
const tx = {
  bg:      (l:boolean) => l ? "bg-[#f5f4f0]"   : "bg-[#07111b]",
  card:    (l:boolean) => l ? "bg-white border border-gray-100 shadow-sm" : "bg-[#0c1821] border border-[#1a2d3f]",
  header:  (l:boolean) => l ? "bg-gray-50 border-b border-gray-100"       : "bg-[#081017] border-b border-[#1a2d3f]",
  row:     (l:boolean) => l ? "hover:bg-gray-50/60 border-b border-gray-50" : "hover:bg-white/[0.02] border-b border-[#111e28]",
  sidebar: (l:boolean) => l ? "bg-white border-r border-gray-100" : "bg-[#07111b] border-r border-[#1a2d3f]",
  topbar:  (l:boolean) => l ? "bg-white/95 border-b border-gray-100 backdrop-blur-sm" : "bg-[#07111b]/95 border-b border-[#1a2d3f] backdrop-blur-sm",
  t1:      (l:boolean) => l ? "text-gray-900"   : "text-[#e2ecf4]",
  t2:      (l:boolean) => l ? "text-gray-500"   : "text-[#5a7a92]",
  t3:      (l:boolean) => l ? "text-gray-400"   : "text-[#3d5f78]",
  pill:    (l:boolean, g:boolean) => g
    ? l ? "bg-emerald-50 text-emerald-700" : "bg-emerald-900/20 text-emerald-400"
    :     l ? "bg-red-50 text-red-600"     : "bg-red-900/20 text-red-400",
};

function Card({ children, className="" }: { children:React.ReactNode; className?:string }) {
  const l = useIL();
  return <div className={`rounded-xl ${tx.card(l)} ${className}`}>{children}</div>;
}
function Skel({ h="h-8" }: { h?:string }) {
  const l = useIL();
  return <div className={`${h} w-full rounded-lg animate-pulse ${l?"bg-gray-100":"bg-[#1a2d3f]/60"}`}/>;
}
function PctTag({ v }: { v: number }) {
  const l = useIL();
  const g = v>=0;
  return (
    <span className={`inline-flex items-center gap-0.5 font-bold rounded-md text-xs px-1.5 py-1 ${tx.pill(l,g)}`}>
      {g?<TrendingUp className="w-2.5 h-2.5"/>:<TrendingDown className="w-2.5 h-2.5"/>}
      {g?"+":""}{v.toFixed(2)}%
    </span>
  );
}
function SecHead({ id, icon:Icon, title, sub }: { id:string; icon:any; title:string; sub?:string }) {
  const l = useIL();
  return (
    <div id={id} className="flex items-center gap-3 mb-5 scroll-mt-24">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#16a34a]/20 border border-[#16a34a]/30">
        <Icon className="w-4 h-4 text-[#16a34a]"/>
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <h2 className={`font-extrabold text-base tracking-tight ${l?"text-gray-900":"text-white"}`}>{title}</h2>
        {sub && <span className={`text-[11px] truncate hidden sm:block ${tx.t3(l)}`}>{sub}</span>}
      </div>
      <div className={`h-px flex-1 max-w-24 ${l?"bg-gray-100":"bg-[#1a2d3f]"}`}/>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════════════════════════
function SideNav({ active, onSelect, pairs, refreshing, onRefresh, lastUpdated }: {
  active:string; onSelect:(id:string)=>void;
  pairs: { pair:string; changePercent:number }[];
  refreshing:boolean; onRefresh:()=>void; lastUpdated:number|null;
}) {
  const l = useIL();
  const ago = (ts:number) => { const s=Math.floor((Date.now()-ts)/1000); return s<60?`${s}s ago`:`${Math.floor(s/60)}m ago`; };
  const [pairsOpen, setPairsOpen] = useState(false);

  return (
    <div className="flex flex-col h-full py-1.5">
      <div className={`mx-3 mb-1.5 rounded-lg border px-3 py-1.5 ${l?"bg-gray-50 border-gray-100":"bg-[#0a1826] border-[#1a2d3f]"}`}>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse"/>
          <span className={`text-[9px] font-black uppercase tracking-widest ${l?"text-gray-600":"text-[#c0d8ea]"}`}>Forex · Live</span>
          {lastUpdated && <span className={`text-[9px] ml-auto ${l?"text-gray-400":"text-[#7a9ab5]"}`}>{ago(lastUpdated)}</span>}
        </div>
      </div>

      <nav className="space-y-px px-2 mt-3">
        {NAV_SECTIONS.map(s => (
          <button key={s.id}
            onClick={() => { onSelect(s.id); jumpTo(s.id); }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
              active===s.id
                ? l?"bg-[#16a34a]/10 text-[#16a34a] border-l-2 border-[#16a34a] font-bold":"bg-[#16a34a]/10 text-emerald-400 border-l-2 border-emerald-600"
                : l?"text-gray-500 hover:bg-gray-50 hover:text-gray-800":"text-[#5a7a92] hover:bg-white/[0.03] hover:text-[#c0d8ea]"
            }`}>
            <s.icon className="w-3.5 h-3.5 shrink-0"/>
            <span className="truncate">{s.label}</span>
            {active===s.id && <ChevronRight className="w-3 h-3 ml-auto shrink-0"/>}
          </button>
        ))}
      </nav>

      {/* Quick pairs list — collapsible */}
      {pairs.length>0 && (
        <div className={`border-t mx-2 mt-1 pt-1 ${l?"border-gray-100":"border-[#1a2d3f]"}`}>
          <button
            onClick={()=>setPairsOpen(v=>!v)}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors ${
              pairsOpen
                ? l?"bg-gray-100 text-gray-800":"bg-white/[0.06] text-[#c0d8ea]"
                : l?"text-gray-600 hover:bg-gray-50":"text-[#7a9ab5] hover:bg-white/[0.03] hover:text-[#c0d8ea]"
            }`}>
            <span>💱 Pairs</span>
            <span className={`transition-transform duration-200 ${pairsOpen?"rotate-180":""}`}>
              <ChevronRight className="w-3 h-3 rotate-90"/>
            </span>
          </button>
          {pairsOpen && (
            <div className={`mt-0.5 rounded-md overflow-hidden border ${l?"border-gray-100 bg-gray-50":"border-[#1a2d3f] bg-[#060e16]"}`}>
              {pairs.slice(0,6).map(p => {
                const pos = p.changePercent>=0;
                return (
                  <div key={p.pair} className={`flex items-center justify-between px-2.5 py-1.5 text-[10px] border-b last:border-0 ${l?"border-gray-100 hover:bg-gray-100":"border-[#111e28] hover:bg-white/[0.03]"}`}>
                    <span className={`font-medium ${tx.t2(l)}`}>{p.pair}</span>
                    <span className={`font-bold ${pos?"text-emerald-500":"text-red-500"}`}>{pos?"+":""}{p.changePercent.toFixed(2)}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className={`shrink-0 border-t px-3 py-3 ${l?"border-gray-100":"border-[#1a2d3f]"}`}>
        <button onClick={onRefresh} disabled={refreshing}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold text-white disabled:opacity-50 bg-[#16a34a] hover:bg-[#15803d] transition-colors">
          <RefreshCw className={`w-3 h-3 ${refreshing?"animate-spin":""}`}/> Refresh
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════
export default function CurrencyView() {
  const l = useIL();
  const [now, setNow]          = useState(new Date());
  const [activeNav, setActive] = useState("section-sessions");
  const [sidebar, setSidebar]  = useState(false);
  const [activeRegion, setRegion] = useState("All");

  const { data, loading, lastUpdated, refresh } = useGlobalMarkets();
  const [refreshing, setRefreshing] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => { const t = setInterval(() => setTick(n=>n+1), 30_000); return () => clearInterval(t); }, []);

  useEffect(() => {
    const ids = NAV_SECTIONS.map(s=>s.id);
    const h = () => {
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el&&el.getBoundingClientRect().top<=120) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const isLoading = loading==="idle"||loading==="loading";
  const apiForex: ForexPair[] = useMemo(()=>data?.forex||[], [data?.forex]);

  const enrichedPairs = useMemo(() => {
    return STATIC_PAIRS
      .filter(sp => activeRegion==="All"||sp.region===activeRegion)
      .map(sp => {
        const live = apiForex.find(f=>f.pair===sp.pair);
        return live ? { ...sp, rate:live.rate, change:live.change, changePercent:live.changePercent } : null;
      })
      .filter(Boolean) as (typeof STATIC_PAIRS[0] & { rate:number; change:number; changePercent:number })[];
  }, [apiForex, activeRegion]);

  const topGainer = apiForex.length>0 ? apiForex.reduce((p,c)=>c.changePercent>p.changePercent?c:p) : null;
  const topLoser  = apiForex.length>0 ? apiForex.reduce((p,c)=>c.changePercent<p.changePercent?c:p) : null;

  const doRefresh = async () => { setRefreshing(true); try { await refresh(); } catch{} finally { setRefreshing(false); } };

  return (
    <Layout>
      <style>{`
        html{scroll-behavior:smooth}
        .scrollbar-none::-webkit-scrollbar{display:none}
        .scrollbar-none{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>
      <div className={`min-h-screen ${tx.bg(l)}`}>

        {/* Sticky Top Bar */}
        <div className={`sticky top-0 z-20 ${tx.topbar(l)}`}>
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button className="lg:hidden p-1.5 rounded-lg border transition-colors"
                style={{ borderColor:l?"#e5e7eb":"#1a2d3f", background:l?"#f9fafb":"rgba(255,255,255,0.03)" }}
                onClick={()=>setSidebar(v=>!v)}>
                {sidebar?<X className={`w-4 h-4 ${tx.t1(l)}`}/>:<Menu className={`w-4 h-4 ${tx.t1(l)}`}/>}
              </button>
              <span className={`text-[9px] font-black px-2 py-1 rounded-md border ${l?"bg-emerald-50 border-emerald-200 text-emerald-700":"bg-emerald-900/15 border-emerald-800/30 text-emerald-400"}`}>● LIVE</span>
              <h1 className={`text-sm font-black hidden sm:block ${tx.t1(l)}`}>
                Currency & Forex <span className={`font-normal ml-1 text-xs ${tx.t2(l)}`}>Live Rates</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={doRefresh} disabled={refreshing||isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white disabled:opacity-50 bg-[#16a34a] hover:bg-[#15803d] transition-colors">
                <RefreshCw className={`w-3 h-3 ${refreshing?"animate-spin":""}`}/> <span className="hidden sm:inline">Refresh</span>
              </button>
              <div className={`flex items-center gap-1 text-[10px] ${tx.t3(l)}`}>
                <Clock className="w-3 h-3"/>
                <span className="tabular-nums hidden sm:inline">{now.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true})} IST</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto flex">
          {/* Sidebar */}
          <aside className={`fixed lg:sticky top-[49px] h-[calc(100vh-49px)] w-52 shrink-0 z-10 transition-transform duration-200 overflow-y-auto ${tx.sidebar(l)} ${sidebar?"translate-x-0":"-translate-x-full lg:translate-x-0"}`}>
            <SideNav
              active={activeNav} onSelect={id=>{ setActive(id); setSidebar(false); }}
              pairs={apiForex.map(f=>({ pair:f.pair, changePercent:f.changePercent }))}
              refreshing={refreshing} onRefresh={doRefresh} lastUpdated={lastUpdated??null}
            />
          </aside>
          {sidebar && <div className="fixed inset-0 bg-black/50 z-[9] lg:hidden" onClick={()=>setSidebar(false)}/>}

          {/* Main */}
          <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-6 pb-12 max-w-5xl">

            {/* Forex Sessions */}
            <div id="section-sessions" className="mb-8 scroll-mt-24">
              <SecHead id="section-sessions-h" icon={Globe} title="Forex Sessions"/>
              <Card className="overflow-hidden">
                <div className="flex sm:grid sm:grid-cols-4 overflow-x-auto scrollbar-none divide-x divide-y sm:divide-y-0" style={{ borderColor: l?"#f3f4f6":"#1a2d3f" }}>
                  {SESSIONS.map(s => {
                    const open = getSessionStatus(s)==="open";
                    const codeMap: Record<string,string> = { Sydney:"AU", Tokyo:"JP", London:"GB", "New York":"US" };
                    const code = codeMap[s.name] ?? s.name.slice(0,2).toUpperCase();
                    return (
                      <div key={s.name}
                        className={`flex-shrink-0 w-[130px] sm:w-auto flex flex-col items-center px-3 py-3 text-center border-b sm:border-b-0 ${
                          open ? l?"bg-emerald-50/60":"bg-emerald-900/10" : ""
                        } ${l?"border-gray-100 divide-gray-100":"border-[#1a2d3f] divide-[#1a2d3f]"}`}>
                        {/* Country code badge */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 font-black text-[13px] tracking-wider ${
                          open ? "bg-emerald-500/20 text-white border border-emerald-500/30"
                               : l ? "bg-gray-100 text-gray-600 border border-gray-200"
                                   : "bg-white/10 text-white border border-white/15"
                        }`}>{code}</div>
                        <p className={`text-sm font-black mb-1.5 ${l?"text-gray-800":"text-white"}`}>{s.name}</p>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold border ${
                          open ? l?"bg-emerald-50 border-emerald-200 text-emerald-700":"bg-emerald-900/15 border-emerald-800/30 text-emerald-400"
                               : l?"bg-gray-100 border-gray-200 text-gray-400":"bg-white/5 border-[#1a2d3f] text-[#5a7a92]"
                        }`}>
                          {open && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:s.color }}/>}
                          {open?"OPEN":"CLOSED"}
                        </div>
                        <div className="h-0.5 w-full rounded-full mt-2.5" style={{ background: open?s.color:l?"#e5e7eb":"rgba(255,255,255,0.07)", opacity: open?0.9:0.25 }}/>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Top Movers */}
            {(topGainer||topLoser) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {topGainer && (
                  <Card className="p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${l?"bg-emerald-50":"bg-emerald-900/20"}`}>
                      <TrendingUp className="w-5 h-5 text-emerald-500"/>
                    </div>
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${l?"text-emerald-600":"text-emerald-400"}`}>Top Gainer</p>
                      <p className={`text-base font-black ${tx.t1(l)}`}>{topGainer.pair}</p>
                      <p className="text-emerald-500 text-sm font-bold">+{topGainer.changePercent.toFixed(2)}% · {topGainer.rate.toFixed(4)}</p>
                    </div>
                  </Card>
                )}
                {topLoser && (
                  <Card className="p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${l?"bg-red-50":"bg-red-900/20"}`}>
                      <TrendingDown className="w-5 h-5 text-red-500"/>
                    </div>
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${l?"text-red-600":"text-red-400"}`}>Top Loser</p>
                      <p className={`text-base font-black ${tx.t1(l)}`}>{topLoser.pair}</p>
                      <p className="text-red-500 text-sm font-bold">{topLoser.changePercent.toFixed(2)}% · {topLoser.rate.toFixed(4)}</p>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Currency Pairs Grid */}
            <div id="section-pairs" className="mb-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <SecHead id="section-pairs-h" icon={DollarSign} title="Currency Pairs"/>
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 ml-auto">
                  {REGIONS.map(r => (
                    <button key={r} onClick={()=>setRegion(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shrink-0 ${
                        activeRegion===r
                          ? "bg-[#16a34a] text-white border-transparent"
                          : l?"bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                            :"bg-[#0a1826] text-[#5a7a92] border-[#1a2d3f] hover:border-[#2a4a62]"
                      }`}>{r}</button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Array.from({length:6}).map((_,i) => <div key={i} className={`h-40 rounded-xl animate-pulse border ${l?"bg-gray-50 border-gray-100":"bg-[#1a2d3f]/40 border-[#1a2d3f]"}`}/>)}
                </div>
              ) : enrichedPairs.length>0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {enrichedPairs.map(fx => (
                    <ForexCard
                      key={fx.pair}
                      pair={fx.pair} rate={fx.rate} change={fx.change}
                      changePercent={fx.changePercent} isPositive={fx.changePercent>=0}
                      lastUpdated={lastUpdated??undefined}
                      isLight={l}
                    />
                  ))}
                </div>
              ) : (
                <Card className="py-16 flex flex-col items-center gap-3">
                  <Activity className={`w-10 h-10 ${tx.t3(l)}`}/>
                  <p className={`text-sm font-semibold ${tx.t2(l)}`}>
                    {apiForex.length===0 ? "Set EXCHANGERATE_KEY in backend .env for live forex rates" : "No pairs match the selected filter"}
                  </p>
                  {apiForex.length===0 && (
                    <div className={`flex items-start gap-2 px-4 py-3 rounded-xl border text-xs max-w-sm text-center ${l?"bg-amber-50 border-amber-200 text-amber-700":"bg-amber-900/10 border-amber-700/30 text-amber-400"}`}>
                      <Info className="w-4 h-4 shrink-0 mt-0.5"/>
                      <span>Get a free key at exchangerate-api.com and add it to your backend <code>.env</code> as EXCHANGERATE_KEY</span>
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Live Rate Table */}
            {apiForex.length>0&&!isLoading && (
              <div id="section-table" className="mb-8 scroll-mt-24">
                <SecHead id="section-table-h" icon={Activity} title="Live Rate Table" sub="All pairs"/>
                <Card className="overflow-hidden">
                  <div className={`grid grid-cols-3 sm:grid-cols-5 gap-0 px-4 sm:px-5 py-3 border-b text-[10px] font-black uppercase tracking-widest ${l?"bg-gray-50 border-gray-100 text-gray-400":"bg-[#081017] border-[#1a2d3f] text-[#3d5f78]"}`}>
                    <div className="col-span-1 sm:col-span-2">Pair</div>
                    <div className="text-right">Rate</div>
                    <div className="text-right hidden sm:block">Change</div>
                    <div className="text-right">% Chg</div>
                  </div>
                  {apiForex.map((fx,i) => {
                    const pos = fx.changePercent>=0;
                    return (
                      <div key={fx.pair} className={`grid grid-cols-3 sm:grid-cols-5 gap-0 px-4 sm:px-5 py-3 items-center text-sm transition-colors ${i<apiForex.length-1?tx.row(l):""}`}>
                        <div className="col-span-1 sm:col-span-2">
                          <p className={`font-black text-xs sm:text-sm ${tx.t1(l)}`}>{fx.pair}</p>
                          <p className={`text-[10px] hidden sm:block ${tx.t3(l)}`}>{fx.base} → {fx.quote}</p>
                        </div>
                        <div className={`text-right font-black font-mono text-xs sm:text-sm ${tx.t1(l)}`}>{fx.rate.toFixed(4)}</div>
                        <div className={`text-right font-bold text-sm hidden sm:block ${pos?"text-emerald-500":"text-red-500"}`}>{fx.change>0?"+":""}{fx.change.toFixed(4)}</div>
                        <div className="text-right">
                          <PctTag v={fx.changePercent}/>
                        </div>
                      </div>
                    );
                  })}
                </Card>
                {lastUpdated && (
                  <p className={`text-[10px] mt-2 flex items-center gap-1 ${tx.t3(l)}`}>
                    <Clock className="w-3 h-3"/> Rates from ExchangeRate-API · Updated {Math.floor((Date.now()-lastUpdated)/60000)}m ago
                  </p>
                )}
              </div>
            )}

            {/* Disclaimer */}
            <div className={`rounded-xl border p-4 text-xs flex items-start gap-2 ${l?"bg-amber-50 border-amber-200 text-amber-700":"bg-amber-900/10 border-amber-700/30 text-amber-400"}`}>
              <Info className="w-4 h-4 shrink-0 mt-0.5"/>
              <span>Forex rates are indicative and may differ from actual traded rates. Candle charts sourced from Yahoo Finance. Not financial advice.</span>
            </div>

          </main>
        </div>
      </div>
    </Layout>
  );
}