import hashlib
import hmac
import json
import time
from urllib.parse import parse_qsl

from django.conf import settings
from rest_framework import serializers


def validate_telegram_init_data(init_data: str, max_age_seconds: int = 86400) -> dict:
    if not init_data:
        raise serializers.ValidationError(
            {"detail": "Telegram tasdiqlash ma’lumoti talab qilinadi."}
        )

    if not settings.BOT_TOKEN:
        raise serializers.ValidationError(
            {"detail": "Backendda BOT_TOKEN sozlanmagan."}
        )

    parsed_data = dict(parse_qsl(init_data, keep_blank_values=True))
    received_hash = parsed_data.pop("hash", None)

    if not received_hash:
        raise serializers.ValidationError(
            {"detail": "Telegram hash topilmadi."}
        )

    data_check_string = "\n".join(
        f"{key}={value}" for key, value in sorted(parsed_data.items())
    )

    secret_key = hmac.new(
        key=b"WebAppData",
        msg=settings.BOT_TOKEN.encode(),
        digestmod=hashlib.sha256,
    ).digest()

    calculated_hash = hmac.new(
        key=secret_key,
        msg=data_check_string.encode(),
        digestmod=hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(calculated_hash, received_hash):
        raise serializers.ValidationError(
            {"detail": "Telegram tasdiqlash ma’lumoti noto‘g‘ri."}
        )

    auth_date = parsed_data.get("auth_date")

    if auth_date:
        try:
            auth_date_int = int(auth_date)
        except ValueError:
            raise serializers.ValidationError(
                {"detail": "Telegram auth_date noto‘g‘ri."}
            )

        if time.time() - auth_date_int > max_age_seconds:
            raise serializers.ValidationError(
                {"detail": "Telegram sessiyasi eskirgan. Web App’ni qayta oching."}
            )

    user_raw = parsed_data.get("user")

    if not user_raw:
        raise serializers.ValidationError(
            {"detail": "Telegram user ma’lumoti topilmadi."}
        )

    try:
        user = json.loads(user_raw)
    except json.JSONDecodeError:
        raise serializers.ValidationError(
            {"detail": "Telegram user JSON noto‘g‘ri."}
        )

    if not user.get("id"):
        raise serializers.ValidationError(
            {"detail": "Telegram user id topilmadi."}
        )

    return user