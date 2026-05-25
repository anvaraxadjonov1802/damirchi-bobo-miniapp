import React from 'react';
import { ChefHat, Minus, Plus, Star } from 'lucide-react';
import { formatPrice } from '../utils/format';
import { client } from '../api/client';
import { hapticFeedback } from '../telegram/telegram';

function ProductBadge({ product }) {
  if (product.sort_order === 1) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#D99A2B] text-[#120E0B] px-2.5 py-1 text-[8px] font-black uppercase tracking-wider">
        <ChefHat className="w-3 h-3" /> Chef
      </span>
    );
  }

  if (Number(product.price) >= 45000) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#120E0B]/82 text-[#D99A2B] border border-[#D99A2B]/25 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider backdrop-blur">
        <Star className="w-3 h-3" /> Premium
      </span>
    );
  }

  return null;
}

export default function ProductCard({ product, quantity = 0, onAdd, onIncrease, onDecrease, onDetails }) {
  const isAvailable = product.is_available !== false;
  const imageSrc = client.getImageUrl(product.image);

  const handleCardClick = (event) => {
    if (event.target.closest('.qty-control') || event.target.closest('.add-btn')) return;
    hapticFeedback('light');
    onDetails?.(product);
  };

  const handleAddClick = (event) => {
    event.stopPropagation();
    if (!isAvailable) return;
    hapticFeedback('success');
    onAdd?.(product);
  };

  const handleIncrease = (event) => {
    event.stopPropagation();
    hapticFeedback('light');
    onIncrease?.(product.id);
  };

  const handleDecrease = (event) => {
    event.stopPropagation();
    hapticFeedback('light');
    onDecrease?.(product.id);
  };

  return (
    <article
      onClick={handleCardClick}
      className={`group relative overflow-hidden rounded-[1.65rem] bg-[#1C1511] border border-[#D99A2B]/13 shadow-lg shadow-black/25 transition-all duration-300 active:scale-[0.992] cursor-pointer ${
        isAvailable ? 'hover:border-[#D99A2B]/45' : 'opacity-65'
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(217,154,43,0.08),transparent_35%)] pointer-events-none" />

      <div className="relative z-10 p-3 flex gap-3.5">
        <div className="relative w-[124px] h-[124px] shrink-0 rounded-[1.35rem] overflow-hidden bg-[#120E0B] border border-[#D99A2B]/10">
          <img
            src={imageSrc}
            alt={product.name_uz}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute left-2 bottom-2">
            <ProductBadge product={product} />
          </div>
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-red-950/90 text-red-200 border border-red-800 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                Mavjud emas
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[8.5px] font-black text-[#D99A2B] uppercase tracking-[0.16em] truncate">
                {product.category_name || 'Damirchi menyusi'}
              </span>
            </div>

            <h3 className="font-serif font-black text-[#F5EFE6] text-[17px] leading-tight tracking-tight line-clamp-2">
              {product.name_uz}
            </h3>
            <p className="text-[#A8988C] text-[11px] leading-relaxed mt-1.5 line-clamp-2 font-medium">
              {product.description_uz || 'Damirchi oshxonasi uslubida tayyorlangan mazali taom.'}
            </p>
          </div>

          <div className="flex items-end justify-between gap-3 mt-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.14em] font-black text-[#A8988C]">Narxi</p>
              <p className="font-serif font-black text-[#D99A2B] text-[17px] leading-none mt-0.5">
                {formatPrice(product.price)}
              </p>
            </div>

            {isAvailable && (
              quantity > 0 ? (
                <div className="qty-control flex items-center bg-[#120E0B] rounded-2xl p-1 text-[#F5EFE6] shadow-inner border border-[#D99A2B]/12">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#1C1511] text-[#D99A2B] active:scale-90 transition-all"
                    aria-label="Kamaytirish"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-7 text-center text-sm font-black text-[#F5EFE6]">{quantity}</span>
                  <button
                    type="button"
                    onClick={handleIncrease}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#D99A2B] text-[#120E0B] active:scale-90 transition-all"
                    aria-label="Ko‘paytirish"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAddClick}
                  className="add-btn h-10 px-4 bg-[#D99A2B] text-[#120E0B] rounded-2xl flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-lg shadow-[#D99A2B]/10 font-black text-[11px]"
                >
                  <Plus className="w-4 h-4" />
                  Qo‘shish
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
