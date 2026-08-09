from rest_framework.response import Response
from rest_framework.views import APIView

from .models import RestaurantSettings
from .serializers import RestaurantSettingsSerializer


class RestaurantSettingsAPIView(APIView):
    def get(self, request):
        settings = RestaurantSettings.load()
        serializer = RestaurantSettingsSerializer(settings)
        response = Response(serializer.data)
        response["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300"
        return response
