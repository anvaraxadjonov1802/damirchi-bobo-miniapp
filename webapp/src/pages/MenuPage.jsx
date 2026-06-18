import React, { useMemo } from "react";
import { PackageCheck, Truck } from "lucide-react";

import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import PromoCarousel from "../components/PromoCarousel";
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

  return product?.category ?? null;
}

function isSameId(first, second) {
  if (first === null || first === undefined) {
    return second === null || second === undefined;
  }

  return String(first) === String(second);
}

function DeliveryModeBlock({
  orderType = "delivery",
  onOrderTypeChange,
}) {
  const isDelivery = orderType === "delivery";

  const changeOrderType = (type) => {
    onOrderTypeChange?.(type);
  };

  return (
    <section className="mx-4 mt-3 rounded-[20px] border border-[#E9E3DA] bg-white p-2 shadow-[0_10px_28px_-24px_rgba(36,24,18,0.55)]">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => changeOrderType("delivery")}
          className={`flex h-12 items-center justify-center gap-2 rounded-[16px] text-[14px] font-black transition active:scale-95 ${
            isDelivery
              ? "bg-[#C89438] text-white shadow-[0_10px_24px_-16px_rgba(169,120,36,0.9)]"
              : "bg-[#F7F3EB] text-[#776B60]"
          }`}
          aria-pressed={isDelivery}
        >
          <Truck className="h-4 w-4" />
          Dastavka
        </button>

        <button
          type="button"
          onClick={() => changeOrderType("pickup")}
          className={`flex h-12 items-center justify-center gap-2 rounded-[16px] text-[14px] font-black transition active:scale-95 ${
            !isDelivery
              ? "bg-[#C89438] text-white shadow-[0_10px_24px_-16px_rgba(169,120,36,0.9)]"
              : "bg-[#F7F3EB] text-[#776B60]"
          }`}
          aria-pressed={!isDelivery}
        >
          <PackageCheck className="h-4 w-4" />
          Olib ketish
        </button>
      </div>

      <p className="mt-2 px-2 text-[11px] font-bold leading-snug text-[#776B60]">
        {isDelivery
          ? "Buyurtma manzilingizga yetkazib beriladi."
          : "Buyurtmani restorandan o‘zingiz olib ketasiz."}
      </p>
    </section>
  );
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
  orderType = "delivery",
  onOrderTypeChange,
}) {
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeCategoryId !== null) {
      list = list.filter((product) =>
        isSameId(getProductCategoryId(product), activeCategoryId)
      );
    }

    const normalizedQuery = normalizeText(searchQuery.trim());

    if (normalizedQuery) {
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
            normalizeText(String(value)).includes(normalizedQuery)
        );
      });
    }

    list.sort((firstProduct, secondProduct) => {
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

    return list;
  }, [products, activeCategoryId, searchQuery]);

  const groupedSections = useMemo(() => {
    if (activeCategoryId !== null || searchQuery.trim()) {
      const activeCategory = categories.find((category) =>
        isSameId(category.id, activeCategoryId)
      );

      const title =
        activeCategoryId === null
          ? "Qidiruv natijalari"
          : activeCategory?.name_uz ||
            activeCategory?.name_ru ||
            "Kategoriya";

      return [
        {
          id: "filtered",
          title,
          products: filteredProducts,
        },
      ];
    }

    const sections = categories
      .map((category) => {
        const categoryProducts = filteredProducts.filter((product) =>
          isSameId(getProductCategoryId(product), category.id)
        );

        return {
          id: category.id,
          title: category.name_uz || category.name_ru || "Kategoriya",
          products: categoryProducts,
        };
      })
      .filter((section) => section.products.length > 0);

    const withoutCategory = filteredProducts.filter(
      (product) => getProductCategoryId(product) === null
    );

    if (withoutCategory.length > 0) {
      sections.push({
        id: "others",
        title: "Boshqa taomlar",
        products: withoutCategory,
      });
    }

    if (sections.length === 0 && filteredProducts.length > 0) {
      sections.push({
        id: "all",
        title: "Barcha taomlar",
        products: filteredProducts,
      });
    }

    return sections;
  }, [
    categories,
    filteredProducts,
    activeCategoryId,
    searchQuery,
  ]);

  const handleClearFilters = () => {
    setSearchQuery?.("");
    setActiveCategoryId?.(null);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F7F3EB] pb-28">
      <DeliveryModeBlock
        orderType={orderType}
        onOrderTypeChange={onOrderTypeChange}
      />

      <PromoCarousel banners={promoBanners} />

      {settings?.is_open === false && (
        <div className="mx-4 mt-3 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-bold leading-[1.45] text-red-600">
          Restoran hozir yopiq. Menyuni ko‘rish mumkin, ammo buyurtmalar
          vaqtincha qabul qilinmaydi.
        </div>
      )}

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

      <main className="px-4 pt-4">
        {groupedSections.length > 0 ? (
          <div className="flex flex-col gap-5">
            {groupedSections.map((section) => (
              <section key={section.id}>
                <div className="mb-3 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-[20px] font-black leading-tight tracking-[-0.04em] text-[#241812]">
                      {section.title}
                    </h2>

                    <p className="mt-1 text-[11px] font-bold text-[#8B8178]">
                      {section.products.length} ta mahsulot
                    </p>
                  </div>

                  {(activeCategoryId !== null ||
                    searchQuery.trim()) && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="shrink-0 rounded-[14px] border border-[#E9DCC7] bg-white px-3 py-2 text-[10px] font-black text-[#A97824] shadow-sm transition active:scale-95"
                    >
                      Filtrni tozalash
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 items-stretch gap-3">
                  {section.products.map((product) => {
                    const quantity =
                      cart?.[product.id]?.quantity || 0;

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
              </section>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Taom topilmadi"
            description="Boshqa nom bilan qidirib ko‘ring yoki filtrlarni tozalang."
            buttonText="Filtrlarni tozalash"
            onAction={handleClearFilters}
          />
        )}
      </main>
    </div>
  );
}
