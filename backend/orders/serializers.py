from rest_framework import serializers
from django.db import transaction
from django.conf import settings

from customers.models import Customer
from customers.telegram_auth import validate_telegram_init_data
from menu.models import Product
from common.models import RestaurantSettings
from .models import Order, OrderItem


class OrderItemCreateSerializer(serializers.Serializer):
    product = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = (
            "id",
            "product",
            "product_name",
            "quantity",
            "price",
            "total",
        )


class OrderCreateSerializer(serializers.ModelSerializer):
    telegram_init_data = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
    )
    telegram_id = serializers.IntegerField(write_only=True, required=False)
    full_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    username = serializers.CharField(write_only=True, required=False, allow_blank=True)
    items = OrderItemCreateSerializer(many=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "telegram_init_data",
            "telegram_id",
            "full_name",
            "username",
            "order_type",
            "payment_type",
            "phone",
            "address",
            "latitude",
            "longitude",
            "comment",
            "items",
        )

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("Order items cannot be empty.")
        return items

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items")

        telegram_init_data = validated_data.pop("telegram_init_data", "") or ""
        fallback_telegram_id = validated_data.pop("telegram_id", None)
        fallback_full_name = validated_data.pop("full_name", "") or ""
        fallback_username = validated_data.pop("username", "") or ""

        request = self.context.get("request")

        if not telegram_init_data and request:
            telegram_init_data = request.headers.get("X-Telegram-Init-Data", "") or ""

        if telegram_init_data:
            try:
                telegram_user = validate_telegram_init_data(telegram_init_data)
            except Exception:
                raise serializers.ValidationError(
                    {"detail": "Telegram tasdiqlash ma’lumoti noto‘g‘ri."}
                )

            telegram_id = telegram_user["id"]
            full_name = " ".join(
                filter(
                    None,
                    [
                        telegram_user.get("first_name", ""),
                        telegram_user.get("last_name", ""),
                    ],
                )
            ) or "Telegram foydalanuvchisi"
            username = telegram_user.get("username", "") or ""

        else:
            allow_unverified = getattr(
                settings,
                "ALLOW_UNVERIFIED_TELEGRAM_IN_DEBUG",
                False,
            )

            if not allow_unverified:
                raise serializers.ValidationError(
                    {"detail": "Telegram tasdiqlash ma’lumoti talab qilinadi."}
                )

            telegram_id = fallback_telegram_id
            full_name = fallback_full_name or "Test User"
            username = fallback_username or "test_user"

            if not telegram_id:
                raise serializers.ValidationError(
                    {"telegram_id": "telegram_id talab qilinadi."}
                )

        customer, _ = Customer.objects.update_or_create(
            telegram_id=telegram_id,
            defaults={
                "full_name": full_name,
                "username": username,
                "phone": validated_data.get("phone"),
            },
        )

        subtotal = 0
        order_items = []

        for item in items_data:
            product_id = item["product"]
            quantity = item["quantity"]

            try:
                product = Product.objects.get(
                    id=product_id,
                    is_active=True,
                    is_available=True,
                )
            except Product.DoesNotExist:
                raise serializers.ValidationError(
                    {"items": f"Product with id {product_id} not found or unavailable."}
                )

            item_total = product.price * quantity
            subtotal += item_total

            order_items.append(
                {
                    "product": product,
                    "product_name": product.name_uz,
                    "quantity": quantity,
                    "price": product.price,
                    "total": item_total,
                }
            )

        restaurant_settings = RestaurantSettings.load()

        if not restaurant_settings.is_open:
            raise serializers.ValidationError(
                {"detail": "Restoran hozir yopiq. Iltimos, keyinroq urinib ko‘ring."}
            )

        delivery_price = 0

        if validated_data.get("order_type") == Order.OrderType.DELIVERY:
            delivery_price = restaurant_settings.delivery_price

            if (
                restaurant_settings.min_order_amount
                and subtotal < restaurant_settings.min_order_amount
            ):
                raise serializers.ValidationError(
                    {
                        "detail": (
                            "Dastavka uchun minimal buyurtma summasi "
                            f"{restaurant_settings.min_order_amount:,} so‘m."
                        )
                    }
                )

        total_price = subtotal + delivery_price

        order = Order.objects.create(
            customer=customer,
            subtotal=subtotal,
            delivery_price=delivery_price,
            total_price=total_price,
            **validated_data,
        )

        for item in order_items:
            OrderItem.objects.create(order=order, **item)

        return order


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source="customer.full_name", read_only=True)
    customer_username = serializers.CharField(source="customer.username", read_only=True)
    customer_telegram_id = serializers.IntegerField(
        source="customer.telegram_id",
        read_only=True,
    )

    class Meta:
        model = Order
        fields = (
            "id",
            "customer_name",
            "customer_username",
            "customer_telegram_id",
            "order_type",
            "payment_type",
            "status",
            "phone",
            "address",
            "latitude",
            "longitude",
            "comment",
            "subtotal",
            "delivery_price",
            "total_price",
            "items",
            "created_at",
        )