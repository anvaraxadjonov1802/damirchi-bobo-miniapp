from django.urls import path

from .views import OrderCreateAPIView, OrderDetailAPIView, OrderStatusUpdateAPIView

urlpatterns = [
    path("orders/", OrderCreateAPIView.as_view(), name="order-create"),
    path("orders/<str:pk>/", OrderDetailAPIView.as_view(), name="order-detail"),
    path("orders/<str:pk>/status/", OrderStatusUpdateAPIView.as_view(), name="order-status-update"),
]
