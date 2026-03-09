// ── Append this component to DomesticView.tsx ─────────────────────
// Place <IndiaMarketHours isLight={isLight} /> just before the closing
// </div></Layout> tags at the bottom of DomesticView.
//
// Also add this import at the top:
//   import { useState, useEffect } from "react";  (if not already)
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

// ── World Sessions relative to IST ────────────────────────────────
// All times shown in IST (UTC+5:30)
const WORLD_SESSIONS_IST = [
  {
    name: "Tokyo (TSE)",
    flag: "🇯🇵",
    session: "Asian",
    openIST:  "06:00",   // 9:00 JST = 5:30 AM IST
    closeIST: "12:30",   // 3:00 JST = 11:30 AM IST
    openUTC: 0, closeUTC: 360,
    color: "#e74c3c",
    note: "Nikkei 225",
  },
  {
    name: "Shanghai (SSE)",
    flag: "🇨🇳",
    session: "Asian",
    openIST: "07:00",    // 9:30 CST = 7:00 AM IST
    closeIST: "12:30",   // 3:00 CST = 12:30 PM IST
    openUTC: 90, closeUTC: 420,
    color: "#f39c12",
    note: "Shanghai Composite",
  },
  {
    name: "India (NSE/BSE)",
    flag: "🇮🇳",
    session: "Indian",
    openIST: "09:15",
    closeIST: "15:30",
    openUTC: 225, closeUTC: 570,
    color: "#27ae60",
    note: "Nifty 50 · Sensex",
  },
  {
    name: "Frankfurt (XETRA)",
    flag: "🇩🇪",
    session: "European",
    openIST: "13:30",    // 9:00 CET = 13:30 IST
    closeIST: "23:00",   // 17:30 CET = 23:00 IST
    openUTC: 480, closeUTC: 990,
    color: "#2980b9",
    note: "DAX 40",
  },
  {
    name: "London (LSE)",
    flag: "🇬🇧",
    session: "European",
    openIST: "13:30",    // 8:00 GMT = 13:30 IST
    closeIST: "22:00",   // 16:30 GMT = 22:00 IST
    openUTC: 480, closeUTC: 990,
    color: "#8e44ad",
    note: "FTSE 100",
  },
  {
    name: "NYSE / NASDAQ",
    flag: "🇺🇸",
    session: "US",
    openIST: "19:00",    // 9:30 EST = 19:00 IST
    closeIST: "01:30+",  // 4:00 EST = 01:30 IST next day
    openUTC: 870, closeUTC: 1260,
    color: "#2563eb",
    note: "Dow · S&P · Nasdaq",
  },
];

function getMarketStatus(openUTC: number, closeUTC: number): "open" | "pre" | "closed" {
  const now = new Date();
  const day = now.getUTCDay();
  if (day === 0 || day === 6) return "closed";
  const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
  if (mins >= openUTC && mins < closeUTC) return "open";
  if (mins >= openUTC - 30 && mins < openUTC) return "pre";
  return "closed";
}

function getCurrentISTTime(): string {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    timeZone: "Asia/Kolkata", hour12: false,
  });
}

