import React from "react";
import {
  Clock3,
  Flame,
  ShieldCheck,
  Sparkles,
  Truck,
  Utensils,
  MapPinned,
} from "lucide-react";

import { formatPrice } from "../utils/format";

const highlights = [
  { icon: Clock3, label: "30–45 daqiqa", value: "tezkor" },
  { icon: ShieldCheck, label: "Operator", value: "tasdiqlaydi" },
];

export default function HeroSection({ settings }) {
  const restaurantName = settings?.restaurant_name || "Damirchi";
  const tagline = settings?.tagline || "Mazali taomlar, tezkor buyurtma";
  const address = settings?.address || "Toshkent";
  const deliveryPrice = Number(settings?.delivery_price ?? 15000);
  const minOrderAmount = Number(settings?.min_order_amount || 0);
  const isOpen = settings?.is_open !== false;

  return (
    <section className="relative mx-4 mt-3 overflow-hidden rounded-[1.8rem] border border-[#E9DCC7] bg-white text-[#2C211A] shadow-[0_18px_46px_-34px_rgba(44,33,26,0.45)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(200,148,56,0.16),transparent_34%),radial-gradient(circle_at_92%_55%,rgba(200,148,56,0.10),transparent_36%),linear-gradient(135deg,rgba(255,250,242,0.92),rgba(255,255,255,0.45)_48%,rgba(244,234,219,0.55))]" />

      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #A97824 12.5%, transparent 12.5%, transparent 50%, #A97824 50%, #A97824 62.5%, transparent 62.5%, transparent 100%)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-[#C89438]/18" />
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full border border-[#C89438]/14" />

      <div className="relative z-10 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div
              className={`mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] ${
                isOpen
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-600"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>{isOpen ? "Buyurtma ochiq" : "Hozir yopiq"}</span>
            </div>

            <h1 className="font-serif text-[2rem] font-black leading-[0.95] tracking-tight text-[#2C211A]">
              {restaurantName}
            </h1>

            <p className="mt-2 text-[13px] font-black leading-snug text-[#4B3628]">
              {tagline}
            </p>

            <p className="mt-1.5 max-w-[230px] text-[11px] font-semibold leading-snug text-[#776B60]">
              Sevimli taomlaringizni Telegram ichida tez va qulay buyurtma
              qiling.
            </p>
          </div>

          <div className="relative shrink-0 pt-2">
            <div className="flex h-[72px] w-[72px] rotate-3 items-center justify-center rounded-[1.55rem] border border-[#EFD9AE] bg-[#C89438] text-white shadow-xl shadow-[#C89438]/20">
              <Utensils className="h-8 w-8" />
            </div>

            <div className="absolute -bottom-2 -left-3 flex items-center gap-1 rounded-2xl border border-[#E9DCC7] bg-white px-2 py-1.5 shadow-lg">
              <Flame className="h-3.5 w-3.5 text-[#C89438]" />
              <span className="text-[9px] font-black text-[#2C211A]">
                issiq
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {highlights.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="min-h-[58px] rounded-2xl border border-[#E9DCC7] bg-white/76 px-3 py-2.5 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-[#A97824]" />

                <div className="min-w-0">
                  <p className="truncate text-[10px] font-black leading-tight text-[#2C211A]">
                    {label}
                  </p>

                  <p className="mt-0.5 text-[8px] font-bold uppercase tracking-wide text-[#776B60]">
                    {value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-4 mb-4 flex items-center justify-between gap-3 rounded-2xl border border-[#E9DCC7] bg-[#FFFAF2] px-3.5 py-3 shadow-sm">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C89438] text-white">
            <Truck className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-black leading-tight text-[#2C211A]">
              Dastavka: {formatPrice(deliveryPrice)}
            </p>

            <p className="mt-0.5 truncate text-[9px] font-bold text-[#776B60]">
              {minOrderAmount > 0
                ? `Minimal: ${formatPrice(minOrderAmount)}`
                : "Naqd yoki karta"}
            </p>
          </div>
        </div>

        <div className="flex max-w-[120px] shrink-0 items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#A97824]">
          <MapPinned className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{address}</span>
        </div>
      </div>
    </section>
  );
}