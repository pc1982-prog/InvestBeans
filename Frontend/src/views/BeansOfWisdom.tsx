import React, { useState, useEffect } from "react";
import { useAuth } from "@/controllers/AuthContext";
import {
  getAllBeans,
  deleteBean,
  BeanOfWisdom
} from "@/services/beanOfWisdomService";
import { Loader2, Edit3, Trash2, X, Sparkles, BookOpen, Lightbulb, TrendingUp, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import BeansOfWisdomForm from "@/components/BeansOfWisdomForm";

export default function BeansOfWisdomView() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [bean, setBean] = useState<BeanOfWisdom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchBeans();
  }, []);

  const fetchBeans = async () => {
    try {
      setLoading(true);
      setError(null);
      const beans = await getAllBeans();
      if (beans && beans.length > 0) {
        setBean(beans[0]);
      } else {
        setBean(null);
      }
    } catch (err: any) {
      console.error("Error fetching beans:", err);
      setError(err.message || "Failed to fetch beans");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!bean?._id || !isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this wisdom? This action cannot be undone.")) return;
    try {
      setDeleteLoading(true);
      setError(null);
      await deleteBean(bean._id);
      setBean(null);
      alert("Wisdom deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting bean:", err);
      setError(err.message || "Failed to delete bean");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSuccess = () => {
    fetchBeans();
    setShowEditForm(false);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <section className="min-h-screen py-6 px-3 sm:py-8 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center animate-fade-in">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-orange-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-slate-400 font-medium">Loading your daily wisdom...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!bean) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-800 py-6 px-3 sm:py-8 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16 sm:py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-sm mb-4 sm:mb-6 shadow-xl border border-orange-500/30">
              <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2 sm:mb-3 px-4">
              No Wisdom Available Yet
            </h2>
            <p className="text-base sm:text-lg text-slate-300 px-4 max-w-md mx-auto">
              Check back soon for daily investment insights that spark growth.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-800 py-6 px-3 sm:py-8 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Top Header Bar with darker theme and unique wave border */}
        <div className="relative backdrop-blur-sm bg-gradient-to-r from-orange-900/20 to-amber-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6 shadow-2xl border border-orange-600/30 animate-slide-down overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-600/20 to-amber-600/20 rounded-lg sm:rounded-xl shadow-lg border border-orange-500/30 backdrop-blur-sm">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-slate-100">Bean of Wisdom</h1>
                <p className="text-xs sm:text-sm text-slate-400 hidden sm:block">{getTodayDate()}</p>
              </div>
            </div>
            {isAdmin && (
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowEditForm(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 border-0 shadow-md text-sm transform hover:scale-105 hover:from-orange-700 hover:to-amber-700"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 border-0 shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm transform hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{deleteLoading ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Error Message with darker styling */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-900/20 backdrop-blur-sm border-l-4 border-red-500 rounded-lg shadow-lg animate-slide-down">
            <div className="flex items-start gap-3">
              <div className="text-sm sm:text-base text-red-400 font-semibold flex-shrink-0 mt-0.5">!</div>
              <p className="text-sm sm:text-base text-red-300 flex-1">{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="text-red-400 hover:text-red-300 transition-colors duration-200 p-1 hover:bg-red-800/20 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Enhanced Sidebar with dark glassmorphism and unique elements */}
          <div className="hidden lg:block lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Info Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-700/50 animate-slide-up clip-path-polygon">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 animate-pulse" />
                <h3 className="font-bold text-slate-100 text-xs sm:text-sm">Daily Insight</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Short, practical tips you can implement today for lasting impact.
              </p>
            </div>
            {/* Key Principle Card */}
            <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-xl border border-blue-600/30 animate-slide-up delay-100 clip-path-polygon">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <h3 className="font-bold text-blue-300 text-xs sm:text-sm">Key Principle</h3>
              </div>
              <p className="text-xs sm:text-sm text-blue-300 leading-relaxed font-medium">
                {bean.keyPrinciple}
              </p>
            </div>
            {/* Tags */}
            {bean.tags && bean.tags.length > 0 && (
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-700/50 animate-slide-up delay-200 clip-path-polygon">
                <h3 className="font-bold text-slate-100 mb-2 sm:mb-3 text-xs sm:text-sm">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {bean.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 sm:px-3 py-1 bg-gradient-to-r from-orange-600/20 to-amber-600/20 text-orange-300 rounded-full text-xs font-semibold border border-orange-500/30 backdrop-blur-sm hover:bg-orange-600/30 transition-colors duration-200 cursor-pointer clip-path-hexagon"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Main Content with dark theme */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
              {/* Enhanced Hero Section */}
              <div className="relative bg-gradient-to-r from-orange-900/40 via-amber-900/40 to-orange-900/30 p-5 sm:p-8 md:p-10 border-b border-orange-600/30 animate-fade-in overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0NDQ0NDQiIGZpbGwtb3BhY2l0eT0iMC4xNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0LTQuMTc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-400/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
               
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-gray-700/90 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 border border-orange-500/30 shadow-lg backdrop-blur-sm hover:shadow-xl transition-shadow duration-200">
                    <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                    <span className="text-orange-300 text-xs sm:text-sm font-semibold">Investment Wisdom</span>
                  </div>
                 
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-100 mb-3 sm:mb-4 leading-tight animate-slide-up">
                    {bean.title}
                  </h2>
                 
                  <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed animate-slide-up delay-100">
                    {bean.subtitle}
                  </p>
                </div>
              </div>

              {/* Enhanced Content Section */}
              <div className="p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
                {/* Main Description */}
                <div className="animate-slide-up">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-orange-600/30 to-amber-600/30 rounded-lg border border-orange-500/30 backdrop-blur-sm shadow-lg">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100">
                      {bean.sectionTitle}
                    </h3>
                  </div>
                 
                  <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-2xl p-4 sm:p-6 border border-orange-500/30 backdrop-blur-sm hover:shadow-xl transition-shadow duration-200 clip-path-polygon">
                    <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
                      {bean.description}
                    </p>
                  </div>
                </div>

                {/* Mobile Key Principle */}
                <div className="lg:hidden bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl p-4 sm:p-5 shadow-xl border border-blue-600/30 backdrop-blur-sm animate-slide-up clip-path-polygon">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    <h3 className="font-bold text-blue-300 text-sm">Key Principle</h3>
                  </div>
                  <p className="text-sm text-blue-300 leading-relaxed font-medium">
                    {bean.keyPrinciple}
                  </p>
                </div>

                {/* Enhanced Quote */}
                <div className="relative animate-slide-up delay-200">
                  <div className="absolute -left-2 sm:-left-4 -top-1 sm:-top-2 text-5xl sm:text-7xl text-orange-800/50 font-serif leading-none select-none">"</div>
                  <div className="absolute -right-2 sm:-right-4 -bottom-1 sm:-bottom-2 text-5xl sm:text-7xl text-orange-800/50 font-serif leading-none select-none">"</div>
                 
                  <blockquote className="relative bg-gray-700/80 backdrop-blur-sm bg-gradient-to-r from-slate-800/60 via-orange-900/20 to-slate-800/60 rounded-2xl p-6 sm:p-8 border border-slate-600/30 shadow-xl hover:shadow-2xl transition-shadow duration-200 clip-path-hexagon">
                    <p className="text-base sm:text-lg md:text-xl italic text-slate-200 font-medium leading-relaxed text-center">
                      {bean.quote}
                    </p>
                  </blockquote>
                </div>

                {/* Enhanced Insight Box */}
                <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl border border-blue-600/30 backdrop-blur-sm animate-slide-up delay-300 clip-path-polygon">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-gray-700/90 rounded-xl flex-shrink-0 border border-blue-600/30 shadow-lg backdrop-blur-sm">
                      <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 animate-pulse" />
                    </div>
                   
                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center gap-2 bg-gray-700/90 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 border border-blue-600/30 shadow-lg backdrop-blur-sm hover:shadow-xl transition-shadow duration-200">
                        <span className="text-xs sm:text-sm font-bold text-blue-300">
                          {bean.insightTag}
                        </span>
                      </div>
                     
                      <p className="text-blue-300 text-sm sm:text-base md:text-lg leading-relaxed break-words">
                        {bean.insightText}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Tags */}
                {bean.tags && bean.tags.length > 0 && (
                  <div className="lg:hidden bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-700/50 animate-slide-up delay-400 clip-path-polygon">
                    <h3 className="font-bold text-slate-100 mb-3 text-sm">Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {bean.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-orange-600/20 to-amber-600/20 text-orange-300 rounded-full text-xs font-semibold border border-orange-500/30 backdrop-blur-sm hover:bg-orange-600/30 transition-colors duration-200 cursor-pointer clip-path-hexagon"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-8 sm:h-12" />

        {/* Form Modal */}
        {isAdmin && (
          <BeansOfWisdomForm
            isOpen={showEditForm}
            onClose={() => setShowEditForm(false)}
            bean={bean}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-slide-down { animation: slide-down 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-slide-up.delay-100 { animation-delay: 0.1s; }
        .animate-slide-up.delay-200 { animation-delay: 0.2s; }
        .animate-slide-up.delay-300 { animation-delay: 0.3s; }
        .animate-slide-up.delay-400 { animation-delay: 0.4s; }
        .clip-path-polygon {
          clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);
        }
        .clip-path-hexagon {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>
    </section>
  );
}