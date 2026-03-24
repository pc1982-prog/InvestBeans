import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import axios from "axios";
import { Mail, Sparkles, Activity, TrendingUp } from "lucide-react";
import { useAuth } from "@/controllers/AuthContext";
import { useTheme } from "@/controllers/Themecontext";
import { useNavigate } from "react-router-dom";
import StockWidget from "./StockWidget";
import TradingViewWidget from "@/components/TradingViewWidget";
import StockHeatmapWidget from "@/components/Stockheatmapwidget";
import DecodeMarket from "./DecodeMarket";
import BeansOfWisdomView from "./BeansOfWisdom";
import IPOSection from "./Iposection";
import TestimonialsPage from "@/components/Testimonials";
import Subscribeview from "./Subscribeview";
import PlanCards from "./PlanCards";
import TVDataStamp from "@/components/Tvdatastamp";

type ActiveTab = "domestic" | "global";
type HomeViewProps = { activeTab: ActiveTab; onChangeTab: (tab: ActiveTab) => void };

const HomeView = ({ activeTab, onChangeTab }: HomeViewProps) => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isLight = theme === "light";

  // ── Gold gradient ─────────────────────────────────────────────────────────
  const GOLD = "linear-gradient(135deg,#5194F6,#3a7de0)";

  // ── Page background ───────────────────────────────────────────────────────
  const pageBg = isLight
    ? "linear-gradient(160deg,#f8fbff 0%,#ffffff 45%,#f4f8fe 100%)"
    : "linear-gradient(160deg,#101528 0%,#101528 45%,#101528 100%)";

  const goldBadge = isLight
    ? { background: "rgba(81,148,246,0.08)", border: "1px solid rgba(81,148,246,0.20)" }
    : { background: "rgba(81,148,246,0.10)", border: "1px solid rgba(81,148,246,0.22)" };

  const headingCls = isLight ? "text-slate-900" : "text-white";
  const subTextCls = isLight ? "text-slate-500" : "text-slate-400";

  const cardBg = isLight ? "rgba(255,255,255,0.95)" : "rgba(28,54,86,0.18)";
  const cardBorder = isLight
    ? "1px solid rgba(226,232,240,0.8)"
    : "1px solid rgba(81,148,246,0.10)";

  const sectionWrapBg = isLight
    ? "linear-gradient(135deg,#f0f7ff 0%,#f8fbff 100%)"
    : "linear-gradient(135deg,#1C3656 0%,#101528 100%)";
  const sectionWrapBorder = isLight
    ? "1px solid rgba(226,232,240,0.7)"
    : "1px solid rgba(81,148,246,0.10)";
  const sectionTopLine = isLight
    ? "linear-gradient(90deg,transparent,rgba(81,148,246,0.35),transparent)"
    : "linear-gradient(90deg,transparent,rgba(81,148,246,0.50),transparent)";

  const tabContainerBg = isLight
    ? "rgba(255,255,255,0.9)"
    : "rgba(28,54,86,0.25)";
  const tabContainerBorder = isLight
    ? "1px solid rgba(226,232,240,0.8)"
    : "1px solid rgba(81,148,246,0.15)";
  const tabInactiveCls = isLight ? "#64748b" : "#94a3b8";

  const widgetBorder = isLight
    ? "1px solid rgba(226,232,240,0.8)"
    : "1px solid rgba(81,148,246,0.12)";

  const glow1 = isLight
    ? "radial-gradient(circle,rgba(81,148,246,0.06) 0%,transparent 70%)"
    : "radial-gradient(circle,rgba(81,148,246,0.06) 0%,transparent 70%)";
  const glow2 = isLight
    ? "radial-gradient(circle,rgba(59,130,246,0.05) 0%,transparent 70%)"
    : "radial-gradient(circle,rgba(56,189,248,0.04) 0%,transparent 70%)";

  const emailInputBg = isLight ? "rgba(255,255,255,0.95)" : "rgba(28,54,86,0.30)";
  const emailInputBorder = isLight ? "1px solid rgba(226,232,240,0.8)" : "1px solid rgba(81,148,246,0.15)";
  const emailInputText = isLight ? "#1e293b" : "white";

  const checkoutHandler = async (amount: number) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { data: keyData } = await axios.get(`${API_URL}/getKey`);
    const { data: orderData } = await axios.post(`${API_URL}/payment/process`, { amount });
    const options = {
      key: keyData.key, amount, currency: "INR", name: "InvestBeans",
      order_id: orderData.order.id, callback_url: `${API_URL}/paymentVerification`,
      prefill: { name: "InvestBeans", email: "InvestBeans@example.com", contact: "9999999999" },
      theme: { color: "#5194F6" },
    };
    // @ts-ignore
    new Razorpay(options).open();
  };

  return (
    <Layout>
      <div style={{ background: pageBg, minHeight: "100vh" }}>
        <Hero />

        <div className="container mx-auto px-6 py-16">


          {/* ── Live Dashboard ──────────────────────────────────────────── */}
          <section className="mb-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none"
              style={{ background: glow1 }} />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
              style={{ background: glow2 }} />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
                <div className="mb-6 md:mb-0">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={goldBadge}>
                    <Activity className="w-4 h-4 text-[#5194F6]" />
                    <span className="text-xs font-semibold text-[#5194F6] uppercase tracking-wide">
                      {activeTab === "domestic" ? "Market Live" : "Live Data"}
                    </span>
                  </div>
                  <h2 className={`text-4xl md:text-5xl font-bold mb-2 ${headingCls}`}>
                    {activeTab === "domestic" ? "BharatPulse" : "Live Dashboard"}
                  </h2>
                  <p className={subTextCls}>
                    {activeTab === "domestic"
                      ? "Navigate Bharat's markets with live data, sharp analytics, and smart insights."
                      : "Real-time market data and interactive charts at your fingertips."}
                  </p>
                </div>

                <div className="flex gap-1 p-1 rounded-xl"
                  style={{ background: tabContainerBg, border: tabContainerBorder }}>
                  {(["domestic", "global"] as const).map((tab) => (
                    <button key={tab} onClick={() => onChangeTab(tab)}
                      className="px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
                      style={activeTab === tab
                        ? { background: GOLD, color: "#101528" }
                        : { color: tabInactiveCls }}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>



              <div className="w-full mb-8 overflow-hidden rounded-2xl" style={{ border: widgetBorder }}>
                <TradingViewWidget mode={activeTab} theme={isLight ? "light" : "dark"} height="600px" />
                {/* ── Data freshness strip ── */}
                <TVDataStamp mode={activeTab} type="chart" isLight={isLight} />
              </div>


              <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-6 text-center ${headingCls}`}>Market Heatmap</h3>
                <div className="w-full rounded-t-2xl overflow-hidden" style={{ border: widgetBorder, borderBottom: "none" }}>
                  <div className="h-[600px]">
                    <StockHeatmapWidget dataSource={activeTab === "domestic" ? "SENSEX" : "World"} />
                  </div>
                </div>
                <div className="w-full rounded-b-2xl overflow-hidden" style={{ border: widgetBorder, borderTop: "none" }}>
                  <TVDataStamp
                    mode={activeTab}
                    type="heatmap"
                    isLight={isLight}
                  />
                </div>
              </div>
            </div>
          </section>
          {/* ── IPO Section ─────────────────────────────────────────────── */}
          <section><IPOSection /></section>

          {/* ── Decode Market ────────────────────────────────────────────── */}
          <section className="mt-10">
            <DecodeMarket activeTab={activeTab} />
          </section>


          {/* ── Beans of Wisdom ──────────────────────────────────────────── */}
          <section>
            <BeansOfWisdomView />
          </section>
          {/* ═══════════════════════════════════════════════════════════════
              PRICING PLANS SECTION
          ═══════════════════════════════════════════════════════════════ */}
          <section className="mt-24 mb-8">

            {/* ── Section Heading ── */}
            <div className="text-center mb-4">

              {/* Gold badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={goldBadge}>
                <TrendingUp className="w-4 h-4 text-[#5194F6]" />
                <span className="text-xs font-semibold text-[#5194F6] uppercase tracking-widest">
                  Pricing Plans
                </span>
              </div>

              {/* Main heading */}
              <h2
                className={`text-4xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight ${headingCls}`}
              >
                Invest Smarter,{" "}
                <span style={{
                  background: "linear-gradient(135deg,#5194F6,#7ab8fa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  Choose Your Plan
                </span>
              </h2>

              {/* Subtext */}
              <p className={`text-base max-w-xl mx-auto leading-relaxed ${subTextCls}`}>
                From market basics to pro-level dashboards — pick the plan that
                powers your investing journey.
              </p>
            </div>

            {/* ── Plan Cards ── */}
            <PlanCards
              isLight={isLight}
              onCta={(planId: string) => navigate(`/plans/${planId}/checkout`)}
            />

          </section>

          {/* ── Testimonials ─────────────────────────────────────────────── */}
          <TestimonialsPage />


          {/* ── Newsletter ───────────────────────────────────────────────── */}
          <Subscribeview
            sectionWrapBg={sectionWrapBg}
            sectionWrapBorder={sectionWrapBorder}
            sectionTopLine={sectionTopLine}
            glow1={glow1}
            headingCls={headingCls}
            subTextCls={subTextCls}
            GOLD={GOLD}
            emailInputBg={emailInputBg}
            emailInputBorder={emailInputBorder}
            emailInputText={emailInputText}
          />

        </div>
      </div>
    </Layout>
  );
};

export default HomeView;