from decimal import Decimal
from html import escape

from django.conf import settings

from telegrambot.services import TelegramAPIError, send_message

from .models import Order


STATUS_BUTTONS = [
    ("✅ Qabul qilish", "accepted"),
    ("👨‍🍳 Tayyorlanmoqda", "preparing"),
    ("🚚 Yo‘lda", "on_way"),
    ("🎉 Yetkazildi", "completed"),
    ("❌ Bekor qilish", "cancelled"),
]


def money(value) -> str:
    if value is None:
        return "0 so‘m"

    try:
        return f"{int(value):,}".replace(",", " ") + " so‘m"
    except (TypeError, ValueError):
        return f"{value} so‘m"


def safe_text(value) -> str:
    if value is None:
        return ""

    return escape(str(value), quote=False)


def format_coordinate(value):
    if value is None:
        return None

    if isinstance(value, Decimal):
        return str(value)

    return str(value)


def build_location_links(order: Order) -> dict | None:
    if not order.latitude or not order.longitude:
        return None

    latitude = format_coordinate(order.latitude)
    longitude = format_coordinate(order.longitude)

    google_maps_url = f"https://www.google.com/maps?q={latitude},{longitude}"
    yandex_maps_url = (
        f"https://yandex.uz/maps/?ll={longitude}%2C{latitude}"
        f"&z=17&pt={longitude},{latitude},pm2rdm"
    )

    return {
        "google": google_maps_url,
        "yandex": yandex_maps_url,
    }


def build_order_items_text(order: Order) -> str:
    lines = []

    for index, item in enumerate(order.items.all(), start=1):
        product_name = safe_text(item.product_name)

        lines.append(
            f"{index}) <b>{product_name}</b>\n"
            f"   {item.quantity} × {money(item.price)} = <b>{money(item.total)}</b>"
        )

    return "\n".join(lines)


def payment_type_label(order: Order) -> str:
    labels = {
        Order.PaymentType.CASH: "💵 Naqd",
        Order.PaymentType.CLICK: "🟢 Click",
        Order.PaymentType.PAYME: "🔵 Payme",
    }
    return labels.get(order.payment_type, safe_text(order.payment_type))


def payment_status_label(order: Order) -> str:
    labels = {
        Order.PaymentStatus.UNPAID: "To‘lanmagan",
        Order.PaymentStatus.PENDING: "To‘lov kutilmoqda",
        Order.PaymentStatus.PAID: "To‘langan",
        Order.PaymentStatus.FAILED: "To‘lov xatosi",
        Order.PaymentStatus.CANCELLED: "Bekor qilingan",
        Order.PaymentStatus.REFUNDED: "Qaytarilgan",
    }
    return labels.get(order.payment_status, safe_text(order.payment_status))


def build_order_message(order: Order) -> str:
    order_type = "🚚 Dastavka" if order.order_type == "delivery" else "🏃 Olib ketish"
    payment_type = payment_type_label(order)
    payment_status = payment_status_label(order)

    customer_name = "Noma’lum"
    customer_username = ""

    if order.customer:
        customer_name = safe_text(order.customer.full_name or "Noma’lum")

        if order.customer.username:
            customer_username = f" (@{safe_text(order.customer.username)})"

    phone = safe_text(order.phone)
    address = safe_text(order.address)
    comment = safe_text(order.comment)

    items_text = build_order_items_text(order)

    address_text = ""
    if order.address:
        address_text = f"\n🏠 <b>Manzil:</b> {address}"

    location_text = ""
    location_links = build_location_links(order)

    if location_links:
        location_text = (
            f"\n📍 <b>Lokatsiya:</b> {safe_text(order.latitude)}, {safe_text(order.longitude)}"
            f"\n🗺 <a href=\"{location_links['google']}\">Google Maps orqali ochish</a>"
            f"\n🧭 <a href=\"{location_links['yandex']}\">Yandex Maps orqali ochish</a>"
        )

    comment_text = ""
    if order.comment:
        comment_text = f"\n📝 <b>Izoh:</b> {comment}"

    message = (
        f"🆕 <b>Yangi buyurtma #{order.id}</b>\n"
        f"🍽 <b>Damirchi</b>\n\n"
        f"👤 <b>Mijoz:</b> {customer_name}{customer_username}\n"
        f"📞 <b>Telefon:</b> {phone}\n"
        f"📦 <b>Turi:</b> {order_type}\n"
        f"💳 <b>To‘lov:</b> {payment_type}\n"
        f"💰 <b>To‘lov holati:</b> {payment_status}"
        f"{address_text}"
        f"{location_text}"
        f"{comment_text}\n\n"
        f"🍽 <b>Buyurtma tarkibi:</b>\n"
        f"{items_text}\n\n"
        f"🧾 <b>Mahsulotlar:</b> {money(order.subtotal)}\n"
        f"🚚 <b>Dastavka:</b> {money(order.delivery_price)}\n"
        f"💰 <b>Jami:</b> {money(order.total_price)}"
    )

    return message


