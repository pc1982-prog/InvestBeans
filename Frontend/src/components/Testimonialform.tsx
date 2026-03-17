"use client";

import { useState, useEffect } from "react";
import { X, Star, Loader2 } from "lucide-react";
import { useTheme } from "@/controllers/Themecontext";
import { createTestimonial, updateTestimonial, Testimonial } from "@/services/Testimonialservice";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (t: Testimonial) => void;
    existing?: Testimonial | null; // if set → edit mode
}

const TAGS = [
    "General", "Equity Research", "Portfolio Growth", "Fintech",
    "FX Hedging", "Institutional", "Financial Planning", "Trading",
];

function StarPicker({
    value, onChange, isLight,
}: { value: number; onChange: (v: number) => void; isLight: boolean }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div style={{ display: "flex", gap: "6px" }}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    size={24}
                    onClick={() => onChange(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(0)}
                    style={{
                        cursor: "pointer",
                        fill: i <= (hovered || value) ? "#F59E0B" : "transparent",
                        color: i <= (hovered || value) ? "#F59E0B" : isLight ? "rgba(13,37,64,0.2)" : "rgba(255,255,255,0.2)",
                        transition: "all 0.15s",
                    }}
                />
            ))}
        </div>
    );
}

export default function TestimonialForm({ isOpen, onClose, onSuccess, existing }: Props) {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const isEdit = !!existing;

    const [form, setForm] = useState({
        name: "", role: "", company: "",
        rating: 5, preview: "", fullText: "", tag: "General", source: "InvestBeans",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pre-fill when editing
    useEffect(() => {
        if (existing) {
            setForm({
                name: existing.name,
                role: existing.role || "",
                company: existing.company || "",
                rating: existing.rating,
                preview: existing.preview,
                fullText: existing.fullText,
                tag: existing.tag || "General",
                source: existing.source || "InvestBeans",
            });
        } else {
            setForm({ name: "", role: "", company: "", rating: 5, preview: "", fullText: "", tag: "General", source: "InvestBeans" });
        }
        setError(null);
    }, [existing, isOpen]);

    if (!isOpen) return null;

    const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.preview.trim() || !form.fullText.trim()) {
            setError("Name, short preview, and full review are required.");
            return;
        }
        try {
            setLoading(true);
            setError(null);
            let result: Testimonial;
            if (isEdit && existing) {
                result = await updateTestimonial(existing._id, form);
            } else {
                result = await createTestimonial(form);
            }
            onSuccess(result);
            onClose();
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ── Theme tokens ─────────────────────────────────────────────────────────
    const overlayBg = "rgba(0,0,0,0.6)";
    const modalBg = isLight ? "#fff" : "#101528";
    const modalBorder = isLight ? "1px solid rgba(13,37,64,0.12)" : "1px solid #1C3656";
    const labelColor = isLight ? "rgba(13,37,64,0.65)" : "rgba(203,213,225,1)";
    const inputBg = isLight ? "rgba(13,37,64,0.04)" : "rgba(28,54,86,0.40)";
    const inputBorder = isLight ? "1px solid rgba(13,37,64,0.15)" : "1px solid #1C3656";
    const inputColor = isLight ? "#0d1b2a" : "#E8EDF5";
    const titleColor = isLight ? "#0d1b2a" : "white";
    const errorBg = isLight ? "rgba(220,38,38,0.07)" : "rgba(220,38,38,0.12)";

    const inputStyle: React.CSSProperties = {
        width: "100%", boxSizing: "border-box", padding: "10px 14px",
        borderRadius: "10px", background: inputBg, border: inputBorder,
        color: inputColor, fontSize: "14px", outline: "none",
        fontFamily: "inherit", resize: "none" as any,
    };

    return (
        <div
            style={{
                position: "fixed", inset: 0, zIndex: 1000,
                background: overlayBg,
                overflowY: "auto",
                WebkitOverflowScrolling: "touch" as any,
                padding: "16px",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                style={{
                    background: modalBg, border: modalBorder, borderRadius: "20px",
                    width: "100%", maxWidth: "540px",
                    padding: "24px 20px",
                    margin: "auto",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
                    boxSizing: "border-box" as const,
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: titleColor }}>
                        {isEdit ? "Edit Your Review" : "Write a Review"}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{ background: "none", border: "none", cursor: "pointer", color: labelColor, padding: "4px" }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: errorBg, border: "1px solid rgba(220,38,38,0.3)",
                        borderRadius: "10px", padding: "12px 16px",
                        color: isLight ? "#991b1b" : "#fca5a5",
                        fontSize: "13px", marginBottom: "20px",
                    }}>
                        {error}
                    </div>
                )}

                {/* Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                    {/* Name */}
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: labelColor, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                            Your Name *
                        </label>
                        <input
                            style={inputStyle} value={form.name} maxLength={80}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder="e.g. Priya Sharma"
                        />
                    </div>

                    {/* Role + Company */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: labelColor, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                Role
                            </label>
                            <input
                                style={inputStyle} value={form.role} maxLength={80}
                                onChange={(e) => set("role", e.target.value)}
                                placeholder="e.g. Portfolio Manager"
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: labelColor, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                Company
                            </label>
                            <input
                                style={inputStyle} value={form.company} maxLength={80}
                                onChange={(e) => set("company", e.target.value)}
                                placeholder="e.g. Axis Capital"
                            />
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: labelColor, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                            Rating *
                        </label>
                        <StarPicker value={form.rating} onChange={(v) => set("rating", v)} isLight={isLight} />
                    </div>

                    {/* Tag */}
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: labelColor, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                            Category
                        </label>
                        <select
                            value={form.tag}
                            onChange={(e) => set("tag", e.target.value)}
                            style={{
                                ...inputStyle,
                                cursor: "pointer",
                                // ── Add these two lines ──
                                backgroundColor: isLight ? "rgba(13,37,64,0.04)" : "#1C3656",
                                color: isLight ? "#0d1b2a" : "#E8EDF5",
                            }}
                        >
                            {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    {/* Preview */}
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: labelColor, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                            Short Preview * <span style={{ fontWeight: 400, textTransform: "none" }}>(max 300 chars, shown on card)</span>
                        </label>
                        <textarea
                            style={{ ...inputStyle, minHeight: "80px" }} value={form.preview} maxLength={300}
                            onChange={(e) => set("preview", e.target.value)}
                            placeholder="A short summary of your experience..."
                        />
                        <div style={{ textAlign: "right", fontSize: "11px", color: labelColor, marginTop: "4px" }}>
                            {form.preview.length}/300
                        </div>
                    </div>

                    {/* Full Review */}
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: labelColor, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                            Full Review * <span style={{ fontWeight: 400, textTransform: "none" }}>(shown in popup)</span>
                        </label>
                        <textarea
                            style={{ ...inputStyle, minHeight: "120px" }} value={form.fullText} maxLength={2000}
                            onChange={(e) => set("fullText", e.target.value)}
                            placeholder="Share your detailed experience with InvestBeans..."
                        />
                        <div style={{ textAlign: "right", fontSize: "11px", color: labelColor, marginTop: "4px" }}>
                            {form.fullText.length}/2000
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "24px" }}>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            width: "100%", padding: "14px", borderRadius: "12px", fontSize: "15px", fontWeight: 700,
                            border: "none", background: loading ? "rgba(81,148,246,0.5)" : "#5194F6",
                            color: "#fff", cursor: loading ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                        }}
                    >
                        {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : isEdit ? "Save Changes" : "Post Review"}
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            width: "100%", padding: "12px", borderRadius: "12px", fontSize: "14px", fontWeight: 600,
                            border: isLight ? "1px solid rgba(13,37,64,0.15)" : "1px solid #334155",
                            background: "transparent", color: labelColor, cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}