import React, { useMemo, useState } from "react";
import {
  Truck,
  MapPin,
  Phone,
  CreditCard,
  DollarSign,
  MessageSquare,
  ArrowRight,
  Loader2,
  ShieldCheck,
  MapPinned,
} from "lucide-react";

import OptionSelector from "../components/OptionSelector";
import PriceSummary from "../components/PriceSummary";
import SectionCard from "../components/SectionCard";
import MapPickerModal from "../components/MapPickerModal";
import { useToast } from "../components/ToastProvider";

import {
  getTelegramUser,
  getTelegramInitData,
  hapticFeedback,
} from "../telegram/telegram";

export default function CheckoutPage({
  cart,
  onSubmitOrder,
  isSubmitting,
  onGoBack,
  settings,
}) {
  const { showToast } = useToast();
  const telegramUser = useMemo(() => getTelegramUser(), []);

  const [orderType, setOrderType] = useState("delivery");
  const [paymentType, setPaymentType] = useState("cash");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [comment, setComment] = useState("");
  const [isMapOpen, setIsMapOpen] = useState(false);

  const cartItems = useMemo(() => Object.values(cart), [cart]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  const isOpen = settings?.is_open !== false;
  const backendDeliveryPrice = Number(settings?.delivery_price ?? 15000);
  const minOrderAmount = Number(settings?.min_order_amount || 0);
  const deliveryPrice = orderType === "delivery" ? backendDeliveryPrice : 0;
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const hasLocation = Boolean(latitude && longitude);

  const orderTypeOptions = [
    { value: "delivery", label: "Dastavka", icon: Truck },
    { value: "pickup", label: "Olib ketish", icon: MapPin },
  ];

  const paymentTypeOptions = [
    { value: "cash", label: "Naqd", icon: DollarSign },
    { value: "card", label: "Karta", icon: CreditCard },
  ];

  const notifyError = (message) => {
    showToast(message, "error");
    hapticFeedback("error");
  };

  const notifyWarning = (message) => {
    showToast(message, "warning");
    hapticFeedback("error");
  };

  const handleMapSelect = ({ latitude: lat, longitude: lng }) => {
    setLatitude(String(lat));
    setLongitude(String(lng));
    showToast("Lokatsiya belgilandi ✅", "success");
    hapticFeedback("success");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    hapticFeedback("medium");

    if (!isOpen) {
      notifyError("Restoran hozir yopiq.");
      return;
    }

    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    if (cartItems.length === 0) {
      notifyError("Savat bo‘sh.");
      return;
    }

    if (!trimmedPhone) {
      notifyError("Telefon raqam kiriting.");
      return;
    }

    if (trimmedPhone.replace(/\D/g, "").length < 9) {
      notifyError("Telefon raqam noto‘g‘ri ko‘rinadi.");
      return;
    }

    if (orderType === "delivery" && !trimmedAddress && !hasLocation) {
      notifyWarning("Manzil yozing yoki xaritadan belgilang.");
      return;
    }

    if (
      orderType === "delivery" &&
      minOrderAmount > 0 &&
      subtotal < minOrderAmount
    ) {
      notifyWarning(
        `Dastavka uchun kamida ${minOrderAmount.toLocaleString(
          "uz-UZ"
        )} so‘mlik buyurtma kerak.`
      );
      return;
    }

    const telegramInitData = getTelegramInitData();

    if (!telegramInitData) {
      notifyError("Buyurtma faqat Telegram bot ichida qabul qilinadi.");
      return;
    }

    const items = cartItems.map((item) => ({
      product: item.product.id,
      quantity: item.quantity,
    }));

    const payload = {
      telegram_init_data: telegramInitData,
      telegram_id: telegramUser.id,
      full_name: telegramUser.fullName || "Telegram foydalanuvchisi",
      username: telegramUser.username || "",

      order_type: orderType,
      payment_type: paymentType,
      phone: trimmedPhone,
      address: orderType === "delivery" ? trimmedAddress : "",
      latitude: hasLocation ? String(latitude) : null,
      longitude: hasLocation ? String(longitude) : null,
      comment: comment.trim(),

      items,
      __total_price: subtotal + deliveryPrice,
    };

    onSubmitOrder(payload);
  };

  return (
    <div className="px-4 py-3 pb-28 animate-fade-in text-[#F5EFE6] checkout-readable">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="rounded-3xl bg-[#1C1511] border border-[#D99A2B]/15 p-4 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(217,154,43,0.14),transparent_38%)]" />

          <div className="relative flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif font-black text-xl text-[#F5EFE6] leading-tight">
                Buyurtma
              </h2>
              <p className="text-sm text-[#A8988C] font-semibold mt-1">
                {totalItemCount} ta mahsulot
              </p>
            </div>

            <div className="rounded-2xl bg-[#120E0B] border border-[#D99A2B]/15 px-3 py-2 text-right">
              <p className="text-xs text-[#A8988C] font-bold">Holat</p>
              <p
                className={`text-sm font-black ${
                  isOpen ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {isOpen ? "Ochiq" : "Yopiq"}
              </p>
            </div>
          </div>
        </div>

        {!isOpen && (
          <div className="bg-red-950/45 text-red-200 border border-red-800/45 rounded-2xl p-3 text-sm font-bold">
            Restoran hozir yopiq.
          </div>
        )}

        <OptionSelector
          label="Buyurtma turi"
          options={orderTypeOptions}
          selectedValue={orderType}
          onChange={setOrderType}
        />

        <SectionCard
          title="Ma’lumotlar"
          subtitle={
            orderType === "delivery"
              ? "Telefon, manzil yoki xaritadan lokatsiya"
              : "Telefon raqamni kiriting"
          }
        >
          <label htmlFor="phone-input" className="sr-only">
            Telefon raqam
          </label>

          <div className="relative flex items-center">
            <Phone className="absolute left-4 w-5 h-5 text-[#A8988C] opacity-80" />
            <input
              id="phone-input"
              type="tel"
              inputMode="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              className="w-full pl-12 pr-4 py-3.5 bg-[#120E0B] border border-[#D99A2B]/20 rounded-2xl text-base text-[#F5EFE6] focus:outline-none focus:ring-2 focus:ring-[#D99A2B]/45 focus:border-[#D99A2B] placeholder-[#A8988C]/50 font-semibold"
            />
          </div>

          {orderType === "delivery" && (
            <>
              <label htmlFor="address-input" className="sr-only">
                Manzil
              </label>

              <input
                id="address-input"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Uy, ko‘cha, mo‘ljal..."
                className="w-full px-4 py-3.5 bg-[#120E0B] border border-[#D99A2B]/20 rounded-2xl text-base text-[#F5EFE6] focus:outline-none focus:ring-2 focus:ring-[#D99A2B]/45 focus:border-[#D99A2B] placeholder-[#A8988C]/50 font-semibold"
              />

              <button
                type="button"
                onClick={() => {
                  hapticFeedback("medium");
                  setIsMapOpen(true);
                }}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all border active:scale-[0.98] ${
                  hasLocation
                    ? "bg-emerald-950/25 border-emerald-700/60 text-emerald-300"
                    : "bg-[#120E0B] border-[#D99A2B]/25 text-[#D99A2B]"
                }`}
              >
                <MapPinned className="w-5 h-5" />
                {hasLocation ? "Lokatsiya belgilandi ✅" : "Xaritadan tanlash"}
              </button>

              {hasLocation && (
                <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/20 px-4 py-2.5 text-xs text-emerald-200 font-bold leading-relaxed">
                  {latitude}, {longitude}
                </div>
              )}
            </>
          )}
        </SectionCard>

        <SectionCard title="To‘lov va izoh" compact>
          <OptionSelector
            label="To‘lov"
            options={paymentTypeOptions}
            selectedValue={paymentType}
            onChange={setPaymentType}
          />

          <div className="relative">
            <MessageSquare className="absolute top-3.5 left-4 w-5 h-5 text-[#A8988C] opacity-80" />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Izoh: achchiq bo‘lmasin..."
              rows={2}
              className="w-full pl-12 pr-4 py-3.5 bg-[#120E0B] border border-[#D99A2B]/20 rounded-2xl text-base text-[#F5EFE6] focus:outline-none focus:ring-2 focus:ring-[#D99A2B]/45 focus:border-[#D99A2B] placeholder-[#A8988C]/50 font-semibold resize-none"
            />
          </div>
        </SectionCard>

        <PriceSummary
          subtotal={subtotal}
          deliveryPrice={deliveryPrice}
          title="Hisob"
        />

        <div className="rounded-2xl border border-[#D99A2B]/15 bg-[#1C1511]/80 px-4 py-2.5 text-xs leading-snug text-[#A8988C] font-bold flex gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#D99A2B] shrink-0 mt-0.5" />
          <span>To‘lov buyurtma tasdiqlangandan keyin qilinadi.</span>
        </div>

        <div className="mt-1 sticky bottom-4 z-30 safe-bottom">
          <button
            type="submit"
            disabled={isSubmitting || !isOpen}
            className="w-full py-4 bg-[#D99A2B] hover:bg-[#C98A1F] text-[#120E0B] disabled:bg-neutral-800 disabled:text-neutral-500 rounded-2xl text-base font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-2xl shadow-black/35 border border-[#FFE2A3]/25 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#120E0B]" />
                <span>Yuborilmoqda...</span>
              </>
            ) : (
              <>
                <span>{isOpen ? "Tasdiqlash" : "Restoran yopiq"}</span>
                <ArrowRight className="w-5 h-5 text-[#120E0B]" />
              </>
            )}
          </button>
        </div>
      </form>

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