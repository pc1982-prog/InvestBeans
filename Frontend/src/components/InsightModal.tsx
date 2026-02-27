import { X, Clock, Eye, Calendar, ExternalLink, Lightbulb, TrendingUp, TrendingDown } from "lucide-react";

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

const MODAL_BG = "linear-gradient(160deg,#0d1e36 0%,#0c1a2e 100%)";
const GOLD_LINE = "linear-gradient(90deg,transparent,rgba(212,168,67,0.55),transparent)";

const InsightModal = ({ isOpen, onClose, insight, loading = false }: InsightModalProps) => {
  if (!isOpen) return null;
  const showLoading = loading && !insight;

  const getSentimentStyle = () => {
    if (!insight) return { color: "#D4A843", bg: "rgba(212,168,67,0.08)", border: "rgba(212,168,67,0.2)" };
    return {
      positive: { color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
      negative: { color: "#fb7185", bg: "rgba(251,113,133,0.08)", border: "rgba(251,113,133,0.2)" },
      neutral: { color: "#D4A843", bg: "rgba(212,168,67,0.08)", border: "rgba(212,168,67,0.2)" },
    }[insight.sentiment];
  };

  const getSentimentIcon = () => {
    if (!insight) return <Eye className="w-4 h-4" />;
    if (insight.sentiment === "positive") return <TrendingUp className="w-4 h-4" />;
    if (insight.sentiment === "negative") return <TrendingDown className="w-4 h-4" />;
    return <Eye className="w-4 h-4" />;
  };

  const formatDate = (s: string) => new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const ss = getSentimentStyle();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col"
        style={{ background: MODAL_BG, border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 25px 60px rgba(0,0,0,0.6)" }}>
        {/* Gold top line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: GOLD_LINE }} />

        {showLoading ? (
          <>
            <div className="sticky top-0 z-10 p-6 flex-shrink-0" style={{ background: "rgba(13,30,54,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex gap-3">
                    <div className="h-7 w-28 rounded-full animate-pulse" style={{ background: "rgba(255,255,255,0.07)" }} />
                    <div className="h-7 w-36 rounded-full animate-pulse" style={{ background: "rgba(255,255,255,0.07)" }} />
                  </div>
                  <div className="h-9 w-3/4 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <div className="h-5 w-1/2 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
                </div>
                <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {[1, 2, 3].map(i => <div key={i} className="h-4 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)", width: `${90 - i * 10}%` }} />)}
              <div className="rounded-xl p-6 mt-4" style={{ background: "rgba(212,168,67,0.04)", border: "1px solid rgba(212,168,67,0.1)" }}>
                {[1, 2, 3].map(i => <div key={i} className="h-4 rounded animate-pulse mb-3" style={{ background: "rgba(212,168,67,0.08)", width: `${95 - i * 8}%` }} />)}
              </div>
            </div>
            <div className="p-4 flex-shrink-0" style={{ background: "rgba(10,22,40,0.98)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="h-12 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
          </>
        ) : insight ? (
          <>
            {/* Header */}
            <div className="sticky top-0 z-10 p-6 flex-shrink-0" style={{ background: "rgba(13,30,54,0.97)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium capitalize"
                      style={{ color: ss.color, background: ss.bg, border: `1px solid ${ss.border}` }}>
                      {getSentimentIcon()}{insight.sentiment}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium text-slate-300"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}>
                      {insight.category}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4">{insight.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                    {[
                      { icon: <Clock className="w-4 h-4 text-[#D4A843]/50" />, text: insight.readTime },
                      { icon: <Eye className="w-4 h-4 text-[#D4A843]/50" />, text: `${insight.views?.toLocaleString() || 0} views` },
                      { icon: <Calendar className="w-4 h-4 text-[#D4A843]/50" />, text: formatDate(insight.publishedAt) },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5">{item.icon}<span>{item.text}</span></div>
                    ))}
                  </div>
                </div>
                <button onClick={onClose} className="flex-shrink-0 p-2 rounded-full text-slate-400 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Overview */}
              <div>
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full inline-block" style={{ background: "#D4A843" }} />Overview
                </h3>
                <p className="text-slate-400 leading-relaxed whitespace-pre-wrap text-sm md:text-base">{insight.description}</p>
              </div>

              {/* InvestBeans Insight */}
              <div className="rounded-xl p-6" style={{ background: "rgba(212,168,67,0.05)", border: "1px solid rgba(212,168,67,0.15)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ background: "linear-gradient(135deg,#D4A843,#C4941E)" }}>
                    <Lightbulb className="w-5 h-5 text-[#0c1a2e]" />
                  </div>
                  <h3 className="text-base font-bold text-white">InvestBeans Insight</h3>
                </div>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base">{insight.investBeansInsight}</p>
              </div>

              {/* Credits */}
              <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-slate-500 inline-block" />Source & Credits
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Source</span>
                    <p className="text-slate-200 font-medium mt-0.5">{insight.credits.source}</p>
                  </div>
                  {insight.credits.author && (
                    <div>
                      <span className="text-xs text-slate-500 uppercase tracking-wider">Author</span>
                      <p className="text-slate-300 mt-0.5">{insight.credits.author}</p>
                    </div>
                  )}
                  {insight.credits.publishedDate && (
                    <div>
                      <span className="text-xs text-slate-500 uppercase tracking-wider">Published</span>
                      <p className="text-slate-300 mt-0.5">{formatDate(insight.credits.publishedDate)}</p>
                    </div>
                  )}
                  {insight.credits.url && (
                    <a href={insight.credits.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-medium transition-colors text-sm mt-1"
                      style={{ color: "#D4A843" }}>
                      View Original Source <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 flex-shrink-0" style={{ background: "rgba(10,22,40,0.98)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={onClose}
                className="w-full h-12 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#D4A843,#C4941E)", color: "#0c1a2e" }}>
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