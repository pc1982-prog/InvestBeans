import React, { useEffect, useState, useRef } from "react";

interface TVDataStampProps {
  mode: "domestic" | "global";
  type: "chart" | "heatmap";
  isLight: boolean;
}

const TVDataStamp: React.FC<TVDataStampProps> = ({ mode, type, isLight }) => {
  const [time, setTime] = useState<string>("");
  const [pulse, setPulse] = useState(true);
  const pulseRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: mode === "domestic" ? "Asia/Kolkata" : "America/New_York",
    };
    return now.toLocaleTimeString("en-IN", options);
  };

  useEffect(() => {
    setTime(formatTime());
    const interval = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(interval);
  }, [mode]);

  useEffect(() => {
    pulseRef.current = setInterval(() => setPulse((p) => !p), 1000);
    return () => {
      if (pulseRef.current) clearInterval(pulseRef.current);
    };
  }, []);

  const timezone = mode === "domestic" ? "IST" : "EST";
  const exchange = mode === "domestic" ? "NSE / BSE" : "NASDAQ / NYSE";
  const label = type === "chart" ? "Live Chart" : "Live Heatmap";

  const bg = isLight ? "rgba(255,255,255,0.95)" : "rgba(10,15,30,0.9)";
  const borderTop = isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.07)";
  const textPrimary = isLight ? "#0d1b2a" : "#e2e8f0";
  const textMuted = isLight ? "rgba(13,27,42,0.5)" : "rgba(200,210,225,0.45)";
  const tagBg = isLight ? "rgba(37,99,235,0.06)" : "rgba(37,99,235,0.08)";
  const tagBorder = isLight ? "1px solid rgba(37,99,235,0.15)" : "1px solid rgba(37,99,235,0.18)";

  return (
    <>
      <style>{`
        .tvstamp-desktop { display: flex; }
        .tvstamp-desktop-inline { display: inline; }
        @media (max-width: 640px) {
          .tvstamp-desktop { display: none !important; }
          .tvstamp-desktop-inline { display: none !important; }
        }
      `}</style>

      <div
        style={{
          background: bg,
          borderTop,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          minHeight: 40,
          flexWrap: "nowrap",
          overflow: "hidden",
        }}
      >
        {/* ── LEFT: Live dot + label (+ exchange on desktop) ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, overflow: "hidden" }}>
          {/* Pulsing green dot */}
          <div style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
            <span
              style={{
                position: "absolute",
                inset: -3,
                borderRadius: "50%",
                background: "rgba(34,197,94,0.25)",
                transform: pulse ? "scale(1.6)" : "scale(1)",
                transition: "transform 0.5s ease",
              }}
            />
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 5px 1px rgba(34,197,94,0.5)",
              }}
            />
          </div>

          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#22c55e", flexShrink: 0 }}>
            LIVE
          </span>

          {/* Divider + label + exchange — desktop only */}
          <span
            className="tvstamp-desktop"
            style={{ width: 1, height: 14, background: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.12)", flexShrink: 0 }}
          />
          <span
            className="tvstamp-desktop"
            style={{ fontSize: 12, fontWeight: 600, color: textPrimary, whiteSpace: "nowrap", flexShrink: 0 }}
          >
            {label}
          </span>
          <span
            className="tvstamp-desktop"
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: isLight ? "#0A3656" : "#9bc1da",
              background: tagBg,
              border: tagBorder,
              borderRadius: 99,
              padding: "2px 8px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {exchange}
          </span>
        </div>

        {/* ── RIGHT: Clock (+ Powered by on desktop) ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* Clock pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: isLight ? "rgba(13,37,64,0.05)" : "rgba(255,255,255,0.05)",
              border: isLight ? "1px solid rgba(13,37,64,0.08)" : "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: "3px 8px",
              flexShrink: 0,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: textPrimary,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "0.03em",
                whiteSpace: "nowrap",
              }}
            >
              {time}
            </span>
            <span style={{ fontSize: 10, color: textMuted, fontWeight: 500, whiteSpace: "nowrap" }}>
              {timezone}
            </span>
          </div>

          {/* Powered by TradingView — desktop only */}
          <span
            className="tvstamp-desktop"
            style={{ fontSize: 10, color: textMuted, whiteSpace: "nowrap", alignItems: "center" }}
          >
            Powered by{" "}
            <a
              href="https://www.tradingview.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 600, marginLeft: 3 }}
            >
              TradingView
            </a>
          </span>
        </div>
      </div>
    </>
  );
};

export default TVDataStamp;