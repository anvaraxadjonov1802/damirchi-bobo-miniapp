from django.conf import settings
from rest_framework import serializers

from .models import Category, Product


class SafeImageMixin:
    def get_image(self, obj):
        image = getattr(obj, "image", None)
        if not image:
            return None

        image_name = (getattr(image, "name", "") or "").lstrip("/")
        public_media_url = (
            getattr(settings, "SUPABASE_PUBLIC_MEDIA_URL", "") or ""
        ).rstrip("/")

        if (
            getattr(settings, "USE_SUPABASE_STORAGE", False)
            and public_media_url
            and image_name
        ):
            return f"{public_media_url}/{image_name}"

        try:
            url = image.url
        except (ValueError, AttributeError, OSError):
            return None

        request = self.context.get("request")
        if request and url.startswith("/"):
            return request.build_absolute_uri(url)
        return url


class CategorySerializer(SafeImageMixin, serializers.ModelSerializer):
    # django-mongodb-backend uses ObjectId primary keys. DRF's default
    # ModelSerializer field can leave them as bson.ObjectId objects, which are
    # not JSON serializable. CharField guarantees a stable string for the web app.
    id = serializers.CharField(read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = (
            "id",
            "name_uz",
            "name_ru",
            "image",
            "sort_order",
        )


class ProductSerializer(SafeImageMixin, serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    category = serializers.CharField(source="category_id", read_only=True)
    category_name = serializers.CharField(source="category.name_uz", read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "category",
            "category_name",
            "name_uz",
            "name_ru",
            "description_uz",
            "description_ru",
            "price",
            "image",
            "is_available",
            "sort_order",
        )
