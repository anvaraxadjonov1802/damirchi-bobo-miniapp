import hmac

from django.conf import settings
from rest_framework.permissions import BasePermission


class HasOperatorAPIKey(BasePermission):
    message = "Operator API key noto‘g‘ri yoki yuborilmagan."

    def has_permission(self, request, view):
        expected = str(getattr(settings, "OPERATOR_API_KEY", "")).strip()
        supplied = str(request.headers.get("X-Operator-Key", "")).strip()

        # Fail closed: production endpoint must never become public because an
        # environment variable was forgotten.
        if not expected or not supplied:
            return False

        return hmac.compare_digest(supplied, expected)
