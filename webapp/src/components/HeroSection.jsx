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
    <section className="mx-4 mt-3 relative overflow-hidden rounded-[1.8rem] bg-[#1C1511] text-[#F5EFE6] shadow-2xl border border-[#D99A2B]/22">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(217,154,43,0.24),transparent_34%),radial-gradient(circle_at_92%_55%,rgba(201,138,31,0.14),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_35%)]" />

      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #D99A2B 12.5%, transparent 12.5%, transparent 50%, #D99A2B 50%, #D99A2B 62.5%, transparent 62.5%, transparent 100%)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full border border-[#D99A2B]/18" />
      <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full border border-[#D99A2B]/14" />

      <div className="relative z-10 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.16em] border mb-3 ${
                isOpen
                  ? "bg-emerald-950/30 text-emerald-300 border-emerald-700/35"
                  : "bg-red-950/30 text-red-300 border-red-700/35"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{isOpen ? "Buyurtma ochiq" : "Hozir yopiq"}</span>
            </div>

            <h1 className="font-serif text-[2rem] leading-[0.95] font-black tracking-tight text-[#F5EFE6]">
              {restaurantName}
            </h1>

            <p className="text-[13px] leading-snug text-[#F5EFE6] font-black mt-2">
              {tagline}
            </p>

            <p className="text-[11px] leading-snug text-[#A8988C] font-semibold mt-1.5 max-w-[230px]">
              Sevimli taomlaringizni Telegram ichida tez va qulay buyurtma
              qiling.
            </p>
          </div>

          <div className="relative shrink-0 pt-2">
            <div className="w-[72px] h-[72px] rounded-[1.55rem] bg-[#D99A2B] text-[#120E0B] flex items-center justify-center shadow-xl shadow-[#D99A2B]/20 rotate-3 border border-[#FFE2A3]/40">
              <Utensils className="w-8 h-8" />
            </div>

            <div className="absolute -bottom-2 -left-3 bg-[#120E0B] border border-[#D99A2B]/25 rounded-2xl px-2 py-1.5 flex items-center gap-1 shadow-lg">
              <Flame className="w-3.5 h-3.5 text-[#D99A2B]" />
              <span className="text-[9px] font-black text-[#F5EFE6]">
                issiq
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-4">
          {highlights.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-2xl bg-[#120E0B]/72 border border-[#D99A2B]/13 px-3 py-2.5 min-h-[58px]"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#D99A2B] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-[#F5EFE6] leading-tight truncate">
                    {label}
                  </p>
                  <p className="text-[8px] font-bold text-[#A8988C] uppercase tracking-wide mt-0.5">
                    {value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-4 mb-4 rounded-2xl bg-[#D99A2B]/10 border border-[#D99A2B]/18 px-3.5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#D99A2B] text-[#120E0B] flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-black text-[#F5EFE6] leading-tight">
              Dastavka: {formatPrice(deliveryPrice)}
            </p>

            <p className="text-[9px] text-[#A8988C] font-bold truncate mt-0.5">
              {minOrderAmount > 0
                ? `Minimal: ${formatPrice(minOrderAmount)}`
                : "Naqd yoki karta"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] font-black text-[#D99A2B] uppercase tracking-widest shrink-0 max-w-[120px]">
          <MapPinned className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{address}</span>
        </div>
      </div>
    </section>
  );
}