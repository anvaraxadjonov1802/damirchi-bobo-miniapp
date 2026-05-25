import React from 'react';
import { ShoppingBasket } from 'lucide-react';
import { hapticFeedback } from '../telegram/telegram';

export default function EmptyState({ title = "Savat hozircha bo‘sh", description = "Menyudan o‘zingizga yoqqan lazzatli taomlarni tanlang va savatga qo‘shing.", buttonText = "Menyuga qaytish", onAction }) {
  const handleAction = () => {
    hapticFeedback('light');
    if (onAction) onAction();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 py-14 text-center bg-[#1C1511] rounded-[2rem] border border-[#D99A2B]/12 shadow-lg max-w-sm mx-auto my-12 animate-fade-in">
      {/* Visual icon */}
      <div className="w-20 h-20 bg-[#120E0B] rounded-full flex items-center justify-center border border-[#D99A2B]/12 mb-5 relative">
        <ShoppingBasket className="w-9 h-9 text-[#D99A2B]" />
        <span className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#D99A2B] animate-ping" />
      </div>

      <h3 className="font-serif font-black text-lg text-[#F5EFE6] mb-2.5">
        {title}
      </h3>

      <p className="text-[#A8988C] text-xs leading-relaxed mb-8 max-w-[280px] font-medium">
        {description}
      </p>

      {onAction && (
        <button
          onClick={handleAction}
          className="w-full py-4 bg-[#D99A2B] hover:bg-[#C98A1F] text-[#120E0B] rounded-2xl text-xs font-black transition-all active:scale-[0.98] shadow-md cursor-pointer"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
