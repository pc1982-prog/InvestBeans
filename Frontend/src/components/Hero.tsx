'use client';

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useTheme } from "@/controllers/Themecontext"

// ── Custom SVG Icons — InvestBeans brand concept ─────────────────────────
const BeanSproutIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M14 30 C10 22, 12 12, 22 10 C32 8, 38 16, 36 26 C34 34, 26 38, 18 36 C14 34, 12 32, 14 30Z"
      stroke="currentColor"
      strokeWidth="2.2"
      fill="none"
    />
    <path
      d="M20 12 C18 18, 18 24, 22 30"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeDasharray="2 2"
      opacity="0.6"
    />
    <path d="M24 10 L24 3" stroke="currentColor" strokeWidth="2" />
    <path
      d="M24 6 C22 4, 18 3, 17 5 C16 7, 18 8, 24 8"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
    />
    <path
      d="M24 4 C26 2, 30 2, 31 4 C32 6, 29 7, 24 7"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
    />
  </svg>
);

const CoinStackIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="22" cy="38" rx="13" ry="4.5" stroke="currentColor" strokeWidth="2" />
    <path d="M9 38 L9 34" stroke="currentColor" strokeWidth="2" />
    <path d="M35 38 L35 34" stroke="currentColor" strokeWidth="2" />
    <ellipse cx="22" cy="34" rx="13" ry="4.5" stroke="currentColor" strokeWidth="2" />
    <path d="M9 34 L9 29" stroke="currentColor" strokeWidth="2" />
    <path d="M35 34 L35 29" stroke="currentColor" strokeWidth="2" />
    <ellipse cx="22" cy="29" rx="13" ry="4.5" stroke="currentColor" strokeWidth="2" />
    <path d="M9 29 L9 24.5" stroke="currentColor" strokeWidth="2" />
    <path d="M35 29 L35 24.5" stroke="currentColor" strokeWidth="2" />
    <ellipse cx="22" cy="24.5" rx="13" ry="4.5" stroke="currentColor" strokeWidth="2" />
    <path d="M34 16 L38 10 L42 16" stroke="currentColor" strokeWidth="2.2" />
    <path d="M38 10 L38 22" stroke="currentColor" strokeWidth="2.2" />
  </svg>
);

const IndexChartIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 38 L42 38" stroke="currentColor" strokeWidth="2" />
    <path d="M6 38 L6 8" stroke="currentColor" strokeWidth="2" />
    <rect x="10" y="26" width="6" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <rect x="20" y="20" width="6" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <rect x="30" y="14" width="6" height="24" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <path d="M13 25 L23 18 L33 11" stroke="currentColor" strokeWidth="2.2" strokeDasharray="0" />
    <circle cx="33" cy="11" r="2.5" fill="currentColor" />
  </svg>
);

// ── Static Bharat tab (no API needed) ───────────────────────────────────────
const BHARAT_STATS = [
  { value: "+0.85%", sub: "SENSEX vs NIFTY 50", positive: true  },
  { value: "+1.14%", sub: "FII vs DII",          positive: true  },
  { value: "13.42",  sub: "India VIX",           positive: null  },
  { value: "+0.32%", sub: "GIFT NIFTY",          positive: true  },
];

// Navigation map: stat sub → GlobalView section id
const STAT_NAV: Record<string, { path: string; section: string }> = {
  "NASDAQ vs S&P 500": { path: "/global", section: "section-us"   },
  "USD / INR":         { path: "/global", section: "section-forex" },
  "GOLD vs SILVER":    { path: "/global", section: "section-commodities" },
  "Dow Jones":         { path: "/global", section: "section-us"   },
};

type TabKey = "bharat" | "us";

interface StatItem { value: string; sub: string; positive: boolean | null; section?: string; path?: string; }

