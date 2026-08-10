import React, { useMemo } from "react";
import { PackageCheck, Truck } from "lucide-react";

import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import PromoCarousel from "../components/PromoCarousel";
import { normalizeText } from "../utils/format";

const promoBanners = [
  { id: 1, badge: "Damirchi", title: "Mazali taomlar bir joyda", subtitle: "Buyurtmangizni tez va qulay rasmiylashtiring", image: "/banners/banner-1.webp" },
  { id: 2, badge: "Tavsiya", title: "Issiq shashliklar", subtitle: "Ko‘mirda yangi pishirilgan shashliklar", image: "/banners/banner-2.webp" },
  { id: 3, badge: "Maxsus", title: "Damirchi assorti", subtitle: "Oila va do‘stlar davrasi uchun", image: "/banners/banner-3.webp" },
];

function getProductCategoryId(product) {
  if (product?.category && typeof product.category === "object") return product.category.id;
  return product?.category ?? null;
}

function isSameId(first, second) {
  if (first === null || first === undefined) return second === null || second === undefined;
  return String(first) === String(second);
}

function DeliveryModeBlock({ orderType = "delivery", onOrderTypeChange }) {
  const isDelivery = orderType === "delivery";
  return (
    <section className="mx-4 mt-3 rounded-[20px] border border-[#E9E3DA] bg-white p-2 shadow-[0_8px_22px_-22px_rgba(36,24,18,0.45)]">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onOrderTypeChange?.("delivery")}
          className={`flex h-12 items-center justify-center gap-2 rounded-[16px] text-[14px] font-black transition-transform active:scale-95 ${isDelivery ? "bg-[#C89438] text-white" : "bg-[#F7F3EB] text-[#776B60]"}`}
          aria-pressed={isDelivery}
        >
          <Truck className="h-4 w-4" /> Dastavka
        </button>
        <button
          type="button"
          onClick={() => onOrderTypeChange?.("pickup")}
          className={`flex h-12 items-center justify-center gap-2 rounded-[16px] text-[14px] font-black transition-transform active:scale-95 ${!isDelivery ? "bg-[#C89438] text-white" : "bg-[#F7F3EB] text-[#776B60]"}`}
          aria-pressed={!isDelivery}
        >
          <PackageCheck className="h-4 w-4" /> Olib ketish
        </button>
      </div>
      <p className="mt-2 px-2 text-[11px] font-bold leading-snug text-[#776B60]">
        {isDelivery ? "Buyurtma manzilingizga yetkazib beriladi." : "Buyurtmani restorandan o‘zingiz olib ketasiz."}
      </p>
    </section>
  );
}

