import { TrendingUp, TrendingDown, Eye, Edit, Trash2, ThumbsUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

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
  const { _id, title, description, sentiment = "neutral", views = 0, likes = 0,
    isLiked = false, category = "Market Analysis", publishedAt, readTime } = insight;

  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => { setLiked(isLiked); setLikeCount(likes); }, [isLiked, likes]);

  const getSentimentStyle = () => {
    switch (sentiment) {
      case "positive": return { border: "rgba(52,211,153,0.2)", badge: { color: "#34d399", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)" }, icon: <TrendingUp className="w-3.5 h-3.5" /> };
      case "negative": return { border: "rgba(251,113,133,0.2)", badge: { color: "#fb7185", background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.18)" }, icon: <TrendingDown className="w-3.5 h-3.5" /> };
      default: return { border: "rgba(212,168,67,0.18)", badge: { color: "#D4A843", background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.18)" }, icon: <Eye className="w-3.5 h-3.5" /> };
    }
  };

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
    try { await onLike(_id); } catch { setLiked(prev.liked); setLikeCount(prev.likeCount); alert("Failed to update like. Please try again."); }
    finally { setIsLiking(false); }
  };

  const s = getSentimentStyle();

  return (
    <div
      className="group relative overflow-hidden rounded-2xl transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl animate-slide-up active:scale-[0.98]"
      style={{
        background: "linear-gradient(145deg,rgba(15,32,64,0.95) 0%,rgba(12,26,46,0.98) 100%)",
        border: `1px solid ${s.border}`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Subtle hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: "radial-gradient(ellipse at top right,rgba(212,168,67,0.05) 0%,transparent 60%)" }} />

      <div className="relative z-10 p-6 md:p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-slate-300"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}>
            {category}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize" style={s.badge}>
            {s.icon}{sentiment}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-white mb-3 leading-snug line-clamp-1 group-hover:text-[#D4A843] transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 mb-4 leading-relaxed line-clamp-2 text-sm">{description}</p>

        {/* Timestamp */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-5 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#D4A843]/50" />
            <span>{publishedAt ? formatTimestamp(publishedAt) : "Date not available"}</span>
          </div>
          {readTime && <><span className="opacity-40">·</span><span>{readTime}</span></>}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /><span>{views.toLocaleString()} views</span>
            </div>
            <button onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${liked ? "text-[#D4A843]" : "hover:text-[#D4A843]"}`}>
              <ThumbsUp className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
              <span>{likeCount.toLocaleString()} likes</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button onClick={() => onReadMore(_id)}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:opacity-90 hover:shadow-lg active:scale-95"
              style={{ background: "linear-gradient(135deg,#D4A843,#C4941E)", color: "#0c1a2e" }}>
              View Details
            </button>
            {isAdmin && onEdit && onDelete && (
              <>
                <Button onClick={(e) => { e.stopPropagation(); onEdit(insight); }} variant="outline" size="icon"
                  className="flex-shrink-0 border-white/10 bg-white/4 text-slate-400 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/25">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button onClick={(e) => { e.stopPropagation(); if (window.confirm("Delete this insight?")) onDelete(_id); }}
                  variant="outline" size="icon"
                  className="flex-shrink-0 border-white/10 bg-white/4 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/25">
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