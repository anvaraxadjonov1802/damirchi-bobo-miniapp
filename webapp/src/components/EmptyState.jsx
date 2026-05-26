import React from "react";
import { ShoppingBasket } from "lucide-react";
import { hapticFeedback } from "../telegram/telegram";

export default function EmptyState({
  title = "Savat bo‘sh",
  description = "Menyudan taom tanlang va savatga qo‘shing.",
  buttonText = "Menyuga qaytish",
  onAction,
}) {
  const handleAction = () => {
    hapticFeedback("light");

    if (onAction) {
      onAction();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-5 py-8 text-center bg-[#1C1511] rounded-3xl border border-[#D99A2B]/12 shadow-lg max-w-sm mx-auto my-6 animate-fade-in relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,154,43,0.12),transparent_42%)]" />

      <div className="relative w-16 h-16 bg-[#120E0B] rounded-3xl flex items-center justify-center border border-[#D99A2B]/15 mb-4 shadow-md">
        <ShoppingBasket className="w-7 h-7 text-[#D99A2B]" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#D99A2B] animate-ping" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#D99A2B]" />
      </div>

      <h3 className="relative font-serif font-black text-lg text-[#F5EFE6] mb-2 leading-tight">
        {title}
      </h3>

      <p className="relative text-[#A8988C] text-sm leading-snug mb-5 max-w-[280px] font-semibold">
        {description}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={handleAction}
          className="relative w-full py-3.5 bg-[#D99A2B] hover:bg-[#C98A1F] text-[#120E0B] rounded-2xl text-sm font-black transition-all active:scale-[0.98] shadow-md cursor-pointer"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}