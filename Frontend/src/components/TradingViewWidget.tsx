'use client'
import React, { useEffect, useRef, memo, useState } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: 'light' | 'dark';
  height?: string;
  mode?: 'domestic' | 'global';
}

// Indian index tabs for domestic mode
const DOMESTIC_INDICES = [
  { label: 'IndiaVIX',         symbol: 'NSE:INDIAVIX'     },
  { label: 'Sensex',           symbol: 'BSE:SENSEX'       },
  { label: 'Nifty 50',         symbol: 'NSE:NIFTY50'      },
  { label: 'BankNifty',        symbol: 'NSE:BANKNIFTY'    },
  { label: 'Nifty LargeMid 250', symbol: 'NSE:NIFTYLARGEMIDCAP250' },
  { label: 'Nifty Midcap 100', symbol: 'NSE:NIFTYMDCP100' },
  { label: 'Nifty SmallCap 100', symbol: 'NSE:NIFTYSMLCAP100' },
  { label: 'Nifty Auto',       symbol: 'NSE:NIFTYAUTO'    },
  { label: 'Nifty Pharma',     symbol: 'NSE:NIFTYPHARMA'  },
  { label: 'Nifty Metal',      symbol: 'NSE:NIFTYMETAL'   },
  { label: 'Nifty Realty',     symbol: 'NSE:NIFTYREALTY'  },
  { label: 'Nifty Ind Defence',symbol: 'NSE:NIFTYINDIADEFENCE' },
  { label: 'Nifty IT',         symbol: 'NSE:NIFTYIT'      },
];

// Global quick picks for global mode
const GLOBAL_STOCKS = [
  { label: 'AAPL',  symbol: 'NASDAQ:AAPL'     },
  { label: 'TSLA',  symbol: 'NASDAQ:TSLA'     },
  { label: 'NVDA',  symbol: 'NASDAQ:NVDA'     },
  { label: 'MSFT',  symbol: 'NASDAQ:MSFT'     },
  { label: 'GOOGL', symbol: 'NASDAQ:GOOGL'    },
  { label: 'META',  symbol: 'NASDAQ:META'     },
  { label: 'AMZN',  symbol: 'NASDAQ:AMZN'     },
  { label: 'BTC',   symbol: 'BITSTAMP:BTCUSD' },
];

function TradingViewWidget({
  symbol: initSymbol,
  theme = 'dark',
  height = '500px',
  mode = 'domestic',
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  const tabs = mode === 'domestic' ? DOMESTIC_INDICES : GLOBAL_STOCKS;
  const defaultSymbol = initSymbol ?? tabs[0].symbol;
  const [symbol, setSymbol] = useState(defaultSymbol);

  // Reset to first tab when mode changes
  useEffect(() => {
    setSymbol(tabs[0].symbol);
  }, [mode]);

  // Render TradingView chart
  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: 'D',
      timezone: 'Asia/Kolkata',
      theme,
      style: '1',
      locale: 'en',
      backgroundColor: '#0D1117',
      gridColor: 'rgba(255,255,255,0.04)',
      allow_symbol_change: false,
      save_image: true,
      calendar: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      support_host: 'https://www.tradingview.com',
    });
    const wrap = document.createElement('div');
    wrap.style.cssText = 'height:100%;width:100%';
    container.current.appendChild(wrap);
    wrap.appendChild(script);
    return () => { if (container.current) container.current.innerHTML = ''; };
  }, [symbol, theme]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* ── INDEX TABS ─────────────────────────────────────── */}
      <div style={{
        background: '#0E1C2F',
        border: '1px solid #1E3050',
        borderRadius: 12,
        padding: '10px 14px',
      }}>
        <p style={{
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.1em', color: '#2D4060', marginBottom: 8, marginTop: 0,
        }}>
          {mode === 'domestic' ? 'Indian Indices' : 'Global Markets'}
        </p>
        <div style={{
          display: 'flex', gap: 6, flexWrap: 'wrap',
        }}>
          {tabs.map(t => {
            const active = symbol === t.symbol;
            return (
              <button
                key={t.symbol}
                onClick={() => setSymbol(t.symbol)}
                style={{
                  height: 32,
                  padding: '0 12px',
                  borderRadius: 7,
                  border: `1px solid ${active ? '#C9A84C' : '#1E3050'}`,
                  background: active ? '#C9A84C' : 'transparent',
                  color: active ? '#0D1117' : '#7A9AB8',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
                    e.currentTarget.style.color = '#C9A84C';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.borderColor = '#1E3050';
                    e.currentTarget.style.color = '#7A9AB8';
                  }
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CHART ──────────────────────────────────────────── */}
      <div
        ref={container}
        style={{
          width: '100%',
          height,
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid #1E3050',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);