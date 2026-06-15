import React from "react";

export default function SectionCard({ children, title, subtitle, compact = false }) {
  return (
    <section className={`rounded-[22px] bg-white shadow-sm ring-1 ring-[#E8E2DA] ${compact ? "p-3" : "p-4"}`}>
      {(title || subtitle) && (
        <div className="mb-3 border-b border-[#E8E2DA] pb-2.5">
          {title && <h3 className="text-[16px] font-black text-[#221816]">{title}</h3>}
          {subtitle && <p className="mt-1 text-[12px] font-semibold leading-snug text-[#78716C]">{subtitle}</p>}
        </div>
      )}
      <div className={compact ? "flex flex-col gap-2.5" : "flex flex-col gap-3"}>{children}</div>
    </section>
  );
}
