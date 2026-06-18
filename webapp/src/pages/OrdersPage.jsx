import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  PackageCheck,
  ReceiptText,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

import EmptyState from "../components/EmptyState";
import { formatPrice } from "../utils/format";
import { hapticFeedback } from "../telegram/telegram";

const STATUS_CONFIG = {
  new: {
    label: "Yangi",
    description: "Buyurtma operatorga yuborildi.",
    icon: Clock3,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  accepted: {
    label: "Qabul qilindi",
    description: "Restoran buyurtmani qabul qildi.",
    icon: CheckCircle2,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  preparing: {
    label: "Tayyorlanmoqda",
    description: "Taomlaringiz tayyorlanmoqda.",
    icon: Clock3,
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  on_way: {
    label: "Yo‘lda",
    description: "Buyurtmangiz manzil tomon yo‘lga chiqdi.",
    icon: Truck,
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
  completed: {
    label: "Yetkazildi",
    description: "Buyurtma muvaffaqiyatli yakunlandi.",
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  cancelled: {
    label: "Bekor qilindi",
    description: "Buyurtma bekor qilingan.",
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

function formatOrderDate(value) {
  if (!value) return "Sana ko‘rsatilmagan";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sana ko‘rsatilmagan";
  }

  return new Intl.DateTimeFormat("uz-UZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.new;
}

function getOrderItems(order) {
  if (Array.isArray(order?.items)) return order.items;
  if (Array.isArray(order?.order_items)) return order.order_items;
  return [];
}

function getItemName(item) {
  return (
    item?.name_uz ||
    item?.product_name ||
    item?.product?.name_uz ||
    item?.product?.name ||
    `Mahsulot #${item?.product_id || item?.product || ""}`
  );
}

function getItemQuantity(item) {
  return Number(item?.quantity || 0);
}

function getItemPrice(item) {
  return Number(
    item?.price ||
      item?.product_price ||
      item?.product?.price ||
      0
  );
}

function OrderCard({ order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const status = getStatusConfig(order?.status);
  const StatusIcon = status.icon;
  const items = getOrderItems(order);
  const orderType = order?.order_type === "pickup" ? "pickup" : "delivery";
  const OrderTypeIcon = orderType === "pickup" ? PackageCheck : Truck;

  const itemCount = items.reduce(
    (total, item) => total + getItemQuantity(item),
    0
  );

  const totalPrice = Number(
    order?.total_price ??
      order?.total ??
      items.reduce(
        (total, item) =>
          total + getItemPrice(item) * getItemQuantity(item),
        0
      )
  );

  const toggleExpanded = () => {
    hapticFeedback("light");
    setIsExpanded((current) => !current);
  };

  return (
    <article className="overflow-hidden rounded-[22px] border border-[#E9E3DA] bg-white shadow-[0_14px_34px_-28px_rgba(36,24,18,0.6)]">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#FFF0D3] text-[#A97824]">
              <ReceiptText className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-black text-[#241812]">
                Buyurtma #{order?.id ?? "—"}
              </h2>

              <p className="mt-1 text-[10px] font-bold text-[#8B8178]">
                {formatOrderDate(order?.created_at)}
              </p>
            </div>
          </div>

          <div
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-black ${status.className}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {status.label}
          </div>
        </div>

        <div className="mt-4 rounded-[16px] border border-[#EFE8DF] bg-[#FFFAF2] p-3">
          <div className="flex items-center gap-2">
            <OrderTypeIcon className="h-4 w-4 text-[#A97824]" />

            <span className="text-[11px] font-black text-[#241812]">
              {orderType === "pickup" ? "Olib ketish" : "Dastavka"}
            </span>
          </div>

          <p className="mt-2 text-[11px] font-semibold leading-[1.45] text-[#776B60]">
            {status.description}
          </p>

          {orderType === "delivery" && order?.address && (
            <p className="mt-2 line-clamp-2 text-[10px] font-bold leading-[1.45] text-[#8B8178]">
              Manzil: {order.address}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold text-[#8B8178]">
              {items.length} xil, {itemCount} ta mahsulot
            </p>

            <p className="mt-1 text-[18px] font-black tracking-[-0.03em] text-[#6F4624]">
              {formatPrice(totalPrice)}
            </p>
          </div>

          <button
            type="button"
            onClick={toggleExpanded}
            className="flex h-10 items-center gap-2 rounded-[14px] border border-[#E9DCC7] bg-white px-3 text-[10px] font-black text-[#A97824] transition active:scale-95"
          >
            Batafsil
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-[#EFE8DF] bg-[#FFFCF7] px-4 py-3">
          <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-[#8B8178]">
            Buyurtma tarkibi
          </h3>

          <div className="mt-3 flex flex-col gap-2.5">
            {items.length > 0 ? (
              items.map((item, index) => {
                const quantity = getItemQuantity(item);
                const price = getItemPrice(item);

                return (
                  <div
                    key={`${getItemName(item)}-${index}`}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-black text-[#241812]">
                        {getItemName(item)}
                      </p>

                      <p className="mt-0.5 text-[10px] font-bold text-[#8B8178]">
                        {quantity} × {formatPrice(price)}
                      </p>
                    </div>

                    <p className="shrink-0 text-[12px] font-black text-[#6F4624]">
                      {formatPrice(price * quantity)}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-[11px] font-semibold text-[#8B8178]">
                Mahsulotlar ro‘yxati saqlanmagan.
              </p>
            )}
          </div>

          <div className="mt-3 border-t border-[#EFE8DF] pt-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#776B60]">
              <span>To‘lov turi</span>
              <span className="font-black text-[#241812]">
                {order?.payment_type === "card" ? "Karta" : "Naqd"}
              </span>
            </div>

            {order?.phone && (
              <div className="mt-2 flex items-center justify-between gap-3 text-[11px] font-bold text-[#776B60]">
                <span>Telefon</span>
                <span className="truncate font-black text-[#241812]">
                  {order.phone}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default function OrdersPage({
  orders = [],
  onGoToMenu,
}) {
  const sortedOrders = useMemo(() => {
    return [...orders].sort((firstOrder, secondOrder) => {
      const firstTime = new Date(firstOrder?.created_at || 0).getTime();
      const secondTime = new Date(secondOrder?.created_at || 0).getTime();
      return secondTime - firstTime;
    });
  }, [orders]);

  if (sortedOrders.length === 0) {
    return (
      <div className="min-h-[calc(100dvh-88px)] bg-[#F7F3EB] px-4 py-6">
        <EmptyState
          title="Buyurtmalar yo‘q"
          description="Birinchi buyurtmangiz shu bo‘limda ko‘rinadi."
          buttonText="Menyuga o‘tish"
          onAction={onGoToMenu}
        />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#F7F3EB] px-4 pb-28 pt-3">
      <section className="rounded-[22px] border border-[#E9E3DA] bg-white p-4 shadow-[0_14px_34px_-28px_rgba(36,24,18,0.6)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#FFF0D3] text-[#A97824]">
            <ShoppingBag className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-[20px] font-black tracking-[-0.035em] text-[#241812]">
              Buyurtmalarim
            </h1>

            <p className="mt-1 text-[11px] font-bold text-[#776B60]">
              Oxirgi {sortedOrders.length} ta buyurtma
            </p>
          </div>
        </div>
      </section>

      <section className="mt-3 flex flex-col gap-3">
        {sortedOrders.map((order, index) => (
          <OrderCard
            key={order?.id ?? `order-${index}`}
            order={order}
          />
        ))}
      </section>
    </div>
  );
}
