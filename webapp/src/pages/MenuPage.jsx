import React, { useMemo } from "react";

import HeroSection from "../components/HeroSection";
import BrandRibbon from "../components/BrandRibbon";
import FeaturedProducts from "../components/FeaturedProducts";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import BottomCartBar from "../components/BottomCartBar";
import EmptyState from "../components/EmptyState";

import { normalizeText } from "../utils/format";

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
  onViewCart,
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

  const cartSummary = useMemo(() => {
    let count = 0;
    let total = 0;

    Object.values(cart).forEach((item) => {
      count += item.quantity;
      total += item.product.price * item.quantity;
    });

    return { count, total };
  }, [cart]);

  const activeCategoryName =
    activeCategoryId === null
      ? "Menyu"
      : categories.find((category) => category.id === activeCategoryId)
          ?.name_uz || "Kategoriya";

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveCategoryId(null);
  };

  return (
    <div className="pb-32 flex flex-col min-h-[100dvh]">
      <HeroSection settings={settings} />

      <div className="mt-3">
        <BrandRibbon />
      </div>

      {settings?.is_open === false && (
        <div className="mx-4 mt-3 rounded-2xl border border-red-700/35 bg-red-950/30 px-4 py-3 text-sm font-bold leading-snug text-red-200">
          Restoran hozir yopiq. Menyuni ko‘rish mumkin, buyurtma vaqtincha
          qabul qilinmaydi.
        </div>
      )}

      <FeaturedProducts
        products={products}
        cart={cart}
        onAddToCart={onAddToCart}
        onOpenDetails={onOpenDetails}
      />

      <div className="mt-2">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategoryChange={setActiveCategoryId}
      />

      <div className="px-4 mt-4">
        <div className="flex items-end justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black text-[#D99A2B] uppercase tracking-[0.18em] mb-1">
              Damirchi katalogi
            </p>

            <h3 className="font-serif font-black text-[#F5EFE6] text-lg leading-tight truncate">
              {activeCategoryName}
            </h3>
          </div>

          <span className="shrink-0 rounded-full bg-[#1C1511] border border-[#D99A2B]/12 px-3 py-1.5 text-[10px] text-[#D99A2B] font-black uppercase tracking-wider">
            {filteredProducts.length} ta
          </span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {filteredProducts.map((product) => {
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
        ) : (
          <EmptyState
            title="Taom topilmadi"
            description="Boshqa nom bilan qidirib ko‘ring yoki kategoriyani tozalang."
            buttonText="Filtrlarni tozalash"
            onAction={handleClearFilters}
          />
        )}
      </div>

      {cartSummary.count > 0 && (
        <BottomCartBar
          count={cartSummary.count}
          totalPrice={cartSummary.total}
          onClick={onViewCart}
        />
      )}
    </div>
  );
}