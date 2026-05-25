import React from 'react';
import { hapticFeedback } from '../telegram/telegram';

export default function OptionSelector({ options, selectedValue, onChange, label }) {
  const handleSelect = (val) => {
    hapticFeedback('medium');
    onChange(val);
  };

  return (
    <div className="flex flex-col gap-2.5">
      {label && (
        <label className="text-[10px] font-black text-[#D99A2B] uppercase tracking-[0.2em] pl-1.5 opacity-80">
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
              className={`flex items-center justify-center gap-2.5 p-4 rounded-[1.5rem] border transition-all duration-200 shadow-md cursor-pointer ${
                isActive
                  ? 'bg-[#1C1511] border-[#D99A2B]/50 text-[#F5EFE6] shadow-[#D99A2B]/5'
                  : 'bg-[#1C1511]/45 border-transparent text-[#A8988C] hover:bg-[#1C1511]/70'
              }`}
            >
              {Icon && (
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#D99A2B]' : 'text-[#A8988C]'}`} />
              )}
              <span className="text-xs font-black tracking-wide">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
