// MarketsView.tsx — Redesigned in DomesticView style
// Data: same useGlobalMarkets hook — only design changed

import React, { useState, useMemo, useEffect } from 'react';
import Layout from '@/components/Layout';
import CommodityCard from '@/components/Commoditycard';
import { useGlobalMarkets } from '@/hooks/useGlobalMarkets';
import { Commodity } from '@/services/globalMarkets/types';
import { useTheme } from '@/controllers/Themecontext';
import {
  TrendingUp, TrendingDown, Activity, RefreshCw,
  BarChart3, DollarSign, Flame, Clock, Menu, X, ChevronRight,
  Globe, Info,
} from 'lucide-react';

// ── Market Hours (same as original) ──────────────────────────────
interface MarketInfo { name:string; flag:string; code:string; tz:string; localTime:string; openUTC:number; closeUTC:number; color:string; }
const MARKETS: MarketInfo[] = [
  { name:"Tokyo",     flag:"🇯🇵", code:"JP", tz:"JST", localTime:"09:00–15:00", openUTC:0,   closeUTC:360,  color:"#e74c3c" },
  { name:"Shanghai",  flag:"🇨🇳", code:"CN", tz:"CST", localTime:"09:30–15:00", openUTC:90,  closeUTC:420,  color:"#f39c12" },
  { name:"India",     flag:"🇮🇳", code:"IN", tz:"IST", localTime:"09:15–15:30", openUTC:225, closeUTC:570,  color:"#27ae60" },
  { name:"Frankfurt", flag:"🇩🇪", code:"DE", tz:"CET", localTime:"09:00–17:30", openUTC:480, closeUTC:990,  color:"#2980b9" },
  { name:"London",    flag:"🇬🇧", code:"GB", tz:"GMT", localTime:"08:00–16:30", openUTC:480, closeUTC:990,  color:"#8e44ad" },
  { name:"New York",  flag:"🇺🇸", code:"US", tz:"EST", localTime:"09:30–16:00", openUTC:870, closeUTC:1260, color:"#2563eb" },
];
function getStatus(m: MarketInfo): "open"|"pre"|"closed" {
  const now=new Date(), day=now.getUTCDay();
  if (day===0||day===6) return "closed";
  const mins=now.getUTCHours()*60+now.getUTCMinutes();
  if (mins>=m.openUTC&&mins<m.closeUTC) return "open";
  if (mins>=m.openUTC-30&&mins<m.openUTC) return "pre";
  return "closed";
}

