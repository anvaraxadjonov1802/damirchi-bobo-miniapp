# MongoDB-compatible initial migration.

import django_mongodb_backend.fields.auto
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Customer",
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
                ("telegram_id", models.BigIntegerField(unique=True)),
                ("full_name", models.CharField(blank=True, max_length=150, null=True)),
                ("username", models.CharField(blank=True, max_length=100, null=True)),
                ("phone", models.CharField(blank=True, max_length=30, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]
