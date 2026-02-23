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
      <section className="py-10 px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="flex items-center justify-center py-24 gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#F59E0B]" />
          <p className="text-[#94A3B8] text-sm font-medium">Brewing your weekly wisdom…</p>
        </div>
      </section>
    );
  }

  if (!bean) {
    return (
      <section className="py-10 px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="text-center py-24">
          <Coffee className="w-10 h-10 text-[#F59E0B] mx-auto mb-3" />
          <p className="text-[#94A3B8] text-sm">No wisdom available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="beans-of-wisdom" className="py-10 px-4 sm:px-6 md:px-10 lg:px-12">

      {/* ══════════════════════════════════
          SECTION HEADER
      ══════════════════════════════════ */}
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-1 h-4 rounded-full bg-[#F59E0B]" />
            <span className="text-xs font-bold text-[#F59E0B] tracking-[0.2em] uppercase">
              Weekly Edition
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black tracking-tight leading-none">
            Beans of{" "}
            <span className="text-[#F59E0B]">Wisdom</span>
          </h2>
          <p className="text-sm text-[#94A3B8] mt-2">
            Curated market insight, delivered every week.
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowEditForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#0F172A] bg-[#F59E0B] hover:bg-[#D97706] rounded-xl transition-colors shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-red-400 bg-transparent hover:bg-red-900/20 border border-red-500/50 rounded-xl transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {deleteLoading ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="mb-6 flex items-start gap-2 bg-red-900/20 border border-red-500/50 rounded-xl p-4 text-sm text-red-400">
          <p className="flex-1">{error}</p>
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MAIN CARD
          Layout: Left col = full-height dark (hero + desc)
                  Right col = slate panels top + dark quote bottom
                  The two darks touch seamlessly — no gap
      ══════════════════════════════════════════════════════ */}
      <div className="rounded-2xl overflow-hidden border border-[#334155] shadow-xl shadow-black/20 bg-[#0F172A]">

        <div className="grid grid-cols-1 md:grid-cols-5">

          {/* ═══════════════════════════════════════
              LEFT COLUMN — full dark, top + bottom
              Hero flows directly into Description — one unified dark block
          ═══════════════════════════════════════ */}
          <div className="md:col-span-3 flex flex-col bg-[#1E293B]">

            {/* ── Hero ── */}
            <div className="relative px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 flex flex-col justify-between flex-1 overflow-hidden">

              {/* Decorative rings */}
              <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full border border-white/[0.06] pointer-events-none" />
              <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full border border-white/[0.04] pointer-events-none" />
              {/* Accent line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#F59E0B] via-[#F59E0B]/80 to-transparent" />

              <div className="relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-7 w-fit">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                  <span className="text-white/85 text-[11px] font-bold tracking-[0.16em] uppercase">
                    Today's Wisdom
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.05] tracking-tight mb-5">
                  {bean.title}
                </h3>

                {/* Subtitle */}
                {bean.subtitle && (
                  <p className="text-[13px] sm:text-[14px] text-white/60 leading-relaxed max-w-lg">
                    {bean.subtitle}
                  </p>
                )}
              </div>

              {/* Tags */}
              {bean.tags && bean.tags.length > 0 && (
                <div className="relative z-10 flex flex-wrap gap-2 mt-6 sm:mt-8">
                  {bean.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-semibold text-white/70 bg-white/[0.08] border border-white/[0.12] px-3 py-1 rounded-full hover:bg-white/[0.12] hover:text-white/80 transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ── Seamless divider inside dark — subtle only ── */}
            <div className="mx-6 sm:mx-8 h-px bg-white/[0.07]" />

            {/* ── Description — same dark, flows naturally ── */}
            {(bean.sectionTitle || bean.description) && (
              <div className="px-6 py-6 sm:px-8 sm:py-8 md:px-12 flex gap-4 sm:gap-5">
                <div className="flex-shrink-0 mt-0.5 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div className="flex-1 min-w-0">
                  {bean.sectionTitle && (
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#F59E0B] mb-2.5">
                      {bean.sectionTitle}
                    </p>
                  )}
                  {bean.description && (
                    <p className="text-[13px] sm:text-[13.5px] text-white/60 leading-[1.9]">
                      {bean.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════
              RIGHT COLUMN
              Top: Key Principle (slate) + Insight (darker)
              Bottom: Quote — same dark as left col
              The quote dark seamlessly matches left dark
          ═══════════════════════════════════════ */}
          <div className="md:col-span-2 flex flex-col">

            {/* Key Principle */}
            {bean.keyPrinciple && (
              <div className="flex-1 p-6 sm:p-7 md:p-8 bg-[#334155] flex flex-col justify-center gap-3 border-b border-[#1E293B]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-[#0F172A]" />
                  </div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#F59E0B]">
                    Key Principle
                  </p>
                </div>
                <p className="text-lg sm:text-xl md:text-[1.45rem] font-bold text-white leading-snug">
                  {bean.keyPrinciple}
                </p>
                <div className="w-10 h-[3px] rounded-full bg-[#F59E0B]" />
              </div>
            )}

            {/* Insight */}
            {bean.insightText && (
              <div className="flex-1 p-6 sm:p-7 md:p-8 bg-[#1E293B] flex flex-col justify-center gap-3 border-b border-[#334155]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/12 border border-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#F59E0B]">
                    {bean.insightTag || "Investment Strategy"}
                  </p>
                </div>
                <p className="text-[13px] text-[#CBD5E1] leading-[1.9]">
                  {bean.insightText}
                </p>
              </div>
            )}

            {/* Quote — SAME dark as left col, touching directly */}
            {bean.quote && (
              <div className="relative flex flex-col justify-center p-6 sm:p-7 md:p-9 bg-[#1E293B] overflow-hidden">
                {/* Subtle inner glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.12)_0%,transparent_65%)] pointer-events-none" />
                {/* Accent — matches left col top line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#F59E0B]/60 to-transparent" />

                <div className="relative z-10">
                  <div className="text-6xl leading-none font-serif text-[#F59E0B]/35 select-none mb-3">"</div>
                  <p className="text-[14px] md:text-[15px] text-white/70 italic font-light leading-[1.95] px-1">
                    {bean.quote}
                  </p>
                  <div className="text-6xl leading-none font-serif text-[#F59E0B]/35 select-none text-right mt-2">"</div>
                </div>
              </div>
            )}

          </div>
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