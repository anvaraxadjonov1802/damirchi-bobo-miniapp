# Backend — Telegram initData validation qo‘shish

Bu qo‘llanma frontend v6 bilan mos. Frontend order yuborishda `telegram_init_data` va `X-Telegram-Init-Data` yuboradi. Backend production’da shu qiymatni tekshirishi kerak.

## 1. `.env`

`backend/.env`:

```env
BOT_TOKEN=123456:ABCDEF...
TELEGRAM_INIT_DATA_MAX_AGE_SECONDS=86400
ALLOW_UNVERIFIED_TELEGRAM_IN_DEBUG=true
```

Production’da tavsiya:

```env
ALLOW_UNVERIFIED_TELEGRAM_IN_DEBUG=false
```

## 2. `config/settings.py`

```python
BOT_TOKEN = os.getenv("BOT_TOKEN", "")
TELEGRAM_INIT_DATA_MAX_AGE_SECONDS = int(
    os.getenv("TELEGRAM_INIT_DATA_MAX_AGE_SECONDS", "86400")
)
ALLOW_UNVERIFIED_TELEGRAM_IN_DEBUG = os.getenv(
    "ALLOW_UNVERIFIED_TELEGRAM_IN_DEBUG", "true"
).lower() == "true"
```

## 3. `customers/telegram_auth.py` yarating

```python
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
```

## 4. `orders/serializers.py` importlar

Tepaga qo‘shing:

```python
from django.conf import settings
from customers.telegram_auth import validate_telegram_init_data
```

## 5. `OrderCreateSerializer` fields yangilash

`OrderCreateSerializer` ichida:

```python
telegram_init_data = serializers.CharField(
    write_only=True,
    required=False,
    allow_blank=True,
)
telegram_id = serializers.IntegerField(write_only=True, required=False)
full_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
username = serializers.CharField(write_only=True, required=False, allow_blank=True)
```

`fields` ichiga `telegram_init_data` ham qo‘shing:

```python
fields = (
    "id",
    "telegram_init_data",
    "telegram_id",
    "full_name",
    "username",
    "order_type",
    "payment_type",
    "phone",
    "address",
    "latitude",
    "longitude",
    "comment",
    "items",
)
```

## 6. `create()` ichidagi Telegram user qismi

Eski qism:

```python
telegram_id = validated_data.pop("telegram_id")
full_name = validated_data.pop("full_name", "")
username = validated_data.pop("username", "")
```

Shuni mana bunga almashtiring:

```python
telegram_init_data = validated_data.pop("telegram_init_data", "") or ""
request = self.context.get("request")

if not telegram_init_data and request:
    telegram_init_data = request.headers.get("X-Telegram-Init-Data", "")

if telegram_init_data:
    telegram_user = validate_telegram_init_data(telegram_init_data)
    telegram_id = telegram_user["id"]
    full_name = " ".join(
        filter(
            None,
            [
                telegram_user.get("first_name", ""),
                telegram_user.get("last_name", ""),
            ],
        )
    )
    username = telegram_user.get("username", "") or ""
else:
    allow_local_fallback = (
        settings.DEBUG
        and getattr(settings, "ALLOW_UNVERIFIED_TELEGRAM_IN_DEBUG", False)
    )

    if not allow_local_fallback:
        raise serializers.ValidationError(
            {"detail": "Telegram tasdiqlash ma’lumoti talab qilinadi."}
        )

    telegram_id = validated_data.pop("telegram_id", None)
    full_name = validated_data.pop("full_name", "")
    username = validated_data.pop("username", "")

    if not telegram_id:
        raise serializers.ValidationError({"telegram_id": "telegram_id talab qilinadi."})
```

## 7. Muhim

`Customer.objects.update_or_create(...)` qismi avvalgidek qoladi:

```python
customer, _ = Customer.objects.update_or_create(
    telegram_id=telegram_id,
    defaults={
        "full_name": full_name,
        "username": username,
        "phone": validated_data.get("phone"),
    },
)
```

## 8. Test tartibi

Local browser test:

```env
ALLOW_UNVERIFIED_TELEGRAM_IN_DEBUG=true
```

Telegram ichida real test:

```env
ALLOW_UNVERIFIED_TELEGRAM_IN_DEBUG=false
```

Agar Telegram Web App ichidan ochilsa, frontend `initData` yuboradi va backend orderni validatsiyadan keyin qabul qiladi.
