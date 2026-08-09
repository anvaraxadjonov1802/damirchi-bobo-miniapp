import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or update the production Django admin from environment variables."

    def handle(self, *args, **options):
        username = os.getenv("ADMIN_USERNAME", "admin").strip() or "admin"
        password = os.getenv("ADMIN_PASSWORD", "").strip()
        email = os.getenv("ADMIN_EMAIL", "").strip()

        if not password:
            self.stdout.write(
                self.style.WARNING(
                    "ADMIN_PASSWORD is not configured; admin user creation was skipped."
                )
            )
            return

        User = get_user_model()
        username_field = User.USERNAME_FIELD

        user, created = User.objects.get_or_create(
            **{username_field: username},
        )

        user.is_active = True
        user.is_staff = True
        user.is_superuser = True

        if email and hasattr(user, "email"):
            user.email = email

        user.set_password(password)
        user.save()

        action = "created" if created else "updated"
        self.stdout.write(
            self.style.SUCCESS(
                f"Production admin {action}: {username}"
            )
        )
