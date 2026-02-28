import { useState, useEffect, useRef } from "react";
import { Sparkles, TrendingUp, Plus } from "lucide-react";
import InsightCard from "@/components/InsightCard";
import AdminInsightForm from "@/components/AdminInsightForm";
import InsightModal from "@/components/InsightModal";
import { useAuth } from "@/controllers/AuthContext";
import api from "@/api/axios";
import { toggleInsightLike } from "@/services/insightService";
import { useTheme } from "@/controllers/Themecontext";

type ActiveTab = "domestic" | "global";
interface DecodeMarketProps { activeTab: ActiveTab }
interface InsightData {
  _id: string; title: string; description: string; investBeansInsight: string;
  sentiment: "positive" | "negative" | "neutral"; category: string;
  marketType: "domestic" | "global"; views: number; likes: number; isLiked: boolean;
  readTime: string; isPublished: boolean; publishedAt: string;
  author: { _id: string; name: string; email: string };
  credits: { source: string; author?: string; url?: string; publishedDate?: string };
}

const DecodeMarket = ({ activeTab }: DecodeMarketProps) => {
  const { isAdmin } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const INITIAL_VISIBLE = 6, INCREMENT = 4;

  const [insights, setInsights] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<InsightData | null>(null);
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [editingInsight, setEditingInsight] = useState<InsightData | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const hasFetchedRef = useRef(false);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? "/insights/admin/all" : "/insights";
      const response = await api.get(endpoint, { params: { marketType: activeTab, limit: 100, page: 1 } });
      if (response.data?.success && response.data?.data) {
        const fetched = response.data.data.insights || [];
        setInsights(fetched);
        setVisibleCount(Math.min(INITIAL_VISIBLE, fetched.length));
      } else { setInsights([]); setVisibleCount(0); }
    } catch { setInsights([]); setVisibleCount(0); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!hasFetchedRef.current || activeTab) { fetchInsights(); hasFetchedRef.current = true; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAdmin]);

  const handleReadMore = async (id: string) => {
    const preview = insights.find(i => i._id === id);
    if (preview) setSelectedInsight(preview);
    setShowInsightModal(true); setLoadingInsight(true);
    try {
      const res = await api.get(`/insights/${id}`);
      if (res.data?.success) setSelectedInsight(res.data.data);
    } catch { if (!preview) setShowInsightModal(false); }
    finally { setLoadingInsight(false); }
  };

  const handleLike = async (id: string) => {
    try {
      const res = await toggleInsightLike(id);
      if (!res || typeof res.likes !== "number" || typeof res.isLiked !== "boolean") throw new Error("Invalid response");
      setInsights(prev => prev.map(i => i._id === id ? { ...i, likes: res.likes, isLiked: res.isLiked } : i));
      if (selectedInsight?._id === id) setSelectedInsight({ ...selectedInsight, likes: res.likes, isLiked: res.isLiked });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed";
      alert(msg.includes("401") || msg.includes("login") ? "Please login to like insights" : msg);
      throw err;
    }
  };

  const handleEdit = (insight: InsightData) => { setEditingInsight(insight); setShowAdminForm(true); };
  const handleDelete = async (id: string) => {
    try { await api.delete(`/insights/admin/${id}`); fetchInsights(); }
    catch { alert("Failed to delete insight."); }
  };
  const handleFormSuccess = () => { fetchInsights(); setEditingInsight(null); };

  const visibleInsights = insights.slice(0, visibleCount);
  const hasMoreThanInitial = insights.length > INITIAL_VISIBLE;
  const canShowMore = visibleCount < insights.length;

  const showMore = () => { if (!canShowMore) return; setVisibleCount(Math.min(visibleCount + INCREMENT, insights.length)); };
  const showLess = () => {
    setVisibleCount(Math.min(INITIAL_VISIBLE, insights.length));
    setTimeout(() => document.getElementById("decode-markets")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  return (
    <section id="decode-markets" className="mb-12 sm:mb-16 md:mb-20 relative overflow-hidden">

      {/* Ambient glows — clamped so never cause horizontal scroll on mobile */}
      <div
        className="absolute top-0 right-0 w-[min(450px,80vw)] h-[min(450px,80vw)] rounded-full blur-[80px] sm:blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(212,168,67,0.05) 0%,transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[min(350px,70vw)] h-[min(350px,70vw)] rounded-full blur-[60px] sm:blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(56,189,248,0.04) 0%,transparent 70%)" }}
      />

      <div className="relative z-10">

        {/* ── Section header ─────────────────────────────────────────────── */}
        <div className="text-center mb-8 sm:mb-10 relative px-4 sm:px-6 lg:px-8">

          {/* Desktop only — button floats right, vertically centered */}
          {isAdmin && (
            <div className="hidden sm:flex absolute top-1/2 right-4 sm:right-6 lg:right-8 -translate-y-1/2">
              <button
                onClick={() => { setEditingInsight(null); setShowAdminForm(true); }}
                className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all hover:opacity-90 whitespace-nowrap shadow-lg"
                style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Create Insight
              </button>
            </div>
          )}

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-5"
            style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.2)" }}
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4A843]" />
            <span className="text-[11px] sm:text-xs font-semibold text-[#D4A843] uppercase tracking-wide">Market Intelligence</span>
          </div>

          {/* Heading */}
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight ${isLight ? "text-navy" : "text-white"}`}>
            Decode the{" "}
            <span style={{ background: "linear-gradient(135deg,#D4A843,#F0C84A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Market
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            Expert insights and analysis to help you understand market movements and make informed investment decisions
          </p>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">

          {/* Mobile only — button between heading and sub-header */}
          {isAdmin && (
            <div className="flex justify-center mb-4 sm:hidden">
              <button
                onClick={() => { setEditingInsight(null); setShowAdminForm(true); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}
              >
                <Plus className="w-4 h-4" /> Create Insight
              </button>
            </div>
          )}

          {/* ── Sub-header ────────────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
              style={activeTab === "domestic"
                ? { color: "#34d399", background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.18)" }
                : { color: "#60a5fa", background: "rgba(96,165,250,0.07)", border: "1px solid rgba(96,165,250,0.18)" }}
            >
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {activeTab === "domestic" ? "Domestic Market Insights" : "Global Market Insights"}
            </div>
            <div className="text-center">
              <h3 className={`text-xl sm:text-2xl font-bold mb-1 ${isLight ? "text-navy" : "text-white"}`}>
                {activeTab === "domestic" ? "Indian Markets" : "International Markets"}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                {activeTab === "domestic"
                  ? "Analysis of NSE, BSE, and sectoral performance"
                  : "Global economic trends and their impact on investments"}
              </p>
            </div>
          </div>

          {/* ── Cards / Empty / Loading states ───────────────────────────── */}
          {loading ? (
            <div className="text-center py-12 sm:py-16">
              <div
                className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12"
                style={{ border: "2px solid rgba(212,168,67,0.15)", borderTopColor: "#D4A843" }}
              />
              <p className="mt-4 text-slate-400 text-sm">Loading insights...</p>
            </div>
          ) : insights.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-slate-400 mb-4 text-sm sm:text-base">No insights available at the moment.</p>
              {isAdmin && (
                <button
                  onClick={() => { setEditingInsight(null); setShowAdminForm(true); }}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-semibold text-[#0c1a2e]"
                  style={{ background: "linear-gradient(135deg,#D4A843,#C4941E)" }}
                >
                  <Plus className="w-4 h-4" /> Create First Insight
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop 2-col grid */}
              <div className="hidden lg:grid lg:grid-cols-2 gap-6 xl:gap-8">
                {visibleInsights.map(insight => (
                  <InsightCard key={insight._id} insight={insight} isAdmin={isAdmin}
                    onReadMore={handleReadMore} onLike={handleLike} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
              {/* Mobile / tablet stack */}
              <div className="block lg:hidden space-y-4 sm:space-y-5">
                {visibleInsights.map(insight => (
                  <InsightCard key={insight._id} insight={insight} isAdmin={isAdmin}
                    onReadMore={handleReadMore} onLike={handleLike} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Show More / Show Less ─────────────────────────────────────── */}
        {hasMoreThanInitial && insights.length > 0 && (
          <div className="mt-8 sm:mt-12 text-center px-4 flex flex-wrap gap-3 sm:gap-4 justify-center">
            {canShowMore && (
              <button
                onClick={showMore}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-semibold transition-all active:scale-95 text-[#D4A843]"
                style={{ background: "rgba(212,168,67,0.07)", border: "1px solid rgba(212,168,67,0.22)" }}
              >
                Show More
              </button>
            )}
            {visibleCount > INITIAL_VISIBLE && (
              <button
                onClick={showLess}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-semibold transition-all active:scale-95 text-slate-400"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Show Less
              </button>
            )}
          </div>
        )}
      </div>

      <InsightModal
        isOpen={showInsightModal}
        onClose={() => { setShowInsightModal(false); setSelectedInsight(null); setLoadingInsight(false); }}
        insight={selectedInsight}
        loading={loadingInsight}
      />
      <AdminInsightForm
        isOpen={showAdminForm}
        onClose={() => { setShowAdminForm(false); setEditingInsight(null); }}
        onSuccess={handleFormSuccess}
        editingInsight={editingInsight}
      />
    </section>
  );
};

export default DecodeMarket;