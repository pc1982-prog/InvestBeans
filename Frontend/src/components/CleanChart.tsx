import { useEffect, useRef, useState, useCallback } from 'react';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

declare const ApexCharts: any;

interface CandlePoint {
  x: number;
  y: [number, number, number, number];
}

interface CleanChartProps {
  name: string;
  symbol: string;       // e.g. "^DJI", "^GSPC"  — needed for history fetch
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  isPositive: boolean;
  candles?: CandlePoint[];  // initial 1D candles from parent (can be empty)
}

type Period = '1D' | '1W' | '1M' | '3M' | '1Y';

const PERIODS: Period[] = ['1D', '1W', '1M', '3M', '1Y'];

const PERIOD_LABEL: Record<Period, string> = {
  '1D': '1D · 15min',
  '1W': '1W · 1hr',
  '1M': '1M · Daily',
  '3M': '3M · Daily',
  '1Y': '1Y · Weekly',
};

const API_BASE = (import.meta as any).env?.VITE_API_URL?.trim() || 'https://companytask-1-1.onrender.com';

// Fallback candles when real data unavailable (market closed etc.)
function generateFallback(
  price: number, high: number, low: number,
  changePercent: number, isPositive: boolean, count = 26
): CandlePoint[] {
  const INTERVAL_MS = 15 * 60 * 1000;
  const now = Date.now();
  const range = high - low || price * 0.02;
  const totalMove = (price * Math.abs(changePercent)) / 100;
  let cur = isPositive ? price - totalMove : price + totalMove;
  const vol = range / count;
  const result: CandlePoint[] = [];

  for (let i = 0; i < count; i++) {
    const p     = i / (count - 1);
    const trend = isPositive ? p * 0.6 : -p * 0.6;
    const noise = (Math.random() - 0.47) * 0.5;
    const wave  = Math.sin(p * Math.PI * 2.5) * 0.15;

    cur = cur + (trend + noise + wave) * vol * 0.8;
    cur = Math.max(low * 0.99, Math.min(high * 1.01, cur));

    const wick  = vol * (0.3 + Math.random() * 0.9);
    const body  = vol * (0.2 + Math.random() * 0.7);
    const open  = cur;
    const close = cur + (Math.random() > 0.5 ? 1 : -1) * body;

    result.push({
      x: now - (count - 1 - i) * INTERVAL_MS,
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

const CleanChart = ({
  name, symbol, price, change, changePercent,
  high, low, isPositive, candles: initialCandles,
}: CleanChartProps) => {
  const chartRef  = useRef<HTMLDivElement>(null);
  const apexRef   = useRef<any>(null);

  const [period,    setPeriod]    = useState<Period>('1D');
  const [chartData, setChartData] = useState<CandlePoint[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  // Fetch real historical candles from backend
  const fetchHistory = useCallback(async (p: Period) => {
    setLoading(true);
    try {
      // Encode symbol — ^ becomes %5E
      const encodedSymbol = encodeURIComponent(symbol);
      const url = `${API_BASE}/api/v1/markets/history/${encodedSymbol}?period=${p}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const candles: CandlePoint[] = data.candles || [];

      if (candles.length >= 3) {
        setChartData(candles);
        setIsFallback(false);
      } else {
        // Empty (market closed / weekend) — use fallback
        setChartData(generateFallback(price, high, low, changePercent, isPositive));
        setIsFallback(true);
      }
    } catch (e) {
      console.error(`[CleanChart] History fetch failed for ${symbol} ${p}:`, e);
      // Use initialCandles or generate fallback
      const fb = (initialCandles && initialCandles.length >= 3)
        ? initialCandles
        : generateFallback(price, high, low, changePercent, isPositive);
      setChartData(fb);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  }, [symbol, price, high, low, changePercent, isPositive, initialCandles]);

  // On mount and on period change — fetch real data
  useEffect(() => {
    fetchHistory(period);
  }, [period, fetchHistory]);

  // Render / update ApexCharts
  useEffect(() => {
    if (!chartRef.current || typeof ApexCharts === 'undefined') return;
    if (chartData.length === 0) return;

    const options = {
      series: [{ name, data: chartData }],
      chart: {
        type:       'candlestick',
        height:     140,
        toolbar:    { show: false },
        animations: { enabled: false },
        background: 'transparent',
        zoom:       { enabled: false },
        selection:  { enabled: false },
      },
      plotOptions: {
        candlestick: {
          colors:  { upward: '#10b981', downward: '#ef4444' },
          wick:    { useFillColor: true },
        },
      },
      xaxis: {
        type:       'datetime',
        labels:     { show: false },
        axisBorder: { show: false },
        axisTicks:  { show: false },
        crosshairs: { show: false },
        tooltip:    { enabled: false },
      },
      yaxis: {
        labels:     { show: false },
        axisBorder: { show: false },
        axisTicks:  { show: false },
        crosshairs: { show: false },
        tooltip:    { enabled: false },
      },
      grid: {
        show:            true,
        borderColor:     'rgba(0,0,0,0.05)',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true  } },
        padding: { top: 2, right: 6, bottom: 0, left: 6 },
      },
      tooltip: {
        theme: 'light',
        x:     { format: period === '1D' || period === '1W' ? 'dd MMM HH:mm' : 'dd MMM yyyy' },
        y:     {
          formatter: (v: number) =>
            v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        },
      },
    };

    if (apexRef.current) { apexRef.current.destroy(); apexRef.current = null; }
    apexRef.current = new ApexCharts(chartRef.current, options);
    apexRef.current.render();

    return () => {
      if (apexRef.current) { apexRef.current.destroy(); apexRef.current = null; }
    };
  }, [chartData, name, period]);

  return (
    <div className="group bg-white dark:bg-card rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 p-5 sm:p-6 min-w-0 overflow-hidden">

      {/* Name */}
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
        {name}
      </h3>

      {/* Price + High/Low */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <div className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-none">
            {price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`flex items-center gap-1 mt-1.5 text-sm font-semibold ${
            isPositive ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {isPositive
              ? <TrendingUp  className="w-3.5 h-3.5" />
              : <TrendingDown className="w-3.5 h-3.5" />}
            {change > 0 ? '+' : ''}{change.toFixed(2)}&nbsp;
            ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%)
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground leading-relaxed">
          <div>H: {high.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
          <div>L: {low.toLocaleString('en-IN',  { maximumFractionDigits: 2 })}</div>
        </div>
      </div>

      {/* Period Buttons */}
      <div className="flex items-center gap-1 mt-3 mb-1">
        {PERIODS.map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            disabled={loading}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
              period === p
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {p}
          </button>
        ))}
        {loading && <Loader2 className="w-3 h-3 ml-1 animate-spin text-muted-foreground" />}
      </div>

      {/* Candlestick Chart */}
      <div className={`-mx-1 transition-opacity duration-200 ${loading ? 'opacity-40' : 'opacity-100'}`}>
        <div ref={chartRef} />
      </div>

      {/* Delay note */}
      <p className="text-[10px] text-muted-foreground/50 text-right mt-0.5">
        {isFallback
          ? 'Market closed · estimated shape'
          : `Real data · ${PERIOD_LABEL[period]}`}
      </p>
    </div>
  );
};

export default CleanChart;