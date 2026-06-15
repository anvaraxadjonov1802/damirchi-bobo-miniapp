import React from "react";
import { ChevronDown, Clock3, MapPin, Navigation, Truck } from "lucide-react";
import { formatPrice } from "../utils/format";

export default function HeroSection({ settings }) {
  const address = settings?.address || "Yetkazib berish manzilini kiriting";
  const deliveryPrice = Number(settings?.delivery_price ?? 15000);
  const minOrderAmount = Number(settings?.min_order_amount || 0);
  const isOpen = settings?.is_open !== false;

  return (
    <section className="px-4 pt-3">
      <div className="rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-[#E8E2DA]">
        <p className="mb-2 text-center text-[12px] font-bold text-[#78716C]">
          Yetkazib berish manzilini kiriting
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button className="rounded-2xl bg-[#F2F0ED] py-2.5 text-[13px] font-black text-[#78716C] active:scale-[0.98]">
            Keyinroq
          </button>
          <button className="rounded-2xl bg-[#C89438] py-2.5 text-[13px] font-black text-white active:scale-[0.98]">
            Manzil kiritish
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-[#E8E2DA]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F4EEE6] text-[#A97824]">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-black text-[#221816]">
                {address}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-[#78716C]">
                {isOpen ? "Buyurtma qabul qilinadi" : "Hozir yopiq"}
              </p>
            </div>
          </div>
          <ChevronDown className="h-5 w-5 shrink-0 text-[#78716C]" />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-[#C89438] px-3 py-2.5 text-[12px] font-black text-white">
            <Truck className="h-4 w-4" />
            Dastavka
          </button>
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-[#F2F0ED] px-3 py-2.5 text-[12px] font-black text-[#221816]">
            <Navigation className="h-4 w-4 text-[#A97824]" />
            Olib ketish
          </button>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-[22px] bg-[#2A211C] shadow-sm">
        <div className="relative min-h-[110px] p-4 text-white">
          <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#C89438]/35 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#EFD9AE]">
                Damirchi taklifi
              </p>
              <h2 className="max-w-[250px] text-[22px] font-black leading-[1.05]">
                Sevimli taomlaringiz bir necha bosishda
              </h2>
              <p className="mt-2 text-[11px] font-semibold text-white/75">
                Dastavka {formatPrice(deliveryPrice)}
                {minOrderAmount > 0 ? ` · minimal ${formatPrice(minOrderAmount)}` : ""}
              </p>
            </div>

            <div className="flex h-16 w-16 shrink-0 rotate-3 items-center justify-center rounded-3xl bg-[#C89438] text-3xl shadow-xl">
              🍽️
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#78716C]">
        <Clock3 className="h-3.5 w-3.5 text-[#A97824]" />
        Taxminiy yetkazish vaqti: 30–45 daqiqa
      </div>
    </section>
  );
}
