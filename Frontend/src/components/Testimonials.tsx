"use client";

import { useState, useRef } from "react";
import {
  ArrowRight,
  MessageSquareQuote,
  Star,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  category: string;
  views: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Arjun Mehta",
    role: "Portfolio Manager",
    company: "Axis Capital",
    avatar: "AM",
    rating: 5,
    category: "Wealth Management",
    date: "March 14, 2024",
    views: 4231,
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
    category: "Retail Investor",
    date: "April 2, 2024",
    views: 3892,
    preview:
      "As someone managing my own portfolio, I was always overwhelmed by the sheer amount of conflicting information online. This platform cuts through the noise beautifully.",
    fullText:
      "As someone managing my own portfolio, I was always overwhelmed by the sheer amount of conflicting information online. This platform cuts through the noise beautifully.\n\nThe deep dives are written in a way that's both accessible and rigorous — I never feel talked down to, and I always walk away having learned something concrete. The global economics section especially helped me understand why my US ETF holdings were underperforming and what to do about it.\n\nSince subscribing, my portfolio returns have improved by nearly 18% year-on-year. I tell every investor friend about this.",
  },
  {
    id: 3,
    name: "Rohan Desai",
    role: "Founder & CEO",
    company: "FinRoute Ventures",
    avatar: "RD",
    rating: 5,
    category: "Startup Ecosystem",
    date: "April 10, 2024",
    views: 2765,
    preview:
      "We integrated these market insights into our fintech product's advisory engine. The structured data and forecast accuracy gave us a real competitive edge in our B2B pitch.",
    fullText:
      "We integrated these market insights into our fintech product's advisory engine. The structured data and forecast accuracy gave us a real competitive edge in our B2B pitch.\n\nOur enterprise clients were particularly impressed by the India-specific global macro analysis — it's rare to find research that bridges international developments with their precise domestic implications.\n\nThe team's turnaround on topical reports is also exceptional; when the RBI made its surprise rate decision in February, there was a comprehensive breakdown available within 24 hours. That kind of responsiveness is invaluable when you're building a real-time advisory product.",
  },
  {
    id: 4,
    name: "Sunita Kapoor",
    role: "CFO",
    company: "Meridian Industries",
    avatar: "SK",
    rating: 4,
    category: "Corporate Finance",
    date: "April 18, 2024",
    views: 2104,
    preview:
      "Our treasury team uses the global economics reports to inform FX hedging decisions. The correlation analysis between US Fed policy and INR movement has been particularly valuable.",
    fullText:
      "Our treasury team uses the global economics reports to inform FX hedging decisions. The correlation analysis between US Fed policy and INR movement has been particularly valuable for our import-heavy operations.\n\nBefore subscribing, we were largely reactive in our hedging strategy. Now we're able to take more informed forward positions. The monthly macro digest is something our finance team reviews every week.\n\nI'd love to see even more coverage of commodity price trajectories — that's the one area where we still feel we need additional external sources. Overall though, this has become an indispensable part of our financial planning toolkit.",
  },
];

