import { useEffect, useRef, useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

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
  lastUpdated?: number;
  isLight?: boolean;
}

function generateFallbackCandles(
  price: number, changePercent: number, isPositive: boolean
): CandlePoint[] {
  const CANDLES = 22, INTERVAL_MS = 60 * 60 * 1000, VOL = 0.006;
  const now = Date.now();
  const totalMove = (price * Math.abs(changePercent)) / 100;
  let cur = isPositive ? price - totalMove : price + totalMove;
  const result: CandlePoint[] = [];
  for (let i = 0; i < CANDLES; i++) {
    const p     = i / (CANDLES - 1);
    const trend = isPositive ? p * 0.55 : -p * 0.55;
    const noise = (Math.random() - 0.47) * 0.5;
    const wave  = Math.sin(p * Math.PI * 2.5) * 0.12;
    cur = Math.max(price * 0.96, Math.min(price * 1.04,
      cur + (trend + noise + wave) * VOL * cur));
    const wick = cur * VOL * (0.4 + Math.random());
    const body = cur * VOL * (0.3 + Math.random() * 0.9);
    const open = cur, close = cur + (Math.random() > 0.5 ? 1 : -1) * body;
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
  last.y[3] = price; last.y[1] = Math.max(last.y[1], price); last.y[2] = Math.min(last.y[2], price);
  return result;
}

function formatTimeAgo(ts: number): string {
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

const CommodityCard = ({
  name, price, change, changePercent, unit, isPositive, candles,
  lastUpdated, isLight = true,
}: CommodityCardProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const apexRef  = useRef<any>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

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
        candlestick: {
          colors: { upward: '#10b981', downward: '#ef4444' },
          wick: { useFillColor: true },
        },
        bar: { columnWidth: '90%' }, // ← tighter candles, less gap
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
        theme: isLight ? 'light' : 'dark', x: { format: 'HH:mm' },
        y: { formatter: (v: number) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
      },
    };
    if (apexRef.current) { apexRef.current.destroy(); apexRef.current = null; }
    apexRef.current = new ApexCharts(chartRef.current, opts);
    apexRef.current.render();
    return () => { if (apexRef.current) { apexRef.current.destroy(); apexRef.current = null; } };
  }, [chartData, isLight]);

  const cardBg     = isLight ? 'bg-white' : 'bg-[#1C3656]';
  const borderCls  = isLight ? 'border-gray-100 hover:border-gray-200' : 'border-[#5194F6]/15 hover:border-[#5194F6]/30';
  const nameCls    = isLight ? 'text-gray-500' : 'text-slate-300';
  const unitCls    = isLight ? 'text-gray-400' : 'text-slate-400';
  const priceCls   = isLight ? 'text-gray-900' : 'text-white';
  const footerCls  = isLight ? 'text-gray-400 border-gray-100' : 'text-slate-400 border-[#5194F6]/10';

  return (
    <div className={`group ${cardBg} rounded-2xl p-4 sm:p-5 border ${borderCls} hover:shadow-lg transition-all duration-300 min-w-0 overflow-hidden`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-2 gap-1">
        <div className="min-w-0">
          <h3 className={`text-xs font-semibold uppercase tracking-widest truncate ${nameCls}`}>{name}</h3>
          <p className={`text-[10px] mt-0.5 ${unitCls}`}>{unit}</p>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
          isPositive ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200/50'
                     : 'bg-red-500/10 text-red-600 border border-red-200/50'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {changePercent.toFixed(2)}%
        </div>
      </div>

      {/* Price */}
      <div className={`text-xl sm:text-2xl font-bold tracking-tight leading-none ${priceCls}`}>
        ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div className={`text-sm font-semibold mt-0.5 mb-2 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
        {change > 0 ? '+' : ''}${change.toFixed(2)}
      </div>

      {/* Chart */}
      <div className="-mx-2" ref={chartRef} />

      {/* Footer with timestamp */}
      <div className={`flex items-center justify-between text-xs mt-1 pt-2 border-t ${footerCls}`}>
        <div className="flex items-center gap-1 text-[10px] opacity-70">
          <Clock className="w-2.5 h-2.5" />
          {lastUpdated
            ? <span>{formatTimeAgo(lastUpdated)} · ~15min delayed</span>
            : <span>{isFallback ? 'Market closed · est.' : '~15min delayed'}</span>
          }
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span className="text-[10px]">{isPositive ? 'Up' : 'Down'}</span>
        </div>
      </div>
    </div>
  );
};

export default CommodityCard;