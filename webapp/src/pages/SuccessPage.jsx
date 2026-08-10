import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Home,
  Loader2,
  ReceiptText,
  RefreshCw,
} from "lucide-react";

import { client } from "../api/client";
import { formatPrice } from "../utils/format";
import {
  getTelegramInitData,
  hapticFeedback,
  openExternalLink,
} from "../telegram/telegram";

export default function SuccessPage({ orderDetails, onGoHome }) {
  const paymentOpenedRef = useRef(false);
  const lastPaidRef = useRef(false);

  const orderId = orderDetails?.id || "";
  const totalPrice = orderDetails?.total_price || 0;
  const paymentType = orderDetails?.payment_type || "cash";
  const initialPaymentStatus = orderDetails?.payment_status || "unpaid";
  const initialPaymentUrl = orderDetails?.payment_url || "";
  const isOnlinePayment = paymentType === "click" || paymentType === "payme";

  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [paymentUrl, setPaymentUrl] = useState(initialPaymentUrl);
  const [orderStatus, setOrderStatus] = useState(orderDetails?.status || "new");
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  useEffect(() => {
    setPaymentStatus(initialPaymentStatus);
    setPaymentUrl(initialPaymentUrl);
    setOrderStatus(orderDetails?.status || "new");
    paymentOpenedRef.current = false;
    lastPaidRef.current = initialPaymentStatus === "paid";
  }, [orderId, initialPaymentStatus, initialPaymentUrl, orderDetails?.status]);

  const handleHomeClick = () => {
    hapticFeedback("medium");
    onGoHome?.();
  };

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
    }[orderStatus] || orderStatus || "Yangi";

  const checkPaymentStatus = useCallback(
    async ({ silent = false } = {}) => {
      if (!isOnlinePayment || !orderId) return;

      const initData = getTelegramInitData();
      if (!initData) return;

      if (!silent) setIsCheckingPayment(true);

      try {
        const result = await client.getPaymentStatus(orderId, initData);
        const nextPaymentStatus = result?.payment_status || paymentStatus;

        setPaymentStatus(nextPaymentStatus);
        setOrderStatus(result?.status || orderStatus);
        if (result?.payment_url) setPaymentUrl(result.payment_url);

        if (nextPaymentStatus === "paid" && !lastPaidRef.current) {
          lastPaidRef.current = true;
          hapticFeedback("success");
        }
      } catch (error) {
        if (!silent) {
          console.warn("Payment status check failed:", error);
          hapticFeedback("warning");
        }
      } finally {
        if (!silent) setIsCheckingPayment(false);
      }
    }, [isOnlinePayment, orderId, orderStatus, paymentStatus]
  );

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

  useEffect(() => {
    if (!isOnlinePayment || paymentStatus !== "pending" || !orderId) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      checkPaymentStatus({ silent: true });
    }, 2500);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkPaymentStatus({ silent: true });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [checkPaymentStatus, isOnlinePayment, orderId, paymentStatus]);

  const handleOpenPayment = () => {
    hapticFeedback("medium");
    if (paymentUrl) openExternalLink(paymentUrl);
  };

  const isPaid = paymentStatus === "paid";
  const paymentCanRetry = ["pending", "cancelled", "failed"].includes(paymentStatus);

  const headline =
    isOnlinePayment && !isPaid
      ? paymentStatus === "pending"
        ? "To‘lov kutilmoqda"
        : "To‘lov yakunlanmadi"
      : isOnlinePayment
        ? "To‘lov tasdiqlandi"
        : "Buyurtma qabul qilindi";

  const description = isOnlinePayment
    ? isPaid
      ? "To‘lov server orqali tasdiqlandi. Buyurtmangiz Damirchi operatoriga yuborildi."
      : paymentStatus === "pending"
        ? `${paymentText} to‘lov oynasida to‘lovni yakunlang. Tasdiq kelishi bilan bu sahifa avtomatik yangilanadi.`
        : "To‘lov tasdiqlanmadi. Quyidagi tugma orqali qayta urinishingiz mumkin."
    : "Buyurtmangiz Damirchi operatoriga yuborildi. Holat o‘zgarsa Telegram orqali xabar beramiz.";

  return (
    <div className="px-4 py-6 pb-28 flex flex-col items-center justify-center min-h-[calc(100dvh-90px)] text-center animate-fade-in text-[#2C211A]">
      <div className="relative mb-5">
        <div
          className={`w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-sm ${
            isOnlinePayment && !isPaid
              ? "bg-amber-50 border-amber-200"
              : "bg-emerald-50 border-emerald-200"
          }`}
        >
          {isOnlinePayment && !isPaid ? (
            <CreditCard className="w-10 h-10 text-[#A97824]" />
          ) : (
            <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-scale-in" />
          )}
        </div>
      </div>

      <h2 className="font-serif font-black text-2xl text-[#2C211A] leading-tight">
        {headline}
      </h2>

      <p className="text-sm text-[#776B60] leading-snug max-w-sm font-semibold mt-2 mb-5">
        {description}
      </p>

      <div className="w-full max-w-sm bg-white border border-[#E9DCC7] rounded-3xl p-4 shadow-lg text-left mb-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(200,148,56,0.10),transparent_38%)]" />

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
              <span className="bg-[#FFF0D3] border border-[#E9DCC7] text-[#A97824] text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
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
                <span
                  className={`font-black ${
                    isPaid
                      ? "text-emerald-600"
                      : paymentStatus === "pending"
                        ? "text-[#A97824]"
                        : "text-red-600"
                  }`}
                >
                  {paymentStatusText}
                </span>
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

      {isOnlinePayment && paymentCanRetry && paymentUrl && (
        <button
          type="button"
          onClick={handleOpenPayment}
          className="w-full max-w-sm mb-3 py-4 bg-[#2C211A] text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg"
        >
          <CreditCard className="w-4 h-4" />
          <span>
            {paymentStatus === "pending"
              ? `${paymentText} orqali to‘lash`
              : `${paymentText} orqali qayta to‘lash`}
          </span>
        </button>
      )}

      {isOnlinePayment && !isPaid && (
        <button
          type="button"
          onClick={() => checkPaymentStatus({ silent: false })}
          disabled={isCheckingPayment}
          className="w-full max-w-sm mb-3 py-3.5 border border-[#E9DCC7] bg-white text-[#A97824] rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-60"
        >
          {isCheckingPayment ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>{isCheckingPayment ? "Tekshirilmoqda..." : "To‘lov holatini tekshirish"}</span>
        </button>
      )}

      <button
        type="button"
        onClick={handleHomeClick}
        className="w-full max-w-sm py-4 bg-[#C89438] text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg group"
      >
        <Home className="w-4 h-4 text-white" />
        <span>Menyuga qaytish</span>
        <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
