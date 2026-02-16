import { useEffect, useRef, useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

declare const ApexCharts: any;

interface CandlePoint {
  x: number;
  y: [number, number, number, number];
}

interface CommodityCardProps {
  name: string;
  price: number;
  change: number;
  changePercent: number;
  unit: string;
  isPositive: boolean;
  candles?: CandlePoint[];
}

// Fallback when backend returns empty candles (market closed)
function generateFallbackCandles(
  price: number,
  changePercent: number,
  isPositive: boolean
): CandlePoint[] {
  const CANDLES     = 22;
  const INTERVAL_MS = 60 * 60 * 1000;
  const VOL         = 0.006;
  const now         = Date.now();
  const totalMove   = (price * Math.abs(changePercent)) / 100;
  let   cur         = isPositive ? price - totalMove : price + totalMove;
  const result: CandlePoint[] = [];

  for (let i = 0; i < CANDLES; i++) {
    const p     = i / (CANDLES - 1);
    const trend = isPositive ? p * 0.55 : -p * 0.55;
    const noise = (Math.random() - 0.47) * 0.5;
    const wave  = Math.sin(p * Math.PI * 2.5) * 0.12;
    cur = Math.max(price * 0.96, Math.min(price * 1.04,
      cur + (trend + noise + wave) * VOL * cur));
    const wick  = cur * VOL * (0.4 + Math.random());
    const body  = cur * VOL * (0.3 + Math.random() * 0.9);
    const open  = cur;
    const close = cur + (Math.random() > 0.5 ? 1 : -1) * body;
    result.push({
      x: now - (CANDLES - 1 - i) * INTERVAL_MS,
      y: [
        parseFloat(open.toFixed(2)),
        parseFloat((Math.max(open, close) + Math.random() * wick * 0.5).toFixed(2)),
        parseFloat((Math.min(open, close) - Math.random() * wick * 0.5).toFixed(2)),
        parseFloat(close.toFixed(2)),
      ],
    });
  }
  const last = result[result.length - 1];
  last.y[3] = price;
  last.y[1] = Math.max(last.y[1], price);
  last.y[2] = Math.min(last.y[2], price);
  return result;
}

const CommodityCard = ({
  name, price, change, changePercent, unit, isPositive, candles,
}: CommodityCardProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const apexRef  = useRef<any>(null);

  const chartData = useMemo(() => {
    if (candles && candles.length >= 5) return candles;
    return generateFallbackCandles(price, changePercent, isPositive);
  }, [candles, price, changePercent, isPositive]);

  const isFallback = !candles || candles.length < 5;

  useEffect(() => {
    if (!chartRef.current || typeof ApexCharts === 'undefined') return;
    const opts = {
      series: [{ name, data: chartData }],
      chart: {
        type: 'candlestick', height: 85,
        toolbar: { show: false }, animations: { enabled: false },
        background: 'transparent', zoom: { enabled: false },
      },
      plotOptions: {
        candlestick: { colors: { upward: '#10b981', downward: '#ef4444' }, wick: { useFillColor: true } },
      },
      xaxis: {
        type: 'datetime', labels: { show: false },
        axisBorder: { show: false }, axisTicks: { show: false }, tooltip: { enabled: false },
      },
      yaxis: {
        labels: { show: false }, axisBorder: { show: false },
        axisTicks: { show: false }, tooltip: { enabled: false },
      },
      grid: { show: false },
      tooltip: {
        theme: 'light', x: { format: 'HH:mm' },
        y: { formatter: (v: number) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
      },
    };
    if (apexRef.current) { apexRef.current.destroy(); apexRef.current = null; }
    apexRef.current = new ApexCharts(chartRef.current, opts);
    apexRef.current.render();
    return () => { if (apexRef.current) { apexRef.current.destroy(); apexRef.current = null; } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData]);

  return (
    <div className="group bg-card rounded-2xl p-4 sm:p-5 border border-border/60 hover:border-primary/40 hover:shadow-lg transition-all duration-300 min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-2 gap-1">
        <div className="min-w-0">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest truncate">{name}</h3>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">{unit}</p>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
          isPositive
            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200/50'
            : 'bg-red-500/10 text-red-600 border border-red-200/50'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {changePercent.toFixed(2)}%
        </div>
      </div>
      {/* Price */}
      <div className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-none">
        ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div className={`text-sm font-semibold mt-0.5 mb-2 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
        {change > 0 ? '+' : ''}${change.toFixed(2)}
      </div>
      {/* Chart */}
      <div className="-mx-2" ref={chartRef} />
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1 pt-2 border-t border-border/40">
        <span className="text-[10px] opacity-60">
          {isFallback ? 'Market closed · est. candles' : '~20 min delayed · 15-min candles'}
        </span>
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span>{isPositive ? 'Up' : 'Down'}</span>
        </div>
      </div>
    </div>
  );
};

export default CommodityCard;