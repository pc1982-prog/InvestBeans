import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import TradingViewWidget from './TradingViewWidget';

interface TradingViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  name: string;
}

// CORRECT TradingView symbol mapping (verified on TradingView)
const SYMBOL_MAP: Record<string, string> = {
  // US Indices
  '^DJI': 'TVC:DJI',           // Dow Jones Industrial Average
  '^GSPC': 'TVC:SPX',          // S&P 500
  '^IXIC': 'NASDAQ:NDX',       // Nasdaq 100
  
  // European Indices
  '^FTSE': 'TVC:UKX',          // FTSE 100
  '^GDAXI': 'TVC:DAX',         // DAX
  '^FCHI': 'TVC:CAC',          // CAC 40
  
  // Asian Indices
  '^N225': 'TVC:NI225',        // Nikkei 225
  '^HSI': 'TVC:HSI',           // Hang Seng
  '^SSEC': 'SSE:000001',       // Shanghai Composite
  
  // Commodities
  'GC=F': 'TVC:GOLD',          // Gold
  'SI=F': 'TVC:SILVER',        // Silver
  'CL=F': 'TVC:USOIL',         // Crude Oil WTI
  'BZ=F': 'TVC:UKOIL',         // Brent Crude
  'NG=F': 'NYMEX:NG1!',        // Natural Gas
  
  // Forex (already in correct format)
  'EUR/USD': 'FX:EURUSD',
  'USD/JPY': 'FX:USDJPY',
  'GBP/USD': 'FX:GBPUSD',
  'USD/INR': 'FX:USDINR',
};

export default function TradingViewModal({ isOpen, onClose, symbol, name }: TradingViewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Get TradingView symbol
  const tvSymbol = SYMBOL_MAP[symbol] || symbol;
  
  console.log(`[TradingView] Mapping: ${symbol} → ${tvSymbol}`);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-7xl max-h-[90vh] bg-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700 bg-gray-800/80">
          <div>
            <h2 className="text-xl font-bold text-white">{name}</h2>
            <p className="text-xs text-gray-400 mt-1">Advanced Trading Chart · {tvSymbol}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)] bg-gray-900">
          <TradingViewWidget 
            symbol={tvSymbol}
            theme="dark"
            height="600px"
          />
        </div>
      </div>
    </div>
  );
}