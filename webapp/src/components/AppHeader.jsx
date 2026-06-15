import React from "react";
import {
  Bell,
  ChevronLeft,
  MapPin,
  Sparkles,
  Store,
} from "lucide-react";

import { hapticFeedback } from "../telegram/telegram";

const screenTitles = {
  cart: "Savat",
  checkout: "Buyurtma",
  success: "Qabul qilindi",
};

export default function AppHeader({
  cartCount = 0,
  notificationCount = 0,
  onNotificationClick,
  currentScreen = "menu",
  onBackClick,
  settings,
}) {
  const restaurantName = settings?.restaurant_name || "Damirchi";
  const address = settings?.address || "Toshkent";
  const isOpen = settings?.is_open !== false;

  const isMenu = currentScreen === "menu";
  const title = screenTitles[currentScreen] || restaurantName;

  const handleNotificationClick = () => {
    hapticFeedback("light");
    onNotificationClick?.();
  };

  const handleBackClick = () => {
    hapticFeedback("light");
    onBackClick?.();
  };

  return (
    <header className="sticky top-0 z-40 safe-top border-b border-[var(--app-border-soft)] bg-[rgba(255,250,242,0.92)] px-4 pb-3 pt-3 backdrop-blur-xl">
      {isMenu ? (
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-[var(--app-accent)] text-white shadow-[var(--app-shadow-button)]">
              <Store className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="truncate text-[20px] font-black leading-none tracking-[-0.04em] text-[var(--app-text)]">
                  {restaurantName}
                </h1>

                <Sparkles className="h-3.5 w-3.5 shrink-0 text-[var(--app-accent)]" />
              </div>

              <div className="mt-1.5 flex min-w-0 items-center gap-1.5">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    isOpen ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />

                <span
                  className={`shrink-0 text-[10px] font-black uppercase tracking-[0.14em] ${
                    isOpen ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  {isOpen ? "Ochiq" : "Yopiq"}
                </span>

                <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--app-border)]" />

                <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--app-accent-dark)]" />

                <span className="truncate text-[11px] font-bold text-[var(--app-muted)]">
                  {address}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNotificationClick}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] border border-[var(--app-border)] bg-white shadow-[var(--app-shadow-card)] transition-click"
            aria-label="Bildirishnomalar"
          >
            <Bell className="h-5 w-5 text-[var(--app-accent-dark)]" />

            {notificationCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 animate-scale-in items-center justify-center rounded-full border-2 border-[#FFFAF2] bg-[#C89438] px-1 text-[10px] font-black text-white shadow-md">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBackClick}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] border border-[var(--app-border)] bg-white shadow-[var(--app-shadow-card)] transition-click"
            aria-label="Orqaga"
          >
            <ChevronLeft className="h-5 w-5 text-[var(--app-text)]" />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <h1 className="truncate text-[19px] font-black leading-tight tracking-[-0.035em] text-[var(--app-text)]">
              {title}
            </h1>

            <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--app-muted)]">
              Damirchi
            </p>
          </div>

          <div className="h-11 w-11 shrink-0" />
        </div>
      )}
    </header>
  );
}