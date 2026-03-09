import React, { useState } from "react";
import { X, Plus, Edit3, Save, Loader2, Star, Calculator } from "lucide-react";
import { useTheme } from "@/controllers/Themecontext";
import {
  IPO, IPOStatus, ExchangeType, EMPTY_FORM, INDUSTRIES, genLogo,
} from "./ipoApi";

interface Props {
  initial?: IPO;
  onSave: (data: Omit<IPO, "_id">) => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function toInputDate(s: string): string {
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function parseUpperPrice(pr: string): number | null {
  const clean = pr.replace(/₹/g, "").replace(/,/g, "");
  const parts  = clean.split(/[-–—]/);
  const v      = parseFloat(parts[parts.length - 1].trim());
  return isNaN(v) ? null : v;
}

function calcMin(priceRange: string, lotSize: number): string {
  const upper = parseUpperPrice(priceRange);
  if (!upper || !lotSize || lotSize < 1) return "";
  return `₹${(upper * lotSize).toLocaleString("en-IN")}`;
}

/* ─────────────────────────────────────────────────────────────────────────── */
export default function IPOFormModal({ initial, onSave, onClose, loading }: Props) {
  const { theme } = useTheme();
  const isDark = theme !== "light";

  const [form, setForm] = useState<Omit<IPO, "_id">>(
    initial ? { ...initial } : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* auto-calc minInvestment whenever priceRange or lotSize changes */
  const set = (key: keyof Omit<IPO, "_id">, value: any) =>
    setForm(prev => {
      const next: Omit<IPO, "_id"> = {
        ...prev,
        [key]: value,
        ...(key === "companyName" && !initial ? { logo: genLogo(value) } : {}),
      };
      const pr  = key === "priceRange" ? value : next.priceRange;
      const lot = key === "lotSize"    ? value : next.lotSize;
      const auto = calcMin(pr, Number(lot));
      if ((key === "priceRange" || key === "lotSize") && auto) {
        next.minInvestment = auto;
      }
      return next;
    });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.companyName.trim())   e.companyName   = "Company name zaroori hai";
    if (!form.openDate.trim())      e.openDate      = "Open date zaroori hai";
    if (!form.closeDate.trim())     e.closeDate     = "Close date zaroori hai";
    if (!form.priceRange.trim())    e.priceRange    = "Price range zaroori hai";
    if (!form.issueSize.trim())     e.issueSize     = "Issue size zaroori hai";
    if (!form.minInvestment.trim()) e.minInvestment = "Min investment zaroori hai";
    if (!form.lotSize || form.lotSize <= 0) e.lotSize = "Valid lot size daalo";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSave({ ...form, logo: form.logo || genLogo(form.companyName) });
  };

  /* ── design tokens ── */
  const modalBg     = isDark ? "#0f1e38"          : "#f0f7fe";
  const modalBorder = isDark ? "rgba(255,255,255,0.10)" : "rgba(13,37,64,0.12)";
  const blockBg     = isDark ? "rgba(212,168,67,0.05)" : "rgba(212,168,67,0.06)";
  const blockBdr    = isDark ? "rgba(212,168,67,0.12)" : "rgba(212,168,67,0.18)";
  const blockLabel  = isDark ? "#C4941E"           : "#b45309";
  const footerBg    = isDark ? "#0f1e38"           : "#f0f7fe";
  const footerBdr   = isDark ? "rgba(255,255,255,0.10)" : "rgba(13,37,64,0.10)";

  /* input */
  const inputBg  = isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.90)";
  const inputBdr = isDark ? "rgba(255,255,255,0.12)" : "rgba(13,37,64,0.18)";
  const inputTxt = isDark ? "#ffffff"              : "#0d1b2a";
  const phTxt    = isDark ? "#64748b"              : "#94a3b8";
  const focusBdr = "rgba(212,168,67,0.55)";

  /* ── IMPORTANT: select/option always use solid backgrounds so text is black ── */
  const selBg    = isDark ? "#1a2d48" : "#ffffff";   // dark = navy, light = white
  const selTxt   = isDark ? "#ffffff" : "#0d1b2a";   // always readable

  const lblColor  = isDark ? "rgba(148,163,184,1)" : "rgba(13,37,64,0.55)";
  const hintColor = isDark ? "rgba(100,116,139,1)" : "rgba(13,37,64,0.40)";
  const errColor  = "#ef4444";
  const starOff   = isDark ? "rgb(209,213,219)"    : "rgba(13,37,64,0.20)";
  const cancelClr = isDark ? "rgba(148,163,184,1)" : "rgba(13,37,64,0.60)";
  const cancelBdr = isDark ? "rgba(255,255,255,0.12)" : "rgba(13,37,64,0.15)";

  const headerBg  = "linear-gradient(90deg,#0d2540,#C4941E)";

