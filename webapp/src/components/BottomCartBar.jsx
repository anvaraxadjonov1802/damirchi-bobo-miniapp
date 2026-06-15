import React from "react";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { formatPrice } from "../utils/format";
import { hapticFeedback } from "../telegram/telegram";

export default function BottomCartBar({ count, totalPrice, onClick }) {
  if (!count) return null;

  const handleBarClick = () => {
    hapticFeedback("medium");
    onClick?.();
  };

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-gradient-to-t from-[#F6F6F7] via-[#F6F6F7]/95 to-transparent px-4 pb-4 pt-8 safe-bottom">
      <button
        type="button"
        onClick={handleBarClick}
        className="pointer-events-auto flex h-14 w-full max-w-[448px] items-center justify-between gap-3 rounded-2xl bg-[#C89438] px-4 text-white shadow-xl shadow-[#C89438]/25 active:scale-[0.98]"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/18">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/75">Savat</p>
            <p className="truncate text-[14px] font-black">{count} ta · {formatPrice(totalPrice)}</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0" />
      </button>
    </div>
  );
}
