import React from "react";
import { Utensils } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#120E0B] flex flex-col items-center justify-center p-6 z-50 animate-fade-in text-[#F5EFE6] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.055] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#D99A2B 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full border border-[#D99A2B]/10" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full border border-[#D99A2B]/10" />

      <div className="relative flex flex-col items-center max-w-xs text-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full border-2 border-[#D99A2B]/10 border-t-[#D99A2B] animate-spin" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#1C1511] border border-[#D99A2B]/15 shadow-lg flex items-center justify-center">
              <Utensils className="w-7 h-7 text-[#D99A2B]" />
            </div>
          </div>
        </div>

        <h1 className="font-serif text-3xl font-black leading-none text-[#F5EFE6]">
          Damirchi
        </h1>

        <p className="text-[#D99A2B] text-[10px] font-black uppercase tracking-[0.2em] mt-2 mb-6">
          Online menu
        </p>

        <div className="w-40 h-1 bg-[#D99A2B]/10 rounded-full overflow-hidden mb-3.5">
          <div className="h-full w-1/2 bg-[#D99A2B] rounded-full animate-loading-bar" />
        </div>

        <p className="text-[#A8988C] text-xs font-bold uppercase tracking-wider animate-pulse">
          Menyu yuklanmoqda...
        </p>
      </div>
    </div>
  );
}