from django.conf import settings
from rest_framework import serializers

from .models import RestaurantSettings


class RestaurantSettingsSerializer(serializers.ModelSerializer):
    click_enabled = serializers.SerializerMethodField()
    payme_enabled = serializers.SerializerMethodField()

    class Meta:
        model = RestaurantSettings
        fields = (
            "restaurant_name",
            "tagline",
            "phone",
            "address",
            "delivery_price",
            "min_order_amount",
            "is_open",
            "open_time",
            "close_time",
            "instagram_url",
            "telegram_url",
            "click_enabled",
            "payme_enabled",
        )

    def get_click_enabled(self, obj):
        return bool(
            getattr(settings, "CLICK_ENABLED", False)
            and getattr(settings, "CLICK_SERVICE_ID", "")
            and getattr(settings, "CLICK_MERCHANT_ID", "")
            and getattr(settings, "CLICK_SECRET_KEY", "")
        )

    def get_payme_enabled(self, obj):
        return bool(
            getattr(settings, "PAYME_ENABLED", False)
            and getattr(settings, "PAYME_MERCHANT_ID", "")
            and getattr(settings, "PAYME_LOGIN", "")
            and getattr(settings, "PAYME_SECRET_KEY", "")
        )
