import React from "react";
import { Minus, Plus, Star } from "lucide-react";
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
  const isAvailable = product.is_available !== false;
  const imageSrc = client.getImageUrl(product.image);

  const handleCardClick = (event) => {
    if (event.target.closest(".qty-control") || event.target.closest(".add-btn")) return;
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
      className={`overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-[#E8E2DA] transition active:scale-[0.99] ${
        isAvailable ? "cursor-pointer" : "opacity-60"
      }`}
    >
      <div className="relative aspect-square bg-[#F2F0ED]">
        <img
          src={imageSrc}
          alt={product.name_uz}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />

        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[9px] font-black text-[#A97824] shadow-sm">
          <Star className="h-3 w-3 fill-[#C89438] text-[#C89438]" />
          5.0
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-sm">
            <span className="rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-black text-red-600 ring-1 ring-red-200">
              Mavjud emas
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="truncate text-[9px] font-black uppercase tracking-[0.14em] text-[#A97824]">
          {product.category_name || "Damirchi"}
        </p>

        <h3 className="mt-1 min-h-[36px] text-[13.5px] font-black leading-tight text-[#221816] line-clamp-2">
          {product.name_uz}
        </h3>

        <p className="mt-1.5 min-h-[28px] text-[10.5px] font-semibold leading-snug text-[#78716C] line-clamp-2">
          {product.description_uz || "Mazali va yangi tayyorlangan taom."}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="truncate text-[14px] font-black text-[#A97824]">
            {formatPrice(product.price)}
          </span>

          {isAvailable && quantity > 0 ? (
            <div className="qty-control flex items-center rounded-xl bg-[#F2F0ED] p-1">
              <button
                type="button"
                onClick={handleDecrease}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[#A97824] active:scale-90"
                aria-label="Kamaytirish"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <span className="w-6 text-center text-[12px] font-black text-[#221816]">
                {quantity}
              </span>

              <button
                type="button"
                onClick={handleIncrease}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C89438] text-white active:scale-90"
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
              className="add-btn flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#C89438] text-white shadow-sm active:scale-95 disabled:bg-stone-200 disabled:text-stone-400"
              aria-label="Savatga qo‘shish"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
