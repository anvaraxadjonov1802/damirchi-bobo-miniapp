import React from "react";
import { Flame, Plus } from "lucide-react";

import { client } from "../api/client";
import { formatPrice } from "../utils/format";
import { hapticFeedback } from "../telegram/telegram";

export default function FeaturedProducts({
  products,
  cart,
  onAddToCart,
  onOpenDetails,
}) {
  const featured = products
    .filter((product) => product.is_available !== false)
    .slice()
    .sort((a, b) => {
      const sortDiff = (a.sort_order ?? 999) - (b.sort_order ?? 999);

      if (sortDiff !== 0) return sortDiff;

      return Number(b.price || 0) - Number(a.price || 0);
    })
    .slice(0, 5);

  if (featured.length === 0) return null;

  const handleAdd = (event, product) => {
    event.stopPropagation();
    hapticFeedback("success");
    onAddToCart?.(product);
  };

  return (
    <section className="mt-4">
      <div className="px-4 flex items-end justify-between mb-2.5">
        <div className="min-w-0">
          <p className="text-[9px] font-black text-[#D99A2B] uppercase tracking-[0.18em]">
            Tavsiya
          </p>

          <h2 className="font-serif font-black text-[#F5EFE6] text-base leading-tight mt-0.5">
            Top taomlar
          </h2>
        </div>

        <span className="shrink-0 text-[9px] font-black text-[#A8988C] uppercase tracking-widest">
          Chef tanlovi
        </span>
      </div>

      <div className="overflow-x-auto no-scrollbar px-4 pb-1.5 flex gap-2.5 snap-x">
        {featured.map((product, index) => {
          const image = client.getImageUrl(product.image);
          const quantity = cart[product.id]?.quantity || 0;

          return (
            <button
              key={product.id}
              type="button"
              onClick={() => onOpenDetails?.(product)}
              className="snap-start w-[174px] shrink-0 text-left rounded-3xl overflow-hidden bg-[#1C1511] border border-[#D99A2B]/14 shadow-lg active:scale-[0.98] transition-all relative group"
            >
              <div className="relative h-[104px] bg-[#120E0B] overflow-hidden">
                <img
                  src={image}
                  alt={product.name_uz}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#120E0B]/88 via-black/5 to-transparent" />

                <div className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-[#D99A2B] text-[#120E0B] px-2 py-1 text-[8px] font-black uppercase tracking-wider">
                  <Flame className="w-3 h-3" />
                  #{index + 1}
                </div>

                {quantity > 0 && (
                  <div className="absolute top-2 right-2 rounded-full bg-[#120E0B]/90 border border-[#D99A2B]/25 px-2 py-1 text-[9px] text-[#D99A2B] font-black">
                    {quantity} ta
                  </div>
                )}
              </div>

              <div className="p-3">
                <p className="text-[8px] font-black text-[#D99A2B] uppercase tracking-[0.14em] truncate">
                  {product.category_name || "Damirchi menyusi"}
                </p>

                <h3 className="font-serif font-black text-[#F5EFE6] text-[14px] leading-tight mt-1 line-clamp-2 min-h-[34px]">
                  {product.name_uz}
                </h3>

                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <span className="font-serif font-black text-[#D99A2B] text-[14px] truncate">
                    {formatPrice(product.price)}
                  </span>

                  <span
                    onClick={(event) => handleAdd(event, product)}
                    className="w-8 h-8 rounded-xl bg-[#D99A2B] text-[#120E0B] flex items-center justify-center shadow-md shadow-[#D99A2B]/10 shrink-0 active:scale-95"
                    role="button"
                    aria-label="Savatga qo‘shish"
                  >
                    <Plus className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}