  /* shared class helpers */
  const inp = `w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors`;
  const inpSty = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: inputBg, border: `1px solid ${inputBdr}`, color: inputTxt,
    ...extra,
  });
  /* for <select>: override browser default with solid bg so text is always visible */
  const selSty: React.CSSProperties = {
    background: selBg, border: `1px solid ${inputBdr}`, color: selTxt,
    WebkitAppearance: "auto",
  };
  const optSty: React.CSSProperties = { background: selBg, color: selTxt };

  const lbl = "block text-xs font-semibold uppercase tracking-wider mb-1.5";
  const err = "text-xs mt-1";
  const dateSty: React.CSSProperties = {
    ...inpSty(), colorScheme: isDark ? "dark" : "light", outline: "none",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl"
        style={{ background: modalBg, border: `1px solid ${modalBorder}` }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          className="sticky top-0 p-5 flex items-center justify-between z-10 rounded-t-2xl"
          style={{ background: headerBg }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              {initial ? <Edit3 className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {initial ? "IPO Edit Karein" : "Naya IPO Add Karein"}
              </h2>
              <p className="text-white/60 text-xs">* fields required hain</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* ── Company Info ── */}
          <section className="p-4 rounded-xl space-y-4" style={{ background: blockBg, border: `1px solid ${blockBdr}` }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: blockLabel }}>Company Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={lbl} style={{ color: lblColor }}>Company Name *</label>
                <input className={inp} placeholder="e.g. Tata Technologies Ltd"
                  style={inpSty({ outline: "none" })}
                  value={form.companyName}
                  onChange={e => set("companyName", e.target.value)}
                />
                {errors.companyName && <p className={err} style={{ color: errColor }}>{errors.companyName}</p>}
              </div>

              <div>
                <label className={lbl} style={{ color: lblColor }}>Logo Text (2 chars)</label>
                <input className={inp} placeholder="e.g. TT" maxLength={2}
                  style={inpSty({ outline: "none" })}
                  value={form.logo}
                  onChange={e => set("logo", e.target.value.toUpperCase())}
                />
                <p className="text-xs mt-1" style={{ color: hintColor }}>Auto-generated from company name</p>
              </div>

              <div>
                <label className={lbl} style={{ color: lblColor }}>Industry</label>
                {/* solid bg fix so dropdown text is always readable */}
                <select className={inp} style={{ ...selSty, outline: "none", cursor: "pointer" }}
                  value={form.industry}
                  onChange={e => set("industry", e.target.value)}
                >
                  <option value="" style={optSty}>-- Industry select karein --</option>
                  {INDUSTRIES.map(i => (
                    <option key={i} value={i} style={optSty}>{i}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* ── Classification ── */}
          <section className="p-4 rounded-xl space-y-3" style={{ background: blockBg, border: `1px solid ${blockBdr}` }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: blockLabel }}>Classification</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className={lbl} style={{ color: lblColor }}>Status *</label>
                <select className={inp} style={{ ...selSty, outline: "none", cursor: "pointer" }}
                  value={form.status}
                  onChange={e => set("status", e.target.value as IPOStatus)}
                >
                  {/* "listed" removed */}
                  <option value="upcoming" style={optSty}>Upcoming</option>
                  <option value="open"     style={optSty}>Open Now</option>
                  <option value="closed"   style={optSty}>Closed</option>
                </select>
              </div>
              <div>
                <label className={lbl} style={{ color: lblColor }}>Exchange</label>
                <select className={inp} style={{ ...selSty, outline: "none", cursor: "pointer" }}
                  value={form.exchange}
                  onChange={e => set("exchange", e.target.value as ExchangeType)}
                >
                  {["NSE / BSE","NSE","BSE","NSE SME","BSE SME"].map(ex => (
                    <option key={ex} value={ex} style={optSty}>{ex}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl} style={{ color: lblColor }}>Category</label>
                <select className={inp} style={{ ...selSty, outline: "none", cursor: "pointer" }}
                  value={form.category}
                  onChange={e => set("category", e.target.value)}
                >
                  {["Mainboard","SME"].map(c => (
                    <option key={c} value={c} style={optSty}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* ── Pricing & Size ── */}
          <section className="p-4 rounded-xl space-y-3" style={{ background: blockBg, border: `1px solid ${blockBdr}` }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: blockLabel }}>Pricing & Size</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div>
                <label className={lbl} style={{ color: lblColor }}>Price Band *</label>
                <input className={inp} placeholder="₹475 – ₹500"
                  style={inpSty({ outline: "none" })}
                  value={form.priceRange}
                  onChange={e => set("priceRange", e.target.value)}
                />
                {errors.priceRange && <p className={err} style={{ color: errColor }}>{errors.priceRange}</p>}
              </div>

              <div>
                <label className={lbl} style={{ color: lblColor }}>Lot Size (shares) *</label>
                <input type="number" className={inp} placeholder="30" min={1}
                  style={inpSty({ outline: "none" })}
                  value={form.lotSize || ""}
                  onChange={e => set("lotSize", parseInt(e.target.value) || 0)}
                />
                {errors.lotSize && <p className={err} style={{ color: errColor }}>{errors.lotSize}</p>}
              </div>

              {/* Auto-calculated Min Investment */}
              <div>
                <label className={lbl} style={{ color: lblColor }}>
                  Min Investment *{" "}
                  <span style={{ color: "#C4941E", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>
                    <Calculator className="inline w-3 h-3 mr-0.5" />auto
                  </span>
                </label>
                <input className={inp} placeholder="Auto-calculated"
                  style={inpSty({
                    outline: "none",
                    ...(calcMin(form.priceRange, form.lotSize)
                      ? { borderColor: "rgba(212,168,67,0.55)", color: "#D4A843", fontWeight: 600 }
                      : {}),
                  })}
                  value={form.minInvestment}
                  onChange={e => set("minInvestment", e.target.value)}
                />
                {calcMin(form.priceRange, form.lotSize) && (
                  <p className="text-[10px] mt-1" style={{ color: "rgba(212,168,67,0.75)" }}>
                    = {form.lotSize} × ₹{parseUpperPrice(form.priceRange)?.toLocaleString("en-IN")} (upper band)
                  </p>
                )}
                {errors.minInvestment && <p className={err} style={{ color: errColor }}>{errors.minInvestment}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className={lbl} style={{ color: lblColor }}>Issue Size *</label>
                <input className={inp} placeholder="₹3,042 Cr"
                  style={inpSty({ outline: "none" })}
                  value={form.issueSize}
                  onChange={e => set("issueSize", e.target.value)}
                />
                {errors.issueSize && <p className={err} style={{ color: errColor }}>{errors.issueSize}</p>}
              </div>

              <div>
                <label className={lbl} style={{ color: lblColor }}>Rating (1–5)</label>
                <div className="flex items-center gap-1 mt-2">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => set("rating", n)}
                      className="p-0.5 transition-transform hover:scale-110">
                      <Star className="w-6 h-6" style={{
                        fill: n <= form.rating ? "#F59E0B" : "transparent",
                        color: n <= form.rating ? "#F59E0B" : starOff,
                      }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Important Dates — native date picker ── */}
          <section className="p-4 rounded-xl space-y-3" style={{ background: blockBg, border: `1px solid ${blockBdr}` }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: blockLabel }}>Important Dates</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: "openDate",      label: "Open Date *"       },
                { key: "closeDate",     label: "Close Date *"      },
                { key: "allotmentDate", label: "Allotment Date"    },
                { key: "refundDate",    label: "Refund / UPI Date" },
                { key: "listingDate",   label: "Listing Date"      },
              ].map(({ key, label: l }) => (
                <div key={key}>
                  <label className="block text-xs mb-1.5 font-semibold uppercase tracking-wider" style={{ color: lblColor }}>{l}</label>
                  <input
                    type="date"
                    className={inp}
                    style={dateSty}
                    value={toInputDate((form as any)[key] || "")}
                    onChange={e => set(key as any, e.target.value)}
                  />
                  {errors[key] && <p className={err} style={{ color: errColor }}>{errors[key]}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* ── Performance (optional) ── */}
          <section className="p-4 rounded-xl space-y-3" style={{ background: blockBg, border: `1px solid ${blockBdr}` }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: blockLabel }}>Performance Data</p>
              <p className="text-xs mt-0.5" style={{ color: hintColor }}>Optional — baad mein bhi update kar sakte ho</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: lblColor }}>Subscription Status</label>
                <input className={inp} placeholder="e.g. 69.43×"
                  style={inpSty({ outline: "none" })}
                  value={form.subscriptionStatus || ""}
                  onChange={e => set("subscriptionStatus", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: lblColor }}>GMP (₹)</label>
                <input type="number" className={inp} placeholder="e.g. 650"
                  style={inpSty({ outline: "none" })}
                  value={form.gmp ?? ""}
                  onChange={e => set("gmp", e.target.value !== "" ? Number(e.target.value) : null)}
                />
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: lblColor }}>Listing Gain (%)</label>
                <input type="number" className={inp} placeholder="e.g. 140 ya -12"
                  style={inpSty({ outline: "none" })}
                  value={form.listingGain ?? ""}
                  onChange={e => set("listingGain", e.target.value !== "" ? Number(e.target.value) : null)}
                />
              </div>
            </div>
          </section>

          {/* ── RHP Link ── */}
          <div>
            <label className={lbl} style={{ color: lblColor }}>RHP / DRHP Link (optional)</label>
            <input className={inp} placeholder="https://sebi.gov.in/..."
              style={inpSty({ outline: "none" })}
              value={form.rhpLink || ""}
              onChange={e => set("rhpLink", e.target.value)}
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="sticky bottom-0 p-4 flex gap-3 rounded-b-2xl"
          style={{ background: footerBg, borderTop: `1px solid ${footerBdr}` }}>
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ border: `1px solid ${cancelBdr}`, color: cancelClr, background: "transparent" }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 py-3 rounded-xl text-white text-sm font-bold transition-all flex items-center justify-center gap-2 hover:opacity-90 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg,#D4A843,#C4941E)", boxShadow: "0 4px 16px rgba(212,168,67,0.25)" }}>
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
              : <><Save className="w-4 h-4" />{initial ? "Changes Save Karein" : "IPO Add Karein"}</>}
          </button>
        </div>
      </div>
    </div>
  );
}