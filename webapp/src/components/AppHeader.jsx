import React from "react";
import { ShoppingBag, ChevronLeft, Sparkles } from "lucide-react";
import { hapticFeedback } from "../telegram/telegram";

const titles = {
  cart: "Savat",
  checkout: "Buyurtma",
  success: "Qabul qilindi",
};

export default function AppHeader({
  cartCount,
  onCartClick,
  currentScreen,
  onBackClick,
  settings,
}) {
  const triggerCart = () => {
    hapticFeedback("light");
    if (onCartClick) onCartClick();
  };

  const triggerBack = () => {
    hapticFeedback("light");
    if (onBackClick) onBackClick();
  };

  const showBackButton = currentScreen !== "menu";
  const restaurantName = settings?.restaurant_name || "Damirchi";
  const isOpen = settings?.is_open !== false;
  const statusLabel = isOpen ? "Ochiq" : "Yopiq";

  return (
    <header className="sticky top-0 z-30 safe-top border-b border-[#E9DCC7]/80 bg-[#FFFAF2]/90 px-4 py-3 backdrop-blur-xl transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {showBackButton ? (
            <button
              type="button"
              onClick={triggerBack}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#E9DCC7] bg-white shadow-sm transition-all active:scale-90"
              aria-label="Orqaga"
            >
              <ChevronLeft className="h-5 w-5 text-[#2C211A]" />
            </button>
          ) : (
            <div className="flex h-10 w-10 shrink-0 rotate-[-3deg] items-center justify-center rounded-2xl bg-[#C89438] font-serif text-lg font-black text-white shadow-md shadow-[#C89438]/20">
              D
            </div>
          )}

          {!showBackButton ? (
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-serif text-lg font-extrabold leading-tight tracking-tight text-[#2C211A]">
                {restaurantName}
              </span>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isOpen
                      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.45)]"
                      : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.35)]"
                  }`}
                />

                <span
                  className={`text-[10px] font-black uppercase leading-none tracking-[0.14em] ${
                    isOpen ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  {statusLabel}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-serif text-lg font-extrabold leading-tight tracking-tight text-[#2C211A]">
                {titles[currentScreen] || restaurantName}
              </span>

              <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#776B60]">
                Damirchi
              </span>
            </div>
          )}
        </div>

        {currentScreen === "menu" && (
          <button
            type="button"
            onClick={triggerCart}
            className="relative flex h-10 min-w-10 items-center justify-center gap-2 rounded-2xl border border-[#E9DCC7] bg-white px-3 shadow-sm transition-all active:scale-90"
            aria-label="Savatni ochish"
          >
            {cartCount > 0 && (
              <span className="text-[10px] font-black uppercase tracking-wider text-[#A97824]">
                Savat
              </span>
            )}

            <ShoppingBag className="h-5 w-5 text-[#A97824]" />

            {cartCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 animate-scale-in items-center justify-center rounded-full border-2 border-[#FFFAF2] bg-[#C89438] px-1 text-[10px] font-black text-white shadow-md">
                {cartCount}
              </span>
            ) : (
              <Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-[#C89438]" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}