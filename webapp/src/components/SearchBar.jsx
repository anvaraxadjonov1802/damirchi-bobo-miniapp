import React from "react";
import { Search, X } from "lucide-react";
import { hapticFeedback } from "../telegram/telegram";

export default function SearchBar({ value, onChange }) {
  const handleClear = () => {
    hapticFeedback("light");
    onChange("");
  };

  return (
    <div className="px-4 pt-3">
      <div className="relative flex items-center rounded-2xl bg-white shadow-sm ring-1 ring-[#E8E2DA] focus-within:ring-[#C89438]/45">
        <Search className="absolute left-4 h-4.5 w-4.5 text-[#78716C]" />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Taom qidirish"
          className="w-full bg-transparent py-3.5 pl-11 pr-11 text-[14px] font-semibold text-[#221816] placeholder:text-[#78716C]/60 focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#F2F0ED] text-[#78716C] active:scale-95"
            aria-label="Qidiruvni tozalash"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
