import React from 'react';
import { Search, X } from 'lucide-react';
import { hapticFeedback } from '../telegram/telegram';

export default function SearchBar({ value, onChange }) {
  const handleClear = () => {
    hapticFeedback('light');
    onChange('');
  };

  return (
    <div className="px-5 mt-5">
      <div className="relative flex items-center bg-[#1C1511] border border-[#D99A2B]/15 rounded-3xl shadow-lg focus-within:ring-2 focus-within:ring-[#D99A2B]/40 focus-within:border-[#D99A2B] transition-all">
        <Search className="absolute left-4.5 w-4.5 h-4.5 text-[#A8988C] opacity-70 pointer-events-none" />
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Taom nomini qidiring..."
          className="w-full pl-12 pr-11 py-4 text-sm text-[#F5EFE6] placeholder-[#A8988C]/60 bg-transparent focus:outline-none font-medium"
        />
        
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-4 w-7 h-7 flex items-center justify-center rounded-full bg-[#F5EFE6]/10 hover:bg-[#F5EFE6]/20 text-[#A8988C] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-[#F5EFE6]" />
          </button>
        )}
      </div>
    </div>
  );
}
