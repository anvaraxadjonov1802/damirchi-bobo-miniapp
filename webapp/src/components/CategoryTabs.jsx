import React from "react";
import { Apple, Beef, Flame, Grid2X2, Pizza, Salad, Soup, UtensilsCrossed, Wheat } from "lucide-react";
import { hapticFeedback } from "../telegram/telegram";

function normalizeCategoryName(value = "") {
  return value.toLowerCase().replace(/[ʻʼ’‘`]/g, "'").replace(/\s+/g, " ").trim();
}

function getCategoryIcon(categoryName) {
  const name = normalizeCategoryName(categoryName);
  if (name.includes("birinchi") || name.includes("sho'rva") || name.includes("shorva") || name.includes("суп") || name.includes("первые")) return Soup;
  if (name.includes("ikkinchi") || name.includes("asosiy") || name.includes("вторые") || name.includes("горяч")) return UtensilsCrossed;
  if (name.includes("shashlik") || name.includes("kabob") || name.includes("шашлык") || name.includes("кебаб")) return Flame;
  if (name.includes("non") || name.includes("patir") || name.includes("хлеб") || name.includes("леп")) return Wheat;
  if (name.includes("pitsa") || name.includes("pizza") || name.includes("пицца") || name.includes("pide") || name.includes("lahmajun")) return Pizza;
  if (name.includes("salat") || name.includes("салат") || name.includes("qo'shimcha") || name.includes("добав")) return Salad;
  if (name.includes("assorti") || name.includes("ассорти") || name.includes("meva") || name.includes("фрукт")) return Apple;
  if (name.includes("go'sht") || name.includes("gosht") || name.includes("mol") || name.includes("qo'y") || name.includes("мяс")) return Beef;
  return UtensilsCrossed;
}

export default function CategoryTabs({ categories = [], activeCategoryId, onCategoryChange }) {
  const handleCategoryChange = (categoryId, event) => {
    hapticFeedback("light");
    event?.currentTarget?.scrollIntoView?.({ behavior: "smooth", block: "nearest", inline: "center" });
    onCategoryChange?.(categoryId);
  };

  const buttonClass = (active, minWidth = "min-w-[92px]") =>
    `flex ${minWidth} max-w-[112px] shrink-0 flex-col items-center justify-center gap-2 rounded-[18px] border px-3 py-3 transition-[transform,background-color,border-color,color] duration-150 active:scale-95 ${active ? "border-[#C89438] bg-[#FFF0D3] text-[#A97824]" : "border-[#E9E3DA] bg-white text-[#776B60]"}`;

  return (
    <section className="mt-4">
      <div className="mb-2 flex items-center justify-between px-4">
        <h2 className="text-[18px] font-black tracking-[-0.035em] text-[#241812]">Kategoriyalar</h2>
      </div>

      <div className="no-scrollbar flex touch-pan-x gap-2.5 overflow-x-auto scroll-smooth px-4 pb-2">
        <button
          type="button"
          onClick={(event) => handleCategoryChange(null, event)}
          className={buttonClass(activeCategoryId === null, "min-w-[86px]")}
        >
          <div className={`flex h-10 w-10 items-center justify-center rounded-[14px] ${activeCategoryId === null ? "bg-[#C89438] text-white" : "bg-[#F7F3EB] text-[#776B60]"}`}>
            <Grid2X2 className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-black leading-tight">Barchasi</span>
        </button>

        {categories.map((category) => {
          const categoryName = category.name_uz || category.name_ru || "Kategoriya";
          const Icon = getCategoryIcon(categoryName);
          const isActive = String(activeCategoryId ?? "") === String(category.id);

          return (
            <button
              key={category.id}
              type="button"
              onClick={(event) => handleCategoryChange(category.id, event)}
              className={buttonClass(isActive)}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-[14px] ${isActive ? "bg-[#C89438] text-white" : "bg-[#F7F3EB] text-[#A97824]"}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="line-clamp-2 min-h-[25px] text-center text-[10px] font-black leading-[1.2]">{categoryName}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
