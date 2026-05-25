from rest_framework import serializers

from .models import RestaurantSettings


class RestaurantSettingsSerializer(serializers.ModelSerializer):
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
        )