# Damirchi BOBO Telegram Mini App Frontend

Premium restaurant ordering frontend for Telegram Mini App. Built with React, Vite and Tailwind CSS. The app connects to the existing Django REST API and sends orders to the backend/bot flow.

## What is improved in this version

- Premium dark brown/gold restaurant identity
- Stronger Damirchi BOBO hero section
- Brand trust ribbon for operator/payment/service quality
- Horizontal featured products carousel
- Category cards with optional category images
- Cleaner checkout with order summary, GPS handling, and confirmation notes
- No fake order success unless `VITE_USE_MOCK_DATA=true`
- Django API payload remains compatible with the backend
- Telegram initData security support for production order creation

## Run locally

```bash
npm install
npm run dev
```

Local URL:

```text
http://localhost:5173
```

## Environment

Create `.env`:

```env
VITE_API_URL="http://127.0.0.1:8000/api"
VITE_BACKEND_URL="http://127.0.0.1:8000"
VITE_USE_MOCK_DATA="false"
```

Use `VITE_USE_MOCK_DATA="true"` only for UI preview without backend. For real orders keep it `false`.

## API endpoints

- `GET /api/categories/`
- `GET /api/products/`
- `POST /api/orders/`

## Test commands

```bash
npm run build
npm run lint
```

## Important

This project does not include backend, database, Firebase, Supabase, Prisma, or payment integration. It is designed to work with the Django + aiogram backend/bot flow.
