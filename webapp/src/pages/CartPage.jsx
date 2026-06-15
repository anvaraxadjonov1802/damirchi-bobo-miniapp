import React, { useMemo } from "react";
import { ChevronDown, ShoppingBag, Trash2 } from "lucide-react";
import CartItem from "../components/CartItem";
import EmptyState from "../components/EmptyState";
import { formatPrice } from "../utils/format";
import { hapticFeedback } from "../telegram/telegram";

export default function CartPage({ cart, onIncreaseQuantity, onDecreaseQuantity, onRemoveFromCart, onClearCart, onGoToMenu, onProceedToCheckout, settings }) {
  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0), [cartItems]);
  const totalCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);
  const isOpen = settings?.is_open !== false;
  const deliveryPrice = Number(settings?.delivery_price ?? 15000);
  const minOrderAmount = Number(settings?.min_order_amount || 0);

  const handleClearCart = () => { hapticFeedback("error"); onClearCart?.(); };
  const handleProceed = () => { if (!isOpen) { hapticFeedback("error"); return; } hapticFeedback("success"); onProceedToCheckout?.(); };

  if (cartItems.length === 0) {
    return <div className="px-4 py-6"><EmptyState title="Savat bo‘sh" description="Menyudan mahsulot tanlang va savatga qo‘shing." buttonText="Menyuga qaytish" onAction={onGoToMenu} /></div>;
  }

  return (
    <div className="flex min-h-[100dvh] flex-col pb-28 animate-fade-in">
      <div className="px-4 pt-3">
        <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-[#E8E2DA]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4EEE6] text-[#A97824]"><ShoppingBag className="h-5 w-5" /></div>
              <div>
                <h2 className="text-[20px] font-black text-[#221816]">Корзина</h2>
                <p className="text-[12px] font-semibold text-[#78716C]">{cartItems.length} xil, {totalCount} ta mahsulot</p>
              </div>
            </div>
            <button type="button" onClick={handleClearCart} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-200 active:scale-95" aria-label="Savatni tozalash"><Trash2 className="h-4.5 w-4.5" /></button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 px-4">
        {cartItems.map((item) => (
          <CartItem key={item.product.id} item={item} onIncrease={onIncreaseQuantity} onDecrease={onDecreaseQuantity} onRemove={onRemoveFromCart} />
        ))}
      </div>

      <div className="mx-4 mt-3 rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-[#E8E2DA]">
        <div className="flex items-center justify-between text-[13px] font-semibold text-[#78716C]"><span>Tovarlar</span><span className="font-black text-[#221816]">{formatPrice(subtotal)}</span></div>
        <div className="mt-2 flex items-center justify-between text-[13px] font-semibold text-[#78716C]"><span>Dastavka</span><span className="font-black text-[#221816]">{formatPrice(deliveryPrice)}</span></div>
        {minOrderAmount > 0 && <p className="mt-3 text-[11px] font-bold text-red-500">Minimal summa: {formatPrice(minOrderAmount)}</p>}
      </div>

      {!isOpen && <div className="mx-4 mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-bold text-red-600">Restoran hozir yopiq. Buyurtma vaqtincha qabul qilinmaydi.</div>}

      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center border-t border-[#E8E2DA] bg-white px-4 pb-4 pt-3 safe-bottom">
        <div className="w-full max-w-[448px]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#78716C]">Итого</span>
            <span className="text-[20px] font-black text-[#221816]">{formatPrice(subtotal)}</span>
          </div>
          <button type="button" onClick={handleProceed} disabled={!isOpen} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#C89438] text-[14px] font-black text-white shadow-lg shadow-[#C89438]/20 active:scale-[0.98] disabled:bg-stone-200 disabled:text-stone-400">
            <span>{isOpen ? "Далее" : "Restoran yopiq"}</span>
            <ChevronDown className="h-5 w-5 rotate-[-90deg]" />
          </button>
        </div>
      </div>
    </div>
  );
}
