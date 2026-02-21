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
    publishedAt?: string; // ← NEW: ISO timestamp
    readTime?: string;    // ← NEW: optional read time
  };
  isAdmin?: boolean;
  onReadMore: (id: string) => void;
  onLike?: (id: string) => Promise<void>;
  onEdit?: (insight: unknown) => void;
  onDelete?: (id: string) => void;
}

const InsightCard = ({
  insight,
  isAdmin = false,
  onReadMore,
  onLike,
  onEdit,
  onDelete,
}: InsightCardProps) => {
  const {
    _id,
    title,
    description,
    sentiment = "neutral",
    views = 0,
    likes = 0,
    isLiked = false,
    category = "Market Analysis",
    publishedAt,
    readTime,
  } = insight;

  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    setLiked(isLiked);
    setLikeCount(likes);
  }, [isLiked, likes]);

  const getSentimentColor = () => {
    switch (sentiment) {
      case "positive":
        return "from-green-500/10 to-emerald-500/5 border-green-200/50";
      case "negative":
        return "from-red-500/10 to-rose-500/5 border-red-200/50";
      default:
        return "from-blue-500/10 to-indigo-500/5 border-blue-200/50";
    }
  };

  const getSentimentIcon = () => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "negative":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Eye className="w-4 h-4 text-blue-600" />;
    }
  };

  // Format timestamp: "Jan 15, 2025 · 10:30 AM"
  const formatTimestamp = (iso: string) => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const datePart = d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const timePart = d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${datePart} · ${timePart}`;
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onLike || isLiking) return;

    setIsLiking(true);
    const previousLiked = liked;
    const previousCount = likeCount;

    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    try {
      await onLike(_id);
    } catch (error) {
      setLiked(previousLiked);
      setLikeCount(previousCount);
      console.error("Failed to like insight:", error);
      alert("Failed to update like. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${getSentimentColor()} border backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] animate-slide-up active:scale-[0.98] touch-manipulation`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        {/* Header with category and sentiment */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-foreground/80 backdrop-blur-sm">
            {category}
          </span>
          <div className="flex items-center gap-2">
            {getSentimentIcon()}
            <span className="text-xs font-medium text-foreground/60 capitalize">
              {sentiment}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight line-clamp-1 group-hover:text-accent transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2 text-sm md:text-base">
          {description}
        </p>

        {/* ── TIMESTAMP ROW ── shown on every card */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-5">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span>
              {publishedAt ? formatTimestamp(publishedAt) : "Date not available"}
            </span>
          </div>
          {readTime && (
            <>
              <span className="opacity-40">·</span>
              <span>{readTime}</span>
            </>
          )}
        </div>

        {/* Footer with stats and CTA */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{views.toLocaleString()} views</span>
            </div>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${
                liked ? "text-blue-600" : "hover:text-blue-600"
              }`}
            >
              <ThumbsUp
                className={`w-3 h-3 sm:w-4 sm:h-4 ${liked ? "fill-current" : ""}`}
              />
              <span>{likeCount.toLocaleString()} likes</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onReadMore(_id)}
              className="group/btn flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent to-accent/80 text-white font-semibold hover:from-accent/90 hover:to-accent/70 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 touch-manipulation text-sm sm:text-base"
            >
              <span>View Details</span>
            </button>

            {/* Admin Actions */}
            {isAdmin && onEdit && onDelete && (
              <>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(insight);
                  }}
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Are you sure you want to delete this insight?")) {
                      onDelete(_id);
                    }
                  }}
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-lg group-hover:scale-125 transition-transform duration-500"></div>
    </div>
  );
};

export default InsightCard;