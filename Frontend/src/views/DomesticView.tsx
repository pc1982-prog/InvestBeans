import Layout from "@/components/Layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MarketCard from "@/components/MarketCard";
import DummyChart from "@/components/DummyChart";
import { TrendingUp, TrendingDown, Activity, BarChart3, Globe, ArrowRight, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const DomesticView = () => {
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
                  <span className="text-sm font-medium text-accent">Domestic Markets</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-3">
                  Indian Stock Markets
                </h1>
                <p className="text-lg text-muted-foreground">
                  Real-time data and analysis for Indian equity markets
                </p>
              </div>
              <Select defaultValue="dashboard">
                <SelectTrigger className="w-80 bg-card/50 backdrop-blur-sm border border-border/50">
                  <SelectValue placeholder="InvestBeans Equity / US Stocks Live Dashboard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">InvestBeans Equity / US Stocks Live Dashboard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Market Overview Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MarketCard name="Nifty 50" value="22,142.30" change="−72.10" percentage="−0.33%" isPositive={false} />
            <MarketCard name="Sensex" value="73,276.64" change="+394.25" percentage="+0.54%" isPositive={true} />
            <MarketCard name="Nifty 100" value="21,102.45" change="+112.20" percentage="+0.53%" isPositive={true} />
            <MarketCard name="Nifty 200" value="12,345.67" change="−25.10" percentage="−0.20%" isPositive={false} />
          </div>
        </div>

        {/* Interactive Charts Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Market Performance Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DummyChart
              title="Nifty 50 Trend"
              value="22,142.30"
              change="−0.33%"
              isPositive={false}
              chartType="line"
              data={[65, 70, 68, 75, 80, 78, 85, 82, 88, 90, 87, 85]}
            />
            <DummyChart
              title="Sector Performance"
              value="+2.4%"
              change="+2.4%"
              isPositive={true}
              chartType="bar"
              data={[45, 52, 48, 61, 55, 67, 58, 72]}
            />
            <DummyChart
              title="Volume Analysis"
              value="1.2B"
              change="+15.2%"
              isPositive={true}
              chartType="area"
              data={[30, 35, 32, 40, 38, 45, 42, 48, 46, 50, 47, 52]}
            />
          </div>
        </div>

        {/* Trending Stocks Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Trending Stocks</h2>
            <Button variant="outline" className="border-accent/30 text-accent hover:bg-accent/5">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "RELIANCE", value: "2,847.50", change: "+45.20", percentage: "+1.61%", isPositive: true },
              { name: "TCS", value: "3,456.80", change: "-23.40", percentage: "-0.67%", isPositive: false },
              { name: "HDFC Bank", value: "1,234.60", change: "+12.80", percentage: "+1.05%", isPositive: true },
              { name: "Infosys", value: "1,567.90", change: "+8.50", percentage: "+0.55%", isPositive: true },
              { name: "HUL", value: "2,345.20", change: "-15.30", percentage: "-0.65%", isPositive: false },
              { name: "ITC", value: "456.70", change: "+3.20", percentage: "+0.71%", isPositive: true }
            ].map((stock, index) => (
              <div key={index} className="bg-gradient-to-br from-card to-card/50 rounded-xl border border-border/50 hover:border-accent/30 hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stock.isPositive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      {stock.isPositive ? <TrendingUp className="w-5 h-5 text-green-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{stock.name}</h3>
                      <p className="text-sm text-muted-foreground">NSE</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">{stock.value}</div>
                    <div className={`text-sm font-medium ${stock.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change} ({stock.percentage})
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Live</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>1.2K views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market News Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Latest Market News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Nifty 50 faces resistance at 22,200 level",
                description: "Market analysts suggest cautious approach as key resistance levels approach",
                time: "2 hours ago",
                category: "Market Analysis"
              },
              {
                title: "Banking sector shows strong momentum",
                description: "Private banks lead the rally with HDFC Bank and ICICI Bank gaining",
                time: "4 hours ago",
                category: "Sector News"
              },
              {
                title: "FIIs continue buying in Indian markets",
                description: "Foreign institutional investors remain bullish on Indian equities",
                time: "6 hours ago",
                category: "FII Activity"
              }
            ].map((news, index) => (
              <div key={index} className="bg-gradient-to-br from-card to-card/50 rounded-xl border border-border/50 hover:border-accent/30 hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">{news.category}</span>
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

export default DomesticView;

