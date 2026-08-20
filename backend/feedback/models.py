from django.db import models


class Feedback(models.Model):
    class Type(models.TextChoices):
        COMPLIMENT = "compliment", "Minnatdorchilik"
        SUGGESTION = "suggestion", "Taklif"
        COMPLAINT = "complaint", "Shikoyat"

    rating = models.PositiveSmallIntegerField()
    feedback_type = models.CharField(max_length=20, choices=Type.choices)
    message = models.TextField(max_length=2000)
    name = models.CharField(max_length=120, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    telegram_sent = models.BooleanField(default=False)
    telegram_error = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Mijoz fikri"
        verbose_name_plural = "Mijozlar fikri"

    def __str__(self):
        return f"{self.get_feedback_type_display()} — {self.rating}/5"
