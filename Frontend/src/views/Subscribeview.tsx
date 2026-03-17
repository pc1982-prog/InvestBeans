import React, { useState, useEffect } from "react";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/controllers/AuthContext";

// ─── Email validation ──────────────────────────────────────────────────────
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com",
  "trashmail.com", "yopmail.com", "tempmail.com", "throwaway.email",
  "sharklasers.com",
]);

const validateEmail = (email: string): string | null => {
  const trimmed = email.trim();
  if (!trimmed) return "Email address is required.";
  if (trimmed.length > 254) return "Email address is too long.";
  if (!EMAIL_REGEX.test(trimmed)) return "Please enter a valid email address.";
  const domain = trimmed.split("@")[1]?.toLowerCase();
  if (DISPOSABLE_DOMAINS.has(domain)) return "Disposable email addresses are not allowed.";
  return null; // valid
};

// ─── Types ────────────────────────────────────────────────────────────────
type Status = "idle" | "loading" | "success" | "error" | "duplicate";

interface SubscribeviewProps {
  sectionWrapBg: string;
  sectionWrapBorder: string;
  sectionTopLine: string;
  glow1: string;
  headingCls: string;
  subTextCls: string;
  GOLD: string;
  emailInputBg: string;
  emailInputBorder: string;
  emailInputText: string;
}

