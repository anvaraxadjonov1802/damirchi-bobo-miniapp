import React from "react";
import { BadgeCheck, ChefHat, MessageCircle, WalletCards } from "lucide-react";

const items = [
  { icon: ChefHat, title: "Issiq taom", subtitle: "yangi tayyorlanadi" },
  { icon: MessageCircle, title: "Operator", subtitle: "tez tasdiqlaydi" },
  { icon: WalletCards, title: "Naqd / karta", subtitle: "qulay to‘lov" },
  { icon: BadgeCheck, title: "Sifat nazorati", subtitle: "har bir buyurtma" },
];

export default function BrandRibbon() {
  return (
    <section className="px-4">
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {items.map(({ icon: Icon, title, subtitle }) => (
          <div
            key={title}
            className="relative min-w-[142px] shrink-0 overflow-hidden rounded-2xl border border-[#E9DCC7] bg-white px-3 py-2.5 shadow-[0_10px_26px_-22px_rgba(44,33,26,0.38)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(200,148,56,0.11),transparent_42%)]" />

            <div className="relative flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#EFD9AE] bg-[#FFFAF2]">
                <Icon className="h-4 w-4 text-[#A97824]" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[11px] font-black leading-tight text-[#2C211A]">
                  {title}
                </p>

                <p className="mt-0.5 truncate text-[8px] font-bold uppercase tracking-wide text-[#776B60]">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}