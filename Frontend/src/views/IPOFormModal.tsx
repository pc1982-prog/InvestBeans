import React, { useState } from "react";
import { X, Plus, Edit3, Save, Loader2, Star } from "lucide-react";
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

  const inp = "w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/60 transition-colors";
  const lbl = "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5";
  const err = "text-red-500 text-xs mt-1";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl border border-border w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-navy to-accent p-5 flex items-center justify-between z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              {initial ? <Edit3 className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {initial ? "IPO Edit Karein" : "Naya IPO Add Karein"}
              </h2>
              <p className="text-white/60 text-xs">Sab * fields required hain</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* ── Company Info ── */}
          <div className="p-4 bg-accent/5 rounded-xl border border-accent/10">
            <p className="text-xs font-bold text-accent uppercase tracking-wider mb-3">Company Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={lbl}>Company Name *</label>
                <input className={inp} placeholder="e.g. Tata Technologies Ltd"
                  value={form.companyName}
                  onChange={(e) => set("companyName", e.target.value)} />
                {errors.companyName && <p className={err}>{errors.companyName}</p>}
              </div>
              <div>
                <label className={lbl}>Logo Text (2 chars)</label>
                <input className={inp} placeholder="e.g. TT" maxLength={2}
                  value={form.logo}
                  onChange={(e) => set("logo", e.target.value.toUpperCase())} />
                <p className="text-xs text-muted-foreground mt-1">Auto-generate hoga company name se</p>
              </div>
              <div>
                <label className={lbl}>Industry</label>
                <select className={inp} value={form.industry} onChange={(e) => set("industry", e.target.value)}>
                  <option value="">-- Industry select karein --</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ── Status & Classification ── */}
          <div className="p-4 bg-accent/5 rounded-xl border border-accent/10">
            <p className="text-xs font-bold text-accent uppercase tracking-wider mb-3">Classification</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className={lbl}>Status *</label>
                <select className={inp} value={form.status} onChange={(e) => set("status", e.target.value as IPOStatus)}>
                  <option value="upcoming">Upcoming</option>
                  <option value="open">Open Now</option>
                  <option value="closed">Closed</option>
                  <option value="listed">Listed</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Exchange</label>
                <select className={inp} value={form.exchange} onChange={(e) => set("exchange", e.target.value as ExchangeType)}>
                  <option>NSE / BSE</option>
                  <option>NSE</option>
                  <option>BSE</option>
                  <option>NSE SME</option>
                  <option>BSE SME</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Category</label>
                <select className={inp} value={form.category} onChange={(e) => set("category", e.target.value)}>
                  <option>Mainboard</option>
                  <option>SME</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Pricing ── */}
          <div className="p-4 bg-accent/5 rounded-xl border border-accent/10">
            <p className="text-xs font-bold text-accent uppercase tracking-wider mb-3">Pricing & Size</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={lbl}>Price Band *</label>
                <input className={inp} placeholder="₹475 – ₹500"
                  value={form.priceRange}
                  onChange={(e) => set("priceRange", e.target.value)} />
                {errors.priceRange && <p className={err}>{errors.priceRange}</p>}
              </div>
              <div>
                <label className={lbl}>Lot Size (shares) *</label>
                <input type="number" className={inp} placeholder="30"
                  value={form.lotSize || ""}
                  onChange={(e) => set("lotSize", parseInt(e.target.value) || 0)} />
                {errors.lotSize && <p className={err}>{errors.lotSize}</p>}
              </div>
              <div>
                <label className={lbl}>Min Investment *</label>
                <input className={inp} placeholder="₹15,000"
                  value={form.minInvestment}
                  onChange={(e) => set("minInvestment", e.target.value)} />
                {errors.minInvestment && <p className={err}>{errors.minInvestment}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Issue Size *</label>
                <input className={inp} placeholder="₹3,042 Cr"
                  value={form.issueSize}
                  onChange={(e) => set("issueSize", e.target.value)} />
                {errors.issueSize && <p className={err}>{errors.issueSize}</p>}
              </div>
              <div>
                <label className={lbl}>Rating (1–5)</label>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => set("rating", n)}
                      className="p-0.5 transition-transform hover:scale-110">
                      <Star className={`w-6 h-6 ${n <= form.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Dates ── */}
          <div className="p-4 bg-accent/5 rounded-xl border border-accent/10">
            <p className="text-xs font-bold text-accent uppercase tracking-wider mb-3">Important Dates</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: "openDate",      label: "Open Date *",            placeholder: "e.g. Jan 29, 2026" },
                { key: "closeDate",     label: "Close Date *",           placeholder: "e.g. Feb 02, 2026" },
                { key: "allotmentDate", label: "Allotment Date",         placeholder: "e.g. Feb 05, 2026" },
                { key: "refundDate",    label: "Refund / UPI Date",      placeholder: "e.g. Feb 06, 2026" },
                { key: "listingDate",   label: "Listing Date",           placeholder: "e.g. Feb 07, 2026" },
              ].map(({ key, label: l, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs text-muted-foreground mb-1">{l}</label>
                  <input className={inp} placeholder={placeholder}
                    value={(form as any)[key] || ""}
                    onChange={(e) => set(key as any, e.target.value)} />
                  {errors[key] && <p className={err}>{errors[key]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* ── Performance (optional) ── */}
          <div className="p-4 bg-accent/5 rounded-xl border border-accent/10">
            <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">Performance Data</p>
            <p className="text-xs text-muted-foreground mb-3">Optional — baad mein bhi update kar sakte ho</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Subscription Status</label>
                <input className={inp} placeholder="e.g. 69.43× ya 12.5× (Day 1)"
                  value={form.subscriptionStatus || ""}
                  onChange={(e) => set("subscriptionStatus", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">GMP (₹)</label>
                <input type="number" className={inp} placeholder="e.g. 650"
                  value={form.gmp ?? ""}
                  onChange={(e) => set("gmp", e.target.value !== "" ? Number(e.target.value) : null)} />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Listing Gain (%)</label>
                <input type="number" className={inp} placeholder="e.g. 140 ya -12"
                  value={form.listingGain ?? ""}
                  onChange={(e) => set("listingGain", e.target.value !== "" ? Number(e.target.value) : null)} />
              </div>
            </div>
          </div>

          {/* ── RHP Link ── */}
          <div>
            <label className={lbl}>RHP / DRHP Link (optional)</label>
            <input className={inp} placeholder="https://sebi.gov.in/..."
              value={form.rhpLink || ""}
              onChange={(e) => set("rhpLink", e.target.value)} />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex gap-3 rounded-b-2xl">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 text-sm font-semibold transition-all">
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-accent to-accent/80 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
              : <><Save className="w-4 h-4" />{initial ? "Changes Save Karein" : "IPO Add Karein"}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}