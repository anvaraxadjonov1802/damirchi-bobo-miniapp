import React from "react";
import { Bell, CheckCircle2, Clock3, PackageCheck, X } from "lucide-react";

import { hapticFeedback } from "../telegram/telegram";

function getIcon(type) {
  if (type === "success") return CheckCircle2;
  if (type === "order") return PackageCheck;
  return Clock3;
}

export default function NotificationModal({
  isOpen,
  onClose,
  notifications = [],
}) {
  if (!isOpen) return null;

  const handleClose = () => {
    hapticFeedback("light");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[9998] mx-auto max-w-[480px] bg-black/30 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 max-h-[78dvh] overflow-hidden rounded-t-[28px] bg-white shadow-[0_-18px_50px_-28px_rgba(0,0,0,0.55)] animate-map-sheet">
        <div className="sticky top-0 z-10 border-b border-[#E7E7E7] bg-white px-4 pb-3 pt-4">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#E5E5E5]" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[22px] font-black tracking-[-0.04em] text-[#1F1F1F]">
                Bildirishnomalar
              </h2>

              <p className="mt-1 text-[12px] font-semibold text-[#777777]">
                Buyurtma va yangiliklar shu yerda ko‘rinadi
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F6F6F7] text-[#1F1F1F] active:scale-95"
              aria-label="Yopish"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(78dvh-94px)] overflow-y-auto px-4 py-4">
          {notifications.length > 0 ? (
            <div className="flex flex-col gap-3">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type);

                return (
                  <div
                    key={notification.id}
                    className="rounded-[22px] border border-[#E7E7E7] bg-[#FAFAFA] p-3.5"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0D3] text-[#C89438]">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-[14px] font-black leading-snug text-[#1F1F1F]">
                            {notification.title}
                          </h3>

                          {!notification.read && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#C89438]" />
                          )}
                        </div>

                        <p className="mt-1 text-[12px] font-semibold leading-snug text-[#666666]">
                          {notification.message}
                        </p>

                        {notification.time && (
                          <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#9A9A9A]">
                            {notification.time}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#E0E0E0] bg-[#FAFAFA] px-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#FFF0D3] text-[#C89438]">
                <Bell className="h-7 w-7" />
              </div>

              <h3 className="text-[18px] font-black text-[#1F1F1F]">
                Hozircha bildirishnoma yo‘q
              </h3>

              <p className="mt-2 text-[13px] font-semibold leading-snug text-[#777777]">
                Buyurtma statuslari va muhim xabarlar shu yerda ko‘rinadi.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}