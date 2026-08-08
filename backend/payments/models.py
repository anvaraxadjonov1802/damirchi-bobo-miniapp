from django.db import models

from orders.models import Order


class PaymentTransaction(models.Model):
    class Provider(models.TextChoices):
        CLICK = "click", "Click"
        PAYME = "payme", "Payme"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PROCESSING = "processing", "Processing"
        PAID = "paid", "Paid"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"
        REFUNDED = "refunded", "Refunded"

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="payment_transactions",
    )
    provider = models.CharField(max_length=20, choices=Provider.choices)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )

    # Stored in whole UZS for both providers. Payme converts this to tiyin at the API edge.
    amount = models.PositiveIntegerField()
    idempotency_key = models.CharField(max_length=120, unique=True)

    external_id = models.CharField(max_length=255, blank=True, null=True, db_index=True)
    provider_prepare_id = models.CharField(max_length=255, blank=True, null=True)

    # Payme bookkeeping. Millisecond timestamps are required by Merchant API/GetStatement.
    provider_time_ms = models.BigIntegerField(blank=True, null=True, db_index=True)
    create_time_ms = models.BigIntegerField(blank=True, null=True)
    perform_time_ms = models.BigIntegerField(default=0)
    cancel_time_ms = models.BigIntegerField(default=0)
    provider_state = models.IntegerField(blank=True, null=True, db_index=True)
    cancel_reason = models.IntegerField(blank=True, null=True)
    account = models.JSONField(default=dict, blank=True)

    raw_payload = models.JSONField(default=dict, blank=True)
    last_error = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.provider} / {self.order_id} / {self.status}"