// ─── StarRating ───────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 md:w-3.5 md:h-3.5 ${
            i < rating
              ? "text-accent fill-accent"
              : "text-muted-foreground/30 fill-muted-foreground/10"
          }`}
        />
      ))}
    </div>
  );
}

// ─── TestimonialCard ──────────────────────────────────────────────────────────

function TestimonialCard({
  testimonial,
  onClick,
}: {
  testimonial: Testimonial;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 md:p-7 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Category badge + stars */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-gradient-to-br from-accent/80 to-accent flex items-center justify-center">
              <MessageSquareQuote className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
            </div>
            <span className="text-xs font-medium text-accent">{testimonial.category}</span>
          </div>
          <StarRating rating={testimonial.rating} />
        </div>

        {/* Name + role */}
        <h3 className="text-base md:text-lg font-bold text-foreground mb-2 leading-snug group-hover:text-accent transition-colors duration-200">
          {testimonial.name}
          <span className="text-muted-foreground font-normal text-sm ml-1.5">
            · {testimonial.role}
          </span>
        </h3>

        {/* Preview */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-5">
          "{testimonial.preview}"
        </p>

        {/* Date + views + CTA */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
            <span className="whitespace-nowrap">{testimonial.date}</span>
            <span className="flex items-center gap-1 whitespace-nowrap flex-shrink-0">
              <Eye className="w-3 h-3" />
              {testimonial.views.toLocaleString()}
            </span>
          </div>
          <div className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent to-accent/85 text-white text-xs font-semibold shadow-sm group-hover:shadow-accent/30 transition-shadow whitespace-nowrap">
            <MessageSquareQuote className="w-3 h-3 flex-shrink-0" />
            <span className="md:hidden">Read</span>
            <span className="hidden md:inline">Read Testimonial</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function TestimonialModal({
  testimonial,
  onClose,
}: {
  testimonial: Testimonial;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/75 backdrop-blur-md" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg max-h-[88vh] flex flex-col bg-card border border-border/60 rounded-3xl shadow-2xl shadow-accent/10 overflow-hidden"
        style={{ animation: "modalIn 0.2s ease-out" }}
      >
        <div className="h-1 w-full bg-gradient-to-r from-accent/50 via-accent to-accent/50 flex-shrink-0" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-accent/8 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 p-6 md:p-8 overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-5 md:right-5 w-8 h-8 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors z-20"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Avatar + name */}
          <div className="flex items-center gap-3 md:gap-4 mb-5 pr-10">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-accent/80 to-accent flex items-center justify-center text-white font-bold text-base md:text-lg flex-shrink-0 shadow-lg shadow-accent/20">
              {testimonial.avatar}
            </div>
            <div>
              <p className="font-bold text-foreground text-base md:text-lg leading-tight">
                {testimonial.name}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {testimonial.role} · {testimonial.company}
              </p>
              <div className="mt-1.5">
                <StarRating rating={testimonial.rating} />
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 flex-wrap mb-5">
            <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
              <span className="text-[10px] md:text-xs font-medium text-accent">
                {testimonial.category}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{testimonial.date}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              {testimonial.views.toLocaleString()}
            </span>
          </div>

          <MessageSquareQuote className="w-7 h-7 text-accent/20 mb-3" />

          <div className="space-y-3 md:space-y-4">
            {testimonial.fullText.split("\n\n").map((para, i, arr) => (
              <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {i === 0 ? `"${para}` : para}
                {i === arr.length - 1 ? `"` : ""}
              </p>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TestimonialsPage() {
  const [selectedModal, setSelectedModal] = useState<Testimonial | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Ref to the extra cards row — scroll to it when Show More is clicked
  const extraCardsRef = useRef<HTMLDivElement>(null);
  // Ref to top of section — scroll back on Show Less
  const sectionRef = useRef<HTMLElement>(null);

  const handleShowMore = () => {
    setExpanded(true);
    setTimeout(() => {
      extraCardsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const handleShowLess = () => {
    setExpanded(false);
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">

        <section ref={sectionRef} className="mb-20 relative overflow-hidden">
          {/* Background gradients — identical to Deep Dives */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 rounded-3xl" />
          <div className="absolute top-0 left-0 w-60 h-60 md:w-80 md:h-80 bg-gradient-to-br from-accent/8 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tl from-accent/5 to-transparent rounded-full blur-2xl" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8 md:mb-16 px-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 mb-4 md:mb-6">
                <MessageSquareQuote className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                <span className="text-xs md:text-sm font-medium text-accent">
                  What Our Readers Say
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-3 md:mb-4">
                Testimonials
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
                Trusted by investors, analysts, and financial professionals across India
              </p>
            </div>

            {/* First 2 featured cards — always visible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 px-2 md:px-0">
              {TESTIMONIALS.slice(0, 2).map((t) => (
                <TestimonialCard
                  key={t.id}
                  testimonial={t}
                  onClick={() => setSelectedModal(t)}
                />
              ))}
            </div>

            {/* Extra cards — appear below when expanded */}
            {expanded && (
              <div
                ref={extraCardsRef}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 px-2 md:px-0 mt-4 md:mt-6"
                style={{ animation: "fadeSlideIn 0.3s ease-out" }}
              >
                {TESTIMONIALS.slice(2).map((t) => (
                  <TestimonialCard
                    key={t.id}
                    testimonial={t}
                    onClick={() => setSelectedModal(t)}
                  />
                ))}
              </div>
            )}

            {/* CTA button — toggles between Show More / Show Less */}
            <div className="mt-8 md:mt-12 text-center px-4">
              {!expanded ? (
                <button
                  onClick={handleShowMore}
                  className="inline-flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-full bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/30 transition-all duration-300 cursor-pointer group touch-manipulation active:scale-95"
                >
                  <span className="text-accent font-semibold text-sm md:text-base">
                    Show More
                  </span>
                  <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-accent group-hover:translate-y-0.5 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={handleShowLess}
                  className="inline-flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-full bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/30 transition-all duration-300 cursor-pointer group touch-manipulation active:scale-95"
                >
                  <span className="text-accent font-semibold text-sm md:text-base">
                    Show Less
                  </span>
                  <ChevronUp className="w-3 h-3 md:w-4 md:h-4 text-accent group-hover:-translate-y-0.5 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </section>

      </div>

      {/* Popup modal */}
      {selectedModal && (
        <TestimonialModal
          testimonial={selectedModal}
          onClose={() => setSelectedModal(null)}
        />
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}