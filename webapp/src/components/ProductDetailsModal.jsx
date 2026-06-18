import React, { useEffect, useState } from "react";
import {
  ImageOff,
  Minus,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";

import { client } from "../api/client";
import { formatPrice } from "../utils/format";
import { hapticFeedback } from "../telegram/telegram";

export default function ProductDetailsModal({
  product,
  currentQuantity = 0,
  onClose,
  onUpdateQuantity,
}) {
  const [quantity, setQuantity] = useState(
    currentQuantity > 0 ? currentQuantity : 1
  );
  const [imageError, setImageError] = useState(false);

  const isAvailable = product?.is_available !== false;
  const imageSrc = client.getImageUrl(product?.image);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    setQuantity(currentQuantity > 0 ? currentQuantity : 1);
  }, [currentQuantity, product?.id]);

  if (!product) return null;

  const totalPrice = Number(product.price || 0) * quantity;

  const handleClose = () => {
    hapticFeedback("light");
    onClose?.();
  };

  const handleDecrease = () => {
    hapticFeedback("light");

    setQuantity((prev) => {
      if (currentQuantity > 0) {
        return Math.max(0, prev - 1);
      }

      return Math.max(1, prev - 1);
    });
  };

  const handleIncrease = () => {
    hapticFeedback("light");
    setQuantity((prev) => prev + 1);
  };

  const handleSubmit = () => {
    if (!isAvailable) return;

    hapticFeedback("success");
    onUpdateQuantity?.(product, quantity);
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[9998] mx-auto flex max-w-[480px] items-end bg-black/35 backdrop-blur-[2px]"
      onClick={handleClose}
    >
      <div
        className="animate-map-sheet relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[30px] bg-[#F7F3EB] shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.6)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-[270px] shrink-0 overflow-hidden bg-[#EFE9E0]">
          {!imageError && imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name_uz}
              onError={() => setImageError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#FFF8EB] to-[#EFE4D4] text-[#A97824]">
              <ImageOff className="h-10 w-10 opacity-70" />

              <span className="text-[11px] font-black uppercase tracking-[0.15em]">
                Rasm mavjud emas
              </span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />

          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-[16px] border border-white/25 bg-white/90 text-[#241812] shadow-lg backdrop-blur-md transition active:scale-90"
            aria-label="Yopish"
          >
            <X className="h-5 w-5" />
          </button>

          <span className="absolute bottom-4 left-4 max-w-[75%] truncate rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[10px] font-black text-white backdrop-blur-md">
            {product.category_name || "Damirchi menyusi"}
          </span>

          {!isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px]">
              <span className="rounded-full border border-red-200 bg-white px-4 py-2 text-[12px] font-black text-red-600">
                Hozir mavjud emas
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-3 pt-4">
          <div className="rounded-[24px] border border-[#E9E3DA] bg-white p-4 shadow-[0_12px_28px_-24px_rgba(36,24,18,0.5)]">
            <h2 className="text-[23px] font-black leading-[1.12] tracking-[-0.04em] text-[#241812]">
              {product.name_uz}
            </h2>

            <p className="mt-2 text-[13px] font-semibold leading-[1.55] text-[#776B60]">
              {product.description_uz ||
                "Damirchi oshxonasida yangi mahsulotlardan tayyorlangan mazali taom."}
            </p>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#EFE8DF] pt-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#8B8178]">
                  Narxi
                </p>

                <p className="mt-1 text-[19px] font-black tracking-[-0.03em] text-[#6F4624]">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="flex items-center rounded-[16px] border border-[#E9DCC7] bg-[#FFF8EB] p-1">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={quantity <= (currentQuantity > 0 ? 0 : 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-[12px] text-[#A97824] transition active:scale-90 disabled:opacity-35"
                  aria-label="Kamaytirish"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="w-9 text-center text-[15px] font-black text-[#241812]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={handleIncrease}
                  className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#C89438] text-white shadow-sm transition active:scale-90"
                  aria-label="Ko‘paytirish"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="safe-bottom border-t border-[#E9E3DA] bg-white px-4 pb-3 pt-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isAvailable}
            className="flex h-[56px] w-full items-center justify-between rounded-[18px] bg-[#C89438] px-4 text-white shadow-[0_14px_28px_-18px_rgba(169,120,36,0.9)] transition active:scale-[0.98] disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none"
          >
            <span className="flex items-center gap-2 text-[14px] font-black">
              <ShoppingBag className="h-5 w-5" />

              {currentQuantity > 0
                ? quantity === 0
                  ? "Savatdan olib tashlash"
                  : "Savatni yangilash"
                : "Savatga qo‘shish"}
            </span>

            {quantity > 0 && (
              <span className="text-[15px] font-black">
                {formatPrice(totalPrice)}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}