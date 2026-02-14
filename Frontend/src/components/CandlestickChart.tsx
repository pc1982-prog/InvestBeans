import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CandlestickChartProps {
  name: string;
  value: string;
  change: number;
  changePercent: number;
  isPositive: boolean;
  unit?: string;
}

const CandlestickChart = ({ name, value, change, changePercent, isPositive, unit }: CandlestickChartProps) => {
  // Generate candlestick-style data
  const generateCandlestickData = () => {
    const points = 12;
    const data = [];
    const baseValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    const volatility = baseValue * 0.015; // 1.5% volatility
    
    for (let i = 0; i < points; i++) {
      const open = baseValue + (Math.random() - 0.5) * volatility;
      const close = open + (Math.random() - 0.5) * volatility * 0.8;
      const high = Math.max(open, close) + Math.random() * volatility * 0.3;
      const low = Math.min(open, close) - Math.random() * volatility * 0.3;
      
      data.push({
        time: `${i + 1}`,
        open: parseFloat(open.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        bodyHeight: Math.abs(close - open),
        bodyY: Math.min(open, close),
        wickHeight: high - low,
        wickY: low,
        color: close >= open ? '#10b981' : '#ef4444'
      });
    }
    
    return data;
  };

  const chartData = generateCandlestickData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <p className="text-xs font-medium text-muted-foreground mb-2">Candle {data.time}</p>
          <div className="space-y-1 text-xs">
            <p className="flex justify-between gap-3">
              <span className="text-muted-foreground">High:</span>
              <span className="font-semibold">{data.high.toFixed(2)}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-muted-foreground">Low:</span>
              <span className="font-semibold">{data.low.toFixed(2)}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-muted-foreground">Open:</span>
              <span className="font-semibold">{data.open.toFixed(2)}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-muted-foreground">Close:</span>
              <span className="font-semibold">{data.close.toFixed(2)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="group bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500 p-4 sm:p-5 min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider truncate mb-1">
            {name}
          </h3>
          {unit && (
            <p className="text-[10px] text-muted-foreground/70">{unit}</p>
          )}
        </div>
        
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shrink-0 ${
          isPositive 
            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200/50' 
            : 'bg-red-500/10 text-red-600 border border-red-200/50'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {changePercent.toFixed(2)}%
        </div>
      </div>

      {/* Value */}
      <div className="mb-3">
        <div className="text-xl sm:text-2xl font-bold text-foreground tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">
          {value}
        </div>
        <div className={`text-sm sm:text-base font-semibold mt-1 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          {change > 0 ? '+' : ''}{change.toFixed(2)}
        </div>
      </div>

      {/* Candlestick Chart */}
      <div className="h-24 sm:h-28 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis dataKey="time" hide={true} />
            <YAxis domain={['dataMin', 'dataMax']} hide={true} />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Wicks (High-Low lines) */}
            <Bar dataKey="wickHeight" stackId="a" fill="none">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`wick-${index}`} 
                  fill={entry.color} 
                  opacity={0.6}
                  width={2}
                />
              ))}
            </Bar>
            
            {/* Candle bodies */}
            <Bar dataKey="bodyHeight" stackId="a" radius={[2, 2, 2, 2]}>
              {chartData.map((entry, index) => (
                <Cell key={`body-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
        <span>12 periods</span>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <span>{isPositive ? 'Up' : 'Down'}</span>
        </div>
      </div>
    </div>
  );
};

export default CandlestickChart;