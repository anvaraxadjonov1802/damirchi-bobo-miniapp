import asyncio
import logging

from aiogram import Bot, Dispatcher, F
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ChatType, ParseMode
from aiogram.exceptions import TelegramBadRequest, TelegramForbiddenError
from aiogram.filters import Command, CommandStart
from aiogram.types import (
    BotCommand,
    CallbackQuery,
    MenuButtonWebApp,
    Message,
    ReplyKeyboardRemove,
    WebAppInfo,
)

from api_client import BackendAPIError, get_restaurant_settings, patch_order_status
from config import load_config
from keyboards import back_to_menu_keyboard, main_menu_keyboard
from messages import (
    STATUS_TEXTS,
    STATUS_USER_MESSAGES,
    about_text,
    contact_text,
    help_text,
    start_text,
)


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(name)s | %(message)s',
)

logger = logging.getLogger(__name__)

config = load_config()

bot = Bot(
    token=config.bot_token,
    default=DefaultBotProperties(parse_mode=ParseMode.HTML),
)
dp = Dispatcher()


CHAT_BOT_MESSAGES: dict[int, list[int]] = {}
CLEANUP_LAST_MESSAGES_LIMIT = 120


def remember_bot_message(chat_id: int, message_id: int) -> None:
    messages = CHAT_BOT_MESSAGES.setdefault(chat_id, [])
    messages.append(message_id)
    CHAT_BOT_MESSAGES[chat_id] = messages[-30:]


async def safe_delete_message(chat_id: int, message_id: int) -> None:
    try:
        await bot.delete_message(chat_id=chat_id, message_id=message_id)
    except (TelegramBadRequest, TelegramForbiddenError):
        pass
    except Exception as exc:
        logger.debug('Message delete skipped: %s', exc)


async def cleanup_recent_private_chat(
    message: Message,
    limit: int = CLEANUP_LAST_MESSAGES_LIMIT,
) -> None:
    if message.chat.type != ChatType.PRIVATE:
        return

    chat_id = message.chat.id
    current_message_id = message.message_id

    old_message_ids = CHAT_BOT_MESSAGES.get(chat_id, [])

    for old_message_id in old_message_ids:
        await safe_delete_message(chat_id, old_message_id)

    CHAT_BOT_MESSAGES[chat_id] = []

    start_id = max(1, current_message_id - limit)

    for message_id in range(current_message_id, start_id - 1, -1):
        await safe_delete_message(chat_id, message_id)


async def send_clean_message(message: Message, text: str, reply_markup=None):
    sent_message = await message.answer(text, reply_markup=reply_markup)
    remember_bot_message(sent_message.chat.id, sent_message.message_id)
    return sent_message


async def send_clean_callback_message(callback: CallbackQuery, text: str, reply_markup=None):
    if not callback.message:
        return None

    chat_id = callback.message.chat.id

    if callback.message.chat.type == ChatType.PRIVATE:
        old_message_ids = CHAT_BOT_MESSAGES.get(chat_id, [])

        for old_message_id in old_message_ids:
            await safe_delete_message(chat_id, old_message_id)

        CHAT_BOT_MESSAGES[chat_id] = []
        await safe_delete_message(chat_id, callback.message.message_id)

    sent_message = await callback.message.answer(text, reply_markup=reply_markup)
    remember_bot_message(sent_message.chat.id, sent_message.message_id)
    return sent_message


async def setup_bot_menu() -> None:
    await bot.set_my_commands(
        [
            BotCommand(command='start', description='Boshlash'),
            BotCommand(command='menu', description='Menyuni ochish'),
            BotCommand(command='help', description='Yordam'),
        ]
    )

    await bot.set_chat_menu_button(
        menu_button=MenuButtonWebApp(
            text='Menyu',
            web_app=WebAppInfo(url=config.webapp_url),
        )
    )


@dp.message(CommandStart())
async def start_handler(message: Message):
    full_name = message.from_user.full_name if message.from_user else "mijoz"

    await cleanup_recent_private_chat(message)

    try:
        await send_clean_message(
            message,
            start_text(full_name),
            reply_markup=main_menu_keyboard(config.webapp_url),
        )

    except TelegramBadRequest as exc:
        logger.exception("Start message yuborishda xatolik: %s", exc)

        sent_message = await message.answer(
            "Bot xabar yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring."
        )
        remember_bot_message(sent_message.chat.id, sent_message.message_id)

@dp.message(Command('menu'))
async def menu_command_handler(message: Message):
    full_name = message.from_user.full_name if message.from_user else 'mijoz'
    await cleanup_recent_private_chat(message)
    await send_clean_message(
        message,
        start_text(full_name),
        reply_markup=main_menu_keyboard(config.webapp_url),
    )


@dp.message(Command('help'))
async def help_command_handler(message: Message):
    await cleanup_recent_private_chat(message)
    await send_clean_message(
        message,
        help_text(),
        reply_markup=back_to_menu_keyboard(config.webapp_url),
    )


@dp.message(Command('chatid'))
async def chat_id_handler(message: Message):
    await cleanup_recent_private_chat(message)
    await send_clean_message(message, f'Chat ID: <code>{message.chat.id}</code>')


@dp.message(F.text.in_({'Menyu', '🍽 Menyu', 'Menyuni ochish', '🍽 Menyuni ochish'}))
async def old_menu_text_handler(message: Message):
    await menu_command_handler(message)


@dp.message(F.text.in_({'Yordam', '🆘 Yordam'}))
async def old_help_text_handler(message: Message):
    await help_command_handler(message)


@dp.message(F.text.in_({'Aloqa', '☎️ Aloqa'}))
async def old_contact_text_handler(message: Message):
    await cleanup_recent_private_chat(message)
    settings = await get_restaurant_settings(config.backend_api_url)
    await send_clean_message(
        message,
        contact_text(settings),
        reply_markup=back_to_menu_keyboard(config.webapp_url),
    )


@dp.callback_query(F.data.startswith('bot_info:'))
async def bot_info_handler(callback: CallbackQuery):
    if not callback.data:
        await callback.answer('Ma’lumot topilmadi.', show_alert=True)
        return

    action = callback.data.split(':')[1]

    if not callback.message:
        await callback.answer('Xabar topilmadi.', show_alert=True)
        return

    if action == 'home':
        full_name = callback.from_user.full_name if callback.from_user else 'mijoz'
        await send_clean_callback_message(
            callback,
            start_text(full_name),
            reply_markup=main_menu_keyboard(config.webapp_url),
        )
        await callback.answer()
        return

    if action == 'help':
        await send_clean_callback_message(
            callback,
            help_text(),
            reply_markup=back_to_menu_keyboard(config.webapp_url),
        )
        await callback.answer()
        return

    if action == 'about':
        settings = await get_restaurant_settings(config.backend_api_url)
        await send_clean_callback_message(
            callback,
            about_text(settings),
            reply_markup=back_to_menu_keyboard(config.webapp_url),
        )
        await callback.answer()
        return

    if action == 'contact':
        settings = await get_restaurant_settings(config.backend_api_url)
        await send_clean_callback_message(
            callback,
            contact_text(settings),
            reply_markup=back_to_menu_keyboard(config.webapp_url),
        )
        await callback.answer()
        return

    await callback.answer('Noma’lum bo‘lim.', show_alert=True)


@dp.callback_query(F.data.startswith('order_status:'))
async def order_status_handler(callback: CallbackQuery):
    if not callback.data:
        await callback.answer('Status topilmadi.', show_alert=True)
        return

    if not callback.message:
        await callback.answer('Xabar topilmadi.', show_alert=True)
        return

    if config.operator_chat_id and callback.message.chat.id != config.operator_chat_id:
        await callback.answer('Bu tugma faqat operator guruhi uchun.', show_alert=True)
        return

    try:
        _, order_id, new_status = callback.data.split(':')
    except ValueError:
        await callback.answer('Noto‘g‘ri status formati.', show_alert=True)
        return

    try:
        data = await patch_order_status(
            config.backend_api_url,
            order_id=order_id,
            status=new_status,
        )
    except BackendAPIError as exc:
        await callback.answer(str(exc), show_alert=True)
        return

    status_text = STATUS_TEXTS.get(new_status, new_status)

    try:
        original_text = callback.message.html_text or callback.message.text or ''

        if 'Oxirgi status:' in original_text:
            original_text = original_text.split('\n\nOxirgi status:')[0]

        await callback.message.edit_text(
            text=f'{original_text}\n\nOxirgi status: <b>{status_text}</b>',
            reply_markup=callback.message.reply_markup,
            disable_web_page_preview=True,
        )
    except TelegramBadRequest:
        pass

    customer_telegram_id = data.get('customer_telegram_id')
    user_message = STATUS_USER_MESSAGES.get(new_status)

    if customer_telegram_id and user_message:
        try:
            await bot.send_message(chat_id=customer_telegram_id, text=user_message)
        except Exception as exc:
            logger.warning('Mijozga status xabarini yuborib bo‘lmadi: %s', exc)

    await callback.answer(f'Status: {status_text}')


@dp.message()
async def fallback_handler(message: Message):
    if message.chat.type != ChatType.PRIVATE:
        return

    await cleanup_recent_private_chat(message)

    await send_clean_message(
        message,
        'Men sizni tushunmadim.\n\n'
        'Buyurtma berish uchun menyuni oching yoki yordam bo‘limidan foydalaning.',
        reply_markup=main_menu_keyboard(config.webapp_url),
    )


async def main():
    logger.info('Damirchi bot ishga tushdi.')
    logger.info('WEBAPP_URL: %s', config.webapp_url)
    logger.info('BACKEND_API_URL: %s', config.backend_api_url)

    await bot.delete_webhook(drop_pending_updates=True)
    await setup_bot_menu()
    await dp.start_polling(bot)


if __name__ == '__main__':
    asyncio.run(main())
