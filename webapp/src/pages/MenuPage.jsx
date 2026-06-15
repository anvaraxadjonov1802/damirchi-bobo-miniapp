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

function DeliveryModeBlock() {
  return (
    <div className="mx-4 mt-3 flex items-end justify-between gap-3">
      <div>
        <p className="text-[12px] font-bold text-[#777777]">Buyurtma turi</p>

        <button
          type="button"
          className="mt-1 inline-flex items-center gap-1 text-[15px] font-black text-[#1F1F1F]"
        >
          Dastavka
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        className="inline-flex h-11 items-center gap-2 rounded-[16px] border border-[#E7E7E7] bg-white px-5 text-[14px] font-black text-[#1F1F1F] shadow-sm active:scale-95"
      >
        Dastavka
        <ChevronDown className="h-4 w-4" />
      </button>
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
      <div className="relative min-h-[112px] overflow-hidden rounded-[18px] bg-[#8068C9] px-4 py-4 text-white shadow-[0_16px_34px_-26px_rgba(0,0,0,0.6)]">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/12" />
        <div className="absolute -bottom-14 right-7 h-36 w-36 rounded-full bg-white/10" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="max-w-[220px]">
            <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/18 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
              <BadgePercent className="h-3.5 w-3.5" />
              Aksiya
            </div>

            <h2 className="text-[20px] font-black leading-[1.05] tracking-[-0.04em]">
              {banner.title}
            </h2>

            <p className="mt-1.5 text-[11px] font-bold leading-snug text-white/82">
              {banner.subtitle}
            </p>
          </div>

          <div className="flex h-[74px] w-[74px] shrink-0 rotate-3 items-center justify-center rounded-[22px] bg-white/16">
            <Icon className="h-9 w-9" />
          </div>
        </div>

        <div className="absolute bottom-2.5 left-4 z-10 flex gap-1.5">
          {banners.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                activeIndex === index ? "w-5 bg-white" : "w-1.5 bg-white/45"
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
      <DeliveryModeBlock />
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
                      className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-[#8C6CF7] shadow-sm ring-1 ring-[#E7E7E7]"
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