from html import escape


STATUS_TEXTS = {
    "new": "Yangi",
    "accepted": "Qabul qilindi",
    "preparing": "Tayyorlanmoqda",
    "on_way": "Yo‘lda",
    "completed": "Yetkazildi",
    "cancelled": "Bekor qilindi",
}


STATUS_USER_MESSAGES = {
    "accepted": (
        "<b>Buyurtmangiz qabul qilindi</b>\n\n"
        "Operator buyurtmangizni tasdiqladi. Tez orada tayyorlash boshlanadi."
    ),
    "preparing": (
        "<b>Buyurtmangiz tayyorlanmoqda</b>\n\n"
        "Damirchi oshxonasi buyurtmangizni tayyorlashni boshladi."
    ),
    "on_way": (
        "<b>Buyurtmangiz yo‘lga chiqdi</b>\n\n"
        "Kuryer buyurtmangizni manzilingizga olib bormoqda."
    ),
    "completed": (
        "<b>Buyurtmangiz yetkazildi</b>\n\n"
        "Yoqimli ishtaha. Damirchi’ni tanlaganingiz uchun rahmat."
    ),
    "cancelled": (
        "<b>Buyurtmangiz bekor qilindi</b>\n\n"
        "Batafsil ma’lumot uchun operator bilan bog‘lanishingiz mumkin."
    ),
}


def start_text(full_name: str) -> str:
    return (
        f"Assalomu alaykum, <b>{escape(full_name)}</b>.\n\n"
        "<b>Damirchi BOBO</b> online buyurtma xizmatiga xush kelibsiz.\n\n"
        "Menyuni oching, taom tanlang va buyurtmani Telegram ichida rasmiylashtiring."
    )


def help_text() -> str:
    return (
        "<b>Yordam</b>\n\n"
        "1. Menyuni oching.\n"
        "2. Taomlarni savatga qo‘shing.\n"
        "3. Dastavka yoki olib ketishni tanlang.\n"
        "4. Telefon raqam va manzilni kiriting.\n"
        "5. Buyurtmani tasdiqlang.\n\n"
        "Buyurtma statusi o‘zgarsa, sizga Telegram orqali xabar keladi."
    )


def about_text(restaurant_name: str = "Damirchi BOBO") -> str:
    return (
        f"<b>{escape(restaurant_name or 'Damirchi BOBO')}</b>\n\n"
        "Milliy taomlar, qulay buyurtma va tezkor xizmat.\n\n"
        "Buyurtmani Telegram ichida bir necha qadamda rasmiylashtirishingiz mumkin."
    )


def contact_text(phone=None, address=None, telegram_url=None, instagram_url=None) -> str:
    lines = ["<b>Aloqa</b>"]

    if phone:
        lines.append(f"\nTelefon: {escape(str(phone))}")
    if address:
        lines.append(f"Manzil: {escape(str(address))}")
    if telegram_url:
        lines.append(f"Telegram: {escape(str(telegram_url))}")
    if instagram_url:
        lines.append(f"Instagram: {escape(str(instagram_url))}")

    if len(lines) == 1:
        lines.append(
            "\nHozircha aloqa ma’lumotlari kiritilmagan.\n"
            "Buyurtma berish uchun menyuni ochishingiz mumkin."
        )

    return "\n".join(lines)
