import React, { useState } from "react";
import { X, Plus, Edit3, Save, Loader2, Star } from "lucide-react";
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

export default function IPOFormModal({ initial, onSave, onClose, loading }: Props) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [form, setForm] = useState<Omit<IPO, "_id">>(
    initial ? { ...initial } : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof Omit<IPO, "_id">, value: any) =>
    setForm((f) => ({
      ...f,
      [key]: value,
      ...(key === "companyName" && !initial ? { logo: genLogo(value) } : {}),
    }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.companyName.trim()) e.companyName = "Company name zaroori hai";
    if (!form.openDate.trim())    e.openDate    = "Open date zaroori hai";
    if (!form.closeDate.trim())   e.closeDate   = "Close date zaroori hai";
    if (!form.priceRange.trim())  e.priceRange  = "Price range zaroori hai";
    if (!form.issueSize.trim())   e.issueSize   = "Issue size zaroori hai";
    if (!form.lotSize || form.lotSize <= 0) e.lotSize = "Valid lot size daalo";
    if (!form.minInvestment.trim()) e.minInvestment = "Min investment zaroori hai";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSave({ ...form, logo: form.logo || genLogo(form.companyName) });
  };

  // ── Theme tokens ─────────────────────────────────────────────────────────

  // Backdrop & modal
  const backdropBg = "rgba(0,0,0,0.6)";
  const modalBg = isLight ? "#f0f7fe" : "var(--card, #0f1e38)";
  const modalBorder = isLight ? "1px solid rgba(13,37,64,0.12)" : "1px solid rgba(255,255,255,0.1)";
  const scrollbarStyle = isLight ? "scrollbar-light" : "";

  // Sticky header gradient
  const headerBg = isLight
    ? "linear-gradient(90deg,#1a3a5c,#C4941E)"
    : "linear-gradient(90deg,var(--navy,#0d2540),var(--accent,#C4941E))";

  // Input
  const inputBg = isLight
    ? "rgba(255,255,255,0.9)"
    : "var(--background, rgba(255,255,255,0.05))";
  const inputBorder = isLight
    ? "1px solid rgba(13,37,64,0.15)"
    : "1px solid rgba(255,255,255,0.1)";
  const inputColor = isLight ? "#0d1b2a" : "var(--foreground, white)";
  const inputFocus = isLight ? "rgba(212,168,67,0.35)" : "rgba(212,168,67,0.3)";

  const inp = `w-full rounded-lg px-3 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors`;
  const inpStyle = {
    background: inputBg,
    border: inputBorder,
    color: inputColor,
  };

  // Labels
  const lbl = "block text-xs font-semibold uppercase tracking-wider mb-1.5";
  const lblColor = isLight ? "rgba(13,37,64,0.55)" : "var(--muted-foreground, rgba(148,163,184,1))";

  // Error text
  const errColor = "rgba(239,68,68,1)";

  // Section block (grouped fields)
  const blockBg = isLight ? "rgba(212,168,67,0.06)" : "rgba(212,168,67,0.05)";
  const blockBorder = isLight ? "1px solid rgba(212,168,67,0.18)" : "1px solid rgba(212,168,67,0.10)";
  const blockLabelColor = isLight ? "#b45309" : "var(--accent, #C4941E)";

  // Footer
  const footerBg = isLight ? "#f0f7fe" : "var(--card, #0f1e38)";
  const footerBorder = isLight ? "1px solid rgba(13,37,64,0.1)" : "1px solid rgba(255,255,255,0.1)";

  // Cancel button
  const cancelBorder = isLight ? "1px solid rgba(13,37,64,0.15)" : "1px solid rgba(255,255,255,0.1)";
  const cancelColor = isLight ? "rgba(13,37,64,0.6)" : "var(--muted-foreground, rgba(148,163,184,1))";

  // Hint text
  const hintColor = isLight ? "rgba(13,37,64,0.4)" : "var(--muted-foreground, rgba(100,116,139,1))";

  // Option background (browser limitation — keep dark)
  const optionBg = isLight ? "white" : "#0d1e36";
  const optionColor = isLight ? "#0d1b2a" : "white";

  // Star colour
  const starOff = isLight ? "rgba(13,37,64,0.2)" : "rgb(209,213,219)";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: backdropBg, backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className={`rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl ${scrollbarStyle}`}
        style={{ background: modalBg, border: modalBorder }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Sticky header ── */}
        <div
          className="sticky top-0 p-5 flex items-center justify-between z-10 rounded-t-2xl"
          style={{ background: headerBg }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              {initial
                ? <Edit3 className="w-4 h-4 text-white" />
                : <Plus className="w-4 h-4 text-white" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {initial ? "IPO Edit Karein" : "Naya IPO Add Karein"}
              </h2>
              <p className="text-white/60 text-xs">Sab * fields required hain</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* ── Company Info ── */}
          <div className="p-4 rounded-xl space-y-4" style={{ background: blockBg, border: blockBorder }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: blockLabelColor }}>
              Company Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={lbl} style={{ color: lblColor }}>Company Name *</label>
                <input
                  className={inp} placeholder="e.g. Tata Technologies Ltd"
                  style={{ ...inpStyle, outline: "none" }}
                  value={form.companyName}
                  onChange={(e) => set("companyName", e.target.value)}
                />
                {errors.companyName && <p className="text-xs mt-1" style={{ color: errColor }}>{errors.companyName}</p>}
              </div>
              <div>
                <label className={lbl} style={{ color: lblColor }}>Logo Text (2 chars)</label>
                <input
                  className={inp} placeholder="e.g. TT" maxLength={2}
                  style={{ ...inpStyle, outline: "none" }}
                  value={form.logo}
                  onChange={(e) => set("logo", e.target.value.toUpperCase())}
                />
                <p className="text-xs mt-1" style={{ color: hintColor }}>Auto-generate hoga company name se</p>
              </div>
              <div>
                <label className={lbl} style={{ color: lblColor }}>Industry</label>
                <select
                  className={inp}
                  style={{ ...inpStyle, outline: "none" }}
                  value={form.industry}
                  onChange={(e) => set("industry", e.target.value)}
                >
                  <option value="" style={{ background: optionBg, color: optionColor }}>-- Industry select karein --</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i} style={{ background: optionBg, color: optionColor }}>{i}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Status & Classification ── */}
          <div className="p-4 rounded-xl space-y-3" style={{ background: blockBg, border: blockBorder }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: blockLabelColor }}>
              Classification
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className={lbl} style={{ color: lblColor }}>Status *</label>
                <select
                  className={inp} style={{ ...inpStyle, outline: "none" }}
                  value={form.status}
                  onChange={(e) => set("status", e.target.value as IPOStatus)}
                >
                  {["upcoming","open","closed","listed"].map(s => (
                    <option key={s} value={s} style={{ background: optionBg, color: optionColor }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}{s === "open" ? " Now" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl} style={{ color: lblColor }}>Exchange</label>
                <select
                  className={inp} style={{ ...inpStyle, outline: "none" }}
                  value={form.exchange}
                  onChange={(e) => set("exchange", e.target.value as ExchangeType)}
                >
                  {["NSE / BSE","NSE","BSE","NSE SME","BSE SME"].map(e => (
                    <option key={e} value={e} style={{ background: optionBg, color: optionColor }}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl} style={{ color: lblColor }}>Category</label>
                <select
                  className={inp} style={{ ...inpStyle, outline: "none" }}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {["Mainboard","SME"].map(c => (
                    <option key={c} value={c} style={{ background: optionBg, color: optionColor }}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Pricing ── */}
          <div className="p-4 rounded-xl space-y-3" style={{ background: blockBg, border: blockBorder }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: blockLabelColor }}>
              Pricing & Size
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={lbl} style={{ color: lblColor }}>Price Band *</label>
                <input className={inp} placeholder="₹475 – ₹500"
                  style={{ ...inpStyle, outline: "none" }}
                  value={form.priceRange}
                  onChange={(e) => set("priceRange", e.target.value)} />
                {errors.priceRange && <p className="text-xs mt-1" style={{ color: errColor }}>{errors.priceRange}</p>}
              </div>
              <div>
                <label className={lbl} style={{ color: lblColor }}>Lot Size (shares) *</label>
                <input type="number" className={inp} placeholder="30"
                  style={{ ...inpStyle, outline: "none" }}
                  value={form.lotSize || ""}
                  onChange={(e) => set("lotSize", parseInt(e.target.value) || 0)} />
                {errors.lotSize && <p className="text-xs mt-1" style={{ color: errColor }}>{errors.lotSize}</p>}
              </div>
              <div>
                <label className={lbl} style={{ color: lblColor }}>Min Investment *</label>
                <input className={inp} placeholder="₹15,000"
                  style={{ ...inpStyle, outline: "none" }}
                  value={form.minInvestment}
                  onChange={(e) => set("minInvestment", e.target.value)} />
                {errors.minInvestment && <p className="text-xs mt-1" style={{ color: errColor }}>{errors.minInvestment}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={lbl} style={{ color: lblColor }}>Issue Size *</label>
                <input className={inp} placeholder="₹3,042 Cr"
                  style={{ ...inpStyle, outline: "none" }}
                  value={form.issueSize}
                  onChange={(e) => set("issueSize", e.target.value)} />
                {errors.issueSize && <p className="text-xs mt-1" style={{ color: errColor }}>{errors.issueSize}</p>}
              </div>
              <div>
                <label className={lbl} style={{ color: lblColor }}>Rating (1–5)</label>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => set("rating", n)}
                      className="p-0.5 transition-transform hover:scale-110">
                      <Star className="w-6 h-6"
                        style={{
                          fill: n <= form.rating ? "#F59E0B" : "transparent",
                          color: n <= form.rating ? "#F59E0B" : starOff,
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Dates ── */}
          <div className="p-4 rounded-xl space-y-3" style={{ background: blockBg, border: blockBorder }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: blockLabelColor }}>
              Important Dates
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: "openDate",      label: "Open Date *",         placeholder: "e.g. Jan 29, 2026" },
                { key: "closeDate",     label: "Close Date *",        placeholder: "e.g. Feb 02, 2026" },
                { key: "allotmentDate", label: "Allotment Date",      placeholder: "e.g. Feb 05, 2026" },
                { key: "refundDate",    label: "Refund / UPI Date",   placeholder: "e.g. Feb 06, 2026" },
                { key: "listingDate",   label: "Listing Date",        placeholder: "e.g. Feb 07, 2026" },
              ].map(({ key, label: l, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs mb-1" style={{ color: lblColor }}>{l}</label>
                  <input className={inp} placeholder={placeholder}
                    style={{ ...inpStyle, outline: "none" }}
                    value={(form as any)[key] || ""}
                    onChange={(e) => set(key as any, e.target.value)} />
                  {errors[key] && <p className="text-xs mt-1" style={{ color: errColor }}>{errors[key]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* ── Performance (optional) ── */}
          <div className="p-4 rounded-xl space-y-3" style={{ background: blockBg, border: blockBorder }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: blockLabelColor }}>
                Performance Data
              </p>
              <p className="text-xs mt-0.5" style={{ color: hintColor }}>
                Optional — baad mein bhi update kar sakte ho
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs mb-1" style={{ color: lblColor }}>Subscription Status</label>
                <input className={inp} placeholder="e.g. 69.43× ya 12.5×"
                  style={{ ...inpStyle, outline: "none" }}
                  value={form.subscriptionStatus || ""}
                  onChange={(e) => set("subscriptionStatus", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: lblColor }}>GMP (₹)</label>
                <input type="number" className={inp} placeholder="e.g. 650"
                  style={{ ...inpStyle, outline: "none" }}
                  value={form.gmp ?? ""}
                  onChange={(e) => set("gmp", e.target.value !== "" ? Number(e.target.value) : null)} />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: lblColor }}>Listing Gain (%)</label>
                <input type="number" className={inp} placeholder="e.g. 140 ya -12"
                  style={{ ...inpStyle, outline: "none" }}
                  value={form.listingGain ?? ""}
                  onChange={(e) => set("listingGain", e.target.value !== "" ? Number(e.target.value) : null)} />
              </div>
            </div>
          </div>

          {/* ── RHP Link ── */}
          <div>
            <label className={lbl} style={{ color: lblColor }}>RHP / DRHP Link (optional)</label>
            <input className={inp} placeholder="https://sebi.gov.in/..."
              style={{ ...inpStyle, outline: "none" }}
              value={form.rhpLink || ""}
              onChange={(e) => set("rhpLink", e.target.value)} />
          </div>
        </div>

        {/* ── Sticky footer ── */}
        <div
          className="sticky bottom-0 p-4 flex gap-3 rounded-b-2xl"
          style={{ background: footerBg, borderTop: footerBorder }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ border: cancelBorder, color: cancelColor, background: "transparent" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave} disabled={loading}
            className="flex-1 py-3 rounded-xl text-white text-sm font-bold transition-all flex items-center justify-center gap-2 hover:opacity-90 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg,#D4A843,#C4941E)", boxShadow: "0 4px 16px rgba(212,168,67,0.25)" }}
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
              : <><Save className="w-4 h-4" />{initial ? "Changes Save Karein" : "IPO Add Karein"}</>}
          </button>
        </div>
      </div>
    </div>
  );
}