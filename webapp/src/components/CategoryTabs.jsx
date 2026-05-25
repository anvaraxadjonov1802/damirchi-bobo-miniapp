import React from 'react';
import { Grid2X2 } from 'lucide-react';
import { hapticFeedback } from '../telegram/telegram';
import { client } from '../api/client';

export default function CategoryTabs({ categories, activeCategoryId, onCategoryChange }) {
  const handleSelect = (id) => {
    hapticFeedback('light');
    if (onCategoryChange) {
      onCategoryChange(id);
    }
  };

  return (
    <div className="w-full mt-6 flex flex-col gap-2.5">
      <div className="px-5 flex items-center justify-between">
        <span className="text-[10px] font-bold text-[#D99A2B] uppercase tracking-[0.2em] opacity-80">
          Kategoriyalar
        </span>
        <span className="text-[9px] text-[#A8988C] font-bold uppercase tracking-widest">
          {categories.length} bo‘lim
        </span>
      </div>
      
      <div className="w-full overflow-x-auto no-scrollbar flex items-center gap-2.5 px-5 pb-2">
        <button
          onClick={() => handleSelect(null)}
          className={`min-w-[98px] h-[76px] px-4 rounded-3xl text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer overflow-hidden relative ${
            activeCategoryId === null
              ? 'bg-[#D99A2B] text-[#120E0B] border-[#D99A2B] shadow-lg shadow-[#D99A2B]/10'
              : 'bg-[#1C1511]/65 text-[#A8988C] border-[#D99A2B]/10 hover:bg-[#1C1511]'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Grid2X2 className="w-5 h-5" />
            <span>Barchasi</span>
          </div>
        </button>

        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          const imageUrl = cat.image ? client.getImageUrl(cat.image) : null;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`min-w-[118px] h-[76px] rounded-3xl text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer overflow-hidden relative ${
                isActive
                  ? 'bg-[#1C1511] text-[#D99A2B] border-[#D99A2B]/50 shadow-md shadow-black/20'
                  : 'bg-[#1C1511]/55 text-[#F5EFE6] border-[#D99A2B]/10 hover:bg-[#1C1511]/80'
              }`}
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={cat.name_uz}
                  className="absolute inset-0 w-full h-full object-cover opacity-25"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#120E0B]/95 via-[#120E0B]/50 to-transparent" />
              <span className="absolute left-3 right-3 bottom-3 line-clamp-2 leading-tight text-left">
                {cat.name_uz}
              </span>
              {isActive && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#D99A2B] shadow-[0_0_12px_rgba(217,154,43,0.75)]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
