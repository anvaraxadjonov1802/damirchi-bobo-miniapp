from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class MenuBootstrapAPIView(APIView):
    """Return active categories and products in one request for fast app startup."""

    authentication_classes = []
    permission_classes = []

    def get(self, request):
        categories = Category.objects.filter(is_active=True)
        products = Product.objects.filter(is_active=True)

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
                    context={"request": request},
                ).data,
            }
        )
        # Browser/WebView may reuse the menu briefly while the app also keeps a
        # persistent local copy for instant subsequent launches.
        response["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300"
        return response


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(is_active=True)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)

        category_id = self.request.query_params.get("category")
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        return queryset
