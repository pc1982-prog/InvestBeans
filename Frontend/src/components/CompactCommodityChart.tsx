import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CompactCommodityChartProps {
  name: string;
  price: number;
  change: number;
  changePercent: number;
  unit: string;
  isPositive: boolean;
}

const CompactCommodityChart = ({ name, price, change, changePercent, unit, isPositive }: CompactCommodityChartProps) => {
  // Generate minimal smooth data
  const generateChartData = () => {
    const points = 25;
    const data = [];
    
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      const wave = Math.sin(progress * Math.PI * 2) * 0.3;
      const trend = isPositive ? progress * 0.4 : -progress * 0.4;
      const random = (Math.random() - 0.5) * 0.15;
      
      const normalizedValue = 0.5 + trend + wave + random;
      const value = price * (0.985 + (normalizedValue * 0.03));
      
      data.push({ value: parseFloat(value.toFixed(2)) });
    }
    
    data[data.length - 1].value = price;
    return data;
  };

  const chartData = generateChartData();

  return (
    <div className="group bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border hover:shadow-md transition-all duration-300 p-4 min-w-0">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-medium text-gray-500 dark:text-muted-foreground uppercase tracking-wide truncate">
            {name}
          </h3>
          <p className="text-[10px] text-gray-400 dark:text-muted-foreground/70">{unit}</p>
        </div>
        <div className={`flex items-center gap-0.5 text-xs font-semibold shrink-0 ${
          isPositive ? 'text-emerald-600' : 'text-red-600'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {changePercent.toFixed(2)}%
        </div>
      </div>

      {/* Price */}
      <div className="mb-1">
        <div className="text-2xl font-bold text-gray-900 dark:text-foreground">
          ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          {change > 0 ? '+' : ''}${change.toFixed(2)}
        </div>
      </div>

      {/* Compact Chart */}
      <div className="h-16 -mx-2 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              dot={false}
              animationDuration={600}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-muted-foreground pt-2 border-t border-gray-100 dark:border-border/50">
        <span>24h</span>
        <div className={`w-1.5 h-1.5 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
      </div>
    </div>
  );
};

export default CompactCommodityChart;