"""
Django settings for config project.

MongoDB Atlas configuration is based on the official Django MongoDB Backend
project template for Django 6.0.
"""

import os
from pathlib import Path

from corsheaders.defaults import default_headers
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
DEBUG = os.getenv("DEBUG", "False") == "True"

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv("ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")
    if host.strip()
]

INSTALLED_APPS = [
    # Django contrib apps use MongoDB-compatible ObjectId primary keys.
    "config.apps.MongoAdminConfig",
    "config.apps.MongoAuthConfig",
    "config.apps.MongoContentTypesConfig",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # MongoDB backend and third-party apps.
    "django_mongodb_backend",
    "rest_framework",
    "corsheaders",
    "storages",

    # Local apps.
    "menu",
    "customers",
    "orders",
    "payments",
    "common",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# MongoDB Atlas
MONGODB_URI = os.getenv("MONGODB_URI", "").strip()
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "damirchi").strip() or "damirchi"

if not MONGODB_URI:
    raise RuntimeError(
        "MONGODB_URI is required. Add the MongoDB Atlas connection string to backend/.env."
    )

DATABASES = {
    "default": {
        "ENGINE": "django_mongodb_backend",
        "HOST": MONGODB_URI,
        "NAME": MONGODB_DB_NAME,
    }
}

DATABASE_ROUTERS = ["django_mongodb_backend.routers.MongoRouter"]
DEFAULT_AUTO_FIELD = "django_mongodb_backend.fields.ObjectIdAutoField"

# Django's built-in auth/admin/contenttypes migrations contain relational
# AutoField primary keys. Use the MongoDB-compatible migration copies shipped
# from MongoDB's official Django project template instead.
MIGRATION_MODULES = {
    "admin": "mongo_migrations.admin",
    "auth": "mongo_migrations.auth",
    "contenttypes": "mongo_migrations.contenttypes",
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "uz"
TIME_ZONE = "Asia/Tashkent"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Media storage is intentionally independent from the database. Supabase S3
# can remain enabled until media files are migrated to another object store.
USE_SUPABASE_STORAGE = os.getenv("USE_SUPABASE_STORAGE", "False") == "True"

if USE_SUPABASE_STORAGE:
    AWS_ACCESS_KEY_ID = os.getenv("SUPABASE_S3_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY = os.getenv("SUPABASE_S3_SECRET_ACCESS_KEY", "")
    AWS_STORAGE_BUCKET_NAME = os.getenv("SUPABASE_STORAGE_BUCKET", "damirchi-media")
    AWS_S3_ENDPOINT_URL = os.getenv(
        "SUPABASE_S3_ENDPOINT_URL",
        "https://your-project-ref.supabase.co/storage/v1/s3",
    )
    AWS_S3_REGION_NAME = os.getenv("SUPABASE_S3_REGION_NAME", "auto")
    AWS_S3_ADDRESSING_STYLE = "path"
    AWS_S3_SIGNATURE_VERSION = "s3v4"
    AWS_QUERYSTRING_AUTH = False
    AWS_DEFAULT_ACL = None
    AWS_S3_FILE_OVERWRITE = False
    AWS_S3_OBJECT_PARAMETERS = {"CacheControl": "max-age=86400"}

    STORAGES = {
        "default": {"BACKEND": "storages.backends.s3.S3Storage"},
        "staticfiles": {
            "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        },
    }
else:
    STORAGES = {
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {
            "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        },
    }

CORS_ALLOW_HEADERS = list(default_headers) + ["x-telegram-init-data", "x-operator-key"]
CORS_ALLOW_ALL_ORIGINS = os.getenv("CORS_ALLOW_ALL_ORIGINS", "False") == "True"
CORS_ALLOWED_ORIGINS = [
    origin.strip().rstrip("/")
    for origin in os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]
CSRF_TRUSTED_ORIGINS = [
    origin.strip().rstrip("/")
    for origin in os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",")
    if origin.strip()
]

# Production frontend must remain allowed even if a Render Blueprint/env sync is delayed.
PRODUCTION_FRONTEND_ORIGIN = "https://damirchi.vercel.app"
if PRODUCTION_FRONTEND_ORIGIN not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append(PRODUCTION_FRONTEND_ORIGIN)
if PRODUCTION_FRONTEND_ORIGIN not in CSRF_TRUSTED_ORIGINS:
    CSRF_TRUSTED_ORIGINS.append(PRODUCTION_FRONTEND_ORIGIN)

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
}

TELEGRAM_INIT_DATA_MAX_AGE_SECONDS = int(
    os.getenv("TELEGRAM_INIT_DATA_MAX_AGE_SECONDS", "86400")
)
BOT_TOKEN = os.getenv("BOT_TOKEN", "")
ALLOW_UNVERIFIED_TELEGRAM_IN_DEBUG = (
    os.getenv("ALLOW_UNVERIFIED_TELEGRAM_IN_DEBUG", "False") == "True"
)

# Payment providers. Secrets must only live in .env/Render environment.
PAYMENT_RETURN_URL = os.getenv("PAYMENT_RETURN_URL", "").strip()

CLICK_ENABLED = os.getenv("CLICK_ENABLED", "False") == "True"
CLICK_SERVICE_ID = os.getenv("CLICK_SERVICE_ID", "").strip()
CLICK_MERCHANT_ID = os.getenv("CLICK_MERCHANT_ID", "").strip()
CLICK_SECRET_KEY = os.getenv("CLICK_SECRET_KEY", "").strip()
CLICK_CHECKOUT_URL = os.getenv(
    "CLICK_CHECKOUT_URL",
    "https://my.click.uz/services/pay",
).strip()

PAYME_ENABLED = os.getenv("PAYME_ENABLED", "False") == "True"
PAYME_MERCHANT_ID = os.getenv("PAYME_MERCHANT_ID", "").strip()
PAYME_LOGIN = os.getenv("PAYME_LOGIN", "").strip()
PAYME_SECRET_KEY = os.getenv("PAYME_SECRET_KEY", "").strip()
PAYME_ACCOUNT_FIELD = os.getenv("PAYME_ACCOUNT_FIELD", "order_id").strip() or "order_id"
PAYME_CHECKOUT_URL = os.getenv(
    "PAYME_CHECKOUT_URL",
    "https://checkout.paycom.uz",
).strip()

# Bot -> backend status update protection. Configure the same value in bot env.
OPERATOR_API_KEY = os.getenv("OPERATOR_API_KEY", "").strip()
