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
    <article className="relative overflow-hidden flex items-center gap-3 p-3 bg-[#1C1511] border border-[#D99A2B]/12 rounded-3xl shadow-md hover:border-[#D99A2B]/35 transition-all duration-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(217,154,43,0.08),transparent_34%)] pointer-events-none" />

      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#120E0B] border border-[#D99A2B]/10 shrink-0">
        <img
          src={imageSrc}
          alt={product.name_uz}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative flex-1 min-w-0">
        <h4 className="font-serif font-black text-[#F5EFE6] text-[14px] tracking-tight leading-tight truncate">
          {product.name_uz}
        </h4>

        <p className="text-[#A8988C] text-[10.5px] font-bold mt-1">
          {formatPrice(product.price)} × {quantity}
        </p>

        <p className="font-black text-[13px] text-[#D99A2B] mt-1 leading-none">
          {formatPrice(product.price * quantity)}
        </p>
      </div>

      <div className="relative flex flex-col items-end gap-2 shrink-0">
        <button
          type="button"
          onClick={handleRemove}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-950/25 text-red-300 hover:bg-red-950/45 transition-colors border border-red-900/35 active:scale-95"
          title="O‘chirish"
          aria-label="O‘chirish"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center bg-[#120E0B] border border-[#D99A2B]/12 rounded-2xl p-1 text-[#F5EFE6]">
          <button
            type="button"
            onClick={handleDecrease}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#1C1511] text-[#D99A2B] active:scale-90 transition-all"
            aria-label="Kamaytirish"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="w-7 text-center text-sm font-black text-[#F5EFE6]">
            {quantity}
          </span>

          <button
            type="button"
            onClick={handleIncrease}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#D99A2B] text-[#120E0B] active:scale-90 transition-all"
            aria-label="Ko‘paytirish"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}