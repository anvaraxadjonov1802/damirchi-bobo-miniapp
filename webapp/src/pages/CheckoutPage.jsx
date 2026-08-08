import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CreditCard,
  DollarSign,
  Loader2,
  MapPin,
  MapPinned,
  MessageSquare,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import MapPickerModal from "../components/MapPickerModal";
import OptionSelector from "../components/OptionSelector";
import PriceSummary from "../components/PriceSummary";
import SectionCard from "../components/SectionCard";
import { useToast } from "../components/ToastProvider";

import {
  getTelegramInitData,
  getTelegramUser,
  hapticFeedback,
} from "../telegram/telegram";

function normalizePhone(value = "") {
  const digits = value.replace(/\D/g, "");

  if (!digits) return "";

  if (digits.startsWith("998")) {
    return `+${digits}`;
  }

  if (digits.length === 9) {
    return `+998${digits}`;
  }

  return value.trim();
}

export default function CheckoutPage({
  cart = {},
  onSubmitOrder,
  isSubmitting = false,
  settings,
  orderType: controlledOrderType,
  onOrderTypeChange,
  initialOrderType = "delivery",
}) {
  const { showToast } = useToast();
  const telegramUser = useMemo(() => getTelegramUser(), []);

  const [internalOrderType, setInternalOrderType] = useState(
    initialOrderType === "pickup" ? "pickup" : "delivery"
  );

  const orderType = controlledOrderType || internalOrderType;

  const [paymentType, setPaymentType] = useState("cash");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [comment, setComment] = useState("");
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    if (!controlledOrderType) {
      setInternalOrderType(
        initialOrderType === "pickup" ? "pickup" : "delivery"
      );
    }
  }, [controlledOrderType, initialOrderType]);

  const cartItems = useMemo(() => Object.values(cart), [cart]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total +
          Number(item?.product?.price || 0) *
            Number(item?.quantity || 0),
        0
      ),
    [cartItems]
  );

  const totalItemCount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + Number(item?.quantity || 0),
        0
      ),
    [cartItems]
  );

  const isOpen = settings?.is_open !== false;
  const isDelivery = orderType === "delivery";
  const clickEnabled = settings?.click_enabled === true;
  const paymeEnabled = settings?.payme_enabled === true;
  const isOnlinePayment = paymentType === "click" || paymentType === "payme";
  const hasLocation = Boolean(latitude && longitude);

  const backendDeliveryPrice = Number(
    settings?.delivery_price ?? 15000
  );

  const deliveryPrice = isDelivery ? backendDeliveryPrice : 0;

  const minOrderAmount = isDelivery
    ? Number(settings?.min_order_amount || 0)
    : 0;

  const totalPrice = subtotal + deliveryPrice;

  const isBelowMinimum =
    minOrderAmount > 0 && subtotal < minOrderAmount;

  const orderTypeOptions = [
    {
      value: "delivery",
      label: "Dastavka",
      icon: Truck,
    },
    {
      value: "pickup",
      label: "Olib ketish",
      icon: PackageCheck,
    },
  ];

  const paymentTypeOptions = [
    {
      value: "cash",
      label: "Naqd",
      icon: DollarSign,
    },
    ...(clickEnabled
      ? [
          {
            value: "click",
            label: "Click",
            icon: CreditCard,
          },
        ]
      : []),
    ...(paymeEnabled
      ? [
          {
            value: "payme",
            label: "Payme",
            icon: CreditCard,
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (paymentType === "click" && !clickEnabled) {
      setPaymentType("cash");
    }

    if (paymentType === "payme" && !paymeEnabled) {
      setPaymentType("cash");
    }
  }, [paymentType, clickEnabled, paymeEnabled]);

  const notify = (message, type = "error") => {
    showToast(message, type);
    hapticFeedback(type === "success" ? "success" : "error");
  };

  const changeOrderType = (value) => {
    hapticFeedback("light");

    if (controlledOrderType) {
      onOrderTypeChange?.(value);
      return;
    }

    setInternalOrderType(value);
    onOrderTypeChange?.(value);
  };

  const handleMapSelect = ({ latitude: lat, longitude: lng }) => {
    setLatitude(String(lat));
    setLongitude(String(lng));
    setIsMapOpen(false);

    notify("Lokatsiya belgilandi ✅", "success");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    hapticFeedback("medium");

    if (isSubmitting) return;

    if (!isOpen) {
      notify("Restoran hozir yopiq.");
      return;
    }

    if (cartItems.length === 0) {
      notify("Savat bo‘sh.");
      return;
    }

    const trimmedPhone = normalizePhone(phone);
    const phoneDigits = trimmedPhone.replace(/\D/g, "");
    const trimmedAddress = address.trim();

    if (!trimmedPhone) {
      notify("Telefon raqam kiriting.");
      return;
    }

    if (phoneDigits.length < 9) {
      notify("Telefon raqam noto‘g‘ri ko‘rinadi.");
      return;
    }

    if (isDelivery && !trimmedAddress && !hasLocation) {
      notify(
        "Manzil yozing yoki xaritadan lokatsiyani belgilang.",
        "warning"
      );
      return;
    }

    if (isBelowMinimum) {
      notify(
        `Dastavka uchun kamida ${minOrderAmount.toLocaleString(
          "uz-UZ"
        )} so‘mlik buyurtma kerak.`,
        "warning"
      );
      return;
    }

    const telegramInitData = getTelegramInitData();

    if (!telegramInitData) {
      notify(
        "Buyurtma faqat Telegram bot ichida qabul qilinadi."
      );
      return;
    }

    const items = cartItems.map((item) => ({
      product: item.product.id,
      quantity: Number(item.quantity),
    }));

    const payload = {
      telegram_init_data: telegramInitData,
      telegram_id: telegramUser?.id || null,
      full_name:
        telegramUser?.fullName ||
        telegramUser?.first_name ||
        "Telegram foydalanuvchisi",
      username: telegramUser?.username || "",

      order_type: orderType,
      payment_type: paymentType,
      phone: trimmedPhone,
      comment: comment.trim(),

      address: isDelivery ? trimmedAddress : "",
      latitude:
        isDelivery && hasLocation ? String(latitude) : null,
      longitude:
        isDelivery && hasLocation ? String(longitude) : null,
      delivery_price: isDelivery ? deliveryPrice : 0,

      items,
    };

    onSubmitOrder?.(payload);
  };

  return (
    <div className="min-h-[100dvh] bg-[#F7F3EB] px-4 pb-[120px] pt-3 text-[#241812]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <section className="relative overflow-hidden rounded-[24px] border border-[#E9E3DA] bg-white p-4 shadow-[0_14px_34px_-28px_rgba(36,24,18,0.6)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(200,148,56,0.16),transparent_42%)]" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#FFF0D3] text-[#A97824]">
                <ShoppingBag className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-[20px] font-black tracking-[-0.035em]">
                  Buyurtmani rasmiylashtirish
                </h1>

                <p className="mt-1 text-[11px] font-bold text-[#776B60]">
                  {totalItemCount} ta mahsulot
                </p>
              </div>
            </div>

            <div className="shrink-0 rounded-[14px] border border-[#E9DCC7] bg-[#FFFAF2] px-3 py-2 text-right">
              <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#8B8178]">
                Holat
              </p>

              <p
                className={`mt-0.5 text-[12px] font-black ${
                  isOpen ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {isOpen ? "Ochiq" : "Yopiq"}
              </p>
            </div>
          </div>
        </section>

        {!isOpen && (
          <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-bold leading-[1.45] text-red-600">
            Restoran hozir yopiq. Buyurtmalar vaqtincha qabul
            qilinmaydi.
          </div>
        )}

        <OptionSelector
          label="Buyurtma turi"
          options={orderTypeOptions}
          selectedValue={orderType}
          onChange={changeOrderType}
        />

        <SectionCard
          title="Aloqa ma’lumotlari"
          subtitle={
            isDelivery
              ? "Telefon va yetkazib berish manzilini kiriting"
              : "Buyurtmani olish uchun telefon raqamingizni kiriting"
          }
        >
          <label htmlFor="phone-input" className="sr-only">
            Telefon raqam
          </label>

          <div className="relative flex items-center">
            <Phone className="pointer-events-none absolute left-4 h-5 w-5 text-[#A97824]" />

            <input
              id="phone-input"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+998 90 123 45 67"
              className="w-full rounded-[16px] border border-[#E9DCC7] bg-[#FFFAF2] py-3.5 pl-12 pr-4 text-[14px] font-bold text-[#241812] outline-none transition placeholder:font-semibold placeholder:text-[#A59B92] focus:border-[#C89438] focus:ring-2 focus:ring-[#C89438]/20"
            />
          </div>

          {isDelivery && (
            <>
              <label htmlFor="address-input" className="sr-only">
                Yetkazib berish manzili
              </label>

              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-[#A97824]" />

                <input
                  id="address-input"
                  type="text"
                  autoComplete="street-address"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  placeholder="Uy, ko‘cha va mo‘ljal..."
                  className="w-full rounded-[16px] border border-[#E9DCC7] bg-[#FFFAF2] py-3.5 pl-12 pr-4 text-[14px] font-bold text-[#241812] outline-none transition placeholder:font-semibold placeholder:text-[#A59B92] focus:border-[#C89438] focus:ring-2 focus:ring-[#C89438]/20"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  hapticFeedback("medium");
                  setIsMapOpen(true);
                }}
                className={`flex w-full items-center justify-center gap-2 rounded-[16px] border px-4 py-3.5 text-[14px] font-black transition active:scale-[0.98] ${
                  hasLocation
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-[#E9DCC7] bg-[#FFFAF2] text-[#A97824]"
                }`}
              >
                <MapPinned className="h-5 w-5" />

                {hasLocation
                  ? "Lokatsiya belgilandi"
                  : "Xaritadan lokatsiya tanlash"}
              </button>

              {hasLocation && (
                <div className="rounded-[14px] border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[10px] font-bold leading-[1.45] text-emerald-700">
                  Koordinatalar: {latitude}, {longitude}
                </div>
              )}
            </>
          )}
        </SectionCard>

        <SectionCard
          title="To‘lov va izoh"
          subtitle={
            clickEnabled || paymeEnabled
              ? "Naqd yoki onlayn to‘lov turini tanlang"
              : "Hozircha naqd to‘lov mavjud"
          }
          compact
        >
          <OptionSelector
            label="To‘lov turi"
            options={paymentTypeOptions}
            selectedValue={paymentType}
            onChange={setPaymentType}
          />

          {isOnlinePayment && (
            <div className="rounded-[14px] border border-[#E9DCC7] bg-[#FFFAF2] px-3.5 py-3 text-[11px] font-bold leading-[1.5] text-[#776B60]">
              {paymentType === "click" ? "Click" : "Payme"} orqali to‘lov
              holati faqat to‘lov tizimi backendimizga tasdiq yuborgandan keyin
              “To‘langan” deb belgilanadi.
            </div>
          )}

          <div className="relative">
            <MessageSquare className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-[#A97824]" />

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Masalan: achchiq bo‘lmasin..."
              rows={3}
              maxLength={500}
              className="w-full resize-none rounded-[16px] border border-[#E9DCC7] bg-[#FFFAF2] py-3.5 pl-12 pr-4 text-[14px] font-bold text-[#241812] outline-none transition placeholder:font-semibold placeholder:text-[#A59B92] focus:border-[#C89438] focus:ring-2 focus:ring-[#C89438]/20"
            />

            <span className="absolute bottom-2.5 right-3 text-[9px] font-bold text-[#A59B92]">
              {comment.length}/500
            </span>
          </div>
        </SectionCard>

        <PriceSummary
          subtotal={subtotal}
          deliveryPrice={deliveryPrice}
          title="Buyurtma hisobi"
        />

        {isBelowMinimum && (
          <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-[11px] font-bold leading-[1.45] text-red-600">
            Minimal buyurtma summasi{" "}
            {minOrderAmount.toLocaleString("uz-UZ")} so‘m. Yana{" "}
            {(minOrderAmount - subtotal).toLocaleString(
              "uz-UZ"
            )}{" "}
            so‘mlik mahsulot qo‘shish kerak.
          </div>
        )}

        <div className="flex gap-2.5 rounded-[16px] border border-[#E9DCC7] bg-white px-4 py-3 text-[11px] font-bold leading-[1.45] text-[#776B60]">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#A97824]" />
          <span>
            {isOnlinePayment
              ? "To‘lov natijasiga frontend emas, faqat Click/Payme server tasdig‘i ishonchli hisoblanadi."
              : "Naqd to‘lov buyurtma yetkazilganda yoki olib ketishda amalga oshiriladi."}
          </span>
        </div>
      </form>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] border-t border-[#E9E3DA] bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-14px_34px_-28px_rgba(36,24,18,0.7)] backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#8B8178]">
              Jami to‘lov
            </p>

            <p className="mt-0.5 text-[19px] font-black tracking-[-0.035em] text-[#241812]">
              {totalPrice.toLocaleString("uz-UZ")} so‘m
            </p>
          </div>

          <span className="rounded-full bg-[#FFF0D3] px-3 py-1.5 text-[10px] font-black text-[#A97824]">
            {paymentType === "cash"
              ? "Naqd"
              : paymentType === "click"
                ? "Click"
                : "Payme"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            !isOpen ||
            cartItems.length === 0 ||
            isBelowMinimum
          }
          className="flex h-[56px] w-full items-center justify-between rounded-[18px] bg-[#C89438] px-4 text-white shadow-[0_14px_28px_-18px_rgba(169,120,36,0.95)] transition active:scale-[0.98] disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none"
        >
          <span className="flex items-center gap-2 text-[14px] font-black">
            {isSubmitting && (
              <Loader2 className="h-5 w-5 animate-spin" />
            )}

            {isSubmitting
              ? "Yuborilmoqda..."
              : !isOpen
                ? "Restoran yopiq"
                : isBelowMinimum
                  ? "Minimal summa yetarli emas"
                  : isOnlinePayment
                    ? "Buyurtma va to‘lovni davom ettirish"
                    : "Buyurtmani tasdiqlash"}
          </span>

          {!isSubmitting && <ArrowRight className="h-5 w-5" />}
        </button>
      </div>

      <MapPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelect={handleMapSelect}
        initialLatitude={latitude}
        initialLongitude={longitude}
      />
    </div>
  );
}
