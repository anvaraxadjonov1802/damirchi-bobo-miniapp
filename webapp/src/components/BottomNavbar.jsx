import React from "react";
import { ClipboardList, Home, ShoppingCart, UserRound } from "lucide-react";
import { hapticFeedback } from "../telegram/telegram";

const navItems = [
  { key: "menu", label: "Asosiy", icon: Home },
  { key: "cart", label: "Savat", icon: ShoppingCart },
  { key: "orders", label: "Buyurtmalar", icon: ClipboardList },
  { key: "profile", label: "Profil", icon: UserRound },
];

export default function BottomNavbar({ active = "menu", cartCount = 0, onNavigate }) {
  const handleNavigate = (key) => {
    hapticFeedback("light");
    onNavigate?.(key);
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[480px] border-t border-[#E9E3DA] bg-white px-2 pt-2 bottom-nav-compositor">
      <div className="grid grid-cols-4">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          const isCart = key === "cart";

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleNavigate(key)}
              className="relative flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[18px] transition-transform active:scale-95"
              aria-label={label}
            >
              {isActive && <span className="absolute top-0 h-[3px] w-7 rounded-full bg-[#C89438]" />}

              <div className={`relative flex h-8 w-8 items-center justify-center rounded-[12px] ${isActive ? "bg-[#FFF0D3] text-[#A97824]" : "bg-transparent text-[#82786F]"}`}>
                <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
                {isCart && cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#C89438] px-1 text-[9px] font-black text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>

              <span className={`max-w-full truncate text-[10px] leading-none ${isActive ? "font-black text-[#A97824]" : "font-bold text-[#82786F]"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-[max(0.65rem,env(safe-area-inset-bottom))]" />
    </nav>
  );
}
