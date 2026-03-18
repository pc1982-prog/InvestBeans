"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/controllers/Themecontext";
import { useAuth } from "@/controllers/AuthContext";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import {
  Check, X, Sparkles, BookOpen, BarChart3, Lightbulb,
  GraduationCap, Globe, TrendingUp, Zap, Shield, Star,
  ChevronDown, ChevronUp,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "foundation",
    color: "#22c55e",
    colorDim: "rgba(34,197,94,0.12)",
    colorBorder: "rgba(34,197,94,0.3)",
    emoji: "🟢",
    badge: "For Beginners",
    name: "Foundation",
    tagline: "Build Your Market Foundation",
    quote: "Learn markets with structured knowledge before risking capital",
    price: "₹111",
    unit: "per course / PDF",
    cta: "Start Learning",
    icon: BookOpen,
    popular: false,
    benefits: [
      "Understand how financial markets actually work",
      "Learn investing and trading from first principles",
      "Structured financial learning through curated e-books",
      "Certification programs for practical understanding",
      "Build confidence before entering active trading",
      "Develop disciplined financial thinking",
    ],
    valueNote: "Ideal for beginners starting their financial journey.",
  },
  {
    id: "command",
    color: "#3b82f6",
    colorDim: "rgba(59,130,246,0.12)",
    colorBorder: "rgba(59,130,246,0.3)",
    emoji: "🔵",
    badge: "Most Popular",
    name: "Command",
    tagline: "Take Command of Market Data",
    quote: "Monitor markets through exclusive dashboards built for decision clarity",
    price: "₹888",
    unit: "per month",
    cta: "Access Dashboards",
    icon: BarChart3,
    popular: true,
    benefits: [
      "Track Indian and global markets in one unified workspace",
      "Exclusive equity, commodity, and currency dashboards",
      "Visual market intelligence for faster understanding",
      "Bharat, Global & ETF strategic dashboards",
      "Reduce information noise with structured data views",
      "Designed for active market participants",
    ],
    valueNote: "Best for traders who want clarity without complexity.",
  },
  {
    id: "edge",
    color: "#a855f7",
    colorDim: "rgba(168,85,247,0.12)",
    colorBorder: "rgba(168,85,247,0.3)",
    emoji: "🟣",
    badge: "For Serious Investors",
    name: "Edge",
    tagline: "Where Insight Becomes Advantage",
    quote: "Research-backed intelligence to understand market movements deeper",
    price: "₹99",
    unit: "per month",
    cta: "Get The Edge",
    icon: Lightbulb,
    popular: false,
    benefits: [
      "Research-driven analysis across domestic and global markets",
      "InvestBeans event-based market insights",
      "IPO research and opportunity interpretation",
      "Understand the 'why' behind market movements",
      "Early access to research publications",
      "Built for serious investors and decision makers",
    ],
    valueNote: "For traders seeking an informed market edge.",
  },
];

