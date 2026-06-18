import React, { useMemo } from "react";
import {
  ChevronRight,
  Clock3,
  Info,
  Instagram,
  MapPin,
  PackageCheck,
  Phone,
  Send,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";

import { getTelegramUser, hapticFeedback } from "../telegram/telegram";

function getInitials(name = "") {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "D";

  return parts.map((part) => part[0]?.toUpperCase()).join("");
}

function normalizeExternalUrl(value = "") {
  const trimmed = String(value || "").trim();

  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("@")) {
    return `https://t.me/${trimmed.slice(1)}`;
  }

  return `https://${trimmed}`;
}

function openExternalLink(url) {
  const normalizedUrl = normalizeExternalUrl(url);

  if (!normalizedUrl) return;

  const webApp = window.Telegram?.WebApp;

  if (
    normalizedUrl.includes("t.me/") &&
    typeof webApp?.openTelegramLink === "function"
  ) {
    webApp.openTelegramLink(normalizedUrl);
    return;
  }

  if (typeof webApp?.openLink === "function") {
    webApp.openLink(normalizedUrl);
    return;
  }

  window.open(normalizedUrl, "_blank", "noopener,noreferrer");
}

function formatWorkingHours(openTime, closeTime) {
  if (!openTime || !closeTime) {
    return "Ish vaqti operator orqali aniqlanadi";
  }

  return `${String(openTime).slice(0, 5)} — ${String(closeTime).slice(0, 5)}`;
}