// ── 3D Commodity Icons (unchanged from original) ─────────────────
const GoldBarIcon = ({ size=28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <polygon points="4,10 16,5 28,10 16,15" fill="#F5C518" />
    <polygon points="28,10 28,22 16,27 16,15" fill="#C8960C" />
    <polygon points="4,10 4,22 16,27 16,15" fill="#E8A800" />
    <polygon points="6,10.5 16,6.5 26,10.5 16,14.5" fill="#FFE066" opacity="0.5" />
    <line x1="10" y1="8" x2="22" y2="12" stroke="#FFF5A0" strokeWidth="0.8" opacity="0.6" />
    <line x1="8" y1="18" x2="16" y2="22" stroke="#B8860B" strokeWidth="0.5" opacity="0.5" />
    <line x1="20" y1="16" x2="28" y2="20" stroke="#B8860B" strokeWidth="0.5" opacity="0.5" />
  </svg>
);
const SilverBarIcon = ({ size=28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <polygon points="4,10 16,5 28,10 16,15" fill="#D0D8E0" />
    <polygon points="28,10 28,22 16,27 16,15" fill="#8A9AB0" />
    <polygon points="4,10 4,22 16,27 16,15" fill="#A8B8C8" />
    <polygon points="6,10.5 16,6.5 26,10.5 16,14.5" fill="#F0F4F8" opacity="0.6" />
    <line x1="10" y1="8" x2="22" y2="12" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.7" />
    <line x1="8" y1="18" x2="16" y2="22" stroke="#6A7A8A" strokeWidth="0.5" opacity="0.5" />
    <line x1="20" y1="16" x2="28" y2="20" stroke="#6A7A8A" strokeWidth="0.5" opacity="0.5" />
  </svg>
);
const OilBarrelIcon = ({ size=28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <ellipse cx="16" cy="26" rx="10" ry="3.5" fill="#2C1A0E" />
    <rect x="6" y="8" width="20" height="18" rx="3" fill="url(#oilGrad)" />
    <defs><linearGradient id="oilGrad" x1="6" y1="8" x2="26" y2="8" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#8B4513" stopOpacity="0.8"/><stop offset="40%" stopColor="#CD853F" stopOpacity="0.9"/><stop offset="100%" stopColor="#4A2C0A" stopOpacity="1"/></linearGradient></defs>
    <ellipse cx="16" cy="8" rx="10" ry="3.5" fill="#8B4513" />
    <ellipse cx="16" cy="8" rx="8" ry="2.5" fill="#CD853F" />
    <rect x="6" y="12" width="20" height="2.5" rx="1" fill="#2C1A0E" opacity="0.6" />
    <rect x="6" y="20" width="20" height="2.5" rx="1" fill="#2C1A0E" opacity="0.6" />
    <rect x="9" y="9" width="4" height="14" rx="2" fill="#CD853F" opacity="0.25" />
  </svg>
);
const BrentBarrelIcon = ({ size=28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <ellipse cx="16" cy="26" rx="10" ry="3.5" fill="#1A0A0A" />
    <rect x="6" y="8" width="20" height="18" rx="3" fill="url(#brentGrad)" />
    <defs><linearGradient id="brentGrad" x1="6" y1="8" x2="26" y2="8" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#7B1A1A" stopOpacity="0.8"/><stop offset="40%" stopColor="#C0392B" stopOpacity="0.9"/><stop offset="100%" stopColor="#3A0A0A" stopOpacity="1"/></linearGradient></defs>
    <ellipse cx="16" cy="8" rx="10" ry="3.5" fill="#7B1A1A" />
    <ellipse cx="16" cy="8" rx="8" ry="2.5" fill="#C0392B" />
    <rect x="6" y="12" width="20" height="2.5" rx="1" fill="#1A0A0A" opacity="0.6" />
    <rect x="6" y="20" width="20" height="2.5" rx="1" fill="#1A0A0A" opacity="0.6" />
    <rect x="9" y="9" width="4" height="14" rx="2" fill="#E74C3C" opacity="0.2" />
  </svg>
);
const NaturalGasIcon = ({ size=28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <ellipse cx="16" cy="27" rx="8" ry="2.5" fill="#1A3A2A" />
    <rect x="8" y="10" width="16" height="17" rx="4" fill="url(#gasGrad)" />
    <defs><linearGradient id="gasGrad" x1="8" y1="10" x2="24" y2="10" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#1A5C3A"/><stop offset="45%" stopColor="#27AE60"/><stop offset="100%" stopColor="#1A3A2A"/></linearGradient></defs>
    <ellipse cx="16" cy="10" rx="8" ry="2.8" fill="#27AE60" />
    <ellipse cx="16" cy="10" rx="6" ry="2" fill="#2ECC71" />
    <rect x="13" y="6" width="6" height="4" rx="1.5" fill="#1A5C3A" />
    <rect x="14.5" y="4" width="3" height="3" rx="1" fill="#145A32" />
    <rect x="8" y="16" width="16" height="5" rx="0" fill="#145A32" opacity="0.5" />
    <path d="M16 2 C14 3.5 13 5 14.5 6.5 C15 5.5 15.5 5 16 4.5 C16.5 5 17 5.5 17.5 6.5 C19 5 18 3.5 16 2Z" fill="#F39C12"/>
    <path d="M16 3 C15.2 4 14.8 5 15.5 5.8 C15.8 5.2 16 5 16 4.5 C16 5 16.2 5.2 16.5 5.8 C17.2 5 16.8 4 16 3Z" fill="#F1C40F"/>
  </svg>
);

const NAV_SECTIONS = [
  { id:"section-overview",     label:"Overview",       icon: BarChart3   },
  { id:"section-hours",        label:"Market Hours",   icon: Globe       },
  { id:"section-commodities",  label:"Commodities",    icon: Flame       },
  { id:"section-explore",      label:"Explore More",   icon: DollarSign  },
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
function SideNav({ active, onSelect, commodities, refreshing, onRefresh, lastUpdated }: {
  active:string; onSelect:(id:string)=>void;
  commodities: { name:string; changePercent:number }[];
  refreshing:boolean; onRefresh:()=>void; lastUpdated:number|null;
}) {
  const l = useIL();
  const ago = (ts:number) => { const s=Math.floor((Date.now()-ts)/1000); return s<60?`${s}s ago`:`${Math.floor(s/60)}m ago`; };
  const [commodOpen, setCommodOpen] = useState(false);

  return (
    <div className="flex flex-col h-full py-1.5">
      <div className={`mx-3 mb-1.5 rounded-lg border px-3 py-1.5 ${l?"bg-gray-50 border-gray-100":"bg-[#0a1826] border-[#1a2d3f]"}`}>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse"/>
          <span className={`text-[9px] font-black uppercase tracking-widest ${l?"text-gray-600":"text-[#c0d8ea]"}`}>Markets</span>
          {lastUpdated && <span className={`text-[9px] ml-auto ${l?"text-gray-400":"text-[#7a9ab5]"}`}>{ago(lastUpdated)} · ~15m</span>}
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

      {commodities.length>0 && (
        <div className={`border-t mx-2 mt-1 pt-1 ${l?"border-gray-100":"border-[#1a2d3f]"}`}>
          <button
            onClick={()=>setCommodOpen(v=>!v)}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors ${
              commodOpen
                ? l?"bg-gray-100 text-gray-800":"bg-white/[0.06] text-[#c0d8ea]"
                : l?"text-gray-600 hover:bg-gray-50":"text-[#7a9ab5] hover:bg-white/[0.03] hover:text-[#c0d8ea]"
            }`}>
            <span>🏅 Commodities</span>
            <span className={`transition-transform duration-200 ${commodOpen?"rotate-180":""}`}>
              <ChevronRight className="w-3 h-3 rotate-90"/>
            </span>
          </button>
          {commodOpen && (
            <div className={`mt-0.5 rounded-md overflow-hidden border ${l?"border-gray-100 bg-gray-50":"border-[#1a2d3f] bg-[#060e16]"}`}>
              {commodities.map(c => {
                const pos = c.changePercent>=0;
                return (
                  <div key={c.name} className={`flex items-center justify-between px-2.5 py-1.5 text-[10px] border-b last:border-0 ${l?"border-gray-100 hover:bg-gray-100":"border-[#111e28] hover:bg-white/[0.03]"}`}>
                    <span className={`font-medium truncate mr-2 max-w-[90px] ${tx.t2(l)}`}>{c.name.length>14?c.name.slice(0,14)+"…":c.name}</span>
                    <span className={`font-bold shrink-0 ${pos?"text-emerald-500":"text-red-500"}`}>{pos?"+":""}{c.changePercent.toFixed(2)}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className={`shrink-0 border-t px-3 py-3 mt-auto ${l?"border-gray-100":"border-[#1a2d3f]"}`}>
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
const MarketsView = () => {
  const l = useIL();
  const [now, setNow]          = useState(new Date());
  const [activeNav, setActive] = useState("section-overview");
  const [sidebar, setSidebar]  = useState(false);

  const { data, loading, lastUpdated, refresh } = useGlobalMarkets();
  const [refreshing, setRefreshing] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => { const id=setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(id); }, []);
  useEffect(() => { const t=setInterval(()=>setTick(n=>n+1),60_000); return ()=>clearInterval(t); }, []);

  useEffect(() => {
    const ids = NAV_SECTIONS.map(s=>s.id);
    const h = () => {
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el&&el.getBoundingClientRect().top<=120) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", h, { passive:true });
    return ()=>window.removeEventListener("scroll", h);
  }, []);

  const isLoading = loading==="idle"||loading==="loading";
  const commodities: Commodity[] = useMemo(()=>data?.commodities||[], [data?.commodities]);
  const doRefresh = async () => { setRefreshing(true); try { await refresh(); } catch{} finally { setRefreshing(false); } };

  const iconMap: Record<string,React.ReactNode> = {
    "Gold":          <GoldBarIcon size={26}/>,
    "Silver":        <SilverBarIcon size={26}/>,
    "Crude Oil WTI": <OilBarrelIcon size={26}/>,
    "Brent Crude":   <BrentBarrelIcon size={26}/>,
    "Natural Gas":   <NaturalGasIcon size={26}/>,
  };
  const iconSm: Record<string,React.ReactNode> = {
    "Gold":          <GoldBarIcon size={16}/>,
    "Silver":        <SilverBarIcon size={16}/>,
    "Crude Oil WTI": <OilBarrelIcon size={16}/>,
    "Brent Crude":   <BrentBarrelIcon size={16}/>,
    "Natural Gas":   <NaturalGasIcon size={16}/>,
  };

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
                Markets <span className={`font-normal ml-1 text-xs ${tx.t2(l)}`}>Stocks · Commodities · Currencies</span>
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
              commodities={commodities.map(c=>({ name:c.name, changePercent:c.changePercent }))}
              refreshing={refreshing} onRefresh={doRefresh} lastUpdated={lastUpdated??null}
            />
          </aside>
          {sidebar && <div className="fixed inset-0 bg-black/50 z-[9] lg:hidden" onClick={()=>setSidebar(false)}/>}

          {/* Main */}
          <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-6 pb-12 max-w-5xl">

            {/* Overview — asset category cards */}
            <div id="section-overview" className="mb-8 scroll-mt-24">
              <SecHead id="section-overview-h" icon={BarChart3} title="Markets Overview" sub="All asset classes"/>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label:"Stock Markets",    icon:<BarChart3 className="w-6 h-6 text-emerald-500"/>,  bg:l?"bg-emerald-50":"bg-emerald-900/15", desc:"Global equity indices with live data.", stat:"View Global Markets →", href:"/global-markets" },
                  { label:"Forex / Currency", icon:<DollarSign className="w-6 h-6 text-blue-500"/>,    bg:l?"bg-blue-50":"bg-blue-900/15",     desc:"Live currency pairs & exchange rates.", stat:"View Currency Page →",    href:"/currency"        },
                  { label:"Commodities",      icon:<GoldBarIcon size={24}/>,                            bg:l?"bg-amber-50":"bg-amber-900/15",    desc:"Gold, silver, crude oil, natural gas.", stat:"See below ↓",           href:"#section-commodities" },
                ].map(c => (
                  <a key={c.label} href={c.href}
                    className={`rounded-xl border p-5 flex items-start gap-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${tx.card(l)}`}>
                    <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center shrink-0`}>{c.icon}</div>
                    <div>
                      <h3 className={`font-black text-sm mb-1 ${tx.t1(l)}`}>{c.label}</h3>
                      <p className={`text-xs leading-relaxed mb-2 ${tx.t2(l)}`}>{c.desc}</p>
                      <span className="text-xs font-bold text-[#16a34a]">{c.stat}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Market Hours */}
            <div id="section-hours" className="mb-8 scroll-mt-24">
              <SecHead id="section-hours-h" icon={Globe} title="Market Hours"/>
              <Card className="overflow-hidden">
                <div className={`flex sm:grid sm:grid-cols-6 overflow-x-auto scrollbar-none divide-x ${l?"divide-gray-100":"divide-[#1a2d3f]"}`}>
                  {MARKETS.map(m => {
                    const s = getStatus(m);
                    const isOpen = s==="open", isPre = s==="pre";
                    return (
                      <div key={m.name}
                        className={`flex-shrink-0 w-[100px] sm:w-auto flex flex-col items-center px-2 py-2.5 text-center border-b sm:border-b-0 ${
                          isOpen ? l?"bg-emerald-50/60":"bg-emerald-900/10"
                          : isPre ? l?"bg-amber-50/50":"bg-amber-900/10" : ""
                        } ${l?"border-gray-100":"border-[#1a2d3f]"}`}>
                        {/* White code badge */}
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 font-black text-[13px] tracking-wider ${
                          isOpen ? "bg-emerald-500/20 text-white border border-emerald-500/30"
                          : isPre ? "bg-amber-500/20 text-white border border-amber-500/30"
                          : l     ? "bg-gray-100 text-gray-600 border border-gray-200"
                                  : "bg-white/10 text-white border border-white/15"
                        }`}>{m.code}</div>
                        <p className={`text-[11px] font-extrabold leading-none mb-0.5 ${l?"text-gray-800":"text-white"}`}>{m.name}</p>
                        <p className={`text-[9px] font-medium mb-1.5 ${l?"text-gray-500":"text-[#7a9ab5]"}`}>{m.tz}</p>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
                          isOpen ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40"
                          : isPre ? "bg-amber-500/25 text-amber-300 border border-amber-500/40"
                          : l     ? "bg-gray-100 text-gray-600 border border-gray-200"
                                  : "bg-white/10 text-[#8ab0cc] border border-white/15"
                        }`}>{isOpen?"● OPEN":isPre?"◐ PRE":"CLOSED"}</span>
                        <p className={`text-[9px] mt-1 font-medium ${l?"text-gray-400":"text-[#5a7a92]"}`}>{m.localTime}</p>
                        <div className="h-0.5 w-full rounded-full mt-1.5" style={{ background:isOpen?m.color:isPre?"#f59e0b":l?"#e5e7eb":"rgba(255,255,255,0.07)", opacity:isOpen?1:0.3 }}/>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Commodities */}
            <div id="section-commodities" className="mb-8 scroll-mt-24">
              <SecHead id="section-commodities-h" icon={Flame} title="Commodities" sub="~15 min delayed"/>

              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                  {Array.from({length:5}).map((_,i) => <div key={i} className={`h-52 rounded-xl animate-pulse border ${l?"bg-gray-50 border-gray-100":"bg-[#1a2d3f]/40 border-[#1a2d3f]"}`}/>)}
                </div>
              ) : commodities.length>0 ? (
                <>
                  {/* Snapshot row */}
                  <div className={`flex items-center gap-4 mb-4 px-4 py-3 rounded-xl border text-xs flex-wrap ${tx.card(l)}`}>
                    <span className={`font-semibold ${tx.t2(l)}`}>Snapshot:</span>
                    {commodities.map(c => (
                      <span key={c.symbol} className="flex items-center gap-1.5">
                        {iconSm[c.name] ?? <Activity className="w-3 h-3"/>}
                        <span className={`font-bold ${tx.t1(l)}`}>{c.name}</span>
                        <span className={c.changePercent>=0?"text-emerald-500 font-bold":"text-red-500 font-bold"}>
                          {c.changePercent>=0?"▲":"▼"}{Math.abs(c.changePercent).toFixed(2)}%
                        </span>
                      </span>
                    ))}
                    {lastUpdated && (
                      <span className={`ml-auto flex items-center gap-1 ${tx.t3(l)}`}>
                        <Clock className="w-3 h-3"/>{Math.floor((Date.now()-lastUpdated)/60000)}m ago
                      </span>
                    )}
                  </div>

                  {/* Commodity cards — CommodityCard already has its own sparkline chart */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {commodities.map(c => (
                      <CommodityCard
                        key={c.symbol}
                        name={c.name} price={c.price} change={c.change}
                        changePercent={c.changePercent} unit={c.unit}
                        isPositive={c.changePercent>=0}
                        candles={c.candles}
                        lastUpdated={lastUpdated??undefined}
                        isLight={l}
                        icon={iconMap[c.name]}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <Card className="py-16 flex flex-col items-center gap-3">
                  <Activity className={`w-10 h-10 ${tx.t3(l)}`}/>
                  <p className={`text-sm font-semibold ${tx.t2(l)}`}>Commodity data unavailable</p>
                  <button onClick={doRefresh} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#16a34a]/10 text-[#16a34a]">Retry</button>
                </Card>
              )}
            </div>

            {/* Explore More — navigation links */}
            <div id="section-explore" className="mb-8 scroll-mt-24">
              <SecHead id="section-explore-h" icon={DollarSign} title="Explore More"/>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="/global-markets"
                  className={`rounded-xl border p-5 flex items-center gap-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${tx.card(l)}`}>
                  <div className={`w-11 h-11 ${l?"bg-emerald-50":"bg-emerald-900/15"} rounded-xl flex items-center justify-center shrink-0`}>
                    <TrendingUp className="w-6 h-6 text-emerald-500"/>
                  </div>
                  <div>
                    <h3 className={`font-black text-base mb-1 ${tx.t1(l)}`}>Global Markets</h3>
                    <p className={`text-sm ${tx.t2(l)}`}>US, Europe & Asia indices with live charts, bonds, VIX & events</p>
                  </div>
                </a>
                <a href="/currency"
                  className={`rounded-xl border p-5 flex items-center gap-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${tx.card(l)}`}>
                  <div className={`w-11 h-11 ${l?"bg-blue-50":"bg-blue-900/15"} rounded-xl flex items-center justify-center shrink-0`}>
                    <DollarSign className="w-6 h-6 text-blue-500"/>
                  </div>
                  <div>
                    <h3 className={`font-black text-base mb-1 ${tx.t1(l)}`}>Currency / Forex</h3>
                    <p className={`text-sm ${tx.t2(l)}`}>Live currency pairs, exchange rates, candlestick charts & more</p>
                  </div>
                </a>
              </div>
            </div>

          </main>
        </div>
      </div>
    </Layout>
  );
};

export default MarketsView;