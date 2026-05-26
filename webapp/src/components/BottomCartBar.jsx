import React from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { formatPrice } from "../utils/format";
import { hapticFeedback } from "../telegram/telegram";

export default function BottomCartBar({ count, totalPrice, onClick }) {
  if (!count) return null;

  const handleBarClick = () => {
    hapticFeedback("medium");

    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pb-4 pt-8 safe-bottom bg-gradient-to-t from-[#120E0B] via-[#120E0B]/95 to-transparent pointer-events-none">
      <button
        type="button"
        onClick={handleBarClick}
        className="pointer-events-auto w-full max-w-[448px] h-14 rounded-3xl bg-[#1C1511] hover:bg-[#251D18] border border-[#D99A2B]/25 shadow-2xl shadow-black/45 px-4 flex items-center justify-between gap-3 transition-all active:scale-[0.98] relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(217,154,43,0.16),transparent_36%)]" />

        <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-1000 ease-out" />

        <div className="relative flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-[#D99A2B] text-[#120E0B] flex items-center justify-center shadow-md shadow-[#D99A2B]/10 shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>

          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#D99A2B]/80 leading-none">
                Savat
              </span>

              <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#D99A2B]/12 border border-[#D99A2B]/18 text-[#D99A2B] text-[10px] font-black flex items-center justify-center leading-none">
                {count}
              </span>
            </div>

            <span className="block font-black text-sm text-[#F5EFE6] mt-0.5 truncate">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        <div className="relative flex items-center gap-1.5 text-[#D99A2B] shrink-0">
          <span className="uppercase tracking-[0.08em] text-[10px] font-black">
            Ko‘rish
          </span>

          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </button>
    </div>
  );
}