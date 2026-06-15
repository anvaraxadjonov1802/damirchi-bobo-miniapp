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
    <div className="flex flex-col items-center justify-center px-5 py-8 text-center bg-white rounded-3xl border border-[#E9DCC7] shadow-lg max-w-sm mx-auto my-6 animate-fade-in relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,148,56,0.12),transparent_42%)]" />

      <div className="relative w-16 h-16 bg-[#FFFAF2] rounded-3xl flex items-center justify-center border border-[#E9DCC7] mb-4 shadow-md">
        <ShoppingBasket className="w-7 h-7 text-[#A97824]" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#C89438] animate-ping" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#C89438]" />
      </div>

      <h3 className="relative font-serif font-black text-lg text-[#2C211A] mb-2 leading-tight">
        {title}
      </h3>

      <p className="relative text-[#776B60] text-sm leading-snug mb-5 max-w-[280px] font-semibold">
        {description}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={handleAction}
          className="relative w-full py-3.5 bg-[#C89438] hover:bg-[#A97824] text-white rounded-2xl text-sm font-black transition-all active:scale-[0.98] shadow-md cursor-pointer"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}