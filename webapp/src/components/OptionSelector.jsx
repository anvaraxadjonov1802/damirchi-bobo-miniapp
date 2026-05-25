import React from 'react';
import { hapticFeedback } from '../telegram/telegram';

export default function OptionSelector({ options, selectedValue, onChange, label }) {
  const handleSelect = (val) => {
    hapticFeedback('medium');
    onChange(val);
  };

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-lg font-black text-[#F5EFE6] pl-1">
          {label}
        </label>
      )}

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          const isActive = selectedValue === opt.value;
          const Icon = opt.icon;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`flex items-center justify-center gap-2.5 p-4 rounded-[1.5rem] border transition-all duration-200 shadow-md cursor-pointer active:scale-[0.98] ${
                isActive
                  ? 'bg-[#D99A2B] border-[#FFE2A3]/40 text-[#120E0B] shadow-[#D99A2B]/10'
                  : 'bg-[#1C1511] border-[#D99A2B]/12 text-[#F5EFE6] hover:border-[#D99A2B]/35'
              }`}
            >
              {Icon && (
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#120E0B]' : 'text-[#D99A2B]'}`} />
              )}
              <span className="text-base font-black tracking-wide">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
