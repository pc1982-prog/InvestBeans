import React, { useState, useEffect } from "react";
import { useAuth } from "@/controllers/AuthContext";
import {
  getAllBeans,
  deleteBean,
  BeanOfWisdom,
} from "@/services/beanOfWisdomService";
import {
  Loader2,
  Edit3,
  Trash2,
  X,
  Sparkles,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Calendar,
  Coffee,
  Quote,
} from "lucide-react";
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
    if (
      !window.confirm(
        "Are you sure you want to delete this wisdom? This action cannot be undone."
      )
    )
      return;
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
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <section className="min-h-screen py-8 md:py-12 px-3 sm:px-4 md:px-6 bg-gradient-to-b from-orange-50/30 via-amber-50/20 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[40vh] md:min-h-[500px]">
            <div className="text-center">
              <Loader2 className="w-10 md:w-12 h-10 md:h-12 animate-spin text-orange-500 mx-auto mb-4" />
              <p className="text-sm md:text-lg text-gray-600 font-medium px-2">
                Brewing your daily wisdom...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!bean) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-orange-50/30 via-amber-50/20 to-white py-8 md:py-12 px-3 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-16">
            <div className="inline-flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6 flex-wrap">
              <div className="h-10 w-1 md:h-12 md:w-1.5 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
              <h1 className="text-2xl sm:text-5xl md:text-5xl font-bold text-gray-900">
                Beans of Wisdom
              </h1>
            </div>
            <p className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Daily investment insights to help you grow your financial
              knowledge
            </p>
          </div>

          <div className="text-center py-12 md:py-20">
            <div className="inline-flex items-center justify-center w-16 md:w-24 h-16 md:h-24 rounded-3xl bg-gradient-to-br from-orange-100 to-amber-100 mb-6 shadow-lg mx-auto">
              <Coffee className="w-8 md:w-12 h-8 md:h-12 text-orange-600" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 px-2">
              No Wisdom Available Yet
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-md mx-auto px-4">
              Check back soon for daily investment insights that spark growth.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="beans-of-wisdom"
      className="min-h-screen bg-gradient-to-b from-orange-50/30 via-amber-50/20 to-white py-6 md:py-12 px-3 sm:px-4 md:px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-6 md:mb-12">
          <div className="inline-flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6 flex-wrap">
            <div className="h-10 w-1 md:h-12 md:w-1.5 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full shadow-lg" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Beans of Wisdom
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-4 px-2">
            Daily investment insights to help you grow your financial knowledge
          </p>

          {/* Date Badge & Admin Controls Container */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-center md:gap-4">
           

            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex justify-center gap-2 md:gap-3">
                <button
                  onClick={() => setShowEditForm(true)}
                  className="inline-flex items-center justify-center w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 shadow-md flex-shrink-0"
                  aria-label="Edit wisdom"
                >
                  <Edit3 className="w-4 md:w-5 h-4 md:h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="inline-flex items-center justify-center w-10 md:w-12 h-10 md:h-12 bg-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-md flex-shrink-0"
                  aria-label={deleteLoading ? "Deleting..." : "Delete wisdom"}
                >
                  <Trash2 className="w-4 md:w-5 h-4 md:h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 md:mb-8 max-w-4xl mx-auto p-3 md:p-4 bg-red-50 border-l-4 border-red-500 rounded-xl shadow-md">
            <div className="flex items-start gap-3">
              <div className="text-red-600 font-bold flex-shrink-0 mt-0.5">
                ⚠
              </div>
              <p className="text-red-700 flex-1 text-xs md:text-base">
                {error}
              </p>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-700 transition-colors p-1 hover:bg-red-100 rounded flex-shrink-0"
              >
                <X className="w-4 md:w-5 h-4 md:h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Hero Card */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl overflow-hidden border border-orange-100/50 mb-6 md:mb-8">
            {/* Title Section */}
            <div className="relative bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-orange-500/10 p-4 md:p-8 lg:p-12 border-b border-orange-200/50">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400"></div>
              <div className="absolute bottom-0 right-0 w-20 md:w-32 h-20 md:h-32 bg-orange-500/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-orange-100 px-3 md:px-5 py-2 rounded-full mb-3 md:mb-6 border border-orange-300/50 shadow-sm">
                  <Coffee className="w-3 md:w-4 h-3 md:h-4 text-orange-600 flex-shrink-0" />
                  <span className="text-orange-700 text-xs md:text-sm font-bold">
                    Today's Wisdom
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-4 leading-tight">
                  {bean.title}
                </h2>

                <p className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                  {bean.subtitle}
                </p>
              </div>
            </div>

            {/* Content Grid - Fully Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-12">
              {/* Main Content - Left Side */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6 lg:space-y-8">
                {/* Description */}
                <div >
                  <div className="flex  sm:flex-row items-start sm:items-center gap-2 md:gap-3 mb-3 md:mb-4 ">
                    <div className="p-2 bg-orange-100 rounded-xl border border-orange-300/50 flex-shrink-0">
                      <BookOpen className="w-4 md:w-5 h-4 md:h-5 text-orange-600" />
                    </div>
                    <h3 className="text-sm sm:text-2xl font-bold text-gray-900 mt-2 md:mb-3">
                      {bean.sectionTitle}
                    </h3>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-3 md:p-6 lg:p-8 border border-orange-200/50">
                    <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                      {bean.description}
                    </p>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative">
                  <div className="absolute -left-4 -top-2 text-7xl text-orange-200 font-serif hidden lg:block"></div>
                  <div className="absolute -right-4 -bottom-2 text-7xl text-orange-200 font-serif hidden lg:block"></div>

                  <blockquote className="relative bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 md:p-8 border border-orange-200/50 shadow-md">
                    <Quote className="w-5 md:w-8 h-5 md:h-8 text-orange-400 mb-2 md:mb-4 mx-auto" />
                    <p className="text-base sm:text-lg md:text-xl italic text-gray-800 font-medium leading-relaxed text-center">
                      {bean.quote}
                    </p>
                  </blockquote>
                </div>

                  <div className="bg-orange-50 rounded-2xl p-4 md:p-6 border border-orange-200/50">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <Lightbulb className="w-5 md:w-6 h-5 md:h-6 text-orange-600" />
                    <h3 className="font-bold text-gray-900 text-xl md:text-xl">
                    {bean.insightTag}
                    </h3>
                  </div>
                  <p className="text-sm md:text-xl text-gray-700 leading-relaxed">
                      {bean.insightText}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-4 md:space-y-6">
                {/* Key Principle */}
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl p-4 md:p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <TrendingUp className="w-4 md:w-5 h-4 md:h-5 flex-shrink-0" />
                    <h3 className="font-bold text-sm md:text-lg">
                      Key Principle
                    </h3>
                  </div>
                  <p className="text-white/95 leading-relaxed font-medium text-xs md:text-base">
                    {bean.keyPrinciple}
                  </p>
                </div>

                {/* Info Card */}
                <div className="bg-orange-50 rounded-2xl p-4 md:p-6 border border-orange-200/50">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-orange-600 flex-shrink-0" />
                    <h3 className="font-bold text-gray-900 text-xs md:text-base">
                      Daily Insight
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                    Short, practical tips you can implement today for lasting
                    impact.
                  </p>
                </div>

                {/* Tags */}
                {bean.tags && bean.tags.length > 0 && (
                  <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md border border-orange-100/50">
                    <h3 className="font-bold text-gray-900 mb-3 md:mb-4 text-xs md:text-base">
                      Topics
                    </h3>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {bean.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs md:text-sm font-semibold border border-orange-300/50 hover:bg-orange-200 transition-colors cursor-pointer"
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
    </section>
  );
}
