'use client'
import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: 'light' | 'dark';
  height?: string;
}

function TradingViewWidget({ 
  symbol = "NASDAQ:AAPL",
  theme = "dark",
  height = "500px"
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear previous content
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": symbol,
      "interval": "W",
      "timezone": "Etc/UTC",
      "theme": theme,
      "style": "1",
      "locale": "en",
      "backgroundColor": theme === "dark" ? "#0F0F0F" : "#ffffff",
      "gridColor": theme === "dark" ? "rgba(242, 242, 242, 0.06)" : "rgba(0, 0, 0, 0.06)",
      "allow_symbol_change": true,
      "save_image": true,
      "calendar": false,
      "hide_side_toolbar": true,
      "hide_top_toolbar": false,
      "hide_legend": false,
      "hide_volume": false,
      "support_host": "https://www.tradingview.com"
    });

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";

    container.current.appendChild(widgetContainer);
    widgetContainer.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, theme]);

  return (
    <div 
      className="tradingview-widget-container rounded-xl overflow-hidden border border-border/50 bg-card shadow-lg hover:shadow-xl transition-all duration-300" 
      ref={container}
      style={{ height: height, width: "100%" }}
    >
      <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
}

export default memo(TradingViewWidget);