from django.contrib import admin

from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name_uz", "is_active", "sort_order")
    list_editable = ("is_active", "sort_order")
    search_fields = ("name_uz", "name_ru")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name_uz",
        "category",
        "price",
        "is_available",
        "is_active",
        "sort_order",
    )
    list_editable = ("price", "is_available", "is_active", "sort_order")
    list_filter = ("category", "is_available", "is_active")
    search_fields = ("name_uz", "name_ru")