import { TrendingUp, TrendingDown, Eye, Edit, Trash2, ThumbsUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTheme } from "@/controllers/Themecontext";

interface InsightCardProps {
  insight: {
    _id: string;
    title: string;
    description: string;
    sentiment?: "positive" | "negative" | "neutral";
    views?: number;
    likes?: number;
    isLiked?: boolean;
    category?: string;
    publishedAt?: string;
    readTime?: string;
  };
  isAdmin?: boolean;
  onReadMore: (id: string) => void;
  onLike?: (id: string) => Promise<void>;
  onEdit?: (insight: unknown) => void;
  onDelete?: (id: string) => void;
}

const InsightCard = ({ insight, isAdmin = false, onReadMore, onLike, onEdit, onDelete }: InsightCardProps) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const {
    _id, title, description,
    sentiment = "neutral",
    views = 0, likes = 0,
    isLiked = false,
    category = "Market Analysis",
    publishedAt, readTime,
  } = insight;

  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => { setLiked(isLiked); setLikeCount(likes); }, [isLiked, likes]);

  const getSentimentStyle = () => {
    switch (sentiment) {
      case "positive":
        return {
          borderAccent: "rgba(52,211,153,0.25)",
          badge: { color: "#16a34a", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" },
          icon: <TrendingUp className="w-3.5 h-3.5" />,
        };
      case "negative":
        return {
          borderAccent: "rgba(251,113,133,0.25)",
          badge: { color: "#dc2626", background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.25)" },
          icon: <TrendingDown className="w-3.5 h-3.5" />,
        };
      default:
        return {
          borderAccent: "rgba(212,168,67,0.22)",
          badge: { color: "#D4A843", background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.22)" },
          icon: <Eye className="w-3.5 h-3.5" />,
        };
    }
  };

  const s = getSentimentStyle();

  const cardBg = isLight
    ? "linear-gradient(145deg,rgba(255,255,255,0.92) 0%,rgba(237,245,254,0.97) 100%)"
    : "linear-gradient(145deg,rgba(15,32,64,0.95) 0%,rgba(12,26,46,0.98) 100%)";

  const cardBorder = `1px solid ${s.borderAccent}`;
  const cardShadow = isLight ? "0 4px 20px rgba(13,37,64,0.08)" : "0 4px 24px rgba(0,0,0,0.3)";
  const hoverGlow = isLight
    ? "radial-gradient(ellipse at top right,rgba(212,168,67,0.07) 0%,transparent 60%)"
    : "radial-gradient(ellipse at top right,rgba(212,168,67,0.05) 0%,transparent 60%)";

  const categoryBg = isLight ? "rgba(13,37,64,0.06)" : "rgba(255,255,255,0.06)";
  const categoryBorder = isLight ? "1px solid rgba(13,37,64,0.1)" : "1px solid rgba(255,255,255,0.09)";
  const categoryColor = isLight ? "rgba(13,37,64,0.7)" : "rgba(203,213,225,1)";
  const titleColor = isLight ? "#0d1b2a" : "white";
  // ✅ Description: 2-line clamp with ellipsis (overflow hidden + webkit clamp for cross-browser)
  const descColor = isLight ? "rgba(13,37,64,0.6)" : "rgba(148,163,184,1)";
  const dividerColor = isLight ? "rgba(13,37,64,0.07)" : "rgba(255,255,255,0.05)";
  const metaColor = isLight ? "rgba(13,37,64,0.45)" : "rgba(100,116,139,1)";
  const statsColor = isLight ? "rgba(13,37,64,0.5)" : "rgba(100,116,139,1)";
  const likedColor = "#D4A843";

  const formatTimestamp = (iso: string) => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return `${d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onLike || isLiking) return;
    setIsLiking(true);
    const prev = { liked, likeCount };
    setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    try { await onLike(_id); }
    catch { setLiked(prev.liked); setLikeCount(prev.likeCount); alert("Failed to update like. Please try again."); }
    finally { setIsLiking(false); }
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl animate-slide-up active:scale-[0.98]"
      style={{ background: cardBg, border: cardBorder, boxShadow: cardShadow }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: hoverGlow }}
      />

      <div className="relative z-10 p-6 md:p-7">

        {/* ── Header row: category + sentiment ── */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: categoryBg, border: categoryBorder, color: categoryColor }}
          >
            {category}
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize"
            style={s.badge}
          >
            {s.icon}{sentiment}
          </span>
        </div>

        {/* ── Title ── */}
        <h3
          className="text-lg md:text-xl font-bold mb-3 leading-snug line-clamp-1 transition-colors duration-300 group-hover:text-[#D4A843]"
          style={{ color: titleColor }}
        >
          {title}
        </h3>

        {/* ── Description — strictly 2 lines with trailing ellipsis ── */}
        <p
          className="mb-4 leading-relaxed text-sm"
          style={{
            color: descColor,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </p>

        {/* ── Timestamp row ── */}
        <div
          className="flex items-center gap-3 text-[11px] mb-5 pt-3"
          style={{ borderTop: `1px solid ${dividerColor}`, color: metaColor }}
        >
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#D4A843]/50" />
            <span>{publishedAt ? formatTimestamp(publishedAt) : "Date not available"}</span>
          </div>
          {readTime && (
            <>
              <span className="opacity-40">·</span>
              <span>{readTime}</span>
            </>
          )}
        </div>

        {/* ── Footer: stats + actions ── */}
        <div className="flex flex-col gap-3">
          {/* Views & Likes */}
          <div className="flex items-center gap-4 text-xs" style={{ color: statsColor }}>
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>{views.toLocaleString()} views</span>
            </div>
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 transition-colors hover:opacity-80"
              style={{ color: liked ? likedColor : statsColor }}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
              <span>{likeCount.toLocaleString()} likes</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onReadMore(_id)}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:opacity-90 hover:shadow-lg active:scale-95"
              style={{ background: "linear-gradient(135deg,#D4A843,#C4941E)", color: "#0c1a2e" }}
            >
              View Details
            </button>

            {isAdmin && onEdit && onDelete && (
              <>
                <Button
                  onClick={(e) => { e.stopPropagation(); onEdit(insight); }}
                  variant="outline"
                  size="icon"
                  className={`flex-shrink-0 ${isLight
                    ? "border-navy/10 bg-white/60 text-navy/50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                    : "border-white/10 bg-white/4 text-slate-400 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/25"
                  }`}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Delete this insight?")) onDelete(_id);
                  }}
                  variant="outline"
                  size="icon"
                  className={`flex-shrink-0 ${isLight
                    ? "border-navy/10 bg-white/60 text-navy/50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300"
                    : "border-white/10 bg-white/4 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/25"
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;