function MenuSkeleton() {
  return (
    <main className="px-4 pt-4" aria-label="Menyu yuklanmoqda">
      <div className="mb-3 h-6 w-36 animate-pulse rounded-lg bg-[#E9E0D4]" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-[20px] border border-[#E9E3DA] bg-white">
            <div className="h-[145px] animate-pulse bg-[#EEE7DE]" />
            <div className="p-3">
              <div className="h-4 w-4/5 animate-pulse rounded bg-[#EEE7DE]" />
              <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-[#F3EEE8]" />
              <div className="mt-5 h-4 w-1/2 animate-pulse rounded bg-[#EEE7DE]" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function MenuPage({
  products = [], categories = [], cart = {}, activeCategoryId = null,
  setActiveCategoryId, searchQuery = "", setSearchQuery, onAddToCart,
  onIncreaseQuantity, onDecreaseQuantity, onOpenDetails, settings,
  orderType = "delivery", onOrderTypeChange, isLoading = false,
}) {
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (activeCategoryId !== null) {
      list = list.filter((product) => isSameId(getProductCategoryId(product), activeCategoryId));
    }
    const normalizedQuery = normalizeText(searchQuery.trim());
    if (normalizedQuery) {
      list = list.filter((product) => [product.name_uz, product.name_ru, product.description_uz, product.description_ru, product.category_name]
        .some((value) => value && normalizeText(String(value)).includes(normalizedQuery)));
    }
    list.sort((a, b) => {
      const firstSort = Number(a.sort_order ?? 999);
      const secondSort = Number(b.sort_order ?? 999);
      if (firstSort !== secondSort) return firstSort - secondSort;
      return String(a.name_uz || "").localeCompare(String(b.name_uz || ""), "uz");
    });
    return list;
  }, [products, activeCategoryId, searchQuery]);

  const groupedSections = useMemo(() => {
    if (activeCategoryId !== null || searchQuery.trim()) {
      const activeCategory = categories.find((category) => isSameId(category.id, activeCategoryId));
      return [{
        id: "filtered",
        title: activeCategoryId === null ? "Qidiruv natijalari" : activeCategory?.name_uz || activeCategory?.name_ru || "Kategoriya",
        products: filteredProducts,
      }];
    }

    const sections = categories
      .map((category) => ({
        id: category.id,
        title: category.name_uz || category.name_ru || "Kategoriya",
        products: filteredProducts.filter((product) => isSameId(getProductCategoryId(product), category.id)),
      }))
      .filter((section) => section.products.length > 0);

    const withoutCategory = filteredProducts.filter((product) => getProductCategoryId(product) === null);
    if (withoutCategory.length > 0) sections.push({ id: "others", title: "Boshqa taomlar", products: withoutCategory });
    if (sections.length === 0 && filteredProducts.length > 0) sections.push({ id: "all", title: "Barcha taomlar", products: filteredProducts });
    return sections;
  }, [categories, filteredProducts, activeCategoryId, searchQuery]);

  const handleClearFilters = () => {
    setSearchQuery?.("");
    setActiveCategoryId?.(null);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F7F3EB] pb-28">
      <DeliveryModeBlock orderType={orderType} onOrderTypeChange={onOrderTypeChange} />
      <PromoCarousel banners={promoBanners} />

      {settings?.is_open === false && (
        <div className="mx-4 mt-3 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-bold leading-[1.45] text-red-600">
          Restoran hozir yopiq. Menyuni ko‘rish mumkin, ammo buyurtmalar vaqtincha qabul qilinmaydi.
        </div>
      )}

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Taomlarni qidirish..." />
      <CategoryTabs categories={categories} activeCategoryId={activeCategoryId} onCategoryChange={setActiveCategoryId} />

      {isLoading && products.length === 0 ? (
        <MenuSkeleton />
      ) : (
        <main className="px-4 pt-4">
          {groupedSections.length > 0 ? (
            <div className="flex flex-col gap-5">
              {groupedSections.map((section, sectionIndex) => (
                <section key={section.id} className="menu-section">
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-[20px] font-black leading-tight tracking-[-0.04em] text-[#241812]">{section.title}</h2>
                      <p className="mt-1 text-[11px] font-bold text-[#8B8178]">{section.products.length} ta mahsulot</p>
                    </div>
                    {(activeCategoryId !== null || searchQuery.trim()) && (
                      <button type="button" onClick={handleClearFilters} className="shrink-0 rounded-[14px] border border-[#E9DCC7] bg-white px-3 py-2 text-[10px] font-black text-[#A97824] transition-transform active:scale-95">
                        Filtrni tozalash
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 items-stretch gap-3">
                    {section.products.map((product, productIndex) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantity={cart?.[product.id]?.quantity || 0}
                        priority={sectionIndex === 0 && productIndex < 4}
                        onAdd={onAddToCart}
                        onIncrease={onIncreaseQuantity}
                        onDecrease={onDecreaseQuantity}
                        onDetails={onOpenDetails}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <EmptyState title="Taom topilmadi" description="Boshqa nom bilan qidirib ko‘ring yoki filtrlarni tozalang." buttonText="Filtrni tozalash" onAction={handleClearFilters} />
          )}
        </main>
      )}
    </div>
  );
}
