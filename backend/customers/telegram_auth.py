import hashlib
import hmac
import json
import time
from urllib.parse import parse_qsl

from django.conf import settings
from rest_framework import serializers


def validate_telegram_init_data(init_data: str) -> dict:
    if not init_data:
        raise serializers.ValidationError({"detail": "Telegram initData yuborilmadi."})

    if not settings.BOT_TOKEN:
        raise serializers.ValidationError({"detail": "BOT_TOKEN sozlanmagan."})

    parsed_data = dict(parse_qsl(init_data, keep_blank_values=True))
    received_hash = parsed_data.pop("hash", None)

    if not received_hash:
        raise serializers.ValidationError({"detail": "Telegram hash topilmadi."})

    data_check_string = "\n".join(
        f"{key}={value}" for key, value in sorted(parsed_data.items())
    )

    secret_key = hmac.new(
        b"WebAppData",
        settings.BOT_TOKEN.encode("utf-8"),
        hashlib.sha256,
    ).digest()

    calculated_hash = hmac.new(
        secret_key,
        data_check_string.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(calculated_hash, received_hash):
        raise serializers.ValidationError({"detail": "Telegram initData noto‘g‘ri."})

    auth_date_raw = parsed_data.get("auth_date")
    if not auth_date_raw:
        raise serializers.ValidationError({"detail": "Telegram auth_date topilmadi."})

    try:
        auth_date = int(auth_date_raw)
    except ValueError:
        raise serializers.ValidationError({"detail": "Telegram auth_date noto‘g‘ri."})

    max_age = getattr(settings, "TELEGRAM_INIT_DATA_MAX_AGE_SECONDS", 86400)
    if max_age and time.time() - auth_date > max_age:
        raise serializers.ValidationError({"detail": "Telegram initData muddati o‘tgan."})

    user_raw = parsed_data.get("user")
    if not user_raw:
        raise serializers.ValidationError({"detail": "Telegram user ma’lumoti topilmadi."})

    try:
        user = json.loads(user_raw)
    except json.JSONDecodeError:
        raise serializers.ValidationError({"detail": "Telegram user JSON noto‘g‘ri."})

    if not user.get("id"):
        raise serializers.ValidationError({"detail": "Telegram user id topilmadi."})

    return user