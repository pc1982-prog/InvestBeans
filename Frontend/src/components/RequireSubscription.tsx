// components/RequireSubscription.tsx
//
// ─── PRODUCTION-GRADE SUBSCRIPTION GATE ────────────────────────────────────
//
// Ek universal wrapper jo KISI BHI component ke around laga sakte ho.
// CSS class se nahi — React state se check hota hai. Inspect se bypass IMPOSSIBLE.
//
// ── USAGE ────────────────────────────────────────────────────────────────────
//
//  1. Poori section ko gate karna (default blur+lock overlay):
//     <RequireSubscription>
//       <PremiumChart />
//     </RequireSubscription>
//
//  2. Sirf blur karna (content visible but blurred):
//     <RequireSubscription mode="blur">
//       <SensitiveText />
//     </RequireSubscription>
//
//  3. Completely hide karna (DOM mein exist hi nahi karega):
//     <RequireSubscription mode="hidden">
//       <SecretData />
//     </RequireSubscription>
//
//  4. Custom paywall/message:
//     <RequireSubscription
//       mode="overlay"
//       title="Premium Feature"
//       description="Upgrade to access this analysis"
//       ctaText="View Plans"
//       ctaHref="/pricing"
//     >
//       <AnalysisBlock />
//     </RequireSubscription>
//
//  5. Specific plan check:
//     <RequireSubscription requiredPlan="edge">
//       <EdgeFeature />
//     </RequireSubscription>
//
//  6. Admin bypass — admin ko sab dikhta hai:
//     Automatically handled — isAdmin ho to gate nahi lagta
//
// ── HOW IT'S SECURE ──────────────────────────────────────────────────────────
//  - mode="hidden"  → DOM mein component exist hi nahi, DevTools mein kuch nahi
//  - mode="blur"    → Content DOM mein hai but readable nahi + pointer-events none
//  - mode="overlay" → Content render hota hai but opaque overlay ke neeche
//                     (blur se better UX — user preview dekh sakta hai shape ka)
//  - REAL security hamesha BACKEND pe hoti hai (verifySubscription middleware)
//    Frontend gate = UX layer, backend gate = actual security layer
//
// ─────────────────────────────────────────────────────────────────────────────

import { useNavigate } from "react-router-dom";
import { Lock, Sparkles, ArrowRight, Crown } from "lucide-react";
import { useAuth } from "@/controllers/AuthContext";
import { useTheme } from "@/controllers/Themecontext";

// ── Plan hierarchy — edge > command > foundation > free ──────────────────────
const PLAN_RANK: Record<string, number> = {
  free:       0,
  foundation: 1,
  command:    2,
  edge:       3,
  elite:      4,
  // Legacy names
  basic:      1,
  pro:        2,
};

