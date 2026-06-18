import React from "react";
import { Search, X } from "lucide-react";

import { hapticFeedback } from "../telegram/telegram";

export default function SearchBar({
  value = "",
  onChange,
  placeholder = "Taomlarni qidirish...",
}) {
  const handleChange = (event) => {
    onChange?.(event.target.value);
  };

  const handleClear = () => {
    hapticFeedback("light");
    onChange?.("");
  };

  return (
    <section className="mt-4 px-4">
      <div className="relative flex h-[50px] items-center overflow-hidden rounded-[18px] border border-[#E9E3DA] bg-white shadow-[0_10px_26px_-24px_rgba(36,24,18,0.5)]">
        <Search className="pointer-events-none absolute left-4 h-[19px] w-[19px] text-[#A97824]" />

        <input
          type="search"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          className="h-full w-full bg-transparent py-3 pl-12 pr-12 text-[14px] font-bold text-[#241812] outline-none placeholder:font-semibold placeholder:text-[#A59B92]"
          aria-label="Taomlarni qidirish"
        />

        {value.trim() && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 flex h-8 w-8 items-center justify-center rounded-[11px] bg-[#FFF0D3] text-[#A97824] transition active:scale-90"
            aria-label="Qidiruvni tozalash"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
}