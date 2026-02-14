import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CleanChartProps {
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  isPositive: boolean;
}

const CleanChart = ({ name, price, change, changePercent, high, low, isPositive }: CleanChartProps) => {
  // Generate smooth realistic data based on high/low
  const generateChartData = () => {
    const points = 50; // More points for smoother curve
    const data = [];
    const range = high - low || price * 0.02;
    
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      
      // Create smooth wave pattern
      const wave1 = Math.sin(progress * Math.PI * 2) * 0.3;
      const wave2 = Math.sin(progress * Math.PI * 4) * 0.15;
      const trend = isPositive ? progress * 0.4 : -progress * 0.4;
      const random = (Math.random() - 0.5) * 0.1;
      
      const normalizedValue = 0.5 + trend + wave1 + wave2 + random;
      const clampedValue = Math.max(0.1, Math.min(0.9, normalizedValue));
      const value = low + (range * clampedValue);
      
      data.push({
        value: parseFloat(value.toFixed(2))
      });
    }
    
    // Ensure last point is current price
    data[data.length - 1].value = price;
    return data;
  };

  const chartData = generateChartData();

  return (
    <div className="group bg-white dark:bg-card rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 p-5 sm:p-6 min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="min-w-0 flex-1">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {name}
          </h3>
        </div>
      </div>

      {/* Price */}
      <div className="mb-1">
        <div className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Change */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`flex items-center gap-1 text-sm sm:text-base font-semibold ${
          isPositive ? 'text-emerald-600' : 'text-red-600'
        }`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {change > 0 ? '+' : ''}{change.toFixed(2)} ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%)
        </div>
        <span className="text-xs text-muted-foreground">1D</span>
      </div>

      {/* Chart - Clean Google Finance Style */}
      <div className="h-32 sm:h-40 -mx-2 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <YAxis domain={['dataMin', 'dataMax']} hide={true} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2.5}
              dot={false}
              animationDuration={1000}
              strokeLinecap="round"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Time Period Buttons - Like Google Finance */}
      <div className="flex items-center gap-2 text-xs">
        <button className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
          1D
        </button>
        <button className="px-3 py-1.5 rounded-full text-muted-foreground hover:bg-muted transition-colors">
          1W
        </button>
        <button className="px-3 py-1.5 rounded-full text-muted-foreground hover:bg-muted transition-colors">
          1M
        </button>
        <button className="px-3 py-1.5 rounded-full text-muted-foreground hover:bg-muted transition-colors">
          3M
        </button>
        <button className="px-3 py-1.5 rounded-full text-muted-foreground hover:bg-muted transition-colors">
          1Y
        </button>
      </div>

      {/* High/Low Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
        <div>
          <span className="font-medium">High:</span> ₹{high.toFixed(2)}
        </div>
        <div>
          <span className="font-medium">Low:</span> ₹{low.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default CleanChart;