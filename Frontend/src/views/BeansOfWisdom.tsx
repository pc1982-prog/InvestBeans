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
  Coffee,
  TrendingUp,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import BeansOfWisdomForm from "@/components/BeansOfWisdomForm";

export default function BeansOfWisdomView() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [bean, setBean] = useState<BeanOfWisdom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { fetchBeans(); }, []);

  const fetchBeans = async () => {
    try {
      setLoading(true);
      setError(null);
      const beans = await getAllBeans();
      setBean(beans && beans.length > 0 ? beans[0] : null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch beans");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!bean?._id || !isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this wisdom?")) return;
    try {
      setDeleteLoading(true);
      setError(null);
      await deleteBean(bean._id);
      setBean(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete bean");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSuccess = () => {
    fetchBeans();
    setShowEditForm(false);
  };

  if (authLoading || loading) {
    return (
      <section className="py-10 px-4 md:px-10">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-5 h-5 animate-spin text-orange-500 mr-2.5" />
          <p className="text-gray-400 text-sm">Brewing your weekly wisdom…</p>
        </div>
      </section>
    );
  }

  if (!bean) {
    return (
      <section className="py-10 px-4 md:px-10">
        <div className="text-center py-20">
          <Coffee className="w-9 h-9 text-orange-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No wisdom available yet — check back soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="beans-of-wisdom" className="py-6 px-4 md:px-10">

      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-amber-400 rounded-full" />
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Beans of Wisdom</h2>
          <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-0.5 rounded-full border border-orange-200">
            <Coffee className="w-2.5 h-2.5" /> WEEKLY
          </span>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditForm(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold rounded-lg border border-red-200 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {deleteLoading ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="mb-5 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          <span className="flex-shrink-0">⚠</span>
          <p className="flex-1">{error}</p>
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MAIN CARD
      ══════════════════════════════════════════ */}
      <div className="rounded-2xl overflow-hidden border border-orange-100 shadow-lg bg-white">

        {/* ── HERO — two column on desktop ── */}
        <div className="grid grid-cols-1 md:grid-cols-5">

          {/* Left: orange gradient panel — title, subtitle, badge */}
          <div className="md:col-span-3 relative bg-gradient-to-br from-orange-500 via-orange-500 to-amber-400 px-6 py-8 md:px-10 md:py-12 overflow-hidden flex flex-col justify-between min-h-[200px] md:min-h-[280px]">
            {/* decorative blobs */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-6 right-8 w-16 h-16 bg-white/10 rounded-full pointer-events-none" />

            <div className="relative z-10">
              {/* badge */}
              <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-3 py-1 mb-5 w-fit">
                <Coffee className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-xs font-bold tracking-wide">Today's Wisdom</span>
              </div>

              {/* title */}
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                {bean.title}
              </h3>

              {/* subtitle */}
              {bean.subtitle && (
                <p className="text-sm md:text-base text-orange-100 leading-relaxed max-w-lg">
                  {bean.subtitle}
                </p>
              )}
            </div>

            {/* tags — bottom of hero on desktop */}
            {bean.tags && bean.tags.length > 0 && (
              <div className="relative z-10 flex flex-wrap gap-1.5 mt-6">
                {bean.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white/20 text-white font-semibold px-2.5 py-0.5 rounded-full border border-white/30 backdrop-blur-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right: key principle + insight stacked */}
          <div className="md:col-span-2 flex flex-col divide-y divide-orange-50">

            {/* Key Principle */}
            {bean.keyPrinciple && (
              <div className="flex-1 p-6 md:p-8 bg-amber-50 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">Key Principle</p>
                </div>
                <p className="text-base md:text-xl font-bold text-gray-900 leading-snug">
                  {bean.keyPrinciple}
                </p>
              </div>
            )}

            {/* Insight */}
            {bean.insightText && (
              <div className="flex-1 p-6 md:p-8 bg-white flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                    {bean.insightTag || "Insight"}
                  </p>
                </div>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {bean.insightText}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── BODY — description + quote ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-t border-gray-100">

          {/* Description */}
          {(bean.sectionTitle || bean.description) && (
            <div className="p-6 md:p-8 flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 mt-0.5 bg-orange-100 rounded-xl flex items-center justify-center border border-orange-200">
                <Sparkles className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                {bean.sectionTitle && (
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">
                    {bean.sectionTitle}
                  </p>
                )}
                {bean.description && (
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {bean.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Quote */}
          {bean.quote && (
            <div className="p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-orange-50/60 to-amber-50/40">
              {/* big decorative quote mark */}
              <div className="text-5xl md:text-6xl font-serif text-orange-200 leading-none mb-1 select-none">"</div>
              <p className="text-sm md:text-lg text-gray-700 italic font-medium leading-relaxed pl-1">
                {bean.quote}
              </p>
              <div className="text-5xl md:text-6xl font-serif text-orange-200 leading-none text-right mt-1 select-none">"</div>
            </div>
          )}
        </div>

      </div>

      {isAdmin && (
        <BeansOfWisdomForm
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          bean={bean}
          onSuccess={handleFormSuccess}
        />
      )}
    </section>
  );
}