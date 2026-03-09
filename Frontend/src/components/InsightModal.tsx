import { X, Clock, Eye, Calendar, ExternalLink, Lightbulb, TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "@/controllers/Themecontext";

interface InsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: {
    _id: string; title: string; description: string; investBeansInsight: string;
    credits: { source: string; author?: string; url?: string; publishedDate?: string };
    sentiment: "positive" | "negative" | "neutral";
    category: string; readTime: string; views: number; likes?: number; publishedAt: string;
  } | null;
  loading?: boolean;
}

const InsightModal = ({ isOpen, onClose, insight, loading = false }: InsightModalProps) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (!isOpen) return null;
  const showLoading = loading && !insight;

  // ── Theme tokens ─────────────────────────────────────────────────────────
  const backdropBg = "rgba(0,0,0,0.6)";
  const modalBg = isLight
    ? "linear-gradient(160deg,#f0f7fe 0%,#e8f2fd 100%)"
    : "linear-gradient(160deg,#0d1e36 0%,#0c1a2e 100%)";
  const modalBorder = isLight ? "1px solid rgba(13,37,64,0.12)" : "1px solid rgba(255,255,255,0.08)";
  const goldTopLine = "linear-gradient(90deg,transparent,rgba(212,168,67,0.55),transparent)";

  const headerBg = isLight ? "rgba(232,242,253,0.97)" : "rgba(13,30,54,0.97)";
  const headerBorder = isLight ? "1px solid rgba(13,37,64,0.08)" : "1px solid rgba(255,255,255,0.07)";
  const titleColor = isLight ? "#0d1b2a" : "white";
  const metaColor = isLight ? "rgba(13,37,64,0.5)" : "rgba(148,163,184,1)";
  const closeBtnBg = isLight ? "rgba(13,37,64,0.06)" : "rgba(255,255,255,0.05)";
  const closeBtnColor = isLight ? "rgba(13,37,64,0.45)" : "rgba(148,163,184,1)";
  const sectionBarColor = "#D4A843";
  const overviewTextColor = isLight ? "rgba(13,37,64,0.65)" : "rgba(148,163,184,1)";
  const insightBlockBg = isLight ? "rgba(212,168,67,0.07)" : "rgba(212,168,67,0.05)";
  const insightBlockBorder = isLight ? "1px solid rgba(212,168,67,0.2)" : "1px solid rgba(212,168,67,0.15)";
  const insightBodyColor = isLight ? "rgba(13,37,64,0.75)" : "rgba(203,213,225,1)";

  // Credits block
  const creditBlockBg = isLight ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.02)";
  const creditBlockBorder = isLight ? "1px solid rgba(13,37,64,0.09)" : "1px solid rgba(255,255,255,0.07)";
  const creditLabelColor = isLight ? "rgba(13,37,64,0.4)" : "rgba(100,116,139,1)";
  const creditValueColor = isLight ? "#0d1b2a" : "rgba(226,232,240,1)";
  const dividerColor = isLight ? "rgba(13,37,64,0.07)" : "rgba(255,255,255,0.06)";

  const footerBg = isLight ? "rgba(232,242,253,0.98)" : "rgba(10,22,40,0.98)";
  const footerBorder = isLight ? "1px solid rgba(13,37,64,0.08)" : "1px solid rgba(255,255,255,0.06)";
  const skeletonBase = isLight ? "rgba(13,37,64,0.06)" : "rgba(255,255,255,0.07)";
  const skeletonGold = isLight ? "rgba(212,168,67,0.1)" : "rgba(212,168,67,0.08)";

  // ── Sentiment ────────────────────────────────────────────────────────────
  const getSentimentStyle = () => {
    if (!insight) return { color: "#D4A843", bg: "rgba(212,168,67,0.08)", border: "rgba(212,168,67,0.2)" };
    return {
      positive: { color: "#16a34a", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)" },
      negative: { color: "#dc2626", bg: "rgba(251,113,133,0.1)", border: "rgba(251,113,133,0.25)" },
      neutral:  { color: "#D4A843", bg: "rgba(212,168,67,0.08)", border: "rgba(212,168,67,0.2)" },
    }[insight.sentiment];
  };

  const getSentimentIcon = () => {
    if (!insight) return <Eye className="w-4 h-4" />;
    if (insight.sentiment === "positive") return <TrendingUp className="w-4 h-4" />;
    if (insight.sentiment === "negative") return <TrendingDown className="w-4 h-4" />;
    return <Eye className="w-4 h-4" />;
  };

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const ss = getSentimentStyle();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: backdropBg, backdropFilter: "blur(8px)" }}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col"
        style={{ background: modalBg, border: modalBorder, boxShadow: "0 25px 60px rgba(0,0,0,0.4)" }}
      >
        {/* Gold top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: goldTopLine }} />

        {/* ═══════════════ LOADING SKELETON ═══════════════ */}
        {showLoading ? (
          <>
            <div className="sticky top-0 z-10 p-6 flex-shrink-0" style={{ background: headerBg, borderBottom: headerBorder }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex gap-3">
                    <div className="h-7 w-28 rounded-full animate-pulse" style={{ background: skeletonBase }} />
                    <div className="h-7 w-36 rounded-full animate-pulse" style={{ background: skeletonBase }} />
                  </div>
                  <div className="h-9 w-3/4 rounded-lg animate-pulse" style={{ background: skeletonBase }} />
                  <div className="h-5 w-1/2 rounded animate-pulse" style={{ background: skeletonBase }} />
                </div>
                <button onClick={onClose} className="p-2 rounded-full" style={{ background: closeBtnBg, color: closeBtnColor }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-4 rounded animate-pulse" style={{ background: skeletonBase, width: `${90 - i * 10}%` }} />
              ))}
              <div className="rounded-xl p-6 mt-4" style={{ background: skeletonGold, border: `1px solid ${skeletonGold}` }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-4 rounded animate-pulse mb-3" style={{ background: skeletonGold, width: `${95 - i * 8}%` }} />
                ))}
              </div>
            </div>
            <div className="p-4 flex-shrink-0" style={{ background: footerBg, borderTop: footerBorder }}>
              <div className="h-12 rounded-xl animate-pulse" style={{ background: skeletonBase }} />
            </div>
          </>
        ) : insight ? (
          <>
            {/* ═══════════════ HEADER ═══════════════ */}
            <div className="sticky top-0 z-10 p-6 flex-shrink-0" style={{ background: headerBg, borderBottom: headerBorder }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium capitalize"
                      style={{ color: ss.color, background: ss.bg, border: `1px solid ${ss.border}` }}
                    >
                      {getSentimentIcon()}{insight.sentiment}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        background: isLight ? "rgba(13,37,64,0.06)" : "rgba(255,255,255,0.06)",
                        border: isLight ? "1px solid rgba(13,37,64,0.1)" : "1px solid rgba(255,255,255,0.09)",
                        color: isLight ? "rgba(13,37,64,0.7)" : "rgba(203,213,225,1)",
                      }}
                    >
                      {insight.category}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-4" style={{ color: titleColor }}>
                    {insight.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: metaColor }}>
                    {[
                      { icon: <Clock className="w-4 h-4 text-[#D4A843]/50" />, text: insight.readTime },
                      { icon: <Eye className="w-4 h-4 text-[#D4A843]/50" />, text: `${insight.views?.toLocaleString() || 0} views` },
                      { icon: <Calendar className="w-4 h-4 text-[#D4A843]/50" />, text: formatDate(insight.publishedAt) },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5">{item.icon}<span>{item.text}</span></div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-2 rounded-full transition-colors hover:opacity-80"
                  style={{ background: closeBtnBg, color: closeBtnColor }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ═══════════════ BODY ═══════════════ */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">

              {/* Overview */}
              <div>
                <h3 className="text-base font-semibold mb-2 flex items-center gap-2" style={{ color: titleColor }}>
                  <span className="w-1 h-4 rounded-full inline-block" style={{ background: sectionBarColor }} />
                  Overview
                </h3>
                <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base" style={{ color: overviewTextColor }}>
                  {insight.description}
                </p>
              </div>

              {/* InvestBeans Insight */}
              <div className="rounded-xl p-4" style={{ background: insightBlockBg, border: insightBlockBorder }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-1.5 rounded-lg" style={{ background: "linear-gradient(135deg,#D4A843,#C4941E)" }}>
                    <Lightbulb className="w-4 h-4 text-[#0c1a2e]" />
                  </div>
                  <h3 className="text-sm font-bold" style={{ color: titleColor }}>InvestBeans Insight</h3>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap text-sm" style={{ color: insightBodyColor }}>
                  {insight.investBeansInsight}
                </p>
              </div>

              {/* ✅ Compact Credits — all fields in one row */}
              <div className="rounded-xl p-4" style={{ background: creditBlockBg, border: creditBlockBorder }}>
                <h3 className="text-xs font-semibold mb-3 flex items-center gap-2" style={{ color: titleColor }}>
                  <span className="w-1 h-3.5 rounded-full inline-block"
                    style={{ background: isLight ? "rgba(13,37,64,0.3)" : "rgba(100,116,139,1)" }} />
                  Source & Credits
                </h3>

                {/* One row: Source | Author | Published */}
                <div className="flex flex-wrap items-start gap-x-6 gap-y-2">
                  {/* Source */}
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider block mb-0.5" style={{ color: creditLabelColor }}>Source</span>
                    <span className="text-sm font-semibold" style={{ color: creditValueColor }}>{insight.credits.source}</span>
                  </div>

                  {/* Divider */}
                  {insight.credits.author && (
                    <>
                      <div className="self-stretch w-px mt-1" style={{ background: dividerColor }} />
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase tracking-wider block mb-0.5" style={{ color: creditLabelColor }}>Author</span>
                        <span className="text-sm" style={{ color: creditValueColor }}>{insight.credits.author}</span>
                      </div>
                    </>
                  )}

                  {/* Divider */}
                  {insight.credits.publishedDate && (
                    <>
                      <div className="self-stretch w-px mt-1" style={{ background: dividerColor }} />
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase tracking-wider block mb-0.5" style={{ color: creditLabelColor }}>Published</span>
                        <span className="text-sm" style={{ color: creditValueColor }}>{formatDate(insight.credits.publishedDate)}</span>
                      </div>
                    </>
                  )}

                  {/* View Source link — inline at the end */}
                  {insight.credits.url && (
                    <>
                      <div className="self-stretch w-px mt-1" style={{ background: dividerColor }} />
                      <div className="min-w-0 flex items-end pb-0.5">
                        <a
                          href={insight.credits.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
                          style={{ color: "#D4A843" }}
                        >
                          View Source <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ═══════════════ FOOTER ═══════════════ */}
            <div className="p-4 flex-shrink-0" style={{ background: footerBg, borderTop: footerBorder }}>
              <button
                onClick={onClose}
                className="w-full h-12 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#D4A843,#C4941E)", color: "#0c1a2e" }}
              >
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