import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import axios from "axios";
import { Mail, Sparkles, Activity } from "lucide-react";
import { useAuth } from "@/controllers/AuthContext";
import { useTheme } from "@/controllers/Themecontext";
import StockWidget from "./StockWidget";
import TradingViewWidget from "@/components/TradingViewWidget";
import StockHeatmapWidget from "@/components/Stockheatmapwidget";
import DecodeMarket from "./DecodeMarket";
import BeansOfWisdomView from "./BeansOfWisdom";
import IPOSection from "./Iposection";
import TestimonialsPage from "@/components/Testimonials";

type ActiveTab = "domestic" | "global";
type HomeViewProps = { activeTab: ActiveTab; onChangeTab: (tab: ActiveTab) => void };

const HomeView = ({ activeTab, onChangeTab }: HomeViewProps) => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";

  // ── Gold gradient (same in both modes) ───────────────────────────────────
  const GOLD = "linear-gradient(135deg,#D4A843,#C4941E)";

  // ── Page background ───────────────────────────────────────────────────────
  const pageBg = isLight
    ? "linear-gradient(160deg,#dce8f7 0%,#e8f2fd 45%,#dce8f7 100%)"
    : "linear-gradient(160deg,#0c1a2e 0%,#0e2038 45%,#0b1825 100%)";

  // ── Badge (gold pill) ─────────────────────────────────────────────────────
  const goldBadge = isLight
    ? { background: "rgba(212,168,67,0.12)", border: "1px solid rgba(212,168,67,0.3)" }
    : { background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.22)" };

  // ── Section headings ───────────────────────────────────────────────────────
  const headingCls = isLight ? "text-navy" : "text-white";
  const subTextCls = isLight ? "text-navy/60" : "text-slate-400";

  // ── Card background / border ───────────────────────────────────────────────
  const cardBg = isLight ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.04)";
  const cardBorder = isLight
    ? "1px solid rgba(13,37,64,0.1)"
    : "1px solid rgba(255,255,255,0.08)";

  // ── Section wrappers ───────────────────────────────────────────────────────
  const sectionWrapBg = isLight
    ? "linear-gradient(135deg,#edf5fe 0%,#dce8f7 100%)"
    : "linear-gradient(135deg,#0f2040 0%,#0c1a2e 100%)";
  const sectionWrapBorder = isLight
    ? "1px solid rgba(13,37,64,0.1)"
    : "1px solid rgba(255,255,255,0.08)";
  const sectionTopLine = isLight
    ? "linear-gradient(90deg,transparent,rgba(212,168,67,0.45),transparent)"
    : "linear-gradient(90deg,transparent,rgba(212,168,67,0.5),transparent)";

  // ── Tab switcher ───────────────────────────────────────────────────────────
  const tabContainerBg = isLight
    ? "rgba(255,255,255,0.6)"
    : "rgba(255,255,255,0.05)";
  const tabContainerBorder = isLight
    ? "1px solid rgba(13,37,64,0.12)"
    : "1px solid rgba(255,255,255,0.09)";
  const tabInactiveCls = isLight ? "text-navy/50" : "#94a3b8";

  // ── Market status bar ──────────────────────────────────────────────────────
  const statusBarBg = isLight
    ? "rgba(255,255,255,0.5)"
    : "rgba(255,255,255,0.03)";
  const statusBarBorder = isLight
    ? "1px solid rgba(13,37,64,0.08)"
    : "1px solid rgba(255,255,255,0.06)";

  // ── Widget container border ────────────────────────────────────────────────
  const widgetBorder = isLight
    ? "1px solid rgba(13,37,64,0.1)"
    : "1px solid rgba(255,255,255,0.07)";

  // ── Radial glow blobs ──────────────────────────────────────────────────────
  const glow1 = isLight
    ? "radial-gradient(circle,rgba(212,168,67,0.08) 0%,transparent 70%)"
    : "radial-gradient(circle,rgba(212,168,67,0.06) 0%,transparent 70%)";
  const glow2 = isLight
    ? "radial-gradient(circle,rgba(59,130,246,0.07) 0%,transparent 70%)"
    : "radial-gradient(circle,rgba(56,189,248,0.04) 0%,transparent 70%)";

  // ── Newsletter input ───────────────────────────────────────────────────────
  const emailInputBg = isLight
    ? "rgba(255,255,255,0.8)"
    : "rgba(255,255,255,0.06)";
  const emailInputBorder = isLight
    ? "1px solid rgba(13,37,64,0.12)"
    : "1px solid rgba(255,255,255,0.1)";
  const emailInputText = isLight ? "#0d1b2a" : "white";

  // ── Plan card image overlay ────────────────────────────────────────────────
  const imgOpacity = isLight ? "opacity-90" : "opacity-75";

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
    <Layout>
      {/* ── Page background wrapper ────────────────────────────────────────── */}
      <div style={{ background: pageBg, minHeight: "100vh" }}>
        <Hero />

        <div className="container mx-auto px-6 py-16">

          {/* ═══════════════════════════════════════════════════════════════
              PREMIUM CHARTS  (authenticated only)
          ═══════════════════════════════════════════════════════════════ */}
          {isAuthenticated && (
            <section className="mb-20 animate-fade-in">
              <div className="mb-6">
                {/* Gold badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={goldBadge}>
                  <Sparkles className="w-4 h-4 text-[#D4A843]" />
                  <span className="text-xs font-semibold text-[#D4A843] uppercase tracking-wide">Premium</span>
                </div>
                {/* Section heading */}
                <h2 className={`text-3xl font-bold mb-1 ${headingCls}`}>
                  InvestBeans Live Premium Charts
                </h2>
                <p className={`text-sm ${subTextCls}`}>Exclusive charts for subscribers</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                <StockWidget symbol="RELIANCE" market="NSE" />
                <StockWidget symbol="TCS" market="NSE" />
                <StockWidget symbol="AAPL" market="US" />
                <StockWidget symbol="TSLA" market="US" />
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              LIVE DASHBOARD  (BharatPulse / Global)
          ═══════════════════════════════════════════════════════════════ */}
          <section className="mb-20 relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none"
              style={{ background: glow1 }} />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
              style={{ background: glow2 }} />

            <div className="relative z-10">
              {/* Header row */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
                <div className="mb-6 md:mb-0">
                  {/* Gold badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={goldBadge}>
                    <Activity className="w-4 h-4 text-[#D4A843]" />
                    <span className="text-xs font-semibold text-[#D4A843] uppercase tracking-wide">
                      {activeTab === "domestic" ? "Market Live" : "Live Data"}
                    </span>
                  </div>
                  {/* Section heading */}
                  <h2 className={`text-4xl md:text-5xl font-bold mb-2 ${headingCls}`}>
                    {activeTab === "domestic" ? "BharatPulse" : "Live Dashboard"}
                  </h2>
                  <p className={subTextCls}>
                    {activeTab === "domestic"
                      ? "Navigate Bharat's markets with live data, sharp analytics, and smart insights."
                      : "Real-time market data and interactive charts at your fingertips."}
                  </p>
                </div>

                {/* Domestic / Global tab switcher */}
                <div className="flex gap-1 p-1 rounded-xl"
                  style={{ background: tabContainerBg, border: tabContainerBorder }}>
                  {(["domestic", "global"] as const).map((tab) => (
                    <button key={tab} onClick={() => onChangeTab(tab)}
                      className="px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
                      style={activeTab === tab
                        ? { background: GOLD, color: "#0c1a2e" }
                        : { color: tabInactiveCls }}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* TradingView chart */}
              <div className="w-full mb-8 rounded-2xl overflow-hidden" style={{ border: widgetBorder }}>
                <TradingViewWidget mode={activeTab} theme={isLight ? "light" : "dark"} height="600px" />
              </div>

              {/* Heatmap */}
              <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-6 text-center ${headingCls}`}>Market Heatmap</h3>
                <div className="w-full h-[600px] rounded-2xl overflow-hidden" style={{ border: widgetBorder }}>
                  <StockHeatmapWidget dataSource={activeTab === "domestic" ? "SENSEX" : "World"} />
                </div>
              </div>

              {/* Market status bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl px-5 py-3"
                style={{ background: statusBarBg, border: statusBarBorder }}>
                <div className="flex items-center gap-2 text-sm" style={{ color: isLight ? "rgba(13,37,64,0.55)" : "rgba(148,163,184,1)" }}>
                  <Sparkles className="w-4 h-4 text-[#D4A843]" />
                  <span>Last Updated: 24/04/2024 - 10:45 AM</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span style={{ color: isLight ? "rgba(13,37,64,0.55)" : "rgba(148,163,184,1)" }}>
                    Market Status: <span className="text-emerald-500 font-semibold">Open</span>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════
              IPO SECTION
          ═══════════════════════════════════════════════════════════════ */}
          <IPOSection />

          {/* ═══════════════════════════════════════════════════════════════
              DECODE MARKET
          ═══════════════════════════════════════════════════════════════ */}
          <section className="mt-10">
            <DecodeMarket activeTab={activeTab} />
          </section>

          {/* ═══════════════════════════════════════════════════════════════
              BEANS OF WISDOM
          ═══════════════════════════════════════════════════════════════ */}
          <section>
            <BeansOfWisdomView />
          </section>

          {/* ═══════════════════════════════════════════════════════════════
              TESTIMONIALS
          ═══════════════════════════════════════════════════════════════ */}
          <TestimonialsPage />

          {/* ═══════════════════════════════════════════════════════════════
              PLANS
          ═══════════════════════════════════════════════════════════════ */}
          <section className="mt-10">
            <div className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
              style={{ background: sectionWrapBg, border: sectionWrapBorder }}>
              {/* Gold top line */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: sectionTopLine }} />
              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
                style={{ background: glow1 }} />

              <div className="relative z-10 max-w-6xl mx-auto">
                {/* Heading */}
                <h2 className={`text-3xl md:text-4xl font-bold text-center mb-10 ${headingCls}`}>
                  Stock Market{" "}
                  <span style={{ background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Plans
                  </span>
                </h2>

                {/* Plan cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { title: "Equity Trading Basics", price: 999, img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3" },
                    { title: "Intraday Strategy", price: 1499, img: "https://images.unsplash.com/photo-1559526324-593bc073d938" },
                    { title: "Indian Petroleum", price: 30000, img: "https://images.unsplash.com/photo-1559526324-593bc073d938" },
                  ].map((plan) => (
                    <div key={plan.title}
                      className="rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
                      style={{ background: cardBg, border: cardBorder }}>
                      <img src={plan.img} alt={plan.title} className={`h-44 w-full object-cover ${imgOpacity}`} />
                      <div className="p-6 text-center">
                        <h3 className={`text-base font-semibold mb-2 ${headingCls}`}>{plan.title}</h3>
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

          {/* ═══════════════════════════════════════════════════════════════
              NEWSLETTER
          ═══════════════════════════════════════════════════════════════ */}
          <section className="mt-10">
            <div className="rounded-2xl p-10 md:p-12 relative overflow-hidden"
              style={{ background: sectionWrapBg, border: sectionWrapBorder }}>
              {/* Gold top line */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: sectionTopLine }} />
              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
                style={{ background: glow1 }} />

              <div className="relative z-10 max-w-3xl mx-auto text-center">
                {/* Mail icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 mx-auto"
                  style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.25)" }}>
                  <Mail className="w-7 h-7 text-[#D4A843]" />
                </div>

                {/* Heading */}
                <h3 className={`text-3xl md:text-4xl font-bold mb-3 ${headingCls}`}>
                  Stay Ahead in the{" "}
                  <span style={{ background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Market
                  </span>
                </h3>
                <p className={`mb-8 ${subTextCls}`}>
                  Subscribe for daily insights, market trends, and expert analysis delivered to your inbox
                </p>

                {/* Email form */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 h-12 px-4 rounded-xl text-sm focus:outline-none placeholder:text-slate-400"
                    style={{
                      background: emailInputBg,
                      border: emailInputBorder,
                      color: emailInputText,
                    }}
                  />
                  <button className="h-12 px-6 rounded-xl font-semibold text-sm text-[#0c1a2e] whitespace-nowrap"
                    style={{ background: GOLD }}>
                    Subscribe
                  </button>
                </div>

                {/* Social proof */}
                <p className={`text-xs mt-4 ${subTextCls}`}>
                  Join 50,000+ investors getting daily market insights
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
};

export default HomeView;