def build_payment_operator_message(order: Order) -> str:
    customer_name = "Noma’lum"
    if order.customer:
        customer_name = safe_text(order.customer.full_name or "Noma’lum")

    return (
        "💳 <b>TO‘LOV TASDIQLANDI</b>\n\n"
        f"🧾 <b>Buyurtma:</b> #{safe_text(order.id)}\n"
        f"👤 <b>Mijoz:</b> {customer_name}\n"
        f"📞 <b>Telefon:</b> {safe_text(order.phone)}\n"
        f"💳 <b>To‘lov turi:</b> {payment_type_label(order)}\n"
        f"✅ <b>Holati:</b> {payment_status_label(order)}\n"
        f"💰 <b>Summa:</b> {money(order.total_price)}"
    )


def build_status_keyboard(order_id: str, order: Order | None = None) -> dict:
    inline_keyboard = []

    if order:
        location_links = build_location_links(order)

        if location_links:
            inline_keyboard.append(
                [
                    {
                        "text": "📍 Google Maps",
                        "url": location_links["google"],
                    },
                    {
                        "text": "🧭 Yandex Maps",
                        "url": location_links["yandex"],
                    },
                ]
            )

    for text, status in STATUS_BUTTONS:
        inline_keyboard.append(
            [
                {
                    "text": text,
                    "callback_data": f"order_status:{order_id}:{status}",
                }
            ]
        )

    return {"inline_keyboard": inline_keyboard}


def send_order_to_operator_group(order: Order) -> None:
    operator_chat_id = getattr(settings, "OPERATOR_CHAT_ID", "") or ""

    if not operator_chat_id:
        print("OPERATOR_CHAT_ID .env ichida yo‘q.")
        return

    # Online payment callback orqali tasdiqlangan bo‘lsa, avval to‘lov mavzusiga
    # qisqa moliyaviy xabar yuboramiz, keyin buyurtmani buyurtmalar mavzusiga.
    if order.is_online_payment and order.payment_status == Order.PaymentStatus.PAID:
        try:
            send_message(
                operator_chat_id,
                build_payment_operator_message(order),
                message_thread_id=(
                    getattr(settings, "TELEGRAM_TOPIC_PAYMENTS_ID", "") or None
                ),
            )
        except TelegramAPIError as exc:
            print("To‘lov mavzusiga Telegram xabari yuborilmadi:", exc)

    try:
        send_message(
            operator_chat_id,
            build_order_message(order),
            reply_markup=build_status_keyboard(str(order.id), order),
            message_thread_id=(
                getattr(settings, "TELEGRAM_TOPIC_ORDERS_ID", "") or None
            ),
        )
    except TelegramAPIError as exc:
        print("Telegramga buyurtma yuborishda xatolik:", exc)


def send_payment_confirmation_to_customer(order: Order) -> None:
    """Best-effort Telegram confirmation after Click/Payme server callback."""
    telegram_id = getattr(getattr(order, "customer", None), "telegram_id", None)

    if not getattr(settings, "BOT_TOKEN", "") or not telegram_id:
        return

    provider = "Click" if order.payment_type == Order.PaymentType.CLICK else "Payme"
    text = (
        f"✅ <b>To‘lov tasdiqlandi</b>\n\n"
        f"Buyurtma: <b>#{safe_text(order.id)}</b>\n"
        f"To‘lov turi: <b>{provider}</b>\n"
        f"Summa: <b>{money(order.total_price)}</b>\n\n"
        "Buyurtmangiz Damirchi operatoriga yuborildi."
    )

    try:
        send_message(telegram_id, text)
    except TelegramAPIError as exc:
        print("Payment confirmation Telegram xatoligi:", exc)
