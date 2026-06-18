import React, { useMemo } from "react";

import PromoCarousel from "../components/PromoCarousel";
import FeaturedProducts from "../components/FeaturedProducts";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";

import { normalizeText } from "../utils/format";

const promoBanners = [
  {
    id: 1,
    badge: "Damirchi",
    title: "Mazali taomlar bir joyda",
    subtitle: "Buyurtmangizni tez va qulay rasmiylashtiring",
    image: "/banners/banner-1.webp",
  },
  {
    id: 2,
    badge: "Tavsiya",
    title: "Issiq shashliklar",
    subtitle: "Ko‘mirda yangi pishirilgan shashliklar",
    image: "/banners/banner-2.webp",
  },
  {
    id: 3,
    badge: "Maxsus",
    title: "Damirchi assorti",
    subtitle: "Oila va do‘stlar davrasi uchun",
    image: "/banners/banner-3.webp",
  },
];

function getProductCategoryId(product) {
  if (product?.category && typeof product.category === "object") {
    return product.category.id;
  }

  return product?.category;
}

function isSameId(first, second) {
  if (first === null || first === undefined) {
    return second === null || second === undefined;
  }

  return String(first) === String(second);
}

export default function MenuPage({
  products = [],
  categories = [],
  cart = {},
  activeCategoryId = null,
  setActiveCategoryId,
  searchQuery = "",
  setSearchQuery,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onOpenDetails,
  settings,
}) {
  const normalizedSearchQuery = normalizeText(searchQuery.trim());

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeCategoryId !== null) {
      list = list.filter((product) =>
        isSameId(getProductCategoryId(product), activeCategoryId)
      );
    }

    if (normalizedSearchQuery) {
      list = list.filter((product) => {
        const searchableValues = [
          product.name_uz,
          product.name_ru,
          product.description_uz,
          product.description_ru,
          product.category_name,
        ];

        return searchableValues.some(
          (value) =>
            value &&
            normalizeText(String(value)).includes(normalizedSearchQuery)
        );
      });
    }

    return list.sort((firstProduct, secondProduct) => {
      const firstSort = Number(firstProduct.sort_order ?? 999);
      const secondSort = Number(secondProduct.sort_order ?? 999);

      if (firstSort !== secondSort) {
        return firstSort - secondSort;
      }

      return String(firstProduct.name_uz || "").localeCompare(
        String(secondProduct.name_uz || ""),
        "uz"
      );
    });
  }, [products, activeCategoryId, normalizedSearchQuery]);

  const activeCategoryName = useMemo(() => {
    if (activeCategoryId === null) {
      return searchQuery.trim() ? "Qidiruv natijalari" : "Barcha taomlar";
    }

    const category = categories.find((item) =>
      isSameId(item.id, activeCategoryId)
    );

    return category?.name_uz || category?.name_ru || "Kategoriya";
  }, [categories, activeCategoryId, searchQuery]);

  const showClearButton =
    activeCategoryId !== null || Boolean(searchQuery.trim());

  const showFeaturedProducts =
    activeCategoryId === null && !searchQuery.trim() && products.length > 0;

  const handleClearFilters = () => {
    setSearchQuery?.("");
    setActiveCategoryId?.(null);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F7F3EB] pb-28">
      {settings?.is_open === false && (
        <div className="mx-4 mt-4 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-bold leading-[1.45] text-red-600">
          Restoran hozir yopiq. Menyuni ko‘rish mumkin, ammo buyurtmalar
          vaqtincha qabul qilinmaydi.
        </div>
      )}

      <PromoCarousel banners={promoBanners} />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Taomlarni qidirish..."
      />

      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategoryChange={setActiveCategoryId}
      />

      {showFeaturedProducts && (
        <FeaturedProducts
          products={products}
          cart={cart}
          onAddToCart={onAddToCart}
          onOpenDetails={onOpenDetails}
        />
      )}

      <section className="px-4 pt-5">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-[20px] font-black leading-tight tracking-[-0.04em] text-[#241812]">
              {activeCategoryName}
            </h2>

            <p className="mt-1 text-[11px] font-bold text-[#8B8178]">
              {filteredProducts.length} ta mahsulot
            </p>
          </div>

          {showClearButton && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="shrink-0 rounded-[14px] border border-[#E9DCC7] bg-white px-3 py-2 text-[10px] font-black text-[#A97824] shadow-sm transition active:scale-95"
            >
              Filtrni tozalash
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 items-stretch gap-3">
            {filteredProducts.map((product) => {
              const quantity = cart[product.id]?.quantity || 0;

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={quantity}
                  onAdd={onAddToCart}
                  onIncrease={onIncreaseQuantity}
                  onDecrease={onDecreaseQuantity}
                  onDetails={onOpenDetails}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Taom topilmadi"
            description="Boshqa nom bilan qidirib ko‘ring yoki tanlangan filtrlarni tozalang."
            buttonText="Filtrlarni tozalash"
            onAction={handleClearFilters}
          />
        )}
      </section>
    </div>
  );
}