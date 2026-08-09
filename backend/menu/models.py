from django.db import models


class Category(models.Model):
    name_uz = models.CharField(max_length=100)
    name_ru = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to="categories/", blank=True, null=True)
    image_url = models.URLField(max_length=1000, blank=True, null=True)
    image_thumb_url = models.URLField(max_length=1000, blank=True, null=True)
    image_delete_url = models.URLField(
        max_length=1000,
        blank=True,
        null=True,
        editable=False,
    )
    image_provider = models.CharField(max_length=32, blank=True, default="")
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name_uz


class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products"
    )
    name_uz = models.CharField(max_length=150)
    name_ru = models.CharField(max_length=150, blank=True, null=True)
    description_uz = models.TextField(blank=True, null=True)
    description_ru = models.TextField(blank=True, null=True)
    price = models.PositiveIntegerField()
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    image_url = models.URLField(max_length=1000, blank=True, null=True)
    image_thumb_url = models.URLField(max_length=1000, blank=True, null=True)
    image_delete_url = models.URLField(
        max_length=1000,
        blank=True,
        null=True,
        editable=False,
    )
    image_provider = models.CharField(max_length=32, blank=True, default="")
    is_available = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]
        verbose_name = "Product"
        verbose_name_plural = "Products"

    def __str__(self):
        return self.name_uz