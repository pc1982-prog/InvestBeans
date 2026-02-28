"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, X, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useTheme } from "@/controllers/Themecontext";

interface Testimonial {
  id: number; name: string; role: string; company: string; avatar: string;
  rating: number; preview: string; fullText: string;
  date: string; source: string; tag: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1, name: "Arjun Mehta", role: "Portfolio Manager", company: "Axis Capital",
    avatar: "AM", rating: 5, source: "Google Reviews", date: "March 14, 2024", tag: "Equity Research",
    preview: "The research quality here is unmatched. Their Sensex forecast for Q1 2024 was spot-on, and the actionable insights helped us reallocate our mid-cap exposure at exactly the right time.",
    fullText: "The research quality here is unmatched. Their Sensex forecast for Q1 2024 was spot-on, and the actionable insights helped us reallocate our mid-cap exposure at exactly the right time.\n\nWhat sets this platform apart is the depth of analysis — they don't just tell you what happened, they explain the macro drivers and the second-order effects. I've been in wealth management for 14 years and the signal-to-noise ratio here is genuinely impressive.\n\nThe US inflation impact report alone saved our fund from a costly misjudgement on IT sector allocations. I recommend this to every serious investor in my network.",
  },
  {
    id: 2, name: "Priya Nair", role: "Independent Investor", company: "Self-Managed",
    avatar: "PN", rating: 5, source: "Trustpilot", date: "April 2, 2024", tag: "Portfolio Growth",
    preview: "This platform cuts through the noise beautifully. The deep dives are both accessible and rigorous. My portfolio returns have improved by nearly 18% year-on-year since subscribing.",
    fullText: "As someone managing my own portfolio, I was always overwhelmed by the sheer amount of conflicting information online. This platform cuts through the noise beautifully.\n\nThe deep dives are written in a way that's both accessible and rigorous — I never feel talked down to, and I always walk away having learned something concrete.\n\nSince subscribing, my portfolio returns have improved by nearly 18% year-on-year. I tell every investor friend about this.",
  },
  {
    id: 3, name: "Rohan Desai", role: "Founder & CEO", company: "FinRoute Ventures",
    avatar: "RD", rating: 5, source: "Google Reviews", date: "April 10, 2024", tag: "Fintech",
    preview: "We integrated these market insights into our fintech advisory engine. The India-specific global macro analysis bridges international developments with precise domestic implications perfectly.",
    fullText: "We integrated these market insights into our fintech product's advisory engine. The structured data and forecast accuracy gave us a real competitive edge in our B2B pitch.\n\nOur enterprise clients were particularly impressed by the India-specific global macro analysis — it's rare to find research that bridges international developments with their precise domestic implications.\n\nWhen the RBI made its surprise rate decision in February, there was a comprehensive breakdown available within 24 hours. That kind of responsiveness is invaluable.",
  },
  {
    id: 4, name: "Sunita Kapoor", role: "CFO", company: "Meridian Industries",
    avatar: "SK", rating: 4, source: "Trustpilot", date: "April 18, 2024", tag: "FX Hedging",
    preview: "Our treasury team uses these reports for FX hedging decisions. Before subscribing we were reactive — now we take informed forward positions on INR-USD with real confidence.",
    fullText: "Our treasury team uses the global economics reports to inform FX hedging decisions. The correlation analysis between US Fed policy and INR movement has been particularly valuable for our import-heavy operations.\n\nBefore subscribing, we were largely reactive in our hedging strategy. Now we're able to take more informed forward positions.\n\nOverall this has become an indispensable part of our financial planning toolkit.",
  },
  {
    id: 5, name: "Vikram Singhania", role: "Senior Analyst", company: "HDFC Securities",
    avatar: "VS", rating: 5, source: "Google Reviews", date: "May 5, 2024", tag: "Institutional",
    preview: "The sectoral breakdowns and earnings forecast models are genuinely best-in-class. I've compared this against Bloomberg and Reuters — the India-centric lens here is unique and deeply valuable.",
    fullText: "The sectoral breakdowns and earnings forecast models are genuinely best-in-class. I've compared this against Bloomberg and Reuters analysis on multiple occasions — the India-centric lens this platform brings is unique and deeply valuable for domestic institutional work.\n\nThe platform has become my first stop every morning before markets open. The pre-market brief alone is worth the subscription price several times over.",
  },
  {
    id: 6, name: "Meera Joshi", role: "Financial Planner", company: "Wealth Tree Advisory",
    avatar: "MJ", rating: 5, source: "Trustpilot", date: "May 20, 2024", tag: "Financial Planning",
    preview: "The monthly macro digest is the single most valuable 20 minutes of reading in my professional calendar. It helps me have far more informed conversations with high-net-worth clients.",
    fullText: "I recommend this platform to every client who wants to understand their investments. The monthly macro digest is the single most valuable 20 minutes of reading in my professional calendar.\n\nIt has helped me have much more informed conversations with high-net-worth clients about their equity allocations. The visual charts and summaries are especially helpful when presenting complex macro ideas to non-technical investors.",
  },
];

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

