import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Config:
    bot_token: str
    webapp_url: str
    backend_api_url: str
    operator_chat_id: int | None


def get_required_env(name: str) -> str:
    value = os.getenv(name, '').strip()

    if not value:
        raise ValueError(f'{name} .env ichida topilmadi.')

    return value


def parse_operator_chat_id(value: str | None) -> int | None:
    if not value:
        return None

    value = value.strip()

    try:
        return int(value)
    except ValueError:
        raise ValueError(
            'OPERATOR_CHAT_ID noto‘g‘ri. Masalan: -1001234567890 ko‘rinishida bo‘lishi kerak.'
        )


def load_config() -> Config:
    bot_token = get_required_env('BOT_TOKEN')
    webapp_url = get_required_env('WEBAPP_URL')
    backend_api_url = get_required_env('BACKEND_API_URL')
    operator_chat_id_raw = os.getenv('OPERATOR_CHAT_ID')

    if not webapp_url.startswith('https://'):
        raise ValueError(
            'WEBAPP_URL https:// bilan boshlanishi kerak. '
            'Telegram Web App http linkni qabul qilmaydi.'
        )

    if not backend_api_url.startswith('https://') and not backend_api_url.startswith('http://'):
        raise ValueError('BACKEND_API_URL http:// yoki https:// bilan boshlanishi kerak.')

    backend_api_url = backend_api_url.rstrip('/')

    if not backend_api_url.endswith('/api'):
        raise ValueError(
            'BACKEND_API_URL /api bilan tugashi kerak. '
            'Masalan: https://damirchi-bobo-miniapp.onrender.com/api'
        )

    return Config(
        bot_token=bot_token,
        webapp_url=webapp_url.rstrip('/'),
        backend_api_url=backend_api_url,
        operator_chat_id=parse_operator_chat_id(operator_chat_id_raw),
    )
