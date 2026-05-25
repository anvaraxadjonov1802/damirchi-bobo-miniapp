import React from 'react';

export default function SectionCard({ children, title, subtitle }) {
  return (
    <div className="bg-[#1C1511] border border-[#D99A2B]/12 rounded-[2rem] p-5.5 shadow-lg animate-fade-in">
      {(title || subtitle) && (
        <div className="mb-4.5 border-b border-[#D99A2B]/15 pb-2.5">
          {title && (
            <h3 className="font-serif font-black text-sm text-[#F5EFE6] uppercase tracking-[0.15em]">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-[9px] text-[#A8988C] font-bold uppercase tracking-[0.15em] mt-1 opacity-80">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}
