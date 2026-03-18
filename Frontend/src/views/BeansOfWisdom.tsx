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

/* ── Animation styles injected once ── */
const StyleInjector = () => {
  useEffect(() => {
    if (document.getElementById("bow-anim")) return;
    const s = document.createElement("style");
    s.id = "bow-anim";
    s.textContent = `
      @keyframes bow-up {
        from { opacity:0; transform:translateY(14px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes bow-line {
        from { transform:scaleX(0); }
        to   { transform:scaleX(1); }
      }
      @keyframes bow-dot {
        0%,100% { opacity:1; transform:scale(1); }
        50%      { opacity:.45; transform:scale(.7); }
      }
      .bow-up  { animation: bow-up 0.5s cubic-bezier(.22,.68,0,1.15) both; }
      .bow-d1  { animation-delay:.06s; }
      .bow-d2  { animation-delay:.14s; }
      .bow-d3  { animation-delay:.22s; }
      .bow-d4  { animation-delay:.30s; }
      .bow-d5  { animation-delay:.38s; }
      .bow-d6  { animation-delay:.46s; }
      .bow-line-anim { transform-origin:left; animation: bow-line 0.55s .25s cubic-bezier(.22,.68,0,1.15) both; }
      .bow-dot  { animation: bow-dot 2.2s ease-in-out infinite; }
    `;
    document.head.appendChild(s);
  }, []);
  return null;
};

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

  /* ══ Colors — enhanced light mode ══ */
  const sectionHeadingColor = isLight ? "#0f172a" : "white";
  const sectionSubColor     = isLight ? "#64748b" : "rgba(203,213,225,1)";

  const cardWrapBorder  = isLight ? "1px solid rgba(226,232,240,0.9)" : "1px solid rgba(81,148,246,0.2)";
  const cardWrapBg      = isLight ? "#ffffff" : "#0F172A";
  const cardWrapShadow  = isLight ? "0 8px 40px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)" : "0 8px 32px rgba(0,0,0,0.35)";

  const leftColBg       = isLight ? "#f8fbff" : "#1E293B";
  const dividerColor    = isLight ? "rgba(226,232,240,0.8)" : "rgba(81,148,246,0.1)";

  const badgeBg         = isLight ? "rgba(248,250,252,0.9)" : "rgba(81,148,246,0.08)";
  const badgeBorder     = isLight ? "1px solid rgba(226,232,240,0.9)" : "1px solid rgba(81,148,246,0.18)";
  const badgeTextColor  = isLight ? "#475569" : "rgba(255,255,255,0.85)";

  const heroTitleColor    = isLight ? "#0f172a" : "white";
  const heroSubtitleColor = isLight ? "#64748b" : "rgba(255,255,255,0.60)";

  const tagBg     = isLight ? "rgba(241,245,249,0.9)" : "rgba(81,148,246,0.1)";
  const tagBorder = isLight ? "1px solid rgba(226,232,240,0.8)" : "1px solid rgba(81,148,246,0.2)";
  const tagColor  = isLight ? "#64748b" : "rgba(129,174,249,1)";

  const descIconBg     = isLight ? "rgba(239,246,255,0.9)" : "rgba(81,148,246,0.08)";
  const descIconBorder = isLight ? "1px solid rgba(219,234,254,0.8)" : "1px solid rgba(255,255,255,0.10)";
  const descTextColor  = isLight ? "#475569" : "rgba(255,255,255,0.60)";

  const keyPrincipleBg         = isLight ? "#eff6ff" : "rgba(81,148,246,0.12)";
  const keyPrincipleBorderClr  = isLight ? "rgba(219,234,254,0.8)" : "#1E293B";
  const keyPrincipleTextColor  = isLight ? "#0f172a" : "white";

  const insightPanelBg     = isLight ? "#f8fbff" : "#1E293B";
  const insightPanelBorder = isLight ? "rgba(226,232,240,0.8)" : "#1C3656";
  const insightIconBg      = isLight ? "rgba(239,246,255,0.9)" : "rgba(81,148,246,0.12)";
  const insightIconBorder  = isLight ? "1px solid rgba(219,234,254,0.8)" : "1px solid rgba(81,148,246,0.22)";
  const insightTextColor   = isLight ? "#475569" : "rgba(203,213,225,1)";

  const quotePanelBg   = isLight ? "#f8fbff" : "#1E293B";
  const quoteTextColor = isLight ? "#64748b" : "rgba(129,174,249,1)";

  const errorBg     = isLight ? "rgba(254,242,242,1)" : "rgba(220,38,38,0.1)";
  const errorBorder = isLight ? "1px solid rgba(254,202,202,0.8)" : "1px solid rgba(239,68,68,0.5)";
  const errorColor  = isLight ? "#dc2626" : "rgba(252,165,165,1)";

  const emptyIconColor = "#5194F6";
  const emptyTextColor = isLight ? "#94a3b8" : "rgba(148,163,184,1)";
  const spinnerColor   = isLight ? "#3a7de8" : "#5194F6";

  /* ── Loading ── */
  if (authLoading || loading) {
    return (
      <section className="py-6 lg:py-10 px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="flex items-center justify-center py-12 lg:py-24 gap-3">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: spinnerColor }} />
          <p className="text-sm font-medium" style={{ color: emptyTextColor }}>
            Brewing your weekly wisdom…
          </p>
        </div>
      </section>
    );
  }

  /* ── Empty ── */
  if (!bean) {
    return (
      <section className="py-6 lg:py-10 px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="text-center py-12 lg:py-24">
          <Coffee className="w-10 h-10 mx-auto mb-3" style={{ color: emptyIconColor }} />
          <p className="text-sm" style={{ color: emptyTextColor }}>No wisdom available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <StyleInjector />

      {/* ── section padding: compact on mobile, original on desktop ── */}
      <section id="beans-of-wisdom" className="py-6 lg:py-10 px-4 sm:px-6 md:px-10 lg:px-12">

        {/* ════ SECTION HEADER ════ */}
        <div className="mb-5 lg:mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <div className="w-1 h-4 rounded-full bg-[#5194F6]" />
            <span className="text-xs font-bold text-[#5194F6] tracking-[0.2em] uppercase">
              Weekly Edition
            </span>
            <div className="w-1 h-4 rounded-full bg-[#5194F6]" />
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none"
            style={{ color: sectionHeadingColor }}
          >
            Beans of <span className="text-[#5194F6]">Wisdom</span>
          </h2>
          <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: sectionSubColor }}>
            Curated market insight, delivered every week.
          </p>

          {isAdmin && (
            <div className="flex items-center justify-center gap-2.5 mt-4">
              <button
                onClick={() => setShowEditForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#5194F6] hover:bg-[#D97706] rounded-xl transition-colors shadow-sm"
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
            className="mb-4 lg:mb-6 flex items-start gap-2 rounded-xl p-4 text-sm"
            style={{ background: errorBg, border: errorBorder, color: errorColor }}
          >
            <p className="flex-1">{error}</p>
            <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* ════ MAIN CARD ════ */}
        <div
          className="rounded-2xl overflow-hidden bow-up bow-d1"
          style={{ border: cardWrapBorder, boxShadow: cardWrapShadow, background: cardWrapBg }}
        >
          {/* Top strip */}
          <div style={{ height: 3, background: "linear-gradient(90deg,#5194F6,rgba(81,148,246,0.5),transparent)" }} />

          {/* ── MOBILE LAYOUT: stacked, everything compact ── */}
          <div className="lg:hidden">

            {/* Title block */}
            <div className="px-5 pt-5 pb-4" style={{ background: leftColBg }}>
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 w-fit"
                style={{ background: badgeBg, border: badgeBorder }}
              >
                <span className="bow-dot w-2 h-2 rounded-full bg-[#5194F6] block" />
                <span className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: badgeTextColor }}>
                  Today's Wisdom
                </span>
              </div>
              <h3 className="text-2xl font-extrabold leading-tight tracking-tight" style={{ color: heroTitleColor }}>
                {bean.title}
              </h3>
              <div className="bow-line-anim mt-3 mb-3" style={{ height: 3, width: 40, background: "linear-gradient(90deg,#5194F6,rgba(81,148,246,0.4))", borderRadius: 2 }} />
              {bean.subtitle && (
                <p className="text-[13px] leading-relaxed" style={{ color: heroSubtitleColor }}>
                  {bean.subtitle}
                </p>
              )}
            </div>

            {/* Description — collapsible feel: show inline, no big padding */}
            {(bean.sectionTitle || bean.description) && (
              <div className="px-5 py-4 flex gap-3" style={{ background: leftColBg, borderTop: `1px solid ${dividerColor}` }}>
                <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5" style={{ background: descIconBg, border: descIconBorder }}>
                  <Sparkles className="w-3.5 h-3.5 text-[#5194F6]" />
                </div>
                <div className="flex-1 min-w-0">
                  {bean.sectionTitle && (
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#5194F6] mb-1">{bean.sectionTitle}</p>
                  )}
                  {bean.description && (
                    <p className="text-[12.5px] leading-relaxed" style={{ color: descTextColor }}>{bean.description}</p>
                  )}
                </div>
              </div>
            )}

            {/* Key Principle — compact */}
            {bean.keyPrinciple && (
              <div className="px-5 py-4 flex gap-3 items-start" style={{ background: keyPrincipleBg, borderTop: `1px solid ${keyPrincipleBorderClr}` }}>
                <div className="w-7 h-7 rounded-lg bg-[#5194F6] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#0F172A]" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#5194F6] mb-1">Key Principle</p>
                  <p className="text-base font-extrabold leading-snug" style={{ color: keyPrincipleTextColor }}>{bean.keyPrinciple}</p>
                </div>
              </div>
            )}

            {/* Insight — compact */}
            {bean.insightText && (
              <div className="px-5 py-4 flex gap-3 items-start" style={{ background: insightPanelBg, borderTop: `1px solid ${insightPanelBorder}` }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: insightIconBg, border: insightIconBorder }}>
                  <Lightbulb className="w-3.5 h-3.5 text-[#5194F6]" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#5194F6] mb-1">{bean.insightTag || "Investment Strategy"}</p>
                  <p className="text-[12.5px] leading-relaxed" style={{ color: insightTextColor }}>{bean.insightText}</p>
                </div>
              </div>
            )}

            {/* Quote — compact, no giant quotation marks */}
            {bean.quote && (
              <div className="px-5 py-4 relative overflow-hidden" style={{ background: quotePanelBg, borderTop: `1px solid ${dividerColor}` }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,rgba(245,158,11,0.55),transparent)" }} />
                <div className="flex gap-2 items-start">
                  <span className="text-[#5194F6] text-2xl font-serif leading-none mt-1 opacity-60">"</span>
                  <p className="text-[12.5px] italic leading-relaxed flex-1" style={{ color: quoteTextColor }}>{bean.quote}</p>
                  <span className="text-[#5194F6] text-2xl font-serif leading-none self-end opacity-60">"</span>
                </div>
              </div>
            )}

            {/* Tags — compact */}
            {bean.tags && bean.tags.length > 0 && (
              <div className="px-5 py-3 flex flex-wrap gap-2" style={{ background: leftColBg, borderTop: `1px solid ${dividerColor}` }}>
                {bean.tags.map((tag, i) => (
                  <span key={i} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full cursor-default"
                    style={{ color: tagColor, background: tagBg, border: tagBorder }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── DESKTOP LAYOUT: original, completely unchanged ── */}
          <div className="hidden lg:grid grid-cols-5">

            {/* ══════ LEFT ══════ */}
            <div className="col-span-3 flex flex-col" style={{ background: leftColBg, borderRight: `1px solid ${dividerColor}` }}>

              <div className="bow-up bow-d2 px-9 md:px-11 pt-9 pb-7">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 w-fit" style={{ background: badgeBg, border: badgeBorder }}>
                  <span className="bow-dot w-2 h-2 rounded-full bg-[#5194F6] block" />
                  <span className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: badgeTextColor }}>Today's Wisdom</span>
                </div>
                <h3 className="text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold leading-[1.06] tracking-tight" style={{ color: heroTitleColor }}>
                  {bean.title}
                </h3>
                <div className="bow-line-anim mt-4 mb-5" style={{ height: 3, width: 52, background: "linear-gradient(90deg,#5194F6,rgba(81,148,246,0.4))", borderRadius: 2 }} />
                {bean.subtitle && (
                  <p className="text-[13.5px] leading-relaxed max-w-lg" style={{ color: heroSubtitleColor }}>{bean.subtitle}</p>
                )}
              </div>

              <div className="mx-9 h-px" style={{ background: dividerColor }} />

              {(bean.sectionTitle || bean.description) && (
                <div className="bow-up bow-d3 px-9 md:px-11 py-6 flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5" style={{ background: descIconBg, border: descIconBorder }}>
                    <Sparkles className="w-4 h-4 text-[#5194F6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {bean.sectionTitle && (
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#5194F6] mb-2">{bean.sectionTitle}</p>
                    )}
                    {bean.description && (
                      <p className="text-[13px] sm:text-[13.5px] leading-[1.85]" style={{ color: descTextColor }}>{bean.description}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="mx-9 h-px" style={{ background: dividerColor }} />

              {bean.tags && bean.tags.length > 0 && (
                <div className="bow-up bow-d4 px-9 md:px-11 py-16 flex flex-wrap gap-2">
                  {bean.tags.map((tag, i) => (
                    <span key={i} className="text-[11px] font-semibold px-3 py-1 rounded-full cursor-default"
                      style={{ color: tagColor, background: tagBg, border: tagBorder }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ══════ RIGHT ══════ */}
            <div className="col-span-2 flex flex-col">

              {bean.keyPrinciple && (
                <div className="bow-up bow-d3 flex-1 flex flex-col justify-center gap-4 px-7 py-7"
                  style={{ background: keyPrincipleBg, borderBottom: `1px solid ${keyPrincipleBorderClr}` }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#5194F6] flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-[#0F172A]" />
                    </div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#5194F6]">Key Principle</p>
                  </div>
                  <p className="text-xl sm:text-2xl font-extrabold leading-snug tracking-tight" style={{ color: keyPrincipleTextColor }}>{bean.keyPrinciple}</p>
                  <div className="w-10 h-[3px] rounded-full bg-[#5194F6]" />
                </div>
              )}

              {bean.insightText && (
                <div className="bow-up bow-d4 flex-1 flex flex-col justify-center gap-3 px-7 py-7"
                  style={{ background: insightPanelBg, borderBottom: `1px solid ${insightPanelBorder}` }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: insightIconBg, border: insightIconBorder }}>
                      <Lightbulb className="w-4 h-4 text-[#5194F6]" />
                    </div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#5194F6]">{bean.insightTag || "Investment Strategy"}</p>
                  </div>
                  <p className="text-[13px] leading-[1.85]" style={{ color: insightTextColor }}>{bean.insightText}</p>
                </div>
              )}

              {bean.quote && (
                <div className="bow-up bow-d5 relative flex flex-col justify-center px-7 py-8 overflow-hidden" style={{ background: quotePanelBg }}>
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,rgba(245,158,11,0.55),transparent)" }} />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(81,148,246,0.07) 0%,transparent 65%)" }} />
                  <div className="relative z-10">
                    <div className="text-[5rem] leading-none font-serif select-none mb-2" style={{ color: "rgba(81,148,246,0.2)" }}>"</div>
                    <p className="text-[13.5px] md:text-[14.5px] italic font-light leading-[1.9] px-1" style={{ color: quoteTextColor }}>{bean.quote}</p>
                    <div className="text-[5rem] leading-none font-serif select-none text-right mt-1" style={{ color: "rgba(81,148,246,0.2)" }}>"</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom strip */}
          <div style={{ height: 3, background: "linear-gradient(90deg,transparent,rgba(81,148,246,0.4),#5194F6)" }} />
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
    </>
  );
}