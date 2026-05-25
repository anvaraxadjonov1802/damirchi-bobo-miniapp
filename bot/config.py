import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


@dataclass
class Config:
    bot_token: str
    webapp_url: str
    backend_api_url: str


def load_config() -> Config:
    bot_token = os.getenv("BOT_TOKEN")
    webapp_url = os.getenv("WEBAPP_URL")
    backend_api_url = os.getenv("BACKEND_API_URL", "http://127.0.0.1:8000/api")

    if not bot_token:
        raise ValueError("BOT_TOKEN .env ichida topilmadi.")

    if not webapp_url:
        raise ValueError("WEBAPP_URL .env ichida topilmadi.")

    return Config(
        bot_token=bot_token,
        webapp_url=webapp_url,
        backend_api_url=backend_api_url,
    )