const Hero = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("bharat");
  const { theme } = useTheme();
  const isLight = theme === "light";
  const navigate = useNavigate();

  // ── Live US stats from backend ───────────────────────────────────────────
  const [usStats, setUsStats] = useState<StatItem[]>([
    { value: "...", sub: "NASDAQ",    positive: null },
    { value: "...", sub: "USD / INR", positive: null },
    { value: "...", sub: "Gold",      positive: null },
    { value: "...", sub: "Dow Jones", positive: null },
  ]);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
    fetch(`${API}/markets/global`)
      .then(r => r.json())
      .then(data => {
        const us    = data?.indices?.us    || [];
        const forex = data?.forex          || [];
        const comms = data?.commodities    || [];

        const nasdaq = us.find((m: any) => m.symbol === "^IXIC");
        const sp500  = us.find((m: any) => m.symbol === "^GSPC");
        const dow    = us.find((m: any) => m.symbol === "^DJI");
        const usdinr = forex.find((m: any) => m.pair === "USD/INR");
        const gold   = comms.find((m: any) => m.symbol === "GC=F");
        const silver = comms.find((m: any) => m.symbol === "SI=F");

        const fmt = (v: number | undefined, prefix = "+") =>
          v == null ? "N/A" : `${v >= 0 ? prefix : ""}${v.toFixed(2)}%`;

        // NASDAQ — primary value
        const nasdaqVal = nasdaq
          ? `${nasdaq.changePercent >= 0 ? "+" : ""}${nasdaq.changePercent.toFixed(2)}%`
          : "N/A";
        const nasdaqPos = nasdaq ? nasdaq.changePercent >= 0 : null;

        // USD/INR — use changePercent from forex (daily % move), not raw rate
        // rate can be unreliable; show % change instead which is always meaningful
        const usdInrVal = usdinr?.changePercent != null
          ? `${usdinr.changePercent >= 0 ? "+" : ""}${usdinr.changePercent.toFixed(2)}%`
          : usdinr?.rate != null
          ? `₹${Number(usdinr.rate).toFixed(2)}`
          : "N/A";
        const usdInrPos = usdinr?.changePercent != null
          ? usdinr.changePercent >= 0
          : null;

        // Gold — primary value
        const goldVal = gold
          ? `${gold.changePercent >= 0 ? "+" : ""}${gold.changePercent.toFixed(2)}%`
          : "N/A";
        const goldPos = gold ? gold.changePercent >= 0 : null;

        // Dow Jones
        const dowVal = dow
          ? `${dow.changePercent >= 0 ? "+" : ""}${dow.changePercent.toFixed(2)}%`
          : "N/A";
        const dowPos = dow ? dow.changePercent >= 0 : null;

        setUsStats([
          { value: nasdaqVal, sub: "NASDAQ",    positive: nasdaqPos, path: "/global", section: "section-us"          },
          { value: usdInrVal, sub: "USD / INR", positive: usdInrPos, path: "/global", section: "section-forex"        },
          { value: goldVal,   sub: "Gold",       positive: goldPos,   path: "/global", section: "section-commodities"  },
          { value: dowVal,    sub: "Dow Jones",  positive: dowPos,    path: "/global", section: "section-us"           },
        ]);
      })
      .catch(() => {}); // silently keep placeholder values
  }, []);

  const currentStats: StatItem[] = activeTab === "bharat"
    ? BHARAT_STATS
    : usStats;

  // ── Light mode: professional bluish gradient ──────────────────────────────
  const sectionStyle = isLight
    ? {
        background: "linear-gradient(135deg, #dbe9f9 0%, #e8f2fd 30%, #edf5fe 60%, #dce8f7 100%)",
      }
    : undefined;

  const sectionCls = isLight
    ? "text-navy py-20 relative overflow-hidden"
    : "gradient-hero text-white py-20 relative overflow-hidden";

  // ── Decorative blobs ──────────────────────────────────────────────────────
  const blob1 = isLight
    ? "absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-blue-200/50"
    : "absolute top-0 right-0 w-96 h-96 bg-accent/18 rounded-full blur-3xl pointer-events-none";

  const blob2 = isLight
    ? "absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-indigo-200/40"
    : "absolute bottom-0 left-0 w-96 h-96 bg-accent/12 rounded-full blur-3xl pointer-events-none";

  const gridOpacity = isLight ? "opacity-[0.04]" : "opacity-[0.06]";
  const gridColor = isLight ? "#0d2540" : "white";

  // ── Typography ────────────────────────────────────────────────────────────
  const punchlineCls = isLight
    ? "text-accent text-xs md:text-sm font-bold tracking-[0.18em] uppercase"
    : "text-accent text-xs md:text-sm font-bold tracking-[0.18em] uppercase";

  const lineCls = isLight
    ? "h-px w-10 bg-accent/50 rounded-full"
    : "h-px w-10 bg-accent/40 rounded-full";

  const subheadingCls = isLight
    ? "text-lg md:text-xl text-navy/70 mb-10 leading-relaxed max-w-2xl mx-auto"
    : "text-lg md:text-xl text-white/88 mb-10 leading-relaxed max-w-2xl mx-auto";

  // ── Icon boxes ────────────────────────────────────────────────────────────
  const iconBoxLg = isLight
    ? "p-3.5 rounded-2xl bg-amber-100 border-2 border-amber-300 shadow-lg shadow-amber-200/60 transition-all duration-300 "
    : "p-3.5 rounded-2xl bg-accent/30 border-2 border-accent/60 shadow-lg shadow-accent/25 transition-all duration-300 ";

  const iconBoxSm = isLight
    ? "p-3 rounded-2xl bg-amber-50 border-2 border-amber-200 shadow-md shadow-amber-100/60 transition-all duration-300 "
    : "p-3 rounded-2xl bg-accent/20 border-2 border-accent/45 shadow-md shadow-accent/20 transition-all duration-300 ";

  // ── Tab pill container ────────────────────────────────────────────────────
  const tabContainerCls = isLight
    ? "inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-md border border-slate-300 rounded-2xl p-1.5 shadow-xl shadow-navy/10"
    : "inline-flex items-center gap-1.5 bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-1.5 shadow-2xl shadow-black/30";

  // ── Stat cards ────────────────────────────────────────────────────────────
  const statCardCls = isLight
    ? "group text-center p-5 rounded-2xl border border-navy/12 bg-white/75 backdrop-blur-sm hover:bg-white hover:border-accent/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/10 cursor-default shadow-sm"
    : "group text-center p-5 rounded-2xl border border-white/18 bg-white/8 backdrop-blur-sm hover:bg-white/14 hover:border-accent/45 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/10 cursor-default";

  const statSubCls = isLight
    ? "text-xs md:text-sm text-navy/60 group-hover:text-navy/90 transition-colors duration-300 font-medium"
    : "text-xs md:text-sm text-white/75 group-hover:text-white/95 transition-colors duration-300 font-medium";

  return (
    <section className={sectionCls} style={sectionStyle}>
      {/* Background decorations */}
      <div className={blob1} />
      <div className={blob2} />
      <div
        className={`absolute inset-0 pointer-events-none ${gridOpacity}`}
        style={{
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">

          {/* ── Custom SVG brand icons ──────────────────────────────────── */}
          <div className="flex justify-center items-center gap-5 mb-8">
            <div className={iconBoxLg}>
              <BeanSproutIcon className={`w-8 h-8 ${isLight ? "text-amber-500" : "text-accent"}`} style={{ filter: isLight ? "drop-shadow(0 2px 6px rgba(217,119,6,0.4))" : "drop-shadow(0 2px 8px rgba(201,168,76,0.6))" }} />
            </div>
            <div className={iconBoxSm}>
              <CoinStackIcon className={`w-7 h-7 ${isLight ? "text-amber-400" : "text-accent"}`} style={{ filter: isLight ? "drop-shadow(0 2px 4px rgba(217,119,6,0.3))" : "drop-shadow(0 2px 6px rgba(201,168,76,0.5))" }} />
            </div>
            <div className={iconBoxLg}>
              <IndexChartIcon className={`w-8 h-8 ${isLight ? "text-amber-500" : "text-accent"}`} style={{ filter: isLight ? "drop-shadow(0 2px 6px rgba(217,119,6,0.4))" : "drop-shadow(0 2px 8px rgba(201,168,76,0.6))" }} />
            </div>
          </div>

          {/* ── Baazigar punchline ─────────────────────────────────────── */}
          <div className="flex justify-center items-center gap-3 mb-4">
            <span className={lineCls} />
            <p className={punchlineCls}>Baazigar Banein… Sattebaaz Nahi</p>
            <span className={lineCls} />
          </div>

          {/* ── BeansIndex heading ─────────────────────────────────────── */}
          <h1
            className={`text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 leading-none tracking-tight ${
              isLight ? "text-navy" : "text-white"
            }`}
          >
            Beans<span className="text-accent">Index</span>
          </h1>

          {/* ── Subheading ─────────────────────────────────────────────── */}
          <p className={subheadingCls}>
            Daily research-backed stock insights — where every pick is powered
            by analysis, not assumptions.
          </p>

          {/* ── Bharat / US tabs ──────────────────────────────────────── */}
          <div className={tabContainerCls}>
            {(["bharat", "us"] as TabKey[]).map((key) => {
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className="relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none"
                  style={{
                    background: active
                      ? "linear-gradient(135deg, var(--accent, #C9A84C), #e8c96a)"
                      : "transparent",
                    color: active
                      ? "#0D1117"
                      : isLight
                      ? "rgba(13,27,42,0.45)"
                      : "rgba(255,255,255,0.55)",
                    boxShadow: active ? "0 4px 20px rgba(201,168,76,0.35)" : "none",
                    transform: active ? "scale(1.03)" : "scale(1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLButtonElement).style.color = isLight
                        ? "rgba(13,27,42,0.85)"
                        : "rgba(255,255,255,0.9)";
                      (e.currentTarget as HTMLButtonElement).style.background = isLight
                        ? "rgba(13,27,42,0.06)"
                        : "rgba(255,255,255,0.08)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLButtonElement).style.color = isLight
                        ? "rgba(13,27,42,0.45)"
                        : "rgba(255,255,255,0.55)";
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }
                  }}
                >
                  {active && <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />}
                  <span>{key === "bharat" ? "🇮🇳" : "🇺🇸"}</span>
                  <span>{key === "bharat" ? "Bharat BeansIndex" : "US BeansIndex"}</span>
                </button>
              );
            })}
          </div>

          {/* ── Dynamic stats grid ─────────────────────────────────────── */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {currentStats.map((stat) => (
              <div
                key={stat.sub}
                className={statCardCls}
                onClick={() => {
                  if (stat.path && stat.section) {
                    navigate(`${stat.path}?scrollTo=${stat.section}`);
                  }
                }}
                style={{ cursor: stat.path ? "pointer" : "default" }}
              >
                {/* Sub label on top like a badge */}
                <div style={{
                  fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: isLight ? "rgba(13,37,64,0.45)" : "rgba(255,255,255,0.45)",
                  marginBottom: "8px",
                }}>
                  {stat.sub}
                </div>

                {/* Main value */}
                <div
                  className="text-2xl md:text-3xl font-bold"
                  style={{
                    color:
                      stat.positive === true
                        ? "#16a34a"
                        : stat.positive === false
                        ? "#dc2626"
                        : "var(--accent, #C9A84C)",
                    lineHeight: 1.1,
                  }}
                >
                  {stat.value === "..." ? (
                    <span style={{ opacity: 0.35, fontSize: "1rem" }}>—</span>
                  ) : stat.value}
                </div>

                {/* Today's change label */}
                <div style={{
                  fontSize: "10px", marginTop: "6px",
                  color: isLight ? "rgba(13,37,64,0.35)" : "rgba(255,255,255,0.30)",
                }}>
                  Today's change
                </div>

                {stat.path && (
                  <div style={{
                    fontSize: "10px", marginTop: "6px",
                    color: "var(--accent, #C9A84C)", opacity: 0.8, fontWeight: 600,
                  }}>
                    View details →
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;