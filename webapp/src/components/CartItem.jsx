import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatPrice } from '../utils/format';
import { client } from '../api/client';
import { hapticFeedback } from '../telegram/telegram';

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const { product, quantity } = item;
  const imageSrc = client.getImageUrl(product.image);

  const handleDecrease = () => {
    hapticFeedback('light');
    if (quantity === 1) {
      if (onRemove) onRemove(product.id);
    } else {
      if (onDecrease) onDecrease(product.id);
    }
  };

  const handleIncrease = () => {
    hapticFeedback('light');
    if (onIncrease) onIncrease(product.id);
  };

  const handleRemove = () => {
    hapticFeedback('error');
    if (onRemove) onRemove(product.id);
  };

  return (
    <div className="flex items-center gap-3.5 p-4 bg-[#1C1511] border border-[#D99A2B]/12 rounded-[1.4rem] shadow-md mb-3 hover:border-[#D99A2B]/40 transition-all duration-200">
      {/* Product Mini Image */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#120E0B] border border-[#D99A2B]/10 flex-shrink-0">
        <img
          src={imageSrc}
          alt={product.name_uz}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Item info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-serif font-black text-[#F5EFE6] text-sm tracking-tight leading-snug truncate">
          {product.name_uz}
        </h4>
        <p className="text-[#A8988C] text-[11px] font-medium mt-0.5">
          {formatPrice(product.price)} / dona
        </p>
        
        {/* Line Total */}
        <p className="font-sans font-black text-xs text-[#D99A2B] mt-1">
          {formatPrice(product.price * quantity)}
        </p>
      </div>

      {/* Steppers & Delete column */}
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={handleRemove}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-950/30 text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-colors border border-red-900/40 cursor-pointer"
          title="O‘chirish"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Adjust stepper controls */}
        <div className="flex items-center bg-[#120E0B] border border-[#D99A2B]/10 rounded-xl px-1.5 py-1 text-[#F5EFE6]">
          <button
            onClick={handleDecrease}
            className="w-5.5 h-5.5 flex items-center justify-center rounded-md hover:bg-neutral-800 text-[#D99A2B] active:scale-90 transition-all font-bold cursor-pointer"
            aria-label="Kamaytirish"
          >
            <Minus className="w-3 h-3" />
          </button>
          
          <span className="w-6 text-center text-xs font-black text-[#F5EFE6]">
            {quantity}
          </span>
          
          <button
            onClick={handleIncrease}
            className="w-5.5 h-5.5 flex items-center justify-center rounded-md hover:bg-neutral-800 text-[#D99A2B] active:scale-90 transition-all font-bold cursor-pointer"
            aria-label="Ko'paytirish"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
