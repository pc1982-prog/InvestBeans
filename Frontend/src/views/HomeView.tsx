import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import MarketCard from "@/components/MarketCard";
import DeepDiveCard from "@/components/DeepDiveCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  Mail,
  Sparkles,
  ArrowRight,
  BookOpen,
  Activity,
} from "lucide-react";
import { useAuth } from "@/controllers/AuthContext";
import StockWidget from "./StockWidget";
import DummyChart from "@/components/DummyChart";

import DecodeMarket from "./DecodeMarket";
import BeansOfWisdomView from "./BeansOfWisdom";

type ActiveTab = "domestic" | "global";

type HomeViewProps = {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
};

const HomeView = ({ activeTab, onChangeTab }: HomeViewProps) => {
  const { isAuthenticated } = useAuth();
  const checkoutHandler = async (amount) => {
    const API_URL = import.meta.env.VITE_API_URL;
  
    const { data: { key } } = await axios.get(`${API_URL}/getkey`);
  
    const { data: { order } } = await axios.post(
      `${API_URL}/checkout`,
      { amount }
    );
  
    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "Stock Market Course",
      description: "Buy Course",
      order_id: order.id,
      callback_url: `${API_URL}/paymentverification`,
      theme: {
        color: "#121212"
      }
    };
  
    const razor = new window.Razorpay(options);
    razor.open();
  };
  
  return (
    <Layout>
      <Hero />

      <div className="container mx-auto px-6 py-16">
        {isAuthenticated && (
          <section className="mb-20 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-4xl font-bold text-foreground mb-2">
                InvestBeans Live Premium Charts
              </h2>
              <p className="text-muted-foreground">
                Exclusive charts for subscribers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StockWidget symbol="RELIANCE" market="NSE" />
              <StockWidget symbol="TCS" market="NSE" />
              <StockWidget symbol="AAPL" market="US" />
              <StockWidget symbol="TSLA" market="US" />
            </div>
          </section>
        )}

        {/* Live Dashboard */}
        <section className="mb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-accent/8 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
              <div className="mb-6 md:mb-0">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 mb-4">
                  <Activity className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-accent">
                    {activeTab === "domestic" ? "Market Live" : "Live Data"}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-3">
                  {activeTab === "domestic" ? "BharatPulse" : "Live Dashboard"}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {activeTab === "domestic"
                    ? "Navigate Bharat's markets with live data, sharp analytics, and smart insights."
                    : "Real-time market data and interactive charts at your fingertips."}
                </p>
              </div>
              <div className="flex gap-2 bg-card/50 backdrop-blur-sm p-1 rounded-lg border border-border/50 shadow-lg">
                <Button
                  variant={activeTab === "domestic" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onChangeTab("domestic")}
                  className="transition-all"
                >
                  Domestic
                </Button>
                <Button
                  variant={activeTab === "global" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onChangeTab("global")}
                  className="transition-all"
                >
                  Global
                </Button>
              </div>
            </div>

            {activeTab === "domestic" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MarketCard
                  name="Nifty 50"
                  value="22,142.30"
                  change="−72.10"
                  percentage="−0.33%"
                  isPositive={false}
                />
                <MarketCard
                  name="Sensex"
                  value="73,276.64"
                  change="+394.25"
                  percentage="+0.54%"
                  isPositive={true}
                />
                <MarketCard
                  name="Nifty 100"
                  value="21,102.45"
                  change="+112.20"
                  percentage="+0.53%"
                  isPositive={true}
                />
                <MarketCard
                  name="Nifty 200"
                  value="12,345.67"
                  change="−25.10"
                  percentage="−0.20%"
                  isPositive={false}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MarketCard
                  name="Dow Jones"
                  value="38,503.25"
                  change="+417.09"
                  percentage="+1.10%"
                  isPositive={true}
                />
                <MarketCard
                  name="Nasdaq"
                  value="15,278.27"
                  change="−91.51"
                  percentage="−0.20%"
                  isPositive={false}
                />
                <MarketCard
                  name="S&P 500"
                  value="5,250.12"
                  change="+20.15"
                  percentage="+0.38%"
                  isPositive={true}
                />
                <MarketCard
                  name="Russell 2000"
                  value="2,050.30"
                  change="+5.40"
                  percentage="+0.26%"
                  isPositive={true}
                />
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                Market Performance Charts
              </h3>
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

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50 shadow-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Last Updated: 24/04/2024 - 10:45 AM</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">Live</span>
              </div>
            </div>
          </div>
        </section>

        {/* Decode the Market - Now imported from separate component */}
        <DecodeMarket activeTab={activeTab} />

        {/* Beans of Wisdom */}
      
          <BeansOfWisdomView  />
     

        {/* Deep Dives */}
        <section className="mb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/3 via-transparent to-accent/8 rounded-3xl"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-accent/8 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-accent/5 to-transparent rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 mb-6">
                <BookOpen className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">
                  Research & Analysis
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
                Deep Dives
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Comprehensive analysis and market forecasts from our expert
                research team
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DeepDiveCard
                title="Sensex 2025 Forecast: What Analysts Predict"
                date="April 22, 2024"
                icon="chart"
                readTime="12 min read"
                views={4567}
                category="Market Forecast"
                excerpt="Comprehensive analysis of Sensex performance predictions for 2025, including key factors driving market movements and investment opportunities."
              />
              <DeepDiveCard
                title="US Inflation & Its Impact on Indian Markets"
                date="April 18, 2024"
                icon="globe"
                readTime="15 min read"
                views={3892}
                category="Global Economics"
                excerpt="Deep dive into how US Federal Reserve policies and inflation trends are reshaping investment strategies in emerging markets like India."
              />
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/30 transition-all duration-300 cursor-pointer group touch-manipulation active:scale-95">
                <span className="text-accent font-semibold">
                  Explore All Research
                </span>
                <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>

        

        {/* Newsletter Subscription */}
        <section className="relative overflow-hidden">
          <div className="gradient-accent rounded-2xl p-10 md:p-12 relative animate-scale-in">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <Mail className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stay Ahead in the Market
              </h3>
              <p className="text-white/90 text-lg mb-8">
                Subscribe for daily insights, market trends, and expert analysis
                delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/90 border-0 text-navy placeholder:text-navy/60 h-12 text-base"
                />
                <Button className="bg-navy hover:bg-navy-light text-white font-semibold h-12 px-8 shadow-lg hover:shadow-xl transition-all">
                  Subscribe
                </Button>
              </div>
              <p className="text-white/70 text-sm mt-4">
                Join 50,000+ investors getting daily market insights
              </p>
            </div>
          </div>
        </section>
        <section className="relative overflow-hidden py-16">
  <div className="gradient-accent rounded-2xl p-10 md:p-12 relative">
    {/* glow effects */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

    <div className="relative z-10 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">
        Stock Market Plans
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

{/* CARD 1 */}
{/* <div className="bg-white rounded-xl overflow-hidden shadow-xl hover:scale-105 transition-transform">
  <img
    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
    alt="Stock Market"
    className="h-48 w-full object-cover"
  />

  <div className="p-6 text-center">
    <h3 className="text-xl font-semibold text-navy mb-2">
      Equity Trading Basics
    </h3>

    <p className="text-2xl font-bold text-emerald-600 mb-4">
      ₹999
    </p>

    <button
      onClick={() => checkoutHandler(999)}
      className="w-full bg-navy text-white py-2 rounded-lg font-semibold hover:bg-navy-light transition"
    >
      Buy Now
    </button>
  </div>
</div> */}

{/* CARD 2 */}
{/* <div className="bg-white rounded-xl overflow-hidden shadow-xl hover:scale-105 transition-transform">
  <img
    src="https://images.unsplash.com/photo-1559526324-593bc073d938"
    alt="Stock Market"
    className="h-48 w-full object-cover"
  />

  <div className="p-6 text-center">
    <h3 className="text-xl font-semibold text-navy mb-2">
      Intraday Strategy
    </h3>

    <p className="text-2xl font-bold text-emerald-600 mb-4">
      ₹1499
    </p>

    <button
      onClick={() => checkoutHandler(1499)}
      className="w-full bg-navy text-white py-2 rounded-lg font-semibold hover:bg-navy-light transition"
    >
      Buy Now
    </button>
  </div>
</div> */}

</div>

    </div>
  </div>
</section>

      </div>
    </Layout>
  );
};

export default HomeView;