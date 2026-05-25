import React from 'react';
import { formatPrice } from '../utils/format';
import { ShieldCheck } from 'lucide-react';

export default function PriceSummary({ subtotal, deliveryPrice, title = "Buyurtma hisobi" }) {
  const isPendingDelivery = deliveryPrice === null || deliveryPrice === undefined;
  const isFreeDelivery = !isPendingDelivery && deliveryPrice === 0;
  const total = subtotal + (isPendingDelivery ? 0 : deliveryPrice);

  return (
    <div className="bg-[#1C1511] border border-[#D99A2B]/12 rounded-3xl p-5 shadow-lg">
      <h3 className="font-serif font-black text-xs text-[#D99A2B] mb-4 uppercase tracking-[0.15em] border-b border-[#D99A2B]/15 pb-2">
        {title}
      </h3>

      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between text-xs text-[#A8988C] font-semibold">
          <span>Mahsulotlar jami:</span>
          <span className="font-bold text-[#F5EFE6]">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-[#A8988C] font-semibold gap-3">
          <span>Yetkazib berish:</span>
          {isPendingDelivery ? (
            <span className="font-bold text-[#D99A2B] uppercase tracking-widest text-[9px] bg-[#D99A2B]/10 px-2 py-0.5 rounded-full border border-[#D99A2B]/15 whitespace-nowrap">Checkout’da tanlanadi</span>
          ) : isFreeDelivery ? (
            <span className="font-bold text-emerald-400 uppercase tracking-widest text-[9px] bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-900/40 whitespace-nowrap">0 so‘m</span>
          ) : (
            <span className="font-bold text-[#F5EFE6]">{formatPrice(deliveryPrice)}</span>
          )}
        </div>

        <hr className="border-t border-dashed border-[#D99A2B]/15 my-1" />

        <div className="flex items-center justify-between text-sm font-bold text-[#F5EFE6] pt-1">
          <span className="font-serif text-[#F5EFE6]">Umumiy summa:</span>
          <span className="font-serif text-lg text-[#D99A2B] font-black">
            {formatPrice(total)}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-2 bg-[#120E0B] rounded-xl py-2 px-3 border border-[#D99A2B]/10 text-[10px] text-[#A8988C] font-semibold">
        <ShieldCheck className="w-4 h-4 text-[#D99A2B]" />
        <span>Buyurtmangiz operator tomonidan tekshiriladi</span>
      </div>
    </div>
  );
}
