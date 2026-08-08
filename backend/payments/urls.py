from django.urls import path

from .views import ClickCompleteAPIView, ClickPrepareAPIView, PaymeMerchantAPIView


urlpatterns = [
    path("payments/click/prepare/", ClickPrepareAPIView.as_view(), name="click-prepare"),
    path("payments/click/complete/", ClickCompleteAPIView.as_view(), name="click-complete"),
    path("payments/payme/", PaymeMerchantAPIView.as_view(), name="payme-merchant"),
]
