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
        const nameMatch = product.name_uz && normalizeText(product.name_uz).includes(normalizedQuery);
        const descMatch = product.description_uz && normalizeText(product.description_uz).includes(normalizedQuery);
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
      : categories.find((category) => category.id === activeCategoryId)?.name_uz || "Kategoriya";

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveCategoryId(null);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col pb-28">
      <HeroSection settings={settings} />
      <BrandRibbon />

      {settings?.is_open === false && (
        <div className="mx-4 mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-bold leading-snug text-red-600">
          Restoran hozir yopiq. Menyuni ko‘rish mumkin, buyurtma vaqtincha qabul qilinmaydi.
        </div>
      )}

      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <CategoryTabs categories={categories} activeCategoryId={activeCategoryId} onCategoryChange={setActiveCategoryId} />

      <FeaturedProducts products={products} cart={cart} onAddToCart={onAddToCart} onOpenDetails={onOpenDetails} />

      <div className="px-4 pt-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[18px] font-black leading-tight text-[#221816]">{activeCategoryName}</h3>
            <p className="mt-0.5 text-[11px] font-semibold text-[#78716C]">{filteredProducts.length} ta mahsulot</p>
          </div>

          <button
            type="button"
            onClick={handleClearFilters}
            className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-[#A97824] shadow-sm ring-1 ring-[#E8E2DA]"
          >
            Tozalash
          </button>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
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
        <BottomCartBar count={cartSummary.count} totalPrice={cartSummary.total} onClick={onViewCart} />
      )}
    </div>
  );
}
