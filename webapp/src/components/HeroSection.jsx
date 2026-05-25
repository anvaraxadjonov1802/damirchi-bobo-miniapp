import React from 'react';
import { Clock3, Flame, ShieldCheck, Sparkles, Star, Truck, Utensils, MapPinned } from 'lucide-react';
import { formatPrice } from '../utils/format';

const highlights = [
  { icon: Clock3, label: '30–45 daqiqa', value: 'tezkor tayyorlash' },
  { icon: Star, label: 'Premium', value: 'milliy oshxona' },
  { icon: ShieldCheck, label: 'Operator', value: 'tezda tasdiqlaydi' }
];

export default function HeroSection({ settings }) {
  const restaurantName = settings?.restaurant_name || 'Damirchi BOBO';
  const tagline = settings?.tagline || 'Mazali taomlar, tezkor buyurtma';
  const address = settings?.address || 'Toshkent';
  const deliveryPrice = Number(settings?.delivery_price ?? 15000);
  const minOrderAmount = Number(settings?.min_order_amount || 0);
  const isOpen = settings?.is_open !== false;

  return (
    <section className="mx-4 mt-4 relative overflow-hidden rounded-[2.2rem] bg-[#1C1511] text-[#F5EFE6] shadow-2xl border border-[#D99A2B]/25">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_5%,rgba(217,154,43,0.28),transparent_31%),radial-gradient(circle_at_88%_58%,rgba(201,138,31,0.18),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.045),transparent_35%)]" />
      <div
        className="absolute inset-0 opacity-[0.075]"
        style={{
          backgroundImage:
            'linear-gradient(45deg, #D99A2B 12.5%, transparent 12.5%, transparent 50%, #D99A2B 50%, #D99A2B 62.5%, transparent 62.5%, transparent 100%)',
          backgroundSize: '18px 18px'
        }}
      />

      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full border border-[#D99A2B]/20" />
      <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full border border-[#D99A2B]/15" />

      <div className="relative z-10 p-5.5 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-[72%]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D99A2B]/12 text-[#D99A2B] text-[9px] font-black uppercase tracking-[0.18em] border border-[#D99A2B]/18 mb-3">
              <Sparkles className="w-3 h-3" />
              <span>{isOpen ? 'Buyurtma qabul qilinadi' : 'Restoran hozir yopiq'}</span>
            </div>

            <h1 className="font-serif text-[2.25rem] leading-[0.92] font-light italic tracking-tight">
              {restaurantName.replace(' BOBO', '')}
              <br />
              <span className="font-black not-italic text-[#D99A2B]">{restaurantName.includes('BOBO') ? 'BOBO' : 'Restaurant'}</span>
            </h1>

            <p className="text-[13px] leading-relaxed text-[#F5EFE6] font-black mt-3.5">
              {tagline}
            </p>
            <p className="text-[11px] leading-relaxed text-[#CDBBAA] font-semibold mt-1.5">
              Milliy va turk taomlarini Telegram ichida tanlang, savatga qo‘shing va operator tasdiqlovidan o‘tkazing.
            </p>
          </div>

          <div className="relative shrink-0 pt-2">
            <div className="w-22 h-22 rounded-[1.9rem] bg-[#D99A2B] text-[#120E0B] flex items-center justify-center shadow-xl shadow-[#D99A2B]/20 rotate-3 border border-[#FFE2A3]/40">
              <Utensils className="w-9 h-9" />
            </div>
            <div className="absolute -bottom-2 -left-3 bg-[#120E0B] border border-[#D99A2B]/25 rounded-2xl px-2.5 py-1.5 flex items-center gap-1 shadow-lg">
              <Flame className="w-3.5 h-3.5 text-[#D99A2B]" />
              <span className="text-[9px] font-black text-[#F5EFE6]">issiq</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mt-6">
          {highlights.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl bg-[#120E0B]/72 border border-[#D99A2B]/13 p-3 min-h-[78px]">
              <Icon className="w-4 h-4 text-[#D99A2B] mb-2" />
              <p className="text-[10px] font-black text-[#F5EFE6] leading-tight">{label}</p>
              <p className="text-[8px] font-bold text-[#A8988C] uppercase tracking-wide mt-1">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-5 mb-5 rounded-2xl bg-[#D99A2B]/10 border border-[#D99A2B]/18 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#D99A2B] text-[#120E0B] flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-black text-[#F5EFE6]">Dastavka: {formatPrice(deliveryPrice)}</p>
            <p className="text-[9px] text-[#A8988C] font-bold truncate">
              {minOrderAmount > 0 ? `Minimal buyurtma: ${formatPrice(minOrderAmount)}` : 'To‘lov: naqd yoki karta orqali'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-black text-[#D99A2B] uppercase tracking-widest shrink-0">
          <MapPinned className="w-3.5 h-3.5" />
          {address}
        </div>
      </div>
    </section>
  );
}
