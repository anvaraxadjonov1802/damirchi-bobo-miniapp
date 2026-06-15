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
    <article className="relative overflow-hidden flex items-center gap-3 p-3 bg-white border border-[#E9DCC7] rounded-3xl shadow-md hover:border-[#C89438]/35 transition-all duration-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(200,148,56,0.08),transparent_34%)] pointer-events-none" />

      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#FFFAF2] border border-[#E9DCC7] shrink-0">
        <img
          src={imageSrc}
          alt={product.name_uz}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative flex-1 min-w-0">
        <h4 className="font-serif font-black text-[#2C211A] text-[14px] tracking-tight leading-tight truncate">
          {product.name_uz}
        </h4>

        <p className="text-[#776B60] text-[10.5px] font-bold mt-1">
          {formatPrice(product.price)} × {quantity}
        </p>

        <p className="font-black text-[13px] text-[#A97824] mt-1 leading-none">
          {formatPrice(product.price * quantity)}
        </p>
      </div>

      <div className="relative flex flex-col items-end gap-2 shrink-0">
        <button
          type="button"
          onClick={handleRemove}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200 active:scale-95"
          title="O‘chirish"
          aria-label="O‘chirish"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center bg-[#FFFAF2] border border-[#E9DCC7] rounded-2xl p-1 text-[#2C211A]">
          <button
            type="button"
            onClick={handleDecrease}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white text-[#A97824] active:scale-90 transition-all"
            aria-label="Kamaytirish"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="w-7 text-center text-sm font-black text-[#2C211A]">
            {quantity}
          </span>

          <button
            type="button"
            onClick={handleIncrease}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#C89438] text-white active:scale-90 transition-all"
            aria-label="Ko‘paytirish"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}