"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useTheme } from "@/controllers/Themecontext";

export type ToastType = "success" | "error" | "info";

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastItemProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const show = setTimeout(() => setVisible(true), 10);
    // Auto dismiss after 3.5s
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 350);
    }, 3500);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [toast.id, onRemove]);

  const configs = {
    success: {
      icon: <CheckCircle size={18} />,
      iconColor: "#22c55e",
      borderColor: "rgba(34,197,94,0.35)",
      bgAccent: "rgba(34,197,94,0.08)",
    },
    error: {
      icon: <XCircle size={18} />,
      iconColor: "#ef4444",
      borderColor: "rgba(239,68,68,0.35)",
      bgAccent: "rgba(239,68,68,0.08)",
    },
    info: {
      icon: <Info size={18} />,
      iconColor: "#C9A84C",
      borderColor: "rgba(201,168,76,0.35)",
      bgAccent: "rgba(201,168,76,0.08)",
    },
  };

  const cfg = configs[toast.type];
  const bg = isLight ? "#ffffff" : "#1E293B";
  const textColor = isLight ? "#0d1b2a" : "#E8EDF5";
  const closeBtnColor = isLight ? "rgba(13,37,64,0.35)" : "rgba(255,255,255,0.35)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        borderRadius: "14px",
        background: bg,
        border: `1px solid ${cfg.borderColor}`,
        boxShadow: isLight
          ? "0 8px 32px rgba(13,37,64,0.12)"
          : "0 8px 32px rgba(0,0,0,0.35)",
        minWidth: "280px",
        maxWidth: "360px",
        position: "relative",
        overflow: "hidden",
        transform: visible ? "translateX(0) scale(1)" : "translateX(120%) scale(0.95)",
        opacity: visible ? 1 : 0,
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "3px",
        background: cfg.iconColor, borderRadius: "14px 0 0 14px",
      }} />

      {/* Subtle bg tint */}
      <div style={{
        position: "absolute", inset: 0, background: cfg.bgAccent,
        pointerEvents: "none",
      }} />

      {/* Icon */}
      <span style={{ color: cfg.iconColor, flexShrink: 0, position: "relative", zIndex: 1 }}>
        {cfg.icon}
      </span>

      {/* Message */}
      <p style={{
        margin: 0, flex: 1, fontSize: "14px", fontWeight: 600,
        color: textColor, lineHeight: 1.4, position: "relative", zIndex: 1,
      }}>
        {toast.message}
      </p>

      {/* Close button */}
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onRemove(toast.id), 350);
        }}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: closeBtnColor, padding: "2px", flexShrink: 0,
          position: "relative", zIndex: 1, display: "flex", alignItems: "center",
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Toast Container ───────────────────────────────────────────────────────
interface ToastContainerProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 99999,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      alignItems: "flex-end",
    }}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}



export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg: string) => addToast(msg, "success"),
    error:   (msg: string) => addToast(msg, "error"),
    info:    (msg: string) => addToast(msg, "info"),
  };

  return { toasts, toast, removeToast };
}