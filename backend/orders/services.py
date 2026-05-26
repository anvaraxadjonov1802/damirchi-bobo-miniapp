import os
from decimal import Decimal
from html import escape

import requests

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


def build_order_message(order: Order) -> str:
    order_type = "🚚 Dastavka" if order.order_type == "delivery" else "🏃 Olib ketish"
    payment_type = "💵 Naqd" if order.payment_type == "cash" else "💳 Karta"

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
        f"💳 <b>To‘lov:</b> {payment_type}"
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


def build_status_keyboard(order_id: int, order: Order | None = None) -> dict:
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
    bot_token = os.getenv("BOT_TOKEN")
    operator_chat_id = os.getenv("OPERATOR_CHAT_ID")

    if not bot_token or not operator_chat_id:
        print("BOT_TOKEN yoki OPERATOR_CHAT_ID .env ichida yo‘q.")
        return

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"

    payload = {
        "chat_id": operator_chat_id,
        "text": build_order_message(order),
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
        "reply_markup": build_status_keyboard(order.id, order),
    }

    try:
        response = requests.post(url, json=payload, timeout=15)

        if response.status_code != 200:
            print("Telegramga xabar yuborishda xatolik:", response.text)

    except requests.RequestException as exc:
        print("Telegram request xatoligi:", exc)