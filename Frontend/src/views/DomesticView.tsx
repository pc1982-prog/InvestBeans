import Layout from "@/components/Layout";
import {
  TrendingUp, TrendingDown, Activity, Globe,
  Clock, RefreshCw, BarChart3, LineChart, Percent,
  Layers, ArrowUpDown, DollarSign, Briefcase, Building2,
  CalendarDays, Info,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/controllers/Themecontext";

// ── Brand colours (same as GlobalView) ──────────────────────────
const G = "#2D4A35";
const O = "#C07A3A";

// ── Placeholder helpers ──────────────────────────────────────────
function SectionLabel({ icon: Icon, children, isLight }: { icon?: any; children: React.ReactNode; isLight?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {Icon && (
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${G}12`, border: `1px solid ${G}25` }}
        >
          <Icon className="w-4 h-4" style={{ color: G }} />
        </div>
      )}
      <h2 className={`text-xl font-extrabold tracking-tight ${isLight ? "text-gray-900" : "text-slate-100"}`}>{children}</h2>
      <div className={`flex-1 h-px ml-2 ${isLight ? "bg-gray-100" : "bg-white/10"}`} />
    </div>
  );
}

// Shimmering skeleton block
function Skeleton({ h = "h-80", className = "" }: { h?: string; className?: string }) {
  return (
    <div
      className={`${h} rounded-2xl border ${className}`}
      style={{ background: "linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", backgroundSize: "400% 100%", animation: "shimmer 1.6s infinite", borderColor: "#e5e7eb" }}
    />
  );
}

// ── Static placeholder data (replace with API later) ─────────────

const INDICES = [
  { name: "Nifty 50",     symbol: "NIFTY",     price: "22,142.30", change: "−72.10",  pct: "−0.33%", pos: false },
  { name: "Sensex",       symbol: "SENSEX",    price: "73,276.64", change: "+394.25", pct: "+0.54%", pos: true  },
  { name: "Bank Nifty",   symbol: "BANKNIFTY", price: "47,852.15", change: "+215.40", pct: "+0.45%", pos: true  },
  { name: "Nifty IT",     symbol: "CNXIT",     price: "34,128.90", change: "−189.70", pct: "−0.55%", pos: false },
  { name: "Nifty Auto",   symbol: "CNXAUTO",   price: "21,340.60", change: "+98.50",  pct: "+0.46%", pos: true  },
  { name: "Nifty Pharma", symbol: "CNXPHARMA", price: "18,965.40", change: "−55.30",  pct: "−0.29%", pos: false },
];

const TOP_STOCKS = [
  { name: "RELIANCE",  price: "2,847.50", open: "2,810.00", high: "2,860.20", low: "2,798.50", vol: "4.2M", chg: "+1.61%", pos: true  },
  { name: "TCS",       price: "3,456.80", open: "3,480.00", high: "3,495.00", low: "3,440.00", vol: "2.1M", chg: "−0.67%", pos: false },
  { name: "HDFCBANK",  price: "1,234.60", open: "1,222.00", high: "1,240.00", low: "1,218.00", vol: "5.8M", chg: "+1.05%", pos: true  },
  { name: "INFY",      price: "1,567.90", open: "1,560.00", high: "1,575.00", low: "1,552.00", vol: "3.3M", chg: "+0.55%", pos: true  },
  { name: "ICICIBANK", price: "1,102.40", open: "1,095.00", high: "1,110.00", low: "1,090.00", vol: "6.1M", chg: "+0.68%", pos: true  },
  { name: "WIPRO",     price: "487.30",   open: "492.00",   high: "493.50",   low: "483.00",   vol: "2.7M", chg: "−0.96%", pos: false },
  { name: "HINDUNILVR",price: "2,345.20", open: "2,361.00", high: "2,365.00", low: "2,330.00", vol: "1.2M", chg: "−0.65%", pos: false },
  { name: "ITC",       price: "456.70",   open: "453.00",   high: "459.00",   low: "451.00",   vol: "8.4M", chg: "+0.71%", pos: true  },
];

const SECTORS = [
  { name: "Banking & Finance", chg: "+0.82%", pos: true,  top: "HDFCBANK +1.05%", bot: "KOTAKBANK −0.38%" },
  { name: "Information Tech",  chg: "−0.55%", pos: false, top: "INFY +0.55%",     bot: "TCS −0.67%"      },
  { name: "FMCG",              chg: "−0.12%", pos: false, top: "ITC +0.71%",      bot: "HUL −0.65%"      },
  { name: "Auto",              chg: "+0.46%", pos: true,  top: "MARUTI +0.90%",   bot: "TATAMOTORS −0.20%" },
  { name: "Pharma",            chg: "−0.29%", pos: false, top: "SUNPHARMA +0.15%",bot: "DRREDDY −0.72%"  },
  { name: "Energy & Oil",      chg: "+0.44%", pos: true,  top: "RELIANCE +1.61%", bot: "BPCL −0.33%"     },
];

const FNO_OI = [
  { name: "Nifty 50 Futures",   expiry: "25 Apr 2024", oi: "1,24,56,500",  chgOI: "+4.2%",  ltp: "22,160.00", pos: true  },
  { name: "Bank Nifty Futures", expiry: "25 Apr 2024", oi: "48,23,750",    chgOI: "+2.8%",  ltp: "47,880.00", pos: true  },
  { name: "Nifty 22000 CE",     expiry: "25 Apr 2024", oi: "2,10,45,000",  chgOI: "−6.1%",  ltp: "245.50",    pos: false },
  { name: "Nifty 22200 PE",     expiry: "25 Apr 2024", oi: "1,85,60,000",  chgOI: "+9.3%",  ltp: "182.00",    pos: true  },
  { name: "BankNifty 48000 CE", expiry: "25 Apr 2024", oi: "98,40,000",    chgOI: "+3.5%",  ltp: "112.75",    pos: true  },
  { name: "BankNifty 47500 PE", expiry: "25 Apr 2024", oi: "1,02,15,000",  chgOI: "−2.4%",  ltp: "135.20",    pos: false },
];

const MARKET_DEPTH = [
  { stock: "RELIANCE", bids: [{ p: "2,846.00", q: "342" }, { p: "2,845.50", q: "218" }, { p: "2,845.00", q: "615" }, { p: "2,844.50", q: "430" }, { p: "2,844.00", q: "124" }], asks: [{ p: "2,847.50", q: "285" }, { p: "2,848.00", q: "190" }, { p: "2,848.50", q: "520" }, { p: "2,849.00", q: "375" }, { p: "2,849.50", q: "210" }] },
  { stock: "TCS",      bids: [{ p: "3,455.00", q: "115" }, { p: "3,454.50", q: "88"  }, { p: "3,454.00", q: "320" }, { p: "3,453.50", q: "240" }, { p: "3,453.00", q: "160" }], asks: [{ p: "3,456.80", q: "200" }, { p: "3,457.00", q: "145" }, { p: "3,457.50", q: "310" }, { p: "3,458.00", q: "175" }, { p: "3,458.50", q: "95"  }] },
];

const CORP_ACTIONS = [
  { name: "TCS",         action: "Dividend", detail: "₹28 per share",     exDate: "19 Apr 2024", status: "Upcoming" },
  { name: "HDFCBANK",    action: "Dividend", detail: "₹19.50 per share",   exDate: "22 Apr 2024", status: "Upcoming" },
  { name: "INFY",        action: "Buyback",  detail: "₹1,750 buyback price",exDate: "26 Apr 2024", status: "Upcoming" },
  { name: "HINDUNILVR",  action: "Bonus",    detail: "1:1 Bonus Issue",    exDate: "30 Apr 2024", status: "Upcoming" },
  { name: "ITC",         action: "Dividend", detail: "₹6.75 per share",    exDate: "05 May 2024", status: "Upcoming" },
  { name: "WIPRO",       action: "Split",    detail: "1:1 Stock Split",    exDate: "10 May 2024", status: "Upcoming" },
];

const FOREX_PAIRS = [
  { pair: "USD/INR", rate: "83.47", chg: "+0.12", pct: "+0.14%", pos: true  },
  { pair: "EUR/INR", rate: "89.62", chg: "−0.22", pct: "−0.25%", pos: false },
  { pair: "GBP/INR", rate: "104.85", chg: "+0.38", pct: "+0.36%", pos: true  },
  { pair: "JPY/INR", rate: "0.5521", chg: "+0.002", pct: "+0.36%", pos: true  },
];

// ── Mini sparkline (pure CSS bars, no lib needed) ────────────────
const SPARKLINE_DATA: Record<string, number[]> = {
  NIFTY:     [65, 70, 68, 72, 69, 67, 65, 64, 66, 65],
  SENSEX:    [60, 62, 65, 64, 67, 70, 72, 71, 74, 73],
  BANKNIFTY: [50, 54, 52, 56, 58, 55, 59, 61, 60, 62],
  CNXIT:     [70, 68, 66, 65, 64, 63, 62, 61, 61, 60],
  CNXAUTO:   [55, 57, 56, 58, 60, 59, 61, 62, 62, 63],
  CNXPHARMA: [62, 60, 61, 59, 58, 57, 58, 57, 56, 57],
};

function MiniSparkline({ symbol, pos }: { symbol: string; pos: boolean }) {
  const pts = SPARKLINE_DATA[symbol] || [50, 50, 50, 50, 50, 50, 50, 50, 50, 50];
  const max = Math.max(...pts), min = Math.min(...pts), range = max - min || 1;
  const W = 96, H = 36;
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * W);
  const ys = pts.map(v => H - ((v - min) / range) * (H - 4) - 2);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const fill = `${d} L${W},${H} L0,${H} Z`;
  const stroke = pos ? "#16a34a" : "#dc2626";
  const bg = pos ? "#16a34a18" : "#dc262618";
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <path d={fill} fill={bg} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Index selector card (mirrors GlobalView MarketSelector) ───────
function IndexSelector({ isLight }: { isLight?: boolean }) {
  const [sel, setSel] = useState(0);
  const idx = INDICES[sel];
  return (
    <section className="mb-12">
      <SectionLabel icon={BarChart3} isLight={isLight}>Major Indices</SectionLabel>

      {/* Tab pills */}
      <div className="flex items-center gap-2.5 mb-5 flex-wrap">
        {INDICES.map((m, i) => (
          <button
            key={m.symbol}
            onClick={() => setSel(i)}
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 border"
            style={
              sel === i
                ? { background: G, color: "#fff", borderColor: G, boxShadow: `0 4px 12px ${G}30` }
                : isLight
                  ? { background: "#fff", color: "#374151", borderColor: "#e5e7eb" }
                  : { background: "rgba(255,255,255,0.05)", color: "#94a3b8", borderColor: "rgba(255,255,255,0.1)" }
            }
          >
            <span className="flex items-center gap-2">
              {m.name}
              <span style={{ color: sel === i ? "rgba(255,255,255,0.85)" : m.pos ? "#16a34a" : "#dc2626" }}
                className="text-xs font-bold">{m.pct}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Chart placeholder panel */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden ${isLight ? "bg-white border-gray-100" : "bg-[#0e2038] border-white/8"}`}>
        <div className="h-0.5" style={{ background: idx.pos ? "linear-gradient(to right,#16a34a,transparent)" : "linear-gradient(to right,#dc2626,transparent)" }} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className={`text-xs font-bold tracking-widest uppercase ${isLight ? "text-gray-400" : "text-slate-500"}`}>{idx.symbol} · NSE</p>
              <p className={`text-4xl font-black leading-none mt-1 ${isLight ? "text-gray-900" : "text-slate-100"}`}>{idx.price}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-bold" style={{ color: idx.pos ? "#16a34a" : "#dc2626" }}>
                  {idx.change}&nbsp;({idx.pct})
                </span>
                {idx.pos ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
              </div>
            </div>
            <div className={`text-right text-xs flex flex-col items-end gap-1 ${isLight ? "text-gray-300" : "text-slate-600"}`}>
              <span>Intraday data available via API</span>
              <span>1 min / 3 min / 5 min / 15 min</span>
            </div>
          </div>

          {/* Big chart placeholder with shimmer + label */}
          <div className={`relative h-64 rounded-2xl overflow-hidden border border-dashed flex flex-col items-center justify-center gap-3 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"}`}>
            <div className="absolute inset-0 opacity-20"
              style={{ background: `repeating-linear-gradient(0deg,transparent,transparent 39px,${idx.pos ? "#16a34a" : "#dc2626"}22 39px,${idx.pos ? "#16a34a" : "#dc2626"}22 40px),repeating-linear-gradient(90deg,transparent,transparent 79px,#e5e7eb 79px,#e5e7eb 80px)` }}
            />
            <LineChart className={`w-10 h-10 ${isLight ? "text-gray-300" : "text-slate-600"}`} />
            <p className={`text-sm font-bold ${isLight ? "text-gray-400" : "text-slate-500"}`}>Intraday Candle Chart</p>
            <p className={`text-xs text-center px-8 ${isLight ? "text-gray-300" : "text-slate-600"}`}>Live OHLCV data available after Zerodha Kite Connect API integration</p>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold tracking-widest border"
              style={{ background: `${G}10`, color: G, borderColor: `${G}25` }}>
              API READY · ₹500/month
            </span>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              { label: "Open",   val: "—" },
              { label: "High",   val: "—" },
              { label: "Low",    val: "—" },
              { label: "Volume", val: "—" },
            ].map(s => (
              <div key={s.label} className={`rounded-xl border px-4 py-3 text-center ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/5 border-white/8"}`}>
                <p className={`text-xs font-semibold ${isLight ? "text-gray-400" : "text-slate-500"}`}>{s.label}</p>
                <p className={`text-base font-black mt-0.5 ${isLight ? "text-gray-300" : "text-slate-600"}`}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
export default function DomesticView() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <Layout>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div className={`min-h-screen ${isLight ? "bg-[#F8F7F4]" : "bg-[#0c1a2e]"}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">

          {/* ── HERO ───────────────────────────────────────────── */}
          <div className="mb-12 rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.08)" }}>
            <div className="h-1" style={{ background: `linear-gradient(to right, ${G}, ${O})` }} />
            <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-8 py-9 ${isLight ? "bg-white" : "bg-[#0e2038]"}`}>
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4"
                  style={{ background: `${G}12`, color: G, border: `1px solid ${G}25` }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G }} />
                  PLACEHOLDER · LIVE DATA COMING SOON
                </div>
                <h1 className={`text-4xl sm:text-5xl font-black tracking-tight leading-none mb-3 ${isLight ? "text-gray-900" : "text-slate-100"}`}>
                  Indian Stock
                  <span className="block" style={{ color: G }}>Markets</span>
                </h1>
                <p className={`text-sm font-normal ${isLight ? "text-gray-400" : "text-slate-400"}`}>
                  NSE · BSE · F&amp;O · Sector data via Zerodha Kite Connect v3
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl">
                  <Info className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-medium text-amber-700">Static placeholder data — Zerodha API integration pending</span>
                </div>
                <button
                  disabled
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white opacity-40 cursor-not-allowed shadow-lg"
                  style={{ background: G }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* ── INDEX SELECTOR (with inline sparklines on summary) ─ */}
          <IndexSelector isLight={isLight} />

          {/* ── SECTOR PERFORMANCE ─────────────────────────────── */}
          <section className="mb-12">
            <SectionLabel icon={Layers} isLight={isLight}>Sector Performance</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {SECTORS.map((s) => (
                <div key={s.name} className={`rounded-2xl border hover:shadow-md transition-all duration-200 overflow-hidden ${isLight ? "bg-white border-gray-100 hover:border-gray-200" : "bg-[#0e2038] border-white/8 hover:border-white/15"}`}>
                  <div className="h-0.5" style={{ background: s.pos ? "linear-gradient(to right,#16a34a,transparent)" : "linear-gradient(to right,#dc2626,transparent)" }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <p className={`font-extrabold text-base ${isLight ? "text-gray-900" : "text-slate-100"}`}>{s.name}</p>
                      <span className="text-xl font-black" style={{ color: s.pos ? "#16a34a" : "#dc2626" }}>{s.chg}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                        <span className="text-gray-500 font-medium">Best</span>
                        <span className="text-emerald-700 font-bold text-xs">{s.top}</span>
                      </div>
                      <div className="flex justify-between items-center px-3 py-2.5 rounded-xl bg-red-50 border border-red-100">
                        <span className="text-gray-500 font-medium">Worst</span>
                        <span className="text-red-600 font-bold text-xs">{s.bot}</span>
                      </div>
                    </div>
                    <div className={`flex justify-between text-xs mt-4 pt-4 border-t ${isLight ? "text-gray-300 border-gray-50" : "text-slate-600 border-white/5"}`}>
                      <div className="flex items-center gap-1"><Activity className="w-3 h-3" /> Sector Index</div>
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Placeholder</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── TOP STOCKS (OHLCV) ──────────────────────────────── */}
          <section className="mb-12">
            <SectionLabel icon={LineChart} isLight={isLight}>Top Stocks — OHLCV</SectionLabel>
            <div className={`rounded-2xl border shadow-sm overflow-hidden ${isLight ? "bg-white border-gray-100" : "bg-[#0e2038] border-white/8"}`}>
              {/* Table header */}
              <div className={`grid grid-cols-8 gap-4 px-5 py-3 border-b text-xs font-bold uppercase tracking-widest ${isLight ? "bg-gray-50 border-gray-100 text-gray-400" : "bg-white/5 border-white/8 text-slate-500"}`}>
                <div className="col-span-2">Symbol</div>
                <div className="text-right">LTP</div>
                <div className="text-right">Open</div>
                <div className="text-right">High</div>
                <div className="text-right">Low</div>
                <div className="text-right">Volume</div>
                <div className="text-right">Change</div>
              </div>
              {TOP_STOCKS.map((s, i) => (
                <div
                  key={s.name}
                  className={`grid grid-cols-8 gap-4 px-5 py-3.5 items-center transition-colors text-sm ${i < TOP_STOCKS.length - 1 ? (isLight ? "border-b border-gray-50" : "border-b border-white/5") : ""} ${isLight ? "hover:bg-gray-50/60" : "hover:bg-white/5"}`}
                >
                  <div className="col-span-2 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${s.pos ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                      {s.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className={`font-bold ${isLight ? "text-gray-900" : "text-slate-100"}`}>{s.name}</p>
                      <p className={`text-xs ${isLight ? "text-gray-400" : "text-slate-500"}`}>NSE</p>
                    </div>
                  </div>
                  <div className={`text-right font-black ${isLight ? "text-gray-900" : "text-slate-100"}`}>{s.price}</div>
                  <div className={`text-right font-medium ${isLight ? "text-gray-500" : "text-slate-400"}`}>{s.open}</div>
                  <div className="text-right text-emerald-600 font-medium">{s.high}</div>
                  <div className="text-right text-red-500 font-medium">{s.low}</div>
                  <div className={`text-right font-medium ${isLight ? "text-gray-500" : "text-slate-400"}`}>{s.vol}</div>
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 text-xs font-extrabold px-2 py-1 rounded-lg ${s.pos ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                      {s.pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {s.chg}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FOREX (INR pairs) ───────────────────────────────── */}
          <section className="mb-12">
            <SectionLabel icon={DollarSign} isLight={isLight}>INR Forex Pairs</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {FOREX_PAIRS.map((fx) => (
                <div key={fx.pair} className={`rounded-2xl border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden ${isLight ? "bg-white border-gray-100" : "bg-[#0e2038] border-white/8"}`}>
                  <div className="h-0.5" style={{ background: fx.pos ? "linear-gradient(to right,#16a34a,transparent)" : "linear-gradient(to right,#dc2626,transparent)" }} />
                  <div className="p-4">
                    <p className={`text-xs font-bold tracking-widest uppercase mb-2 ${isLight ? "text-gray-400" : "text-slate-500"}`}>{fx.pair}</p>
                    <p className={`text-2xl font-black ${isLight ? "text-gray-900" : "text-slate-100"}`}>{fx.rate}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-xs font-bold" style={{ color: fx.pos ? "#16a34a" : "#dc2626" }}>{fx.chg}</span>
                      <span className={`text-xs ${isLight ? "text-gray-300" : "text-slate-600"}`}>·</span>
                      <span className="text-xs font-bold" style={{ color: fx.pos ? "#16a34a" : "#dc2626" }}>{fx.pct}</span>
                    </div>
                    <p className={`text-xs mt-3 ${isLight ? "text-gray-300" : "text-slate-600"}`}>Placeholder · API ready</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── F&O OPEN INTEREST ───────────────────────────────── */}
          <section className="mb-12">
            <SectionLabel icon={Percent} isLight={isLight}>F&amp;O Open Interest</SectionLabel>
            <div className={`rounded-2xl border shadow-sm overflow-hidden ${isLight ? "bg-white border-gray-100" : "bg-[#0e2038] border-white/8"}`}>
              <div className={`grid grid-cols-5 gap-4 px-5 py-3 border-b text-xs font-bold uppercase tracking-widest ${isLight ? "bg-gray-50 border-gray-100 text-gray-400" : "bg-white/5 border-white/8 text-slate-500"}`}>
                <div className="col-span-2">Instrument</div>
                <div className="text-right">OI</div>
                <div className="text-right">OI Change</div>
                <div className="text-right">LTP</div>
              </div>
              {FNO_OI.map((f, i) => (
                <div key={f.name}
                  className={`grid grid-cols-5 gap-4 px-5 py-3.5 items-center transition-colors text-sm ${i < FNO_OI.length - 1 ? (isLight ? "border-b border-gray-50" : "border-b border-white/5") : ""} ${isLight ? "hover:bg-gray-50/60" : "hover:bg-white/5"}`}>
                  <div className="col-span-2">
                    <p className={`font-bold ${isLight ? "text-gray-900" : "text-slate-100"}`}>{f.name}</p>
                    <p className={`text-xs ${isLight ? "text-gray-400" : "text-slate-500"}`}>Exp: {f.expiry}</p>
                  </div>
                  <div className={`text-right font-mono font-semibold ${isLight ? "text-gray-600" : "text-slate-300"}`}>{f.oi}</div>
                  <div className="text-right">
                    <span className={`text-xs font-extrabold ${f.pos ? "text-emerald-600" : "text-red-500"}`}>{f.chgOI}</span>
                  </div>
                  <div className={`text-right font-black ${isLight ? "text-gray-900" : "text-slate-100"}`}>{f.ltp}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── MARKET DEPTH ────────────────────────────────────── */}
          <section className="mb-12">
            <SectionLabel icon={ArrowUpDown} isLight={isLight}>Market Depth (Level 2)</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {MARKET_DEPTH.map((md) => (
                <div key={md.stock} className={`rounded-2xl border shadow-sm overflow-hidden ${isLight ? "bg-white border-gray-100" : "bg-[#0e2038] border-white/8"}`}>
                  <div className={`flex items-center justify-between px-5 py-3 border-b ${isLight ? "border-gray-50" : "border-white/5"}`}>
                    <p className={`font-extrabold ${isLight ? "text-gray-900" : "text-slate-100"}`}>{md.stock}</p>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${G}12`, color: G }}>5 Level Bid/Ask</span>
                  </div>
                  <div className={`grid grid-cols-2 divide-x ${isLight ? "divide-gray-50" : "divide-white/5"}`}>
                    <div>
                      <div className="grid grid-cols-2 px-4 py-2 bg-emerald-50 border-b border-emerald-100 text-xs font-bold uppercase text-emerald-700">
                        <span>Bid Qty</span><span className="text-right">Price</span>
                      </div>
                      {md.bids.map((b, i) => (
                        <div key={i} className={`grid grid-cols-2 px-4 py-2 text-sm border-b last:border-0 transition-colors ${isLight ? "border-gray-50 hover:bg-emerald-50/40" : "border-white/5 hover:bg-emerald-900/20"}`}>
                          <span className="font-bold text-emerald-600">{b.q}</span>
                          <span className={`text-right font-mono ${isLight ? "text-gray-700" : "text-slate-300"}`}>{b.p}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="grid grid-cols-2 px-4 py-2 bg-red-50 border-b border-red-100 text-xs font-bold uppercase text-red-600">
                        <span>Price</span><span className="text-right">Ask Qty</span>
                      </div>
                      {md.asks.map((a, i) => (
                        <div key={i} className={`grid grid-cols-2 px-4 py-2 text-sm border-b last:border-0 transition-colors ${isLight ? "border-gray-50 hover:bg-red-50/40" : "border-white/5 hover:bg-red-900/20"}`}>
                          <span className={`font-mono ${isLight ? "text-gray-700" : "text-slate-300"}`}>{a.p}</span>
                          <span className="text-right font-bold text-red-500">{a.q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CORPORATE ACTIONS ───────────────────────────────── */}
          <section className="mb-12">
            <SectionLabel icon={CalendarDays} isLight={isLight}>Corporate Actions</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CORP_ACTIONS.map((ca, i) => {
                const COLOR: Record<string, string> = { Dividend: "bg-blue-50 text-blue-700 border-blue-200", Buyback: "bg-purple-50 text-purple-700 border-purple-200", Bonus: "bg-amber-50 text-amber-700 border-amber-200", Split: "bg-teal-50 text-teal-700 border-teal-200" };
                const c = COLOR[ca.action] || "bg-gray-50 text-gray-600 border-gray-100";
                return (
                  <div key={i} className={`rounded-xl border p-4 transition-all duration-150 ${isLight ? "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm" : "bg-[#0e2038] border-white/8 hover:border-white/15"}`}>
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span className={`px-2.5 py-0.5 text-[11px] font-extrabold rounded-full border ${c}`}>{ca.action}</span>
                      <span className={`ml-auto text-xs font-medium ${isLight ? "text-gray-300" : "text-slate-600"}`}>Ex: {ca.exDate}</span>
                    </div>
                    <p className={`font-extrabold mb-1 ${isLight ? "text-gray-900" : "text-slate-100"}`}>{ca.name}</p>
                    <p className={`text-sm ${isLight ? "text-gray-500" : "text-slate-400"}`}>{ca.detail}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── NOT-YET-AVAILABLE DATA ──────────────────────────── */}
          <section className="mb-12">
            <SectionLabel icon={Info} isLight={isLight}>Data Pending External Sources</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "India VIX",            src: "nseindia.com",            desc: "Fear gauge — not in Zerodha API" },
                { label: "FII / DII Activity",   src: "nseindia.com/market-data",desc: "Institutional flow data" },
                { label: "Market Breadth (A/D)", src: "nseindia.com/market-data",desc: "Advance–Decline ratio" },
                { label: "Macro Data (CPI/GDP)", src: "rbi.org.in",              desc: "Fundamental economic indicators" },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl border border-dashed p-4 flex flex-col gap-2 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"}`}>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                    <Info className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className={`font-bold text-sm ${isLight ? "text-gray-700" : "text-slate-300"}`}>{item.label}</p>
                  <p className={`text-xs leading-relaxed ${isLight ? "text-gray-400" : "text-slate-500"}`}>{item.desc}</p>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5 w-fit">{item.src}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── STATUS BAR ──────────────────────────────────────── */}
          <div className={`rounded-2xl border shadow-sm overflow-hidden ${isLight ? "bg-white border-gray-100" : "bg-[#0e2038] border-white/8"}`}>
            <div className="h-0.5" style={{ background: `linear-gradient(to right, ${G}, ${O}, transparent)` }} />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 text-sm">
              <div className={`flex items-center gap-2.5 ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                <Activity className="w-4 h-4" style={{ color: G }} />
                <span className="font-medium">
                  Status:{" "}
                  <span className={`font-semibold ${isLight ? "text-gray-600" : "text-slate-300"}`}>Static placeholder · Zerodha API integration pending</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-5">
                {[
                  { label: "NSE", status: "pending" },
                  { label: "BSE", status: "pending" },
                  { label: "F&O", status: "pending" },
                ].map((m) => (
                  <div key={m.label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="uppercase font-bold text-xs text-amber-500">{m.label} {m.status}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5">
                  <Briefcase className={`w-3.5 h-3.5 ${isLight ? "text-gray-300" : "text-slate-600"}`} />
                  <span className={`font-extrabold text-xs tracking-widest ${isLight ? "text-gray-300" : "text-slate-600"}`}>PLACEHOLDER</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}