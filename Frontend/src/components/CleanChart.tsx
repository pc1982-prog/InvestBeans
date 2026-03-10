// src/components/CleanChart.tsx
// ─────────────────────────────────────────────────────────────────
// Candlestick chart using TradingView Lightweight Charts v5.
// Replaces ApexCharts — all existing UI (price header, period
// buttons, H/L badges, footer) is UNCHANGED.
//
// Install once:  npm install lightweight-charts
// ─────────────────────────────────────────────────────────────────

import {
  useEffect, useRef, useState, useCallback,
} from 'react';
import {
  createChart,
  CandlestickSeries,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  type CandlestickSeriesOptions,
} from 'lightweight-charts';
import { TrendingUp, TrendingDown, Loader2, Clock } from 'lucide-react';
import { useTheme } from '@/controllers/Themecontext';

// ── Types (same as before) ────────────────────────────────────────
interface CandlePoint {
  x: number;              // ms timestamp
  y: [number, number, number, number]; // [open, high, low, close]
}

interface CleanChartProps {
  name:          string;
  symbol:        string;
  price:         number;
  change:        number;
  changePercent: number;
  high:          number;
  low:           number;
  isPositive:    boolean;
  candles?:      CandlePoint[];
}

type Period = '1D' | '1W' | '1M' | '3M' | '1Y';
const PERIODS: Period[] = ['1D', '1W', '1M', '3M', '1Y'];

// Yahoo Finance delay info per period
const DELAY_LABEL: Record<Period, string> = {
  '1D': '~15 min delayed · 5 min bars',
  '1W': '~15 min delayed · 30 min bars',
  '1M': 'End-of-day · daily bars',
  '3M': 'End-of-day · daily bars',
  '1Y': 'End-of-day · weekly bars',
};

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

// ── Helpers ───────────────────────────────────────────────────────
function calcPeriodChange(candles: CandlePoint[]) {
  if (candles.length < 2) return { change: 0, changePercent: 0 };
  const start = candles[0].y[0];
  const end   = candles[candles.length - 1].y[3];
  const chg   = end - start;
  return { change: chg, changePercent: (chg / start) * 100 };
}

