import React, { useEffect, useState } from "react";
import { ChevronLeft, Minus, Plus, ShoppingBag, Star, Trash2 } from "lucide-react";
import { formatPrice } from "../utils/format";
import { client } from "../api/client";
import { hapticFeedback } from "../telegram/telegram";

export default function ProductDetailsModal({ product, currentQuantity = 0, onClose, onUpdateQuantity }) {
  const [quantity, setQuantity] = useState(currentQuantity || 1);

  useEffect(() => {
    if (product) setQuantity(currentQuantity || 1);
  }, [currentQuantity, product]);

  useEffect(() => {
    if (!product) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
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
    onUpdateQuantity?.(product, quantity);
    onClose();
  };

  const handleRemoveFromCart = () => {
    hapticFeedback("error");
    onUpdateQuantity?.(product, 0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9997] flex justify-center bg-[#F6F6F7] animate-fade-in">
      <div className="flex h-[100dvh] w-full max-w-[480px] flex-col bg-[#F6F6F7]">
        <div className="safe-top flex shrink-0 items-center gap-3 bg-white px-4 pb-3 pt-2 shadow-sm">
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F0ED] text-[#221816] active:scale-90" aria-label="Orqaga">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-black text-[#221816]">Mahsulot</h2>
            <p className="text-[11px] font-semibold text-[#78716C]">Damirchi menyusi</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
          <div className="bg-white">
            <div className="relative aspect-[4/3] bg-[#F2F0ED]">
              <img src={imageSrc} alt={product.name_uz} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
              {!isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                  <span className="rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-600 ring-1 ring-red-200">Mavjud emas</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="mb-2 flex items-center gap-1.5 text-[12px] font-black text-[#A97824]">
                <Star className="h-4 w-4 fill-[#C89438] text-[#C89438]" />
                <span>5.0</span>
                <span className="ml-2 rounded-full bg-[#F4EEE6] px-2 py-1 text-[9px] uppercase tracking-wider">
                  {product.category_name || "Damirchi"}
                </span>
              </div>

              <h1 className="text-[22px] font-black leading-tight text-[#221816]">{product.name_uz}</h1>
              <p className="mt-2 text-[13px] font-semibold leading-relaxed text-[#78716C]">
                {product.description_uz || "Damirchi oshxonasi uslubida tayyorlangan mazali taom."}
              </p>
            </div>
          </div>

          <div className="mx-4 mt-3 rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-[#E8E2DA]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[15px] font-black text-[#221816]">Soni</span>
              {currentQuantity > 0 && <span className="rounded-full bg-[#F4EEE6] px-3 py-1 text-[10px] font-black text-[#A97824]">Savatda {currentQuantity} ta</span>}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[22px] font-black text-[#A97824]">{formatPrice(product.price)}</span>
              <div className="flex items-center rounded-xl bg-[#F2F0ED] p-1">
                <button type="button" onClick={handleDecrease} disabled={quantity <= 1} className="flex h-9 w-9 items-center justify-center rounded-lg text-[#A97824] disabled:opacity-30 active:scale-90" aria-label="Kamaytirish">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-9 text-center text-base font-black text-[#221816]">{quantity}</span>
                <button type="button" onClick={handleIncrease} className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C89438] text-white active:scale-90" aria-label="Ko‘paytirish">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#E8E2DA] bg-white px-4 pb-4 pt-3 safe-bottom">
          {isAvailable ? (
            <div className="flex gap-2">
              {currentQuantity > 0 && (
                <button type="button" onClick={handleRemoveFromCart} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-200 active:scale-95" aria-label="Savatdan olib tashlash">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button type="button" onClick={handleAddToCart} className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#C89438] text-sm font-black text-white shadow-lg shadow-[#C89438]/20 active:scale-[0.98]">
                <ShoppingBag className="h-4 w-4" />
                <span>{currentQuantity > 0 ? "Yangilash" : "Добавить"} · {formatPrice(totalPrice)}</span>
              </button>
            </div>
          ) : (
            <div className="flex h-14 items-center justify-center rounded-2xl bg-[#F2F0ED] text-sm font-black text-[#78716C]">
              Ushbu taom vaqtincha mavjud emas
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
