import React, { useMemo } from 'react';
import HeroSection from '../components/HeroSection';
import BrandRibbon from '../components/BrandRibbon';
import FeaturedProducts from '../components/FeaturedProducts';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import ProductCard from '../components/ProductCard';
import BottomCartBar from '../components/BottomCartBar';
import EmptyState from '../components/EmptyState';
import { normalizeText } from '../utils/format';

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
  settings
}) {
  
  // Sort and filter products dynamically based on search and selected category
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by active category
    if (activeCategoryId !== null) {
      list = list.filter(p => p.category === activeCategoryId);
    }

    // Filter by search query using normalized text comparison
    if (searchQuery.trim()) {
      const normalizedQuery = normalizeText(searchQuery);
      list = list.filter(p => {
        const nameMatch = p.name_uz && normalizeText(p.name_uz).includes(normalizedQuery);
        const descMatch = p.description_uz && normalizeText(p.description_uz).includes(normalizedQuery);
        return nameMatch || descMatch;
      });
    }

    // Sort by sort_order if available
    list.sort((a, b) => {
      const sa = a.sort_order !== undefined ? a.sort_order : 999;
      const sb = b.sort_order !== undefined ? b.sort_order : 999;
      return sa - sb;
    });

    return list;
  }, [products, activeCategoryId, searchQuery]);

  // Aggregate cart details for sticky bar trigger
  const cartSummary = useMemo(() => {
    let count = 0;
    let total = 0;
    Object.values(cart).forEach(item => {
      count += item.quantity;
      total += (item.product.price * item.quantity);
    });
    return { count, total };
  }, [cart]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveCategoryId(null);
  };

  return (
    <div className="pb-32 flex flex-col min-h-screen">
      {/* Visual Header Elements */}
      <HeroSection settings={settings} />
      <BrandRibbon />

      {settings?.is_open === false && (
        <div className="mx-5 mt-4 rounded-3xl border border-red-700/35 bg-red-950/30 px-4 py-3 text-[12px] font-bold leading-relaxed text-red-200">
          Restoran hozir yopiq. Menyuni ko‘rishingiz mumkin, lekin buyurtma yuborish vaqtincha bloklangan.
        </div>
      )}
      
      <FeaturedProducts
        products={products}
        cart={cart}
        onAddToCart={onAddToCart}
        onOpenDetails={onOpenDetails}
      />
      
      {/* Filter and query elements */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      
      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategoryChange={setActiveCategoryId}
      />

      {/* Product collection list */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-black text-[#D99A2B] uppercase tracking-[0.2em] mb-1">Asosiy katalog</p>
            <h3 className="font-serif font-black text-[#F5EFE6] text-base">
            {activeCategoryId === null 
              ? "Bugungi menyu" 
              : categories.find(c => c.id === activeCategoryId)?.name_uz || "Kategoriya taomlari"}
            </h3>
          </div>
          <span className="rounded-full bg-[#1C1511] border border-[#D99A2B]/12 px-3 py-1 text-[10px] text-[#D99A2B] font-black uppercase tracking-wider">
            {filteredProducts.length} ta mahsulot
          </span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3.5">
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
            title="Hech narsa topilmadi"
            description="Qidiruv parametrlari bo‘yicha mos keladigan taom yo‘q. Boshqa so‘z yozib ko‘ring yoki filtrlarni tozalang."
            buttonText="Filtrlarni tozalash"
            onAction={handleClearFilters}
          />
        )}
      </div>

      {/* Sticky Bottom Cart Prompt */}
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
