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
      className={`bg-white border border-[#E9DCC7] rounded-3xl shadow-lg animate-fade-in ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3 border-b border-[#E9DCC7] pb-2.5">
        <h3 className="font-serif font-black text-lg text-[#2C211A] leading-tight">
          {title}
        </h3>

        <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#A97824] bg-[#C89438]/10 border border-[#E9DCC7] px-2.5 py-1 rounded-full">
          Jami
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3 text-sm text-[#776B60] font-bold">
          <span>Mahsulotlar</span>
          <span className="text-[#2C211A]">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm text-[#776B60] font-bold">
          <span>Dastavka</span>

          {isPendingDelivery ? (
            <span className="text-[11px] text-[#A97824] bg-[#C89438]/10 px-2 py-1 rounded-full border border-[#E9DCC7] whitespace-nowrap">
              keyin tanlanadi
            </span>
          ) : isFreeDelivery ? (
            <span className="text-emerald-700">0 so‘m</span>
          ) : (
            <span className="text-[#2C211A]">{formatPrice(deliveryPrice)}</span>
          )}
        </div>

        <div className="border-t border-dashed border-[#E9DCC7] my-1" />

        <div className="flex items-end justify-between gap-3 pt-1">
          <span className="text-base font-black text-[#2C211A]">To‘lov</span>

          <span className="font-serif text-2xl text-[#A97824] font-black leading-none">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </section>
  );
}