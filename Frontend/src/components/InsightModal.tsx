import { X, Clock, Eye, Calendar, ExternalLink, Lightbulb, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: {
    _id: string;
    title: string;
    description: string;
    investBeansInsight: string;
    credits: {
      source: string;
      author?: string;
      url?: string;
      publishedDate?: string;
    };
    sentiment: "positive" | "negative" | "neutral";
    category: string;
    readTime: string;
    views: number;
    likes?: number;
    publishedAt: string;
  } | null;
  loading?: boolean;
}

const InsightModal = ({ isOpen, onClose, insight, loading = false }: InsightModalProps) => {
  if (!isOpen) return null;

  const showLoading = loading && !insight;
  
  const getSentimentColor = () => {
    if (!insight) return "text-blue-600 bg-blue-50";
    switch (insight.sentiment) {
      case "positive": return "text-green-600 bg-green-50";
      case "negative": return "text-red-600 bg-red-50";
      default: return "text-blue-600 bg-blue-50";
    }
  };

  const getSentimentIcon = () => {
    if (!insight) return <Eye className="w-5 h-5" />;
    switch (insight.sentiment) {
      case "positive": return <TrendingUp className="w-5 h-5" />;
      case "negative": return <TrendingDown className="w-5 h-5" />;
      default: return <Eye className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col">
        {showLoading ? (
          /* Loading State */
          <>
            <div className="sticky top-0 z-10 bg-gradient-to-r from-accent to-accent/80 text-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-24 bg-white/20 rounded-full animate-pulse"></div>
                    <div className="h-6 w-32 bg-white/20 rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-8 w-3/4 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-6 w-1/2 bg-white/20 rounded animate-pulse"></div>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-3">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200/50 space-y-3">
                <div className="h-6 w-48 bg-orange-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-orange-200 rounded animate-pulse"></div>
                <div className="h-4 w-4/5 bg-orange-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-orange-200 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          </>
        ) : insight ? (
          <>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-accent to-accent/80 text-white p-6 flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor()}`}>
                      {getSentimentIcon()}
                      {insight.sentiment}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium">
                      {insight.category}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
                    {insight.title}
                  </h2>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{insight.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{insight.views?.toLocaleString() || 0} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(insight.publishedAt)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Overview</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {insight.description}
                </p>
              </div>

              {/* InvestBeans Insight */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200/50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    InvestBeans Insight
                  </h3>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {insight.investBeansInsight}
                  </p>
                </div>
              </div>

              {/* Credits */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Source & Credits
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Source:</span>
                    <p className="text-foreground font-medium">{insight.credits.source}</p>
                  </div>
                  
                  {insight.credits.author && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Author:</span>
                      <p className="text-foreground">{insight.credits.author}</p>
                    </div>
                  )}

                  {insight.credits.publishedDate && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Published:</span>
                      <p className="text-foreground">
                        {formatDate(insight.credits.publishedDate)}
                      </p>
                    </div>
                  )}

                  {insight.credits.url && (
                    <div>
                      <a
                        href={insight.credits.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        <span>View Original Source</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex-shrink-0">
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-semibold"
              >
                Close
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default InsightModal;