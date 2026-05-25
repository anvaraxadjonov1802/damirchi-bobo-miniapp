from aiogram.types import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    KeyboardButton,
    ReplyKeyboardMarkup,
    WebAppInfo,
)


def main_menu_keyboard(webapp_url: str) -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(
                    text="🍽 Menyuni ochish",
                    web_app=WebAppInfo(url=webapp_url),
                )
            ],
            [
                KeyboardButton(text="📞 Telefon yuborish", request_contact=True),
            ],
        ],
        resize_keyboard=True,
    )


def order_status_keyboard(order_id: int) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="✅ Qabul qilindi",
                    callback_data=f"order_status:{order_id}:accepted",
                )
            ],
            [
                InlineKeyboardButton(
                    text="👨‍🍳 Tayyorlanmoqda",
                    callback_data=f"order_status:{order_id}:preparing",
                )
            ],
            [
                InlineKeyboardButton(
                    text="🚚 Yo‘lda",
                    callback_data=f"order_status:{order_id}:on_way",
                )
            ],
            [
                InlineKeyboardButton(
                    text="✅ Yetkazildi",
                    callback_data=f"order_status:{order_id}:completed",
                )
            ],
            [
                InlineKeyboardButton(
                    text="❌ Bekor qilindi",
                    callback_data=f"order_status:{order_id}:cancelled",
                )
            ],
        ]
    )