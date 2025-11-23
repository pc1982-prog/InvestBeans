import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const MarketTicker = () => {
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const markets = [
    { name: "Sensex", value: "73,458.42", change: "+0.54%", isPositive: true },
    { name: "Nifty 50", value: "22,219.35", change: "-0.33%", isPositive: false },
    { name: "Nifty 100", value: "21,102.45", change: "+0.53%", isPositive: true },
    { name: "Nifty 200", value: "12,345.67", change: "-0.20%", isPositive: false },
    { name: "Dow Jones", value: "38,503.25", change: "+1.10%", isPositive: true },
    { name: "Nasdaq", value: "15,278.27", change: "-0.20%", isPositive: false },
    { name: "S&P 500", value: "5,250.12", change: "+0.38%", isPositive: true },
    { name: "Russell 2000", value: "2,050.30", change: "+0.26%", isPositive: true },
    { name: "FTSE 100", value: "7,623.45", change: "-0.12%", isPositive: false },
    { name: "DAX", value: "18,145.20", change: "+0.41%", isPositive: true },
    { name: "Nikkei 225", value: "39,102.10", change: "+0.22%", isPositive: true },
    { name: "SSE Composite", value: "3,045.60", change: "-0.18%", isPositive: false },
    { name: "Hang Seng", value: "16,847.83", change: "+0.15%", isPositive: true },
    { name: "KOSPI", value: "2,654.12", change: "-0.25%", isPositive: false },
    { name: "ASX 200", value: "7,234.56", change: "+0.32%", isPositive: true },
    { name: "TSX", value: "21,456.78", change: "+0.18%", isPositive: true },
    { name: "BSE 500", value: "28,901.23", change: "-0.08%", isPositive: false },
    { name: "Nifty Bank", value: "47,123.45", change: "+0.42%", isPositive: true },
    { name: "Nifty IT", value: "34,567.89", change: "+0.67%", isPositive: true },
    { name: "Nifty Pharma", value: "12,345.67", change: "-0.15%", isPositive: false },
    { name: "Nifty Auto", value: "18,901.23", change: "+0.28%", isPositive: true },
    { name: "Nifty FMCG", value: "45,678.90", change: "+0.12%", isPositive: true },
    { name: "Nifty Metal", value: "6,789.01", change: "-0.35%", isPositive: false },
    { name: "Nifty Energy", value: "23,456.78", change: "+0.45%", isPositive: true },
    { name: "Nifty Realty", value: "4,567.89", change: "+0.33%", isPositive: true },
    { name: "Nifty PSU Bank", value: "3,456.78", change: "-0.22%", isPositive: false },
    { name: "Nifty Private Bank", value: "24,567.89", change: "+0.38%", isPositive: true },
    { name: "Nifty Media", value: "1,234.56", change: "+0.55%", isPositive: true },
    { name: "Nifty PSE", value: "5,678.90", change: "+0.19%", isPositive: true },
    { name: "Nifty Commodities", value: "7,890.12", change: "-0.14%", isPositive: false },
  ];

  // Auto-scroll animation
  useEffect(() => {
    const startAnimation = () => {
      if (tickerRef.current && !isPaused) {
        const element = tickerRef.current;
        const scrollWidth = element.scrollWidth;
        const clientWidth = element.clientWidth;
        const maxScroll = scrollWidth - clientWidth;
        
        let currentScroll = element.scrollLeft;
        
        const animate = () => {
          if (!isPaused && tickerRef.current) {
            currentScroll += 0.5; // Adjust speed here
            if (currentScroll >= maxScroll) {
              currentScroll = 0; // Reset to beginning for continuous scroll
            }
            element.scrollLeft = currentScroll;
            animationRef.current = requestAnimationFrame(animate);
          }
        };
        
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    startAnimation();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  const scrollLeft = () => {
    if (tickerRef.current) {
      tickerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tickerRef.current) {
      tickerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };


  return (
    <div className="relative flex items-center">
      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-2 z-10 bg-navy/80 hover:bg-navy text-white p-1 rounded-full transition-colors"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Ticker Content */}
      <div className="flex-1 overflow-hidden mx-10">
        <div 
          ref={tickerRef}
          className="flex items-center gap-8 overflow-x-auto scrollbar-hide"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* First set of markets */}
          {markets.map((market, index) => (
            <div key={`${market.name}-${index}`} className="flex items-center gap-4 whitespace-nowrap group hover:scale-105 transition-transform">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{market.name}</span>
                <span className="font-bold text-base text-white">{market.value}</span>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                market.isPositive 
                  ? "bg-green-500/30 text-green-100 border border-green-400/50" 
                  : "bg-red-500/30 text-red-100 border border-red-400/50"
              }`}>
                {market.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {market.change}
              </div>
            </div>
          ))}
          {/* Duplicate set for continuous scrolling */}
          {markets.map((market, index) => (
            <div key={`${market.name}-dup-${index}`} className="flex items-center gap-4 whitespace-nowrap group hover:scale-105 transition-transform">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{market.name}</span>
                <span className="font-bold text-base text-white">{market.value}</span>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                market.isPositive 
                  ? "bg-green-500/30 text-green-100 border border-green-400/50" 
                  : "bg-red-500/30 text-red-100 border border-red-400/50"
              }`}>
                {market.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {market.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-2 z-10 bg-navy/80 hover:bg-navy text-white p-1 rounded-full transition-colors"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default MarketTicker;