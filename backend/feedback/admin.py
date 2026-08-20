from django.contrib import admin

from .models import Feedback


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = (
        "feedback_type",
        "rating",
        "name",
        "phone",
        "telegram_sent",
        "created_at",
    )
    list_filter = ("feedback_type", "rating", "telegram_sent", "created_at")
    search_fields = ("message", "name", "phone")
    readonly_fields = ("telegram_sent", "telegram_error", "created_at")
