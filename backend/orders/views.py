from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .serializers import OrderCreateSerializer, OrderDetailSerializer
from .services import send_order_to_operator_group


class OrderCreateAPIView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer

    def create(self, request, *args, **kwargs):
        create_serializer = self.get_serializer(data=request.data)
        create_serializer.is_valid(raise_exception=True)
        order = create_serializer.save()

        try:
            send_order_to_operator_group(order)
        except Exception as exc:
            print(f"Telegram notification error: {exc}")

        detail_serializer = OrderDetailSerializer(order)
        return Response(detail_serializer.data, status=201)

class OrderDetailAPIView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderDetailSerializer


class OrderStatusUpdateAPIView(APIView):
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
                status=400
            )

        order.status = status_value
        order.save(update_fields=["status"])

        serializer = OrderDetailSerializer(order)
        return Response(serializer.data)