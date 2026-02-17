'use client'
import React, { useEffect, useRef, memo, useState, useCallback } from 'react';
import { Search, X, BarChart2, ChevronDown, Loader2 } from 'lucide-react';

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: 'light' | 'dark';
  height?: string;
}

const QUICK_STOCKS = [
  { label: 'AAPL',  symbol: 'NASDAQ:AAPL'     },
  { label: 'TSLA',  symbol: 'NASDAQ:TSLA'     },
  { label: 'NVDA',  symbol: 'NASDAQ:NVDA'     },
  { label: 'MSFT',  symbol: 'NASDAQ:MSFT'     },
  { label: 'GOOGL', symbol: 'NASDAQ:GOOGL'    },
  { label: 'META',  symbol: 'NASDAQ:META'     },
  { label: 'AMZN',  symbol: 'NASDAQ:AMZN'     },
  { label: 'BTC',   symbol: 'BITSTAMP:BTCUSD' },
];

const TIMEFRAMES = [
  { label: '1m',  value: '1'   },
  { label: '15m', value: '15'  },
  { label: '1h',  value: '60'  },
  { label: '4h',  value: '240' },
  { label: '1D',  value: 'D'   },
  { label: '1W',  value: 'W'   },
  { label: '1M',  value: 'M'   },
];

const INDICATORS = [
  { label: 'MA 20',  study: 'MASimple@tv-basicstudies', desc: 'Simple Moving Avg'  },
  { label: 'EMA 50', study: 'MAExp@tv-basicstudies',    desc: 'Exp Moving Avg'     },
  { label: 'RSI',    study: 'RSI@tv-basicstudies',      desc: 'Momentum (0–100)'  },
  { label: 'MACD',   study: 'MACD@tv-basicstudies',     desc: 'Trend & Momentum'  },
  { label: 'BB',     study: 'BB@tv-basicstudies',       desc: 'Bollinger Bands'   },
  { label: 'Volume', study: 'Volume@tv-basicstudies',   desc: 'Volume Bars'       },
];

// TradingView symbol search result type
interface TVSymbol {
  symbol: string;
  full_name: string;
  description: string;
  exchange: string;
  type: string;
}

function getLabel(sym: string) {
  return QUICK_STOCKS.find(s => s.symbol === sym)?.label
    ?? sym.split(':').pop() ?? sym;
}

