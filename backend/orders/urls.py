from django.urls import path

from .views import (
    OrderCreateAPIView,
    OrderDetailAPIView,
    OrderPaymentStatusAPIView,
    OrderStatusUpdateAPIView,
)

urlpatterns = [
    path("orders/", OrderCreateAPIView.as_view(), name="order-create"),
    path("orders/<str:pk>/", OrderDetailAPIView.as_view(), name="order-detail"),
    path(
        "orders/<str:pk>/payment-status/",
        OrderPaymentStatusAPIView.as_view(),
        name="order-payment-status",
    ),
    path("orders/<str:pk>/status/", OrderStatusUpdateAPIView.as_view(), name="order-status-update"),
]
