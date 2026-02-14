import { TrendingUp, TrendingDown } from 'lucide-react';

interface ForexCardProps {
  pair: string;
  rate: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
}

const ForexCard = ({ pair, rate, change, changePercent, isPositive }: ForexCardProps) => {
  // Generate simple sparkline data
  const generateSparklineData = () => {
    const points = 20;
    const data = [];
    const baseValue = rate;
    const volatility = baseValue * 0.008; // 0.8% volatility
    
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      const trend = isPositive ? progress * 0.5 : -progress * 0.5;
      const random = (Math.random() - 0.5) * 0.3;
      
      const normalizedValue = 0.5 + trend + random;
      const value = baseValue * (1 + (normalizedValue - 0.5) * 0.015);
      
      data.push(parseFloat(value.toFixed(4)));
    }
    
    // Last point should be current rate
    data[data.length - 1] = rate;
    return data;
  };

  const sparklineData = generateSparklineData();
  
  // Create SVG path for sparkline
  const createSparklinePath = (data: number[]) => {
    const width = 100;
    const height = 40;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="group bg-card rounded-2xl p-4 sm:p-5 border border-border/60 hover:border-primary/40 hover:shadow-lg transition-all duration-300 min-w-0 overflow-hidden">
      {/* Pair Name */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {pair}
        </h3>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
          isPositive 
            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200/50' 
            : 'bg-red-500/10 text-red-600 border border-red-200/50'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {changePercent.toFixed(2)}%
        </div>
      </div>

      {/* Rate */}
      <div className="mb-3">
        <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {rate.toFixed(4)}
        </div>
        <div className={`text-sm sm:text-base font-semibold mt-1 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          {change > 0 ? '+' : ''}{change.toFixed(4)}
        </div>
      </div>

      {/* Simple Sparkline */}
      <div className="h-10 -mx-1">
        <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`forex-gradient-${pair.replace(/\//g, '-')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
              <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <path
            d={`${createSparklinePath(sparklineData)} L 100,40 L 0,40 Z`}
            fill={`url(#forex-gradient-${pair.replace(/\//g, '-')})`}
          />
          
          {/* Line */}
          <path
            d={createSparklinePath(sparklineData)}
            fill="none"
            stroke={isPositive ? "#10b981" : "#ef4444"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t border-border/40">
        <span>24h</span>
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <span>{isPositive ? 'Up' : 'Down'}</span>
        </div>
      </div>
    </div>
  );
};

export default ForexCard;