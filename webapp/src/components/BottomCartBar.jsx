import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/format';
import { hapticFeedback } from '../telegram/telegram';

export default function BottomCartBar({ count, totalPrice, onClick }) {
  if (count === 0) return null;

  const handleBarClick = () => {
    hapticFeedback('medium');
    if (onClick) onClick();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#120E0B] via-[#120E0B]/95 to-transparent pt-10 z-40 flex justify-center">
      <button
        onClick={handleBarClick}
        className="w-full max-w-[448px] bg-[#1C1511] hover:bg-[#251D18] text-[#F5EFE6] rounded-3xl h-16 px-6 flex items-center justify-between shadow-2xl transition-all active:scale-[0.98] border border-[#D99A2B]/25 relative overflow-hidden group cursor-pointer"
      >
        {/* Shine hover detail */}
        <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
        
        <div className="flex items-center gap-3">
          <div className="bg-[#D99A2B] w-8 h-8 rounded-xl flex items-center justify-center text-[#120E0B] text-xs font-black italic relative shadow-md shadow-[#D99A2B]/10">
            {count}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#D99A2B]/75 leading-none">
              Savat
            </span>
            <span className="font-sans font-black text-sm text-[#F5EFE6] mt-0.5">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#D99A2B]">
          <span className="uppercase tracking-tight text-[11px] font-black">Ko'rish</span>
          <ArrowRight className="w-4 h-4 text-[#D99A2B] group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    </div>
  );
}
