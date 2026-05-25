from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product", "product_name", "quantity", "price", "total")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "phone",
        "order_type",
        "payment_type",
        "status",
        "total_price",
        "created_at",
    )
    list_filter = ("order_type", "payment_type", "status", "created_at")
    search_fields = ("phone", "address", "customer__full_name", "customer__username")
    list_editable = ("status",)
    inlines = [OrderItemInline]
    readonly_fields = ("subtotal", "delivery_price", "total_price", "created_at")


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "product_name", "quantity", "price", "total")