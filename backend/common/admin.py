from django.contrib import admin

from .models import RestaurantSettings


@admin.register(RestaurantSettings)
class RestaurantSettingsAdmin(admin.ModelAdmin):
    list_display = (
        "restaurant_name",
        "phone",
        "delivery_price",
        "min_order_amount",
        "is_open",
        "updated_at",
    )

    fieldsets = (
        (
            "Asosiy ma’lumotlar",
            {
                "fields": (
                    "restaurant_name",
                    "tagline",
                    "phone",
                    "address",
                )
            },
        ),
        (
            "Buyurtma sozlamalari",
            {
                "fields": (
                    "delivery_price",
                    "min_order_amount",
                    "is_open",
                )
            },
        ),
        (
            "Ish vaqti",
            {
                "fields": (
                    "open_time",
                    "close_time",
                )
            },
        ),
        (
            "Ijtimoiy tarmoqlar",
            {
                "fields": (
                    "instagram_url",
                    "telegram_url",
                )
            },
        ),
    )

    def has_add_permission(self, request):
        if RestaurantSettings.objects.exists():
            return False
        return True

    def has_delete_permission(self, request, obj=None):
        return False