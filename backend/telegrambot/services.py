import requests
from django.conf import settings


class TelegramAPIError(RuntimeError):
    pass


def telegram_api(method: str, payload: dict | None = None, timeout: int = 15):
    token = (getattr(settings, "BOT_TOKEN", "") or "").strip()
    if not token:
        raise TelegramAPIError("BOT_TOKEN is not configured.")

    url = f"https://api.telegram.org/bot{token}/{method}"

    try:
        response = requests.post(url, json=payload or {}, timeout=timeout)
    except requests.RequestException as exc:
        raise TelegramAPIError(f"Telegram API request failed: {exc}") from exc

    try:
        data = response.json()
    except ValueError as exc:
        raise TelegramAPIError(
            f"Telegram API returned invalid JSON ({response.status_code})."
        ) from exc

    if response.status_code >= 400 or not data.get("ok"):
        description = data.get("description") or response.text
        raise TelegramAPIError(f"Telegram API {method} failed: {description}")

    return data.get("result")


def send_message(chat_id, text: str, reply_markup: dict | None = None):
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }
    if reply_markup:
        payload["reply_markup"] = reply_markup
    return telegram_api("sendMessage", payload)


def edit_message_text(chat_id, message_id, text: str, reply_markup: dict | None = None):
    payload = {
        "chat_id": chat_id,
        "message_id": message_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }
    if reply_markup:
        payload["reply_markup"] = reply_markup
    return telegram_api("editMessageText", payload)


def answer_callback_query(callback_query_id: str, text: str | None = None, show_alert=False):
    payload = {
        "callback_query_id": callback_query_id,
        "show_alert": bool(show_alert),
    }
    if text:
        payload["text"] = text
    return telegram_api("answerCallbackQuery", payload)
