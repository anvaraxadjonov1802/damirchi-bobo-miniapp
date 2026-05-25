import os
import requests

from .models import Order
from decimal import Decimal


STATUS_BUTTONS = [
    ("✅ Qabul qilindi", "accepted"),
    ("👨‍🍳 Tayyorlanmoqda", "preparing"),
    ("🚚 Yo‘lda", "on_way"),
    ("✅ Yetkazildi", "completed"),
    ("❌ Bekor qilindi", "cancelled"),
]


def build_order_message(order: Order) -> str:
    order_type = "🚚 Dastavka" if order.order_type == "delivery" else "🏃 Olib ketish"
    payment_type = "💵 Naqd" if order.payment_type == "cash" else "💳 Karta"

    items_text = ""

    for index, item in enumerate(order.items.all(), start=1):
        items_text += (
            f"{index}. {item.product_name}\n"
            f"   {item.quantity} x {item.price:,} so‘m = {item.total:,} so‘m\n"
        )

    location_text = ""
    location_links = build_location_links(order)

    if location_links:
        location_text = (
            f"\n📍 Lokatsiya: {order.latitude}, {order.longitude}"
            f"\n🗺 <a href=\"{location_links['google']}\">Google Maps orqali ochish</a>"
            f"\n🧭 <a href=\"{location_links['yandex']}\">Yandex Maps orqali ochish</a>"
        )

    comment_text = ""
    if order.comment:
        comment_text = f"\n📝 Izoh: {order.comment}"

    address_text = ""
    if order.address:
        address_text = f"\n🏠 Manzil: {order.address}"

    message = (
        f"🆕 <b>Yangi buyurtma #{order.id}</b>\n\n"
        f"👤 Mijoz: {order.customer.full_name if order.customer else 'Noma’lum'}\n"
        f"📞 Telefon: {order.phone}\n"
        f"📦 Turi: {order_type}\n"
        f"💳 To‘lov: {payment_type}"
        f"{address_text}"
        f"{location_text}"
        f"{comment_text}\n\n"
        f"🍽 <b>Buyurtma:</b>\n"
        f"{items_text}\n"
        f"🧾 Mahsulotlar: {order.subtotal:,} so‘m\n"
        f"🚚 Dastavka: {order.delivery_price:,} so‘m\n"
        f"💰 <b>Jami: {order.total_price:,} so‘m</b>"
    )

    return message


def build_status_keyboard(order_id: int, order: Order | None = None) -> dict:
    inline_keyboard = []

    if order:
        location_links = build_location_links(order)

        if location_links:
            inline_keyboard.append([
                {
                    "text": "📍 Google Maps",
                    "url": location_links["google"],
                },
                {
                    "text": "🧭 Yandex Maps",
                    "url": location_links["yandex"],
                },
            ])

    for text, status in STATUS_BUTTONS:
        inline_keyboard.append([
            {
                "text": text,
                "callback_data": f"order_status:{order_id}:{status}",
            }
        ])

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
        "reply_markup": build_status_keyboard(order.id, order),
    }

    response = requests.post(url, json=payload, timeout=10)

    if response.status_code != 200:
        print("Telegramga xabar yuborishda xatolik:", response.text)



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