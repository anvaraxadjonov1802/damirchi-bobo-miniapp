from django.conf import settings
from rest_framework import serializers

from .models import Category, Product


class SafeImageMixin:
    def get_image(self, obj):
        # ImgBB URL is preferred. It is uploaded once from Django admin and the
        # URL stays in MongoDB, so API reads never re-upload the image.
        remote_url = (
            getattr(obj, "image_thumb_url", None)
            or getattr(obj, "image_url", None)
        )
        if remote_url:
            return remote_url

        # Legacy/local/Supabase fallback for older records.
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

    def get_image_original(self, obj):
        return getattr(obj, "image_url", None) or self.get_image(obj)


class CategorySerializer(SafeImageMixin, serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    image = serializers.SerializerMethodField()
    image_original = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = (
            "id",
            "name_uz",
            "name_ru",
            "image",
            "image_original",
            "sort_order",
        )


class ProductSerializer(SafeImageMixin, serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    category = serializers.CharField(source="category_id", read_only=True)
    category_name = serializers.CharField(source="category.name_uz", read_only=True)
    image = serializers.SerializerMethodField()
    image_original = serializers.SerializerMethodField()

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
            "image_original",
            "is_available",
            "sort_order",
        )
