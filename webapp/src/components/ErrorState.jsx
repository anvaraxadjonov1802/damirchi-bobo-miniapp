import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

import { hapticFeedback } from "../telegram/telegram";

export default function ErrorState({
  title = "Xatolik yuz berdi",
  message = "Menyuni yuklab bo‘lmadi. Iltimos, qayta urinib ko‘ring.",
  onRetry,
}) {
  const handleRetry = () => {
    hapticFeedback("medium");

    if (onRetry) {
      onRetry();
    }
  };

  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center px-5 py-7 text-center bg-[#1C1511] rounded-3xl border border-red-900/35 shadow-lg max-w-sm mx-auto my-6 animate-fade-in text-[#F5EFE6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.12),transparent_42%)]" />

      <div className="relative w-14 h-14 bg-red-950/30 rounded-3xl flex items-center justify-center mb-4 border border-red-900/35 shadow-md">
        <AlertTriangle className="w-7 h-7 text-red-400" />
      </div>

      <h3 className="relative text-lg font-black text-[#F5EFE6] mb-2 font-serif leading-tight">
        {title}
      </h3>

      <p className="relative text-[#A8988C] text-sm leading-snug mb-5 font-semibold max-w-[280px]">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={handleRetry}
          className="relative flex items-center justify-center gap-2 w-full py-3.5 bg-[#D99A2B] hover:bg-[#C98A1F] text-[#120E0B] rounded-2xl text-sm font-black active:scale-[0.98] transition-all shadow-md cursor-pointer"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Qayta urinish</span>
        </button>
      )}
    </div>
  );
}