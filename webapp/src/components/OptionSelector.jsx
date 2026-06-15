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
        <label className="text-base font-black text-[#2C211A] pl-1">
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
                  ? "bg-[#C89438] border-[#FFE2A3]/40 text-white shadow-lg shadow-[#C89438]/10"
                  : "bg-[#FFFAF2] border-[#C89438]/16 text-[#2C211A] hover:border-[#C89438]/35"
              }`}
            >
              {Icon && (
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? "text-white" : "text-[#A97824]"
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