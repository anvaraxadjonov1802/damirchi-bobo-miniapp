import React, { useMemo } from 'react';
import { Trash2, ArrowRight } from 'lucide-react';
import CartItem from '../components/CartItem';
import PriceSummary from '../components/PriceSummary';
import EmptyState from '../components/EmptyState';
import { formatPrice } from '../utils/format';
import { hapticFeedback } from '../telegram/telegram';

export default function CartPage({
  cart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveFromCart,
  onClearCart,
  onGoToMenu,
  onProceedToCheckout,
  settings
}) {
  const cartItems = useMemo(() => Object.values(cart), [cart]);

  // Compute subtotal of values
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cartItems]);

  const isOpen = settings?.is_open !== false;
  const deliveryPrice = Number(settings?.delivery_price ?? 15000);
  const minOrderAmount = Number(settings?.min_order_amount || 0);

  const handleClearCart = () => {
    hapticFeedback('error');
    if (onClearCart) onClearCart();
  };

  const handleProceed = () => {
    if (!isOpen) {
      hapticFeedback('error');
      return;
    }

    hapticFeedback('success');
    if (onProceedToCheckout) onProceedToCheckout();
  };

  if (cartItems.length === 0) {
    return (
      <div className="px-5 py-8">
        <EmptyState
          title="Savat hozircha bo‘sh"
          description="Siz savatingizga hech qanday taom qo‘shmadingiz. Damirchi BOBO menyusidan mazali taomlarni tanlashga marhamat!"
          buttonText="Menyuga qaytish"
          onAction={onGoToMenu}
        />
      </div>
    );
  }

  return (
    <div className="px-5 py-5 pb-24 animate-fade-in flex flex-col gap-5">
      {/* List Header Actions */}
      <div className="flex items-center justify-between border-b border-[#D99A2B]/15 pb-2.5">
        <span className="text-[10px] font-black text-[#D99A2B] uppercase tracking-[0.15em]">
          Siz tanlagan taomlar ({cartItems.length} xil)
        </span>
        <button
          onClick={handleClearCart}
          className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors active:scale-95 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
          <span>Savatni tozalash</span>
        </button>
      </div>

      {/* Cart Items List */}
      <div className="flex flex-col">
        {cartItems.map((item) => (
          <CartItem
            key={item.product.id}
            item={item}
            onIncrease={onIncreaseQuantity}
            onDecrease={onDecreaseQuantity}
            onRemove={onRemoveFromCart}
          />
        ))}
      </div>

      {/* Cart Summary section */}
      <PriceSummary subtotal={subtotal} deliveryPrice={null} title="Savat hisobi" />

      <div className="rounded-2xl border border-[#D99A2B]/12 bg-[#1C1511]/70 px-4 py-3 text-[11px] leading-relaxed text-[#A8988C] font-semibold">
        {`Dastavka narxi backend sozlamasidan olinadi: ${formatPrice(deliveryPrice)}. ${minOrderAmount > 0 ? `Dastavka uchun minimal buyurtma: ${formatPrice(minOrderAmount)}.` : 'Olib ketishda dastavka 0 so‘m.'}`}
      </div>

      {!isOpen && (
        <div className="rounded-2xl border border-red-700/35 bg-red-950/30 px-4 py-3 text-[11px] leading-relaxed text-red-200 font-bold">
          Restoran yopiq bo‘lgani uchun hozir buyurtma rasmiylashtirib bo‘lmaydi.
        </div>
      )}

      {/* Proceed Checkout Button */}
      <div className="mt-2.5">
        <button
          onClick={handleProceed}
          disabled={!isOpen}
          className="w-full py-4.5 bg-[#D99A2B] hover:bg-[#C98A1F] disabled:bg-neutral-800 disabled:text-neutral-500 text-[#120E0B] rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-[#D99A2B]/10 group cursor-pointer disabled:cursor-not-allowed"
        >
          <span>{isOpen ? 'Buyurtmani rasmiylashtirish' : 'Restoran yopiq'}</span>
          <ArrowRight className="w-4 h-4 text-[#120E0B] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
