import { useState, useEffect, useRef } from "react";
import { Sparkles, TrendingUp, Plus } from "lucide-react";
import InsightCard from "@/components/InsightCard";
import AdminInsightForm from "@/components/AdminInsightForm";
import InsightModal from "@/components/InsightModal";
import { useAuth } from "@/controllers/AuthContext";
import api from "@/api/axios";
import { toggleInsightLike } from "@/services/insightService";

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
    <section id="decode-markets" className="mb-20 relative">
      {/* Soft ambient glows */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(212,168,67,0.05) 0%,transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(56,189,248,0.04) 0%,transparent 70%)" }} />

      <div className="relative z-10">
        {/* Section header */}
        <div className="text-center mb-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.2)" }}>
            <Sparkles className="w-3.5 h-3.5 text-[#D4A843]" />
            <span className="text-xs font-semibold text-[#D4A843] uppercase tracking-wide">Market Intelligence</span>
          </div>

          {isAdmin && (
            <div className="absolute top-0 right-0 hidden sm:block">
              <button onClick={() => { setEditingInsight(null); setShowAdminForm(true); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}>
                <Plus className="w-4 h-4" /> Create Insight
              </button>
            </div>
          )}

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 px-4">
            Decode the <span style={{ background: "linear-gradient(135deg,#D4A843,#F0C84A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Market</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed px-4">
            Expert insights and analysis to help you understand market movements and make informed investment decisions
          </p>
        </div>

        <div className="px-4">
          {/* Sub-header */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={activeTab === "domestic"
                ? { color: "#34d399", background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.18)" }
                : { color: "#60a5fa", background: "rgba(96,165,250,0.07)", border: "1px solid rgba(96,165,250,0.18)" }}>
              <TrendingUp className="w-4 h-4" />
              {activeTab === "domestic" ? "Domestic Market Insights" : "Global Market Insights"}
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-1">{activeTab === "domestic" ? "Indian Markets" : "International Markets"}</h3>
              <p className="text-slate-400 text-sm">{activeTab === "domestic" ? "Analysis of NSE, BSE, and sectoral performance" : "Global economic trends and their impact on investments"}</p>
            </div>
            {isAdmin && (
              <button onClick={() => { setEditingInsight(null); setShowAdminForm(true); }}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}>
                <Plus className="w-4 h-4" /> Create Insight
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12"
                style={{ border: "2px solid rgba(212,168,67,0.15)", borderTopColor: "#D4A843" }} />
              <p className="mt-4 text-slate-400 text-sm">Loading insights...</p>
            </div>
          ) : insights.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 mb-4">No insights available at the moment.</p>
              {isAdmin && (
                <button onClick={() => { setEditingInsight(null); setShowAdminForm(true); }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[#0c1a2e]"
                  style={{ background: "linear-gradient(135deg,#D4A843,#C4941E)" }}>
                  <Plus className="w-4 h-4" /> Create First Insight
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="hidden lg:grid lg:grid-cols-2 gap-6 xl:gap-8">
                {visibleInsights.map(insight => (
                  <InsightCard key={insight._id} insight={insight} isAdmin={isAdmin}
                    onReadMore={handleReadMore} onLike={handleLike} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
              <div className="block lg:hidden space-y-5">
                {visibleInsights.map(insight => (
                  <InsightCard key={insight._id} insight={insight} isAdmin={isAdmin}
                    onReadMore={handleReadMore} onLike={handleLike} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            </>
          )}
        </div>

        {hasMoreThanInitial && insights.length > 0 && (
          <div className="mt-12 text-center px-4 flex gap-4 justify-center">
            {canShowMore && (
              <button onClick={showMore}
                className="px-6 py-3 rounded-full text-sm font-semibold transition-all active:scale-95 text-[#D4A843]"
                style={{ background: "rgba(212,168,67,0.07)", border: "1px solid rgba(212,168,67,0.22)" }}>
                Show More
              </button>
            )}
            {visibleCount > INITIAL_VISIBLE && (
              <button onClick={showLess}
                className="px-6 py-3 rounded-full text-sm font-semibold transition-all active:scale-95 text-slate-400"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                Show Less
              </button>
            )}
          </div>
        )}
      </div>

      <InsightModal isOpen={showInsightModal}
        onClose={() => { setShowInsightModal(false); setSelectedInsight(null); setLoadingInsight(false); }}
        insight={selectedInsight} loading={loadingInsight} />
      <AdminInsightForm isOpen={showAdminForm}
        onClose={() => { setShowAdminForm(false); setEditingInsight(null); }}
        onSuccess={handleFormSuccess} editingInsight={editingInsight} />
    </section>
  );
};

export default DecodeMarket;