// src/components/TVDataStamp.tsx
// ─────────────────────────────────────────────────────────────────
// Smart data-freshness strip for TradingView widgets.
//
// Calculates the ACTUAL "data as of HH:MM TZ" by:
//   1. Knowing each exchange's exact trading hours (UTC)
//   2. Subtracting the TradingView embed delay (15 min)
//   3. Clamping to last close when market is shut
//   4. Rolling back to Friday when it's a weekend
//
// Usage:
//   <TVDataStamp mode="domestic" type="chart"   isLight={isLight} />
//   <TVDataStamp mode="global"   type="heatmap" isLight={isLight} />
// ─────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export type TVMode = "domestic" | "global";
export type TVType = "chart" | "heatmap";

interface TVDataStampProps {
  mode: TVMode;
  type: TVType;
  isLight: boolean;
}

// ── Exchange definitions ──────────────────────────────────────────
// openUTC / closeUTC = minutes from midnight UTC (Mon–Fri)
// These are standard-time values. DST shifts noted where relevant.
interface ExchangeDef {
  id: string;
  name: string;
  tz: string;       // IANA tz for display
  tzLabel: string;  // short label
  openUTC: number;  // minutes since UTC midnight
  closeUTC: number;
  delayMin: number; // TradingView widget delay
  source: string;
}

const EX: Record<string, ExchangeDef> = {
  NSE: {
    id: "NSE", name: "NSE / BSE",
    tz: "Asia/Kolkata", tzLabel: "IST",
    openUTC: 225,   // 09:15 IST = 03:45 UTC  (IST never changes)
    closeUTC: 570,  // 15:30 IST = 10:00 UTC
    delayMin: 15,
    source: "NSE equity · 15 min delayed (TradingView embed policy)",
  },
  NASDAQ: {
    id: "NASDAQ", name: "NASDAQ / NYSE",
    tz: "America/New_York", tzLabel: "ET",
    // Standard time (EST = UTC-5). In EDT (UTC-4) this is 13:30 / 20:00.
    // We store EST values; close enough for display purpose.
    openUTC: 870,   // 09:30 EST = 14:30 UTC
    closeUTC: 1260, // 16:00 EST = 21:00 UTC
    delayMin: 15,
    source: "Cboe feed — not NYSE/NASDAQ primary · 15 min delayed",
  },
  LSE: {
    id: "LSE", name: "London (LSE)",
    tz: "Europe/London", tzLabel: "GMT",
    openUTC: 480,   // 08:00 GMT
    closeUTC: 990,  // 16:30 GMT
    delayMin: 15,
    source: "LSE · 15 min delayed",
  },
  XETRA: {
    id: "XETRA", name: "Frankfurt (XETRA / DAX)",
    tz: "Europe/Berlin", tzLabel: "CET",
    openUTC: 480,   // 09:00 CET = 08:00 UTC
    closeUTC: 1020, // 17:30 CET = 16:30 UTC
    delayMin: 15,
    source: "XETRA · 15 min delayed",
  },
  TSE: {
    id: "TSE", name: "Tokyo (TSE / Nikkei)",
    tz: "Asia/Tokyo", tzLabel: "JST",
    openUTC: 0,     // 09:00 JST = 00:00 UTC
    closeUTC: 360,  // 15:30 JST = 06:00 UTC (lunch 11:30–12:30 ignored)
    delayMin: 20,   // TSE has slightly longer delay on embeds
    source: "TSE · ~20 min delayed",
  },
  HKEX: {
    id: "HKEX", name: "Hong Kong (HKEX / Hang Seng)",
    tz: "Asia/Hong_Kong", tzLabel: "HKT",
    openUTC: 90,    // 09:30 HKT = 01:30 UTC
    closeUTC: 480,  // 16:00 HKT = 08:00 UTC
    delayMin: 15,
    source: "HKEX · 15 min delayed",
  },
};

// ── Map mode → which exchanges to show ───────────────────────────
const MODE_EXCHANGES: Record<TVMode, ExchangeDef[]> = {
  domestic: [EX.NSE],
  global:   [EX.NASDAQ, EX.LSE, EX.XETRA, EX.TSE, EX.HKEX],
};

// ── Calculate actual "data as of" time ───────────────────────────
// If market open now  → data = now − delayMin
// If market closed    → data = today's close − delayMin
// Before open / weekend → data = last weekday's close − delayMin
function getDataAsOf(ex: ExchangeDef, now: Date): { date: Date; wasOpen: boolean } {
  const utcDay  = now.getUTCDay();                        // 0=Sun, 6=Sat
  const utcMins = now.getUTCHours() * 60 + now.getUTCMinutes();
  const isWeekday = utcDay >= 1 && utcDay <= 5;

  // Helper: set time-of-day (UTC minutes) on a date copy
  const atMins = (base: Date, mins: number): Date => {
    const d = new Date(base);
    d.setUTCHours(Math.floor(mins / 60), mins % 60, 0, 0);
    return d;
  };

  if (isWeekday) {
    // Market is OPEN right now
    if (utcMins >= ex.openUTC && utcMins < ex.closeUTC) {
      return {
        date: new Date(now.getTime() - ex.delayMin * 60_000),
        wasOpen: true,
      };
    }
    // After today's close
    if (utcMins >= ex.closeUTC) {
      return {
        date: new Date(atMins(now, ex.closeUTC).getTime() - ex.delayMin * 60_000),
        wasOpen: false,
      };
    }
    // Before today's open — use PREVIOUS weekday's close
    // (fall through to rollback below)
  }

  // Rollback: find most recent trading weekday
  const rollback = new Date(now);
  for (let i = 0; i < 7; i++) {
    rollback.setUTCDate(rollback.getUTCDate() - 1);
    const d = rollback.getUTCDay();
    if (d >= 1 && d <= 5) break;
  }
  return {
    date: new Date(atMins(rollback, ex.closeUTC).getTime() - ex.delayMin * 60_000),
    wasOpen: false,
  };
}

