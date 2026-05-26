import React from "react";
import { Search, X } from "lucide-react";
import { hapticFeedback } from "../telegram/telegram";

export default function SearchBar({ value, onChange }) {
  const handleClear = () => {
    hapticFeedback("light");
    onChange("");
  };

  return (
    <div className="px-4 mt-3">
      <div className="relative flex items-center bg-[#1C1511] border border-[#D99A2B]/14 rounded-2xl shadow-md focus-within:ring-2 focus-within:ring-[#D99A2B]/35 focus-within:border-[#D99A2B]/70 transition-all">
        <Search className="absolute left-4 w-4.5 h-4.5 text-[#A8988C] opacity-75 pointer-events-none" />

        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Taom qidirish..."
          className="w-full pl-11 pr-11 py-3.5 text-[15px] text-[#F5EFE6] placeholder-[#A8988C]/55 bg-transparent focus:outline-none font-semibold"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 w-8 h-8 flex items-center justify-center rounded-xl bg-[#F5EFE6]/8 hover:bg-[#F5EFE6]/14 text-[#A8988C] transition-colors active:scale-95"
            aria-label="Qidiruvni tozalash"
          >
            <X className="w-4 h-4 text-[#F5EFE6]" />
          </button>
        )}
      </div>
    </div>
  );
}