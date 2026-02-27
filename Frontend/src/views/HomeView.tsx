import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import axios from "axios";
import { Mail, Sparkles, Activity } from "lucide-react";
import { useAuth } from "@/controllers/AuthContext";
import StockWidget from "./StockWidget";
import TradingViewWidget from "@/components/TradingViewWidget";
import StockHeatmapWidget from "@/components/Stockheatmapwidget";
import DecodeMarket from "./DecodeMarket";
import BeansOfWisdomView from "./BeansOfWisdom";
import IPOSection from "./Iposection";
import TestimonialsPage from "@/components/Testimonials";

type ActiveTab = "domestic" | "global";
type HomeViewProps = { activeTab: ActiveTab; onChangeTab: (tab: ActiveTab) => void };

const GOLD = "linear-gradient(135deg,#D4A843,#C4941E)";
const CARD_BG = "rgba(255,255,255,0.04)";
const CARD_BORDER = "1px solid rgba(255,255,255,0.08)";
const GOLD_BADGE = { background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.22)" };

const HomeView = ({ activeTab, onChangeTab }: HomeViewProps) => {
  const { isAuthenticated } = useAuth();

  const checkoutHandler = async (amount: number) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { data: keyData } = await axios.get(`${API_URL}/getKey`);
    const { data: orderData } = await axios.post(`${API_URL}/payment/process`, { amount });
    const options = {
      key: keyData.key, amount, currency: "INR", name: "InvestBeans",
      order_id: orderData.order.id, callback_url: `${API_URL}/paymentVerification`,
      prefill: { name: "InvestBeans", email: "InvestBeans@example.com", contact: "9999999999" },
      theme: { color: "#D4A843" },
    };
    // @ts-ignore
    new Razorpay(options).open();
  };

  return (
    <Layout >
      {/* Soft dark blue page background — no harsh grid */}
      <div style={{ background: "linear-gradient(160deg,#0c1a2e 0%,#0e2038 45%,#0b1825 100%)", minHeight: "100vh" }}>
        {/* <Hero /> */}

        <div className="container mx-auto px-6 py-16">

          {/* Premium Charts */}
          {isAuthenticated && (
            <section className="mb-20 animate-fade-in">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={GOLD_BADGE}>
                  <Sparkles className="w-4 h-4 text-[#D4A843]" />
                  <span className="text-xs font-semibold text-[#D4A843] uppercase tracking-wide">Premium</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-1">InvestBeans Live Premium Charts</h2>
                <p className="text-slate-400 text-sm">Exclusive charts for subscribers</p>
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
              <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none"
                style={{ background: "radial-gradient(circle,rgba(212,168,67,0.06) 0%,transparent 70%)" }} />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
                style={{ background: "radial-gradient(circle,rgba(56,189,248,0.04) 0%,transparent 70%)" }} />
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
                  <div className="mb-6 md:mb-0">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={GOLD_BADGE}>
                      <Activity className="w-4 h-4 text-[#D4A843]" />
                      <span className="text-xs font-semibold text-[#D4A843] uppercase tracking-wide">
                        {activeTab === "domestic" ? "Market Live" : "Live Data"}
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                      {activeTab === "domestic" ? "BharatPulse" : "Live Dashboard"}
                    </h2>
                    <p className="text-slate-400">
                      {activeTab === "domestic"
                        ? "Navigate Bharat's markets with live data, sharp analytics, and smart insights."
                        : "Real-time market data and interactive charts at your fingertips."}
                    </p>
                  </div>

                  <div className="flex gap-1 p-1 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                    {(["domestic", "global"] as const).map((tab) => (
                      <button key={tab} onClick={() => onChangeTab(tab)}
                        className="px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
                        style={activeTab === tab ? { background: GOLD, color: "#0c1a2e" } : { color: "#94a3b8" }}>
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full mb-8 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                  <TradingViewWidget mode={activeTab} theme="dark" height="600px" />
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">Market Heatmap</h3>
                  <div className="w-full h-[600px] rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                    <StockHeatmapWidget dataSource={activeTab === "domestic" ? "SENSEX" : "World"} />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl px-5 py-3"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Sparkles className="w-4 h-4 text-[#D4A843]" />
                    <span>Last Updated: 24/04/2024 - 10:45 AM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-slate-400">Market Status: <span className="text-emerald-400 font-semibold">Open</span></span>
                  </div>
                </div>
              </div>
            </section>

          <IPOSection />

          <section className="mt-10">
          <DecodeMarket activeTab={activeTab} />
          </section>
          <BeansOfWisdomView />
          <TestimonialsPage />

          {/* Plans */}
          <section className="mt-10">
            <div className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg,#0f2040 0%,#0c1a2e 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg,transparent,rgba(212,168,67,0.5),transparent)" }} />
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
                style={{ background: "radial-gradient(circle,rgba(212,168,67,0.07) 0%,transparent 70%)" }} />

              <div className="relative z-10 max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">
                  Stock Market <span style={{ background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Plans</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { title: "Equity Trading Basics", price: 999, img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3" },
                    { title: "Intraday Strategy", price: 1499, img: "https://images.unsplash.com/photo-1559526324-593bc073d938" },
                    { title: "Indian Petroleum", price: 30000, img: "https://images.unsplash.com/photo-1559526324-593bc073d938" },
                  ].map((plan) => (
                    <div key={plan.title} className="rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
                      style={{ background: CARD_BG, border: CARD_BORDER }}>
                      <img src={plan.img} alt={plan.title} className="h-44 w-full object-cover opacity-75" />
                      <div className="p-6 text-center">
                        <h3 className="text-base font-semibold text-white mb-2">{plan.title}</h3>
                        <p className="text-2xl font-bold text-[#D4A843] mb-5">₹{plan.price.toLocaleString()}</p>
                        <button onClick={() => checkoutHandler(plan.price)}
                          className="w-full py-2.5 rounded-lg font-semibold text-sm text-[#0c1a2e]"
                          style={{ background: GOLD }}>
                          Buy Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter */}
          <section className="mt-10">
            <div className="rounded-2xl p-10 md:p-12 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg,#0f2040 0%,#0c1a2e 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg,transparent,rgba(212,168,67,0.5),transparent)" }} />
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
                style={{ background: "radial-gradient(circle,rgba(212,168,67,0.07) 0%,transparent 70%)" }} />

              <div className="relative z-10 max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 mx-auto"
                  style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.25)" }}>
                  <Mail className="w-7 h-7 text-[#D4A843]" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Stay Ahead in the <span style={{ background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Market</span>
                </h3>
                <p className="text-slate-400 mb-8">Subscribe for daily insights, market trends, and expert analysis delivered to your inbox</p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input type="email" placeholder="Enter your email"
                    className="flex-1 h-12 px-4 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <button className="h-12 px-6 rounded-xl font-semibold text-sm text-[#0c1a2e] whitespace-nowrap"
                    style={{ background: GOLD }}>
                    Subscribe
                  </button>
                </div>
                <p className="text-slate-500 text-xs mt-4">Join 50,000+ investors getting daily market insights</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
};

export default HomeView;