function generateFallback(
  price: number, high: number, low: number,
  changePercent: number, isPositive: boolean, count = 26
): CandlePoint[] {
  const STEP = 15 * 60 * 1000;
  const now  = Date.now();
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
      x: now - (count - 1 - i) * STEP,
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

// Convert CandlePoint[] → Lightweight Charts format
// LWC needs time in UTC seconds (integer), and de-duped + sorted
function toLWC(candles: CandlePoint[]) {
  const seen = new Set<number>();
  return candles
    .map(c => ({
      time:  Math.floor(c.x / 1000) as unknown as import('lightweight-charts').Time,
      open:  c.y[0],
      high:  c.y[1],
      low:   c.y[2],
      close: c.y[3],
    }))
    .filter(c => {
      const t = c.time as unknown as number;
      if (seen.has(t)) return false;
      seen.add(t);
      return true;
    })
    .sort((a, b) => (a.time as unknown as number) - (b.time as unknown as number));
}

// ── Chart colors per theme ────────────────────────────────────────
function chartColors(dark: boolean) {
  return {
    bg:        dark ? 'transparent' : 'transparent',
    grid:      dark ? 'rgba(255,255,255,0.04)' : 'rgba(226,232,240,0.6)',
    upColor:   '#059669',
    downColor: '#dc2626',
    wick:      true,  // useFillColor
    textColor: dark ? 'rgba(148,163,184,0.8)' : 'rgba(100,116,139,0.8)',
    crosshair: dark ? 'rgba(148,163,184,0.3)' : 'rgba(100,116,139,0.3)',
  };
}

// ═══════════════════════════════════════════════════════════════════
const CleanChart = ({
  name, symbol, price, change, changePercent,
  high, low, isPositive, candles: initialCandles,
}: CleanChartProps) => {
  const { theme }  = useTheme();
  const dark       = theme === 'dark';

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<IChartApi | null>(null);
  const seriesRef    = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const [period,    setPeriod]    = useState<Period>('1D');
  const [chartData, setChartData] = useState<CandlePoint[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [periodChange,        setPeriodChange]        = useState(change);
  const [periodChangePercent, setPeriodChangePercent] = useState(changePercent);
  const [periodHigh,          setPeriodHigh]          = useState(high);
  const [periodLow,           setPeriodLow]           = useState(low);

  // ── Fetch historical data ───────────────────────────────────────
  const fetchHistory = useCallback(async (p: Period) => {
    setLoading(true);
    try {
      const url = `${API_BASE}/markets/history/${encodeURIComponent(symbol)}?period=${p}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const candles: CandlePoint[] = data.candles || [];

      if (candles.length >= 3) {
        setChartData(candles);
        setIsFallback(false);
        setLastUpdated(new Date());

        const { change: c, changePercent: cp } = calcPeriodChange(candles);
        setPeriodChange(c); setPeriodChangePercent(cp);
        setPeriodHigh(Math.max(...candles.map(k => k.y[1])));
        setPeriodLow(Math.min(...candles.map(k => k.y[2])));
      } else {
        throw new Error('not enough candles');
      }
    } catch (e) {
      console.error(`[CleanChart] ${symbol} ${p}:`, e);
      const fb = (initialCandles && initialCandles.length >= 3)
        ? initialCandles
        : generateFallback(price, high, low, changePercent, isPositive);
      setChartData(fb);
      setIsFallback(true);
      setPeriodChange(change); setPeriodChangePercent(changePercent);
      setPeriodHigh(high); setPeriodLow(low);
    } finally {
      setLoading(false);
    }
  }, [symbol, price, high, low, changePercent, isPositive, initialCandles, change]);

  useEffect(() => { fetchHistory(period); }, [period, fetchHistory]);

  // ── Create / resize chart ───────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const colors = chartColors(dark);

    // Destroy old instance on theme change
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current  = null;
      seriesRef.current = null;
    }

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor:  colors.textColor,
        fontFamily: "'Inter', system-ui, sans-serif",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: colors.grid },
      },
      crosshair: {
        vertLine: { color: colors.crosshair, labelBackgroundColor: dark ? '#1e3a5f' : '#475569' },
        horzLine: { color: colors.crosshair, labelBackgroundColor: dark ? '#1e3a5f' : '#475569' },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.08, bottom: 0.05 },
        minimumWidth: 64,
      },
      timeScale: {
        borderVisible:       false,
        timeVisible:         period === '1D' || period === '1W',
        secondsVisible:      false,
        fixLeftEdge:         true,
        fixRightEdge:        true,
        // Tight bars — no gap
        barSpacing:          6,
        rightOffset:         2,
      },
      handleScroll:   { mouseWheel: false, pressedMouseMove: true, horzTouchDrag: true },
      handleScale:    { mouseWheel: false, pinch: false },
      autoSize:       true,
      height:         180,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor:     colors.upColor,
      downColor:   colors.downColor,
      borderVisible: false,
      wickUpColor:   colors.upColor,
      wickDownColor: colors.downColor,
    } as Partial<CandlestickSeriesOptions>);

    chartRef.current  = chart;
    seriesRef.current = series;

    // If data already loaded, paint it immediately
    if (chartData.length > 0) {
      series.setData(toLWC(chartData));
      chart.timeScale().fitContent();
    }

    // ResizeObserver for container width changes
    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: containerRef.current?.clientWidth ?? 0 });
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current  = null;
      seriesRef.current = null;
    };
    // Re-create when theme changes (so colors update)
  }, [dark]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Push new data into existing chart ──────────────────────────
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current || chartData.length === 0) return;
    const lwcData = toLWC(chartData);
    seriesRef.current.setData(lwcData);
    chartRef.current.timeScale().fitContent();
    // Update time-visibility based on period
    chartRef.current.applyOptions({
      timeScale: { timeVisible: period === '1D' || period === '1W' },
    });
  }, [chartData, period]);

  // ── Period button handler — stops propagation so no modal opens ─
  const handlePeriod = (e: React.MouseEvent, p: Period) => {
    e.stopPropagation();
    e.preventDefault();
    if (p === period) return;
    setPeriod(p);
  };

  const isPos = periodChangePercent >= 0;

  // Relative "data as of" time
  const getDataAsOfLabel = (): string => {
    if (!lastUpdated || isFallback) return '';
    const diffMin = Math.round((Date.now() - lastUpdated.getTime()) / 60_000);
    const delayed = period === '1D' || period === '1W' ? 15 : 0;
    const totalMin = diffMin + delayed;
    if (totalMin < 1) return 'just now';
    if (totalMin < 60) return `${totalMin} min ago`;
    return `${Math.floor(totalMin / 60)}h ${totalMin % 60}m ago`;
  };

  return (
    <div className={`rounded-2xl shadow-sm overflow-hidden transition-all ${
      dark
        ? 'bg-[#0e2038] border border-white/8'
        : 'bg-white border border-slate-200'
    }`}>
      <div className="p-5 sm:p-6">

        {/* ── Index name ─────────────────────────────────────────── */}
        <h3 className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${
          dark ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {name}
        </h3>

        {/* ── Price + High / Low ──────────────────────────────────── */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className={`text-4xl sm:text-5xl font-black tracking-tight leading-none mb-2 ${
              dark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              {price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center gap-2 text-base font-bold ${
              isPos ? 'text-emerald-500' : 'text-red-500'
            }`}>
              {isPos ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <span>
                {periodChange > 0 ? '+' : ''}{periodChange.toFixed(2)}&nbsp;
                ({periodChangePercent > 0 ? '+' : ''}{periodChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className={`text-right text-xs leading-relaxed space-y-1 ${
            dark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <div className={`px-2 py-1 rounded border ${
              dark ? 'bg-white/5 border-white/8 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              H: <span className="font-semibold">
                {periodHigh.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className={`px-2 py-1 rounded border ${
              dark ? 'bg-white/5 border-white/8 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              L: <span className="font-semibold">
                {periodLow.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* ── Period buttons ──────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={e => handlePeriod(e, p)}
              onMouseDown={e => e.stopPropagation()}
              disabled={loading}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-60 ${
                period === p
                  ? dark
                    ? 'bg-slate-100 text-slate-900 shadow-md'
                    : 'bg-slate-900 text-white shadow-md'
                  : dark
                    ? 'bg-white/6 text-slate-400 border border-white/8 hover:bg-white/12'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
          {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin text-slate-400" />}
        </div>

      </div>{/* end padding wrapper */}

      {/* ── Lightweight Chart canvas ────────────────────────────── */}
      {/*   No padding here — chart fills edge-to-edge horizontally  */}
      <div
        className={`transition-opacity duration-200 ${loading ? 'opacity-30' : 'opacity-100'}`}
        style={{ height: 180 }}
      >
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* ── Footer: data delay + timestamp ─────────────────────── */}
      <div className={`flex items-center justify-between px-5 py-2.5 text-[10px] border-t ${
        dark
          ? 'border-white/5 text-slate-600 bg-white/2'
          : 'border-slate-100 text-slate-400 bg-slate-50/60'
      }`}>
        <span>
          {isFallback
            ? '🔒 Estimated shape · market closed'
            : `📊 ${DELAY_LABEL[period]}`}
        </span>
        {!isFallback && lastUpdated && (
          <span className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            Data ~{getDataAsOfLabel()}
          </span>
        )}
      </div>
    </div>
  );
};

export default CleanChart;