// ─── Card ──────────────────────────────────────────────────────────────────
function TestimonialCard({
  t, onClick, isMobile, isLight,
}: { t: Testimonial; onClick: () => void; isMobile: boolean; isLight: boolean }) {
  const [hovered, setHovered] = useState(false);

  const cardBg = isLight ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.04)";
  const cardBorderNormal = isLight ? "rgba(13,37,64,0.1)" : "rgba(255,255,255,0.08)";
  const cardBorderHover = "#C4941E";
  const cardShadowNormal = isLight ? "0 2px 12px rgba(13,37,64,0.06)" : "0 2px 16px rgba(0,0,0,0.30)";
  const cardShadowHover = "0 16px 48px rgba(180,130,10,0.18)";

  const reviewTextColor = isLight ? "rgba(13,37,64,0.65)" : "rgba(226,232,240,1)";
  const nameColor = isLight ? "#0d1b2a" : "white";
  const roleColor = isLight ? "rgba(13,37,64,0.5)" : "rgba(148,163,184,1)";
  const avatarBg = isLight ? "rgba(212,168,67,0.15)" : "rgba(201,168,76,0.15)";
  const sourceColor = isLight ? "rgba(13,37,64,0.4)" : "rgba(100,116,139,1)";
  const sourceDotColor = isLight ? "rgba(13,37,64,0.2)" : "rgba(255,255,255,0.20)";
  const tagBg = isLight ? "rgba(212,168,67,0.1)" : "rgba(201,168,76,0.12)";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: cardBg,
        borderRadius: "20px",
        border: `1.5px solid ${hovered && !isMobile ? cardBorderHover : cardBorderNormal}`,
        boxShadow: hovered && !isMobile ? cardShadowHover : cardShadowNormal,
        padding: isMobile ? "24px 20px 22px" : "32px 30px 28px",
        cursor: "pointer",
        transition: "all 0.22s ease",
        transform: hovered && !isMobile ? "translateY(-4px)" : "translateY(0)",
        display: "flex",
        flexDirection: "column" as const,
        gap: "16px",
        width: "100%",
        boxSizing: "border-box" as const,
        position: "relative" as const,
        overflow: "hidden",
      }}
    >
      {/* Watermark */}
      <div style={{ position: "absolute", bottom: "-8px", right: "-4px", opacity: 0.06, pointerEvents: "none" }}>
        <Quote size={isMobile ? 80 : 120} style={{ color: "#C4941E" }} />
      </div>

      {/* Tag + Stars */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <span style={{
          fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em",
          textTransform: "uppercase" as const, color: "#C9A84C",
          background: tagBg, borderRadius: "20px", padding: "3px 11px", whiteSpace: "nowrap" as const,
        }}>
          {t.tag}
        </span>
        <Stars rating={t.rating} size={isMobile ? 14 : 16} isLight={isLight} />
      </div>

      {/* Quote icon */}
      <Quote size={isMobile ? 20 : 24} style={{ color: "#E8C45A", fill: "#E8C45A", marginBottom: "-4px" }} />

      {/* Review text */}
      <p style={{
        margin: 0, fontSize: isMobile ? "14px" : "15px",
        color: reviewTextColor, lineHeight: 1.75,
        display: "-webkit-box", WebkitLineClamp: 4,
        WebkitBoxOrient: "vertical" as any, overflow: "hidden",
        fontStyle: "italic",
      }}>
        {t.preview}
      </p>

      {/* Read more hint */}
      <p style={{ margin: 0, fontSize: "12px", color: "#C4941E", fontWeight: 600 }}>Read full review →</p>

      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "4px" }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "50%",
          background: avatarBg, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", fontWeight: 700, color: "#C9A84C", flexShrink: 0,
        }}>
          {t.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: nameColor }}>{t.name}</p>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: roleColor }}>
            {t.role} · {t.company}
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

