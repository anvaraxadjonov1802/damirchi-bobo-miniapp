import React, { useState } from "react";
import { ImageOff, Minus, Plus } from "lucide-react";

import { formatPrice } from "../utils/format";
import { client } from "../api/client";
import { hapticFeedback } from "../telegram/telegram";

export default function ProductCard({
  product,
  quantity = 0,
  onAdd,
  onIncrease,
  onDecrease,
  onDetails,
}) {
  const [imageError, setImageError] = useState(false);

  const isAvailable = product.is_available !== false;
  const imageSrc = client.getImageUrl(product.image);

  const handleCardClick = (event) => {
    const target = event.target;

    if (
      target.closest?.(".qty-control") ||
      target.closest?.(".add-btn")
    ) {
      return;
    }

    hapticFeedback("light");
    onDetails?.(product);
  };

  const handleAddClick = (event) => {
    event.stopPropagation();

    if (!isAvailable) return;

    hapticFeedback("success");
    onAdd?.(product);
  };

  const handleIncrease = (event) => {
    event.stopPropagation();
    hapticFeedback("light");
    onIncrease?.(product.id);
  };

  const handleDecrease = (event) => {
    event.stopPropagation();
    hapticFeedback("light");
    onDecrease?.(product.id);
  };

  return (
    <article
      onClick={handleCardClick}
      className={`flex h-full min-w-0 flex-col overflow-hidden rounded-[20px] border border-[#E9E3DA] bg-white shadow-[0_12px_28px_-24px_rgba(36,24,18,0.55)] transition-all active:scale-[0.985] ${
        isAvailable ? "cursor-pointer" : "opacity-65"
      }`}
    >
      <div className="relative h-[145px] shrink-0 overflow-hidden bg-[#F3EFE9]">
        {!imageError && imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name_uz}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition duration-300"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#FFF8EB] to-[#EFE4D4] text-[#A97824]">
            <ImageOff className="h-7 w-7 opacity-70" />
            <span className="text-[9px] font-black uppercase tracking-[0.12em]">
              Rasm yo‘q
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/35 to-transparent" />

        <span className="absolute bottom-2 left-2 max-w-[calc(100%-16px)] truncate rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-[9px] font-black text-white backdrop-blur-md">
          {product.category_name || "Damirchi menyusi"}
        </span>

        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/76 backdrop-blur-[2px]">
            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-black text-red-600">
              Mavjud emas
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 min-h-[38px] text-[14px] font-black leading-[1.3] tracking-[-0.02em] text-[#241812]">
          {product.name_uz}
        </h3>

        <p className="mt-1.5 line-clamp-2 min-h-[30px] text-[10.5px] font-semibold leading-[1.4] text-[#776B60]">
          {product.description_uz ||
            "Damirchi oshxonasida yangi tayyorlangan mazali taom."}
        </p>

        <div className="mt-auto flex min-h-[44px] items-end justify-between gap-2 pt-3">
          <span className="min-w-0 truncate text-[14px] font-black tracking-[-0.02em] text-[#6F4624]">
            {formatPrice(product.price)}
          </span>

          {isAvailable && quantity > 0 ? (
            <div className="qty-control flex shrink-0 items-center rounded-[13px] border border-[#E9DCC7] bg-[#FFF8EB] p-1">
              <button
                type="button"
                onClick={handleDecrease}
                className="flex h-7 w-7 items-center justify-center rounded-[9px] text-[#A97824] transition active:scale-90"
                aria-label="Kamaytirish"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <span className="w-6 text-center text-[12px] font-black text-[#241812]">
                {quantity}
              </span>

              <button
                type="button"
                onClick={handleIncrease}
                className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#C89438] text-white shadow-sm transition active:scale-90"
                aria-label="Ko‘paytirish"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddClick}
              disabled={!isAvailable}
              className="add-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-[#C89438] text-white shadow-[0_8px_18px_-10px_rgba(169,120,36,0.9)] transition active:scale-90 disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none"
              aria-label="Savatga qo‘shish"
            >
              <Plus className="h-[18px] w-[18px]" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}