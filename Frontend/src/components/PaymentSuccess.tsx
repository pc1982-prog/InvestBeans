/**
 * PaymentSuccess.tsx
 * Route: /paymentsuccess
 *
 * Backend (paymentVerification) redirects here after payment:
 *   ✅ Success:  /paymentsuccess?reference=pay_xxx
 *   ❌ Error:    /paymentsuccess?error=processing_failed
 *               /paymentsuccess?error=verification_failed
 */

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/controllers/AuthContext";
import { useTheme } from "@/controllers/Themecontext";
import Layout from "@/components/Layout";
import { CheckCircle, XCircle, Home, BarChart3, RefreshCw } from "lucide-react";

export default function PaymentSuccess() {
  const [searchParams]       = useSearchParams();
  const { theme }            = useTheme();
  const { user }             = useAuth();
  const navigate             = useNavigate();
  const isLight              = theme === "light";

  const reference = searchParams.get("reference"); // pay_xxx on success
  const errorCode = searchParams.get("error");     // string on failure
  const isSuccess = !!reference && !errorCode;

  // Auto-redirect to dashboard after success
  const [countdown, setCountdown] = useState(8);
  useEffect(() => {
    if (!isSuccess) return;
    if (countdown <= 0) { navigate("/"); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, isSuccess, navigate]);

  // Theme tokens
  const pageBg = isLight
    ? "linear-gradient(160deg,#f5f4f0 0%,#f8fbff 50%,#f5f4f0 100%)"
    : "linear-gradient(160deg,#060e1a 0%,#0a1628 50%,#060e1a 100%)";
  const cardBg = isLight ? "#ffffff"               : "#0f1829";
  const border = isLight ? "rgba(226,232,240,0.9)" : "rgba(255,255,255,0.07)";
  const text   = isLight ? "#0f172a"               : "#e2e8f0";
  const muted  = isLight ? "#64748b"               : "#94a3b8";
  const shadow = isLight
    ? "0 8px 40px rgba(0,0,0,0.07)"
    : "0 8px 40px rgba(0,0,0,0.5)";

  const errorMessages: Record<string, string> = {
    verification_failed: "Payment signature verification failed. If money was deducted, it will be refunded within 5-7 business days.",
    processing_failed:   "There was an error processing your payment. If money was deducted, it will be refunded within 5-7 business days.",
    default:             "Something went wrong with your payment. Please try again or contact support.",
  };
  const errorMsg = errorMessages[errorCode || ""] || errorMessages.default;

  return (
    <Layout>
      <div style={{
        background: pageBg, minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 16px",
      }}>
        <div style={{ maxWidth: 480, width: "100%" }}>
          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: 24, padding: "40px 32px",
            boxShadow: shadow, textAlign: "center",
          }}>

            {isSuccess ? (
              /* ── SUCCESS STATE ── */
              <>
                {/* Animated checkmark */}
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "rgba(34,197,94,0.12)",
                  border: "2px solid rgba(34,197,94,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 24px",
                  animation: "popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",
                }}>
                  <CheckCircle size={40} color="#22c55e" strokeWidth={1.5} />
                </div>

                <h1 style={{
                  fontSize: 26, fontWeight: 900, color: text,
                  letterSpacing: "-0.02em", margin: "0 0 10px",
                }}>
                  Payment Successful!
                </h1>

                <p style={{ fontSize: 14, color: muted, margin: "0 0 24px", lineHeight: 1.6 }}>
                  {user?.name ? `Welcome aboard, ${user.name.split(" ")[0]}!` : "Welcome aboard!"}
                  {" "}Your subscription is now active.
                </p>

                {/* Reference ID chip */}
                <div style={{
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: 10, padding: "10px 16px",
                  marginBottom: 28, display: "inline-block",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>
                    Payment Reference
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: text, fontFamily: "monospace" }}>
                    {reference}
                  </div>
                </div>

                {/* Countdown */}
                <p style={{ fontSize: 12, color: muted, marginBottom: 24 }}>
                  Redirecting to dashboard in {countdown}s…
                </p>

                {/* Action buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button
                    onClick={() => navigate("/")}
                    style={{
                      width: "100%", padding: "13px", borderRadius: 12,
                      background: "linear-gradient(135deg,#0A3656,#12466e)",
                      border: "none", color: "white",
                      fontSize: 14, fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"}
                  >
                    <Home size={15} /> Go to Dashboard
                  </button>

                
                </div>
              </>
            ) : (
              /* ── ERROR STATE ── */
              <>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "rgba(239,68,68,0.10)",
                  border: "2px solid rgba(239,68,68,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 24px",
                  animation: "popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",
                }}>
                  <XCircle size={40} color="#ef4444" strokeWidth={1.5} />
                </div>

                <h1 style={{
                  fontSize: 24, fontWeight: 900, color: text,
                  letterSpacing: "-0.02em", margin: "0 0 12px",
                }}>
                  Payment Not Completed
                </h1>

                <p style={{
                  fontSize: 13, color: muted, margin: "0 0 28px",
                  lineHeight: 1.7, maxWidth: 380, marginLeft: "auto", marginRight: "auto",
                }}>
                  {errorMsg}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button
                    onClick={() => navigate("/plans")}
                    style={{
                      width: "100%", padding: "13px", borderRadius: 12,
                      background: "linear-gradient(135deg,#0A3656,#12466e)",
                      border: "none", color: "white",
                      fontSize: 14, fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"}
                  >
                    <RefreshCw size={15} /> Try Again
                  </button>

                  <button
                    onClick={() => navigate("/")}
                    style={{
                      width: "100%", padding: "13px", borderRadius: 12,
                      background: "transparent",
                      border: `1px solid ${border}`,
                      color: muted, fontSize: 14, fontWeight: 600,
                      cursor: "pointer", transition: "all 0.2s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    <Home size={15} /> Back to Home
                  </button>
                </div>

                <p style={{ fontSize: 11, color: muted, marginTop: 20, lineHeight: 1.6 }}>
                  Need help? Email us at{" "}
                  <a href="mailto:support@investbeans.com" style={{ color: "#0A3656" }}>
                    support@investbeans.com
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes popIn {
          from { transform: scale(0.7); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </Layout>
  );
}