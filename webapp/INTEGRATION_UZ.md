# Damirchi BOBO Mini App — ulash bo‘yicha qo‘llanma

Bu frontend Django REST API va aiogram bot bilan ishlashga tayyorlangan.

## 1. Frontendni ishga tushirish

```bash
npm install
npm run dev
```

`.env` fayl yarating:

```env
VITE_API_URL="http://127.0.0.1:8000/api"
VITE_BACKEND_URL="http://127.0.0.1:8000"
VITE_USE_MOCK_DATA="false"
```

## 2. Backend tekshiruvi

Django server ishlab tursin:

```bash
python manage.py runserver
```

Tekshirish URL’lari:

```text
http://127.0.0.1:8000/api/categories/
http://127.0.0.1:8000/api/products/
http://127.0.0.1:8000/api/settings/
```

## 3. CORS

Django `settings.py` ichida local test uchun:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

Agar tez test qilmoqchi bo‘lsangiz localda vaqtincha:

```python
CORS_ALLOW_ALL_ORIGINS = True
```

Production’da `CORS_ALLOW_ALL_ORIGINS=True` qoldirmang.

## 4. Telegram botga ulash

Frontend deploy qilingandan keyin `bot/.env` ichida:

```env
WEBAPP_URL=https://your-vercel-domain.vercel.app
```

Botni qayta ishga tushiring:

```bash
python main.py
```

## 5. Real test flow

1. Admin panelda category/product qo‘shing.
2. Frontendda menyu chiqishini tekshiring.
3. Savatga mahsulot qo‘shing.
4. Checkout’da telefon va manzil kiriting.
5. Buyurtmani tasdiqlang.
6. Operator Telegram groupga order tushishini tekshiring.

## 6. v4 qo‘shimchalari

- Savat refreshdan keyin ham saqlanadi (`localStorage`).
- Telegram native BackButton ulandi.
- Order muvaffaqiyatli yuborilgandan keyin savat tozalanadi.
- Mock data faqat `VITE_USE_MOCK_DATA=true` bo‘lsa ishlaydi.


## 7. v5 Restaurant Settings integratsiyasi

Frontend endi `/api/settings/` endpointdan restoran sozlamalarini oladi. Backendda `common` app va `RestaurantSettings` model bo‘lishi kerak.

Frontend ishlatadigan fieldlar:

```json
{
  "restaurant_name": "Damirchi BOBO",
  "tagline": "Mazali taomlar, tezkor buyurtma",
  "phone": "+998 XX XXX XX XX",
  "address": "Toshkent, Sergeli",
  "delivery_price": 15000,
  "min_order_amount": 50000,
  "is_open": true,
  "open_time": "10:00:00",
  "close_time": "23:00:00"
}
```

Nimalar backenddan boshqariladi:

- Headerdagi ochiq/yopiq status.
- Hero sectiondagi restoran nomi, tagline, manzil.
- Dastavka narxi.
- Dastavka uchun minimal buyurtma summasi.
- Restoran yopiq bo‘lsa checkout bloklanadi.

Admin panelda test qilish:

1. `Restaurant Settings` ichida `is_open=False` qilib saqlang.
2. Frontendni refresh qiling. Headerda `Yopiq` chiqadi va checkout bloklanadi.
3. `delivery_price`ni o‘zgartiring. Frontend checkout’da yangi narxni ko‘rsatadi.
4. `min_order_amount`ni masalan `50000` qiling. Delivery order 50 000 so‘mdan kam bo‘lsa validation chiqadi.

Agar `/api/settings/` vaqtincha mavjud bo‘lmasa, frontend safe default bilan ochiladi, lekin production uchun endpoint majburiy tavsiya qilinadi.


## 8. v6 Telegram initData security integratsiyasi

Frontend endi order yuborishda Telegram Mini App `initData` qiymatini ham yuboradi:

- request body ichida: `telegram_init_data`
- request header ichida: `X-Telegram-Init-Data`

Local browser testda Telegram `initData` bo‘lmaydi, shuning uchun eski `telegram_id`, `full_name`, `username` fallback qiymatlari ham payload ichida qoladi. Production’da backend `telegram_init_data`ni tekshirishi kerak.

Backendda tavsiya qilingan tartib:

1. `BOT_TOKEN` `.env` ichida bo‘lsin.
2. Django `settings.py` ichida o‘qilsin.
3. Order create serializer `telegram_init_data`ni qabul qilsin.
4. Agar `telegram_init_data` mavjud bo‘lsa, backend Telegram hash validatsiya qilsin.
5. Validatsiyadan o‘tgan user ma’lumoti bilan `Customer` yaratsin yoki yangilasin.
6. `telegram_init_data` bo‘lmasa, faqat local development uchun fallback ishlasin. Production’da fallbackni o‘chirib qo‘yish tavsiya qilinadi.

Frontend order payload endi shunaqa ko‘rinadi:

```json
{
  "telegram_init_data": "query_id=...&user=...&auth_date=...&hash=...",
  "telegram_id": 123456789,
  "full_name": "Test User",
  "username": "test_user",
  "order_type": "delivery",
  "payment_type": "cash",
  "phone": "+998901234567",
  "address": "Sergeli, Toshkent",
  "latitude": "41.2400000",
  "longitude": "69.2200000",
  "comment": "Achchiq bo‘lmasin",
  "items": [
    { "product": 1, "quantity": 2 }
  ]
}
```

Header orqali ham yuboriladi:

```text
X-Telegram-Init-Data: query_id=...&user=...&auth_date=...&hash=...
```

Bu real Telegram Mini App security uchun kerak.
