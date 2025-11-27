import { useState, useEffect, useRef } from "react";
import { Sparkles, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import InsightCard from "@/components/InsightCard";
import AdminInsightForm from "@/components/AdminInsightForm";
import InsightModal from "@/components/InsightModal";
import { useAuth } from "@/controllers/AuthContext";
import api from "@/api/axios";
import { toggleInsightLike } from "@/services/insightService";

type ActiveTab = "domestic" | "global";

interface DecodeMarketProps {
  activeTab: ActiveTab;
}

interface InsightData {
  _id: string;
  title: string;
  description: string;
  investBeansInsight: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: string;
  marketType: 'domestic' | 'global';
  views: number;
  likes: number;
  isLiked: boolean;
  readTime: string;
  isPublished: boolean;
  publishedAt: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  credits: {
    source: string;
    author?: string;
    url?: string;
    publishedDate?: string;
  };
}

const DecodeMarket = ({ activeTab }: DecodeMarketProps) => {
  const { isAdmin } = useAuth();

  // Configurable behaviour
  const INITIAL_VISIBLE = 6;
  const INCREMENT = 4;

  const [insights, setInsights] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<InsightData | null>(null);
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [editingInsight, setEditingInsight] = useState<InsightData | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Visible count state (controls how many cards are shown)
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE);

  // Ref to track if initial fetch has been done
  const hasFetchedRef = useRef(false);

  // Fetch insights from backend
  const fetchInsights = async () => {
    try {
      setLoading(true);
      
      // Use admin endpoint if user is admin, otherwise use public endpoint
      const endpoint = isAdmin ? "/insights/admin/all" : "/insights";
      
      const response = await api.get(endpoint, {
        params: {
          marketType: activeTab,
          limit: 100,
          page: 1,
        },
      });

      if (response.data?.success && response.data?.data) {
        const fetched = response.data.data.insights || [];
        setInsights(fetched);

        // Reset visible count to initial or to total if fewer items returned
        setVisibleCount(Math.min(INITIAL_VISIBLE, fetched.length));
      } else {
        console.warn("Invalid response structure:", response.data);
        setInsights([]);
        setVisibleCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch insights:", error);
      setInsights([]);
      setVisibleCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we haven't fetched yet OR if activeTab changes
    if (!hasFetchedRef.current || activeTab) {
      fetchInsights();
      hasFetchedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAdmin]);

  const handleReadMore = async (id: string) => {
    const previewInsight = insights.find((i) => i._id === id);

    if (previewInsight) {
      setSelectedInsight(previewInsight);
    }
    setShowInsightModal(true);
    setLoadingInsight(true);

    try {
      const response = await api.get(`/insights/${id}`);
      if (response.data?.success) {
        setSelectedInsight(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch insight details:", error);
      if (!previewInsight) {
        setShowInsightModal(false);
      }
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      const response = await toggleInsightLike(id);
      
      if (!response || typeof response.likes !== 'number' || typeof response.isLiked !== 'boolean') {
        throw new Error('Invalid response from server');
      }

      // Update insights list
      setInsights((prevInsights) =>
        prevInsights.map((insight) =>
          insight._id === id
            ? {
                ...insight,
                likes: response.likes,
                isLiked: response.isLiked,
              }
            : insight
        )
      );

      // Update selected insight modal if it's open
      if (selectedInsight && selectedInsight._id === id) {
        setSelectedInsight({
          ...selectedInsight,
          likes: response.likes,
          isLiked: response.isLiked,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to like insight';
      console.error("Failed to like insight:", errorMsg);
      
      // Show user-friendly error
      if (errorMsg.includes('401') || errorMsg.includes('login')) {
        alert('Please login to like insights');
      } else {
        alert(errorMsg);
      }
      
      // Re-throw to allow InsightCard to handle rollback
      throw error;
    }
  };

  const handleEdit = (insight: InsightData) => {
    setEditingInsight(insight);
    setShowAdminForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/insights/admin/${id}`);
      fetchInsights();
    } catch (error) {
      console.error("Failed to delete insight:", error);
      alert("Failed to delete insight. Please try again.");
    }
  };

  const handleFormSuccess = () => {
    fetchInsights();
    setEditingInsight(null);
  };

  // Visible insights slice derived from visibleCount
  const visibleInsights = insights.slice(0, visibleCount);

  // Helper booleans for UI
  const hasMoreThanInitial = insights.length > INITIAL_VISIBLE;
  const canShowMore = visibleCount < insights.length;

  // Actions
  const showMore = () => {
    if (!canShowMore) return;
    const next = Math.min(visibleCount + INCREMENT, insights.length);
    setVisibleCount(next);
  };

  const showLess = () => {
    setVisibleCount(Math.min(INITIAL_VISIBLE, insights.length));
    setTimeout(() => {
      const beansSection = document.getElementById('decode-markets');
      if (beansSection) {
        beansSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100); 
  };

  return (
    <section id="decode-markets" className="mb-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 rounded-3xl"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-2xl"></div>

      <div className="relative z-10">
        {/* Header with Create Button */}
        <div className="text-center mb-6 md:mb-8 relative">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 mb-4 md:mb-6">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-accent" />
            <span className="text-xs md:text-sm font-medium text-accent">
              Market Intelligence
            </span>
          </div>

          {/* Create Button - Absolute positioned on desktop, inline on mobile */}
          {isAdmin && (
            <div className="absolute top-0 right-4 md:right-8 hidden sm:block">
              <Button
                onClick={() => {
                  setEditingInsight(null);
                  setShowAdminForm(true);
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Insight
              </Button>
            </div>
          )}

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-3 md:mb-4 px-4">
            Decode the Market
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Expert insights and analysis to help you understand market
            movements and make informed investment decisions
          </p>
        </div>

        <div className="px-4">
          <div className="text-center mb-6 md:mb-8">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                activeTab === "domestic"
                  ? "bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-200/50"
                  : "bg-gradient-to-r from-blue-500/10 to-indigo-500/5 border border-blue-200/50"
              }`}
            >
              <TrendingUp
                className={`w-4 h-4 ${
                  activeTab === "domestic" ? "text-green-600" : "text-blue-600"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  activeTab === "domestic" ? "text-green-700" : "text-blue-700"
                }`}
              >
                {activeTab === "domestic"
                  ? "Domestic Market Insights"
                  : "Global Market Insights"}
              </span>
            </div>
            
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-foreground mb-2">
                  {activeTab === "domestic" ? "Indian Markets" : "International Markets"}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  {activeTab === "domestic"
                    ? "Analysis of NSE, BSE, and sectoral performance"
                    : "Global economic trends and their impact on investments"}
                </p>
              </div>

              {/* Admin Create Button - Mobile/Tablet Only */}
              {isAdmin && (
                <Button
                  onClick={() => {
                    setEditingInsight(null);
                    setShowAdminForm(true);
                  }}
                  className="lg:hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Insight
                </Button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              <p className="mt-4 text-muted-foreground">Loading insights...</p>
            </div>
          ) : insights.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No insights available at the moment.</p>
              {isAdmin && (
                <Button
                  onClick={() => {
                    setEditingInsight(null);
                    setShowAdminForm(true);
                  }}
                  className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Insight
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop: Two column layout */}
              <div className="hidden lg:grid lg:grid-cols-2 gap-8 xl:gap-12">
                {visibleInsights.map((insight) => (
                  <InsightCard
                    key={insight._id}
                    insight={insight}
                    isAdmin={isAdmin}
                    onReadMore={handleReadMore}
                    onLike={handleLike}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Mobile/Tablet: Single column layout */}
              <div className="block lg:hidden space-y-6">
                {visibleInsights.map((insight) => (
                  <InsightCard
                    key={insight._id}
                    insight={insight}
                    isAdmin={isAdmin}
                    onReadMore={handleReadMore}
                    onLike={handleLike}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Show More / Show Less */}
        {hasMoreThanInitial && insights.length > 0 && (
          <div className="mt-12 md:mt-16 text-center px-4 flex gap-4 justify-center">
            {/* Show More */}
            {canShowMore && (
              <button
                onClick={showMore}
                aria-expanded={visibleCount > INITIAL_VISIBLE}
                aria-controls="insights-list"
                className="inline-flex items-center gap-2 px-4 md:px-6 py-3 rounded-full bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/30 transition-all duration-300 group touch-manipulation active:scale-95"
              >
                <span className="text-accent font-semibold text-sm md:text-base">
                  Show More
                </span>
              </button>
            )}

            {/* Show Less */}
            {visibleCount > INITIAL_VISIBLE && (
              <button
                onClick={showLess}
                aria-expanded={false}
                className="inline-flex items-center gap-2 px-4 md:px-6 py-3 rounded-full bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/30 transition-all duration-300 group touch-manipulation active:scale-95"
              >
                <span className="text-accent font-semibold text-sm md:text-base">Show Less</span>
              </button>
            )}
          </div>
        )}
      </div>

      <InsightModal
        isOpen={showInsightModal}
        onClose={() => {
          setShowInsightModal(false);
          setSelectedInsight(null);
          setLoadingInsight(false);
        }}
        insight={selectedInsight}
        loading={loadingInsight}
      />

      <AdminInsightForm
        isOpen={showAdminForm}
        onClose={() => {
          setShowAdminForm(false);
          setEditingInsight(null);
        }}
        onSuccess={handleFormSuccess}
        editingInsight={editingInsight}
      />
    </section>
  );
};

export default DecodeMarket;