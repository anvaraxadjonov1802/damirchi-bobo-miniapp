import React, { useMemo } from "react";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";

import CartItem from "../components/CartItem";
import PriceSummary from "../components/PriceSummary";
import EmptyState from "../components/EmptyState";

import { formatPrice } from "../utils/format";
import { hapticFeedback } from "../telegram/telegram";

export default function CartPage({
  cart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveFromCart,
  onClearCart,
  onGoToMenu,
  onProceedToCheckout,
  settings,
}) {
  const cartItems = useMemo(() => Object.values(cart), [cart]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  const totalCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const isOpen = settings?.is_open !== false;
  const deliveryPrice = Number(settings?.delivery_price ?? 15000);
  const minOrderAmount = Number(settings?.min_order_amount || 0);

  const handleClearCart = () => {
    hapticFeedback("error");

    if (onClearCart) {
      onClearCart();
    }
  };

  const handleProceed = () => {
    if (!isOpen) {
      hapticFeedback("error");
      return;
    }

    hapticFeedback("success");

    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="px-4 py-6">
        <EmptyState
          title="Savat bo‘sh"
          description="Damirchi menyusidan taom tanlang va savatga qo‘shing."
          buttonText="Menyuga qaytish"
          onAction={onGoToMenu}
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-3 pb-28 animate-fade-in flex flex-col gap-3">
      <div className="rounded-3xl bg-white border border-[#E9DCC7] p-4 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(200,148,56,0.12),transparent_38%)]" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[#C89438] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#C89438]/10">
              <ShoppingBag className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <h2 className="font-serif font-black text-xl text-[#2C211A] leading-tight">
                Savat
              </h2>

              <p className="text-sm text-[#776B60] font-semibold mt-1">
                {cartItems.length} xil, {totalCount} ta mahsulot
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearCart}
            className="shrink-0 w-10 h-10 rounded-2xl bg-red-50 border border-red-500/35 text-red-600 flex items-center justify-center active:scale-95 transition"
            aria-label="Savatni tozalash"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
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

      <PriceSummary
        subtotal={subtotal}
        deliveryPrice={null}
        title="Savat hisobi"
        compact
      />

      <div className="rounded-2xl border border-[#E9DCC7] bg-white/70 px-4 py-2.5 text-[11px] leading-snug text-[#776B60] font-bold">
        Dastavka: <span className="text-[#2C211A]">{formatPrice(deliveryPrice)}</span>
        {minOrderAmount > 0 && (
          <>
            {" "}
            · Minimal:{" "}
            <span className="text-[#2C211A]">{formatPrice(minOrderAmount)}</span>
          </>
        )}
      </div>

      {!isOpen && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-snug text-red-600 font-bold">
          Restoran hozir yopiq. Buyurtma vaqtincha qabul qilinmaydi.
        </div>
      )}

      <div className="mt-1 sticky bottom-4 z-30 safe-bottom">
        <button
          type="button"
          onClick={handleProceed}
          disabled={!isOpen}
          className="w-full py-4 bg-[#C89438] hover:bg-[#A97824] disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-2xl text-base font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-2xl shadow-[#2C211A]/14 border border-[#EFD9AE] cursor-pointer disabled:cursor-not-allowed group"
        >
          <span>{isOpen ? "Davom etish" : "Restoran yopiq"}</span>
          <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}