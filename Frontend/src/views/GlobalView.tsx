import Layout from "@/components/Layout";
import CleanChart from "@/components/CleanChart";
import ForexCard from "@/components/Forexcard";
import CommodityCard from "@/components/Commoditycard";
import { useGlobalMarkets } from "@/hooks/useGlobalMarkets";
import { IndexQuote, ForexPair, BondYield, Commodity, RegionSummary } from "@/services/globalMarkets/types";
import {
  TrendingUp, TrendingDown, Activity, Globe, ArrowRight,
  Clock, MapPin, RefreshCw, AlertCircle, Wifi, WifiOff,
  Landmark, DollarSign, BarChart3, LineChart, Percent, Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";

// ── Helpers ────────────────────────────────────────────────

function Skeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-48 sm:h-52 bg-muted/50 rounded-2xl border border-border/40 animate-pulse" />
      ))}
    </div>
  );
}

function ErrorBanner({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <div className="flex items-start gap-3 p-4 mb-8 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm shadow-sm">
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
    <div className="flex items-center gap-2.5 mb-5 md:mb-6">
      {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
        {children}
      </h2>
    </div>
  );
}

const VIX_STYLE: Record<string, string> = {
  low:      "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800/50",
  moderate: "bg-amber-50   border-amber-200   text-amber-800   dark:bg-amber-950/30   dark:border-amber-800/50",
  high:     "bg-orange-50  border-orange-200  text-orange-800  dark:bg-orange-950/30  dark:border-orange-800/50",
  extreme:  "bg-red-50     border-red-200     text-red-800     dark:bg-red-950/30     dark:border-red-800/50",
};

// ══════════════════════════════════════════════════════════════
export default function GlobalView() {
  const { data, loading, error, lastUpdated, refresh } = useGlobalMarkets();
  const [selectedIndex, setSelectedIndex] = useState("dow");
  const [refreshing, setRefreshing] = useState(false);

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

  // Memoize data to prevent unnecessary re-renders
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">

        {/* ── Professional Header ── */}
        <div className="mb-10 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-border/60">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 text-primary text-sm font-medium mb-3">
                <Globe className="w-4 h-4" />
                GLOBAL MARKETS
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Global Financial Markets
              </h1>
              <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-xl">
                Real-time data from major stock exchanges, currencies, bonds, commodities & volatility
              </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing || isLoading}
                className="border-primary/40 hover:bg-primary/5 min-w-[120px]"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>

              <Select value={selectedIndex} onValueChange={setSelectedIndex}>
                <SelectTrigger className="w-48 bg-card border-border/70">
                  <SelectValue placeholder="Benchmark" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dow">Dow Jones</SelectItem>
                  <SelectItem value="spx">S&P 500</SelectItem>
                  <SelectItem value="nasdaq">Nasdaq</SelectItem>
                  <SelectItem value="nikkei">Nikkei 225</SelectItem>
                  <SelectItem value="ftse">FTSE 100</SelectItem>
                  <SelectItem value="dax">DAX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <ErrorBanner error={error} />

        {/* US MARKETS */}
        <section className="mb-12 md:mb-16">
          <SectionTitle icon={BarChart3}>United States Markets</SectionTitle>
          {isLoading ? <Skeleton count={3} /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {usMarkets.map((idx) => (
                <CleanChart 
                  key={idx.symbol}
                  name={idx.name}
                  price={idx.price}
                  change={idx.change}
                  changePercent={idx.changePercent}
                  high={idx.high}
                  low={idx.low}
                  isPositive={idx.changePercent >= 0}
                />
              ))}
              {usMarkets.length === 0 && (
                <p className="col-span-full text-center py-12 text-muted-foreground">US data unavailable</p>
              )}
            </div>
          )}
        </section>

        {/* EUROPE MARKETS */}
        <section className="mb-12 md:mb-16">
          <SectionTitle icon={LineChart}>European Markets</SectionTitle>
          {isLoading ? <Skeleton count={3} /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {europeMarkets.map((idx) => (
                <CleanChart 
                  key={idx.symbol}
                  name={idx.name}
                  price={idx.price}
                  change={idx.change}
                  changePercent={idx.changePercent}
                  high={idx.high}
                  low={idx.low}
                  isPositive={idx.changePercent >= 0}
                />
              ))}
              {europeMarkets.length === 0 && (
                <p className="col-span-full text-center py-12 text-muted-foreground">Europe data unavailable</p>
              )}
            </div>
          )}
        </section>

        {/* ASIA PACIFIC MARKETS */}
        <section className="mb-12 md:mb-16">
          <SectionTitle icon={Activity}>Asia Pacific Markets</SectionTitle>
          {isLoading ? <Skeleton count={3} /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {asiaMarkets.map((idx) => (
                <CleanChart 
                  key={idx.symbol}
                  name={idx.name}
                  price={idx.price}
                  change={idx.change}
                  changePercent={idx.changePercent}
                  high={idx.high}
                  low={idx.low}
                  isPositive={idx.changePercent >= 0}
                />
              ))}
              {asiaMarkets.length === 0 && (
                <p className="col-span-full text-center py-12 text-muted-foreground">Asia data unavailable</p>
              )}
            </div>
          )}
        </section>

        {/* FOREX */}
        <section className="mb-12 md:mb-16">
          <SectionTitle icon={DollarSign}>Foreign Exchange</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 bg-muted/50 rounded-2xl animate-pulse" />)
              : forexData.map((fx: ForexPair) => {
                  const pos = fx.changePercent >= 0;
                  return (
                    <ForexCard
                      key={fx.pair}
                      pair={fx.pair}
                      rate={fx.rate}
                      change={fx.change}
                      changePercent={fx.changePercent}
                      isPositive={pos}
                    />
                  );
                })}
          </div>
        </section>

        {/* BONDS & VIX */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 md:mb-16">
          {/* BONDS */}
          <div>
            <SectionTitle icon={Landmark}>Treasury Yields</SectionTitle>
            <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : bondsData.length > 0 ? (
                bondsData.map((bond: BondYield, i: number) => {
                  const pos = bond.change >= 0;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between py-4 border-b border-border/40 last:border-0"
                    >
                      <div>
                        <h3 className="font-semibold text-foreground">{bond.name}</h3>
                        <p className={`text-sm font-medium ${pos ? "text-emerald-600" : "text-red-600"}`}>
                          {pos ? "+" : ""}{bond.change.toFixed(3)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{bond.yield.toFixed(3)}%</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="p-8 text-center text-muted-foreground">Bond data unavailable</p>
              )}
            </div>
          </div>

          {/* VIX */}
          <div>
            <SectionTitle icon={Percent}>CBOE Volatility Index (VIX)</SectionTitle>
            {isLoading ? (
              <div className="h-64 bg-muted/50 rounded-2xl animate-pulse" />
            ) : data?.vix ? (
              <div className={`rounded-2xl border p-8 sm:p-10 flex flex-col items-center justify-center gap-4 shadow-sm ${VIX_STYLE[data.vix.sentiment]}`}>
                <div className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter overflow-hidden">
                  {data.vix.value.toFixed(2)}
                </div>
                <p className="text-lg sm:text-xl font-medium">
                  {data.vix.change >= 0 ? "+" : ""}{data.vix.change.toFixed(2)} ({data.vix.changePercent.toFixed(2)}%)
                </p>
                <span className={`px-6 py-2 rounded-full text-sm font-semibold border capitalize ${VIX_STYLE[data.vix.sentiment]}`}>
                  {data.vix.sentiment} volatility
                </span>
              </div>
            ) : (
              <div className="h-64 rounded-2xl border bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground">VIX data unavailable</p>
              </div>
            )}
          </div>
        </div>

        {/* COMMODITIES */}
        <section className="mb-12 md:mb-16">
          <SectionTitle icon={Briefcase}>Key Commodities</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-40 bg-muted/50 rounded-2xl animate-pulse" />)
              : commoditiesData.map((c: Commodity) => {
                  const pos = c.changePercent >= 0;
                  return (
                    <CommodityCard
                      key={c.symbol}
                      name={c.name}
                      price={c.price}
                      change={c.change}
                      changePercent={c.changePercent}
                      unit={c.unit}
                      isPositive={pos}
                    />
                  );
                })}
          </div>
        </section>

        {/* REGIONAL PERFORMANCE */}
        <section className="mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-6">
            <SectionTitle icon={Globe}>Regional Performance</SectionTitle>
            <Button variant="ghost" size="sm" className="text-primary gap-2 hover:gap-3">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-56 bg-muted/50 rounded-2xl animate-pulse" />)
              : regionsData.map((r: RegionSummary) => {
                  const pos = r.avgChange >= 0;
                  return (
                    <div
                      key={r.name}
                      className="bg-card rounded-2xl border border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all p-6"
                    >
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{r.flag}</span>
                          <div>
                            <h3 className="font-semibold text-lg">{r.name}</h3>
                            <p className="text-xs text-muted-foreground">{r.countries.join(", ")}</p>
                          </div>
                        </div>
                        <div className={`text-3xl font-bold ${pos ? "text-emerald-600" : "text-red-600"}`}>
                          {pos ? "+" : ""}{r.avgChange.toFixed(2)}%
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <p>Best: <span className="text-emerald-600 font-medium">{r.best.name}</span> ({r.best.change.toFixed(2)}%)</p>
                        <p>Worst: <span className="text-red-600 font-medium">{r.worst.name}</span> ({r.worst.change.toFixed(2)}%)</p>
                      </div>

                      <div className="flex justify-between text-xs text-muted-foreground mt-6 pt-4 border-t">
                        <div><MapPin className="w-4 h-4 inline mr-1" />{r.countries.length} markets</div>
                        <div><Clock className="w-4 h-4 inline mr-1" />Live</div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </section>

        {/* GLOBAL EVENTS */}
        <section className="mb-12 md:mb-16">
          <SectionTitle>Global Events Calendar</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventsData.map((ev, i) => {
              const IC: Record<string, string> = {
                High:   "bg-red-500/10 text-red-600 border-red-500/20",
                Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
                Low:    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
              };
              const d = new Date(ev.date);
              const dateStr = isNaN(d.getTime()) ? ev.date : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

              return (
                <div key={i} className="bg-card rounded-2xl border border-border/60 p-5 hover:border-primary/30 transition-all">
                  <div className="flex gap-2 flex-wrap mb-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${IC[ev.impact]}`}>
                      {ev.impact}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-xs font-medium rounded-full border border-blue-500/20">
                      {ev.region}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground font-medium">{dateStr}</span>
                  </div>
                  <h3 className="font-medium leading-snug text-sm sm:text-base">{ev.title}</h3>
                </div>
              );
            })}
          </div>
        </section>

        {/* STATUS BAR */}
        <div className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Activity className="w-5 h-5 text-primary" />
              Last updated:{" "}
              {lastUpdated
                ? lastUpdated.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
                : "Fetching..."}
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {data && (["us", "europe", "asia"] as const).map((region) => (
                <div key={region} className="flex items-center gap-2">
                  {data.marketStatus[region] === "open" ? (
                    <Wifi className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className={`uppercase font-medium ${data.marketStatus[region] === "open" ? "text-emerald-600" : "text-muted-foreground"}`}>
                    {region} {data.marketStatus[region]}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full animate-pulse ${loading === "loading" || refreshing ? "bg-amber-500" : "bg-emerald-500"}`} />
                <span className="font-medium text-emerald-600">
                  {loading === "loading" || refreshing ? "Updating..." : "Live"}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}