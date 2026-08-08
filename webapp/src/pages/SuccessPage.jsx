import React, { useEffect, useRef } from "react";
import {
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Home,
  ReceiptText,
} from "lucide-react";

import { formatPrice } from "../utils/format";
import { hapticFeedback, openExternalLink } from "../telegram/telegram";

export default function SuccessPage({ orderDetails, onGoHome }) {
  const paymentOpenedRef = useRef(false);

  const handleHomeClick = () => {
    hapticFeedback("medium");

    if (onGoHome) {
      onGoHome();
    }
  };

  const orderId = orderDetails?.id || Math.floor(100000 + Math.random() * 900000);
  const totalPrice = orderDetails?.total_price || 0;
  const paymentType = orderDetails?.payment_type || "cash";
  const paymentStatus = orderDetails?.payment_status || "unpaid";
  const paymentUrl = orderDetails?.payment_url || "";
  const isOnlinePayment = paymentType === "click" || paymentType === "payme";

  const paymentText =
    paymentType === "click"
      ? "Click"
      : paymentType === "payme"
        ? "Payme"
        : "Naqd";

  const paymentStatusText =
    {
      unpaid: "To‘lanmagan",
      pending: "Kutilmoqda",
      paid: "To‘langan",
      failed: "Xatolik",
      cancelled: "Bekor qilingan",
      refunded: "Qaytarilgan",
    }[paymentStatus] || paymentStatus;

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

  useEffect(() => {
    if (
      !paymentOpenedRef.current &&
      isOnlinePayment &&
      paymentStatus === "pending" &&
      paymentUrl
    ) {
      paymentOpenedRef.current = true;
      openExternalLink(paymentUrl);
    }
  }, [isOnlinePayment, paymentStatus, paymentUrl]);

  const handleOpenPayment = () => {
    hapticFeedback("medium");
    openExternalLink(paymentUrl);
  };

  return (
    <div className="px-4 py-6 pb-28 flex flex-col items-center justify-center min-h-[calc(100dvh-90px)] text-center animate-fade-in text-[#2C211A]">
      <div className="relative mb-5">
        <div className="w-20 h-20 bg-emerald-950/25 rounded-full border-4 border-emerald-500/15 flex items-center justify-center animate-pulse shadow-[0_0_18px_rgba(16,185,129,0.14)]">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-scale-in" />
        </div>

        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 animate-ping opacity-75" />
        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500" />
      </div>

      <h2 className="font-serif font-black text-2xl text-[#2C211A] leading-tight">
        Buyurtma qabul qilindi
      </h2>

      <p className="text-sm text-[#776B60] leading-snug max-w-sm font-semibold mt-2 mb-5">
        {isOnlinePayment && paymentStatus === "pending"
          ? `${paymentText} to‘lov oynasi ochiladi. To‘lov tasdiqlangach buyurtma holati yangilanadi.`
          : "Buyurtmangiz Damirchi operatoriga yuborildi. Holat o‘zgarsa Telegram orqali xabar beramiz."}
      </p>

      <div className="w-full max-w-sm bg-white border border-[#E9DCC7] rounded-3xl p-4 shadow-lg text-left mb-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(200,148,56,0.10),transparent_38%)]" />

        <div className="absolute -left-2 top-1/2 -mt-2 w-4 h-4 bg-[#FFFAF2] rounded-full border-r border-[#E9DCC7]" />
        <div className="absolute -right-2 top-1/2 -mt-2 w-4 h-4 bg-[#FFFAF2] rounded-full border-l border-[#E9DCC7]" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3 border-b border-dashed border-[#E9DCC7] pb-2.5">
            <ReceiptText className="w-4 h-4 text-[#A97824]" />
            <h3 className="font-black text-[10px] text-[#A97824] uppercase tracking-[0.16em]">
              Buyurtma ma’lumotlari
            </h3>
          </div>

          <div className="flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between items-center gap-3 text-[#776B60]">
              <span className="font-semibold">Raqam</span>
              <span className="font-mono font-black text-[#2C211A] break-all text-right">
                #{orderId}
              </span>
            </div>

            <div className="flex justify-between items-center gap-3 text-[#776B60]">
              <span className="font-semibold">Status</span>
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                {statusText}
              </span>
            </div>

            <div className="flex justify-between items-center gap-3 text-[#776B60]">
              <span className="font-semibold">To‘lov</span>
              <span className="font-black text-[#2C211A]">{paymentText}</span>
            </div>

            {isOnlinePayment && (
              <div className="flex justify-between items-center gap-3 text-[#776B60]">
                <span className="font-semibold">To‘lov holati</span>
                <span className="font-black text-[#2C211A]">{paymentStatusText}</span>
              </div>
            )}

            <div className="border-t border-dashed border-[#E9DCC7] my-1" />

            <div className="flex justify-between items-end gap-3">
              <span className="font-black text-[#2C211A]">Jami</span>
              <span className="font-serif font-black text-[#A97824] text-xl leading-none">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {isOnlinePayment && paymentUrl && paymentStatus === "pending" && (
        <button
          type="button"
          onClick={handleOpenPayment}
          className="w-full max-w-sm mb-3 py-4 bg-[#2C211A] hover:bg-black text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          <span>{paymentText} orqali to‘lash</span>
        </button>
      )}

      <button
        type="button"
        onClick={handleHomeClick}
        className="w-full max-w-sm py-4 bg-[#C89438] hover:bg-[#A97824] text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-[#C89438]/10 group cursor-pointer"
      >
        <Home className="w-4 h-4 text-white" />
        <span>Menyuga qaytish</span>
        <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
