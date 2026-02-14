import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface IndexChartProps {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  isPositive: boolean;
}

const IndexChart = ({ name, price, change, changePercent, high, low, isPositive }: IndexChartProps) => {
  // Generate realistic intraday data based on high/low/current
  const generateIntradayData = () => {
    const points = 30;
    const data = [];
    const range = high - low || price * 0.02; // Fallback to 2% range if high/low are same
    
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      const volatility = Math.sin(progress * Math.PI * 3) * 0.3;
      const trend = isPositive ? progress * 0.4 : -progress * 0.4;
      const random = (Math.random() - 0.5) * 0.2;
      
      const normalizedValue = 0.5 + trend + volatility + random;
      const clampedValue = Math.max(0.1, Math.min(0.9, normalizedValue));
      const value = low + (range * clampedValue);
      
      data.push({
        time: `${9 + Math.floor(i / 4)}:${String((i % 4) * 15).padStart(2, '0')}`,
        price: parseFloat(value.toFixed(2))
      });
    }
    
    // Ensure last point matches current price
    data[data.length - 1].price = price;
    return data;
  };

  const chartData = generateIntradayData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <p className="text-xs font-medium text-muted-foreground mb-1">{payload[0].payload.time}</p>
          <p className="text-sm font-bold text-foreground">
            ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="group bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500 p-4 sm:p-6 min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider truncate mb-1">
            {name}
          </h3>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight break-all leading-none">
            {price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
          isPositive 
            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200/50 dark:border-emerald-500/30' 
            : 'bg-red-500/10 text-red-600 border border-red-200/50 dark:border-red-500/30'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span className="hidden sm:inline">{changePercent.toFixed(2)}%</span>
          <span className="sm:hidden">{changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%</span>
        </div>
      </div>

      {/* Change Value */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-base sm:text-lg font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          {change > 0 ? '+' : ''}{change.toFixed(2)}
        </span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>H: {high.toFixed(2)}</span>
          <span>L: {low.toFixed(2)}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-20 sm:h-24 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${name.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositive ? "#10b981" : "#ef4444"} 
                  stopOpacity={0.4}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositive ? "#10b981" : "#ef4444"} 
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              hide={true}
            />
            <YAxis 
              domain={['dataMin', 'dataMax']}
              hide={true}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              fill={`url(#gradient-${name.replace(/\s+/g, '-')})`}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
        <span>Intraday</span>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <span className="text-xs">{isPositive ? 'Bullish' : 'Bearish'}</span>
        </div>
      </div>
    </div>
  );
};

export default IndexChart;