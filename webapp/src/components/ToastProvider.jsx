import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const ToastContext = createContext(null);

const toastStyles = {
  success: "border-emerald-700/50 bg-emerald-950/95 text-emerald-100",
  error: "border-red-700/50 bg-red-950/95 text-red-100",
  warning: "border-amber-700/50 bg-amber-950/95 text-amber-100",
  info: "border-[#D99A2B]/40 bg-[#1C1511]/95 text-[#F5EFE6]",
};

const toastIcons = {
  success: "✅",
  error: "⚠️",
  warning: "⚠️",
  info: "ℹ️",
};

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

  const showToast = useCallback(
    (message, type = "info") => {
      if (!message) return;

      clearToastTimer();

      setToast({
        id: Date.now(),
        message,
        type,
      });

      if (typeof window !== "undefined") {
        timerRef.current = window.setTimeout(() => {
          setToast(null);
          timerRef.current = null;
        }, 3000);
      }
    },
    [clearToastTimer]
  );

  useEffect(() => {
    return () => {
      clearToastTimer();
    };
  }, [clearToastTimer]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {toast && (
        <div className="fixed left-0 right-0 top-3 z-[9999] px-4 pointer-events-none">
          <div
            className={`mx-auto max-w-[460px] rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl animate-toast-down ${
              toastStyles[toast.type] || toastStyles.info
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5 shrink-0">
                {toastIcons[toast.type] || toastIcons.info}
              </span>

              <p className="flex-1 text-[15px] font-bold leading-snug break-words">
                {toast.message}
              </p>

              <button
                type="button"
                onClick={hideToast}
                aria-label="Xabarni yopish"
                className="pointer-events-auto shrink-0 text-current/70 hover:text-current active:scale-95 transition"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}