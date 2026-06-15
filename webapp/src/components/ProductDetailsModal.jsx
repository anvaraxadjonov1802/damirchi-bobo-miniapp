import React, { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { formatPrice } from "../utils/format";
import { client } from "../api/client";
import { hapticFeedback } from "../telegram/telegram";

export default function ProductDetailsModal({
  product,
  currentQuantity = 0,
  onClose,
  onUpdateQuantity,
}) {
  const [quantity, setQuantity] = useState(currentQuantity || 1);

  useEffect(() => {
    if (product) {
      setQuantity(currentQuantity || 1);
    }
  }, [currentQuantity, product]);

  useEffect(() => {
    if (!product) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  if (!product) return null;

  const isAvailable = product.is_available !== false;
  const imageSrc = client.getImageUrl(product.image);
  const totalPrice = product.price * quantity;

  const handleDecrease = () => {
    if (quantity <= 1) return;

    hapticFeedback("light");
    setQuantity((prev) => prev - 1);
  };

  const handleIncrease = () => {
    hapticFeedback("light");
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (!isAvailable) return;

    hapticFeedback("success");

    if (onUpdateQuantity) {
      onUpdateQuantity(product, quantity);
    }

    onClose();
  };

  const handleRemoveFromCart = () => {
    hapticFeedback("error");

    if (onUpdateQuantity) {
      onUpdateQuantity(product, 0);
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9997] bg-black/75 backdrop-blur-sm flex items-end justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] max-h-[92dvh] bg-[#FFFAF2] rounded-t-[2rem] border-t border-[#E9DCC7] shadow-2xl overflow-hidden flex flex-col animate-map-sheet"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 px-4 pt-3 pb-2 bg-[#FFFAF2]">
          <div className="mx-auto w-11 h-1 rounded-full bg-[#2C211A]/12 mb-3" />

          <div className="flex items-center justify-between gap-3">
            <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#A97824] bg-[#C89438]/10 border border-[#E9DCC7] px-3 py-1.5 rounded-full truncate">
              {product.category_name || "Damirchi menyusi"}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-white border border-[#E9DCC7] flex items-center justify-center active:scale-95 transition shrink-0"
              aria-label="Yopish"
            >
              <X className="w-4 h-4 text-[#2C211A]" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-3">
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-white border border-[#E9DCC7] shadow-lg">
            <img
              src={imageSrc}
              alt={product.name_uz}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F0]/80 via-transparent to-transparent" />

            {!isAvailable && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-red-600 text-red-600 border border-red-500 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider">
                  Mavjud emas
                </span>
              </div>
            )}
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-black text-xl text-[#2C211A] leading-tight">
              {product.name_uz}
            </h3>

            <div className="flex items-center justify-between gap-3 mt-2">
              <p className="font-serif font-black text-xl text-[#A97824] leading-none">
                {formatPrice(product.price)}
              </p>

              {currentQuantity > 0 && (
                <span className="rounded-full bg-[#C89438]/10 border border-[#E9DCC7] text-[#A97824] text-[10px] font-black px-3 py-1 uppercase tracking-wider">
                  Savatda {currentQuantity} ta
                </span>
              )}
            </div>

            <p className="text-[#776B60] text-sm leading-snug font-semibold mt-3">
              {product.description_uz ||
                "Damirchi oshxonasi uslubida tayyorlangan mazali taom."}
            </p>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#E9DCC7] bg-[#FFFAF2] px-4 pt-3 pb-4 safe-bottom">
          {isAvailable ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 bg-white rounded-2xl border border-[#E9DCC7] p-2">
                <span className="text-xs font-black text-[#776B60] pl-2 uppercase tracking-wide">
                  Soni
                </span>

                <div className="flex items-center bg-[#FFFAF2] rounded-2xl p-1 border border-[#E9DCC7]">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-[#A97824] hover:bg-white disabled:opacity-30 active:scale-90 transition"
                    aria-label="Kamaytirish"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-9 text-center text-base font-black text-[#2C211A]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={handleIncrease}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#C89438] text-white active:scale-90 transition"
                    aria-label="Ko‘paytirish"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                {currentQuantity > 0 && (
                  <button
                    type="button"
                    onClick={handleRemoveFromCart}
                    className="w-12 rounded-2xl border border-red-500/35 bg-red-50 text-red-600 flex items-center justify-center active:scale-95 transition"
                    aria-label="Savatdan olib tashlash"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-[#C89438] hover:bg-[#A97824] text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-[#C89438]/10"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>
                    {currentQuantity > 0 ? "Yangilash" : "Savatga qo‘shish"} ·{" "}
                    {formatPrice(totalPrice)}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full py-4 bg-white text-[#776B60] border border-[#E9DCC7] rounded-2xl text-sm font-black flex items-center justify-center">
              Ushbu taom vaqtincha mavjud emas
            </div>
          )}
        </div>
      </div>
    </div>
  );
}