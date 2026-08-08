from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .providers import (
    handle_click_complete,
    handle_click_prepare,
    handle_payme_rpc,
    parse_payme_payload,
    payme_authorized,
    payme_error,
    payme_message,
)


class ClickPrepareAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        payload = {key: request.data.get(key) for key in request.data.keys()}
        return Response(handle_click_prepare(payload), status=200)


class ClickCompleteAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        payload = {key: request.data.get(key) for key in request.data.keys()}
        return Response(handle_click_complete(payload), status=200)


class PaymeMerchantAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def _method_not_post(self):
        return Response(
            payme_error(
                None,
                -32300,
                payme_message(
                    "Faqat POST metodiga ruxsat berilgan.",
                    "Метод запроса должен быть POST.",
                    "Request method must be POST.",
                ),
            ),
            status=200,
        )

    def get(self, request):
        return self._method_not_post()

    def put(self, request):
        return self._method_not_post()

    def patch(self, request):
        return self._method_not_post()

    def delete(self, request):
        return self._method_not_post()

    def post(self, request):
        payload = parse_payme_payload(request.body)
        request_id = payload.get("id") if payload else None

        if not payload:
            return Response(
                payme_error(
                    request_id,
                    -32700,
                    payme_message(
                        "JSON ma’lumotini o‘qib bo‘lmadi.",
                        "Ошибка разбора JSON.",
                        "JSON parse error.",
                    ),
                ),
                status=200,
            )

        if not getattr(settings, "PAYME_ENABLED", False):
            return Response(
                payme_error(
                    request_id,
                    -32400,
                    payme_message(
                        "Payme vaqtincha o‘chirilgan.",
                        "Payme временно отключен.",
                        "Payme is temporarily disabled.",
                    ),
                ),
                status=200,
            )

        authorization = request.headers.get("Authorization", "")
        if not payme_authorized(authorization):
            return Response(
                payme_error(
                    request_id,
                    -32504,
                    payme_message(
                        "Avtorizatsiya xatosi.",
                        "Недостаточно привилегий для выполнения метода.",
                        "Insufficient privileges.",
                    ),
                ),
                status=200,
            )

        return Response(handle_payme_rpc(payload), status=200)
