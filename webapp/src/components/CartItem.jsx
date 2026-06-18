import React, { useState } from "react";
import { ImageOff, Minus, Plus, Trash2 } from "lucide-react";

import { client } from "../api/client";
import { formatPrice } from "../utils/format";
import { hapticFeedback } from "../telegram/telegram";

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  const { product, quantity } = item;
  const [imageError, setImageError] = useState(false);

  const imageSrc = client.getImageUrl(product.image);
  const itemTotal = Number(product.price || 0) * Number(quantity || 0);

  const handleDecrease = () => {
    hapticFeedback("light");

    if (quantity <= 1) {
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
    <article className="rounded-[20px] border border-[#E9E3DA] bg-white p-3 shadow-[0_12px_28px_-25px_rgba(36,24,18,0.55)]">
      <div className="flex gap-3">
        <div className="h-[78px] w-[78px] shrink-0 overflow-hidden rounded-[17px] bg-[#F3EFE9]">
          {!imageError && imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name_uz}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-[#FFF8EB] to-[#EFE4D4] text-[#A97824]">
              <ImageOff className="h-5 w-5 opacity-70" />
              <span className="text-[8px] font-black uppercase tracking-[0.1em]">
                Rasm yo‘q
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-[14px] font-black leading-[1.3] tracking-[-0.02em] text-[#241812]">
                {product.name_uz}
              </h3>

              <p className="mt-1 text-[11px] font-bold text-[#8B8178]">
                {formatPrice(product.price)} / dona
              </p>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-red-50 text-red-500 transition active:scale-90"
              aria-label="Mahsulotni o‘chirish"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex shrink-0 items-center rounded-[14px] border border-[#E9DCC7] bg-[#FFF8EB] p-1">
              <button
                type="button"
                onClick={handleDecrease}
                className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#A97824] transition active:scale-90"
                aria-label="Kamaytirish"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <span className="w-7 text-center text-[13px] font-black text-[#241812]">
                {quantity}
              </span>

              <button
                type="button"
                onClick={handleIncrease}
                className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#C89438] text-white shadow-sm transition active:scale-90"
                aria-label="Ko‘paytirish"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="min-w-0 truncate text-right text-[14px] font-black tracking-[-0.02em] text-[#6F4624]">
              {formatPrice(itemTotal)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
