import React, { useEffect, useMemo, useState } from "react";
import {
  BadgePercent,
  ChevronDown,
  Flame,
  PackageCheck,
  Truck,
  Utensils,
} from "lucide-react";

import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import { normalizeText } from "../utils/format";

const banners = [
  {
    title: "Damirchi maxsus menyusi",
    subtitle: "Issiq taomlar, qulay buyurtma",
    icon: Utensils,
  },
  {
    title: "Oilaviy setlar",
    subtitle: "Do‘stlar va oila davrasi uchun",
    icon: PackageCheck,
  },
  {
    title: "Tezkor dastavka",
    subtitle: "Buyurtmangiz operator tomonidan tasdiqlanadi",
    icon: Truck,
  },
];

function DeliveryModeBlock({ orderType, onOrderTypeChange }) {
  const isDelivery = orderType === "delivery";

  return (
    <div className="mx-4 mt-3 rounded-[20px] border border-[#E7E7E7] bg-white p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onOrderTypeChange("delivery")}
          className={`flex h-12 items-center justify-center gap-2 rounded-[16px] text-[14px] font-black transition active:scale-95 ${
            isDelivery
              ? "bg-[#C89438] text-white shadow-[0_10px_24px_-16px_rgba(140,108,247,0.9)]"
              : "bg-[#F6F6F7] text-[#666666]"
          }`}
        >
          <Truck className="h-4 w-4" />
          Dastavka
        </button>

        <button
          type="button"
          onClick={() => onOrderTypeChange("pickup")}
          className={`flex h-12 items-center justify-center gap-2 rounded-[16px] text-[14px] font-black transition active:scale-95 ${
            !isDelivery
              ? "bg-[#C89438] text-white shadow-[0_10px_24px_-16px_rgba(140,108,247,0.9)]"
              : "bg-[#F6F6F7] text-[#666666]"
          }`}
        >
          <PackageCheck className="h-4 w-4" />
          Olib ketish
        </button>
      </div>

      <p className="mt-2 px-2 text-[11px] font-bold leading-snug text-[#777777]">
        {isDelivery
          ? "Buyurtma manzilingizga yetkazib beriladi."
          : "Buyurtmani restorandan o‘zingiz olib ketasiz."}
      </p>
    </div>
  );
}

function PromoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  const banner = banners[activeIndex];
  const Icon = banner.icon;

  return (
    <section className="mx-4 mt-4">
      <div className="relative h-[128px] overflow-hidden rounded-[20px] bg-gradient-to-br from-[#C89438] to-[#6F4624] px-4 py-4 text-white shadow-[0_16px_34px_-26px_rgba(0,0,0,0.6)]">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-14 right-7 h-36 w-36 rounded-full bg-white/10" />

        <div className="relative z-10 flex h-full items-center justify-between gap-4 pb-4">
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider">
              <BadgePercent className="h-3.5 w-3.5" />
              Aksiya
            </div>

            <h2 className="line-clamp-2 min-h-[42px] text-[19px] font-black leading-[1.08] tracking-[-0.035em]">
              {banner.title}
            </h2>

            <p className="mt-1 line-clamp-1 h-[16px] text-[11px] font-bold leading-[16px] text-white/80">
              {banner.subtitle}
            </p>
          </div>

          <div className="flex h-[72px] w-[72px] shrink-0 rotate-3 items-center justify-center rounded-[22px] border border-white/15 bg-white/12">
            <Icon className="h-9 w-9" />
          </div>
        </div>

        <div className="absolute bottom-3 left-4 z-20 flex items-center gap-1.5">
          {banners.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/40"
              }`}
              aria-label={`Banner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function MenuPage({
  products,
  categories,
  cart,
  activeCategoryId,
  setActiveCategoryId,
  searchQuery,
  setSearchQuery,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onOpenDetails,
  settings,
  orderType = "delivery",
  onOrderTypeChange,
}) {
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeCategoryId !== null) {
      list = list.filter((product) => product.category === activeCategoryId);
    }

    if (searchQuery.trim()) {
      const normalizedQuery = normalizeText(searchQuery);
      list = list.filter((product) => {
        const nameMatch =
          product.name_uz &&
          normalizeText(product.name_uz).includes(normalizedQuery);

        const descMatch =
          product.description_uz &&
          normalizeText(product.description_uz).includes(normalizedQuery);

        return nameMatch || descMatch;
      });
    }

    list.sort((a, b) => {
      const firstSort = a.sort_order !== undefined ? a.sort_order : 999;
      const secondSort = b.sort_order !== undefined ? b.sort_order : 999;
      return firstSort - secondSort;
    });

    return list;
  }, [products, activeCategoryId, searchQuery]);

  const groupedSections = useMemo(() => {
    if (activeCategoryId !== null || searchQuery.trim()) {
      const title =
        activeCategoryId === null
          ? "Qidiruv natijasi"
          : categories.find((category) => category.id === activeCategoryId)
              ?.name_uz || "Kategoriya";

      return [{ id: "filtered", title, products: filteredProducts }];
    }

    const sections = categories
      .map((category) => {
        const categoryProducts = filteredProducts.filter(
          (product) => product.category === category.id
        );

        return {
          id: category.id,
          title: category.name_uz,
          products: categoryProducts,
        };
      })
      .filter((section) => section.products.length > 0);

    const withoutCategory = filteredProducts.filter(
      (product) => !product.category
    );

    if (withoutCategory.length > 0) {
      sections.push({
        id: "others",
        title: "Menyu",
        products: withoutCategory,
      });
    }

    if (sections.length === 0 && filteredProducts.length > 0) {
      sections.push({
        id: "all",
        title: "Menyu",
        products: filteredProducts,
      });
    }

    return sections;
  }, [categories, filteredProducts, activeCategoryId, searchQuery]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveCategoryId(null);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F6F6F7] pb-28">
      <DeliveryModeBlock
        orderType={orderType}
        onOrderTypeChange={onOrderTypeChange}
      />
      <PromoCarousel />

      {settings?.is_open === false && (
        <div className="mx-4 mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-bold leading-snug text-red-600">
          Restoran hozir yopiq. Menyuni ko‘rish mumkin, buyurtma vaqtincha
          qabul qilinmaydi.
        </div>
      )}

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategoryChange={setActiveCategoryId}
      />

      <div className="px-4 pt-4">
        {groupedSections.length > 0 ? (
          <div className="flex flex-col gap-5">
            {groupedSections.map((section) => (
              <section key={section.id}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="truncate text-[21px] font-black leading-tight tracking-[-0.04em] text-[#1F1F1F]">
                    {section.title}
                  </h3>

                  {(activeCategoryId !== null || searchQuery.trim()) && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-[#C89438] shadow-sm ring-1 ring-[#E7E7E7]"
                    >
                      Tozalash
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {section.products.map((product) => {
                    const inCartQty = cart[product.id]?.quantity || 0;

                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantity={inCartQty}
                        onAdd={onAddToCart}
                        onIncrease={onIncreaseQuantity}
                        onDecrease={onDecreaseQuantity}
                        onDetails={onOpenDetails}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Taom topilmadi"
            description="Boshqa nom bilan qidirib ko‘ring yoki kategoriyani tozalang."
            buttonText="Filtrlarni tozalash"
            onAction={handleClearFilters}
          />
        )}
      </div>
    </div>
  );
}