import json
import logging
import secrets

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from common.models import RestaurantSettings
from orders.models import Order

from .keyboards import back_to_menu_keyboard, main_menu_keyboard
from .messages import (
    STATUS_TEXTS,
    STATUS_USER_MESSAGES,
    about_text,
    contact_text,
    help_text,
    start_text,
)
from .services import (
    TelegramAPIError,
    answer_callback_query,
    edit_message_text,
    send_message,
)


logger = logging.getLogger(__name__)


def _webapp_url() -> str:
    return (getattr(settings, "WEBAPP_URL", "") or "").rstrip("/")


def _operator_chat_id():
    value = getattr(settings, "OPERATOR_CHAT_ID", None)
    if value in (None, ""):
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _full_name(user: dict) -> str:
    parts = [user.get("first_name") or "", user.get("last_name") or ""]
    value = " ".join(part.strip() for part in parts if part.strip()).strip()
    return value or "mijoz"


def _settings_contact_text() -> str:
    restaurant = RestaurantSettings.load()
    return contact_text(
        phone=restaurant.phone,
        address=restaurant.address,
        telegram_url=restaurant.telegram_url,
        instagram_url=restaurant.instagram_url,
    )


def _settings_about_text() -> str:
    restaurant = RestaurantSettings.load()
    return about_text(restaurant.restaurant_name)


def _send_or_edit(chat_id, message_id, text: str, reply_markup: dict | None = None):
    if message_id:
        try:
            return edit_message_text(chat_id, message_id, text, reply_markup)
        except TelegramAPIError as exc:
            # "message is not modified" and old Telegram clients shouldn't break navigation.
            logger.info("Telegram edit fallback: %s", exc)
    return send_message(chat_id, text, reply_markup)


def _handle_message(message: dict):
    chat = message.get("chat") or {}
    chat_id = chat.get("id")
    chat_type = chat.get("type")
    if chat_id is None:
        return

    text = (message.get("text") or "").strip()
    user = message.get("from") or {}
    command = text.split(maxsplit=1)[0].split("@", 1)[0].lower() if text.startswith("/") else ""
    webapp_url = _webapp_url()

    if command == "/chatid":
        send_message(chat_id, f"Chat ID: <code>{chat_id}</code>")
        return

    if chat_type != "private":
        return

    if command in {"/start", "/menu"} or text in {
        "Menyu",
        "🍽 Menyu",
        "Menyuni ochish",
        "🍽 Menyuni ochish",
    }:
        send_message(
            chat_id,
            start_text(_full_name(user)),
            main_menu_keyboard(webapp_url),
        )
        return

    if command == "/help" or text in {"Yordam", "🆘 Yordam"}:
        send_message(chat_id, help_text(), back_to_menu_keyboard(webapp_url))
        return

    if text in {"Aloqa", "☎️ Aloqa"}:
        send_message(chat_id, _settings_contact_text(), back_to_menu_keyboard(webapp_url))
        return

    send_message(
        chat_id,
        "Men sizni tushunmadim.\n\n"
        "Buyurtma berish uchun menyuni oching yoki yordam bo‘limidan foydalaning.",
        main_menu_keyboard(webapp_url),
    )


def _handle_bot_info_callback(callback: dict, action: str):
    callback_id = callback.get("id")
    message = callback.get("message") or {}
    chat = message.get("chat") or {}
    chat_id = chat.get("id")
    message_id = message.get("message_id")
    user = callback.get("from") or {}
    webapp_url = _webapp_url()

    if chat_id is None:
        if callback_id:
            answer_callback_query(callback_id, "Xabar topilmadi.", show_alert=True)
        return

    if action == "home":
        text = start_text(_full_name(user))
        markup = main_menu_keyboard(webapp_url)
    elif action == "help":
        text = help_text()
        markup = back_to_menu_keyboard(webapp_url)
    elif action == "about":
        text = _settings_about_text()
        markup = back_to_menu_keyboard(webapp_url)
    elif action == "contact":
        text = _settings_contact_text()
        markup = back_to_menu_keyboard(webapp_url)
    else:
        if callback_id:
            answer_callback_query(callback_id, "Noma’lum bo‘lim.", show_alert=True)
        return

    _send_or_edit(chat_id, message_id, text, markup)
    if callback_id:
        answer_callback_query(callback_id)


def _handle_order_status_callback(callback: dict, data: str):
    callback_id = callback.get("id")
    message = callback.get("message") or {}
    chat = message.get("chat") or {}
    chat_id = chat.get("id")

    operator_chat_id = _operator_chat_id()
    if operator_chat_id is not None and chat_id != operator_chat_id:
        if callback_id:
            answer_callback_query(
                callback_id,
                "Bu tugma faqat operator guruhi uchun.",
                show_alert=True,
            )
        return

    try:
        _, order_id, new_status = data.split(":", 2)
    except ValueError:
        if callback_id:
            answer_callback_query(callback_id, "Noto‘g‘ri status formati.", show_alert=True)
        return

    valid_statuses = {value for value, _label in Order.Status.choices}
    if new_status not in valid_statuses:
        if callback_id:
            answer_callback_query(callback_id, "Noto‘g‘ri status.", show_alert=True)
        return

    try:
        order = Order.objects.get(pk=order_id)
    except Exception:
        if callback_id:
            answer_callback_query(callback_id, "Buyurtma topilmadi.", show_alert=True)
        return

    order.status = new_status
    order.save(update_fields=["status"])

    status_text = STATUS_TEXTS.get(new_status, new_status)
    if callback_id:
        answer_callback_query(callback_id, f"Status: {status_text}")

    if chat_id is not None:
        send_message(
            chat_id,
            f"✅ <b>Buyurtma #{order.id}</b> statusi: <b>{status_text}</b>",
        )

    customer = order.customer
    customer_telegram_id = getattr(customer, "telegram_id", None) if customer else None
    user_message = STATUS_USER_MESSAGES.get(new_status)
    if customer_telegram_id and user_message:
        send_message(customer_telegram_id, user_message)


def _handle_callback_query(callback: dict):
    data = callback.get("data") or ""

    if data.startswith("bot_info:"):
        _handle_bot_info_callback(callback, data.split(":", 1)[1])
        return

    if data.startswith("order_status:"):
        _handle_order_status_callback(callback, data)
        return

    callback_id = callback.get("id")
    if callback_id:
        answer_callback_query(callback_id, "Noma’lum amal.", show_alert=True)


@csrf_exempt
def telegram_webhook(request):
    if request.method != "POST":
        return JsonResponse({"ok": True, "service": "telegram-webhook"})

    expected_secret = (getattr(settings, "TELEGRAM_WEBHOOK_SECRET", "") or "").strip()
    provided_secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token", "")

    if not expected_secret or not secrets.compare_digest(provided_secret, expected_secret):
        return JsonResponse({"detail": "Forbidden"}, status=403)

    try:
        update = json.loads(request.body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    try:
        if update.get("message"):
            _handle_message(update["message"])
        elif update.get("callback_query"):
            _handle_callback_query(update["callback_query"])
    except TelegramAPIError:
        logger.exception("Telegram API error while processing update %s", update.get("update_id"))
        return JsonResponse({"detail": "Telegram API error"}, status=502)
    except Exception:
        logger.exception("Telegram webhook error for update %s", update.get("update_id"))
        return JsonResponse({"detail": "Webhook processing error"}, status=500)

    return JsonResponse({"ok": True})
