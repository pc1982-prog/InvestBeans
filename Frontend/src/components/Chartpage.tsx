import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import TradingViewWidget from '@/components/TradingViewWidget';

// Symbol mapping from Yahoo to TradingView format
const SYMBOL_MAP: Record<string, string> = {
  '^DJI': 'DJIA',
  '^GSPC': 'SPX',
  '^IXIC': 'NASDAQ',
  '^FTSE': 'FTSE',
  '^GDAXI': 'DAX',
  '^FCHI': 'CAC',
  '^N225': 'NI225',
  '^HSI': 'HSI',
  '^SSEC': 'SSEC',
};

const EXCHANGE_PREFIX: Record<string, string> = {
  'DJIA': 'INDEX',
  'SPX': 'INDEX',
  'NASDAQ': 'INDEX',
  'FTSE': 'INDEX',
  'DAX': 'INDEX',
  'CAC': 'INDEX',
  'NI225': 'INDEX',
  'HSI': 'INDEX',
  'SSEC': 'INDEX',
};

export default function ChartPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();

  if (!symbol) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">No symbol provided</p>
        </div>
      </Layout>
    );
  }

  // Decode and map symbol
  const decodedSymbol = decodeURIComponent(symbol);
  const mappedSymbol = SYMBOL_MAP[decodedSymbol] || decodedSymbol.replace('^', '');
  const exchange = EXCHANGE_PREFIX[mappedSymbol] || 'NASDAQ';
  const tvSymbol = `${exchange}:${mappedSymbol}`;

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 max-w-7xl">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {mappedSymbol} Chart
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Advanced trading chart with technical indicators
            </p>
          </div>
        </div>

        {/* TradingView Widget */}
        <TradingViewWidget 
          symbol={tvSymbol}
          theme="dark"
          height="600px"
        />

      

      </div>
    </Layout>
  );
}