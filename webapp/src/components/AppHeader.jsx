import React from "react";
import { Bell, ChevronLeft, Search, ShoppingBag } from "lucide-react";
import { hapticFeedback } from "../telegram/telegram";

const titles = {
  cart: "Корзина",
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
    onCartClick?.();
  };

  const triggerBack = () => {
    hapticFeedback("light");
    onBackClick?.();
  };

  const restaurantName = settings?.restaurant_name || "Damirchi";
  const address = settings?.address || "Manzil tanlanmagan";
  const showBackButton = currentScreen !== "menu";

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E2DA] bg-white/95 px-4 py-2.5 safe-top backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {showBackButton ? (
            <button
              type="button"
              onClick={triggerBack}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F2F0ED] text-[#221816] active:scale-90"
              aria-label="Orqaga"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C89438] text-sm font-black text-white shadow-sm">
              D
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-[15px] font-extrabold leading-tight text-[#221816]">
                {showBackButton ? titles[currentScreen] || restaurantName : restaurantName}
              </h1>
              {!showBackButton && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
            </div>

            {!showBackButton ? (
              <p className="mt-0.5 max-w-[205px] truncate text-[11px] font-semibold text-[#78716C]">
                {address}
              </p>
            ) : (
              <p className="mt-0.5 text-[11px] font-semibold text-[#78716C]">
                Damirchi
              </p>
            )}
          </div>
        </div>

        {currentScreen === "menu" ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F0ED] text-[#221816] active:scale-90"
              aria-label="Qidirish"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F0ED] text-[#221816] active:scale-90"
              aria-label="Bildirishnomalar"
            >
              <Bell className="h-4.5 w-4.5" />
            </button>

            <button
              type="button"
              onClick={triggerCart}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F0ED] text-[#221816] active:scale-90"
              aria-label="Savat"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C89438] px-1 text-[10px] font-black text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
