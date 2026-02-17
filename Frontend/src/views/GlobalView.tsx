import Layout from "@/components/Layout";
import CleanChart from "@/components/CleanChart";
import ForexCard from "@/components/Forexcard";
import CommodityCard from "@/components/Commoditycard";
import TradingViewModal from "@/components/Tradingviewmodal";
import { useGlobalMarkets } from "@/hooks/useGlobalMarkets";
import { IndexQuote, ForexPair, BondYield, Commodity, RegionSummary } from "@/services/globalMarkets/types";
import {
  TrendingUp, TrendingDown, Activity, Globe, 
  Clock, MapPin, RefreshCw, AlertCircle, Wifi, WifiOff,
  Landmark, DollarSign, BarChart3, LineChart, Percent, Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

// ── Helpers ────────────────────────────────────────────────

function ErrorBanner({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <div className="flex items-start gap-3 p-4 mb-8 rounded-xl bg-red-900/20 border border-red-800/30 text-red-300 text-sm">
      <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
      <div>
        <strong className="block mb-1">Error loading data</strong>
        <span>{error}</span>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, children }: { icon?: any; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      {Icon && <Icon className="w-5 h-5 text-gray-400" />}
      <h2 className="text-2xl font-bold text-white">{children}</h2>
    </div>
  );
}

const VIX_STYLE: Record<string, string> = {
  low:      "bg-emerald-900/20 border-emerald-800/30 text-emerald-400",
  moderate: "bg-amber-900/20 border-amber-800/30 text-amber-400",
  high:     "bg-orange-900/20 border-orange-800/30 text-orange-400",
  extreme:  "bg-red-900/20 border-red-800/30 text-red-400",
};

// ── Market Selector Component ──
interface MarketSelectorProps {
  title: string;
  markets: IndexQuote[];
  icon?: any;
  onChartClick: (symbol: string, name: string) => void;
}

function MarketSelector({ title, markets, icon, onChartClick }: MarketSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (markets.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>No market data available</p>
      </div>
    );
  }

  const selectedMarket = markets[selectedIndex];

  return (
    <section className="mb-10">
      <SectionTitle icon={icon}>{title}</SectionTitle>

      {/* Market Selection Pills */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {markets.map((market, idx) => {
          const isPositive = market.changePercent >= 0;
          return (
            <button
              key={market.symbol}
              onClick={() => setSelectedIndex(idx)}
              className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                selectedIndex === idx
                  ? 'bg-gray-700 text-white border border-gray-600'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-800 hover:border-gray-600'
              }`}
            >
              <span className="flex items-center gap-2">
                {market.name}
                <span className={`text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}{market.changePercent.toFixed(2)}%
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Single Large Card - Clickable */}
      <div 
        onClick={() => onChartClick(selectedMarket.symbol, selectedMarket.name)}
        className="cursor-pointer hover:opacity-90 transition-opacity"
      >
        <CleanChart
          symbol={selectedMarket.symbol}
          name={selectedMarket.name}
          price={selectedMarket.price}
          change={selectedMarket.change}
          changePercent={selectedMarket.changePercent}
          high={selectedMarket.high}
          low={selectedMarket.low}
          isPositive={selectedMarket.changePercent >= 0}
          candles={selectedMarket.candles ?? []}
        />
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
export default function GlobalView() {
  const { data, loading, error, lastUpdated, refresh } = useGlobalMarkets();
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSymbol, setModalSymbol] = useState('');
  const [modalName, setModalName] = useState('');

  const isLoading = loading === "idle" || loading === "loading";

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleChartClick = (symbol: string, name: string) => {
    setModalSymbol(symbol);
    setModalName(name);
    setModalOpen(true);
  };

  // Memoize data
  const usMarkets = useMemo(() => data?.indices?.us || [], [data?.indices?.us]);
  const europeMarkets = useMemo(() => data?.indices?.europe || [], [data?.indices?.europe]);
  const asiaMarkets = useMemo(() => data?.indices?.asia || [], [data?.indices?.asia]);
  const forexData = useMemo(() => data?.forex || [], [data?.forex]);
  const commoditiesData = useMemo(() => data?.commodities || [], [data?.commodities]);
  const bondsData = useMemo(() => data?.bonds || [], [data?.bonds]);
  const regionsData = useMemo(() => data?.regions || [], [data?.regions]);
  const eventsData = useMemo(() => data?.events || [], [data?.events]);

  return (
    <Layout>
      {/* Simple dark background */}
      <div className="min-h-screen bg-[#0a0e1a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">

          {/* ── Simple Header ── */}
          <div className="mb-10">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 text-xs font-semibold mb-3">
                    <Activity className="w-3.5 h-3.5" />
                    LIVE MARKETS
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">
                    Global Financial Markets
                  </h1>
                  <p className="text-gray-400">
                    Real-time data · Click any chart for detailed analysis
                  </p>
                </div>

                <Button
                  onClick={handleRefresh}
                  disabled={refreshing || isLoading}
                  className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 px-6 py-6"
                >
                  <RefreshCw className={`w-5 h-5 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                  <span className="font-semibold">Refresh</span>
                </Button>
              </div>
            </div>
          </div>

          <ErrorBanner error={error} />

          {/* US MARKETS */}
          {isLoading ? (
            <div className="mb-10">
              <div className="h-96 bg-gray-900/50 rounded-2xl animate-pulse border border-gray-800" />
            </div>
          ) : (
            <MarketSelector
              title="United States Markets"
              markets={usMarkets}
              icon={BarChart3}
              onChartClick={handleChartClick}
            />
          )}

          {/* EUROPE MARKETS */}
          {isLoading ? (
            <div className="mb-10">
              <div className="h-96 bg-gray-900/50 rounded-2xl animate-pulse border border-gray-800" />
            </div>
          ) : (
            <MarketSelector
              title="European Markets"
              markets={europeMarkets}
              icon={LineChart}
              onChartClick={handleChartClick}
            />
          )}

          {/* ASIA MARKETS */}
          {isLoading ? (
            <div className="mb-10">
              <div className="h-96 bg-gray-900/50 rounded-2xl animate-pulse border border-gray-800" />
            </div>
          ) : (
            <MarketSelector
              title="Asia Pacific Markets"
              markets={asiaMarkets}
              icon={Globe}
              onChartClick={handleChartClick}
            />
          )}

          {/* FOREX - Small Cards */}
          <section className="mb-10">
            <SectionTitle icon={DollarSign}>Foreign Exchange</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-40 bg-gray-900/50 rounded-xl animate-pulse border border-gray-800" />
                  ))
                : forexData.map((fx: ForexPair) => {
                    const pos = fx.changePercent >= 0;
                    return (
                      <div 
                        key={fx.pair}
                        onClick={() => handleChartClick(fx.pair, fx.pair)}
                        className="cursor-pointer transform hover:scale-[1.02] transition-transform"
                      >
                        <ForexCard
                          pair={fx.pair}
                          rate={fx.rate}
                          change={fx.change}
                          changePercent={fx.changePercent}
                          isPositive={pos}
                        />
                      </div>
                    );
                  })}
            </div>
          </section>

          {/* COMMODITIES - Small Cards */}
          <section className="mb-10">
            <SectionTitle icon={Briefcase}>Key Commodities</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-40 bg-gray-900/50 rounded-xl animate-pulse border border-gray-800" />
                  ))
                : commoditiesData.map((c: Commodity) => {
                    const pos = c.changePercent >= 0;
                    return (
                      <div 
                        key={c.symbol}
                        onClick={() => handleChartClick(c.symbol, c.name)}
                        className="cursor-pointer transform hover:scale-[1.02] transition-transform"
                      >
                        <CommodityCard
                          name={c.name}
                          price={c.price}
                          change={c.change}
                          changePercent={c.changePercent}
                          // unit={c.unit}
                          isPositive={pos}
                          candles={c.candles}
                        />
                      </div>
                    );
                  })}
            </div>
          </section>

          {/* BONDS & VIX */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Treasury Yields */}
            <div>
              <SectionTitle icon={Landmark}>Treasury Yields</SectionTitle>
              <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-pulse text-gray-500">Loading...</div>
                  </div>
                ) : bondsData.length > 0 ? (
                  <div className="divide-y divide-gray-800">
                    {bondsData.map((bond: BondYield, i: number) => {
                      const pos = bond.change >= 0;
                      return (
                        <div key={i} className="p-5 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
                          <div>
                            <h3 className="font-bold text-white">{bond.name}</h3>
                            <p className={`text-sm font-semibold mt-1 ${pos ? "text-emerald-400" : "text-red-400"}`}>
                              {pos ? "+" : ""}{bond.change.toFixed(3)}%
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-black text-white">
                              {bond.yield.toFixed(3)}%
                            </div>
                            <div className={`flex items-center gap-1 mt-1 justify-end ${pos ? "text-emerald-400" : "text-red-400"}`}>
                              {pos ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="p-12 text-center text-gray-500">Bond data unavailable</p>
                )}
              </div>
            </div>

            {/* VIX */}
            <div>
              <SectionTitle icon={Percent}>Volatility Index (VIX)</SectionTitle>
              {isLoading ? (
                <div className="h-64 bg-gray-900/50 rounded-2xl animate-pulse border border-gray-800" />
              ) : data?.vix ? (
                <div className={`rounded-2xl border p-10 flex flex-col items-center justify-center gap-4 bg-gray-900 ${VIX_STYLE[data.vix.sentiment]}`}>
                  <div className="text-7xl font-black text-white">
                    {data.vix.value.toFixed(2)}
                  </div>
                  <p className="text-lg font-bold text-gray-300">
                    {data.vix.change >= 0 ? "+" : ""}{data.vix.change.toFixed(2)} ({data.vix.changePercent.toFixed(2)}%)
                  </p>
                  <span className={`px-6 py-2 rounded-full text-sm font-bold border uppercase ${VIX_STYLE[data.vix.sentiment]}`}>
                    {data.vix.sentiment} volatility
                  </span>
                </div>
              ) : (
                <div className="h-64 rounded-2xl border border-gray-800 bg-gray-900/50 flex items-center justify-center">
                  <p className="text-gray-500">VIX data unavailable</p>
                </div>
              )}
            </div>
          </div>

          {/* REGIONAL PERFORMANCE */}
          <section className="mb-10">
            <SectionTitle icon={Globe}>Regional Performance</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-56 bg-gray-900/50 rounded-2xl animate-pulse border border-gray-800" />
                  ))
                : regionsData.map((r: RegionSummary) => {
                    const pos = r.avgChange >= 0;
                    return (
                      <div key={r.name} className="bg-gray-900 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all p-5">
                        <div className="flex justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{r.flag}</span>
                            <div>
                              <h3 className="font-bold text-white">{r.name}</h3>
                              <p className="text-xs text-gray-500">{r.countries.join(", ")}</p>
                            </div>
                          </div>
                          <div className={`text-2xl font-black ${pos ? "text-emerald-400" : "text-red-400"}`}>
                            {pos ? "+" : ""}{r.avgChange.toFixed(2)}%
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-900/20 border border-emerald-800/30">
                            <span className="text-gray-400">Best</span>
                            <span className="text-emerald-400 font-bold">{r.best.name} ({r.best.change.toFixed(2)}%)</span>
                          </div>
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-red-900/20 border border-red-800/30">
                            <span className="text-gray-400">Worst</span>
                            <span className="text-red-400 font-bold">{r.worst.name} ({r.worst.change.toFixed(2)}%)</span>
                          </div>
                        </div>

                        <div className="flex justify-between text-xs text-gray-500 mt-4 pt-4 border-t border-gray-800">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {r.countries.length} markets
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Live
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </section>

          {/* GLOBAL EVENTS */}
          <section className="mb-10">
            <SectionTitle>Global Events Calendar</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventsData.map((ev, i) => {
                const IC: Record<string, string> = {
                  High:   "bg-red-900/20 text-red-400 border-red-800/30",
                  Medium: "bg-amber-900/20 text-amber-400 border-amber-800/30",
                  Low:    "bg-emerald-900/20 text-emerald-400 border-emerald-800/30",
                };
                const d = new Date(ev.date);
                const dateStr = isNaN(d.getTime()) ? ev.date : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

                return (
                  <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-all">
                    <div className="flex gap-2 flex-wrap mb-2">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${IC[ev.impact]}`}>
                        {ev.impact}
                      </span>
                      <span className="px-2.5 py-1 bg-gray-800 text-gray-400 text-xs font-semibold rounded-full border border-gray-700">
                        {ev.region}
                      </span>
                      <span className="ml-auto text-xs text-gray-500 font-medium">{dateStr}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-gray-200">{ev.title}</h3>
                  </div>
                );
              })}
            </div>
          </section>

          {/* STATUS BAR */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-3 text-gray-400">
                <Activity className="w-5 h-5" />
                <span className="font-medium">
                  Last updated:{" "}
                  {lastUpdated
                    ? lastUpdated.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
                    : "Fetching..."}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-5">
                {data && (["us", "europe", "asia"] as const).map((region) => (
                  <div key={region} className="flex items-center gap-2">
                    {data.marketStatus[region] === "open" ? (
                      <Wifi className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-gray-600" />
                    )}
                    <span className={`uppercase font-bold text-xs ${data.marketStatus[region] === "open" ? "text-emerald-400" : "text-gray-600"}`}>
                      {region} {data.marketStatus[region]}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${loading === "loading" || refreshing ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
                  <span className="font-bold text-xs text-emerald-400">
                    {loading === "loading" || refreshing ? "UPDATING" : "LIVE"}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* TradingView Modal */}
      <TradingViewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        symbol={modalSymbol}
        name={modalName}
      />
    </Layout>
  );
}