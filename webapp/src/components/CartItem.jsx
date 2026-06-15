import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { client } from "../api/client";
import { formatPrice } from "../utils/format";
import { hapticFeedback } from "../telegram/telegram";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const { product, quantity } = item;
  const imageSrc = client.getImageUrl(product.image);

  const handleDecrease = () => {
    hapticFeedback("light");
    if (quantity === 1) {
      onRemove?.(product.id);
      return;
    }
    onDecrease?.(product.id);
  };

  const handleIncrease = () => {
    hapticFeedback("light");
    onIncrease?.(product.id);
  };

  const handleRemove = () => {
    hapticFeedback("error");
    onRemove?.(product.id);
  };

  return (
    <article className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#E8E2DA]">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#F2F0ED]">
        <img src={imageSrc} alt={product.name_uz} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-[13.5px] font-black text-[#221816]">{product.name_uz}</h4>
        <p className="mt-1 text-[11px] font-semibold text-[#78716C]">{formatPrice(product.price)}</p>
        <button type="button" onClick={handleRemove} className="mt-1 text-[10px] font-bold text-[#A97824]">
          O‘chirish
        </button>
      </div>

      <div className="flex shrink-0 items-center rounded-xl bg-[#F2F0ED] p-1">
        <button type="button" onClick={handleDecrease} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A97824] active:scale-90" aria-label="Kamaytirish">
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-7 text-center text-sm font-black text-[#221816]">{quantity}</span>
        <button type="button" onClick={handleIncrease} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C89438] text-white active:scale-90" aria-label="Ko‘paytirish">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
