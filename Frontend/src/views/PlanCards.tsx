import { Check, Star, BookOpen, BarChart3, Lightbulb } from "lucide-react";


const PLANS = [
  {
    id: "foundation",
    color: "#0A3656",
    colorLight: "#0A3656",
    colorDark: "#74A8C9",
    colorDimDark: "rgba(116,168,201,0.14)",
    colorBorderDark: "rgba(116,168,201,0.30)",
    colorDim: "rgba(10,54,86,0.12)",
    colorBorder: "rgba(10,54,86,0.30)",
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
    color: "#12466e",
    colorLight: "#12466e",
    colorDark: "#8FBDD9",
    colorDimDark: "rgba(143,189,217,0.14)",
    colorBorderDark: "rgba(143,189,217,0.34)",
    colorDim: "rgba(18,70,110,0.14)",
    colorBorder: "rgba(18,70,110,0.34)",
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
    color: "#1d5b87",
    colorLight: "#1d5b87",
    colorDark: "#9bc1da",
    colorDimDark: "rgba(155,193,218,0.14)",
    colorBorderDark: "rgba(155,193,218,0.34)",
    colorDim: "rgba(29,91,135,0.14)",
    colorBorder: "rgba(29,91,135,0.34)",
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

// ─── SINGLE PLAN CARD ─────────────────────────────────────────────────────────
function PlanCard({ plan, isLight = true, onCta }) {
  const Icon = plan.icon;
  const pColor = isLight ? plan.colorLight : plan.colorDark;
  const pDim   = isLight ? plan.colorDim   : plan.colorDimDark;
  const pBdr   = isLight ? plan.colorBorder : plan.colorBorderDark;

  const cardBg = isLight
    ? plan.popular ? "linear-gradient(145deg,#FCFDFE,#f3f8fc)" : "#FCFDFE"
    : plan.popular ? "linear-gradient(145deg,#072134,#041421)" : "rgba(6,27,43,0.72)";

  const cardBorder = plan.popular
    ? `2px solid ${pColor}`
    : isLight ? "1.5px solid rgba(4,20,33,0.10)" : "1.5px solid rgba(124,166,194,0.20)";

  const cardShadow = plan.popular
    ? `0 20px 60px ${pDim}, 0 4px 20px rgba(0,0,0,0.1)`
    : isLight ? "0 6px 24px rgba(4,20,33,0.08)" : "0 4px 24px rgba(0,0,0,0.3)";

  const nameColor    = isLight ? "#041421" : "#e8edf5";
  const taglineColor = isLight ? "rgba(4,20,33,0.70)" : "rgba(203,213,225,1)";
  const quoteColor   = isLight ? "rgba(4,20,33,0.55)" : "rgba(148,163,184,1)";
  const benefitColor = isLight ? "rgba(4,20,33,0.78)" : "rgba(203,213,225,1)";
  const noteColor    = isLight ? "rgba(4,20,33,0.45)" : "rgba(148,163,184,0.7)";
  const dividerColor = isLight ? "rgba(4,20,33,0.08)" : "rgba(255,255,255,0.07)";

  return (
    <div
      style={{
        background: cardBg,
        border: cardBorder,
        boxShadow: cardShadow,
        borderRadius: "24px",
        padding: "32px 28px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={e => {
        if (!plan.popular) e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={e => {
        if (!plan.popular) e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* ── Most Popular Badge ── */}
      {plan.popular && (
        <div style={{
          position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
          background: `linear-gradient(135deg,${pColor},#4f7fa2)`,
          color: "#fff", fontSize: "11px", fontWeight: 800,
          padding: "5px 18px", borderRadius: "100px",
          letterSpacing: "0.08em", textTransform: "uppercase",
          boxShadow: `0 4px 16px ${pDim}`,
          whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: "5px",
        }}>
          <Star size={10} fill="white" /> Most Popular
        </div>
      )}

      {/* ── Icon + Badge ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "14px",
          background: pDim, border: `1.5px solid ${pBdr}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={22} style={{ color: pColor }} />
        </div>
        <span style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.07em",
          textTransform: "uppercase", color: pColor,
          background: pDim, border: `1px solid ${pBdr}`,
          borderRadius: "100px", padding: "4px 12px",
        }}>
          {plan.badge}
        </span>
      </div>

      {/* ── Name + Tagline + Quote ── */}
      <h3 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 800, color: nameColor, letterSpacing: "-0.02em" }}>
        {plan.name}
      </h3>
      <p style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: 600, color: taglineColor }}>
        {plan.tagline}
      </p>
      <p style={{ margin: "0 0 22px", fontSize: "12px", fontStyle: "italic", color: quoteColor, lineHeight: 1.6 }}>
        "{plan.quote}"
      </p>

      {/* ── Divider ── */}
      <div style={{ height: "1px", background: dividerColor, marginBottom: "22px" }} />

      {/* ── Price ── */}
      <div style={{ marginBottom: "22px" }}>
        <span style={{ fontSize: "36px", fontWeight: 900, color: pColor, letterSpacing: "-0.03em", lineHeight: 1 }}>
          {plan.price}
        </span>
        <br />
        <span style={{ fontSize: "12px", color: quoteColor, fontWeight: 500 }}>
          {plan.unit}
        </span>
      </div>

      {/* ── Benefits ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px", flex: 1 }}>
        {plan.benefits.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <div style={{
              width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, marginTop: "1px",
              background: pDim, border: `1px solid ${pBdr}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Check size={10} strokeWidth={3} style={{ color: pColor }} />
            </div>
            <span style={{ fontSize: "13px", color: benefitColor, lineHeight: 1.5 }}>{b}</span>
          </div>
        ))}
      </div>

      {/* ── Value Note ── */}
      <p style={{ margin: "0 0 20px", fontSize: "11px", color: noteColor, fontStyle: "italic", textAlign: "center" }}>
        {plan.valueNote}
      </p>

      {/* ── CTA Button ── */}
      <button
        onClick={() => onCta && onCta(plan.id)}
        style={{
          width: "100%", padding: "14px", borderRadius: "14px", fontSize: "14px",
          fontWeight: 700, cursor: "pointer",
          background: plan.popular
            ? `linear-gradient(135deg,${pColor},#4f7fa2)`
            : pDim,
          color: plan.popular ? "#fff" : pColor,
          border: plan.popular ? "none" : `1.5px solid ${pBdr}`,
          boxShadow: plan.popular ? `0 6px 20px ${pDim}` : "none",
          transition: "all 0.2s ease",
          letterSpacing: "0.02em",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = `0 10px 28px ${pDim}`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = plan.popular ? `0 6px 20px ${pDim}` : "none";
        }}
      >
        {plan.cta}
      </button>
    </div>
  );
}

// ─── MAIN EXPORT: Teen Cards ──────────────────────────────────────────────────
export default function PlanCards({ isLight = true, onCta }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
      gap: "24px",
      alignItems: "start",
      padding: "24px 16px",
      maxWidth: "1200px",
      margin: "0 auto",
      boxSizing: "border-box" as const,
    }}>
      {PLANS.map(plan => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isLight={isLight}
          onCta={onCta}
        />
      ))}
    </div>
  );
}

// ─── USAGE EXAMPLE ────────────────────────────────────────────────────────────
// Apni kisi bhi page me aise use karo:
//
// import PlanCards from "./PlanCards";
//
// <PlanCards
//   isLight={true}           // light theme ke liye true, dark ke liye false
//   onCta={(planId) => {
//     console.log("Plan selected:", planId);
//     navigate(`/plans/${planId}/checkout`);  // apna logic yahan
//   }}
// />