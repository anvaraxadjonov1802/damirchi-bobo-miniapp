from django.conf import settings
from django.core.management.base import BaseCommand

from telegrambot.services import TelegramAPIError, telegram_api


class Command(BaseCommand):
    help = "Configure Telegram webhook, commands and Mini App menu button."

    def handle(self, *args, **options):
        bot_token = (getattr(settings, "BOT_TOKEN", "") or "").strip()
        public_url = (getattr(settings, "BACKEND_PUBLIC_URL", "") or "").rstrip("/")
        webapp_url = (getattr(settings, "WEBAPP_URL", "") or "").rstrip("/")
        secret = (getattr(settings, "TELEGRAM_WEBHOOK_SECRET", "") or "").strip()

        missing = [
            name
            for name, value in {
                "BOT_TOKEN": bot_token,
                "BACKEND_PUBLIC_URL": public_url,
                "WEBAPP_URL": webapp_url,
                "TELEGRAM_WEBHOOK_SECRET": secret,
            }.items()
            if not value
        ]

        if missing:
            self.stdout.write(
                self.style.WARNING(
                    "Telegram webhook skipped; missing: " + ", ".join(missing)
                )
            )
            return

        webhook_url = f"{public_url}/api/telegram/webhook/"

        try:
            telegram_api(
                "setWebhook",
                {
                    "url": webhook_url,
                    "secret_token": secret,
                    "allowed_updates": ["message", "callback_query"],
                    "drop_pending_updates": False,
                    "max_connections": 20,
                },
            )
            telegram_api(
                "setMyCommands",
                {
                    "commands": [
                        {"command": "start", "description": "Boshlash"},
                        {"command": "menu", "description": "Menyuni ochish"},
                        {"command": "help", "description": "Yordam"},
                    ]
                },
            )
            telegram_api(
                "setChatMenuButton",
                {
                    "menu_button": {
                        "type": "web_app",
                        "text": "Menyu",
                        "web_app": {"url": webapp_url},
                    }
                },
            )
        except TelegramAPIError as exc:
            # A temporary Telegram outage must not prevent the Django web service from booting.
            self.stdout.write(self.style.WARNING(f"Telegram webhook setup failed: {exc}"))
            return

        self.stdout.write(self.style.SUCCESS(f"Telegram webhook configured: {webhook_url}"))
