"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, X, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  id: number;
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
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Arjun Mehta",
    role: "Portfolio Manager",
    company: "Axis Capital",
    avatar: "AM",
    rating: 5,
    source: "Google Reviews",
    date: "March 14, 2024",
    tag: "Equity Research",
    preview:
      "The research quality here is unmatched. Their Sensex forecast for Q1 2024 was spot-on, and the actionable insights helped us reallocate our mid-cap exposure at exactly the right time.",
    fullText:
      "The research quality here is unmatched. Their Sensex forecast for Q1 2024 was spot-on, and the actionable insights helped us reallocate our mid-cap exposure at exactly the right time.\n\nWhat sets this platform apart is the depth of analysis — they don't just tell you what happened, they explain the macro drivers and the second-order effects. I've been in wealth management for 14 years and the signal-to-noise ratio here is genuinely impressive.\n\nThe US inflation impact report alone saved our fund from a costly misjudgement on IT sector allocations. I recommend this to every serious investor in my network.",
  },
  {
    id: 2,
    name: "Priya Nair",
    role: "Independent Investor",
    company: "Self-Managed",
    avatar: "PN",
    rating: 5,
    source: "Trustpilot",
    date: "April 2, 2024",
    tag: "Portfolio Growth",
    preview:
      "This platform cuts through the noise beautifully. The deep dives are both accessible and rigorous. My portfolio returns have improved by nearly 18% year-on-year since subscribing.",
    fullText:
      "As someone managing my own portfolio, I was always overwhelmed by the sheer amount of conflicting information online. This platform cuts through the noise beautifully.\n\nThe deep dives are written in a way that's both accessible and rigorous — I never feel talked down to, and I always walk away having learned something concrete.\n\nSince subscribing, my portfolio returns have improved by nearly 18% year-on-year. I tell every investor friend about this.",
  },
  {
    id: 3,
    name: "Rohan Desai",
    role: "Founder & CEO",
    company: "FinRoute Ventures",
    avatar: "RD",
    rating: 5,
    source: "Google Reviews",
    date: "April 10, 2024",
    tag: "Fintech",
    preview:
      "We integrated these market insights into our fintech advisory engine. The India-specific global macro analysis bridges international developments with precise domestic implications perfectly.",
    fullText:
      "We integrated these market insights into our fintech product's advisory engine. The structured data and forecast accuracy gave us a real competitive edge in our B2B pitch.\n\nOur enterprise clients were particularly impressed by the India-specific global macro analysis — it's rare to find research that bridges international developments with their precise domestic implications.\n\nWhen the RBI made its surprise rate decision in February, there was a comprehensive breakdown available within 24 hours. That kind of responsiveness is invaluable.",
  },
  {
    id: 4,
    name: "Sunita Kapoor",
    role: "CFO",
    company: "Meridian Industries",
    avatar: "SK",
    rating: 4,
    source: "Trustpilot",
    date: "April 18, 2024",
    tag: "FX Hedging",
    preview:
      "Our treasury team uses these reports for FX hedging decisions. Before subscribing we were reactive — now we take informed forward positions on INR-USD with real confidence.",
    fullText:
      "Our treasury team uses the global economics reports to inform FX hedging decisions. The correlation analysis between US Fed policy and INR movement has been particularly valuable for our import-heavy operations.\n\nBefore subscribing, we were largely reactive in our hedging strategy. Now we're able to take more informed forward positions.\n\nOverall this has become an indispensable part of our financial planning toolkit.",
  },
  {
    id: 5,
    name: "Vikram Singhania",
    role: "Senior Analyst",
    company: "HDFC Securities",
    avatar: "VS",
    rating: 5,
    source: "Google Reviews",
    date: "May 5, 2024",
    tag: "Institutional",
    preview:
      "The sectoral breakdowns and earnings forecast models are genuinely best-in-class. I've compared this against Bloomberg and Reuters — the India-centric lens here is unique and deeply valuable.",
    fullText:
      "The sectoral breakdowns and earnings forecast models are genuinely best-in-class. I've compared this against Bloomberg and Reuters analysis on multiple occasions — the India-centric lens this platform brings is unique and deeply valuable for domestic institutional work.\n\nThe platform has become my first stop every morning before markets open. The pre-market brief alone is worth the subscription price several times over.",
  },
  {
    id: 6,
    name: "Meera Joshi",
    role: "Financial Planner",
    company: "Wealth Tree Advisory",
    avatar: "MJ",
    rating: 5,
    source: "Trustpilot",
    date: "May 20, 2024",
    tag: "Financial Planning",
    preview:
      "The monthly macro digest is the single most valuable 20 minutes of reading in my professional calendar. It helps me have far more informed conversations with high-net-worth clients.",
    fullText:
      "I recommend this platform to every client who wants to understand their investments. The monthly macro digest is the single most valuable 20 minutes of reading in my professional calendar.\n\nIt has helped me have much more informed conversations with high-net-worth clients about their equity allocations. The visual charts and summaries are especially helpful when presenting complex macro ideas to non-technical investors.",
  },
];

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          style={{
            fill: i < rating ? "#F59E0B" : "rgba(255,255,255,0.15)",
            color: i < rating ? "#F59E0B" : "rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function TestimonialCard({
  t,
  onClick,
  isMobile,
}: {
  t: Testimonial;
  onClick: () => void;
  isMobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        /* card background matching HomeView card style */
        background: "rgba(255,255,255,0.04)",
        borderRadius: "20px",
        border: `1.5px solid ${hovered && !isMobile ? "#C4941E" : "rgba(255,255,255,0.08)"}`,
        boxShadow:
          hovered && !isMobile
            ? "0 16px 48px rgba(180,130,10,0.18)"
            : "0 2px 16px rgba(0,0,0,0.30)",
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
      <div
        style={{
          position: "absolute",
          bottom: "-8px",
          right: "-4px",
          opacity: 0.06,
          pointerEvents: "none",
        }}
      >
        <Quote size={isMobile ? 80 : 120} style={{ color: "#C4941E" }} />
      </div>

      {/* Tag + Stars */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase" as const,
            color: "#C9A84C",
            /* ── CHANGED: #FDF8EC → translucent gold tint ── */
            background: "rgba(201,168,76,0.12)",
            borderRadius: "20px",
            padding: "3px 11px",
            whiteSpace: "nowrap" as const,
          }}
        >
          {t.tag}
        </span>
        <Stars rating={t.rating} size={isMobile ? 14 : 16} />
      </div>

      {/* Quote icon */}
      <Quote
        size={isMobile ? 20 : 24}
        style={{ color: "#E8C45A", fill: "#E8C45A", marginBottom: "-4px" }}
      />

      {/* Review text */}
      <p
        style={{
          margin: 0,
          fontSize: isMobile ? "14px" : "15px",
          lineHeight: "1.78",
          /* ── CHANGED: #374151 → soft white ── */
          color: "rgba(255,255,255,0.70)",
          flexGrow: 1,
          display: "-webkit-box",
          WebkitLineClamp: isMobile ? 5 : 4,
          WebkitBoxOrient: "vertical" as const,
          overflow: "hidden",
        }}
      >
        {t.preview}
      </p>

      {/* Divider */}
      {/* ── CHANGED: #F1F5F9 → subtle white line ── */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: isMobile ? "40px" : "46px",
            height: isMobile ? "40px" : "46px",
            borderRadius: "50%",
            /* ── CHANGED: #F5F3FF / #DDD6FE → navy tint + gold border ── */
            background: "rgba(255,255,255,0.05)",
            border: "2px solid rgba(201,168,76,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isMobile ? "12px" : "13px",
            fontWeight: 700,
            color: "#C9A84C",
            flexShrink: 0,
          }}
        >
          {t.avatar}
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: isMobile ? "13px" : "14px",
              fontWeight: 700,
              /* ── CHANGED: #111827 → off-white ── */
              color: "#E8EDF5",
              whiteSpace: "nowrap" as const,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {t.name}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              /* ── CHANGED: #94A3B8 → muted white ── */
              color: "rgba(255,255,255,0.45)",
              marginTop: "2px",
              whiteSpace: "nowrap" as const,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {t.source}&nbsp;·&nbsp;{t.date}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ t, onClose }: { t: Testimonial; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(5,10,22,0.75)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          /* ── CHANGED: #fff → deep navy modal ── */
          background: "#0F1E35",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "540px",
          maxHeight: "88vh",
          overflowY: "auto",
          /* ── CHANGED: subtle navy glow shadow ── */
          boxShadow: "0 32px 80px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.07)",
          animation: "popIn 0.22s cubic-bezier(0.34,1.56,0.64,1)",
          position: "relative",
        }}
      >
        <div
          style={{
            height: "4px",
            background: "linear-gradient(90deg,#D4A843,#B8860B)",
            borderRadius: "24px 24px 0 0",
          }}
        />
        <div style={{ padding: "28px 24px 32px" }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "18px",
              right: "18px",
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              /* ── CHANGED: light border/bg → navy ── */
              border: "1.5px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              /* ── CHANGED: #6B7280 → soft white ── */
              color: "rgba(255,255,255,0.60)",
              padding: 0,
            }}
          >
            <X size={15} />
          </button>

          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "center",
              marginBottom: "10px",
              paddingRight: "44px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                /* ── CHANGED: #FDF8EC / #C7D2FE → navy tint + gold ring ── */
                background: "rgba(255,255,255,0.05)",
                border: "2px solid rgba(201,168,76,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontWeight: 700,
                color: "#C9A84C",
                flexShrink: 0,
              }}
            >
              {t.avatar}
            </div>
            <div>
              {/* ── CHANGED: #111827 → off-white ── */}
              <p style={{ margin: 0, fontWeight: 800, fontSize: "17px", color: "#E8EDF5" }}>
                {t.name}
              </p>
              {/* ── CHANGED: #64748B → muted white ── */}
              <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.50)", marginTop: "2px" }}>
                {t.role}&nbsp;·&nbsp;{t.company}
              </p>
              <div style={{ marginTop: "6px" }}>
                <Stars rating={t.rating} size={14} />
              </div>
            </div>
          </div>

          {/* ── CHANGED: #94A3B8 → muted white ── */}
          <p style={{ margin: "10px 0 18px", fontSize: "12px", color: "rgba(255,255,255,0.40)" }}>
            {t.source}&nbsp;·&nbsp;{t.date}
          </p>
          {/* ── CHANGED: #F1F5F9 → subtle white line ── */}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", marginBottom: "20px" }} />
          <Quote
            size={28}
            style={{ color: "#E8C45A", fill: "#E8C45A", marginBottom: "12px" }}
          />

          {t.fullText.split("\n\n").map((para, i) => (
            <p
              key={i}
              style={{
                margin: "0 0 14px",
                fontSize: "15px",
                lineHeight: "1.8",
                /* ── CHANGED: #374151 → soft white ── */
                color: "rgba(255,255,255,0.72)",
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity:0; transform:scale(0.90) translateY(16px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const [modal, setModal] = useState<Testimonial | null>(null);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cardsHovered, setCardsHovered] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 700);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const cardsPerView = isMobile ? 1 : 2;
  const maxIndex = Math.max(0, TESTIMONIALS.length - cardsPerView);

  const next = useCallback(
    () => setIndex((i) => (i >= maxIndex ? 0 : i + 1)),
    [maxIndex]
  );
  const prev = useCallback(
    () => setIndex((i) => (i <= 0 ? maxIndex : i - 1)),
    [maxIndex]
  );

  useEffect(() => {
    if (modal) return;
    if (!isMobile && paused) return;
    const id = setInterval(next, 3000);
    return () => clearInterval(id);
  }, [next, paused, modal, isMobile]);

  useEffect(() => {
    setIndex(0);
  }, [isMobile]);

  const visible = TESTIMONIALS.slice(index, index + cardsPerView);
  const totalDots = maxIndex + 1;

  return (
    <section
      style={{
        background: "linear-gradient(160deg,#0c1a2e 0%,#0e2038 45%,#0b1825 100%)",
        padding: isMobile ? "52px 0 48px" : "80px 0 72px",
        fontFamily: "'Inter','Segoe UI',sans-serif",
        width: "100%",
        boxSizing: "border-box",
        position: "relative",
      }}
      onMouseEnter={() => !isMobile && setPaused(true)}
      onMouseLeave={() => !isMobile && setPaused(false)}
    >
      {/* Ambient glows matching DecodeMarket */}
      <div style={{ position: "absolute", top: 0, right: 0, width: "450px", height: "450px", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none", background: "radial-gradient(circle,rgba(212,168,67,0.06) 0%,transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "350px", height: "350px", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none", background: "radial-gradient(circle,rgba(56,189,248,0.04) 0%,transparent 70%)" }} />

      {/* Heading */}
      <div
        style={{
          textAlign: "center",
          marginBottom: isMobile ? "36px" : "52px",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            /* ── CHANGED: #FDF8EC badge → translucent navy with gold border ── */
            background: "rgba(201,168,76,0.10)",
            border: "1px solid rgba(201,168,76,0.25)",
            borderRadius: "100px",
            padding: "5px 14px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#C9A84C",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#C9A84C",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            User Reviews
          </span>
        </div>

        <h2
          style={{
            margin: "0 0 10px",
            fontSize: isMobile ? "26px" : "clamp(28px, 4.5vw, 42px)",
            fontWeight: 800,
            /* ── CHANGED: #0F172A dark text → off-white ── */
            color: "#E8EDF5",
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
          }}
        >
          What Our Users are Saying
        </h2>
        <p
          style={{
            margin: "0 auto",
            fontSize: isMobile ? "14px" : "clamp(14px,2vw,17px)",
            /* ── CHANGED: #64748B → muted white ── */
            color: "rgba(255,255,255,0.50)",
            maxWidth: "460px",
            lineHeight: 1.6,
          }}
        >
          Trusted by thousands of investors and professionals across India
        </p>
      </div>

      {/* Carousel */}
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isMobile ? "0 16px" : "0 20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "0" : "20px",
          }}
          onMouseEnter={() => !isMobile && setCardsHovered(true)}
          onMouseLeave={() => !isMobile && setCardsHovered(false)}
        >
          {/* LEFT ARROW */}
          {!isMobile && (
            <button
              onClick={prev}
              style={{
                width: "48px",
                height: "48px",
                minWidth: "48px",
                borderRadius: "50%",
                border: "none",
                background: "#C4941E",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(196,148,30,0.30)",
                flexShrink: 0,
                opacity: cardsHovered ? 1 : 0,
                pointerEvents: cardsHovered ? "auto" : "none",
                transition: "opacity 0.22s ease, transform 0.18s ease, background 0.18s ease",
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "#B8860B";
                b.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "#C4941E";
                b.style.transform = "scale(1)";
              }}
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* CARDS */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? "0" : "24px",
              minWidth: 0,
              width: "100%",
            }}
          >
            {visible.map((t) => (
              <TestimonialCard
                key={t.id}
                t={t}
                isMobile={isMobile}
                onClick={() => setModal(t)}
              />
            ))}
          </div>

          {/* RIGHT ARROW */}
          {!isMobile && (
            <button
              onClick={next}
              style={{
                width: "48px",
                height: "48px",
                minWidth: "48px",
                borderRadius: "50%",
                border: "none",
                background: "#C4941E",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(196,148,30,0.30)",
                flexShrink: 0,
                opacity: cardsHovered ? 1 : 0,
                pointerEvents: cardsHovered ? "auto" : "none",
                transition: "opacity 0.22s ease, transform 0.18s ease, background 0.18s ease",
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "#B8860B";
                b.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "#C4941E";
                b.style.transform = "scale(1)";
              }}
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>

        {/* Slim dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
          {Array.from({ length: totalDots }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              style={{
                width: i === index ? "24px" : "8px",
                height: "8px",
                borderRadius: "100px",
                border: "none",
                /* ── CHANGED: inactive dot #D5DCEA → soft white ── */
                background: i === index ? "#C4941E" : "rgba(255,255,255,0.18)",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      {modal && <Modal t={modal} onClose={() => setModal(null)} />}
    </section>
  );
}