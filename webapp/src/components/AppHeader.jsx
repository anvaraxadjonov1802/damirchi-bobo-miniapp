import React from 'react';
import { ShoppingBag, ChevronLeft, Sparkles } from 'lucide-react';
import { hapticFeedback } from '../telegram/telegram';

const titles = {
  cart: 'Savat',
  checkout: 'Rasmiylashtirish',
  success: 'Buyurtma'
};

export default function AppHeader({ cartCount, onCartClick, currentScreen, onBackClick, settings }) {
  const triggerCart = () => {
    hapticFeedback('light');
    if (onCartClick) onCartClick();
  };

  const triggerBack = () => {
    hapticFeedback('light');
    if (onBackClick) onBackClick();
  };

  const showBackButton = currentScreen !== 'menu';
  const restaurantName = settings?.restaurant_name || 'Damirchi ';
  const isOpen = settings?.is_open !== false;
  const statusLabel = isOpen ? 'Ochiq · buyurtma qabul qilinadi' : 'Yopiq · hozir buyurtma olinmaydi';

  return (
    <header className="sticky top-0 bg-[#120E0B]/82 backdrop-blur-xl border-b border-[#D99A2B]/15 px-5 py-3.5 flex items-center justify-between z-30 transition-all safe-top">
      <div className="flex items-center gap-3 min-w-0">
        {showBackButton ? (
          <button
            onClick={triggerBack}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1C1511] border border-[#D99A2B]/20 active:scale-90 transition-all cursor-pointer shrink-0"
            aria-label="Orqaga"
          >
            <ChevronLeft className="w-5 h-5 text-[#F5EFE6]" />
          </button>
        ) : (
          <div className="w-10 h-10 rounded-[1.05rem] bg-[#D99A2B] flex items-center justify-center font-serif font-black text-[#120E0B] text-base shadow-lg shadow-[#D99A2B]/10 shrink-0 rotate-[-3deg]">
            DB
          </div>
        )}
        
        {!showBackButton ? (
          <div className="flex flex-col min-w-0">
            <span className="font-serif font-extrabold text-base tracking-tight text-[#F5EFE6] truncate">
              {restaurantName}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.35)]'}`} />
              <span className={`text-[9px] font-bold uppercase tracking-widest leading-none ${isOpen ? 'text-emerald-400' : 'text-red-300'}`}>
                {statusLabel}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col min-w-0">
            <span className="font-serif font-extrabold text-base tracking-tight text-[#F5EFE6] truncate">
              {titles[currentScreen] || restaurantName}
            </span>
            <span className="text-[9px] font-bold text-[#A8988C] uppercase tracking-widest mt-0.5">
              Telegram Mini App
            </span>
          </div>
        )}
      </div>

      {currentScreen === 'menu' && (
        <button
          onClick={triggerCart}
          className="relative min-w-10 h-10 bg-[#1C1511] border border-[#D99A2B]/20 rounded-xl flex items-center justify-center transition-all active:scale-90 cursor-pointer px-3 gap-2"
        >
          {cartCount > 0 && <span className="text-[10px] font-black text-[#D99A2B] uppercase tracking-wider">Savat</span>}
          <ShoppingBag className="w-4.5 h-4.5 text-[#D99A2B]" />
          {cartCount > 0 ? (
            <span className="absolute -top-1.5 -right-1.5 bg-[#D99A2B] text-[#120E0B] text-[10px] font-black min-w-5 h-5 px-1 rounded-full flex items-center justify-center animate-scale-in border-2 border-[#120E0B] shadow-md">
              {cartCount}
            </span>
          ) : (
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-[#D99A2B]" />
          )}
        </button>
      )}
    </header>
  );
}
