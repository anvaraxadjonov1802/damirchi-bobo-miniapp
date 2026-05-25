import React from 'react';

export default function SectionCard({ children, title, subtitle }) {
  return (
    <div className="bg-[#1C1511] border border-[#D99A2B]/12 rounded-[2rem] p-5 shadow-lg animate-fade-in">
      {(title || subtitle) && (
        <div className="mb-4 border-b border-[#D99A2B]/15 pb-3">
          {title && (
            <h3 className="font-serif font-black text-xl text-[#F5EFE6] leading-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-[#A8988C] font-semibold mt-1 leading-relaxed">
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
