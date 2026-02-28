import React, { useState, useEffect } from "react";
import { useAuth } from "@/controllers/AuthContext";
import { useTheme } from "@/controllers/Themecontext";
import {
  getAllBeans,
  deleteBean,
  BeanOfWisdom,
} from "@/services/beanOfWisdomService";
import {
  Loader2, Edit3, Trash2, X, Coffee,
  TrendingUp, Lightbulb, Sparkles,
} from "lucide-react";
import BeansOfWisdomForm from "@/components/BeansOfWisdomForm";

export default function BeansOfWisdomView() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [bean, setBean] = useState<BeanOfWisdom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { fetchBeans(); }, []);

  const fetchBeans = async () => {
    try {
      setLoading(true); setError(null);
      const beans = await getAllBeans();
      setBean(beans && beans.length > 0 ? beans[0] : null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch beans");
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!bean?._id || !isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this wisdom?")) return;
    try {
      setDeleteLoading(true); setError(null);
      await deleteBean(bean._id);
      setBean(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete bean");
    } finally { setDeleteLoading(false); }
  };

  const handleFormSuccess = () => { fetchBeans(); setShowEditForm(false); };

  // ── Theme tokens ─────────────────────────────────────────────────────────

  // Section bg (transparent — inherits page bg)
  const sectionHeadingColor = isLight ? "#0d1b2a" : "white";
  const sectionSubColor = isLight ? "rgba(13,37,64,0.55)" : "rgba(203,213,225,1)";

  // Main card wrapper
  const cardWrapBorder = isLight
    ? "1px solid rgba(13,37,64,0.12)"
    : "1px solid #334155";
  const cardWrapBg = isLight ? "#f0f7fe" : "#0F172A";
  const cardWrapShadow = isLight
    ? "0 8px 32px rgba(13,37,64,0.08)"
    : "0 8px 32px rgba(0,0,0,0.2)";

  // Left column (hero + description)
  const leftColBg = isLight ? "#dce8f7" : "#1E293B";
  const dividerColor = isLight ? "rgba(13,37,64,0.08)" : "rgba(255,255,255,0.07)";

  // Badge inside hero
  const badgeBg = isLight ? "rgba(13,37,64,0.06)" : "rgba(255,255,255,0.05)";
  const badgeBorder = isLight ? "1px solid rgba(13,37,64,0.1)" : "1px solid rgba(255,255,255,0.1)";
  const badgeTextColor = isLight ? "rgba(13,37,64,0.65)" : "rgba(255,255,255,0.85)";

  // Title in hero
  const heroTitleColor = isLight ? "#0d1b2a" : "white";
  const heroSubtitleColor = isLight ? "rgba(13,37,64,0.55)" : "rgba(255,255,255,0.60)";

  // Tag chips
  const tagBg = isLight ? "rgba(13,37,64,0.07)" : "rgba(255,255,255,0.08)";
  const tagBorder = isLight ? "1px solid rgba(13,37,64,0.1)" : "1px solid rgba(255,255,255,0.12)";
  const tagColor = isLight ? "rgba(13,37,64,0.6)" : "rgba(255,255,255,0.70)";

  // Description icon box
  const descIconBg = isLight ? "rgba(13,37,64,0.06)" : "rgba(255,255,255,0.05)";
  const descIconBorder = isLight ? "1px solid rgba(13,37,64,0.1)" : "1px solid rgba(255,255,255,0.10)";
  const descTextColor = isLight ? "rgba(13,37,64,0.60)" : "rgba(255,255,255,0.60)";

  // Right col — Key Principle
  const keyPrincipleBg = isLight ? "#c8ddf5" : "#334155";
  const keyPrincipleBorder = isLight ? "1px solid rgba(13,37,64,0.1)" : "1px solid #1E293B";
  const keyPrincipleTextColor = isLight ? "#0d1b2a" : "white";

  // Right col — Insight panel
  const insightPanelBg = isLight ? "#dce8f7" : "#1E293B";
  const insightPanelBorder = isLight ? "1px solid rgba(13,37,64,0.08)" : "1px solid #334155";
  const insightIconBg = isLight ? "rgba(245,158,11,0.1)" : "rgba(245,158,11,0.12)";
  const insightIconBorder = isLight ? "1px solid rgba(245,158,11,0.2)" : "1px solid rgba(245,158,11,0.20)";
  const insightTextColor = isLight ? "rgba(13,37,64,0.65)" : "rgba(203,213,225,1)";

  // Quote panel
  const quotePanelBg = isLight ? "#dce8f7" : "#1E293B";
  const quoteTextColor = isLight ? "rgba(13,37,64,0.60)" : "rgba(255,255,255,0.70)";

  // Error banner
  const errorBg = isLight ? "rgba(220,38,38,0.05)" : "rgba(220,38,38,0.1)";
  const errorBorder = isLight ? "1px solid rgba(220,38,38,0.2)" : "1px solid rgba(239,68,68,0.5)";
  const errorColor = isLight ? "#991b1b" : "rgba(252,165,165,1)";

  // Loading / empty state
  const emptyIconColor = "#F59E0B";
  const emptyTextColor = isLight ? "rgba(13,37,64,0.45)" : "rgba(148,163,184,1)";
  const spinnerColor = isLight ? "#D97706" : "#F59E0B";

  if (authLoading || loading) {
    return (
      <section className="py-10 px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="flex items-center justify-center py-24 gap-3">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: spinnerColor }} />
          <p className="text-sm font-medium" style={{ color: emptyTextColor }}>
            Brewing your weekly wisdom…
          </p>
        </div>
      </section>
    );
  }

  if (!bean) {
    return (
      <section className="py-10 px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="text-center py-24">
          <Coffee className="w-10 h-10 mx-auto mb-3" style={{ color: emptyIconColor }} />
          <p className="text-sm" style={{ color: emptyTextColor }}>No wisdom available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="beans-of-wisdom" className="py-10 px-4 sm:px-6 md:px-10 lg:px-12">

      {/* ── Section header ── */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <div className="w-1 h-4 rounded-full bg-[#F59E0B]" />
          <span className="text-xs font-bold text-[#F59E0B] tracking-[0.2em] uppercase">
            Weekly Edition
          </span>
          <div className="w-1 h-4 rounded-full bg-[#F59E0B]" />
        </div>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none"
          style={{ color: sectionHeadingColor }}
        >
          Beans of{" "}
          <span className="text-[#F59E0B]">Wisdom</span>
        </h2>
        <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: sectionSubColor }}>
          Curated market insight, delivered every week.
        </p>

        {isAdmin && (
          <div className="flex items-center justify-center gap-2.5 mt-4">
            <button
              onClick={() => setShowEditForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#0F172A] bg-[#F59E0B] hover:bg-[#D97706] rounded-xl transition-colors shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              onClick={handleDelete} disabled={deleteLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-red-500 bg-transparent hover:bg-red-500/10 border border-red-400/50 rounded-xl transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {deleteLoading ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div
          className="mb-6 flex items-start gap-2 rounded-xl p-4 text-sm"
          style={{ background: errorBg, border: errorBorder, color: errorColor }}
        >
          <p className="flex-1">{error}</p>
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ═══════════════════════════════════════
          MAIN CARD
      ═══════════════════════════════════════ */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: cardWrapBorder, boxShadow: cardWrapShadow, background: cardWrapBg }}
      >
        <div className="grid grid-cols-1 md:grid-cols-5">

          {/* ─── LEFT COLUMN ─── */}
          <div className="md:col-span-3 flex flex-col" style={{ background: leftColBg }}>

            {/* Hero */}
            <div className="relative px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 flex flex-col justify-between flex-1 overflow-hidden">
              {/* Decorative rings */}
              <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full pointer-events-none"
                style={{ border: isLight ? "1px solid rgba(13,37,64,0.06)" : "1px solid rgba(255,255,255,0.06)" }} />
              <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full pointer-events-none"
                style={{ border: isLight ? "1px solid rgba(13,37,64,0.04)" : "1px solid rgba(255,255,255,0.04)" }} />
              {/* Accent top bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: "linear-gradient(90deg,#F59E0B,rgba(245,158,11,0.8),transparent)" }} />

              <div className="relative z-10">
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7 w-fit"
                  style={{ background: badgeBg, border: badgeBorder }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                  <span className="text-[11px] font-bold tracking-[0.16em] uppercase" style={{ color: badgeTextColor }}>
                    Today's Wisdom
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.05] tracking-tight mb-5"
                  style={{ color: heroTitleColor }}
                >
                  {bean.title}
                </h3>

                {/* Subtitle */}
                {bean.subtitle && (
                  <p className="text-[13px] sm:text-[14px] leading-relaxed max-w-lg" style={{ color: heroSubtitleColor }}>
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
                      className="text-[11px] font-semibold px-3 py-1 rounded-full transition-colors cursor-default"
                      style={{ color: tagColor, background: tagBg, border: tagBorder }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="mx-6 sm:mx-8 h-px" style={{ background: dividerColor }} />

            {/* Description */}
            {(bean.sectionTitle || bean.description) && (
              <div className="px-6 py-6 sm:px-8 sm:py-8 md:px-12 flex gap-4 sm:gap-5">
                <div
                  className="flex-shrink-0 mt-0.5 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center"
                  style={{ background: descIconBg, border: descIconBorder }}
                >
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div className="flex-1 min-w-0">
                  {bean.sectionTitle && (
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#F59E0B] mb-2.5">
                      {bean.sectionTitle}
                    </p>
                  )}
                  {bean.description && (
                    <p className="text-[13px] sm:text-[13.5px] leading-[1.9]" style={{ color: descTextColor }}>
                      {bean.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="md:col-span-2 flex flex-col">

            {/* Key Principle */}
            {bean.keyPrinciple && (
              <div
                className="flex-1 p-6 sm:p-7 md:p-8 flex flex-col justify-center gap-3"
                style={{ background: keyPrincipleBg, borderBottom: keyPrincipleBorder }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-[#0F172A]" />
                  </div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#F59E0B]">
                    Key Principle
                  </p>
                </div>
                <p className="text-lg sm:text-xl md:text-[1.45rem] font-bold leading-snug" style={{ color: keyPrincipleTextColor }}>
                  {bean.keyPrinciple}
                </p>
                <div className="w-10 h-[3px] rounded-full bg-[#F59E0B]" />
              </div>
            )}

            {/* Insight */}
            {bean.insightText && (
              <div
                className="flex-1 p-6 sm:p-7 md:p-8 flex flex-col justify-center gap-3"
                style={{ background: insightPanelBg, borderBottom: insightPanelBorder }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: insightIconBg, border: insightIconBorder }}
                  >
                    <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#F59E0B]">
                    {bean.insightTag || "Investment Strategy"}
                  </p>
                </div>
                <p className="text-[13px] leading-[1.9]" style={{ color: insightTextColor }}>
                  {bean.insightText}
                </p>
              </div>
            )}

            {/* Quote */}
            {bean.quote && (
              <div
                className="relative flex flex-col justify-center p-6 sm:p-7 md:p-9 overflow-hidden"
                style={{ background: quotePanelBg }}
              >
                {/* Subtle inner glow */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(245,158,11,0.1) 0%,transparent 65%)" }}
                />
                {/* Accent top bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: "linear-gradient(90deg,rgba(245,158,11,0.5),transparent)" }}
                />

                <div className="relative z-10">
                  <div className="text-6xl leading-none font-serif select-none mb-3"
                    style={{ color: "rgba(245,158,11,0.3)" }}>"</div>
                  <p className="text-[14px] md:text-[15px] italic font-light leading-[1.95] px-1"
                    style={{ color: quoteTextColor }}>
                    {bean.quote}
                  </p>
                  <div className="text-6xl leading-none font-serif select-none text-right mt-2"
                    style={{ color: "rgba(245,158,11,0.3)" }}>"</div>
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