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
      <section className="min-h-screen py-6 px-3 sm:py-8 sm:px-4 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center animate-fade-in">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-accent mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-navy/70 font-medium">Loading your daily wisdom...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!bean) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-6 px-3 sm:py-8 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16 sm:py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-accent/10 backdrop-blur-sm mb-4 sm:mb-6 shadow-lg border border-accent/20">
              <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-2 sm:mb-3 px-4">
              No Wisdom Available Yet
            </h2>
            <p className="text-base sm:text-lg text-navy/70 px-4 max-w-md mx-auto">
              Check back soon for daily investment insights that spark growth.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-6 px-3 sm:py-8 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Top Header Bar */}
        <div className="relative backdrop-blur-sm bg-gradient-to-r from-white to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6 shadow-lg border border-accent/20 animate-slide-down overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-accent/70 to-accent/50"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-accent/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 sm:p-2.5 bg-accent/10 rounded-lg sm:rounded-xl shadow-md border border-accent/30 backdrop-blur-sm">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-navy">Bean of Wisdom</h1>
                <p className="text-xs sm:text-sm text-navy/60 hidden sm:block">{getTodayDate()}</p>
              </div>
            </div>
            {isAdmin && (
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowEditForm(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-accent text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 border-0 shadow-md text-sm transform hover:scale-105 hover:bg-accent/90"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 border-0 shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm transform hover:scale-105 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{deleteLoading ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 backdrop-blur-sm border-l-4 border-red-500 rounded-lg shadow-md animate-slide-down">
            <div className="flex items-start gap-3">
              <div className="text-sm sm:text-base text-red-600 font-semibold flex-shrink-0 mt-0.5">!</div>
              <p className="text-sm sm:text-base text-red-700 flex-1">{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="text-red-600 hover:text-red-700 transition-colors duration-200 p-1 hover:bg-red-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Enhanced Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-accent/10 animate-slide-up hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent animate-pulse" />
                <h3 className="font-bold text-navy text-xs sm:text-sm">Daily Insight</h3>
              </div>
              <p className="text-xs text-navy/70 leading-relaxed">
                Short, practical tips you can implement today for lasting impact.
              </p>
            </div>
            
            {/* Key Principle Card */}
            <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl p-4 sm:p-5 shadow-md border border-accent/30 animate-slide-up delay-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                <h3 className="font-bold text-navy text-xs sm:text-sm">Key Principle</h3>
              </div>
              <p className="text-xs sm:text-sm text-navy/80 leading-relaxed font-medium">
                {bean.keyPrinciple}
              </p>
            </div>
            
            {/* Tags */}
            {bean.tags && bean.tags.length > 0 && (
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-accent/10 animate-slide-up delay-200 hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-bold text-navy mb-2 sm:mb-3 text-xs sm:text-sm">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {bean.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 sm:px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold border border-accent/30 hover:bg-accent/20 transition-colors duration-200 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-accent/10">
              {/* Enhanced Hero Section */}
              <div className="relative bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 p-5 sm:p-8 md:p-10 border-b border-accent/20 animate-fade-in overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-accent/70 to-accent/50"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
               
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-accent/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 border border-accent/30 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                    <span className="text-accent text-xs sm:text-sm font-semibold">Investment Wisdom</span>
                  </div>
                 
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-navy mb-3 sm:mb-4 leading-tight animate-slide-up">
                    {bean.title}
                  </h2>
                 
                  <p className="text-navy/80 text-sm sm:text-base md:text-lg leading-relaxed animate-slide-up delay-100">
                    {bean.subtitle}
                  </p>
                </div>
              </div>

              {/* Enhanced Content Section */}
              <div className="p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
                {/* Main Description */}
                <div className="animate-slide-up">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-1.5 sm:p-2 bg-accent/10 rounded-lg border border-accent/30 backdrop-blur-sm shadow-md">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-navy">
                      {bean.sectionTitle}
                    </h3>
                  </div>
                 
                  <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl p-4 sm:p-6 border border-accent/20 hover:shadow-lg transition-shadow duration-200">
                    <p className="text-navy/80 text-sm sm:text-base md:text-lg leading-relaxed">
                      {bean.description}
                    </p>
                  </div>
                </div>

                {/* Mobile Key Principle */}
                <div className="lg:hidden bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl p-4 sm:p-5 shadow-md border border-accent/30 animate-slide-up">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                    <h3 className="font-bold text-navy text-sm">Key Principle</h3>
                  </div>
                  <p className="text-sm text-navy/80 leading-relaxed font-medium">
                    {bean.keyPrinciple}
                  </p>
                </div>

                {/* Enhanced Quote */}
                <div className="relative animate-slide-up delay-200">
                  <div className="absolute -left-2 sm:-left-4 -top-1 sm:-top-2 text-5xl sm:text-7xl text-navy/10 font-serif leading-none select-none">"</div>
                  <div className="absolute -right-2 sm:-right-4 -bottom-1 sm:-bottom-2 text-5xl sm:text-7xl text-navy/10 font-serif leading-none select-none">"</div>
                 
                  <blockquote className="relative bg-gradient-to-r from-accent/5 to-accent/10 rounded-2xl p-6 sm:p-8 border border-accent/20 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <p className="text-base sm:text-lg md:text-xl italic text-navy font-medium leading-relaxed text-center">
                      {bean.quote}
                    </p>
                  </blockquote>
                </div>

                {/* Enhanced Insight Box */}
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-5 sm:p-6 md:p-8 shadow-md border border-accent/20 animate-slide-up delay-300 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-accent/10 rounded-xl flex-shrink-0 border border-accent/30 shadow-md">
                      <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-accent animate-pulse" />
                    </div>
                   
                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center gap-2 bg-accent/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 border border-accent/30 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <span className="text-xs sm:text-sm font-bold text-accent">
                          {bean.insightTag}
                        </span>
                      </div>
                     
                      <p className="text-navy/80 text-sm sm:text-base md:text-lg leading-relaxed break-words">
                        {bean.insightText}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Tags */}
                {bean.tags && bean.tags.length > 0 && (
                  <div className="lg:hidden bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-accent/10 animate-slide-up delay-400">
                    <h3 className="font-bold text-navy mb-3 text-sm">Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {bean.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold border border-accent/30 hover:bg-accent/20 transition-colors duration-200 cursor-pointer"
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

      {/* <style jsx>{`
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
      `}</style> */}
    </section>
  );
}