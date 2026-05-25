from rest_framework import serializers

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "name_uz",
            "name_ru",
            "image",
            "sort_order",
        )


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name_uz", read_only=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "category",
            "category_name",
            "name_uz",
            "name_ru",
            "description_uz",
            "description_ru",
            "price",
            "image",
            "is_available",
            "sort_order",
        )