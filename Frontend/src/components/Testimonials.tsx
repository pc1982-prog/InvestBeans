"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Star, X, ChevronLeft, ChevronRight, Quote,
  Plus, Edit3, Trash2, Loader2,
} from "lucide-react";
import { useTheme } from "@/controllers/Themecontext";
import { useAuth } from "@/controllers/AuthContext";
import {
  getAllTestimonials,
  getMyTestimonial,
  deleteTestimonial,
  Testimonial as ApiTestimonial,
} from "@/services/Testimonialservice";
import TestimonialForm from "@/components/Testimonialform";
import { useToast, ToastContainer } from "@/components/ui/ToastTestimonial";

// ─────────────────────────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────────────────────────
interface Testimonial {
  id: string;
  _id?: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  preview: string;
  fullText: string;
  date: string;
  source: string;
  tag: string;
  userId?: string;
}

function toUnified(t: ApiTestimonial): Testimonial {
  return {
    id: t._id,
    _id: t._id,
    name: t.name,
    role: t.role || "",
    company: t.company || "",
    avatar: t.avatar || t.name?.slice(0, 2).toUpperCase() || "??",
    rating: t.rating,
    preview: t.preview,
    fullText: t.fullText,
    date: new Date(t.createdAt).toLocaleDateString("en-IN", {
      year: "numeric", month: "long", day: "numeric",
    }),
    source: t.source || "InvestBeans",
    tag: t.tag || "General",
    userId: t.user?._id,
  };
}

// ─── Stars ─────────────────────────────────────────────────────────────────
function Stars({ rating, size = 16, isLight }: { rating: number; size?: number; isLight: boolean }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i} size={size}
          style={{
            fill: i < rating ? "#F59E0B" : isLight ? "rgba(13,37,64,0.12)" : "rgba(255,255,255,0.15)",
            color: i < rating ? "#F59E0B" : isLight ? "rgba(13,37,64,0.12)" : "rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Small icon-only action button ─────────────────────────────────────────
function ActionIcon({
  icon: Icon, color, bg, border: borderStyle, title, onClick, loading,
}: {
  icon: any; color: string; bg: string; border: string;
  title: string; onClick: (e: React.MouseEvent) => void; loading?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "30px", height: "30px", borderRadius: "50%",
        border: borderStyle,
        background: hov ? color : bg,
        color: hov ? "#fff" : color,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 0.18s ease", flexShrink: 0,
      }}
    >
      {loading
        ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
        : <Icon size={13} strokeWidth={2.2} />}
    </button>
  );
}

