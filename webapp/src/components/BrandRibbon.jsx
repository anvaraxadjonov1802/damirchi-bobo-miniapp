import React from "react";
import { BadgeCheck, ChefHat, MessageCircle, WalletCards } from "lucide-react";

const items = [
  { icon: ChefHat, title: "Issiq taom" },
  { icon: MessageCircle, title: "Operator" },
  { icon: WalletCards, title: "Naqd / karta" },
  { icon: BadgeCheck, title: "Sifat nazorati" },
];

export default function BrandRibbon() {
  return (
    <section className="px-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {items.map(({ icon: Icon, title }) => (
          <div
            key={title}
            className="shrink-0 relative overflow-hidden rounded-2xl bg-[#1C1511]/82 border border-[#D99A2B]/12 px-3 py-2 shadow-md"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(217,154,43,0.12),transparent_38%)]" />

            <div className="relative flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#D99A2B]/12 border border-[#D99A2B]/18 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#D99A2B]" />
              </div>

              <p className="text-[11px] font-black text-[#F5EFE6] whitespace-nowrap leading-none">
                {title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}