'use client';

import { useState } from "react";
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

// ── Tab data ────────────────────────────────────────────────────────────────
const TABS = {
  bharat: {
    label: "Bharat BeansIndex",
    flag: "🇮🇳",
    stats: [
      { value: "+0.85%", sub: "SENSEX vs NIFTY 50", positive: true  },
      { value: "+1.14%", sub: "FII vs DII",          positive: true  },
      { value: "13.42",  sub: "India VIX",           positive: null  },
      { value: "+0.32%", sub: "GIFT NIFTY",          positive: true  },
    ],
  },
  us: {
    label: "US BeansIndex",
    flag: "🇺🇸",
    stats: [
      { value: "+1.14%", sub: "NASDAQ vs S&P 500",  positive: true  },
      { value: "₹83.62", sub: "USD / INR",           positive: null  },
      { value: "+2.3%",  sub: "GOLD vs SILVER",      positive: true  },
      { value: "84%",    sub: "Market Sync Index",   positive: null  },
    ],
  },
} as const;

type TabKey = keyof typeof TABS;

const Hero = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("bharat");
  const { theme } = useTheme();
  const isLight = theme === "light";
  const current = TABS[activeTab];

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
    ? "p-3.5 rounded-2xl bg-accent/12 border border-accent/25 shadow-lg shadow-accent/10 hover:scale-110 hover:bg-accent/18 transition-all duration-300"
    : "p-3.5 rounded-2xl bg-accent/15 border border-accent/30 shadow-lg shadow-accent/10 hover:scale-110 hover:bg-accent/20 transition-all duration-300";

  const iconBoxSm = isLight
    ? "p-3 rounded-2xl bg-accent/8 border border-accent/18 shadow-md shadow-accent/10 hover:scale-110 hover:bg-accent/12 transition-all duration-300"
    : "p-3 rounded-2xl bg-accent/10 border border-accent/20 shadow-md shadow-accent/10 hover:scale-110 hover:bg-accent/15 transition-all duration-300";

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
              <BeanSproutIcon className="w-8 h-8 text-accent" />
            </div>
            <div className={iconBoxSm}>
              <CoinStackIcon className="w-7 h-7 text-accent/85" />
            </div>
            <div className={iconBoxLg}>
              <IndexChartIcon className="w-8 h-8 text-accent" />
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
            {(Object.keys(TABS) as TabKey[]).map((key) => {
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
                  <span>{TABS[key].flag}</span>
                  <span>{TABS[key].label}</span>
                </button>
              );
            })}
          </div>

          {/* ── Dynamic stats grid ─────────────────────────────────────── */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {current.stats.map((stat) => (
              <div key={stat.sub} className={statCardCls}>
                <div
                  className="text-2xl md:text-3xl font-bold mb-1.5"
                  style={{
                    color:
                      stat.positive === true
                        ? "#16a34a"   // slightly darker green for light bg legibility
                        : stat.positive === false
                        ? "#dc2626"
                        : "var(--accent, #C9A84C)",
                  }}
                >
                  {stat.value}
                </div>
                <div className={statSubCls}>{stat.sub}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;