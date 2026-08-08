from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("payments", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="paymenttransaction",
            name="provider_time_ms",
            field=models.BigIntegerField(blank=True, db_index=True, null=True),
        ),
        migrations.AddField(
            model_name="paymenttransaction",
            name="create_time_ms",
            field=models.BigIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="paymenttransaction",
            name="perform_time_ms",
            field=models.BigIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="paymenttransaction",
            name="cancel_time_ms",
            field=models.BigIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="paymenttransaction",
            name="provider_state",
            field=models.IntegerField(blank=True, db_index=True, null=True),
        ),
        migrations.AddField(
            model_name="paymenttransaction",
            name="cancel_reason",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="paymenttransaction",
            name="account",
            field=models.JSONField(blank=True, default=dict),
        ),
    ]
