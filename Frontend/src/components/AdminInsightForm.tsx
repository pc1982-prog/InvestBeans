import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import api from "@/api/axios";

interface InsightData {
  _id?: string; title: string; description: string; investBeansInsight: string;
  sentiment: string; category: string; marketType: string;
  credits: { source: string; author?: string; url?: string };
}
interface AdminInsightFormProps {
  isOpen: boolean; onClose: () => void; onSuccess: () => void;
  editingInsight?: Partial<InsightData>;
}

const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "white",
};
const inputClass = "w-full px-4 py-3 text-sm rounded-xl placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all";

const AdminInsightForm = ({ isOpen, onClose, onSuccess, editingInsight }: AdminInsightFormProps) => {
  const empty = { title: "", description: "", investBeansInsight: "", creditSource: "", creditAuthor: "", creditUrl: "", sentiment: "neutral", category: "", marketType: "domestic" };
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-4xl rounded-2xl my-8 overflow-hidden shadow-2xl"
          style={{ background: "linear-gradient(160deg,#0d1e36 0%,#0c1a2e 100%)", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 25px 60px rgba(0,0,0,0.6)" }}>
          {/* Gold top line */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg,transparent,rgba(212,168,67,0.55),transparent)" }} />

          {/* Header */}
          <div className="sticky top-0 z-10 px-6 py-5"
            style={{ background: "rgba(13,30,54,0.97)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{editingInsight ? "Edit Insight" : "Create New Insight"}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Fill in the details below</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[calc(100vh-180px)] overflow-y-auto">
            {error && (
              <div className="p-4 rounded-xl text-sm text-rose-300" style={{ background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.2)" }}>
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <Label className="text-sm font-semibold text-slate-300 mb-2 block">Title <span className="text-[#D4A843]">*</span></Label>
              <input value={formData.title} onChange={e => set("title", e.target.value)} placeholder="Enter insight title"
                required maxLength={200} className={inputClass} style={{ ...inputStyle, height: 48 }} />
            </div>

            {/* Description */}
            <div>
              <Label className="text-sm font-semibold text-slate-300 mb-2 block">Description <span className="text-[#D4A843]">*</span></Label>
              <textarea value={formData.description} onChange={e => set("description", e.target.value)}
                placeholder="Brief description (shown on card preview)" required maxLength={1000} rows={5}
                className={`${inputClass} resize-none`} style={inputStyle} />
              <p className="text-xs text-slate-500 mt-1 text-right">{formData.description.length}/1000</p>
            </div>

            {/* Insight */}
            <div>
              <Label className="text-sm font-semibold text-slate-300 mb-2 block">InvestBeans Insight <span className="text-[#D4A843]">*</span></Label>
              <textarea value={formData.investBeansInsight} onChange={e => set("investBeansInsight", e.target.value)}
                placeholder="Your expert analysis" required maxLength={2000} rows={4}
                className={`${inputClass} resize-none`} style={inputStyle} />
              <p className="text-xs text-slate-500 mt-1 text-right">{formData.investBeansInsight.length}/2000</p>
            </div>

            {/* Credits */}
            <div className="p-5 rounded-xl space-y-4"
              style={{ background: "rgba(212,168,67,0.04)", border: "1px solid rgba(212,168,67,0.13)" }}>
              <h3 className="text-sm font-semibold text-[#D4A843] flex items-center gap-2">
                <span className="w-1 h-4 rounded-full inline-block" style={{ background: "#D4A843" }} />Credits & Source
              </h3>
              <div>
                <Label className="text-sm text-slate-300 mb-2 block">Source <span className="text-[#D4A843]">*</span></Label>
                <input value={formData.creditSource} onChange={e => set("creditSource", e.target.value)}
                  placeholder="e.g. Bloomberg, Reuters" required className={inputClass} style={{ ...inputStyle, height: 48 }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-slate-400 mb-2 block">Author (Optional)</Label>
                  <input value={formData.creditAuthor} onChange={e => set("creditAuthor", e.target.value)}
                    placeholder="Author name" className={inputClass} style={{ ...inputStyle, height: 48 }} />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-2 block">Source URL (Optional)</Label>
                  <input type="url" value={formData.creditUrl} onChange={e => set("creditUrl", e.target.value)}
                    placeholder="https://example.com" className={inputClass} style={{ ...inputStyle, height: 48 }} />
                </div>
              </div>
            </div>

            {/* Category / Market / Sentiment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Category", key: "category", type: "input", placeholder: "e.g. Technology" },
              ].map(f => (
                <div key={f.key}>
                  <Label className="text-sm font-semibold text-slate-300 mb-2 block">{f.label} <span className="text-[#D4A843]">*</span></Label>
                  <input value={(formData as any)[f.key]} onChange={e => set(f.key, e.target.value)}
                    placeholder={f.placeholder} required className={inputClass} style={{ ...inputStyle, height: 48 }} />
                </div>
              ))}
              <div>
                <Label className="text-sm font-semibold text-slate-300 mb-2 block">Market Type <span className="text-[#D4A843]">*</span></Label>
                <select value={formData.marketType} onChange={e => set("marketType", e.target.value)}
                  className={inputClass} style={{ ...inputStyle, height: 48 }}>
                  <option value="domestic" style={{ background: "#0d1e36" }}>Domestic</option>
                  <option value="global" style={{ background: "#0d1e36" }}>Global</option>
                </select>
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-300 mb-2 block">Sentiment <span className="text-[#D4A843]">*</span></Label>
                <select value={formData.sentiment} onChange={e => set("sentiment", e.target.value)}
                  className={inputClass} style={{ ...inputStyle, height: 48 }}>
                  <option value="positive" style={{ background: "#0d1e36" }}>Positive</option>
                  <option value="negative" style={{ background: "#0d1e36" }}>Negative</option>
                  <option value="neutral" style={{ background: "#0d1e36" }}>Neutral</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 sticky bottom-0 -mx-6 sm:-mx-8 px-6 sm:px-8 pb-4"
              style={{ background: "rgba(10,22,40,0.98)", borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: "8px" }}>
              <button type="button" onClick={onClose} disabled={loading}
                className="flex-1 h-12 rounded-xl text-sm font-semibold text-slate-300 transition-all disabled:opacity-50 hover:text-white"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 h-12 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg,#D4A843,#C4941E)", color: "#0c1a2e" }}>
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