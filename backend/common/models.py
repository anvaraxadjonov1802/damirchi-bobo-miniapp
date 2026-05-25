from django.db import models


class RestaurantSettings(models.Model):
    restaurant_name = models.CharField(
        max_length=150,
        default="Damirchi BOBO"
    )
    tagline = models.CharField(
        max_length=255,
        default="Mazali taomlar, tezkor buyurtma"
    )

    phone = models.CharField(
        max_length=30,
        blank=True,
        null=True
    )
    address = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    delivery_price = models.PositiveIntegerField(
        default=15000
    )
    min_order_amount = models.PositiveIntegerField(
        default=0,
        help_text="Dastavka uchun minimal buyurtma summasi. 0 bo‘lsa cheklov yo‘q."
    )

    is_open = models.BooleanField(
        default=True
    )
    open_time = models.TimeField(
        blank=True,
        null=True
    )
    close_time = models.TimeField(
        blank=True,
        null=True
    )

    instagram_url = models.URLField(
        blank=True,
        null=True
    )
    telegram_url = models.URLField(
        blank=True,
        null=True
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Restaurant Settings"
        verbose_name_plural = "Restaurant Settings"

    def __str__(self):
        return self.restaurant_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        settings, _ = cls.objects.get_or_create(pk=1)
        return settings