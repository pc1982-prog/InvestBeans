import { useEffect, useRef, useState, useCallback } from 'react';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

declare const ApexCharts: any;

interface CandlePoint {
  x: number;
  y: [number, number, number, number];
}

interface CleanChartProps {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  isPositive: boolean;
  candles?: CandlePoint[];
}

type Period = '1D' | '1W' | '1M' | '3M' | '1Y';

const PERIODS: Period[] = ['1D', '1W', '1M', '3M', '1Y'];

const PERIOD_LABEL: Record<Period, string> = {
  '1D': '1D · 5min',
  '1W': '1W · 30min',
  '1M': '1M · Daily',
  '3M': '3M · Daily',
  '1Y': '1Y · Weekly',
};

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

// Calculate percentage change from candle data
function calculatePeriodChange(candles: CandlePoint[]): { change: number; changePercent: number } {
  if (candles.length < 2) return { change: 0, changePercent: 0 };
  
  const firstCandle = candles[0];
  const lastCandle = candles[candles.length - 1];
  
  const startPrice = firstCandle.y[0];
  const endPrice = lastCandle.y[3];
  
  const change = endPrice - startPrice;
  const changePercent = (change / startPrice) * 100;
  
  return { change, changePercent };
}

// Fallback candles
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
  
  // Period-specific stats
  const [periodChange, setPeriodChange] = useState(change);
  const [periodChangePercent, setPeriodChangePercent] = useState(changePercent);
  const [periodHigh, setPeriodHigh] = useState(high);
  const [periodLow, setPeriodLow] = useState(low);

  // Fetch real historical candles
  const fetchHistory = useCallback(async (p: Period) => {
    setLoading(true);
    try {
      const encodedSymbol = encodeURIComponent(symbol);
      const url = `${API_BASE}/markets/history/${encodedSymbol}?period=${p}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const candles: CandlePoint[] = data.candles || [];

      if (candles.length >= 3) {
        setChartData(candles);
        setIsFallback(false);
        
        const { change: pChange, changePercent: pChangePercent } = calculatePeriodChange(candles);
        setPeriodChange(pChange);
        setPeriodChangePercent(pChangePercent);
        
        const allHighs = candles.map(c => c.y[1]);
        const allLows = candles.map(c => c.y[2]);
        setPeriodHigh(Math.max(...allHighs));
        setPeriodLow(Math.min(...allLows));
      } else {
        const fb = generateFallback(price, high, low, changePercent, isPositive);
        setChartData(fb);
        setIsFallback(true);
        
        setPeriodChange(change);
        setPeriodChangePercent(changePercent);
        setPeriodHigh(high);
        setPeriodLow(low);
      }
    } catch (e) {
      console.error(`[CleanChart] History fetch failed for ${symbol} ${p}:`, e);
      const fb = (initialCandles && initialCandles.length >= 3)
        ? initialCandles
        : generateFallback(price, high, low, changePercent, isPositive);
      setChartData(fb);
      setIsFallback(true);
      
      setPeriodChange(change);
      setPeriodChangePercent(changePercent);
      setPeriodHigh(high);
      setPeriodLow(low);
    } finally {
      setLoading(false);
    }
  }, [symbol, price, high, low, changePercent, isPositive, initialCandles, change]);

  useEffect(() => {
    fetchHistory(period);
  }, [period, fetchHistory]);

  // Render ApexCharts
  useEffect(() => {
    if (!chartRef.current || typeof ApexCharts === 'undefined') return;
    if (chartData.length === 0) return;

    const options = {
      series: [{ name, data: chartData }],
      chart: {
        type:       'candlestick',
        height:     160,
        toolbar:    { show: false },
        animations: { enabled: false },
        background: 'transparent',
        zoom:       { enabled: false },
        selection:  { enabled: false },
      },
      plotOptions: {
        candlestick: {
          colors:  { upward: '#059669', downward: '#dc2626' },
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
        borderColor:     'rgba(226, 232, 240, 0.5)',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true  } },
        padding: { top: 4, right: 8, bottom: 0, left: 8 },
      },
      tooltip: {
        theme: 'light',
        x:     { format: period === '1D' || period === '1W' ? 'dd MMM HH:mm' : 'dd MMM yyyy' },
        y:     {
          formatter: (v: number) =>
            v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        },
        style: {
          fontSize: '12px',
        }
      },
    };

    if (apexRef.current) { apexRef.current.destroy(); apexRef.current = null; }
    apexRef.current = new ApexCharts(chartRef.current, options);
    apexRef.current.render();

    return () => {
      if (apexRef.current) { apexRef.current.destroy(); apexRef.current = null; }
    };
  }, [chartData, name, period]);

  const isPeriodPositive = periodChangePercent >= 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 sm:p-8 overflow-hidden">
      
      {/* Name */}
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
        {name}
      </h3>

      {/* Price + High/Low */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none mb-2">
            {price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`flex items-center gap-2 text-base font-bold ${
            isPeriodPositive ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {isPeriodPositive
              ? <TrendingUp  className="w-5 h-5" />
              : <TrendingDown className="w-5 h-5" />}
            <span>
              {periodChange > 0 ? '+' : ''}{periodChange.toFixed(2)}&nbsp;
              ({periodChangePercent > 0 ? '+' : ''}{periodChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="text-right text-xs text-slate-500 leading-relaxed space-y-1">
          <div className="px-2 py-1 rounded bg-slate-50 border border-slate-200">
            H: <span className="text-slate-700 font-semibold">{periodHigh.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="px-2 py-1 rounded bg-slate-50 border border-slate-200">
            L: <span className="text-slate-700 font-semibold">{periodLow.toLocaleString('en-IN',  { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Period Buttons */}
      <div className="flex items-center gap-1.5 mt-4 mb-3 flex-wrap">
        {PERIODS.map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            disabled={loading}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === p
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            {p}
          </button>
        ))}
        {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin text-slate-400" />}
      </div>

      {/* Candlestick Chart */}
      <div className={`-mx-2 transition-opacity duration-200 ${loading ? 'opacity-40' : 'opacity-100'}`}>
        <div ref={chartRef} />
      </div>

      {/* Footer note */}
      <p className="text-[10px] text-slate-400 text-right mt-2">
        {isFallback
          ? '🔒 Market closed · estimated shape'
          : `📊 Real data · ${PERIOD_LABEL[period]}`}
      </p>
    </div>
  );
};

export default CleanChart;