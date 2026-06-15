import React from "react";
import { Grid2X2, Utensils } from "lucide-react";
import { hapticFeedback } from "../telegram/telegram";

export default function CategoryTabs({ categories, activeCategoryId, onCategoryChange }) {
  const handleSelect = (id) => {
    hapticFeedback("light");
    onCategoryChange?.(id);
  };

  return (
    <div className="sticky top-[64px] z-30 mt-3 border-y border-[#E8E2DA] bg-[#F6F6F7]/95 py-2 backdrop-blur-xl">
      <div className="flex gap-2 overflow-x-auto px-4 no-scrollbar">
        <button
          type="button"
          onClick={() => handleSelect(null)}
          className={`flex min-w-[78px] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-center transition active:scale-[0.98] ${
            activeCategoryId === null ? "bg-[#C89438] text-white" : "bg-white text-[#221816] ring-1 ring-[#E8E2DA]"
          }`}
        >
          <Grid2X2 className="h-4 w-4" />
          <span className="max-w-[70px] truncate text-[10px] font-black">Barchasi</span>
        </button>

        {categories.map((category) => {
          const isActive = activeCategoryId === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleSelect(category.id)}
              className={`flex min-w-[78px] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-center transition active:scale-[0.98] ${
                isActive ? "bg-[#C89438] text-white" : "bg-white text-[#221816] ring-1 ring-[#E8E2DA]"
              }`}
            >
              <Utensils className={`h-4 w-4 ${isActive ? "text-white" : "text-[#A97824]"}`} />
              <span className="max-w-[70px] truncate text-[10px] font-black">
                {category.name_uz}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
