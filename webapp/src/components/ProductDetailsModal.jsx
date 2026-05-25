import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../utils/format';
import { client } from '../api/client';
import { hapticFeedback } from '../telegram/telegram';

export default function ProductDetailsModal({ product, currentQuantity = 0, onClose, onUpdateQuantity }) {
  if (!product) return null;

  const [quantity, setQuantity] = useState(currentQuantity || 1);
  const isAvailable = product.is_available !== false;

  // Initialize local quantity to existing quantity, or 1 if not in cart
  useEffect(() => {
    setQuantity(currentQuantity || 1);
  }, [currentQuantity, product]);

  const handleDecrease = () => {
    if (quantity > 1) {
      hapticFeedback('light');
      setQuantity(prev => prev - 1);
    }
  };

  const handleIncrease = () => {
    hapticFeedback('light');
    setQuantity(prev => prev + 1);
  };

  const handleAddToCart = () => {
    hapticFeedback('success');
    if (onUpdateQuantity) {
      onUpdateQuantity(product, quantity);
    }
    onClose();
  };

  const handleRemoveFromCart = () => {
    hapticFeedback('light');
    if (onUpdateQuantity) {
      onUpdateQuantity(product, 0);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-end justify-center backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-[#120E0B] w-full max-w-[480px] rounded-t-[32px] overflow-hidden shadow-2xl border-t border-[#D99A2B]/20 p-6 animate-slide-up flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top visual handle */}
        <div className="mx-auto w-12 h-1 bg-neutral-800 rounded-full mb-4" />

        {/* Content Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D99A2B] bg-[#D99A2B]/10 px-3 py-1.5 rounded-full">
            {product.category_name}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#1C1511] hover:bg-[#2A201A] flex items-center justify-center text-[#A8988C] transition-colors cursor-pointer"
            aria-label="Yopish"
          >
            <X className="w-4 h-4 text-[#F5EFE6]" />
          </button>
        </div>

        {/* Scrollable details container */}
        <div className="overflow-y-auto no-scrollbar flex-1 pb-4">
          {/* Large display image */}
          <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#120E0B] border border-[#D99A2B]/15 mb-4">
            <img
              src={client.getImageUrl(product.image)}
              alt={product.name_uz}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <h3 className="font-serif font-black text-xl text-[#F5EFE6] mb-1 leading-snug">
            {product.name_uz}
          </h3>

          <p className="font-serif font-bold text-lg text-[#D99A2B] mb-4">
            {formatPrice(product.price)}
          </p>

          <p className="text-[#A8988C] text-sm leading-relaxed font-normal bg-[#1C1511] p-4 border border-[#D99A2B]/10 rounded-2xl">
            {product.description_uz || "Maxsus resept asosida pishirilgan betakror milliy taom."}
          </p>
        </div>

        {/* Bottom Actions Frame */}
        {isAvailable ? (
          <div className="pt-4 border-t border-[#D99A2B]/15 flex flex-col gap-3">
            {/* Quantity control panel */}
            <div className="flex items-center justify-between bg-[#1C1511] p-2 rounded-2xl border border-[#D99A2B]/10">
              <span className="text-xs font-bold text-[#A8988C] pl-2 uppercase tracking-wide">
                Soni:
              </span>
              <div className="flex items-center bg-[#120E0B] rounded-xl p-1 text-[#F5EFE6] border border-[#D99A2B]/10">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-800 disabled:opacity-30 transition-all font-bold cursor-pointer"
                >
                  <Minus className="w-4 h-4 text-[#D99A2B]" />
                </button>
                <span className="w-10 text-center text-sm font-extrabold text-[#F5EFE6]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition-all font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#D99A2B]" />
                </button>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex gap-2">
              {currentQuantity > 0 && (
                <button
                  onClick={handleRemoveFromCart}
                  className="px-4.5 py-3.5 border border-[#DC2626]/30 bg-[#DC2626]/10 hover:bg-[#DC2626]/20 text-red-400 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  Olib tashlash
                </button>
              )}
              
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-[#D99A2B] hover:bg-[#C98A1F] text-[#120E0B] rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#D99A2B]/20 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#120E0B]" />
                <span>
                  {currentQuantity > 0 ? "Savatni yangilash" : "Savatga qo‘shish"} — {formatPrice(product.price * quantity)}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 border-t border-[#D99A2B]/15">
            <span className="w-full py-4 bg-[#1C1511] text-[#A8988C] border border-[#D99A2B]/5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
              Ushbu taom vaqtincha mavjud emas
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.15s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
