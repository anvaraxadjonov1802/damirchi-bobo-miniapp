from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo


def main_menu_keyboard(webapp_url: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text='Menyuni ochish',
                    web_app=WebAppInfo(url=webapp_url),
                )
            ],
            [
                InlineKeyboardButton(text='Aloqa', callback_data='bot_info:contact'),
                InlineKeyboardButton(text='Yordam', callback_data='bot_info:help'),
            ],
            [
                InlineKeyboardButton(text='Damirchi haqida', callback_data='bot_info:about'),
            ],
        ]
    )


def back_to_menu_keyboard(webapp_url: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text='Menyuni ochish',
                    web_app=WebAppInfo(url=webapp_url),
                )
            ],
            [
                InlineKeyboardButton(text='Asosiy sahifa', callback_data='bot_info:home'),
            ],
        ]
    )


def order_status_keyboard(order_id: int | str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text='Qabul qilish', callback_data=f'order_status:{order_id}:accepted')],
            [InlineKeyboardButton(text='Tayyorlanmoqda', callback_data=f'order_status:{order_id}:preparing')],
            [InlineKeyboardButton(text='Yo‘lda', callback_data=f'order_status:{order_id}:on_way')],
            [InlineKeyboardButton(text='Yetkazildi', callback_data=f'order_status:{order_id}:completed')],
            [InlineKeyboardButton(text='Bekor qilish', callback_data=f'order_status:{order_id}:cancelled')],
        ]
    )
