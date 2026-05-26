import React from "react";
import { hapticFeedback } from "../telegram/telegram";

export default function OptionSelector({
  options,
  selectedValue,
  onChange,
  label,
  compact = false,
}) {
  const handleSelect = (value) => {
    hapticFeedback("medium");
    onChange(value);
  };

  return (
    <div className={compact ? "flex flex-col gap-2" : "flex flex-col gap-2.5"}>
      {label && (
        <label className="text-base font-black text-[#F5EFE6] pl-1">
          {label}
        </label>
      )}

      <div className="grid grid-cols-2 gap-2.5">
        {options.map((option) => {
          const isActive = selectedValue === option.value;
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`flex items-center justify-center gap-2 rounded-2xl border transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                compact ? "px-3 py-3" : "px-3.5 py-3.5"
              } ${
                isActive
                  ? "bg-[#D99A2B] border-[#FFE2A3]/40 text-[#120E0B] shadow-lg shadow-[#D99A2B]/10"
                  : "bg-[#120E0B] border-[#D99A2B]/16 text-[#F5EFE6] hover:border-[#D99A2B]/35"
              }`}
            >
              {Icon && (
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? "text-[#120E0B]" : "text-[#D99A2B]"
                  }`}
                />
              )}

              <span className="text-sm font-black tracking-wide truncate">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}