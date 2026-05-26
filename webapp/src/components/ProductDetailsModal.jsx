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
        className="w-full max-w-[480px] max-h-[92dvh] bg-[#120E0B] rounded-t-[2rem] border-t border-[#D99A2B]/20 shadow-2xl overflow-hidden flex flex-col animate-map-sheet"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 px-4 pt-3 pb-2 bg-[#120E0B]">
          <div className="mx-auto w-11 h-1 rounded-full bg-[#F5EFE6]/12 mb-3" />

          <div className="flex items-center justify-between gap-3">
            <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#D99A2B] bg-[#D99A2B]/10 border border-[#D99A2B]/15 px-3 py-1.5 rounded-full truncate">
              {product.category_name || "Damirchi menyusi"}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-[#1C1511] border border-[#D99A2B]/15 flex items-center justify-center active:scale-95 transition shrink-0"
              aria-label="Yopish"
            >
              <X className="w-4 h-4 text-[#F5EFE6]" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-3">
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-[#1C1511] border border-[#D99A2B]/12 shadow-lg">
            <img
              src={imageSrc}
              alt={product.name_uz}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#120E0B]/80 via-transparent to-transparent" />

            {!isAvailable && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-red-950/90 text-red-200 border border-red-800 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider">
                  Mavjud emas
                </span>
              </div>
            )}
          </div>

          <div className="pt-4">
            <h3 className="font-serif font-black text-xl text-[#F5EFE6] leading-tight">
              {product.name_uz}
            </h3>

            <div className="flex items-center justify-between gap-3 mt-2">
              <p className="font-serif font-black text-xl text-[#D99A2B] leading-none">
                {formatPrice(product.price)}
              </p>

              {currentQuantity > 0 && (
                <span className="rounded-full bg-[#D99A2B]/10 border border-[#D99A2B]/15 text-[#D99A2B] text-[10px] font-black px-3 py-1 uppercase tracking-wider">
                  Savatda {currentQuantity} ta
                </span>
              )}
            </div>

            <p className="text-[#A8988C] text-sm leading-snug font-semibold mt-3">
              {product.description_uz ||
                "Damirchi oshxonasi uslubida tayyorlangan mazali taom."}
            </p>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#D99A2B]/15 bg-[#120E0B] px-4 pt-3 pb-4 safe-bottom">
          {isAvailable ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 bg-[#1C1511] rounded-2xl border border-[#D99A2B]/12 p-2">
                <span className="text-xs font-black text-[#A8988C] pl-2 uppercase tracking-wide">
                  Soni
                </span>

                <div className="flex items-center bg-[#120E0B] rounded-2xl p-1 border border-[#D99A2B]/12">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-[#D99A2B] hover:bg-[#1C1511] disabled:opacity-30 active:scale-90 transition"
                    aria-label="Kamaytirish"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-9 text-center text-base font-black text-[#F5EFE6]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={handleIncrease}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#D99A2B] text-[#120E0B] active:scale-90 transition"
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
                    className="w-12 rounded-2xl border border-red-800/35 bg-red-950/25 text-red-300 flex items-center justify-center active:scale-95 transition"
                    aria-label="Savatdan olib tashlash"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-[#D99A2B] hover:bg-[#C98A1F] text-[#120E0B] rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-[#D99A2B]/10"
                >
                  <ShoppingBag className="w-4 h-4 text-[#120E0B]" />
                  <span>
                    {currentQuantity > 0 ? "Yangilash" : "Savatga qo‘shish"} ·{" "}
                    {formatPrice(totalPrice)}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full py-4 bg-[#1C1511] text-[#A8988C] border border-[#D99A2B]/10 rounded-2xl text-sm font-black flex items-center justify-center">
              Ushbu taom vaqtincha mavjud emas
            </div>
          )}
        </div>
      </div>
    </div>
  );
}