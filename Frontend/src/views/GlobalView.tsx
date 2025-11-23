import Layout from "@/components/Layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MarketCard from "@/components/MarketCard";
import DummyChart from "@/components/DummyChart";
import { TrendingUp, TrendingDown, Activity, Globe, ArrowRight, Clock, Eye, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const GlobalView = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-10">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden mb-12">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <div className="mb-6 md:mb-0">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 mb-4">
                  <Globe className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-accent">Global Markets</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-3">
                  Global Stock Markets
                </h1>
                <p className="text-lg text-muted-foreground">
                  Worldwide market data and international equity analysis
                </p>
              </div>
        <Select defaultValue="dow">
                <SelectTrigger className="w-80 bg-card/50 backdrop-blur-sm border border-border/50">
            <SelectValue placeholder="Select Global Index" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dow">Dow Jones</SelectItem>
            <SelectItem value="nasdaq">Nasdaq</SelectItem>
            <SelectItem value="sse">SSE Composite</SelectItem>
            <SelectItem value="nikkei">Nikkei 225</SelectItem>
          </SelectContent>
        </Select>
      </div>
          </div>
        </div>

        {/* Global Market Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Global Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MarketCard name="Dow Jones" value="38,503.25" change="+417.09" percentage="+1.10%" isPositive={true} />
            <MarketCard name="Nasdaq" value="15,278.27" change="−91.51" percentage="−0.20%" isPositive={false} />
            <MarketCard name="S&P 500" value="5,250.12" change="+20.15" percentage="+0.38%" isPositive={true} />
            <MarketCard name="Russell 2000" value="2,050.30" change="+5.40" percentage="+0.26%" isPositive={true} />
          </div>
        </div>

        {/* International Markets */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">International Markets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MarketCard name="FTSE 100" value="7,623.45" change="−9.12" percentage="−0.12%" isPositive={false} />
            <MarketCard name="DAX" value="18,145.20" change="+74.20" percentage="+0.41%" isPositive={true} />
            <MarketCard name="Nikkei 225" value="39,102.10" change="+86.20" percentage="+0.22%" isPositive={true} />
            <MarketCard name="SSE Composite" value="3,045.60" change="−5.50" percentage="−0.18%" isPositive={false} />
          </div>
        </div>

        {/* Interactive Charts Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Global Market Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DummyChart
              title="US Market Trend"
              value="38,503.25"
              change="+1.10%"
              isPositive={true}
              chartType="line"
              data={[70, 75, 72, 78, 82, 85, 88, 90, 87, 92, 89, 91]}
            />
            <DummyChart
              title="European Markets"
              value="+0.8%"
              change="+0.8%"
              isPositive={true}
              chartType="bar"
              data={[55, 60, 58, 65, 62, 68, 70, 75]}
            />
            <DummyChart
              title="Asian Markets"
              value="+1.2%"
              change="+1.2%"
              isPositive={true}
              chartType="area"
              data={[40, 45, 42, 48, 50, 52, 55, 58, 56, 60, 62, 65]}
            />
          </div>
        </div>

        {/* Regional Performance */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Regional Performance</h2>
            <Button variant="outline" className="border-accent/30 text-accent hover:bg-accent/5">
              View All Regions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                region: "North America", 
                countries: ["USA", "Canada"], 
                performance: "+1.2%", 
                isPositive: true,
                flag: "🇺🇸"
              },
              { 
                region: "Europe", 
                countries: ["UK", "Germany", "France"], 
                performance: "+0.8%", 
                isPositive: true,
                flag: "🇪🇺"
              },
              { 
                region: "Asia Pacific", 
                countries: ["Japan", "China", "India"], 
                performance: "+0.5%", 
                isPositive: true,
                flag: "🇯🇵"
              },
              { 
                region: "Emerging Markets", 
                countries: ["Brazil", "Russia", "South Africa"], 
                performance: "-0.3%", 
                isPositive: false,
                flag: "🌍"
              },
              { 
                region: "Middle East", 
                countries: ["UAE", "Saudi Arabia"], 
                performance: "+2.1%", 
                isPositive: true,
                flag: "🇦🇪"
              },
              { 
                region: "Latin America", 
                countries: ["Mexico", "Argentina"], 
                performance: "+0.9%", 
                isPositive: true,
                flag: "🇲🇽"
              }
            ].map((region, index) => (
              <div key={index} className="bg-gradient-to-br from-card to-card/50 rounded-xl border border-border/50 hover:border-accent/30 hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{region.flag}</div>
                    <div>
                      <h3 className="font-bold text-foreground">{region.region}</h3>
                      <p className="text-sm text-muted-foreground">{region.countries.join(", ")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${region.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {region.performance}
                    </div>
                    <div className="flex items-center gap-1">
                      {region.isPositive ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                      <span className="text-xs text-muted-foreground">24h</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{region.countries.length} markets</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Live</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global News Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Global Market News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Fed signals potential rate cuts ahead",
                description: "Federal Reserve hints at monetary policy adjustments affecting global markets",
                time: "1 hour ago",
                category: "Monetary Policy",
                region: "US"
              },
              {
                title: "European markets rally on ECB optimism",
                description: "European Central Bank's dovish stance boosts investor confidence",
                time: "3 hours ago",
                category: "Central Banks",
                region: "Europe"
              },
              {
                title: "Asian markets mixed on China data",
                description: "Mixed economic indicators from China create uncertainty in Asian markets",
                time: "5 hours ago",
                category: "Economic Data",
                region: "Asia"
              }
            ].map((news, index) => (
              <div key={index} className="bg-gradient-to-br from-card to-card/50 rounded-xl border border-border/50 hover:border-accent/30 hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">{news.category}</span>
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-600 text-xs font-medium rounded-full">{news.region}</span>
                  <span className="text-xs text-muted-foreground">{news.time}</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">{news.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{news.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50 shadow-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="w-4 h-4 text-accent" />
            <span>Last Updated: 24/04/2024 - 10:45 AM</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 font-medium">Live</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GlobalView;

