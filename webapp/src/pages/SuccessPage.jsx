import React from "react";
import { CheckCircle2, ChevronRight, Home, ReceiptText } from "lucide-react";

import { formatPrice } from "../utils/format";
import { hapticFeedback } from "../telegram/telegram";

export default function SuccessPage({ orderDetails, onGoHome }) {
  const handleHomeClick = () => {
    hapticFeedback("medium");

    if (onGoHome) {
      onGoHome();
    }
  };

  const orderId = orderDetails?.id || Math.floor(100000 + Math.random() * 900000);
  const totalPrice = orderDetails?.total_price || 0;
  const paymentText = orderDetails?.payment_type === "card" ? "Karta" : "Naqd";

  const statusText =
    {
      new: "Yangi",
      accepted: "Qabul qilindi",
      preparing: "Tayyorlanmoqda",
      on_way: "Yo‘lda",
      completed: "Yetkazildi",
      cancelled: "Bekor qilindi",
    }[orderDetails?.status] ||
    orderDetails?.status ||
    "Yangi";

  return (
    <div className="px-4 py-6 pb-28 flex flex-col items-center justify-center min-h-[calc(100dvh-90px)] text-center animate-fade-in text-[#F5EFE6]">
      <div className="relative mb-5">
        <div className="w-20 h-20 bg-emerald-950/25 rounded-full border-4 border-emerald-500/15 flex items-center justify-center animate-pulse shadow-[0_0_18px_rgba(16,185,129,0.14)]">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-scale-in" />
        </div>

        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 animate-ping opacity-75" />
        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500" />
      </div>

      <h2 className="font-serif font-black text-2xl text-[#F5EFE6] leading-tight">
        Buyurtma qabul qilindi
      </h2>

      <p className="text-sm text-[#A8988C] leading-snug max-w-sm font-semibold mt-2 mb-5">
        Buyurtmangiz Damirchi operatoriga yuborildi. Holat o‘zgarsa Telegram
        orqali xabar beramiz.
      </p>

      <div className="w-full max-w-sm bg-[#1C1511] border border-[#D99A2B]/12 rounded-3xl p-4 shadow-lg text-left mb-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(217,154,43,0.10),transparent_38%)]" />

        <div className="absolute -left-2 top-1/2 -mt-2 w-4 h-4 bg-[#120E0B] rounded-full border-r border-[#D99A2B]/12" />
        <div className="absolute -right-2 top-1/2 -mt-2 w-4 h-4 bg-[#120E0B] rounded-full border-l border-[#D99A2B]/12" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3 border-b border-dashed border-[#D99A2B]/15 pb-2.5">
            <ReceiptText className="w-4 h-4 text-[#D99A2B]" />
            <h3 className="font-black text-[10px] text-[#D99A2B] uppercase tracking-[0.16em]">
              Buyurtma ma’lumotlari
            </h3>
          </div>

          <div className="flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between items-center gap-3 text-[#A8988C]">
              <span className="font-semibold">Raqam</span>
              <span className="font-mono font-black text-[#F5EFE6]">
                #{orderId}
              </span>
            </div>

            <div className="flex justify-between items-center gap-3 text-[#A8988C]">
              <span className="font-semibold">Status</span>
              <span className="bg-emerald-950/35 border border-emerald-900/40 text-emerald-300 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                {statusText}
              </span>
            </div>

            <div className="flex justify-between items-center gap-3 text-[#A8988C]">
              <span className="font-semibold">To‘lov</span>
              <span className="font-black text-[#F5EFE6]">{paymentText}</span>
            </div>

            <div className="border-t border-dashed border-[#D99A2B]/12 my-1" />

            <div className="flex justify-between items-end gap-3">
              <span className="font-black text-[#F5EFE6]">Jami</span>
              <span className="font-serif font-black text-[#D99A2B] text-xl leading-none">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleHomeClick}
        className="w-full max-w-sm py-4 bg-[#D99A2B] hover:bg-[#C98A1F] text-[#120E0B] rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-[#D99A2B]/10 group cursor-pointer"
      >
        <Home className="w-4 h-4 text-[#120E0B]" />
        <span>Menyuga qaytish</span>
        <ChevronRight className="w-4 h-4 text-[#120E0B] group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}