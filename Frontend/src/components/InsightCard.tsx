import { TrendingUp, TrendingDown, Clock, Eye, ArrowRight } from "lucide-react";

interface InsightCardProps {
  title: string;
  description: string;
  sentiment?: "positive" | "negative" | "neutral";
  readTime?: string;
  views?: number;
  category?: string;
}

const InsightCard = ({ 
  title, 
  description, 
  sentiment = "neutral", 
  readTime = "3 min read",
  views = 1250,
  category = "Market Analysis"
}: InsightCardProps) => {
  const getSentimentColor = () => {
    switch (sentiment) {
      case "positive": return "from-green-500/10 to-emerald-500/5 border-green-200/50";
      case "negative": return "from-red-500/10 to-rose-500/5 border-red-200/50";
      default: return "from-blue-500/10 to-indigo-500/5 border-blue-200/50";
    }
  };

  const getSentimentIcon = () => {
    switch (sentiment) {
      case "positive": return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "negative": return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Eye className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${getSentimentColor()} border backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] animate-slide-up active:scale-[0.98] touch-manipulation`}>
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
            <span className="text-xs font-medium text-foreground/60 capitalize">{sentiment}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight group-hover:text-accent transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-2 text-sm md:text-base">
          {description}
        </p>

        {/* Footer with stats and CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{views.toLocaleString()}</span>
            </div>
          </div>
          
          <button className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent to-accent/80 text-white font-semibold hover:from-accent/90 hover:to-accent/70 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 touch-manipulation text-sm sm:text-base w-full sm:w-auto justify-center">
            <span>Read More</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-lg group-hover:scale-125 transition-transform duration-500"></div>
    </div>
  );
};

export default InsightCard;