function ActionRow({
  icon: Icon,
  title,
  subtitle,
  onClick,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-3 rounded-[18px] border border-[#E9E3DA] bg-white p-3.5 text-left shadow-[0_12px_28px_-26px_rgba(36,24,18,0.55)] transition active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-45"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#FFF0D3] text-[#A97824]">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-black text-[#241812]">
          {title}
        </p>

        <p className="mt-1 line-clamp-1 text-[10px] font-bold text-[#8B8178]">
          {subtitle}
        </p>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-[#B5AA9F]" />
    </button>
  );
}

export default function ProfilePage({
  settings,
  orderType = "delivery",
  orderCount = 0,
  onGoToOrders,
}) {
  const telegramUser = useMemo(() => getTelegramUser(), []);

  const fullName =
    telegramUser?.fullName ||
    [telegramUser?.first_name, telegramUser?.last_name]
      .filter(Boolean)
      .join(" ") ||
    "Telegram foydalanuvchisi";

  const username = telegramUser?.username
    ? `@${telegramUser.username}`
    : "Username ko‘rsatilmagan";

  const restaurantName = settings?.restaurant_name || "Damirchi";
  const restaurantPhone = settings?.phone || "";
  const restaurantAddress =
    settings?.address || "Toshkent, Sergeli Yangihayot Betonka";

  const callRestaurant = () => {
    if (!restaurantPhone) return;

    hapticFeedback("light");
    window.location.href = `tel:${restaurantPhone.replace(/\s/g, "")}`;
  };

  const openOrders = () => {
    hapticFeedback("light");
    onGoToOrders?.();
  };

  const openInstagram = () => {
    hapticFeedback("light");
    openExternalLink(settings?.instagram_url);
  };

  const openTelegram = () => {
    hapticFeedback("light");
    openExternalLink(settings?.telegram_url);
  };

  const openAddress = () => {
    hapticFeedback("light");

    const query = encodeURIComponent(restaurantAddress);
    openExternalLink(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  return (
    <div className="min-h-[100dvh] bg-[#F7F3EB] px-4 pb-28 pt-3">
      <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#C89438] to-[#6F4624] p-4 text-white shadow-[0_18px_42px_-28px_rgba(111,70,36,0.9)]">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 left-12 h-44 w-44 rounded-full bg-white/10" />

        <div className="relative flex items-center gap-4">
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-white/20 bg-white/15 text-[24px] font-black backdrop-blur-md">
            {telegramUser?.photo_url ? (
              <img
                src={telegramUser.photo_url}
                alt={fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(fullName)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/70">
              Telegram profil
            </p>

            <h1 className="mt-1 truncate text-[21px] font-black tracking-[-0.035em]">
              {fullName}
            </h1>

            <p className="mt-1 truncate text-[11px] font-bold text-white/80">
              {username}
            </p>

            {telegramUser?.id && (
              <p className="mt-1 text-[9px] font-bold text-white/60">
                ID: {telegramUser.id}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-[20px] border border-[#E9E3DA] bg-white p-3.5 shadow-[0_12px_28px_-26px_rgba(36,24,18,0.55)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#FFF0D3] text-[#A97824]">
            <ShoppingBag className="h-[18px] w-[18px]" />
          </div>

          <p className="mt-3 text-[19px] font-black text-[#241812]">
            {orderCount}
          </p>

          <p className="mt-1 text-[10px] font-bold text-[#8B8178]">
            Buyurtmalar
          </p>
        </div>

        <div className="rounded-[20px] border border-[#E9E3DA] bg-white p-3.5 shadow-[0_12px_28px_-26px_rgba(36,24,18,0.55)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#FFF0D3] text-[#A97824]">
            {orderType === "pickup" ? (
              <PackageCheck className="h-[18px] w-[18px]" />
            ) : (
              <Truck className="h-[18px] w-[18px]" />
            )}
          </div>

          <p className="mt-3 truncate text-[14px] font-black text-[#241812]">
            {orderType === "pickup" ? "Olib ketish" : "Dastavka"}
          </p>

          <p className="mt-1 text-[10px] font-bold text-[#8B8178]">
            Tanlangan usul
          </p>
        </div>
      </section>

      <section className="mt-4">
        <div className="mb-2 px-1">
          <h2 className="text-[16px] font-black tracking-[-0.025em] text-[#241812]">
            Mening bo‘limim
          </h2>
        </div>

        <ActionRow
          icon={ShoppingBag}
          title="Buyurtmalarim"
          subtitle="Oldingi buyurtmalar va ularning holatini ko‘ring"
          onClick={openOrders}
        />
      </section>

      <section className="mt-4">
        <div className="mb-2 px-1">
          <h2 className="text-[16px] font-black tracking-[-0.025em] text-[#241812]">
            Restoran bilan aloqa
          </h2>
        </div>

        <div className="flex flex-col gap-2.5">
          <ActionRow
            icon={Phone}
            title={restaurantPhone || "Telefon raqam"}
            subtitle="Damirchi operatoriga qo‘ng‘iroq qilish"
            onClick={callRestaurant}
            disabled={!restaurantPhone}
          />

          <ActionRow
            icon={MapPin}
            title={restaurantAddress}
            subtitle="Xaritada restoran manzilini ochish"
            onClick={openAddress}
          />

          <ActionRow
            icon={Clock3}
            title={formatWorkingHours(
              settings?.open_time,
              settings?.close_time
            )}
            subtitle={
              settings?.is_open === false
                ? "Restoran hozir yopiq"
                : "Restoran hozir ochiq"
            }
            onClick={() => {}}
            disabled
          />

          {settings?.telegram_url && (
            <ActionRow
              icon={Send}
              title="Telegram"
              subtitle="Restoranning Telegram sahifasini ochish"
              onClick={openTelegram}
            />
          )}

          {settings?.instagram_url && (
            <ActionRow
              icon={Instagram}
              title="Instagram"
              subtitle="Restoranning Instagram sahifasini ochish"
              onClick={openInstagram}
            />
          )}
        </div>
      </section>

      <section className="mt-4 rounded-[22px] border border-[#E9E3DA] bg-white p-4 shadow-[0_12px_28px_-26px_rgba(36,24,18,0.55)]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#FFF0D3] text-[#A97824]">
            <ShieldCheck className="h-[18px] w-[18px]" />
          </div>

          <div>
            <h2 className="text-[13px] font-black text-[#241812]">
              Xavfsiz Telegram buyurtma
            </h2>

            <p className="mt-1 text-[10px] font-semibold leading-[1.5] text-[#776B60]">
              Profil ma’lumotlari Telegram orqali olinadi. Buyurtma
              operator tomonidan tasdiqlangandan keyin tayyorlanadi.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-3 flex items-center justify-center gap-2 pb-2 text-[9px] font-bold text-[#A59B92]">
        <Info className="h-3.5 w-3.5" />
        <span>{restaurantName} Mini App · 1.0.0</span>
      </section>
    </div>
  );
}
