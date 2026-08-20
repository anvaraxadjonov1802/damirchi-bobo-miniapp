import django_mongodb_backend.fields.auto
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Feedback",
            fields=[
                (
                    "id",
                    django_mongodb_backend.fields.ObjectIdAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("rating", models.PositiveSmallIntegerField()),
                (
                    "feedback_type",
                    models.CharField(
                        choices=[
                            ("compliment", "Minnatdorchilik"),
                            ("suggestion", "Taklif"),
                            ("complaint", "Shikoyat"),
                        ],
                        max_length=20,
                    ),
                ),
                ("message", models.TextField(max_length=2000)),
                ("name", models.CharField(blank=True, max_length=120)),
                ("phone", models.CharField(blank=True, max_length=30)),
                ("telegram_sent", models.BooleanField(default=False)),
                ("telegram_error", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "verbose_name": "Mijoz fikri",
                "verbose_name_plural": "Mijozlar fikri",
                "ordering": ["-created_at"],
            },
        ),
    ]
