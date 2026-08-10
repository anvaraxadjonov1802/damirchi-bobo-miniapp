import base64
from urllib.parse import urlencode

from django.conf import settings

from orders.models import Order


def _return_url() -> str:
    return getattr(settings, "PAYMENT_RETURN_URL", "").strip()


def build_click_payment_url(order: Order) -> str | None:
    if not getattr(settings, "CLICK_ENABLED", False):
        return None

    service_id = str(getattr(settings, "CLICK_SERVICE_ID", "")).strip()
    merchant_id = str(getattr(settings, "CLICK_MERCHANT_ID", "")).strip()

    if not service_id or not merchant_id:
        return None

    params = {
        "service_id": service_id,
        "merchant_id": merchant_id,
        "amount": str(int(order.total_price)),
        "transaction_param": str(order.pk),
    }

    return_url = _return_url()
    if return_url:
        params["return_url"] = return_url

    checkout_url = getattr(
        settings,
        "CLICK_CHECKOUT_URL",
        "https://my.click.uz/services/pay",
    ).rstrip("?")

    return f"{checkout_url}?{urlencode(params)}"


def build_payme_payment_url(order: Order) -> str | None:
    if not getattr(settings, "PAYME_ENABLED", False):
        return None

    merchant_id = str(getattr(settings, "PAYME_MERCHANT_ID", "")).strip()
    account_field = str(getattr(settings, "PAYME_ACCOUNT_FIELD", "order_id")).strip()

    if not merchant_id or not account_field:
        return None

    parts = [
        f"m={merchant_id}",
        f"ac.{account_field}={order.pk}",
        f"a={int(order.total_price) * 100}",
        "l=uz",
    ]

    return_url = _return_url()
    if return_url:
        parts.extend([f"c={return_url}", "ct=3000"])

    raw = ";".join(parts).encode("utf-8")
    encoded = base64.b64encode(raw).decode("ascii")

    checkout_url = getattr(
        settings,
        "PAYME_CHECKOUT_URL",
        "https://checkout.paycom.uz",
    ).rstrip("/")

    return f"{checkout_url}/{encoded}"


def build_payment_url(order: Order) -> str | None:
    # Paid/refunded orders are terminal. Failed/cancelled attempts may be retried
    # from the same order so the customer does not need to rebuild the cart.
    if order.payment_status in {
        Order.PaymentStatus.PAID,
        Order.PaymentStatus.REFUNDED,
    }:
        return None

    if order.payment_type == Order.PaymentType.CLICK:
        return build_click_payment_url(order)

    if order.payment_type == Order.PaymentType.PAYME:
        return build_payme_payment_url(order)

    return None
