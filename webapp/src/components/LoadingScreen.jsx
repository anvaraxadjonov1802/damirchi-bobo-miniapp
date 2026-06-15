import React from "react";
import { Utensils } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#FFFAF2] flex flex-col items-center justify-center p-6 z-50 animate-fade-in text-[#2C211A] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.055] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#C89438 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full border border-[#E9DCC7]" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full border border-[#E9DCC7]" />

      <div className="relative flex flex-col items-center max-w-xs text-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full border-2 border-[#E9DCC7] border-t-[#C89438] animate-spin" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white border border-[#E9DCC7] shadow-lg flex items-center justify-center">
              <Utensils className="w-7 h-7 text-[#A97824]" />
            </div>
          </div>
        </div>

        <h1 className="font-serif text-3xl font-black leading-none text-[#2C211A]">
          Damirchi
        </h1>

        <p className="text-[#A97824] text-[10px] font-black uppercase tracking-[0.2em] mt-2 mb-6">
          Online menu
        </p>

        <div className="w-40 h-1 bg-[#C89438]/10 rounded-full overflow-hidden mb-3.5">
          <div className="h-full w-1/2 bg-[#C89438] rounded-full animate-loading-bar" />
        </div>

        <p className="text-[#776B60] text-xs font-bold uppercase tracking-wider animate-pulse">
          Menyu yuklanmoqda...
        </p>
      </div>
    </div>
  );
}