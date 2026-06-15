import React, { useMemo } from "react";
import { Plus, Star } from "lucide-react";
import { client } from "../api/client";
import { formatPrice } from "../utils/format";
import { hapticFeedback } from "../telegram/telegram";

export default function FeaturedProducts({ products, cart, onAddToCart, onOpenDetails }) {
  const featuredProducts = useMemo(() => {
    return [...products]
      .filter((product) => product.is_available !== false)
      .sort((a, b) => {
        const first = a.sort_order !== undefined ? a.sort_order : 999;
        const second = b.sort_order !== undefined ? b.sort_order : 999;
        return first - second;
      })
      .slice(0, 4);
  }, [products]);

  if (!featuredProducts.length) return null;

  const handleOpen = (product) => {
    hapticFeedback("light");
    onOpenDetails?.(product);
  };

  const handleAdd = (event, product) => {
    event.stopPropagation();
    hapticFeedback("success");
    onAddToCart?.(product);
  };

  return (
    <section className="px-4 pt-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-black text-[#221816]">Yangiliklar</h2>
          <p className="text-[11px] font-semibold text-[#78716C]">Damirchi tavsiyalari</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-[#A97824] ring-1 ring-[#E8E2DA]">
          TOP
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {featuredProducts.map((product) => {
          const imageSrc = client.getImageUrl(product.image);
          const quantity = cart[product.id]?.quantity || 0;

          return (
            <button
              key={product.id}
              type="button"
              onClick={() => handleOpen(product)}
              className="group overflow-hidden rounded-[22px] bg-white text-left shadow-sm ring-1 ring-[#E8E2DA] transition active:scale-[0.99]"
            >
              <div className="relative aspect-square bg-[#F2F0ED]">
                <img
                  src={imageSrc}
                  alt={product.name_uz}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition duration-500 group-active:scale-105"
                />
                <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[9px] font-black text-[#A97824] shadow-sm">
                  <Star className="h-3 w-3 fill-[#C89438] text-[#C89438]" />
                  5.0
                </div>
                {quantity > 0 && (
                  <div className="absolute right-2 top-2 rounded-full bg-[#C89438] px-2 py-1 text-[9px] font-black text-white">
                    {quantity} ta
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3 className="min-h-[36px] text-[13px] font-black leading-tight text-[#221816] line-clamp-2">
                  {product.name_uz}
                </h3>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] font-black text-[#A97824]">
                    {formatPrice(product.price)}
                  </span>
                  <span
                    onClick={(event) => handleAdd(event, product)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#C89438] text-white active:scale-95"
                    role="button"
                    aria-label="Savatga qo‘shish"
                  >
                    <Plus className="h-4 w-4" />
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
