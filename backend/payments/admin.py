from django.contrib import admin

from .models import PaymentTransaction


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "provider",
        "status",
        "amount",
        "external_id",
        "created_at",
        "paid_at",
    )
    list_filter = ("provider", "status", "created_at")
    search_fields = ("external_id", "idempotency_key")
    readonly_fields = (
        "order",
        "provider",
        "status",
        "amount",
        "idempotency_key",
        "external_id",
        "provider_prepare_id",
        "raw_payload",
        "last_error",
        "created_at",
        "updated_at",
        "paid_at",
    )

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