export function IndiaMarketHours({ isLight }: { isLight: boolean }) {
  const [currentIST, setCurrentIST] = useState(getCurrentISTTime());
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentIST(getCurrentISTTime());
      setTick(n => n + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const cardBg    = isLight ? "bg-white border-gray-100" : "bg-[#0e2038] border-white/8";
  const headerBg  = isLight ? "bg-gray-50 border-gray-100" : "bg-white/5 border-white/8";
  const textPrim  = isLight ? "text-gray-900" : "text-slate-100";
  const textSec   = isLight ? "text-gray-500" : "text-slate-400";
  const textMute  = isLight ? "text-gray-400" : "text-slate-500";
  const divider   = isLight ? "divide-gray-50" : "divide-white/5";

  return (
    <section className="mb-12">
      {/* Section heading */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "#2D4A3512", border: "1px solid #2D4A3525" }}>
          <span className="text-base">🕐</span>
        </div>
        <h2 className={`text-xl font-extrabold tracking-tight ${textPrim}`}>World Markets — IST Schedule</h2>
        <div className={`flex-1 h-px ml-2 ${isLight ? "bg-gray-100" : "bg-white/10"}`} />
        {/* Live IST clock */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${
          isLight ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-emerald-900/20 border-emerald-700/30 text-emerald-400"
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {currentIST} IST
        </div>
      </div>

      <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
        {/* Table header */}
        <div className={`grid grid-cols-12 gap-0 px-5 py-3 border-b text-xs font-bold uppercase tracking-widest ${headerBg}`}>
          <div className="col-span-4">Market</div>
          <div className="col-span-2 text-center">Session</div>
          <div className="col-span-2 text-center">Open (IST)</div>
          <div className="col-span-2 text-center">Close (IST)</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {WORLD_SESSIONS_IST.map((m, i) => {
          const status = getMarketStatus(m.openUTC, m.closeUTC);
          const isOpen = status === "open";
          const isPre  = status === "pre";
          const rowBg  = isOpen
            ? (isLight ? "bg-emerald-50/40" : "bg-emerald-900/10")
            : isPre
            ? (isLight ? "bg-amber-50/30" : "bg-amber-900/10")
            : "";

          return (
            <div key={m.name}
              className={`grid grid-cols-12 gap-0 px-5 py-4 items-center transition-colors ${rowBg}
                ${i < WORLD_SESSIONS_IST.length - 1 ? (isLight ? "border-b border-gray-50" : "border-b border-white/5") : ""}`}>

              {/* Market name */}
              <div className="col-span-4 flex items-center gap-3">
                <span className="text-xl">{m.flag}</span>
                <div>
                  <p className={`text-sm font-extrabold ${textPrim}`}>{m.name}</p>
                  <p className={`text-[10px] ${textMute}`}>{m.note}</p>
                </div>
              </div>

              {/* Session */}
              <div className="col-span-2 text-center">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  m.session === "Indian"   ? "bg-green-50 text-green-700 border-green-200" :
                  m.session === "Asian"    ? "bg-red-50 text-red-700 border-red-200" :
                  m.session === "European" ? "bg-purple-50 text-purple-700 border-purple-200" :
                  "bg-blue-50 text-blue-700 border-blue-200"
                }`}>
                  {m.session}
                </span>
              </div>

              {/* Open IST */}
              <div className={`col-span-2 text-center text-sm font-mono font-bold ${textPrim}`}>
                {m.openIST}
              </div>

              {/* Close IST */}
              <div className={`col-span-2 text-center text-sm font-mono font-bold ${textPrim}`}>
                {m.closeIST}
              </div>

              {/* Status */}
              <div className="col-span-2 flex items-center justify-end gap-2">
                {/* Color bar */}
                <div className="w-1 h-8 rounded-full" style={{
                  background: isOpen ? m.color : isPre ? "#f59e0b" : isLight ? "#e5e7eb" : "rgba(255,255,255,0.08)",
                }} />
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                  isOpen ? "bg-emerald-100 text-emerald-700" :
                  isPre  ? "bg-amber-100 text-amber-700" :
                  isLight ? "bg-gray-100 text-gray-400" : "bg-white/5 text-slate-500"
                }`}>
                  {isOpen ? "● OPEN" : isPre ? "◐ PRE" : "○ CLOSED"}
                </span>
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div className={`px-5 py-3 border-t text-[10px] flex flex-wrap items-center gap-4 ${
          isLight ? "border-gray-50 bg-gray-50 text-gray-400" : "border-white/5 bg-white/2 text-slate-600"
        }`}>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Open
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Pre-market (30 min window)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gray-300" /> Closed / Weekend
          </span>
          <span className="ml-auto">All times in IST (UTC+5:30) · Mon–Fri only · Updates every second</span>
        </div>
      </div>
    </section>
  );
}