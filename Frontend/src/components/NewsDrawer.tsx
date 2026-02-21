import { X, ArrowRight, Clock, Eye, Calendar, BookOpen, TrendingUp, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

interface NewsItem {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  views: number;
  publishedAt: string; // ISO string
  sentiment?: "positive" | "negative" | "neutral";
}

interface NewsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  news: NewsItem[];
  onItemClick?: (item: NewsItem) => void;
  title?: string;
}

const formatTimestamp = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getSentimentDot = (sentiment?: string) => {
  if (sentiment === "positive") return "bg-green-500";
  if (sentiment === "negative") return "bg-red-500";
  return "bg-blue-500";
};

/**
 * NewsDrawer — a bottom slide-up drawer that shows additional news/updates
 * without expanding the home page layout (addresses Point 14).
 *
 * Usage on the home page:
 *   const [drawerOpen, setDrawerOpen] = useState(false);
 *   ...
 *   <Button onClick={() => setDrawerOpen(true)}>Show More</Button>
 *   <NewsDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} news={extraNews} onItemClick={handleClick} />
 */
const NewsDrawer = ({
  isOpen,
  onClose,
  news,
  onItemClick,
  title = "More News & Updates",
}: NewsDrawerProps) => {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      // small delay so CSS transition fires after mount
      requestAnimationFrame(() => setAnimate(true));
    } else {
      setAnimate(false);
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${animate ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-out ${animate ? "translate-y-0" : "translate-y-full"}`}
        style={{ maxHeight: "80vh" }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h2 className="text-base font-bold text-foreground">{title}</h2>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">
              {news.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-gray-100/70 px-1">
          {news.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <BookOpen className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">No additional news right now.</p>
            </div>
          ) : (
            news.map((item) => (
              <button
                key={item._id}
                onClick={() => onItemClick?.(item)}
                className="w-full text-left px-4 py-4 hover:bg-gray-50/80 active:bg-gray-100 transition-colors group"
              >
                {/* Category + sentiment */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getSentimentDot(item.sentiment)}`} />
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {item.category}
                  </span>
                </div>

                {/* Title */}
                <p className="text-sm font-semibold text-foreground leading-snug mb-1.5 group-hover:text-accent transition-colors line-clamp-2">
                  {item.title}
                </p>

                {/* Excerpt */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                  {item.excerpt}
                </p>

                {/* Meta row — timestamp always present (Point 13) */}
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatTimestamp(item.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {item.views.toLocaleString()}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-0.5 text-accent font-semibold">
                    Read
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer close affordance */}
        <div className="flex-shrink-0 p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-semibold text-gray-600"
          >
            <ChevronUp className="w-4 h-4" />
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default NewsDrawer;