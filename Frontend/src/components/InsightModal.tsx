// InsightModal.tsx — UPDATED
// RequireSubscription wrap kiya body sections around

import {
  X, Clock, Eye, Calendar, ExternalLink,
  TrendingUp, TrendingDown, Zap, BarChart2,
  Building2, LineChart, ShieldAlert,
} from "lucide-react";
import { useTheme } from "@/controllers/Themecontext";
import RequireSubscription from "@/components/RequireSubscription";

interface StructuredInsight {
  summary?: string;
  marketSignificance?: string;
  impactArea?: string;
  stocksImpacted?: string;
  shortTermView?: string;
  longTermView?: string;
  keyRisk?: string;
  impactScore?: number;
}

interface InsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: {
    _id: string;
    title: string;
    description: string;
    investBeansInsight: StructuredInsight | string;
    credits: { source: string; author?: string; url?: string; publishedDate?: string };
    sentiment: "positive" | "negative" | "neutral";
    category: string;
    readTime: string;
    views: number;
    likes?: number;
    publishedAt: string;
  } | null;
  loading?: boolean;
}

function hexToRgb(hex: string): string {
  const c = hex.replace("#", "");
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`;
}

const InsightModal = ({ isOpen, onClose, insight, loading = false }: InsightModalProps) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (!isOpen) return null;
  const showLoading = loading && !insight;

  const ibi = insight?.investBeansInsight;
  const structured: StructuredInsight | null =
    ibi && typeof ibi === "object" ? ibi as StructuredInsight : null;
  const legacyText: string | null =
    ibi && typeof ibi === "string" ? ibi : null;

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const modalBg      = isLight ? "linear-gradient(160deg,#f0f7fe 0%,#e8f2fd 100%)" : "linear-gradient(160deg,rgba(13,19,36,0.99) 0%,rgba(10,15,28,0.99) 100%)";
  const modalBorder  = isLight ? "1px solid rgba(13,37,64,0.12)" : "1px solid rgba(81,148,246,0.18)";
  const blueTopLine  = "linear-gradient(90deg,transparent,rgba(81,148,246,0.55),transparent)";
  const headerBg     = isLight ? "rgba(232,242,253,0.97)" : "rgba(13,19,36,0.98)";
  const headerBorder = isLight ? "1px solid rgba(13,37,64,0.08)" : "1px solid rgba(81,148,246,0.12)";
  const titleColor   = isLight ? "#0d1b2a" : "white";
  const metaColor    = isLight ? "rgba(13,37,64,0.5)" : "rgba(148,163,184,1)";
  const closeBg      = isLight ? "rgba(13,37,64,0.06)" : "rgba(255,255,255,0.06)";
  const closeColor   = isLight ? "rgba(13,37,64,0.45)" : "rgba(148,163,184,1)";
  const cardBg       = isLight ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.03)";
  const cardBorder   = isLight ? "1px solid rgba(13,37,64,0.09)" : "1px solid rgba(81,148,246,0.13)";
  const bodyText     = isLight ? "rgba(13,37,64,0.72)" : "rgba(203,213,225,1)";
  const labelColor   = isLight ? "rgba(13,37,64,0.42)" : "rgba(100,116,139,1)";
  const divider      = isLight ? "rgba(13,37,64,0.07)" : "rgba(81,148,246,0.10)";
  const footerBg     = isLight ? "rgba(232,242,253,0.98)" : "rgba(10,15,28,0.99)";
  const footerBorder = isLight ? "1px solid rgba(13,37,64,0.08)" : "1px solid rgba(81,148,246,0.12)";
  const skeleton     = isLight ? "rgba(13,37,64,0.06)" : "rgba(255,255,255,0.07)";

  // ── Sentiment ─────────────────────────────────────────────────────────────
  const ss = !insight ? { color: "#5194F6", bg: "rgba(81,148,246,0.08)", border: "rgba(81,148,246,0.20)" } : {
    positive: { color: "#16a34a", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.25)" },
    negative: { color: "#dc2626", bg: "rgba(251,113,133,0.1)", border: "rgba(251,113,133,0.25)" },
    neutral:  { color: "#5194F6", bg: "rgba(81,148,246,0.08)", border: "rgba(81,148,246,0.20)" },
  }[insight.sentiment];

  const sentimentIcon = () => {
    if (!insight) return <Eye className="w-4 h-4" />;
    if (insight.sentiment === "positive") return <TrendingUp className="w-4 h-4" />;
    if (insight.sentiment === "negative") return <TrendingDown className="w-4 h-4" />;
    return <Eye className="w-4 h-4" />;
  };

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const score       = structured?.impactScore ?? 0;
  const scoreColor  = score >= 8 ? "#ef4444" : score >= 6 ? "#f59e0b" : score >= 4 ? "#5194F6" : "#10b981";
  const scoreLabel  = score >= 8 ? "High Impact" : score >= 6 ? "Medium-High" : score >= 4 ? "Moderate" : "Low Impact";
  const scoreEmoji  = score >= 8 ? "🔴" : score >= 6 ? "🟡" : score >= 4 ? "🔵" : "🟢";

  const Section = ({
    icon, label, value, accent = "#5194F6", highlight = false,
  }: {
    icon: React.ReactNode; label: string; value?: string;
    accent?: string; highlight?: boolean;
  }) => {
    if (!value?.trim()) return null;
    return (
      <div
        className="rounded-xl p-3.5"
        style={{
          background: highlight
            ? (isLight ? `rgba(${hexToRgb(accent)},0.06)` : `rgba(${hexToRgb(accent)},0.07)`)
            : cardBg,
          border: highlight ? `1px solid rgba(${hexToRgb(accent)},0.22)` : cardBorder,
        }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `rgba(${hexToRgb(accent)},0.15)`, color: accent }}>
            {icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent }}>
            {label}
          </span>
        </div>
        <p className="text-sm leading-relaxed pl-8" style={{ color: bodyText }}>{value}</p>
      </div>
    );
  };

  const StocksSection = ({ value }: { value?: string }) => {
    if (!value?.trim()) return null;
    const stocks = value.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
    return (
      <div className="rounded-xl p-3.5" style={{ background: cardBg, border: cardBorder }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(99,102,241,0.15)", color: "#6366f1" }}>
            <Building2 className="w-3 h-3" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#6366f1" }}>
            Stocks Impacted
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 pl-8">
          {stocks.map((s, i) => (
            <span key={i} className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{
                background: isLight ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.22)",
                color: isLight ? "#4f46e5" : "rgba(165,163,255,1)",
              }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const ImpactScoreCard = ({ score }: { score: number }) => (
    <div className="rounded-xl p-3.5"
      style={{
        background: isLight ? `rgba(${hexToRgb(scoreColor)},0.05)` : `rgba(${hexToRgb(scoreColor)},0.07)`,
        border: `1px solid rgba(${hexToRgb(scoreColor)},0.22)`,
      }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: `rgba(${hexToRgb(scoreColor)},0.18)`, color: scoreColor }}>
            <Zap className="w-3 h-3" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: scoreColor }}>
            Impact Score
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold" style={{ color: scoreColor }}>{score}</span>
          <span className="text-xs" style={{ color: labelColor }}>/10</span>
        </div>
      </div>
      <div className="w-full h-2 rounded-full mb-2"
        style={{ background: isLight ? "rgba(13,37,64,0.08)" : "rgba(255,255,255,0.08)" }}>
        <div className="h-2 rounded-full transition-all duration-700"
          style={{
            width: `${score * 10}%`,
            background: `linear-gradient(90deg,${scoreColor}88,${scoreColor})`,
            boxShadow: `0 0 8px ${scoreColor}55`,
          }} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: scoreColor }}>
          {scoreEmoji} {scoreLabel}
        </span>
        <span className="text-[10px]" style={{ color: labelColor }}>
          How strongly the news affects the market
        </span>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col"
        style={{ background: modalBg, border: modalBorder, boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: blueTopLine }} />

        {/* ═══ LOADING ═══ */}
        {showLoading ? (
          <>
            <div className="sticky top-0 z-10 p-5 flex-shrink-0" style={{ background: headerBg, borderBottom: headerBorder }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-6 w-24 rounded-full animate-pulse" style={{ background: skeleton }} />
                    <div className="h-6 w-28 rounded-full animate-pulse" style={{ background: skeleton }} />
                  </div>
                  <div className="h-7 w-3/4 rounded-lg animate-pulse" style={{ background: skeleton }} />
                  <div className="h-4 w-1/2 rounded animate-pulse" style={{ background: skeleton }} />
                </div>
                <button onClick={onClose} className="p-2 rounded-full" style={{ background: closeBg, color: closeColor }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: skeleton }} />
              ))}
            </div>
          </>
        ) : insight ? (
          <>
            {/* ═══ HEADER — sab ko dikhta hai (title, sentiment, meta) ═══ */}
            <div className="sticky top-0 z-10 p-5 flex-shrink-0" style={{ background: headerBg, borderBottom: headerBorder }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                      style={{ color: ss.color, background: ss.bg, border: `1px solid ${ss.border}` }}>
                      {sentimentIcon()}{insight.sentiment}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: isLight ? "rgba(13,37,64,0.06)" : "rgba(81,148,246,0.08)",
                        border: isLight ? "1px solid rgba(13,37,64,0.10)" : "1px solid rgba(81,148,246,0.18)",
                        color: isLight ? "rgba(13,37,64,0.7)" : "rgba(129,174,249,1)",
                      }}>
                      {insight.category}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold leading-tight mb-2.5" style={{ color: titleColor }}>
                    {insight.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: metaColor }}>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#5194F6]/50" /><span>{insight.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-[#5194F6]/50" /><span>{insight.views?.toLocaleString() || 0} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#5194F6]/50" /><span>{formatDate(insight.publishedAt)}</span>
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="flex-shrink-0 p-2 rounded-full hover:opacity-80 transition-colors"
                  style={{ background: closeBg, color: closeColor }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ═══ BODY ═══ */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">

              {structured ? (
                <>
                  {/*
                    ── STRATEGY: Teaser + Gate ──────────────────────────────
                    Summary aur Market Significance FREE mein dikhao —
                    baaki sab subscriber-only.
                    Is se user ko value milti hai + subscribe karne ka reason.
                  */}

                  {/* ✅ FREE — ye sab ko dikhta hai */}
                  <Section
                    icon={<BarChart2 className="w-3 h-3" />}
                    label="Summary"
                    value={structured.summary}
                    accent="#5194F6"
                    highlight
                  />
                  <Section
                    icon={<TrendingUp className="w-3 h-3" />}
                    label="Market Significance"
                    value={structured.marketSignificance}
                    accent="#10b981"
                    highlight
                  />

                  {/* 🔒 LOCKED — sirf subscribers ko dikhta hai */}
                  {/*
                    mode="blur"   → Sections blurred dikhte hain, shape visible
                    mode="hidden" → Ek placeholder card aata hai
                    mode="overlay"→ Cards dikhte hain but opaque cover ke neeche

                    Yahan "blur" use kiya — user ko andaaza milta hai kitna content hai
                    aur subscribe karne ka temptation badta hai
                  */}
                  <RequireSubscription
                    mode="blur"
                    title="Full Analysis Locked"
                    description="Subscribe to unlock impact area, stock picks, short & long term views, key risks, and impact score."
                    ctaText="Unlock Full Analysis"
                    ctaHref="/pricing"
                  >
                    {/* Ye sab blur ke andar — shape dikhti hai, text nahi */}
                    <div className="space-y-2.5">
                      <Section
                        icon={<Building2 className="w-3 h-3" />}
                        label="Impact Area"
                        value={structured.impactArea}
                        accent="#f59e0b"
                      />
                      <StocksSection value={structured.stocksImpacted} />
                      <Section
                        icon={<LineChart className="w-3 h-3" />}
                        label="Short-Term View"
                        value={structured.shortTermView}
                        accent="#8b5cf6"
                      />
                      <Section
                        icon={<TrendingUp className="w-3 h-3" />}
                        label="Long-Term View"
                        value={structured.longTermView}
                        accent="#06b6d4"
                      />
                      <Section
                        icon={<ShieldAlert className="w-3 h-3" />}
                        label="Key Risk"
                        value={structured.keyRisk}
                        accent="#ef4444"
                        highlight
                      />
                      {structured.impactScore !== undefined && (
                        <ImpactScoreCard score={structured.impactScore} />
                      )}
                    </div>
                  </RequireSubscription>
                </>
              ) : legacyText ? (
                /* ── Fallback: legacy plain-text insight — poora lock karo ── */
                <RequireSubscription
                  mode="blur"
                  title="Insight Locked"
                  description="Subscribe to read the full InvestBeans analysis."
                  ctaText="Subscribe Now"
                >
                  <div className="rounded-xl p-4" style={{ background: cardBg, border: cardBorder }}>
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: titleColor }}>
                      <span className="w-1 h-4 rounded-full inline-block" style={{ background: "#5194F6" }} />
                      InvestBeans Insight
                    </h3>
                    <p className="leading-relaxed whitespace-pre-wrap text-sm" style={{ color: bodyText }}>
                      {legacyText}
                    </p>
                  </div>
                </RequireSubscription>
              ) : null}

              {/* ── Credits — sab ko dikhta hai ── */}
              <div className="rounded-xl p-3.5 mt-1"
                style={{ background: isLight ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.03)", border: cardBorder }}>
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2" style={{ color: titleColor }}>
                  <span className="w-1 h-3.5 rounded-full inline-block"
                    style={{ background: isLight ? "rgba(13,37,64,0.3)" : "rgba(81,148,246,0.5)" }} />
                  Source & Credits
                </h3>
                <div className="flex flex-wrap items-start gap-x-5 gap-y-2">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider block mb-0.5" style={{ color: labelColor }}>Source</span>
                    <span className="text-xs font-semibold" style={{ color: titleColor }}>{insight.credits.source}</span>
                  </div>
                  {insight.credits.author && (
                    <>
                      <div className="self-stretch w-px" style={{ background: divider }} />
                      <div>
                        <span className="text-[9px] uppercase tracking-wider block mb-0.5" style={{ color: labelColor }}>Author</span>
                        <span className="text-xs" style={{ color: titleColor }}>{insight.credits.author}</span>
                      </div>
                    </>
                  )}
                  {insight.credits.publishedDate && (
                    <>
                      <div className="self-stretch w-px" style={{ background: divider }} />
                      <div>
                        <span className="text-[9px] uppercase tracking-wider block mb-0.5" style={{ color: labelColor }}>Published</span>
                        <span className="text-xs" style={{ color: titleColor }}>{formatDate(insight.credits.publishedDate)}</span>
                      </div>
                    </>
                  )}
                  {insight.credits.url && (
                    <>
                      <div className="self-stretch w-px" style={{ background: divider }} />
                      <div className="flex items-end pb-0.5">
                        <a href={insight.credits.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium hover:opacity-80 transition-opacity"
                          style={{ color: "#5194F6" }}>
                          View Source <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ═══ FOOTER ═══ */}
            <div className="p-4 flex-shrink-0" style={{ background: footerBg, borderTop: footerBorder }}>
              <button onClick={onClose}
                className="w-full h-11 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#5194F6,#3a7de0)", color: "#ffffff" }}>
                Close
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default InsightModal;