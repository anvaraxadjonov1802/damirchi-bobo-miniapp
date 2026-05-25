import React, { useState, useMemo } from 'react';
import { Truck, Navigation, MapPin, Phone, CreditCard, DollarSign, MessageSquare, ArrowRight, Loader2, ShieldCheck, ClipboardCheck, Clock3 } from 'lucide-react';
import OptionSelector from '../components/OptionSelector';
import PriceSummary from '../components/PriceSummary';
import SectionCard from '../components/SectionCard';
import { getTelegramUser, getTelegramInitData, showAlert, hapticFeedback } from '../telegram/telegram';

export default function CheckoutPage({
  cart,
  onSubmitOrder,
  isSubmitting,
  onGoBack,
  settings
}) {
  const telegramUser = useMemo(() => getTelegramUser(), []);
  
  const [orderType, setOrderType] = useState('delivery');
  const [paymentType, setPaymentType] = useState('cash');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [comment, setComment] = useState('');
  
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const cartItems = useMemo(() => Object.values(cart), [cart]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cartItems]);

  const isOpen = settings?.is_open !== false;
  const backendDeliveryPrice = Number(settings?.delivery_price ?? 15000);
  const minOrderAmount = Number(settings?.min_order_amount || 0);
  const deliveryPrice = orderType === 'delivery' ? backendDeliveryPrice : 0;
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const orderTypeOptions = [
    { value: 'delivery', label: '🚚 Dastavka', icon: Truck },
    { value: 'pickup', label: '🏃 Olib ketish', icon: MapPin }
  ];

  const paymentTypeOptions = [
    { value: 'cash', label: '💵 Naqd', icon: DollarSign },
    { value: 'card', label: '💳 Karta', icon: CreditCard }
  ];

  const handleGetLocation = () => {
    hapticFeedback('medium');
    if (!navigator.geolocation) {
      showAlert("Bu qurilmada lokatsiya olish qo‘llab-quvvatlanmaydi.");
      return;
    }

    setFetchingLocation(true);
    setValidationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(7);
        const lng = position.coords.longitude.toFixed(7);
        setLatitude(lat);
        setLongitude(lng);
        setFetchingLocation(false);
        setLocationSuccess(true);
        hapticFeedback('success');
      },
      (error) => {
        setFetchingLocation(false);
        console.warn("Geolocation failure:", error);
        hapticFeedback('error');
        showAlert("Koordinatalarni aniqlashda xatolik yuz berdi. Iltimos, manzilni o‘zingiz yozib kiriting.");
      },
      { enableHighAccuracy: true, timeout: 9000 }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    hapticFeedback('medium');
    setValidationError('');

    if (!isOpen) {
      setValidationError('Restoran hozir yopiq. Buyurtma yuborish vaqtincha mavjud emas.');
      hapticFeedback('error');
      return;
    }

    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    if (!trimmedPhone) {
      setValidationError("Telefon raqami talab qilinadi.");
      hapticFeedback('error');
      return;
    }

    if (trimmedPhone.replace(/\D/g, '').length < 9) {
      setValidationError("Iltimos, haqiqiy telefon raqamini kiriting.");
      hapticFeedback('error');
      return;
    }

    if (orderType === 'delivery' && !trimmedAddress && !latitude) {
      setValidationError("Dastavka uchun manzil yozing yoki lokatsiyani yuboring.");
      hapticFeedback('error');
      return;
    }

    if (orderType === 'delivery' && minOrderAmount > 0 && subtotal < minOrderAmount) {
      setValidationError(`Dastavka uchun minimal buyurtma summasi ${minOrderAmount.toLocaleString('uz-UZ')} so‘m.`);
      hapticFeedback('error');
      return;
    }

    const items = cartItems.map(item => ({
      product: item.product.id,
      quantity: item.quantity
    }));

    if (items.length === 0) {
      setValidationError("Savat hozircha bo‘sh. Iltimos, taomlarni qo‘shing.");
      hapticFeedback('error');
      return;
    }

    const telegramInitData = getTelegramInitData();

    const payload = {
      telegram_init_data: telegramInitData,
      telegram_id: telegramUser.id,
      full_name: telegramUser.fullName || 'Telegram Foydalanuvchisi',
      username: telegramUser.username || '',
      order_type: orderType,
      payment_type: paymentType,
      phone: trimmedPhone,
      address: orderType === 'delivery' ? trimmedAddress : '',
      latitude: latitude || null,
      longitude: longitude || null,
      comment: comment.trim(),
      items,
      __total_price: subtotal + deliveryPrice
    };

    onSubmitOrder(payload);
  };

  return (
    <div className="px-5 py-5 pb-24 animate-fade-in text-[#F5EFE6]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="rounded-[2rem] bg-[#1C1511] border border-[#D99A2B]/15 p-4.5 shadow-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(217,154,43,0.13),transparent_35%)]" />
          <div className="relative flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#D99A2B]/12 border border-[#D99A2B]/20 flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-5 h-5 text-[#D99A2B]" />
            </div>
            <div>
              <h2 className="font-serif font-black text-lg text-[#F5EFE6] leading-tight">Buyurtmani yakunlash</h2>
              <p className="text-[11px] text-[#A8988C] leading-relaxed font-semibold mt-1">
                {totalItemCount} ta mahsulot tanlandi. Ma’lumotlarni to‘ldiring, operator buyurtmani Telegram guruhida ko‘radi.
              </p>
            </div>
          </div>
        </div>
        
        {validationError && (
          <div className="bg-red-950/40 text-red-300 border border-red-800/40 rounded-2xl p-4 text-xs font-semibold animate-shake">
            ⚠️ {validationError}
          </div>
        )}

        {!isOpen && (
          <div className="bg-red-950/40 text-red-200 border border-red-800/40 rounded-2xl p-4 text-xs font-bold leading-relaxed">
            Restoran hozir yopiq. Buyurtmani rasmiylashtirish admin paneldan restoran ochiq holatga o‘tkazilgandan keyin ishlaydi.
          </div>
        )}

        <OptionSelector
          label="Yetkazib berish usuli"
          options={orderTypeOptions}
          selectedValue={orderType}
          onChange={setOrderType}
        />

        <SectionCard title="Bog‘lanish ma’lumotlari" subtitle="Operator qo‘ng‘irog‘i uchun">
          <div className="flex flex-col gap-2">
            <label htmlFor="phone-input" className="text-[10px] font-bold text-[#A8988C] uppercase tracking-[0.1em] opacity-85">
              Telefon raqami <span className="text-[#D99A2B]">*</span>
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-4 w-4.5 h-4.5 text-[#A8988C] opacity-70" />
              <input
                id="phone-input"
                type="tel"
                inputMode="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full pl-11 pr-4 py-3.5 bg-[#120E0B] border border-[#D99A2B]/15 rounded-xl text-sm text-[#F5EFE6] focus:outline-none focus:ring-2 focus:ring-[#D99A2B]/40 focus:border-[#D99A2B] placeholder-[#A8988C]/40 font-medium"
              />
            </div>
          </div>
        </SectionCard>

        {orderType === 'delivery' && (
          <SectionCard title="Yetkazib berish manzili" subtitle="Manzil yoki GPS lokatsiya yetarli">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="address-input" className="text-[10px] font-bold text-[#A8988C] uppercase tracking-[0.1em] opacity-85">
                  Aniq manzil <span className="text-[#D99A2B]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="address-input"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Masalan: Sergeli, 5-mavze, 12-uy, 45-xonadon"
                    className="w-full px-4 py-3.5 bg-[#120E0B] border border-[#D99A2B]/15 rounded-xl text-sm text-[#F5EFE6] focus:outline-none focus:ring-2 focus:ring-[#D99A2B]/40 focus:border-[#D99A2B] placeholder-[#A8988C]/40 font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#A8988C] uppercase tracking-[0.1em] opacity-85">
                  Xarita geokoordinatalari
                </span>
                
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={fetchingLocation}
                  className={`w-full py-3.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all border cursor-pointer ${
                    locationSuccess 
                      ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300'
                      : 'bg-[#120E0B] border-[#D99A2B]/15 hover:border-[#D99A2B]/40 text-[#D99A2B]'
                  }`}
                >
                  {fetchingLocation ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D99A2B]" />
                      <span>Lokatsiya aniqlanmoqda...</span>
                    </>
                  ) : locationSuccess ? (
                    <>
                      <Navigation className="w-4 h-4 text-emerald-400 fill-emerald-500/10" />
                      <span>Lokatsiya olindi ✅</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 text-[#D99A2B]" />
                      <span>📍 Lokatsiyani olish</span>
                    </>
                  )}
                </button>

                {locationSuccess && (
                  <p className="text-[10px] text-emerald-300 font-semibold bg-emerald-950/15 border border-emerald-900/30 rounded-xl px-3 py-2">
                    Koordinata: {latitude}, {longitude}
                  </p>
                )}
              </div>
            </div>
          </SectionCard>
        )}

        <OptionSelector
          label="To‘lov turi"
          options={paymentTypeOptions}
          selectedValue={paymentType}
          onChange={setPaymentType}
        />

        <SectionCard title="Izohlar" subtitle="Oshxona uchun qo‘shimcha eslatma">
          <div className="flex flex-col gap-1.5">
            <div className="relative">
              <MessageSquare className="absolute top-4 left-4 w-4.5 h-4.5 text-[#A8988C] opacity-70" />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Masalan: achchiq bo‘lmasin, sous alohida, qo‘ng‘iroq qiling..."
                rows={3}
                className="w-full pl-11 pr-4 py-3.5 bg-[#120E0B] border border-[#D99A2B]/15 rounded-xl text-sm text-[#F5EFE6] focus:outline-none focus:ring-2 focus:ring-[#D99A2B]/40 focus:border-[#D99A2B] placeholder-[#A8988C]/40 font-medium resize-none"
              />
            </div>
          </div>
        </SectionCard>

        <PriceSummary subtotal={subtotal} deliveryPrice={deliveryPrice} title="Yakuniy hisob" />

        {orderType === 'delivery' && (
          <div className="rounded-2xl border border-[#D99A2B]/12 bg-[#1C1511]/72 px-4 py-3 text-[11px] leading-relaxed text-[#A8988C] font-semibold">
            Backend sozlamasidagi dastavka narxi ishlatilmoqda: {backendDeliveryPrice.toLocaleString('uz-UZ')} so‘m.
            {minOrderAmount > 0 && ` Minimal buyurtma: ${minOrderAmount.toLocaleString('uz-UZ')} so‘m.`}
          </div>
        )}

        <div className="rounded-2xl border border-[#D99A2B]/12 bg-[#1C1511]/72 px-4 py-3 text-[11px] leading-relaxed text-[#A8988C] font-semibold flex gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#D99A2B] shrink-0 mt-0.5" />
          <span>Bu online to‘lov emas. Tanlangan to‘lov turi operatorga ko‘rinadi va buyurtma tasdiqlangandan keyin hisob-kitob qilinadi.</span>
        </div>

        <div className="rounded-2xl border border-[#D99A2B]/12 bg-[#120E0B] px-4 py-3 text-[10px] text-[#A8988C] font-bold uppercase tracking-wide flex items-center justify-center gap-2">
          <Clock3 className="w-4 h-4 text-[#D99A2B]" />
          Operator tasdig‘idan so‘ng tayyorlash boshlanadi
        </div>

        <div className="mt-3 sticky bottom-4 z-30">
          <button
            type="submit"
            disabled={isSubmitting || !isOpen}
            className="w-full py-4.5 bg-[#D99A2B] hover:bg-[#C98A1F] text-[#120E0B] disabled:bg-neutral-800 disabled:text-neutral-500 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-2xl shadow-black/35 border border-[#FFE2A3]/25 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#120E0B]" />
                <span>Yuborilmoqda...</span>
              </>
            ) : (
              <>
                <span>{isOpen ? 'Buyurtmani tasdiqlash' : 'Restoran yopiq'}</span>
                <ArrowRight className="w-4 h-4 text-[#120E0B]" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
