'use client';

import { useState } from "react";
import { Sparkles } from "lucide-react";

// ── Custom SVG Icons — InvestBeans brand concept ─────────────────────────
// BeanSproutIcon : a bean shape with a sprout — "Beans" growing = wealth growth
// CoinStackIcon  : stacked coins with upward arrow — "Invest" = money at work
// IndexChartIcon : bar chart with a rising line overlay — "BeansIndex" = market intelligence

const BeanSproutIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Bean body */}
    <path
      d="M14 30 C10 22, 12 12, 22 10 C32 8, 38 16, 36 26 C34 34, 26 38, 18 36 C14 34, 12 32, 14 30Z"
      stroke="currentColor"
      strokeWidth="2.2"
      fill="none"
    />
    {/* Bean indent crease */}
    <path
      d="M20 12 C18 18, 18 24, 22 30"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeDasharray="2 2"
      opacity="0.6"
    />
    {/* Sprout stem going up from top */}
    <path
      d="M24 10 L24 3"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Left leaf */}
    <path
      d="M24 6 C22 4, 18 3, 17 5 C16 7, 18 8, 24 8"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
    />
    {/* Right leaf */}
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
    {/* Bottom coin */}
    <ellipse cx="22" cy="38" rx="13" ry="4.5" stroke="currentColor" strokeWidth="2" />
    <path d="M9 38 L9 34" stroke="currentColor" strokeWidth="2" />
    <path d="M35 38 L35 34" stroke="currentColor" strokeWidth="2" />
    <ellipse cx="22" cy="34" rx="13" ry="4.5" stroke="currentColor" strokeWidth="2" />
    {/* Middle coin */}
    <path d="M9 34 L9 29" stroke="currentColor" strokeWidth="2" />
    <path d="M35 34 L35 29" stroke="currentColor" strokeWidth="2" />
    <ellipse cx="22" cy="29" rx="13" ry="4.5" stroke="currentColor" strokeWidth="2" />
    {/* Top coin */}
    <path d="M9 29 L9 24.5" stroke="currentColor" strokeWidth="2" />
    <path d="M35 29 L35 24.5" stroke="currentColor" strokeWidth="2" />
    <ellipse cx="22" cy="24.5" rx="13" ry="4.5" stroke="currentColor" strokeWidth="2" />
    {/* Upward arrow — growth */}
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
    {/* X axis */}
    <path d="M6 38 L42 38" stroke="currentColor" strokeWidth="2" />
    {/* Y axis */}
    <path d="M6 38 L6 8" stroke="currentColor" strokeWidth="2" />
    {/* Bars */}
    <rect x="10" y="26" width="6" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <rect x="20" y="20" width="6" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <rect x="30" y="14" width="6" height="24" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    {/* Rising trend line over bars */}
    <path
      d="M13 25 L23 18 L33 11"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeDasharray="0"
    />
    {/* Dot at peak */}
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
  const current = TABS[activeTab];

  return (
    <section className="gradient-hero text-white py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/18 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/12 rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">

          {/* ── Custom SVG brand icons ───────────────────────────
               BeanSproutIcon  = the "Bean" → seed of wealth
               CoinStackIcon   = the "Invest" → money growing
               IndexChartIcon  = the "Index" → market intelligence
          ─────────────────────────────────────────────────────── */}
          <div className="flex justify-center items-center gap-5 mb-8">
            <div className="p-3.5 rounded-2xl bg-accent/15 border border-accent/30 shadow-lg shadow-accent/10 hover:scale-110 hover:bg-accent/20 transition-all duration-300">
              <BeanSproutIcon className="w-8 h-8 text-accent" />
            </div>
            <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20 shadow-md shadow-accent/10 hover:scale-110 hover:bg-accent/15 transition-all duration-300">
              <CoinStackIcon className="w-7 h-7 text-accent/85" />
            </div>
            <div className="p-3.5 rounded-2xl bg-accent/15 border border-accent/30 shadow-lg shadow-accent/10 hover:scale-110 hover:bg-accent/20 transition-all duration-300">
              <IndexChartIcon className="w-8 h-8 text-accent" />
            </div>
          </div>

          {/* ── Baazigar — small punchline ABOVE main heading ───── */}
          <div className="flex justify-center items-center gap-3 mb-4">
            <span className="h-px w-10 bg-accent/40 rounded-full" />
            <p className="text-accent text-xs md:text-sm font-bold tracking-[0.18em] uppercase">
              Baazigar Banein… Sattebaaz Nahi
            </p>
            <span className="h-px w-10 bg-accent/40 rounded-full" />
          </div>

          {/* ── BeansIndex — big bold heading ───────────────────── */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 leading-none tracking-tight">
            Beans<span className="text-accent">Index</span>
          </h1>

          {/* ── Subheading ──────────────────────────────────────── */}
          <p className="text-lg md:text-xl text-white/88 mb-10 leading-relaxed max-w-2xl mx-auto">
            Daily research-backed stock insights — where every pick is powered
            by analysis, not assumptions.
          </p>

          {/* ── Bharat / US tabs ─────────────────────────────────── */}
          <div className="inline-flex items-center gap-1.5 bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-1.5 shadow-2xl shadow-black/30">
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
                    color: active ? "#0D1117" : "rgba(255,255,255,0.55)",
                    boxShadow: active ? "0 4px 20px rgba(201,168,76,0.35)" : "none",
                    transform: active ? "scale(1.03)" : "scale(1)",
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.9)";
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)";
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

          {/* ── Dynamic stats grid ───────────────────────────────── */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {current.stats.map((stat) => (
              <div
                key={stat.sub}
                className="group text-center p-5 rounded-2xl border border-white/18 bg-white/8 backdrop-blur-sm hover:bg-white/14 hover:border-accent/45 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/10 cursor-default"
              >
                <div
                  className="text-2xl md:text-3xl font-bold mb-1.5"
                  style={{
                    color:
                      stat.positive === true
                        ? "#4ade80"
                        : stat.positive === false
                        ? "#f87171"
                        : "var(--accent, #C9A84C)",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-white/75 group-hover:text-white/95 transition-colors duration-300 font-medium">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;