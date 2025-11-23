import { TrendingUp, Globe, BarChart3, ArrowRight, Clock, Eye, BookOpen } from "lucide-react";

interface DeepDiveCardProps {
  title: string;
  date: string;
  icon: "chart" | "globe";
  readTime?: string;
  views?: number;
  category?: string;
  excerpt?: string;
}

const DeepDiveCard = ({ 
  title, 
  date, 
  icon, 
  readTime = "8 min read",
  views = 3456,
  category = "Market Analysis",
  excerpt = "In-depth analysis of market trends and their implications for investors."
}: DeepDiveCardProps) => {
  const Icon = icon === "chart" ? BarChart3 : Globe;
  
  const getIconGradient = () => {
    return icon === "chart" 
      ? "from-blue-500 to-indigo-600" 
      : "from-emerald-500 to-teal-600";
  };

  const getCategoryColor = () => {
    return icon === "chart"
      ? "from-blue-500/10 to-indigo-500/5 border-blue-200/50"
      : "from-emerald-500/10 to-teal-500/5 border-emerald-200/50";
  };
  
  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fade-in hover:-translate-y-1 hover:scale-[1.02] touch-manipulation active:scale-[0.98]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative z-10 p-6 md:p-8">
        {/* Header with category and icon */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${getIconGradient()} shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor()} backdrop-blur-sm`}>
                {category}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{readTime}</span>
          </div>
        </div>

        {/* Title and excerpt */}
        <div className="mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors leading-tight">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        </div>

        {/* Footer with stats and CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="text-xs">{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{views.toLocaleString()}</span>
            </div>
          </div>
          
          <button className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent to-accent/80 text-white font-semibold hover:from-accent/90 hover:to-accent/70 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 text-sm">
            <BookOpen className="w-3 h-3" />
            <span>Read Analysis</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeepDiveCard;