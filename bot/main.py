import asyncio

import aiohttp
from aiogram import Bot, Dispatcher, F
from aiogram.filters import Command, CommandStart
from aiogram.types import CallbackQuery, Message

from config import load_config
from keyboards import main_menu_keyboard


STATUS_TEXTS = {
    "new": "Yangi",
    "accepted": "Qabul qilindi",
    "preparing": "Tayyorlanmoqda",
    "on_way": "Yo‘lda",
    "completed": "Yetkazildi",
    "cancelled": "Bekor qilindi",
}


config = load_config()

bot = Bot(token=config.bot_token)
dp = Dispatcher()


@dp.message(CommandStart())
async def start_handler(message: Message):
    full_name = message.from_user.full_name if message.from_user else "mijoz"

    text = (
        f"Assalomu alaykum, {full_name}! 👋\n\n"
        "Damirchi BOBO restoranining online buyurtma botiga xush kelibsiz.\n"
        "🍽 Menyuni ochish tugmasini bosing va buyurtma bering."
    )

    await message.answer(
        text,
        reply_markup=main_menu_keyboard(config.webapp_url),
    )


@dp.message(Command("chatid"))
async def chat_id_handler(message: Message):
    await message.answer(f"Chat ID: `{message.chat.id}`", parse_mode="Markdown")


@dp.message(F.contact)
async def contact_handler(message: Message):
    phone = message.contact.phone_number

    await message.answer(
        f"Rahmat! Telefon raqamingiz qabul qilindi: {phone}\n\n"
        "Endi 🍽 Menyuni ochish tugmasi orqali buyurtma berishingiz mumkin."
    )


@dp.callback_query(F.data.startswith("order_status:"))
async def order_status_handler(callback: CallbackQuery):
    _, order_id, status = callback.data.split(":")

    url = f"{config.backend_api_url}/orders/{order_id}/status/"
    payload = {"status": status}

    async with aiohttp.ClientSession() as session:
        async with session.patch(url, json=payload) as response:
            if response.status not in [200, 201]:
                await callback.answer("Status o‘zgarmadi. Backendda xatolik bor.", show_alert=True)
                return

            order_data = await response.json()

    status_text = STATUS_TEXTS.get(status, status)

    await callback.answer(f"Buyurtma statusi: {status_text}")

    try:
        await callback.message.edit_text(
            callback.message.text + f"\n\n🔄 Oxirgi status: {status_text}",
            reply_markup=callback.message.reply_markup,
        )
    except Exception:
        pass

    customer_telegram_id = order_data.get("customer_telegram_id")

    if customer_telegram_id:
        user_text = (
            f"📦 Buyurtmangiz statusi o‘zgardi!\n\n"
            f"Buyurtma raqami: #{order_id}\n"
            f"Holat: {status_text}"
        )

        try:
            await bot.send_message(chat_id=customer_telegram_id, text=user_text)
        except Exception:
            pass


async def main():
    print("Bot ishga tushdi...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())