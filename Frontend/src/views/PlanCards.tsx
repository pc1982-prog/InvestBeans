import { Check, Star, BookOpen, BarChart3, Lightbulb } from "lucide-react";


const PLANS = [
  {
    id: "foundation",
    color: "#22c55e",
    colorDim: "rgba(34,197,94,0.12)",
    colorBorder: "rgba(34,197,94,0.3)",
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

  const cardBg = isLight
    ? plan.popular ? "linear-gradient(145deg,#ffffff,#f0f7ff)" : "#ffffff"
    : plan.popular ? "linear-gradient(145deg,#0f1f3d,#0d1a35)" : "rgba(13,30,54,0.7)";

  const cardBorder = plan.popular
    ? `2px solid ${plan.color}`
    : isLight ? "1.5px solid rgba(13,37,64,0.1)" : "1.5px solid rgba(255,255,255,0.08)";

  const cardShadow = plan.popular
    ? `0 20px 60px ${plan.colorDim}, 0 4px 20px rgba(0,0,0,0.1)`
    : isLight ? "0 4px 24px rgba(13,37,64,0.07)" : "0 4px 24px rgba(0,0,0,0.3)";

  const nameColor    = isLight ? "#0d1b2a" : "#e8edf5";
  const taglineColor = isLight ? "rgba(13,37,64,0.7)" : "rgba(203,213,225,1)";
  const quoteColor   = isLight ? "rgba(13,37,64,0.5)" : "rgba(148,163,184,1)";
  const benefitColor = isLight ? "rgba(13,37,64,0.75)" : "rgba(203,213,225,1)";
  const noteColor    = isLight ? "rgba(13,37,64,0.4)" : "rgba(148,163,184,0.7)";
  const dividerColor = isLight ? "rgba(13,37,64,0.07)" : "rgba(255,255,255,0.07)";

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
        marginTop: plan.popular ? "-10px" : "10px",
        marginBottom: plan.popular ? "10px" : "0px",
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

      {/* ── Icon + Badge ── */}
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
        <span style={{ fontSize: "36px", fontWeight: 900, color: plan.color, letterSpacing: "-0.03em", lineHeight: 1 }}>
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
              background: plan.colorDim, border: `1px solid ${plan.colorBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Check size={10} strokeWidth={3} style={{ color: plan.color }} />
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
            ? `linear-gradient(135deg,${plan.color},#60a5fa)`
            : plan.colorDim,
          color: plan.popular ? "#fff" : plan.color,
          border: plan.popular ? "none" : `1.5px solid ${plan.colorBorder}`,
          boxShadow: plan.popular ? `0 6px 20px ${plan.colorDim}` : "none",
          transition: "all 0.2s ease",
          letterSpacing: "0.02em",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = `0 10px 28px ${plan.colorDim}`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = plan.popular ? `0 6px 20px ${plan.colorDim}` : "none";
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
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "24px",
      alignItems: "start",
      padding: "24px 16px",
      maxWidth: "1200px",
      margin: "0 auto",
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