import React from "react";
import { BadgeCheck, ChefHat, MessageCircle, WalletCards } from "lucide-react";

const items = [
  { icon: ChefHat, title: "Issiq" },
  { icon: BadgeCheck, title: "Sifat" },
  { icon: WalletCards, title: "To‘lov" },
  { icon: MessageCircle, title: "Operator" },
];

export default function BrandRibbon() {
  return (
    <section className="px-4 pt-3">
      <div className="grid grid-cols-4 gap-2">
        {items.map(({ icon: Icon, title }) => (
          <div key={title} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white px-2 py-2.5 shadow-sm ring-1 ring-[#E8E2DA]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4EEE6]">
              <Icon className="h-4 w-4 text-[#A97824]" />
            </div>
            <p className="w-full truncate text-center text-[10px] font-black text-[#221816]">
              {title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
