from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from customers.telegram_auth import validate_telegram_init_data
from payments.links import build_payment_url

from .models import Order
from .permissions import HasOperatorAPIKey
from .serializers import OrderCreateSerializer, OrderDetailSerializer
from .services import send_order_to_operator_group


class OrderCreateAPIView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer

    def create(self, request, *args, **kwargs):
        create_serializer = self.get_serializer(data=request.data)
        create_serializer.is_valid(raise_exception=True)
        order = create_serializer.save()

        # Cash orders are actionable immediately. Click/Payme orders must first
        # be confirmed by the provider callback; otherwise operators could start
        # preparing an order that was never actually paid.
        if not order.is_online_payment:
            try:
                send_order_to_operator_group(order)
            except Exception as exc:
                print(f"Telegram notification error: {exc}")

        detail_serializer = OrderDetailSerializer(order, context={"request": request})
        return Response(detail_serializer.data, status=201)


class OrderPaymentStatusAPIView(APIView):
    """Return payment state only to the Telegram user who owns the order."""

    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, pk):
        init_data = request.headers.get("X-Telegram-Init-Data", "") or ""

        try:
            telegram_user = validate_telegram_init_data(init_data)
        except Exception as exc:
            detail = getattr(exc, "detail", None)
            if isinstance(detail, dict):
                detail = detail.get("detail") or "Telegram tasdiqlash ma’lumoti noto‘g‘ri."
            elif not detail:
                detail = "Telegram tasdiqlash ma’lumoti noto‘g‘ri."
            return Response({"detail": detail}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            order = Order.objects.get(pk=pk)
        except (Order.DoesNotExist, DjangoValidationError, ValueError, TypeError):
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        customer_telegram_id = getattr(getattr(order, "customer", None), "telegram_id", None)
        if str(customer_telegram_id or "") != str(telegram_user.get("id") or ""):
            return Response({"detail": "Bu buyurtmaga ruxsat yo‘q."}, status=status.HTTP_403_FORBIDDEN)

        return Response(
            {
                "id": str(order.pk),
                "payment_type": order.payment_type,
                "payment_status": order.payment_status,
                "paid_at": order.paid_at,
                "status": order.status,
                "payment_url": build_payment_url(order),
            }
        )


class OrderDetailAPIView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [HasOperatorAPIKey]


class OrderStatusUpdateAPIView(APIView):
    permission_classes = [HasOperatorAPIKey]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=404)

        status_value = request.data.get("status")

        valid_statuses = [choice[0] for choice in Order.Status.choices]
        if status_value not in valid_statuses:
            return Response(
                {"detail": "Invalid status."},
                status=400,
            )

        order.status = status_value
        order.save(update_fields=["status"])

        serializer = OrderDetailSerializer(order, context={"request": request})
        return Response(serializer.data)
