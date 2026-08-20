from rest_framework import serializers

from .models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Feedback
        fields = [
            "id",
            "rating",
            "feedback_type",
            "message",
            "name",
            "phone",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Baho 1 dan 5 gacha bo‘lishi kerak.")
        return value

    def validate_message(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("Iltimos, fikringizni biroz batafsil yozing.")
        return value

    def validate_name(self, value):
        return value.strip()

    def validate_phone(self, value):
        return value.strip()
