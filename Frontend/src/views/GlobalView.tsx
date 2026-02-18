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
    <div className="flex items-start gap-3 p-4 mb-8 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
      <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
      <div>
        <strong className="block mb-1 text-red-800">Error loading data</strong>
        <span>{error}</span>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, children }: { icon?: any; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      {Icon && <Icon className="w-5 h-5 text-slate-600" />}
      <h2 className="text-2xl font-bold text-slate-900">{children}</h2>
    </div>
  );
}

const VIX_STYLE: Record<string, string> = {
  low:      "bg-emerald-50 border-emerald-200 text-emerald-700",
  moderate: "bg-amber-50 border-amber-200 text-amber-700",
  high:     "bg-orange-50 border-orange-200 text-orange-700",
  extreme:  "bg-red-50 border-red-200 text-red-700",
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
      <div className="text-center py-16 text-slate-400">
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
              className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all border ${
                selectedIndex === idx
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                {market.name}
                <span className={`text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
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
      {/* Clean white background */}
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">

          {/* ── Premium Header ── */}
          <div className="mb-10">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold mb-3">
                    <Activity className="w-3.5 h-3.5" />
                    LIVE MARKETS
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-2">
                    Global Financial Markets
                  </h1>
                  <p className="text-slate-600">
                    Real-time data · Click any chart for detailed analysis
                  </p>
                </div>

                <Button
                  onClick={handleRefresh}
                  disabled={refreshing || isLoading}
                  className="bg-slate-900 hover:bg-slate-800 text-white border-0 px-6 py-6 shadow-md"
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
              <div className="h-96 bg-slate-50 rounded-2xl animate-pulse border border-slate-200" />
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
              <div className="h-96 bg-slate-50 rounded-2xl animate-pulse border border-slate-200" />
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
              <div className="h-96 bg-slate-50 rounded-2xl animate-pulse border border-slate-200" />
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
                    <div key={i} className="h-40 bg-slate-50 rounded-xl animate-pulse border border-slate-200" />
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
                    <div key={i} className="h-40 bg-slate-50 rounded-xl animate-pulse border border-slate-200" />
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
                          unit={c.unit}
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
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-pulse text-slate-400">Loading...</div>
                  </div>
                ) : bondsData.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {bondsData.map((bond: BondYield, i: number) => {
                      const pos = bond.change >= 0;
                      return (
                        <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div>
                            <h3 className="font-bold text-slate-900">{bond.name}</h3>
                            <p className={`text-sm font-semibold mt-1 ${pos ? "text-emerald-600" : "text-red-600"}`}>
                              {pos ? "+" : ""}{bond.change.toFixed(3)}%
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-black text-slate-900">
                              {bond.yield.toFixed(3)}%
                            </div>
                            <div className={`flex items-center gap-1 mt-1 justify-end ${pos ? "text-emerald-600" : "text-red-600"}`}>
                              {pos ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="p-12 text-center text-slate-400">Bond data unavailable</p>
                )}
              </div>
            </div>

            {/* VIX */}
            <div>
              <SectionTitle icon={Percent}>Volatility Index (VIX)</SectionTitle>
              {isLoading ? (
                <div className="h-64 bg-slate-50 rounded-2xl animate-pulse border border-slate-200" />
              ) : data?.vix ? (
                <div className={`rounded-2xl border p-10 flex flex-col items-center justify-center gap-4 shadow-sm ${VIX_STYLE[data.vix.sentiment]}`}>
                  <div className="text-7xl font-black text-slate-900">
                    {data.vix.value.toFixed(2)}
                  </div>
                  <p className="text-lg font-bold text-slate-700">
                    {data.vix.change >= 0 ? "+" : ""}{data.vix.change.toFixed(2)} ({data.vix.changePercent.toFixed(2)}%)
                  </p>
                  <span className={`px-6 py-2 rounded-full text-sm font-bold border uppercase ${VIX_STYLE[data.vix.sentiment]}`}>
                    {data.vix.sentiment} volatility
                  </span>
                </div>
              ) : (
                <div className="h-64 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <p className="text-slate-400">VIX data unavailable</p>
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
                    <div key={i} className="h-56 bg-slate-50 rounded-2xl animate-pulse border border-slate-200" />
                  ))
                : regionsData.map((r: RegionSummary) => {
                    const pos = r.avgChange >= 0;
                    return (
                      <div key={r.name} className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all p-5">
                        <div className="flex justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{r.flag}</span>
                            <div>
                              <h3 className="font-bold text-slate-900">{r.name}</h3>
                              <p className="text-xs text-slate-500">{r.countries.join(", ")}</p>
                            </div>
                          </div>
                          <div className={`text-2xl font-black ${pos ? "text-emerald-600" : "text-red-600"}`}>
                            {pos ? "+" : ""}{r.avgChange.toFixed(2)}%
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                            <span className="text-slate-600">Best</span>
                            <span className="text-emerald-700 font-bold">{r.best.name} ({r.best.change.toFixed(2)}%)</span>
                          </div>
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-red-50 border border-red-200">
                            <span className="text-slate-600">Worst</span>
                            <span className="text-red-700 font-bold">{r.worst.name} ({r.worst.change.toFixed(2)}%)</span>
                          </div>
                        </div>

                        <div className="flex justify-between text-xs text-slate-500 mt-4 pt-4 border-t border-slate-200">
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
                  High:   "bg-red-50 text-red-700 border-red-200",
                  Medium: "bg-amber-50 text-amber-700 border-amber-200",
                  Low:    "bg-emerald-50 text-emerald-700 border-emerald-200",
                };
                const d = new Date(ev.date);
                const dateStr = isNaN(d.getTime()) ? ev.date : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

                return (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all">
                    <div className="flex gap-2 flex-wrap mb-2">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${IC[ev.impact]}`}>
                        {ev.impact}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
                        {ev.region}
                      </span>
                      <span className="ml-auto text-xs text-slate-500 font-medium">{dateStr}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-800">{ev.title}</h3>
                  </div>
                );
              })}
            </div>
          </section>

          {/* STATUS BAR */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-3 text-slate-600">
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
                      <Wifi className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-slate-400" />
                    )}
                    <span className={`uppercase font-bold text-xs ${data.marketStatus[region] === "open" ? "text-emerald-600" : "text-slate-400"}`}>
                      {region} {data.marketStatus[region]}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${loading === "loading" || refreshing ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                  <span className="font-bold text-xs text-emerald-600">
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