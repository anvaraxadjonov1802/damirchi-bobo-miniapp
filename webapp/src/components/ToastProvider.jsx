import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const ToastContext = createContext(null);

const toastStyles = {
  success: "border-emerald-200 bg-white text-emerald-700",
  error: "border-red-200 bg-white text-red-600",
  warning: "border-amber-200 bg-white text-amber-700",
  info: "border-[#E8E2DA] bg-white text-[#221816]",
};

const toastIcons = { success: "✅", error: "⚠️", warning: "⚠️", info: "ℹ️" };

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const clearToastTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const hideToast = useCallback(() => {
    clearToastTimer();
    setToast(null);
  }, [clearToastTimer]);

  const showToast = useCallback((message, type = "info") => {
    if (!message) return;
    clearToastTimer();
    setToast({ id: Date.now(), message, type });
    if (typeof window !== "undefined") {
      timerRef.current = window.setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, 3000);
    }
  }, [clearToastTimer]);

  useEffect(() => () => clearToastTimer(), [clearToastTimer]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <div className="pointer-events-none fixed left-0 right-0 top-3 z-[9999] px-4">
          <div className={`mx-auto max-w-[460px] animate-toast-down rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-xl ${toastStyles[toast.type] || toastStyles.info}`}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-lg leading-none">{toastIcons[toast.type] || toastIcons.info}</span>
              <p className="flex-1 break-words text-[14px] font-bold leading-snug">{toast.message}</p>
              <button type="button" onClick={hideToast} aria-label="Xabarni yopish" className="pointer-events-auto shrink-0 text-current/55 active:scale-95">✕</button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