// ─── Modal ─────────────────────────────────────────────────────────────────
function Modal({ t, onClose, isLight }: { t: Testimonial; onClose: () => void; isLight: boolean }) {
  const modalBg = isLight
    ? "linear-gradient(160deg,#f0f7fe 0%,#e8f2fd 100%)"
    : "linear-gradient(160deg,#0d1f38 0%,#0c1a2e 100%)";
  const modalBorder = isLight ? "1px solid rgba(13,37,64,0.12)" : "1px solid rgba(255,255,255,0.1)";
  const titleColor = isLight ? "#0d1b2a" : "white";
  const metaColor = isLight ? "rgba(13,37,64,0.5)" : "rgba(148,163,184,1)";
  const dividerColor = isLight ? "rgba(13,37,64,0.08)" : "rgba(255,255,255,0.08)";
  const bodyColor = isLight ? "rgba(13,37,64,0.65)" : "rgba(226,232,240,1)";
  const avatarBg = isLight ? "rgba(212,168,67,0.15)" : "rgba(201,168,76,0.18)";
  const closeBtnBg = isLight ? "rgba(13,37,64,0.07)" : "rgba(255,255,255,0.1)";
  const closeBtnColor = isLight ? "rgba(13,37,64,0.5)" : "rgba(203,213,225,1)";

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%", maxWidth: "640px", maxHeight: "90vh",
          borderRadius: "24px", overflow: "hidden", overflowY: "auto",
          background: modalBg, border: modalBorder,
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
          position: "relative",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Gold top accent */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg,transparent,rgba(212,168,67,0.6),transparent)",
        }} />

        <div style={{ padding: "32px 28px 28px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "50%", background: avatarBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", fontWeight: 800, color: "#C9A84C",
              }}>
                {t.avatar}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: titleColor }}>{t.name}</p>
                <p style={{ margin: "3px 0 0", fontSize: "13px", color: metaColor }}>{t.role} · {t.company}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: "36px", height: "36px", borderRadius: "50%", border: "none",
                background: closeBtnBg, color: closeBtnColor, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.7"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}
            >
              <X size={16} />
            </button>
          </div>

          {/* Stars + tag + source */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <Stars rating={t.rating} size={18} isLight={isLight} />
            <span style={{
              fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const,
              letterSpacing: "0.05em", color: "#C9A84C",
              background: "rgba(212,168,67,0.1)", borderRadius: "20px", padding: "3px 10px",
            }}>
              {t.tag}
            </span>
            <span style={{ fontSize: "12px", color: metaColor }}>{t.date} · {t.source}</span>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: dividerColor, marginBottom: "20px" }} />

          {/* Full review text */}
          {t.fullText.split("\n\n").map((para, i) => (
            <p key={i} style={{
              margin: "0 0 16px", fontSize: "15px", lineHeight: 1.8,
              color: bodyColor, fontStyle: "italic",
            }}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function TestimonialsPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [index, setIndex] = useState(0);
  const [modal, setModal] = useState<Testimonial | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cardsHovered, setCardsHovered] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const perPage = isMobile ? 1 : 2;
  const totalDots = Math.ceil(TESTIMONIALS.length / perPage);
  const visible = TESTIMONIALS.slice(index * perPage, index * perPage + perPage);

  const prev = useCallback(() => setIndex(i => (i - 1 + totalDots) % totalDots), [totalDots]);
  const next = useCallback(() => setIndex(i => (i + 1) % totalDots), [totalDots]);

  // Auto-advance
  useEffect(() => {
    if (cardsHovered) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, cardsHovered]);

  // Theme tokens for section wrapper
  const sectionBg = isLight ? "transparent" : "transparent";
  const headingColor = isLight ? "#0d1b2a" : "#E8EDF5";
  const subHeadingColor = isLight ? "rgba(13,37,64,0.55)" : "rgba(255,255,255,0.50)";
  const badgeBg = isLight ? "rgba(212,168,67,0.1)" : "rgba(201,168,76,0.10)";
  const badgeBorder = isLight ? "1px solid rgba(212,168,67,0.28)" : "1px solid rgba(201,168,76,0.25)";
  const dotInactive = isLight ? "rgba(13,37,64,0.15)" : "rgba(255,255,255,0.18)";

  return (
    <section
      id="testimonials"
      style={{
        background: sectionBg,
        padding: isMobile ? "56px 0 48px" : "80px 0 72px",
        overflow: "hidden",
      }}
    >
      {/* Section header */}
      <div style={{
        textAlign: "center", marginBottom: isMobile ? "36px" : "52px", padding: "0 20px",
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "7px",
          background: badgeBg, border: badgeBorder,
          borderRadius: "100px", padding: "5px 14px", marginBottom: "14px",
        }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C9A84C" }} />
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#C9A84C", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            User Reviews
          </span>
        </div>

        {/* Heading */}
        <h2 style={{
          margin: "0 0 10px",
          fontSize: isMobile ? "26px" : "clamp(28px, 4.5vw, 42px)",
          fontWeight: 800, color: headingColor,
          letterSpacing: "-0.025em", lineHeight: 1.15,
        }}>
          What Our Users are Saying
        </h2>
        <p style={{
          margin: "0 auto",
          fontSize: isMobile ? "14px" : "clamp(14px,2vw,17px)",
          color: subHeadingColor, maxWidth: "460px", lineHeight: 1.6,
        }}>
          Trusted by thousands of investors and professionals across India
        </p>
      </div>

      {/* Carousel */}
      <div style={{
        width: "100%", maxWidth: "1400px", margin: "0 auto",
        padding: isMobile ? "0 16px" : "0 20px",
        boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "24px",
      }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: isMobile ? "0" : "20px" }}
          onMouseEnter={() => !isMobile && setCardsHovered(true)}
          onMouseLeave={() => !isMobile && setCardsHovered(false)}
        >
          {/* LEFT ARROW */}
          {!isMobile && (
            <button
              onClick={prev}
              style={{
                width: "48px", height: "48px", minWidth: "48px", borderRadius: "50%",
                border: "none", background: "#C4941E", color: "#fff",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(196,148,30,0.30)", flexShrink: 0,
                opacity: cardsHovered ? 1 : 0, pointerEvents: cardsHovered ? "auto" : "none",
                transition: "opacity 0.22s ease, transform 0.18s ease, background 0.18s ease",
              }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#B8860B"; b.style.transform = "scale(1.1)"; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#C4941E"; b.style.transform = "scale(1)"; }}
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* CARDS */}
          <div style={{
            flex: 1, display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "0" : "24px", minWidth: 0, width: "100%",
          }}>
            {visible.map((t) => (
              <TestimonialCard
                key={t.id} t={t} isMobile={isMobile} isLight={isLight}
                onClick={() => setModal(t)}
              />
            ))}
          </div>

          {/* RIGHT ARROW */}
          {!isMobile && (
            <button
              onClick={next}
              style={{
                width: "48px", height: "48px", minWidth: "48px", borderRadius: "50%",
                border: "none", background: "#C4941E", color: "#fff",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(196,148,30,0.30)", flexShrink: 0,
                opacity: cardsHovered ? 1 : 0, pointerEvents: cardsHovered ? "auto" : "none",
                transition: "opacity 0.22s ease, transform 0.18s ease, background 0.18s ease",
              }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#B8860B"; b.style.transform = "scale(1.1)"; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#C4941E"; b.style.transform = "scale(1)"; }}
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
          {Array.from({ length: totalDots }).map((_, i) => (
            <button
              key={i} onClick={() => setIndex(i)}
              style={{
                width: i === index ? "24px" : "8px", height: "8px",
                borderRadius: "100px", border: "none",
                background: i === index ? "#C4941E" : dotInactive,
                cursor: "pointer", padding: 0, transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      {modal && <Modal t={modal} onClose={() => setModal(null)} isLight={isLight} />}
    </section>
  );
}