// ─────────────────────────────────────────────────────────────
// MAIN WIDGET
// ─────────────────────────────────────────────────────────────
function TradingViewWidget({
  symbol: init = 'NASDAQ:AAPL',
  theme = 'dark',
  height = '500px',
}: TradingViewWidgetProps) {
  const container     = useRef<HTMLDivElement>(null);
  const searchRef     = useRef<HTMLInputElement>(null);
  const debounceRef   = useRef<ReturnType<typeof setTimeout>>();

  const [symbol,      setSymbol]      = useState(init);
  const [interval,    setInterval]    = useState('W');
  const [searchVal,   setSearchVal]   = useState('');
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [results,     setResults]     = useState<TVSymbol[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [indOpen,     setIndOpen]     = useState(false);
  const [activeInd,   setActiveInd]   = useState<string[]>([]);

  // ── TradingView symbol search API ────────────────────────
  // Uses TradingView's public symbol search endpoint
  const searchSymbols = useCallback(async (query: string) => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const url = `https://symbol-search.tradingview.com/symbol_search/v3/?text=${encodeURIComponent(query)}&type=&exchange=&lang=en&search_type=undefined&domain=production`;
      const res = await fetch(url);
      const data = await res.json();
      // data.symbols is the array
      const symbols: TVSymbol[] = (data.symbols || []).slice(0, 10).map((s: any) => ({
        symbol:      s.symbol,
        full_name:   s.exchange ? `${s.exchange}:${s.symbol}` : s.symbol,
        description: s.description || s.symbol,
        exchange:    s.exchange || '',
        type:        s.type || '',
      }));
      setResults(symbols);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchVal.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(() => searchSymbols(searchVal), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchVal, searchSymbols]);

  const selectSym = useCallback((sym: string) => {
    setSymbol(sym);
    setSearchVal('');
    setResults([]);
    setSearchOpen(false);
  }, []);

  const toggleInd = (study: string) =>
    setActiveInd(p => p.includes(study) ? p.filter(i => i !== study) : [...p, study]);

  // Close on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.sw-s')) setSearchOpen(false);
      if (!(e.target as HTMLElement).closest('.sw-i')) setIndOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 40);
  }, [searchOpen]);

  // Render TradingView chart
  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    const script = document.createElement('script');
    script.src   = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type  = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true, symbol, interval,
      timezone: 'Etc/UTC',
      theme, style: '1', locale: 'en',
      backgroundColor: '#0D1117',
      gridColor: 'rgba(255,255,255,0.04)',
      allow_symbol_change: true,
      save_image: true, calendar: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      support_host: 'https://www.tradingview.com',
      ...(activeInd.length ? { studies: activeInd } : {}),
    });
    const wrap = document.createElement('div');
    wrap.style.cssText = 'height:100%;width:100%';
    container.current.appendChild(wrap);
    wrap.appendChild(script);
    return () => { if (container.current) container.current.innerHTML = ''; };
  }, [symbol, interval, theme, activeInd]);

  const btnStyle = (active: boolean): React.CSSProperties => ({
    height: 30, padding: '0 10px', borderRadius: 6,
    border: `1px solid ${active ? '#C9A84C' : '#1E3050'}`,
    background: active ? '#C9A84C' : 'transparent',
    color: active ? '#0D1117' : '#7A9AB8',
    fontSize: 11, fontWeight: 700,
    cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
    transition: 'all 0.15s',
  });

  // Type badge color
  const typeBadge = (type: string) => {
    const map: Record<string, string> = {
      stock: '#3B82F6', index: '#8B5CF6', crypto: '#F59E0B',
      forex: '#10B981', fund: '#EC4899', dr: '#6366F1',
    };
    return map[type] || '#4B5563';
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* ══ TOOLBAR ══════════════════════════════════════════ */}
      <div style={{
        background: '#0E1C2F', border: '1px solid #1E3050',
        borderRadius: 12, padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>

        {/* ROW 1: Search + Indicators */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>

          {/* SEARCH INPUT */}
          <div className="sw-s" style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <div
              onClick={() => setSearchOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                height: 36, padding: '0 12px', borderRadius: 8,
                border: `1px solid ${searchOpen ? 'rgba(201,168,76,0.5)' : '#1E3050'}`,
                background: '#070F1A', cursor: 'text',
                transition: 'border-color 0.15s',
              }}
            >
              <Search style={{ width: 14, height: 14, color: '#C9A84C', flexShrink: 0 }} />

              {searchOpen ? (
                <input
                  ref={searchRef}
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && results[0]) selectSym(results[0].full_name);
                    if (e.key === 'Escape') { setSearchOpen(false); setSearchVal(''); }
                  }}
                  placeholder="Koi bhi stock, index, crypto type karo..."
                  style={{
                    flex: 1, background: 'transparent', border: 'none',
                    outline: 'none', fontSize: 12, color: '#E8F0FA',
                  }}
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <>
                  <span style={{ fontSize: 11, color: '#5A7A9A', flex: 1 }}>
                    Search any stock, index, crypto...
                  </span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 5,
                    background: 'rgba(201,168,76,0.15)', color: '#C9A84C',
                    fontSize: 11, fontWeight: 700,
                    maxWidth: 100, overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {getLabel(symbol)}
                  </span>
                </>
              )}

              {searchOpen && searchVal && (
                <button
                  onClick={e => { e.stopPropagation(); setSearchVal(''); setResults([]); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                >
                  <X style={{ width: 13, height: 13, color: '#3D5068' }} />
                </button>
              )}

              {loading && (
                <Loader2 style={{ width: 13, height: 13, color: '#C9A84C', flexShrink: 0, animation: 'spin 1s linear infinite' }} />
              )}
            </div>

            {/* Results dropdown */}
            {searchOpen && (searchVal || results.length > 0) && (
              <div style={{
                position: 'absolute', left: 0, top: 'calc(100% + 6px)',
                zIndex: 100, width: '100%', minWidth: 280,
                borderRadius: 12, border: '1px solid #1E3050',
                background: '#070F1A',
                boxShadow: '0 20px 60px rgba(0,0,0,0.85)',
                overflow: 'hidden',
              }}>
                {/* Search hint when empty */}
                {!searchVal && (
                  <div style={{ padding: '20px 16px', textAlign: 'center' }}>
                    <Search style={{ width: 20, height: 20, color: '#2D4060', margin: '0 auto 8px' }} />
                    <p style={{ fontSize: 12, color: '#3D5068', margin: 0 }}>
                      Type  — NSE, BSE, NASDAQ, NYSE, crypto 
                    </p>
                  </div>
                )}

                {/* Loading */}
                {searchVal && loading && (
                  <div style={{ padding: '16px', textAlign: 'center' }}>
                    <p style={{ fontSize: 12, color: '#3D5068', margin: 0 }}>Searching...</p>
                  </div>
                )}

                {/* Results */}
                {!loading && results.length > 0 && (
                  <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                    {results.map((s, i) => (
                      <button
                        key={`${s.full_name}-${i}`}
                        onClick={() => selectSym(s.full_name)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center',
                          gap: 10, padding: '10px 14px',
                          background: 'none', border: 'none',
                          cursor: 'pointer', textAlign: 'left',
                          borderBottom: '1px solid rgba(30,48,80,0.5)',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.07)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        {/* Exchange badge */}
                        <span style={{
                          fontSize: 9, fontWeight: 800, padding: '2px 5px',
                          borderRadius: 4, background: 'rgba(30,48,80,0.8)',
                          color: '#7A9AB8', flexShrink: 0, textTransform: 'uppercase',
                          minWidth: 36, textAlign: 'center',
                        }}>
                          {s.exchange || '—'}
                        </span>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#E8F0FA' }}>
                              {s.symbol}
                            </span>
                            {s.type && (
                              <span style={{
                                fontSize: 9, padding: '1px 5px', borderRadius: 3,
                                background: `${typeBadge(s.type)}22`,
                                color: typeBadge(s.type),
                                fontWeight: 700, textTransform: 'uppercase',
                              }}>
                                {s.type}
                              </span>
                            )}
                          </div>
                          <p style={{
                            fontSize: 11, color: '#4A6480', margin: '1px 0 0',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {s.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No results */}
                {!loading && searchVal && results.length === 0 && (
                  <p style={{ fontSize: 12, color: '#3D5068', padding: '16px', textAlign: 'center', margin: 0 }}>
                    Koi result nahi mila — full symbol try karo (e.g. AAPL, RELIANCE)
                  </p>
                )}
              </div>
            )}
          </div>

          {/* INDICATORS */}
          <div className="sw-i" style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setIndOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                height: 36, padding: '0 12px', borderRadius: 8, cursor: 'pointer',
                border: `1px solid ${activeInd.length ? 'rgba(201,168,76,0.5)' : '#1E3050'}`,
                background: activeInd.length ? 'rgba(201,168,76,0.1)' : '#070F1A',
                color: activeInd.length ? '#C9A84C' : '#7A9AB8',
                fontSize: 11, fontWeight: 700,
              }}
            >
              <BarChart2 style={{ width: 14, height: 14 }} />
              <span>Ind.</span>
              {activeInd.length > 0 && (
                <span style={{
                  width: 16, height: 16, borderRadius: '50%', background: '#C9A84C',
                  color: '#0D1117', fontSize: 9, fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {activeInd.length}
                </span>
              )}
              <ChevronDown style={{ width: 12, height: 12, transform: indOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>

            {indOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 6px)', zIndex: 50,
                width: 220, borderRadius: 12, border: '1px solid #1E3050',
                background: '#070F1A', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', overflow: 'hidden',
              }}>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2D4060', padding: '10px 16px', borderBottom: '1px solid #1E3050', margin: 0 }}>
                  Indicators
                </p>
                <div style={{ padding: '6px 8px' }}>
                  {INDICATORS.map(ind => {
                    const on = activeInd.includes(ind.study);
                    return (
                      <button key={ind.study} onClick={() => toggleInd(ind.study)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center',
                          justifyContent: 'space-between', padding: '10px',
                          borderRadius: 8, background: on ? 'rgba(201,168,76,0.08)' : 'none',
                          border: 'none', cursor: 'pointer', textAlign: 'left',
                        }}
                        onMouseEnter={e => { if (!on) e.currentTarget.style.background = 'rgba(30,48,80,0.6)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = on ? 'rgba(201,168,76,0.08)' : 'none'; }}
                      >
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 700, color: on ? '#C9A84C' : '#C8D8E8', margin: 0 }}>{ind.label}</p>
                          <p style={{ fontSize: 10, color: '#3D5068', margin: '2px 0 0' }}>{ind.desc}</p>
                        </div>
                        <div style={{ width: 32, height: 16, borderRadius: 8, flexShrink: 0, background: on ? '#C9A84C' : '#1E3050', position: 'relative', transition: 'background 0.2s' }}>
                          <div style={{ position: 'absolute', top: 2, width: 12, height: 12, borderRadius: '50%', background: '#fff', left: on ? 18 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
                {activeInd.length > 0 && (
                  <div style={{ padding: '8px 16px', borderTop: '1px solid #1E3050' }}>
                    <button onClick={() => setActiveInd([])}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#3D5068', fontWeight: 600 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#3D5068')}
                    >Clear all</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ROW 2: Quick picks */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2D4060', marginBottom: 6 }}>
            Quick Pick
          </p>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {QUICK_STOCKS.map(s => (
              <button key={s.symbol} onClick={() => setSymbol(s.symbol)}
                style={btnStyle(symbol === s.symbol)}
                onMouseEnter={e => { if (symbol !== s.symbol) { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'; e.currentTarget.style.color = '#C9A84C'; }}}
                onMouseLeave={e => { if (symbol !== s.symbol) { e.currentTarget.style.borderColor = '#1E3050'; e.currentTarget.style.color = '#7A9AB8'; }}}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ROW 3: Timeframes */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2D4060', marginBottom: 6 }}>
            Timeframe
          </p>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {TIMEFRAMES.map(tf => (
              <button key={tf.value} onClick={() => setInterval(tf.value)}
                style={btnStyle(interval === tf.value)}
                onMouseEnter={e => { if (interval !== tf.value) { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'; e.currentTarget.style.color = '#C9A84C'; }}}
                onMouseLeave={e => { if (interval !== tf.value) { e.currentTarget.style.borderColor = '#1E3050'; e.currentTarget.style.color = '#7A9AB8'; }}}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active indicators */}
        {activeInd.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2D4060' }}>Active:</span>
            {activeInd.map(study => {
              const ind = INDICATORS.find(i => i.study === study);
              return (
                <span key={study} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 5, background: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.25)', fontSize: 11, fontWeight: 600 }}>
                  {ind?.label}
                  <button onClick={() => toggleInd(study)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#C9A84C', display: 'flex' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#C9A84C')}>
                    <X style={{ width: 10, height: 10 }} />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* ══ CHART ════════════════════════════════════════════ */}
      <div
        ref={container}
        style={{ width: '100%', height, borderRadius: 12, overflow: 'hidden', border: '1px solid #1E3050', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
      >
        <div style={{ height: '100%', width: '100%' }} />
      </div>

            

      {/* CSS for spinner */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default memo(TradingViewWidget);