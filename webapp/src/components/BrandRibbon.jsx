import React from 'react';
import { BadgeCheck, ChefHat, MessageCircle, WalletCards } from 'lucide-react';

const items = [
  { icon: ChefHat, title: 'Oshxona', subtitle: 'issiq tayyorlanadi' },
  { icon: MessageCircle, title: 'Operator', subtitle: 'tez tasdiqlaydi' },
  { icon: WalletCards, title: 'To‘lov', subtitle: 'naqd yoki karta' },
  { icon: BadgeCheck, title: 'Sifat', subtitle: 'restoran nazorati' }
];

export default function BrandRibbon() {
  return (
    <section className="px-5 mt-5">
      <div className="grid grid-cols-2 gap-2.5">
        {items.map(({ icon: Icon, title, subtitle }) => (
          <div
            key={title}
            className="relative overflow-hidden rounded-2xl bg-[#1C1511]/82 border border-[#D99A2B]/12 p-3.5 shadow-md"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(217,154,43,0.12),transparent_38%)]" />
            <div className="relative flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#D99A2B]/12 border border-[#D99A2B]/18 flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#D99A2B]" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black text-[#F5EFE6] leading-none">{title}</p>
                <p className="text-[8.5px] font-bold text-[#A8988C] uppercase tracking-wide mt-1 truncate">{subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
