from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("menu", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="category",
            name="image_url",
            field=models.URLField(blank=True, max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name="category",
            name="image_thumb_url",
            field=models.URLField(blank=True, max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name="category",
            name="image_delete_url",
            field=models.URLField(blank=True, editable=False, max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name="category",
            name="image_provider",
            field=models.CharField(blank=True, default="", max_length=32),
        ),
        migrations.AddField(
            model_name="product",
            name="image_url",
            field=models.URLField(blank=True, max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name="product",
            name="image_thumb_url",
            field=models.URLField(blank=True, max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name="product",
            name="image_delete_url",
            field=models.URLField(blank=True, editable=False, max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name="product",
            name="image_provider",
            field=models.CharField(blank=True, default="", max_length=32),
        ),
    ]