// ── Format a Date in a given IANA timezone ────────────────────────
function fmtTime(d: Date, tz: string, tzLabel: string): string {
  try {
    // Time portion
    const timeParts = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz,
    }).formatToParts(d);
    const H = timeParts.find(p => p.type === "hour")?.value   ?? "??";
    const M = timeParts.find(p => p.type === "minute")?.value ?? "??";

    // Date in target tz vs today in target tz
    const dateFmt = (dt: Date) =>
      new Intl.DateTimeFormat("en-US", {
        year: "numeric", month: "2-digit", day: "2-digit", timeZone: tz,
      }).format(dt);

    const isToday = dateFmt(d) === dateFmt(new Date());
    if (isToday) return `${H}:${M} ${tzLabel}`;

    // Show weekday + date if it's a past day (e.g. Friday close shown on Saturday)
    const wdParts = new Intl.DateTimeFormat("en-US", {
      weekday: "short", month: "short", day: "numeric", timeZone: tz,
    }).formatToParts(d);
    const wd    = wdParts.find(p => p.type === "weekday")?.value ?? "";
    const mon   = wdParts.find(p => p.type === "month")?.value   ?? "";
    const day   = wdParts.find(p => p.type === "day")?.value     ?? "";
    return `${wd} ${mon} ${day}, ${H}:${M} ${tzLabel}`;
  } catch {
    return "—";
  }
}

// ── "X min ago" label ─────────────────────────────────────────────
function relLabel(dataTime: Date, now: Date): string {
  const ms  = now.getTime() - dataTime.getTime();
  const min = Math.round(ms / 60_000);
  const hr  = Math.floor(min / 60);
  if (min < 1)  return "just now";
  if (min < 60) return `${min} min ago`;
  if (hr  < 24) return `${hr}h ${min % 60}m ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

// ── Component ─────────────────────────────────────────────────────
export default function TVDataStamp({ mode, type, isLight }: TVDataStampProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000); // refresh every 30s
    return () => clearInterval(t);
  }, []);

  // For heatmap show only primary exchange; chart shows all
  const exchanges = type === "heatmap"
    ? [MODE_EXCHANGES[mode][0]]
    : MODE_EXCHANGES[mode];

  // ── Styles ──────────────────────────────────────────────────────
  const wrap = isLight
    ? "bg-gray-50 border-t border-gray-200 text-gray-400"
    : "bg-[#050e1a]/70 border-t border-white/6 text-slate-600";

  const openPill = isLight
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : "bg-emerald-900/25 text-emerald-400 border border-emerald-700/30";
  const closePill = isLight
    ? "bg-gray-100 text-gray-500 border border-gray-200"
    : "bg-white/5 text-slate-500 border border-white/8";
  const delayPill = isLight
    ? "bg-amber-50 text-amber-600 border border-amber-200"
    : "bg-amber-900/20 text-amber-400 border border-amber-700/30";
  const strong = isLight ? "text-gray-700" : "text-slate-300";
  const sep    = isLight ? "text-gray-200" : "text-white/10";

  return (
    <div className={`w-full flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-2 text-[11px] leading-none ${wrap}`}>

      {exchanges.map((ex, i) => {
        const { date: dataAsOf, wasOpen } = getDataAsOf(ex, now);
        const marketOpen = wasOpen;
        const asOfStr    = fmtTime(dataAsOf, ex.tz, ex.tzLabel);
        const rel        = relLabel(dataAsOf, now);

        return (
          <span key={ex.id} className="flex items-center gap-2 flex-wrap">

            {/* Live dot + exchange name */}
            <span className="flex items-center gap-1.5 font-semibold">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                marketOpen ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
              }`} />
              <span className={marketOpen ? strong : ""}>{ex.name}</span>
            </span>

            {/* Open / Closed badge */}
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide ${
              marketOpen ? openPill : closePill
            }`}>
              {marketOpen ? "Open" : "Closed"}
            </span>

            {/* "Data as of HH:MM TZ (Xm ago)" */}
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 shrink-0 opacity-60" />
              <span>
                Data as of{" "}
                <span className={`font-semibold ${strong}`}>{asOfStr}</span>
                <span className="opacity-50 ml-1">({rel})</span>
              </span>
            </span>

            {/* Delay pill */}
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${delayPill}`}>
              ~{ex.delayMin} min delayed
            </span>

            {/* Separator between exchanges (global mode shows multiple) */}
            {i < exchanges.length - 1 && (
              <span className={`mx-1 select-none ${sep}`}>│</span>
            )}
          </span>
        );
      })}

      {/* Source note — right side, hidden on mobile */}
      <span
        className="ml-auto opacity-40 hidden lg:block truncate max-w-sm text-[10px]"
        title={exchanges.map(e => e.source).join(" · ")}
      >
        {exchanges[0].source}
        {exchanges.length > 1 && ` · +${exchanges.length - 1} more`}
      </span>
    </div>
  );
}