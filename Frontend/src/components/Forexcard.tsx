import { useEffect, useRef, useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

declare const ApexCharts: any;

interface ForexCardProps {
  pair: string;
  rate: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
}

function generateForexCandles(
  rate: number,
  changePercent: number,
  isPositive: boolean
): { x: number; y: [number, number, number, number] }[] {
  const CANDLES     = 22;
  const INTERVAL_MS = 30 * 60 * 1000;
  const VOL         = 0.0010;
  const now         = Date.now();
  const totalMove   = (rate * Math.abs(changePercent)) / 100;
  let   cur         = isPositive ? rate - totalMove : rate + totalMove;
  const result: { x: number; y: [number, number, number, number] }[] = [];

  for (let i = 0; i < CANDLES; i++) {
    const p     = i / (CANDLES - 1);
    const trend = isPositive ? p * 0.5 : -p * 0.5;
    const noise = (Math.random() - 0.47) * 0.4;
    const wave  = Math.sin(p * Math.PI * 2) * 0.1;
    cur = Math.max(rate * 0.97, Math.min(rate * 1.03,
      cur + (trend + noise + wave) * VOL * cur));
    const wick  = cur * VOL * (0.3 + Math.random() * 0.8);
    const body  = cur * VOL * (0.2 + Math.random() * 0.5);
    const open  = cur;
    const close = cur + (Math.random() > 0.5 ? 1 : -1) * body;
    result.push({
      x: now - (CANDLES - 1 - i) * INTERVAL_MS,
      y: [
        parseFloat(open.toFixed(4)),
        parseFloat((Math.max(open, close) + Math.random() * wick * 0.4).toFixed(4)),
        parseFloat((Math.min(open, close) - Math.random() * wick * 0.4).toFixed(4)),
        parseFloat(close.toFixed(4)),
      ],
    });
  }
  const last = result[result.length - 1];
  last.y[3] = rate;
  last.y[1] = Math.max(last.y[1], rate);
  last.y[2] = Math.min(last.y[2], rate);
  return result;
}

const ForexCard = ({ pair, rate, change, changePercent, isPositive }: ForexCardProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const apexRef  = useRef<any>(null);
  const candles  = useMemo(
    () => generateForexCandles(rate, changePercent, isPositive),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rate, changePercent, isPositive]
  );

  useEffect(() => {
    if (!chartRef.current || typeof ApexCharts === 'undefined') return;
    const opts = {
      series: [{ name: pair, data: candles }],
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
        y: { formatter: (v: number) => v.toFixed(4) },
      },
    };
    if (apexRef.current) { apexRef.current.destroy(); apexRef.current = null; }
    apexRef.current = new ApexCharts(chartRef.current, opts);
    apexRef.current.render();
    return () => { if (apexRef.current) { apexRef.current.destroy(); apexRef.current = null; } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candles]);

  return (
    <div className="group bg-card rounded-2xl p-4 sm:p-5 border border-border/60 hover:border-primary/40 hover:shadow-lg transition-all duration-300 min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{pair}</h3>
        <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
          isPositive
            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200/50'
            : 'bg-red-500/10 text-red-600 border border-red-200/50'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {changePercent.toFixed(2)}%
        </div>
      </div>
      {/* Rate */}
      <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-none">
        {rate.toFixed(4)}
      </div>
      <div className={`text-sm font-semibold mt-0.5 mb-2 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
        {change > 0 ? '+' : ''}{change.toFixed(4)}
      </div>
      {/* Chart */}
      <div className="-mx-2" ref={chartRef} />
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1 pt-2 border-t border-border/40">
        <span className="text-[10px] opacity-60">~daily delayed · est. candles</span>
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span>{isPositive ? 'Up' : 'Down'}</span>
        </div>
      </div>
    </div>
  );
};

export default ForexCard;