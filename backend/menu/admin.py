from django import forms
from django.contrib import admin, messages
from django.utils.html import format_html

from .imgbb import ImgBBUploadError, upload_image_to_imgbb
from .models import Category, Product


class ImgBBAdminForm(forms.ModelForm):
    upload_image = forms.ImageField(
        required=False,
        label="Rasm yuklash (ImgBB)",
        help_text=(
            "Rasm faqat bir marta ImgBB'ga yuklanadi. Keyin MongoDB'da URL saqlanadi."
        ),
    )

    class Meta:
        fields = "__all__"


class ImgBBAdminMixin:
    form = ImgBBAdminForm
    readonly_fields = (
        "image_preview",
        "image_url",
        "image_thumb_url",
        "image_provider",
    )
    exclude = ("image", "image_delete_url")

    @admin.display(description="Hozirgi rasm")
    def image_preview(self, obj):
        if not obj or not getattr(obj, "pk", None):
            return "Rasm hali yuklanmagan"

        url = getattr(obj, "image_thumb_url", None) or getattr(obj, "image_url", None)
        if not url:
            return "Rasm yo‘q"

        return format_html(
            '<a href="{}" target="_blank" rel="noopener">'
            '<img src="{}" style="width:140px;height:100px;object-fit:cover;'
            'border-radius:12px;border:1px solid #ddd" loading="lazy" />'
            "</a>",
            url,
            url,
        )

    def save_model(self, request, obj, form, change):
        upload = form.cleaned_data.get("upload_image")

        if upload:
            try:
                result = upload_image_to_imgbb(
                    upload,
                    name=getattr(obj, "name_uz", "damirchi"),
                )
                obj.image_url = result["url"]
                obj.image_thumb_url = result["thumb_url"]
                obj.image_delete_url = result["delete_url"]
                obj.image_provider = result["provider"]
                messages.success(
                    request,
                    "Rasm ImgBB'ga yuklandi va URL MongoDB'da saqlandi.",
                )
            except ImgBBUploadError as exc:
                messages.error(
                    request,
                    f"Rasm ImgBB'ga yuklanmadi: {exc}",
                )

        super().save_model(request, obj, form, change)


@admin.register(Category)
class CategoryAdmin(ImgBBAdminMixin, admin.ModelAdmin):
    list_display = (
        "id",
        "name_uz",
        "image_provider",
        "is_active",
        "sort_order",
    )
    list_editable = ("is_active", "sort_order")
    search_fields = ("name_uz", "name_ru")


@admin.register(Product)
class ProductAdmin(ImgBBAdminMixin, admin.ModelAdmin):
    list_display = (
        "id",
        "name_uz",
        "category",
        "price",
        "image_provider",
        "is_available",
        "is_active",
        "sort_order",
    )
    list_editable = ("price", "is_available", "is_active", "sort_order")
    list_filter = ("category", "image_provider", "is_available", "is_active")
    search_fields = ("name_uz", "name_ru")
