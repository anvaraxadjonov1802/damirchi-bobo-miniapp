import React, { useMemo } from "react";
import {
  ArrowRight,
  PackageCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import CartItem from "../components/CartItem";
import EmptyState from "../components/EmptyState";
import { formatPrice } from "../utils/format";
import { hapticFeedback } from "../telegram/telegram";

export default function CartPage({
  cart = {},
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveFromCart,
  onClearCart,
  onGoToMenu,
  onProceedToCheckout,
  settings,
  orderType = "delivery",
}) {
  const cartItems = useMemo(() => Object.values(cart), [cart]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + Number(item.product?.price || 0) * Number(item.quantity || 0),
        0
      ),
    [cartItems]
  );

  const totalCount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
      ),
    [cartItems]
  );

  const isOpen = settings?.is_open !== false;
  const isDelivery = orderType === "delivery";

  const deliveryPrice = isDelivery
    ? Number(settings?.delivery_price ?? 15000)
    : 0;

  const minOrderAmount = isDelivery
    ? Number(settings?.min_order_amount || 0)
    : 0;

  const totalPrice = subtotal + deliveryPrice;
  const isBelowMinimum =
    minOrderAmount > 0 && subtotal < minOrderAmount;

  const canProceed =
    isOpen && cartItems.length > 0 && !isBelowMinimum;

  const handleClearCart = () => {
    hapticFeedback("error");
    onClearCart?.();
  };

  const handleProceed = () => {
    if (!canProceed) {
      hapticFeedback("error");
      return;
    }

    hapticFeedback("success");
    onProceedToCheckout?.();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100dvh-88px)] bg-[#F7F3EB] px-4 py-6">
        <EmptyState
          title="Savat bo‘sh"
          description="Menyudan yoqqan taomingizni tanlab, savatga qo‘shing."
          buttonText="Menyuga qaytish"
          onAction={onGoToMenu}
        />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#F7F3EB] pb-[190px]">
      <section className="px-4 pt-3">
        <div className="rounded-[22px] border border-[#E9E3DA] bg-white p-4 shadow-[0_12px_30px_-26px_rgba(36,24,18,0.55)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#FFF0D3] text-[#A97824]">
                <ShoppingBag className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-[20px] font-black tracking-[-0.035em] text-[#241812]">
                  Savat
                </h1>

                <p className="mt-0.5 text-[11px] font-bold text-[#776B60]">
                  {cartItems.length} xil, {totalCount} ta mahsulot
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearCart}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-red-200 bg-red-50 text-red-600 transition active:scale-90"
              aria-label="Savatni tozalash"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="mt-3 flex flex-col gap-3 px-4">
        {cartItems.map((item) => (
          <CartItem
            key={item.product.id}
            item={item}
            onIncrease={onIncreaseQuantity}
            onDecrease={onDecreaseQuantity}
            onRemove={onRemoveFromCart}
          />
        ))}
      </section>

      <section className="mx-4 mt-4 rounded-[22px] border border-[#E9E3DA] bg-white p-4 shadow-[0_12px_30px_-26px_rgba(36,24,18,0.55)]">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-[#FFF0D3] text-[#A97824]">
            {isDelivery ? (
              <Truck className="h-[18px] w-[18px]" />
            ) : (
              <PackageCheck className="h-[18px] w-[18px]" />
            )}
          </div>

          <div>
            <h2 className="text-[14px] font-black text-[#241812]">
              Buyurtma hisobi
            </h2>

            <p className="text-[10px] font-bold text-[#8B8178]">
              {isDelivery ? "Dastavka" : "Olib ketish"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[13px] font-semibold text-[#776B60]">
          <span>Mahsulotlar</span>
          <span className="font-black text-[#241812]">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-[13px] font-semibold text-[#776B60]">
          <span>{isDelivery ? "Dastavka" : "Olib ketish"}</span>
          <span className="font-black text-[#241812]">
            {deliveryPrice > 0 ? formatPrice(deliveryPrice) : "Bepul"}
          </span>
        </div>

        <div className="my-4 h-px bg-[#EFE8DF]" />

        <div className="flex items-end justify-between gap-3">
          <span className="text-[13px] font-black text-[#241812]">
            Jami
          </span>

          <span className="text-[21px] font-black tracking-[-0.035em] text-[#6F4624]">
            {formatPrice(totalPrice)}
          </span>
        </div>

        {isBelowMinimum && (
          <div className="mt-4 rounded-[14px] border border-red-200 bg-red-50 px-3 py-2.5 text-[11px] font-bold leading-[1.45] text-red-600">
            Minimal buyurtma summasi {formatPrice(minOrderAmount)}. Yana{" "}
            {formatPrice(minOrderAmount - subtotal)} qo‘shish kerak.
          </div>
        )}
      </section>

      {!isOpen && (
        <div className="mx-4 mt-3 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-bold leading-[1.45] text-red-600">
          Restoran hozir yopiq. Buyurtmalar vaqtincha qabul qilinmaydi.
        </div>
      )}

      <div className="fixed inset-x-0 bottom-[76px] z-40 mx-auto w-full max-w-[480px] border-t border-[#E9E3DA] bg-white/95 px-4 pb-3 pt-3 shadow-[0_-14px_34px_-28px_rgba(36,24,18,0.7)] backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8B8178]">
              To‘lov summasi
            </p>

            <p className="mt-0.5 text-[20px] font-black tracking-[-0.035em] text-[#241812]">
              {formatPrice(totalPrice)}
            </p>
          </div>

          <span className="rounded-full bg-[#FFF0D3] px-3 py-1.5 text-[10px] font-black text-[#A97824]">
            {totalCount} ta
          </span>
        </div>

        <button
          type="button"
          onClick={handleProceed}
          disabled={!canProceed}
          className="flex h-[56px] w-full items-center justify-between rounded-[18px] bg-[#C89438] px-4 text-white shadow-[0_14px_28px_-18px_rgba(169,120,36,0.95)] transition active:scale-[0.98] disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none"
        >
          <span className="text-[14px] font-black">
            {!isOpen
              ? "Restoran yopiq"
              : isBelowMinimum
                ? "Minimal summa yetarli emas"
                : "Buyurtmani davom ettirish"}
          </span>

          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
