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
      <div className="relative flex items-center bg-white border border-[#E9DCC7] rounded-2xl shadow-md focus-within:ring-2 focus-within:ring-[#C89438]/35 focus-within:border-[#C89438]/70 transition-all">
        <Search className="absolute left-4 w-4.5 h-4.5 text-[#776B60] opacity-75 pointer-events-none" />

        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Taom qidirish..."
          className="w-full pl-11 pr-11 py-3.5 text-[15px] text-[#2C211A] placeholder-[#776B60]/55 bg-transparent focus:outline-none font-semibold"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 w-8 h-8 flex items-center justify-center rounded-xl bg-[#2C211A]/5 hover:bg-[#2C211A]/10 text-[#776B60] transition-colors active:scale-95"
            aria-label="Qidiruvni tozalash"
          >
            <X className="w-4 h-4 text-[#2C211A]" />
          </button>
        )}
      </div>
    </div>
  );
}