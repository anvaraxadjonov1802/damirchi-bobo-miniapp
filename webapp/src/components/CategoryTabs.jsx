import React from "react";
import { Grid2X2 } from "lucide-react";
import { hapticFeedback } from "../telegram/telegram";

export default function CategoryTabs({
  categories,
  activeCategoryId,
  onCategoryChange,
}) {
  const handleSelect = (id) => {
    hapticFeedback("light");

    if (onCategoryChange) {
      onCategoryChange(id);
    }
  };

  return (
    <div className="w-full mt-3 flex flex-col gap-2">
      <div className="px-4 flex items-center justify-between">
        <span className="text-[9px] font-black text-[#A97824] uppercase tracking-[0.18em] opacity-90">
          Kategoriyalar
        </span>

        <span className="text-[9px] text-[#776B60] font-black uppercase tracking-widest">
          {categories.length} bo‘lim
        </span>
      </div>

      <div className="w-full overflow-x-auto no-scrollbar flex items-center gap-2 px-4 pb-1.5">
        <button
          type="button"
          onClick={() => handleSelect(null)}
          className={`shrink-0 h-10 px-3.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-200 border cursor-pointer active:scale-[0.98] flex items-center gap-2 ${
            activeCategoryId === null
              ? "bg-[#C89438] text-white border-[#C89438] shadow-lg shadow-[#C89438]/10"
              : "bg-white/70 text-[#2C211A] border-[#E9DCC7] hover:bg-white"
          }`}
        >
          <Grid2X2
            className={`w-4 h-4 ${
              activeCategoryId === null ? "text-white" : "text-[#A97824]"
            }`}
          />

          <span>Barchasi</span>
        </button>

        {categories.map((category) => {
          const isActive = activeCategoryId === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleSelect(category.id)}
              className={`shrink-0 h-10 max-w-[150px] px-3.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-200 border cursor-pointer active:scale-[0.98] relative ${
                isActive
                  ? "bg-[#C89438] text-white border-[#C89438] shadow-lg shadow-[#C89438]/10"
                  : "bg-white/70 text-[#2C211A] border-[#E9DCC7] hover:bg-white"
              }`}
            >
              <span className="block truncate">{category.name_uz}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}