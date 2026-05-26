import React from "react";

export default function SectionCard({ children, title, subtitle, compact = false }) {
  return (
    <section
      className={`bg-[#1C1511] border border-[#D99A2B]/12 rounded-3xl shadow-lg animate-fade-in ${
        compact ? "p-3" : "p-4"
      }`}
    >
      {(title || subtitle) && (
        <div className="mb-3 border-b border-[#D99A2B]/12 pb-2.5">
          {title && (
            <h3 className="font-serif font-black text-lg text-[#F5EFE6] leading-tight">
              {title}
            </h3>
          )}

          {subtitle && (
            <p className="text-sm text-[#A8988C] font-semibold mt-1 leading-snug">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className={compact ? "flex flex-col gap-2.5" : "flex flex-col gap-3"}>
        {children}
      </div>
    </section>
  );
}