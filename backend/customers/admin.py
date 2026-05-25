from django.contrib import admin

from .models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("id", "telegram_id", "full_name", "username", "phone", "created_at")
    search_fields = ("telegram_id", "full_name", "username", "phone")