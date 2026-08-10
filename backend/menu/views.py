from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


MENU_CACHE_CONTROL = "public, max-age=60, stale-while-revalidate=300"


class MenuBootstrapAPIView(APIView):
    """Return active categories and products in one request for fast app startup."""

    authentication_classes = []
    permission_classes = []

    def get(self, request):
        categories = list(Category.objects.filter(is_active=True))
        category_names = {str(category.id): category.name_uz for category in categories}
        products = list(Product.objects.filter(is_active=True))

        response = Response(
            {
                "categories": CategorySerializer(
                    categories,
                    many=True,
                    context={"request": request},
                ).data,
                "products": ProductSerializer(
                    products,
                    many=True,
                    context={
                        "request": request,
                        "category_names": category_names,
                    },
                ).data,
            }
        )
        response["Cache-Control"] = MENU_CACHE_CONTROL
        return response


class CachedReadOnlyModelViewSet(viewsets.ReadOnlyModelViewSet):
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response["Cache-Control"] = MENU_CACHE_CONTROL
        return response

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        response["Cache-Control"] = MENU_CACHE_CONTROL
        return response


class CategoryViewSet(CachedReadOnlyModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(is_active=True)


class ProductViewSet(CachedReadOnlyModelViewSet):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)

        category_id = self.request.query_params.get("category")
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        return queryset
