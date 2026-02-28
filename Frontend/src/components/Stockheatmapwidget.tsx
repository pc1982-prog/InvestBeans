
import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from "@/controllers/Themecontext";

interface StockHeatmapWidgetProps {
  dataSource?: string;
}

function StockHeatmapWidget({ dataSource = "SENSEX" }: StockHeatmapWidgetProps) {
  const { theme } = useTheme();
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = '';
      
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "dataSource": dataSource,
        "blockSize": "market_cap_basic",
        "blockColor": "change",
        "grouping": "sector",
        "locale": "en",
        "symbolUrl": "",
        "colorTheme": theme,
        "exchanges": [],
        "hasTopBar": true,
        "isDataSetEnabled": true,
        "isZoomEnabled": true,
        "hasSymbolTooltip": true,
        "isMonoSize": false,
        "width": "100%",
        "height": "100%"
      });
      container.current.appendChild(script);
    }
  }, [dataSource, theme]);

  return (
    <div className="tradingview-widget-container w-full h-full" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/heatmap/stock/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Stock Heatmap</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
}

export default memo(StockHeatmapWidget);
