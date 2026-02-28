
'use client'
import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from "@/controllers/Themecontext";

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: 'light' | 'dark';
  height?: string;
}

function TradingViewWidget({
  symbol = 'NASDAQ:AAPL',
  theme: propTheme,
  height = '600px',
}: TradingViewWidgetProps) {
  const { theme: globalTheme } = useTheme();
  const finalTheme = propTheme || globalTheme || 'dark';

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol,
      interval: 'D',
      timezone: 'Asia/Kolkata',
      theme: finalTheme,
      style: '1',
      locale: 'en',
      backgroundColor: finalTheme === 'light' ? '#F8F7F4' : '#0F0F0F',
      gridColor: finalTheme === 'light' ? 'rgba(13,39,66,0.06)' : 'rgba(242,242,242,0.06)',
      allow_symbol_change: true,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      save_image: true,
      watchlist: [],
      withdateranges: false,
      compareSymbols: [],
      studies: [],
      autosize: true,
    });

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'height:100%;width:100%';
    container.current.appendChild(wrapper);
    wrapper.appendChild(script);

    return () => {
      if (container.current) container.current.innerHTML = '';
    };
  }, [symbol, finalTheme]);

  return (
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
    />
  );
}

export default memo(TradingViewWidget);