// ─── Testimonial Card ──────────────────────────────────────────────────────
function TestimonialCard({
  t, onClick, isMobile, isLight, onDelete, onEdit, canEdit, canDelete, deleting,
}: {
  t: Testimonial; onClick: () => void; isMobile: boolean; isLight: boolean;
  onDelete?: () => void; onEdit?: () => void;
  canEdit?: boolean; canDelete?: boolean; deleting?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const cardBg           = isLight ? "rgba(255,255,255,0.98)" : "rgba(28,54,86,0.25)";
  const cardBorderNormal = isLight ? "rgba(226,232,240,0.9)" : "rgba(81,148,246,0.15)";
  const cardBorderHover  = "#5194F6";
  const cardShadowNormal = isLight ? "0 2px 16px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.03)" : "0 2px 16px rgba(0,0,0,0.30)";
  const cardShadowHover  = isLight ? "0 20px 60px rgba(81,148,246,0.14), 0 4px 16px rgba(0,0,0,0.06)" : "0 16px 48px rgba(81,148,246,0.18)";
  const reviewTextColor  = isLight ? "#475569" : "rgba(226,232,240,1)";
  const nameColor        = isLight ? "#0f172a" : "white";
  const roleColor        = isLight ? "#94a3b8" : "rgba(148,163,184,1)";
  const avatarBg         = isLight ? "rgba(81,148,246,0.10)" : "rgba(81,148,246,0.15)";
  const sourceColor      = isLight ? "#94a3b8" : "rgba(100,116,139,1)";
  const sourceDotColor   = isLight ? "rgba(148,163,184,0.4)" : "rgba(255,255,255,0.20)";
  const tagBg            = isLight ? "rgba(81,148,246,0.08)" : "rgba(81,148,246,0.12)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: cardBg,
        borderRadius: "20px",
        border: `1.5px solid ${hovered && !isMobile ? cardBorderHover : cardBorderNormal}`,
        boxShadow: hovered && !isMobile ? cardShadowHover : cardShadowNormal,
        padding: isMobile ? "24px 20px 22px" : "32px 30px 28px",
        transition: "all 0.22s ease",
        transform: hovered && !isMobile ? "translateY(-4px)" : "translateY(0)",
        display: "flex", flexDirection: "column" as const, gap: "16px",
        width: "100%", boxSizing: "border-box" as const,
        position: "relative" as const, overflow: "hidden",
      }}
    >
      {/* Watermark */}
      <div style={{ position: "absolute", bottom: "-8px", right: "-4px", opacity: 0.06, pointerEvents: "none" }}>
        <Quote size={isMobile ? 80 : 120} style={{ color: "#5194F6" }} />
      </div>

      {/* Top row: Tag + Stars + Action icons */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <span style={{
          fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em",
          textTransform: "uppercase" as const, color: "#5194F6",
          background: tagBg, borderRadius: "20px", padding: "3px 11px", whiteSpace: "nowrap" as const,
          flexShrink: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {t.tag}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <Stars rating={t.rating} size={isMobile ? 14 : 16} isLight={isLight} />

          {/* Icon actions — only for owner (edit) or admin (delete) */}
          {(canEdit || canDelete) && t._id && (
            <div style={{ display: "flex", gap: "6px" }}>
              {canEdit && (
                <ActionIcon
                  icon={Edit3}
                  title="Edit your review"
                  color="#5194F6"
                  bg="rgba(81,148,246,0.12)"
                  border="1px solid rgba(81,148,246,0.35)"
                  onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
                />
              )}
              {canDelete && (
                <ActionIcon
                  icon={Trash2}
                  title="Delete review"
                  color="#ef4444"
                  bg="rgba(239,68,68,0.08)"
                  border="1px solid rgba(239,68,68,0.3)"
                  onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                  loading={deleting}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quote icon */}
      <Quote size={isMobile ? 20 : 24} style={{ color: "#E8C45A", fill: "#E8C45A", marginBottom: "-4px" }} />

      {/* Review text */}
      <p
        onClick={onClick}
        style={{
          margin: 0, fontSize: isMobile ? "14px" : "15px",
          color: reviewTextColor, lineHeight: 1.75,
          display: "-webkit-box", WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical" as any, overflow: "hidden",
          fontStyle: "italic", cursor: "pointer",
        }}
      >
        {t.preview}
      </p>

      {/* Read more */}
      <p onClick={onClick} style={{ margin: 0, fontSize: "12px", color: "#5194F6", fontWeight: 600, cursor: "pointer" }}>
        Read full review →
      </p>

      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "4px" }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "50%",
          background: avatarBg, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", fontWeight: 700, color: "#5194F6", flexShrink: 0,
        }}>
          {t.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: nameColor }}>{t.name}</p>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: roleColor }}>
            {[t.role, t.company].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: sourceDotColor }} />
          <span style={{ fontSize: "11px", color: sourceColor }}>{t.source}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Full-review Modal ─────────────────────────────────────────────────────
