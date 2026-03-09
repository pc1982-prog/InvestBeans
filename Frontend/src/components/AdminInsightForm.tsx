import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import api from "@/api/axios";
import { useTheme } from "@/controllers/Themecontext";

interface InsightData {
  _id?: string; title: string; description: string; investBeansInsight: string;
  sentiment: string; category: string; marketType: string;
  credits: { source: string; author?: string; url?: string };
}
interface AdminInsightFormProps {
  isOpen: boolean; onClose: () => void; onSuccess: () => void;
  editingInsight?: Partial<InsightData>;
}

const AdminInsightForm = ({ isOpen, onClose, onSuccess, editingInsight }: AdminInsightFormProps) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const empty = {
    title: "", description: "", investBeansInsight: "",
    creditSource: "", creditAuthor: "", creditUrl: "",
    sentiment: "neutral", category: "", marketType: "domestic",
  };
  const [formData, setFormData] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData(editingInsight ? {
      title: editingInsight.title || "", description: editingInsight.description || "",
      investBeansInsight: editingInsight.investBeansInsight || "",
      creditSource: editingInsight.credits?.source || "", creditAuthor: editingInsight.credits?.author || "",
      creditUrl: editingInsight.credits?.url || "", sentiment: editingInsight.sentiment || "neutral",
      category: editingInsight.category || "", marketType: editingInsight.marketType || "domestic",
    } : empty);
    setError("");
  }, [editingInsight, isOpen]);

  const set = (key: string, val: string) => setFormData(p => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      if (!formData.title.trim()) throw new Error("Title is required");
      if (!formData.description.trim()) throw new Error("Description is required");
      if (!formData.investBeansInsight.trim()) throw new Error("InvestBeans Insight is required");
      if (!formData.creditSource.trim()) throw new Error("Credit source is required");
      if (!formData.category.trim()) throw new Error("Category is required");
      const payload = {
        title: formData.title.trim(), description: formData.description.trim(),
        investBeansInsight: formData.investBeansInsight.trim(),
        credits: { source: formData.creditSource.trim(), author: formData.creditAuthor.trim(), url: formData.creditUrl.trim() },
        sentiment: formData.sentiment, category: formData.category.trim(), marketType: formData.marketType,
      };
      if (editingInsight) await api.put(`/insights/admin/${editingInsight._id}`, payload);
      else await api.post("/insights/admin/create", payload);
      onSuccess(); onClose();
    } catch (err: unknown) {
      let msg = "Failed to save insight.";
      if (err instanceof Error) msg = err.message;
      else if (err && typeof err === "object" && "response" in err) {
        const r = (err as any).response?.data?.message;
        if (r) msg = r;
      }
      setError(msg);
    } finally { setLoading(false); }
  };

  // ── Theme tokens ─────────────────────────────────────────────────────────
  const modalBg = isLight
    ? "linear-gradient(160deg,#f0f7fe 0%,#e8f2fd 100%)"
    : "linear-gradient(160deg,#0d1e36 0%,#0c1a2e 100%)";
  const modalBorder = isLight ? "1px solid rgba(13,37,64,0.12)" : "1px solid rgba(255,255,255,0.09)";
  const goldTopLine = "linear-gradient(90deg,transparent,rgba(212,168,67,0.55),transparent)";

  const headerBg = isLight ? "rgba(232,242,253,0.97)" : "rgba(13,30,54,0.97)";
  const headerBorder = isLight ? "1px solid rgba(13,37,64,0.08)" : "1px solid rgba(255,255,255,0.07)";
  const titleColor = isLight ? "#0d1b2a" : "white";
  const subTitleColor = isLight ? "rgba(13,37,64,0.45)" : "rgba(148,163,184,1)";
  const closeBtnBg = isLight ? "rgba(13,37,64,0.06)" : "rgba(255,255,255,0.05)";
  const closeBtnColor = isLight ? "rgba(13,37,64,0.45)" : "rgba(148,163,184,1)";

  const inputBg = isLight ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.05)";
  const inputBorder = isLight ? "1px solid rgba(13,37,64,0.15)" : "1px solid rgba(255,255,255,0.1)";
  const inputColor = isLight ? "#0d1b2a" : "white";
  const inputFocusRing = isLight ? "focus:ring-accent/40" : "focus:ring-accent/30";
  const inputStyle = { background: inputBg, border: inputBorder, color: inputColor };
  const inputClass = `w-full px-3 py-2 text-sm rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 ${inputFocusRing} transition-all`;

  const labelColor = isLight ? "rgba(13,37,64,0.75)" : "rgba(203,213,225,1)";
  const labelOptionalColor = isLight ? "rgba(13,37,64,0.45)" : "rgba(100,116,139,1)";

  // ✅ More compact credits block
  const creditBlockBg = isLight ? "rgba(212,168,67,0.06)" : "rgba(212,168,67,0.04)";
  const creditBlockBorder = isLight ? "1px solid rgba(212,168,67,0.2)" : "1px solid rgba(212,168,67,0.13)";

  const optionBg = "#0d1e36";

  const errorBg = isLight ? "rgba(251,113,133,0.06)" : "rgba(251,113,133,0.08)";
  const errorBorder = isLight ? "1px solid rgba(251,113,133,0.25)" : "1px solid rgba(251,113,133,0.2)";
  const errorColor = isLight ? "#be123c" : "rgba(251,113,133,1)";

  const footerBg = isLight ? "rgba(232,242,253,0.98)" : "rgba(10,22,40,0.98)";
  const footerBorder = isLight ? "1px solid rgba(13,37,64,0.08)" : "1px solid rgba(255,255,255,0.07)";

  const cancelBg = isLight ? "rgba(13,37,64,0.06)" : "rgba(255,255,255,0.04)";
  const cancelBorder = isLight ? "1px solid rgba(13,37,64,0.12)" : "1px solid rgba(255,255,255,0.1)";
  const cancelColor = isLight ? "rgba(13,37,64,0.65)" : "rgba(203,213,225,1)";

  const charCountColor = isLight ? "rgba(13,37,64,0.35)" : "rgba(100,116,139,1)";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto animate-fade-in"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
    >
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div
          className="relative w-full max-w-4xl rounded-2xl my-8 overflow-hidden shadow-2xl"
          style={{ background: modalBg, border: modalBorder, boxShadow: "0 25px 60px rgba(0,0,0,0.35)" }}
        >
          {/* Gold top line */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: goldTopLine }} />

          {/* ── HEADER ── */}
          <div
            className="sticky top-0 z-10 px-6 py-4"
            style={{ background: headerBg, borderBottom: headerBorder }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: titleColor }}>
                  {editingInsight ? "Edit Insight" : "Create New Insight"}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: subTitleColor }}>Fill in the details below</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors hover:opacity-80"
                style={{ background: closeBtnBg, color: closeBtnColor }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto">

            {/* Error banner */}
            {error && (
              <div className="p-3 rounded-xl text-sm" style={{ background: errorBg, border: errorBorder, color: errorColor }}>
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <Label className="text-xs font-semibold mb-1.5 block" style={{ color: labelColor }}>
                Title <span className="text-[#D4A843]">*</span>
              </Label>
              <input
                value={formData.title} onChange={e => set("title", e.target.value)}
                placeholder="Enter insight title" required maxLength={200}
                className={inputClass} style={{ ...inputStyle, height: 42 }}
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-xs font-semibold mb-1.5 block" style={{ color: labelColor }}>
                Description <span className="text-[#D4A843]">*</span>
              </Label>
              <textarea
                value={formData.description} onChange={e => set("description", e.target.value)}
                placeholder="Brief description (shown on card preview)" required maxLength={1000} rows={4}
                className={`${inputClass} resize-none`} style={inputStyle}
              />
              <p className="text-xs mt-0.5 text-right" style={{ color: charCountColor }}>
                {formData.description.length}/1000
              </p>
            </div>

            {/* InvestBeans Insight */}
            <div>
              <Label className="text-xs font-semibold mb-1.5 block" style={{ color: labelColor }}>
                InvestBeans Insight <span className="text-[#D4A843]">*</span>
              </Label>
              <textarea
                value={formData.investBeansInsight} onChange={e => set("investBeansInsight", e.target.value)}
                placeholder="Your expert analysis" required maxLength={2000} rows={3}
                className={`${inputClass} resize-none`} style={inputStyle}
              />
              <p className="text-xs mt-0.5 text-right" style={{ color: charCountColor }}>
                {formData.investBeansInsight.length}/2000
              </p>
            </div>

            {/* ✅ Compact Credits block — all 3 fields in one row on larger screens */}
            <div className="p-3.5 rounded-xl" style={{ background: creditBlockBg, border: creditBlockBorder }}>
              <h3 className="text-xs font-semibold text-[#D4A843] flex items-center gap-1.5 mb-3">
                <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: "#D4A843" }} />
                Credits & Source
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Source */}
                <div>
                  <Label className="text-xs mb-1 block" style={{ color: labelColor }}>
                    Source <span className="text-[#D4A843]">*</span>
                  </Label>
                  <input
                    value={formData.creditSource} onChange={e => set("creditSource", e.target.value)}
                    placeholder="e.g. Bloomberg" required
                    className={inputClass} style={{ ...inputStyle, height: 38 }}
                  />
                </div>
                {/* Author */}
                <div>
                  <Label className="text-xs mb-1 block" style={{ color: labelOptionalColor }}>Author (optional)</Label>
                  <input
                    value={formData.creditAuthor} onChange={e => set("creditAuthor", e.target.value)}
                    placeholder="Author name"
                    className={inputClass} style={{ ...inputStyle, height: 38 }}
                  />
                </div>
                {/* URL */}
                <div>
                  <Label className="text-xs mb-1 block" style={{ color: labelOptionalColor }}>URL (optional)</Label>
                  <input
                    type="url" value={formData.creditUrl} onChange={e => set("creditUrl", e.target.value)}
                    placeholder="https://example.com"
                    className={inputClass} style={{ ...inputStyle, height: 38 }}
                  />
                </div>
              </div>
            </div>

            {/* Category / Market / Sentiment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Category */}
              <div>
                <Label className="text-xs font-semibold mb-1.5 block" style={{ color: labelColor }}>
                  Category <span className="text-[#D4A843]">*</span>
                </Label>
                <input
                  value={formData.category} onChange={e => set("category", e.target.value)}
                  placeholder="e.g. Technology" required
                  className={inputClass} style={{ ...inputStyle, height: 42 }}
                />
              </div>

              {/* Market Type — ✅ Commodities added */}
              <div>
                <Label className="text-xs font-semibold mb-1.5 block" style={{ color: labelColor }}>
                  Market Type <span className="text-[#D4A843]">*</span>
                </Label>
                <select
                  value={formData.marketType} onChange={e => set("marketType", e.target.value)}
                  className={inputClass} style={{ ...inputStyle, height: 42 }}
                >
                  <option value="domestic" style={{ background: optionBg }}>Domestic</option>
                  <option value="global" style={{ background: optionBg }}>Global</option>
                  <option value="commodities" style={{ background: optionBg }}>Commodities</option>
                </select>
              </div>

              {/* Sentiment */}
              <div>
                <Label className="text-xs font-semibold mb-1.5 block" style={{ color: labelColor }}>
                  Sentiment <span className="text-[#D4A843]">*</span>
                </Label>
                <select
                  value={formData.sentiment} onChange={e => set("sentiment", e.target.value)}
                  className={inputClass} style={{ ...inputStyle, height: 42 }}
                >
                  <option value="positive" style={{ background: optionBg }}>Positive</option>
                  <option value="negative" style={{ background: optionBg }}>Negative</option>
                  <option value="neutral" style={{ background: optionBg }}>Neutral</option>
                </select>
              </div>
            </div>

            {/* ── FOOTER ACTIONS ── */}
            <div
              className="flex gap-3 pt-3 sticky bottom-0 -mx-5 sm:-mx-6 px-5 sm:px-6 pb-4"
              style={{ background: footerBg, borderTop: footerBorder, marginTop: "8px" }}
            >
              <button
                type="button" onClick={onClose} disabled={loading}
                className="flex-1 h-11 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-80"
                style={{ background: cancelBg, border: cancelBorder, color: cancelColor }}
              >
                Cancel
              </button>
              <button
                type="submit" disabled={loading}
                className="flex-1 h-11 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg,#D4A843,#C4941E)", color: "#0c1a2e" }}
              >
                {loading ? "Saving..." : editingInsight ? "Update Insight" : "Create Insight"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminInsightForm;