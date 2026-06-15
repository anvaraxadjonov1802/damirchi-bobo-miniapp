import React from "react";
import { ClipboardList, Home, ShoppingCart, UserRound } from "lucide-react";

import { hapticFeedback } from "../telegram/telegram";

const navItems = [
  { key: "menu", label: "Asosiy", icon: Home },
  { key: "cart", label: "Savat", icon: ShoppingCart },
  { key: "orders", label: "Buyurtmalar", icon: ClipboardList },
  { key: "profile", label: "Profil", icon: UserRound },
];

export default function BottomNavbar({
  active = "menu",
  cartCount = 0,
  onNavigate,
}) {
  const handleNavigate = (key) => {
    hapticFeedback("light");
    onNavigate?.(key);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[480px] border-t border-[#E7E7E7] bg-white px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-14px_32px_-28px_rgba(0,0,0,0.45)]">
      <div className="grid grid-cols-4">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          const isCart = key === "cart";

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleNavigate(key)}
              className="relative flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-2xl active:scale-95"
            >
              <div
                className={`relative flex h-7 w-7 items-center justify-center rounded-xl transition ${
                  isActive
                    ? "bg-[#F0ECFF] text-[#8C6CF7]"
                    : "text-[#666666]"
                }`}
              >
                <Icon className="h-5 w-5" />

                {isCart && cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8C6CF7] px-1 text-[9px] font-black text-white">
                    {cartCount}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-bold leading-none ${
                  isActive ? "text-[#8C6CF7]" : "text-[#666666]"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}