import React from "react";
import { formatPrice } from "../utils/format";

export default function PriceSummary({
  subtotal,
  deliveryPrice,
  title = "Hisob",
  compact = false,
}) {
  const isPendingDelivery = deliveryPrice === null || deliveryPrice === undefined;
  const isFreeDelivery = !isPendingDelivery && deliveryPrice === 0;
  const total = subtotal + (isPendingDelivery ? 0 : deliveryPrice);

  return (
    <section
      className={`bg-[#1C1511] border border-[#D99A2B]/12 rounded-3xl shadow-lg animate-fade-in ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3 border-b border-[#D99A2B]/12 pb-2.5">
        <h3 className="font-serif font-black text-lg text-[#F5EFE6] leading-tight">
          {title}
        </h3>

        <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#D99A2B] bg-[#D99A2B]/10 border border-[#D99A2B]/15 px-2.5 py-1 rounded-full">
          Jami
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3 text-sm text-[#A8988C] font-bold">
          <span>Mahsulotlar</span>
          <span className="text-[#F5EFE6]">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm text-[#A8988C] font-bold">
          <span>Dastavka</span>

          {isPendingDelivery ? (
            <span className="text-[11px] text-[#D99A2B] bg-[#D99A2B]/10 px-2 py-1 rounded-full border border-[#D99A2B]/15 whitespace-nowrap">
              keyin tanlanadi
            </span>
          ) : isFreeDelivery ? (
            <span className="text-emerald-300">0 so‘m</span>
          ) : (
            <span className="text-[#F5EFE6]">{formatPrice(deliveryPrice)}</span>
          )}
        </div>

        <div className="border-t border-dashed border-[#D99A2B]/15 my-1" />

        <div className="flex items-end justify-between gap-3 pt-1">
          <span className="text-base font-black text-[#F5EFE6]">To‘lov</span>

          <span className="font-serif text-2xl text-[#D99A2B] font-black leading-none">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </section>
  );
}