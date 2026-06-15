import React from "react";
import { formatPrice } from "../utils/format";

export default function PriceSummary({ subtotal, deliveryPrice, title = "Hisob", compact = false }) {
  const isPendingDelivery = deliveryPrice === null || deliveryPrice === undefined;
  const isFreeDelivery = !isPendingDelivery && deliveryPrice === 0;
  const total = subtotal + (isPendingDelivery ? 0 : deliveryPrice);

  return (
    <section className={`rounded-[22px] bg-white shadow-sm ring-1 ring-[#E8E2DA] ${compact ? "p-3" : "p-4"}`}>
      <div className="mb-3 flex items-center justify-between border-b border-[#E8E2DA] pb-2.5">
        <h3 className="text-[16px] font-black text-[#221816]">{title}</h3>
        <span className="rounded-full bg-[#F4EEE6] px-3 py-1 text-[10px] font-black text-[#A97824]">Jami</span>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-[13px] font-semibold text-[#78716C]">
          <span>Mahsulotlar</span><span className="font-black text-[#221816]">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-[13px] font-semibold text-[#78716C]">
          <span>Dastavka</span>
          {isPendingDelivery ? <span className="rounded-full bg-[#F4EEE6] px-2 py-1 text-[10px] font-black text-[#A97824]">keyin</span> : isFreeDelivery ? <span className="font-black text-emerald-700">0 so‘m</span> : <span className="font-black text-[#221816]">{formatPrice(deliveryPrice)}</span>}
        </div>
        <div className="my-1 border-t border-dashed border-[#E8E2DA]" />
        <div className="flex items-end justify-between">
          <span className="text-[15px] font-black text-[#221816]">To‘lov</span>
          <span className="text-[22px] font-black leading-none text-[#A97824]">{formatPrice(total)}</span>
        </div>
      </div>
    </section>
  );
}