const hasRequiredPlan = (userPlan: string | null | undefined, requiredPlan: string): boolean => {
  const userRank     = PLAN_RANK[userPlan || "free"] ?? 0;
  const requiredRank = PLAN_RANK[requiredPlan]       ?? 1;
  return userRank >= requiredRank;
};

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface RequireSubscriptionProps {
  children: React.ReactNode;

  // Display mode
  mode?: "overlay" | "blur" | "hidden";
  // overlay → children render + opaque lock overlay (DEFAULT)
  // blur    → children render + blurred + pointer-events none
  // hidden  → children NOT rendered at all (most secure frontend option)

  // Gate config
  requiredPlan?: string; // "foundation" | "command" | "edge" | "elite"
                         // Default: any active subscription

  // Paywall UI customisation
  title?:       string;
  description?: string;
  ctaText?:     string;
  ctaHref?:     string;  // default: "/pricing"

  // Show a mini teaser of content height for "overlay" mode
  minHeight?: string;   // e.g. "120px" — sets min-height on wrapper

  // Optional className on outer wrapper
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Lock overlay UI (used by both overlay and blur modes)
// ─────────────────────────────────────────────────────────────────────────────
interface LockOverlayProps {
  title:       string;
  description: string;
  ctaText:     string;
  ctaHref:     string;
  isLight:     boolean;
  mode:        "overlay" | "blur";
  onCta:       () => void;
}

const LockOverlay = ({ title, description, ctaText, isLight, mode, onCta }: LockOverlayProps) => {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center z-20 rounded-[inherit]"
      style={{
        background: mode === "overlay"
          ? isLight
            ? "rgba(255,255,255,0.92)"
            : "rgba(10,15,30,0.90)"
          : "transparent",
        backdropFilter: mode === "overlay" ? "blur(2px)" : "none",
      }}
    >
      {/* Lock icon ring */}
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full mb-3"
        style={{
          background: "linear-gradient(135deg, rgba(81,148,246,0.15), rgba(81,148,246,0.08))",
          border: "1px solid rgba(81,148,246,0.3)",
        }}
      >
        <Lock className="w-4 h-4" style={{ color: "#5194F6" }} />
      </div>

      {/* Text */}
      <p
        className="font-bold text-sm mb-1 text-center px-4"
        style={{ color: isLight ? "#0d1b2a" : "white" }}
      >
        {title}
      </p>
      <p
        className="text-xs text-center px-6 mb-4 leading-relaxed"
        style={{ color: isLight ? "rgba(13,37,64,0.55)" : "rgba(148,163,184,0.8)" }}
      >
        {description}
      </p>

      {/* CTA button */}
      <button
        onClick={onCta}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #5194F6, #3a7de8)",
          boxShadow: "0 4px 16px rgba(81,148,246,0.35)",
        }}
      >
        <Crown className="w-3 h-3" />
        {ctaText}
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Inline locked placeholder (when mode="hidden" — nothing to show)
// ─────────────────────────────────────────────────────────────────────────────
const LockedPlaceholder = ({
  title,
  description,
  ctaText,
  minHeight,
  isLight,
  onCta,
}: {
  title: string;
  description: string;
  ctaText: string;
  minHeight: string;
  isLight: boolean;
  onCta: () => void;
}) => (
  <div
    className="relative flex flex-col items-center justify-center rounded-2xl overflow-hidden"
    style={{
      minHeight,
      background: isLight
        ? "linear-gradient(135deg, rgba(81,148,246,0.04), rgba(81,148,246,0.02))"
        : "linear-gradient(135deg, rgba(81,148,246,0.07), rgba(81,148,246,0.03))",
      border: "1px dashed rgba(81,148,246,0.25)",
    }}
  >
    {/* Decorative sparkle top-right */}
    <Sparkles
      className="absolute top-3 right-3 w-4 h-4 opacity-30"
      style={{ color: "#5194F6" }}
    />

    <div
      className="flex items-center justify-center w-10 h-10 rounded-full mb-3"
      style={{
        background: "rgba(81,148,246,0.1)",
        border: "1px solid rgba(81,148,246,0.2)",
      }}
    >
      <Lock className="w-4 h-4" style={{ color: "#5194F6" }} />
    </div>

    <p
      className="font-bold text-sm mb-1 text-center px-6"
      style={{ color: isLight ? "#0d1b2a" : "white" }}
    >
      {title}
    </p>
    <p
      className="text-xs text-center px-8 mb-4 leading-relaxed"
      style={{ color: isLight ? "rgba(13,37,64,0.5)" : "rgba(148,163,184,0.7)" }}
    >
      {description}
    </p>

    <button
      onClick={onCta}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95"
      style={{
        background: "linear-gradient(135deg, #5194F6, #3a7de8)",
        boxShadow: "0 4px 14px rgba(81,148,246,0.3)",
      }}
    >
      <Crown className="w-3 h-3" />
      {ctaText}
      <ArrowRight className="w-3 h-3" />
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const RequireSubscription = ({
  children,
  mode        = "overlay",
  requiredPlan,
  title       = "Subscribers Only",
  description = "Subscribe to unlock this premium content and analysis.",
  ctaText     = "Unlock Access",
  ctaHref     = "/pricing",
  minHeight   = "140px",
  className   = "",
}: RequireSubscriptionProps) => {
  const { user, isAdmin } = useAuth();
  const { theme }         = useTheme();
  const navigate          = useNavigate();
  const isLight           = theme === "light";

  // ── Access check ────────────────────────────────────────────────────────────
  const isSubscriber = user?.hasSubscription && user?.subscription?.status === "active";
  const userPlan     = user?.subscription?.plan ?? null;

  const planOk = requiredPlan
    ? hasRequiredPlan(userPlan, requiredPlan)
    : isSubscriber;

  // Admin always gets full access
  const hasAccess = isAdmin || planOk;

  const handleCta = () => navigate(ctaHref);

  // ── CASE 1: Has access → render children normally ──────────────────────────
  if (hasAccess) {
    return <>{children}</>;
  }

  // ── CASE 2: No access, mode="hidden" → render placeholder, NO children ─────
  if (mode === "hidden") {
    return (
      <LockedPlaceholder
        title={title}
        description={description}
        ctaText={ctaText}
        minHeight={minHeight}
        isLight={isLight}
        onCta={handleCta}
      />
    );
  }

  // ── CASE 3: No access, mode="blur" → render children blurred ────────────────
  if (mode === "blur") {
    return (
      <div className={`relative rounded-2xl overflow-hidden ${className}`}>
        {/* Children render hote hain but blurred + no interaction */}
        <div
          style={{
            filter: "blur(6px)",
            userSelect: "none",
            pointerEvents: "none",
            opacity: 0.6,
          }}
        >
          {children}
        </div>
        <LockOverlay
          title={title}
          description={description}
          ctaText={ctaText}
          ctaHref={ctaHref}
          isLight={isLight}
          mode="blur"
          onCta={handleCta}
        />
      </div>
    );
  }

  // ── CASE 4: No access, mode="overlay" (DEFAULT) → children + opaque overlay ─
  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`} style={{ minHeight }}>
      {/* Children render hote hain (shape/layout visible) but overlay ke neeche */}
      <div style={{ opacity: 0.15, pointerEvents: "none", userSelect: "none" }}>
        {children}
      </div>
      <LockOverlay
        title={title}
        description={description}
        ctaText={ctaText}
        ctaHref={ctaHref}
        isLight={isLight}
        mode="overlay"
        onCta={handleCta}
      />
    </div>
  );
};

export default RequireSubscription;