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
      <div className="rounded-3xl bg-[#1C1511] border border-[#D99A2B]/15 p-4 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(217,154,43,0.12),transparent_38%)]" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[#D99A2B] text-[#120E0B] flex items-center justify-center shrink-0 shadow-md shadow-[#D99A2B]/10">
              <ShoppingBag className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <h2 className="font-serif font-black text-xl text-[#F5EFE6] leading-tight">
                Savat
              </h2>

              <p className="text-sm text-[#A8988C] font-semibold mt-1">
                {cartItems.length} xil, {totalCount} ta mahsulot
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearCart}
            className="shrink-0 w-10 h-10 rounded-2xl bg-red-950/25 border border-red-800/35 text-red-300 flex items-center justify-center active:scale-95 transition"
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

      <div className="rounded-2xl border border-[#D99A2B]/12 bg-[#1C1511]/70 px-4 py-2.5 text-[11px] leading-snug text-[#A8988C] font-bold">
        Dastavka: <span className="text-[#F5EFE6]">{formatPrice(deliveryPrice)}</span>
        {minOrderAmount > 0 && (
          <>
            {" "}
            · Minimal:{" "}
            <span className="text-[#F5EFE6]">{formatPrice(minOrderAmount)}</span>
          </>
        )}
      </div>

      {!isOpen && (
        <div className="rounded-2xl border border-red-700/35 bg-red-950/30 px-4 py-3 text-sm leading-snug text-red-200 font-bold">
          Restoran hozir yopiq. Buyurtma vaqtincha qabul qilinmaydi.
        </div>
      )}

      <div className="mt-1 sticky bottom-4 z-30 safe-bottom">
        <button
          type="button"
          onClick={handleProceed}
          disabled={!isOpen}
          className="w-full py-4 bg-[#D99A2B] hover:bg-[#C98A1F] disabled:bg-neutral-800 disabled:text-neutral-500 text-[#120E0B] rounded-2xl text-base font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-2xl shadow-black/35 border border-[#FFE2A3]/25 cursor-pointer disabled:cursor-not-allowed group"
        >
          <span>{isOpen ? "Davom etish" : "Restoran yopiq"}</span>
          <ArrowRight className="w-5 h-5 text-[#120E0B] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}