// Feature comparison table data
const COMPARISON_SECTIONS = [
  {
    icon: GraduationCap,
    title: "Learning & Courses",
    color: "#22c55e",
    rows: [
      { label: "Financial E-Books",         foundation: true,  command: false, edge: false },
      { label: "Non-Financial E-Books",      foundation: true,  command: false, edge: false },
      { label: "Certification Programs",     foundation: true,  command: false, edge: false },
      { label: "Structured Learning Access", foundation: true,  command: false, edge: false },
    ],
  },
  {
    icon: BarChart3,
    title: "Market Dashboards",
    color: "#3b82f6",
    rows: [
      { label: "Equity Dashboard — Domestic", foundation: false, command: true, edge: false },
      { label: "Equity Dashboard — Global",   foundation: false, command: true, edge: false },
      { label: "Commodities Dashboard",        foundation: false, command: true, edge: false },
      { label: "Currency Dashboard",           foundation: false, command: true, edge: false },
      { label: "Bharat (India) Dashboard",     foundation: false, command: true, edge: false },
      { label: "Global Markets Dashboard",     foundation: false, command: true, edge: false },
      { label: "ETF Dashboard",                foundation: false, command: true, edge: false },
    ],
  },
  {
    icon: TrendingUp,
    title: "Research & Insights",
    color: "#a855f7",
    rows: [
      { label: "Domestic Market Research",   foundation: false, command: true, edge: true },
      { label: "Global Market Research",      foundation: false, command: true, edge: true },
      { label: "Event-Based Research Reports",foundation: false, command: true, edge: true },
      { label: "IPO Research & Insights",     foundation: false, command: true, edge: true },
      { label: "Research Publications Access",foundation: false, command: true, edge: true },
      { label: "Early Research Updates",      foundation: false, command: true, edge: true },
    ],
  },
  {
    icon: Shield,
    title: "Member Experience",
    color: "#f59e0b",
    rows: [
      { label: "Dedicated Member Access",    foundation: true,  command: true,  edge: true  },
      { label: "Priority Updates", foundation: false, command: true, edge: true, commandLabel: "Standard", edgeLabel: "Priority" },
      { label: "Platform Enhancements Access",foundation: true, command: true,  edge: true  },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  PLAN CARD
// ─────────────────────────────────────────────────────────────────────────────
function PlanCard({
  plan, isLight, onCta,
}: { plan: typeof PLANS[0]; isLight: boolean; onCta: () => void }) {
  const Icon = plan.icon;

  const cardBg = isLight
    ? plan.popular ? "linear-gradient(145deg,#ffffff,#f0f7ff)" : "rgba(255,255,255,0.98)"
    : plan.popular ? "linear-gradient(145deg,#0f1f3d,#0d1a35)" : "rgba(13,30,54,0.7)";
  const cardBorder = plan.popular
    ? `2px solid ${plan.color}`
    : isLight ? "1.5px solid rgba(226,232,240,0.9)" : "1.5px solid rgba(255,255,255,0.08)";
  const cardShadow = plan.popular
    ? `0 20px 60px ${plan.colorDim}, 0 4px 20px rgba(0,0,0,0.1)`
    : isLight ? "0 4px 24px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.03)" : "0 4px 24px rgba(0,0,0,0.3)";
  const nameColor = isLight ? "#0f172a" : "#e8edf5";
  const taglineColor = isLight ? "#374151" : "rgba(203,213,225,1)";
  const quoteColor = isLight ? "#6b7280" : "rgba(148,163,184,1)";
  const benefitColor = isLight ? "#374151" : "rgba(203,213,225,1)";
  const noteColor = isLight ? "#9ca3af" : "rgba(148,163,184,0.7)";
  const dividerColor = isLight ? "rgba(226,232,240,0.8)" : "rgba(255,255,255,0.07)";

  return (
    <div
      style={{
        background: cardBg, border: cardBorder, boxShadow: cardShadow,
        borderRadius: "24px", padding: "32px 28px", position: "relative",
        display: "flex", flexDirection: "column", gap: "0",
        marginTop: plan.popular ? "-10px" : "10px",
        marginBottom: plan.popular ? "10px" : "0px",
        transition: "box-shadow 0.2s ease",
      }}
      onMouseEnter={e => {
        if (!plan.popular) (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
      }}
      onMouseLeave={e => {
        if (!plan.popular) (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div style={{
          position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
          background: `linear-gradient(135deg,${plan.color},#60a5fa)`,
          color: "#fff", fontSize: "11px", fontWeight: 800,
          padding: "5px 18px", borderRadius: "100px",
          letterSpacing: "0.08em", textTransform: "uppercase",
          boxShadow: `0 4px 16px ${plan.colorDim}`,
          whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: "5px",
        }}>
          <Star size={10} fill="white" /> Most Popular
        </div>
      )}

      {/* Icon + Badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "14px",
          background: plan.colorDim, border: `1.5px solid ${plan.colorBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={22} style={{ color: plan.color }} />
        </div>
        <span style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.07em",
          textTransform: "uppercase", color: plan.color,
          background: plan.colorDim, border: `1px solid ${plan.colorBorder}`,
          borderRadius: "100px", padding: "4px 12px",
        }}>
          {plan.badge}
        </span>
      </div>

      {/* Name + tagline */}
      <h3 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 800, color: nameColor, letterSpacing: "-0.02em" }}>
        {plan.name}
      </h3>
      <p style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: 600, color: taglineColor }}>
        {plan.tagline}
      </p>
      <p style={{ margin: "0 0 22px", fontSize: "12px", fontStyle: "italic", color: quoteColor, lineHeight: 1.6 }}>
        "{plan.quote}"
      </p>

      {/* Divider */}
      <div style={{ height: "1px", background: dividerColor, marginBottom: "22px" }} />

      {/* Price */}
      <div style={{ marginBottom: "22px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span style={{ fontSize: "36px", fontWeight: 900, color: plan.color, letterSpacing: "-0.03em", lineHeight: 1 }}>
            {plan.price}
          </span>
        </div>
        <span style={{ fontSize: "12px", color: quoteColor, fontWeight: 500 }}>
          {plan.unit}
        </span>
      </div>

      {/* Benefits */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px", flex: 1 }}>
        {plan.benefits.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <div style={{
              width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, marginTop: "1px",
              background: plan.colorDim, border: `1px solid ${plan.colorBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Check size={10} strokeWidth={3} style={{ color: plan.color }} />
            </div>
            <span style={{ fontSize: "13px", color: benefitColor, lineHeight: 1.5 }}>{b}</span>
          </div>
        ))}
      </div>

      {/* Value note */}
      <p style={{ margin: "0 0 20px", fontSize: "11px", color: noteColor, fontStyle: "italic", textAlign: "center" }}>
        {plan.valueNote}
      </p>

      {/* CTA */}
      <button
        onClick={onCta}
        style={{
          width: "100%", padding: "14px", borderRadius: "14px", fontSize: "14px",
          fontWeight: 700, border: "none", cursor: "pointer",
          background: plan.popular
            ? `linear-gradient(135deg,${plan.color},#60a5fa)`
            : plan.colorDim,
          color: plan.popular ? "#fff" : plan.color,
          border: plan.popular ? "none" : `1.5px solid ${plan.colorBorder}`,
          boxShadow: plan.popular ? `0 6px 20px ${plan.colorDim}` : "none",
          transition: "all 0.2s ease",
          letterSpacing: "0.02em",
        } as React.CSSProperties}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 10px 28px ${plan.colorDim}`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = plan.popular ? `0 6px 20px ${plan.colorDim}` : "none";
        }}
      >
        {plan.cta}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  CHECK / X CELL
// ─────────────────────────────────────────────────────────────────────────────
function Cell({ value, color = "#22c55e", label }: { value: boolean; color?: string; label?: string }) {
  // Text label variant (e.g. "Standard" / "Priority")
  if (value && label) {
    return (
      <div style={{
        margin: "0 auto", textAlign: "center",
        background: `${color}15`, border: `1px solid ${color}35`,
        borderRadius: "20px", padding: "3px 10px", display: "inline-block",
      }}>
        <span style={{ fontSize: "10px", fontWeight: 700, color, letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
          {label}
        </span>
      </div>
    );
  }
  if (value) {
    return (
      <div style={{
        width: "28px", height: "28px", borderRadius: "50%", margin: "0 auto",
        background: `${color}18`, border: `1.5px solid ${color}40`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Check size={13} strokeWidth={3} style={{ color }} />
      </div>
    );
  }
  return (
    <div style={{ width: "28px", height: "28px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "14px", height: "2px", background: "rgba(148,163,184,0.3)", borderRadius: "2px" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
//  MOBILE PLAN TAB (shows one plan's features at a time on mobile)
// ─────────────────────────────────────────────────────────────────────────────
const PLAN_KEYS = [
  { key: "foundation", name: "Foundation", color: "#22c55e", icon: BookOpen },
  { key: "command",    name: "Command",    color: "#3b82f6", icon: BarChart3 },
  { key: "edge",       name: "Edge",       color: "#a855f7", icon: Lightbulb },
] as const;
type PlanKey = "foundation" | "command" | "edge";

// ─────────────────────────────────────────────────────────────────────────────
//  MOBILE COLLAPSIBLE SECTIONS
// ─────────────────────────────────────────────────────────────────────────────
function MobileSections({
  activePlan, activePlanData, isLight, labelColor, divColor,
}: {
  activePlan: PlanKey;
  activePlanData: typeof PLAN_KEYS[0];
  isLight: boolean;
  labelColor: string;
  divColor: string;
}) {
  // All sections open by default, user can collapse
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(COMPARISON_SECTIONS.map(s => [s.title, true]))
  );

  const toggleSection = (title: string) =>
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));

  return (
    <>
      {COMPARISON_SECTIONS.map((section, si) => {
        const isOpen = openSections[section.title];
        const Icon = section.icon;

        return (
          <div key={section.title} style={{
            borderTop: si > 0 ? `1px solid ${divColor}` : "none",
          }}>
            {/* ── Collapsible section header ── */}
            <button
              onClick={() => toggleSection(section.title)}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: "8px", padding: "12px 20px",
                background: isOpen ? `${section.color}08` : "transparent",
                border: "none", cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              <div style={{
                width: "26px", height: "26px", borderRadius: "8px", flexShrink: 0,
                background: `${section.color}18`,
                border: `1px solid ${section.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={13} style={{ color: section.color }} />
              </div>
              <span style={{
                flex: 1, textAlign: "left",
                fontSize: "11px", fontWeight: 700, color: section.color,
                textTransform: "uppercase", letterSpacing: "0.07em",
              }}>
                {section.title}
              </span>
              <div style={{
                width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                background: `${section.color}15`,
                border: `1px solid ${section.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "transform 0.25s ease",
                transform: isOpen ? "rotate(0deg)" : "rotate(-180deg)",
              }}>
                <ChevronUp size={12} style={{ color: section.color }} />
              </div>
            </button>

            {/* ── Rows (shown when open) ── */}
            {isOpen && section.rows.map((row, ri) => {
              const val = row[activePlan as keyof typeof row] as boolean;
              const customLabel =
                activePlan === "command" ? (row as any).commandLabel :
                activePlan === "edge"    ? (row as any).edgeLabel    : undefined;

              return (
                <div key={ri} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "11px 20px 11px 56px",
                  borderTop: `1px solid ${divColor}`,
                  background: isLight ? "rgba(248,250,252,0.5)" : "rgba(255,255,255,0.01)",
                }}>
                  <span style={{ fontSize: "13px", color: labelColor, flex: 1, paddingRight: "12px", lineHeight: 1.4 }}>
                    {row.label}
                  </span>

                  {val ? (
                    customLabel ? (
                      <div style={{
                        background: `${activePlanData.color}15`,
                        border: `1px solid ${activePlanData.color}35`,
                        borderRadius: "20px", padding: "3px 10px", flexShrink: 0,
                      }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, color: activePlanData.color, whiteSpace: "nowrap" }}>
                          {customLabel}
                        </span>
                      </div>
                    ) : (
                      <div style={{
                        width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
                        background: `${activePlanData.color}18`,
                        border: `1.5px solid ${activePlanData.color}40`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Check size={12} strokeWidth={3} style={{ color: activePlanData.color }} />
                      </div>
                    )
                  ) : (
                    <div style={{ width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <div style={{ width: "12px", height: "2px", background: "rgba(148,163,184,0.25)", borderRadius: "2px" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

function MobileCompare({ isLight }: { isLight: boolean }) {
  const [activePlan, setActivePlan] = useState<PlanKey>("foundation");

  const cardBg  = isLight ? "rgba(255,255,255,0.98)" : "rgba(13,30,54,0.7)";
  const border   = isLight ? "1px solid rgba(226,232,240,0.9)" : "1px solid rgba(255,255,255,0.07)";
  const labelColor = isLight ? "#374151" : "rgba(203,213,225,0.85)";
  const divColor   = isLight ? "rgba(226,232,240,0.8)" : "rgba(255,255,255,0.06)";
  const sectionLabelColor = isLight ? "rgba(13,37,64,0.45)" : "rgba(148,163,184,0.6)";

  const activePlanData = PLAN_KEYS.find(p => p.key === activePlan)!;

  return (
    <div>
      {/* Plan switcher tabs */}
      <div style={{
        display: "flex", gap: "8px", marginBottom: "20px",
        background: isLight ? "rgba(255,255,255,0.6)" : "rgba(13,30,54,0.5)",
        border, borderRadius: "16px", padding: "6px",
      }}>
        {PLAN_KEYS.map(p => {
          const active = activePlan === p.key;
          const Icon = p.icon;
          return (
            <button
              key={p.key}
              onClick={() => setActivePlan(p.key)}
              style={{
                flex: 1, padding: "10px 6px", borderRadius: "11px",
                border: "none", cursor: "pointer",
                background: active ? p.color : "transparent",
                color: active ? "#fff" : p.color,
                fontWeight: 700, fontSize: "12px",
                transition: "all 0.2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                boxShadow: active ? `0 4px 14px ${p.color}40` : "none",
              }}
            >
              <Icon size={15} />
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Feature list for active plan */}
      <div style={{
        background: cardBg, border,
        borderRadius: "16px", overflow: "hidden",
        boxShadow: isLight ? "0 4px 24px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.03)" : "0 4px 24px rgba(0,0,0,0.3)",
      }}>
        {/* Plan header */}
        <div style={{
          padding: "16px 20px",
          background: `${activePlanData.color}12`,
          borderBottom: `1px solid ${activePlanData.color}25`,
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: `${activePlanData.color}20`,
            border: `1.5px solid ${activePlanData.color}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {(() => { const Icon = activePlanData.icon; return <Icon size={18} style={{ color: activePlanData.color }} />; })()}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: activePlanData.color }}>
              {activePlanData.name} Plan
            </p>
            <p style={{ margin: 0, fontSize: "11px", color: sectionLabelColor }}>
              Features included in this plan
            </p>
          </div>
        </div>

        {/* Collapsible Sections */}
        <MobileSections
          activePlan={activePlan}
          activePlanData={activePlanData}
          isLight={isLight}
          labelColor={labelColor}
          divColor={divColor}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  FULL COMPARE TABLE (desktop)
// ─────────────────────────────────────────────────────────────────────────────
function CompareTable({ isLight, headingColor, subColor, tableBg, tableBorder, tableHeadBg, tableHeadColor }: {
  isLight: boolean; headingColor: string; subColor: string;
  tableBg: string; tableBorder: string; tableHeadBg: string; tableHeadColor: string;
}) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section style={{ padding: "0 16px 80px", maxWidth: isMobile ? "100%" : "1200px", margin: "0 auto" }}>
      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "7px",
          background: isLight ? "rgba(13,37,64,0.05)" : "rgba(255,255,255,0.05)",
          border: isLight ? "1px solid rgba(13,37,64,0.1)" : "1px solid rgba(255,255,255,0.08)",
          borderRadius: "100px", padding: "5px 14px", marginBottom: "14px",
        }}>
          <Zap size={12} style={{ color: "#C9A84C" }} />
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Full Feature Breakdown
          </span>
        </div>
        <h2 style={{ margin: "0 0 10px", fontSize: "clamp(22px,3.5vw,34px)", fontWeight: 800, color: headingColor, letterSpacing: "-0.02em" }}>
          Compare All Plans
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: subColor }}>
          See exactly what's included in each plan before you decide.
        </p>
      </div>

      {/* Mobile: tab switcher */}
      {isMobile ? (
        <MobileCompare isLight={isLight} />
      ) : (
        /* Desktop: full grid table */
        <div style={{
          background: tableBg, border: tableBorder, borderRadius: "20px", overflow: "hidden",
          boxShadow: isLight ? "0 8px 40px rgba(13,37,64,0.08)" : "0 8px 40px rgba(0,0,0,0.3)",
          backdropFilter: "blur(12px)",
        }}>
          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1.8fr repeat(3, 1fr)",
            padding: "18px 28px", background: tableHeadBg,
            borderBottom: isLight ? "1px solid rgba(13,37,64,0.08)" : "1px solid rgba(255,255,255,0.06)",
          }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: tableHeadColor, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Feature
            </span>
            {[
              { name: "Foundation", color: "#22c55e" },
              { name: "Command",    color: "#3b82f6" },
              { name: "Edge",       color: "#a855f7" },
            ].map(p => (
              <div key={p.name} style={{ textAlign: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: p.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {p.name}
                </span>
              </div>
            ))}
          </div>

          {/* Collapsible sections */}
          <div style={{ padding: "16px 12px" }}>
            {COMPARISON_SECTIONS.map(section => (
              <DesktopComparisonSection key={section.title} section={section} isLight={isLight} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  DESKTOP COMPARISON SECTION (wider grid)
// ─────────────────────────────────────────────────────────────────────────────
function DesktopComparisonSection({ section, isLight }: { section: typeof COMPARISON_SECTIONS[0]; isLight: boolean }) {
  const [open, setOpen] = useState(true);
  const Icon = section.icon;

  const headerBg   = isLight ? `${section.color}08` : `${section.color}10`;
  const rowBg      = "transparent";
  const rowHoverBg = isLight ? "rgba(248,250,252,0.9)" : "rgba(255,255,255,0.03)";
  const labelColor = isLight ? "#374151" : "rgba(203,213,225,0.85)";
  const borderColor = isLight ? "rgba(226,232,240,0.8)" : "rgba(255,255,255,0.06)";

  return (
    <div style={{ marginBottom: "8px" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "10px",
          padding: "13px 16px", background: headerBg,
          border: `1px solid ${section.color}20`,
          borderRadius: open ? "14px 14px 0 0" : "14px",
          cursor: "pointer",
        }}
      >
        <div style={{
          width: "30px", height: "30px", borderRadius: "9px",
          background: `${section.color}18`, border: `1px solid ${section.color}30`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={15} style={{ color: section.color }} />
        </div>
        <span style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: section.color, flex: 1, textAlign: "left" }}>
          {section.title}
        </span>
        {open ? <ChevronUp size={15} style={{ color: section.color }} /> : <ChevronDown size={15} style={{ color: section.color }} />}
      </button>

      {open && (
        <div style={{ border: `1px solid ${section.color}20`, borderTop: "none", borderRadius: "0 0 14px 14px", overflow: "hidden" }}>
          {section.rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "grid", gridTemplateColumns: "1.8fr repeat(3, 1fr)",
                alignItems: "center", padding: "13px 16px",
                background: rowBg,
                borderTop: i > 0 ? `1px solid ${borderColor}` : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = rowHoverBg}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = rowBg}
            >
              <span style={{ fontSize: "13px", color: labelColor }}>{row.label}</span>
              <Cell value={row.foundation} color="#22c55e" label={(row as any).foundationLabel} />
              <Cell value={row.command}    color="#3b82f6" label={(row as any).commandLabel} />
              <Cell value={row.edge}       color="#a855f7" label={(row as any).edgeLabel} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PricingPlan() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isLight = theme === "light";

  // ── Theme tokens ─────────────────────────────────────────────────────────
  const pageBg = isLight
    ? "linear-gradient(160deg,#f5f4f0 0%,#f8fbff 40%,#f5f4f0 100%)"
    : "linear-gradient(160deg,#060e1a 0%,#0a1628 50%,#060e1a 100%)";

  const sectionBg = isLight
    ? "rgba(255,255,255,0.6)"
    : "rgba(13,30,54,0.5)";

  const headingColor = isLight ? "#0d1b2a" : "#e8edf5";
  const subColor = isLight ? "rgba(13,37,64,0.55)" : "rgba(148,163,184,1)";

  const tableBg = isLight
    ? "rgba(255,255,255,0.8)"
    : "rgba(13,30,54,0.6)";
  const tableBorder = isLight
    ? "1px solid rgba(13,37,64,0.1)"
    : "1px solid rgba(255,255,255,0.07)";
  const tableHeadBg = isLight
    ? "rgba(13,37,64,0.03)"
    : "rgba(255,255,255,0.03)";
  const tableHeadColor = isLight ? "rgba(13,37,64,0.5)" : "rgba(148,163,184,0.7)";

  const handleCta = (planId: string) => {
    if (!user) {
      navigate("/signin");
    } else {
      navigate(`/plans/${planId}/checkout`);
    }
  };

  return (
    <Layout>
      <div style={{ background: pageBg, minHeight: "100vh" }}>

        {/* ── Hero Section ─────────────────────────────────────────────── */}
        <section style={{ padding: "56px 16px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          {/* Background decorative blobs */}
          <div style={{
            position: "absolute", top: "-60px", left: "10%", width: "400px", height: "400px",
            borderRadius: "50%", background: "rgba(196,148,30,0.07)", filter: "blur(80px)", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-40px", right: "10%", width: "300px", height: "300px",
            borderRadius: "50%", background: "rgba(59,130,246,0.07)", filter: "blur(60px)", pointerEvents: "none",
          }} />

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            background: isLight ? "rgba(196,148,30,0.1)" : "rgba(196,148,30,0.1)",
            border: "1px solid rgba(196,148,30,0.3)", borderRadius: "100px",
            padding: "6px 16px", marginBottom: "20px",
          }}>
            <Sparkles size={13} style={{ color: "#C9A84C" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Simple, Transparent Pricing
            </span>
          </div>

          <h1 style={{
            margin: "0 0 16px", fontSize: "clamp(32px,5vw,56px)",
            fontWeight: 900, color: headingColor,
            letterSpacing: "-0.03em", lineHeight: 1.1,
          }}>
            Choose Your{" "}
            <span style={{
              background: "linear-gradient(135deg,#C9A84C,#e8c45a)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              InvestBeans Plan
            </span>
          </h1>

          <p style={{
            margin: "0 auto", maxWidth: "520px",
            fontSize: "clamp(14px,2vw,17px)", color: subColor, lineHeight: 1.7,
          }}>
            From foundational learning to live market dashboards and deep research intelligence —
            pick the plan that matches your investing journey.
          </p>
        </section>

        {/* ── Plan Cards ───────────────────────────────────────────────── */}
        <section style={{ padding: "0 16px 72px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            alignItems: "start",
            paddingTop: "24px",
          }}>
            {PLANS.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isLight={isLight}
                onCta={() => handleCta(plan.id)}
              />
            ))}
          </div>
        </section>

        {/* ── Plan Comparison Table ─────────────────────────────────────── */}
        <CompareTable isLight={isLight} headingColor={headingColor} subColor={subColor} tableBg={tableBg} tableBorder={tableBorder} tableHeadBg={tableHeadBg} tableHeadColor={tableHeadColor} />

        {/* ── Bottom CTA Banner ─────────────────────────────────────────── */}
        <section style={{ padding: "0 20px 80px", maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div style={{
            background: isLight
              ? "linear-gradient(135deg,#0d1b2a,#1a3a5c)"
              : "linear-gradient(135deg,#0f1f3d,#0d2a50)",
            borderRadius: "24px", padding: "48px 36px",
            border: "1px solid rgba(196,148,30,0.2)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Glow */}
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "200px", height: "200px", borderRadius: "50%",
              background: "rgba(196,148,30,0.12)", filter: "blur(50px)", pointerEvents: "none",
            }} />

            <div style={{
              width: "52px", height: "52px", borderRadius: "16px",
              background: "rgba(196,148,30,0.15)", border: "1.5px solid rgba(196,148,30,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <Globe size={24} style={{ color: "#C9A84C" }} />
            </div>

            <h3 style={{ margin: "0 0 12px", fontSize: "24px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              Not Sure Which Plan to Pick?
            </h3>
            <p style={{ margin: "0 0 28px", fontSize: "14px", color: "rgba(203,213,225,0.8)", lineHeight: 1.7 }}>
              Start with Foundation to build your knowledge base, upgrade to Command for live dashboards,
              or get Edge for deep research insights. You can switch anytime.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/contact")}
                style={{
                  padding: "13px 28px", borderRadius: "12px", fontSize: "14px", fontWeight: 700,
                  background: "linear-gradient(135deg,#C4941E,#D4A843)",
                  border: "none", color: "#0d1b2a", cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(196,148,30,0.3)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"}
              >
                Talk to Us
              </button>
              <button
                onClick={() => navigate("/about")}
                style={{
                  padding: "13px 28px", borderRadius: "12px", fontSize: "14px", fontWeight: 600,
                  background: "transparent", border: "1.5px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.8)", cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "rgba(255,255,255,0.35)"; b.style.color = "#fff"; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "rgba(255,255,255,0.15)"; b.style.color = "rgba(255,255,255,0.8)"; }}
              >
                Learn More
              </button>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}