import React from 'react';
import { Utensils } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#120E0B] flex flex-col items-center justify-center p-6 z-50 animate-fade-in text-[#F5EFE6]">
      {/* Decorative backdrop patterns */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
        backgroundImage: `radial-gradient(#D99A2B 1px, transparent 1px)`,
        backgroundSize: '16px 16px'
      }} />
      
      <div className="flex flex-col items-center max-w-xs text-center relative">
        {/* Animated outer ring */}
        <div className="w-24 h-24 rounded-full border-2 border-[#D99A2B]/10 border-t-[#D99A2B] flex items-center justify-center animate-spin relative mb-6">
          <div className="w-18 h-18 rounded-full border border-dashed border-[#D99A2B]/20" />
        </div>
        
        {/* Inner static emblem */}
        <div className="absolute top-7 bg-[#1C1511] w-14 h-14 rounded-full flex items-center justify-center shadow-lg border border-[#D99A2B]/15">
          <Utensils className="w-6 h-6 text-[#D99A2B]" />
        </div>
        
        <h1 className="font-serif text-3xl font-light italic mb-2">
          Damirchi <span className="font-bold text-[#D99A2B] not-italic">BOBO</span>
        </h1>
        <p className="text-[#D99A2B] text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          Milliy & Turk Taomlari
        </p>
        
        {/* Progress bar animation */}
        <div className="w-40 h-1 bg-[#D99A2B]/10 rounded-full overflow-hidden mb-3.5">
          <div className="h-full bg-[#D99A2B] rounded-full" style={{
            width: '45%',
            animation: 'loading-bar 1.5s infinite ease-in-out'
          }} />
        </div>
        
        <p className="text-[#A8988C] text-xs font-semibold uppercase tracking-wider animate-pulse">
          Menyu yuklanmoqda...
        </p>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(50%); }
          100% { transform: translateX(110%); }
        }
      `}</style>
    </div>
  );
}
