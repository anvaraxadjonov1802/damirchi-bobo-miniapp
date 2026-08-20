import logging
from html import escape

from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from telegrambot.services import TelegramAPIError, send_message

from .serializers import FeedbackSerializer


logger = logging.getLogger(__name__)


class FeedbackRateThrottle(AnonRateThrottle):
    rate = "10/min"


def _build_telegram_message(feedback):
    type_meta = {
        "compliment": ("🟢", "MINNATDORCHILIK"),
        "suggestion": ("💡", "TAKLIF"),
        "complaint": ("🔴", "SHIKOYAT"),
    }
    icon, title = type_meta.get(
        feedback.feedback_type,
        ("📝", "MIJOZ FIKRI"),
    )

    stars = "⭐" * feedback.rating
    created_at = timezone.localtime(feedback.created_at).strftime("%d.%m.%Y %H:%M")
    name = escape(feedback.name) if feedback.name else "Ko‘rsatilmagan"
    phone = escape(feedback.phone) if feedback.phone else "Ko‘rsatilmagan"
    message = escape(feedback.message)

    return (
        f"{icon} <b>YANGI {title}</b>\n\n"
        f"⭐ <b>Baho:</b> {feedback.rating}/5 {stars}\n"
        f"📌 <b>Turi:</b> {escape(feedback.get_feedback_type_display())}\n\n"
        f"💬 <b>Mijoz fikri:</b>\n{message}\n\n"
        f"👤 <b>Ism:</b> {name}\n"
        f"📞 <b>Telefon:</b> {phone}\n"
        f"🕐 <b>Vaqt:</b> {created_at}"
    )


def _save_telegram_state(feedback, *, sent: bool, error: str = ""):
    try:
        feedback.telegram_sent = sent
        feedback.telegram_error = error[:1000]
        feedback.save(update_fields=["telegram_sent", "telegram_error"])
    except Exception:
        # Feedback itself is already persisted. Notification bookkeeping must
        # never turn a successful customer submission into a 500 response.
        logger.exception("Could not persist Telegram delivery state for feedback %s", feedback.pk)


class FeedbackCreateView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = [FeedbackRateThrottle]

    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        feedback = serializer.save()

        chat_id = (
            getattr(settings, "FEEDBACK_CHAT_ID", "")
            or getattr(settings, "OPERATOR_CHAT_ID", "")
        )
        topic_id = getattr(settings, "TELEGRAM_TOPIC_FEEDBACK_ID", "") or None

        if chat_id:
            try:
                send_message(
                    chat_id,
                    _build_telegram_message(feedback),
                    message_thread_id=topic_id,
                )
                _save_telegram_state(feedback, sent=True)
            except TelegramAPIError as exc:
                _save_telegram_state(feedback, sent=False, error=str(exc))
            except Exception as exc:
                # Telegram or its bookkeeping is best-effort after the feedback
                # has been safely stored in MongoDB.
                logger.exception("Unexpected feedback Telegram notification error")
                _save_telegram_state(feedback, sent=False, error=str(exc))
        else:
            _save_telegram_state(
                feedback,
                sent=False,
                error="FEEDBACK_CHAT_ID/OPERATOR_CHAT_ID is not configured.",
            )

        return Response(
            {
                "ok": True,
                "message": "Fikringiz uchun rahmat!",
                "feedback_id": str(feedback.pk),
            },
            status=status.HTTP_201_CREATED,
        )
