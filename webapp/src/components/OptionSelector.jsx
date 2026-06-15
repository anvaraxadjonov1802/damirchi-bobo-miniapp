import React from "react";
import { hapticFeedback } from "../telegram/telegram";

export default function OptionSelector({ options, selectedValue, onChange, label, compact = false }) {
  const handleSelect = (value) => {
    hapticFeedback("medium");
    onChange(value);
  };

  return (
    <div className={compact ? "flex flex-col gap-2" : "flex flex-col gap-2.5"}>
      {label && <label className="pl-1 text-[14px] font-black text-[#221816]">{label}</label>}
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const isActive = selectedValue === option.value;
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-[13px] font-black transition active:scale-[0.98] ${
                isActive ? "border-[#C89438] bg-[#C89438] text-white" : "border-[#E8E2DA] bg-[#F6F6F7] text-[#221816]"
              }`}
            >
              {Icon && <Icon className={`h-4.5 w-4.5 ${isActive ? "text-white" : "text-[#A97824]"}`} />}
              <span className="truncate">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
