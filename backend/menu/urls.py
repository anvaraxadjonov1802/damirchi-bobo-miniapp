from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, MenuBootstrapAPIView, ProductViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="categories")
router.register("products", ProductViewSet, basename="products")

urlpatterns = [
    path("menu/", MenuBootstrapAPIView.as_view(), name="menu-bootstrap"),
    *router.urls,
]