function Modal({ t, onClose, isLight }: { t: Testimonial; onClose: () => void; isLight: boolean }) {
  const modalBg      = isLight ? "#ffffff" : "linear-gradient(160deg,#0d1f38 0%,#0c1a2e 100%)";
  const modalBorder  = isLight ? "1px solid rgba(226,232,240,0.8)" : "1px solid rgba(255,255,255,0.1)";
  const titleColor   = isLight ? "#0f172a" : "white";
  const metaColor    = isLight ? "#94a3b8" : "rgba(148,163,184,1)";
  const dividerColor = isLight ? "rgba(226,232,240,0.8)" : "rgba(255,255,255,0.08)";
  const bodyColor    = isLight ? "#475569" : "rgba(226,232,240,1)";
  const avatarBg     = isLight ? "rgba(81,148,246,0.10)" : "rgba(81,148,246,0.18)";
  const closeBtnBg   = isLight ? "rgba(226,232,240,0.6)" : "rgba(255,255,255,0.1)";
  const closeBtnColor = isLight ? "#64748b" : "rgba(203,213,225,1)";

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        style={{ width: "100%", maxWidth: "640px", maxHeight: "90vh", borderRadius: "24px", overflow: "hidden", overflowY: "auto", background: modalBg, border: modalBorder, boxShadow: "0 32px 80px rgba(0,0,0,0.35)", position: "relative" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,transparent,rgba(81,148,246,0.50),transparent)" }} />
        <div style={{ padding: "32px 28px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 800, color: "#5194F6" }}>
                {t.avatar}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: titleColor }}>{t.name}</p>
                <p style={{ margin: "3px 0 0", fontSize: "13px", color: metaColor }}>{[t.role, t.company].filter(Boolean).join(" · ")}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "none", background: closeBtnBg, color: closeBtnColor, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={16} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <Stars rating={t.rating} size={18} isLight={isLight} />
            <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", color: "#5194F6", background: "rgba(81,148,246,0.12)", borderRadius: "20px", padding: "3px 10px" }}>{t.tag}</span>
            <span style={{ fontSize: "12px", color: metaColor }}>{t.date} · {t.source}</span>
          </div>
          <div style={{ height: "1px", background: dividerColor, marginBottom: "20px" }} />
          {t.fullText.split("\n\n").map((para, i) => (
            <p key={i} style={{ margin: "0 0 16px", fontSize: "15px", lineHeight: 1.8, color: bodyColor, fontStyle: "italic" }}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function TestimonialsPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { user, isAdmin, loading: authLoading } = useAuth();
  const isLoggedIn = !!user;

  const [index, setIndex] = useState(0);
  const [modal, setModal] = useState<Testimonial | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cardsHovered, setCardsHovered] = useState(false);

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // API state
  const [apiTestimonials, setApiTestimonials] = useState<Testimonial[]>([]);
  const [myTestimonial, setMyTestimonial] = useState<ApiTestimonial | null>(null);
  const [loadingApi, setLoadingApi] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ApiTestimonial | null>(null);
  const { toasts, toast, removeToast } = useToast();

  // Only real API reviews — no static/dummy data
  const allTestimonials = apiTestimonials;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => {
    if (isLoggedIn) fetchMine();
    else setMyTestimonial(null);
  }, [isLoggedIn]);

  const fetchAll = async () => {
    try {
      setLoadingApi(true);
      const data = await getAllTestimonials();
      setApiTestimonials(data.map(toUnified));
    } catch { /* silent fail */ } finally {
      setLoadingApi(false);
    }
  };

  const fetchMine = async () => {
    try { setMyTestimonial(await getMyTestimonial()); }
    catch { setMyTestimonial(null); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      setDeletingId(id);
      await deleteTestimonial(id);
      setApiTestimonials(prev => prev.filter(t => t._id !== id));
      if (myTestimonial?._id === id) setMyTestimonial(null);
      toast.success("Review deleted successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete review.");
    } finally { setDeletingId(null); }
  };

  const handleFormSuccess = (updated: ApiTestimonial) => {
    const unified = toUnified(updated);
    setApiTestimonials(prev => {
      const idx = prev.findIndex(t => t._id === updated._id);
      if (idx >= 0) {
        const copy = [...prev]; copy[idx] = unified;
        toast.success("Review updated successfully.");
        return copy;
      }
      toast.success("Review posted! Thank you for your feedback.");
      return [unified, ...prev];
    });
    setMyTestimonial(updated);
    setEditTarget(null);
  };

  const openCreate = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (t: Testimonial) => {
    setEditTarget({
      _id: t._id!, user: { _id: t.userId!, name: t.name, email: "" },
      name: t.name, role: t.role, company: t.company, avatar: t.avatar,
      rating: t.rating, preview: t.preview, fullText: t.fullText,
      tag: t.tag, source: t.source, createdAt: "",
    });
    setFormOpen(true);
  };

  // ── Carousel ──────────────────────────────────────────────────────────────
  const perPage  = isMobile ? 1 : 2;
  const totalDots = Math.max(1, Math.ceil(allTestimonials.length / perPage));
  const visible  = allTestimonials.slice(index * perPage, index * perPage + perPage);

  const prev = useCallback(() => setIndex(i => (i - 1 + totalDots) % totalDots), [totalDots]);
  const next = useCallback(() => setIndex(i => (i + 1) % totalDots), [totalDots]);

  useEffect(() => { setIndex(0); }, [allTestimonials.length]);

  useEffect(() => {
    if (cardsHovered || allTestimonials.length === 0) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, cardsHovered, allTestimonials.length]);

  // ── Touch swipe ───────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // ── Button visibility logic ───────────────────────────────────────────────
  // ● Not logged in           → soft prompt text only
  // ● Logged in, no review    → "Write a Review" button
  // ● Logged in, has review   → "Edit My Review" button  (no duplicate create)
  // ● Admin                   → no top button; delete icon shows on each card
  const userAlreadyPosted = !!myTestimonial;
  const showWriteBtn = isLoggedIn && !isAdmin && !userAlreadyPosted && !authLoading;
  const showEditBtn  = isLoggedIn && !isAdmin &&  userAlreadyPosted && !!myTestimonial && !authLoading;

  // Theme tokens
  const headingColor    = isLight ? "#0f172a" : "#E8EDF5";
  const subHeadingColor = isLight ? "#94a3b8" : "rgba(255,255,255,0.50)";
  const badgeBg         = isLight ? "rgba(81,148,246,0.08)" : "rgba(81,148,246,0.10)";
  const badgeBorder     = isLight ? "1px solid rgba(81,148,246,0.20)" : "1px solid rgba(81,148,246,0.25)";
  const dotInactive     = isLight ? "rgba(203,213,225,0.7)" : "rgba(255,255,255,0.18)";

  return (
    <section
      id="testimonials"
      style={{ background: "transparent", padding: isMobile ? "56px 0 48px" : "80px 0 72px", overflow: "hidden" }}
    >
      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: isMobile ? "36px" : "52px", padding: "0 20px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: badgeBg, border: badgeBorder, borderRadius: "100px", padding: "5px 14px", marginBottom: "14px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5194F6" }} />
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#5194F6", letterSpacing: "0.06em", textTransform: "uppercase" }}>User Reviews</span>
        </div>
        <h2 style={{ margin: "0 0 10px", fontSize: isMobile ? "26px" : "clamp(28px, 4.5vw, 42px)", fontWeight: 800, color: headingColor, letterSpacing: "-0.025em", lineHeight: 1.15 }}>
          What Our Users are Saying
        </h2>
        <p style={{ margin: "0 auto 20px", fontSize: isMobile ? "14px" : "clamp(14px,2vw,17px)", color: subHeadingColor, maxWidth: "460px", lineHeight: 1.6 }}>
          Trusted by thousands of investors and professionals across India
        </p>

        {/* Auth-aware CTA */}
        {!authLoading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>

            {showWriteBtn && (
              <button
                onClick={openCreate}
                style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "10px 22px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, background: "#5194F6", border: "none", color: "#fff", cursor: "pointer", boxShadow: "0 4px 16px rgba(81,148,246,0.25)" }}
              >
                <Plus size={16} /> Write a Review
              </button>
            )}
            {showEditBtn && (
              <button
                onClick={() => openEdit(toUnified(myTestimonial!))}
                style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "10px 22px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, background: "transparent", border: "1px solid #5194F6", color: "#5194F6", cursor: "pointer" }}
              >
                <Edit3 size={15} /> Edit My Review
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Carousel ── */}
      <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto", padding: isMobile ? "0 16px" : "0 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Loading spinner */}
        {loadingApi && (
          <div style={{ display: "flex", justifyContent: "center", padding: "48px" }}>
            <Loader2 size={28} style={{ color: "#5194F6", animation: "spin 1s linear infinite" }} />
          </div>
        )}

        {/* Empty state */}
        {!loadingApi && allTestimonials.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 20px", color: subHeadingColor }}>
            <Quote size={40} style={{ color: "#5194F6", opacity: 0.3, display: "block", margin: "0 auto 12px" }} />
            <p style={{ margin: 0, fontSize: "15px" }}>No reviews yet. Be the first to share your experience!</p>
          </div>
        )}

        {/* Cards + arrows */}
        {!loadingApi && allTestimonials.length > 0 && (
          <div
            style={{ display: "flex", alignItems: "center", gap: isMobile ? "0" : "20px" }}
            onMouseEnter={() => !isMobile && setCardsHovered(true)}
            onMouseLeave={() => !isMobile && setCardsHovered(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {!isMobile && (
              <button onClick={prev} style={{ width: "48px", height: "48px", minWidth: "48px", borderRadius: "50%", border: "none", background: "#5194F6", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(81,148,246,0.30)", flexShrink: 0, opacity: cardsHovered ? 1 : 0, pointerEvents: cardsHovered ? "auto" : "none", transition: "opacity 0.22s ease" }}>
                <ChevronLeft size={22} />
              </button>
            )}

            <div style={{ flex: 1, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "0" : "24px", minWidth: 0 }}>
              {visible.map(t => {
                const isMyCard  = !!t._id && t.userId === user?._id;
                const isApiCard = !!t._id;
                return (
                  <TestimonialCard
                    key={t.id} t={t}
                    isMobile={isMobile} isLight={isLight}
                    onClick={() => setModal(t)}
                    canEdit={isLoggedIn && isMyCard && !isAdmin}
                    canDelete={isAdmin && isApiCard}
                    onEdit={() => openEdit(t)}
                    onDelete={() => handleDelete(t._id!)}
                    deleting={deletingId === t._id}
                  />
                );
              })}
            </div>

            {!isMobile && (
              <button onClick={next} style={{ width: "48px", height: "48px", minWidth: "48px", borderRadius: "50%", border: "none", background: "#5194F6", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(81,148,246,0.30)", flexShrink: 0, opacity: cardsHovered ? 1 : 0, pointerEvents: cardsHovered ? "auto" : "none", transition: "opacity 0.22s ease" }}>
                <ChevronRight size={22} />
              </button>
            )}
          </div>
        )}

        {/* Dots */}
        {!loadingApi && totalDots > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", alignItems: "center" }}>
            {Array.from({ length: totalDots }).map((_, i) => (
              <button key={i} onClick={() => setIndex(i)} style={{ width: i === index ? "24px" : "8px", height: "8px", borderRadius: "100px", border: "none", background: i === index ? "#5194F6" : dotInactive, cursor: "pointer", padding: 0, transition: "all 0.3s ease" }} />
            ))}
          </div>
        )}


      </div>

      {modal && <Modal t={modal} onClose={() => setModal(null)} isLight={isLight} />}

      <TestimonialForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null); }}
        onSuccess={handleFormSuccess}
        existing={editTarget}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </section>
  );
}