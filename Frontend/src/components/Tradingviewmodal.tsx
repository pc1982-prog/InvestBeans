import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import TradingViewWidget from './TradingViewWidget';

interface TradingViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  name: string;
}

// VERIFIED working symbols from TradingView screenshots
const SYMBOL_MAP: Record<string, string> = {
  // US Indices (verified working)
  '^DJI': 'DOW',              // Dow Jones - Screenshot shows "DOW" works
  '^GSPC': 'SPY',             // S&P 500 - Screenshot shows "SPY" (ETF) works
  '^IXIC': 'NDAQ',            // Nasdaq - Screenshot shows "NDAQ" works
  
  // European Indices (verified working)
  '^FTSE': 'I08634',          // FTSE 100 - Screenshot shows this works
  '^GDAXI': 'DAX6C2+',        // DAX - Screenshot shows this works
  '^FCHI': 'F73774',          // CAC 40 - Screenshot shows this works
  
  // Asian Indices (verified working)
  '^N225': 'NIKKIGL',         // Nikkei 225 - Screenshot shows this works
  '^HSI': 'HSI',              // Hang Seng
  '^SSEC': 'SSEC',            // Shanghai Composite
  
  // Commodities - use proper TradingView symbols
  'GC=F': 'GOLD',             // Gold
  'SI=F': 'SILVER',           // Silver
  'CL=F': 'USOIL',            // Crude Oil WTI
  'BZ=F': 'UKOIL',            // Brent Crude
  'NG=F': 'NATURALGAS',       // Natural Gas
  
  // Forex - standard format
  'EUR/USD': 'EURUSD',
  'USD/JPY': 'USDJPY',
  'GBP/USD': 'GBPUSD',
  'USD/INR': 'USDINR',
};

export default function TradingViewModal({ isOpen, onClose, symbol, name }: TradingViewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Get TradingView symbol
  const tvSymbol = SYMBOL_MAP[symbol] || symbol.replace('^', '');
  
  console.log(`[TradingView] Opening: ${symbol} → ${tvSymbol}`);

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
            <p className="text-xs text-gray-400 mt-1">Symbol: {tvSymbol}</p>
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