const Subscribeview = ({
  sectionWrapBg,
  sectionWrapBorder,
  sectionTopLine,
  glow1,
  headingCls,
  subTextCls,
  GOLD,
  emailInputBg,
  emailInputBorder,
  emailInputText,
}: SubscribeviewProps) => {
  const { isAuthenticated, user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  // ── State ──────────────────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [touched, setTouched] = useState(false);

  // ── Pre-fill email if user is logged in ────────────────────────────────
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setEmail(user.email);
    }
  }, [isAuthenticated, user]);

  // ── Real-time validation (only after first blur/touch) ────────────────
  useEffect(() => {
    if (touched) {
      setFieldError(validateEmail(email));
    }
  }, [email, touched]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleBlur = () => {
    setTouched(true);
    setFieldError(validateEmail(email));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Reset server-level status when user edits
    if (status === "error" || status === "duplicate") {
      setStatus("idle");
      setServerMessage("");
    }
  };

  const handleSubmit = async () => {
    // Force validate before submit
    setTouched(true);
    const error = validateEmail(email);
    setFieldError(error);
    if (error) return;

    setStatus("loading");
    setServerMessage("");

    try {
      const { data } = await axios.post(
        `${API_URL}/subscribe`,
        { email: email.trim().toLowerCase(), source: "homepage" },
        { withCredentials: true }
      );

      setStatus("success");
      setServerMessage(data.message);
    } catch (err: any) {
      const responseData = err.response?.data;
      const httpStatus = err.response?.status;

      if (httpStatus === 409 || responseData?.alreadySubscribed) {
        setStatus("duplicate");
        setServerMessage(responseData?.message || "This email is already subscribed!");
      } else {
        setStatus("error");
        setServerMessage(
          responseData?.message || "Something went wrong. Please try again."
        );
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  // ── Input border color based on state ─────────────────────────────────
  const inputBorderStyle = () => {
    if (fieldError) return "1px solid #ef4444";
    if (status === "success") return "1px solid #22c55e";
    if (status === "duplicate") return "1px solid #f59e0b";
    return emailInputBorder;
  };

  // ── Success screen ─────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <section className="mt-10">
        <div
          className="rounded-2xl p-10 md:p-12 relative overflow-hidden"
          style={{ background: sectionWrapBg, border: sectionWrapBorder }}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: sectionTopLine }} />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[100px] pointer-events-none" style={{ background: glow1 }} />

          <div className="relative z-10 max-w-xl mx-auto text-center py-6">
            {/* Animated success icon */}
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 mx-auto"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}
            >
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>

            <h3 className={`text-3xl md:text-4xl font-bold mb-3 ${headingCls}`}>
              You're{" "}
              <span style={{ background: "linear-gradient(135deg,#5194F6,#3a7de0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                In!
              </span>
            </h3>

            <p className={`text-base mb-2 ${subTextCls}`}>{serverMessage}</p>

            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mt-4 text-sm"
              style={{ background: "rgba(81,148,246,0.10)", border: "1px solid rgba(81,148,246,0.25)" }}
            >
              <Mail className="w-4 h-4 text-[#5194F6]" />
              <span className="text-[#5194F6] font-medium">Check your inbox for a welcome email 🫘</span>
            </div>

            <p className={`text-xs mt-6 ${subTextCls}`}>
              Subscribed as <strong className="text-[#5194F6]">{email.trim().toLowerCase()}</strong>
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ── Main subscribe form ────────────────────────────────────────────────
  return (
    <section className="mt-10">
      <div
        className="rounded-2xl p-8 sm:p-10 md:p-12 relative overflow-hidden"
        style={{ background: sectionWrapBg, border: sectionWrapBorder }}
      >
        {/* Blue top line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: sectionTopLine }} />

        {/* Ambient glow */}
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
          style={{ background: glow1 }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Mail icon */}
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 mx-auto"
            style={{ background: "rgba(81,148,246,0.10)", border: "1px solid rgba(81,148,246,0.25)" }}
          >
            <Mail className="w-7 h-7 text-[#5194F6]" />
          </div>

          {/* Heading */}
          <h3
          
           className={`text-3xl md:text-4xl font-bold mb-3 ${headingCls}`}>
            Stay Ahead in the{" "}
            <span
            
             style={{ background: "linear-gradient(135deg,#5194F6,#3a7de0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Market
            </span>
          </h3>

          <p className={`mb-8 ${subTextCls}`}>
            Subscribe for daily insights, market trends, and expert analysis delivered to your inbox
          </p>

          {/* Logged-in hint */}
          {isAuthenticated && user?.email && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs"
              style={{ background: "rgba(81,148,246,0.08)", border: "1px solid rgba(81,148,246,0.20)" }}
            >
              <CheckCircle className="w-3.5 h-3.5 text-[#5194F6]" />
              <span className="text-[#5194F6]">Using your account email</span>
            </div>
          )}

          {/* Email form */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="Enter your email"
                disabled={status === "loading"}
                className="w-full h-12 px-4 rounded-xl text-sm focus:outline-none placeholder:text-slate-400 disabled:opacity-60"
                style={{
                  background: emailInputBg,
                  border: inputBorderStyle(),
                  color: emailInputText,
                  transition: "border-color 0.2s ease",
                }}
                aria-label="Email address"
                aria-invalid={!!fieldError}
                aria-describedby={fieldError ? "email-error" : undefined}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={status === "loading" || !!fieldError}
              className="h-12 px-6 rounded-xl font-semibold text-sm text-white whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:bg-[#3a7de0] hover:shadow-lg hover:shadow-[#5194F6]/25"
              style={{ background: "linear-gradient(135deg,#5194F6,#3a7de0)", minWidth: "130px" }}
              aria-label="Subscribe"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Subscribing…
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </div>

          {/* Field-level validation error */}
          {fieldError && (
            <div
              id="email-error"
              className="flex items-center justify-center gap-1.5 mt-2 text-xs text-red-400"
              role="alert"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{fieldError}</span>
            </div>
          )}

          {/* Server-level error / duplicate */}
          {(status === "error" || status === "duplicate") && serverMessage && (
            <div
              className="flex items-center justify-center gap-1.5 mt-2 text-xs"
              style={{ color: status === "duplicate" ? "#f59e0b" : "#ef4444" }}
              role="alert"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{serverMessage}</span>
            </div>
          )}

          {/* Social proof */}
          <p className={`text-xs mt-5 ${subTextCls}`}>
            🔒 No spam, ever. Join 50,000+ investors getting daily market insights.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Subscribeview;