import io
import os
import re
from pathlib import Path

import requests
from PIL import Image, ImageOps, UnidentifiedImageError


class ImgBBUploadError(RuntimeError):
    pass


def _safe_image_name(value: str) -> str:
    value = (value or "damirchi").strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value[:80] or "damirchi"


def _encode_webp(source_bytes: bytes, *, max_dimension: int, quality: int) -> bytes:
    try:
        with Image.open(io.BytesIO(source_bytes)) as image:
            image = ImageOps.exif_transpose(image)

            if image.mode in {"RGBA", "LA"} or (
                image.mode == "P" and "transparency" in image.info
            ):
                image = image.convert("RGBA")
            else:
                image = image.convert("RGB")

            image.thumbnail(
                (max_dimension, max_dimension),
                Image.Resampling.LANCZOS,
            )

            output = io.BytesIO()
            image.save(
                output,
                format="WEBP",
                quality=quality,
                method=6,
                optimize=True,
            )
            return output.getvalue()
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise ImgBBUploadError("Yuklangan faylni rasm sifatida optimallashtirib bo‘lmadi.") from exc


def _post_image(api_key: str, image_bytes: bytes, *, filename: str, name: str) -> dict:
    try:
        response = requests.post(
            "https://api.imgbb.com/1/upload",
            params={"key": api_key},
            data={"name": name},
            files={"image": (filename, image_bytes, "image/webp")},
            timeout=30,
        )
    except requests.RequestException as exc:
        raise ImgBBUploadError(f"ImgBB bilan aloqa xatosi: {exc}") from exc

    try:
        payload = response.json()
    except ValueError as exc:
        raise ImgBBUploadError(
            f"ImgBB noto‘g‘ri javob qaytardi (HTTP {response.status_code})."
        ) from exc

    if response.status_code >= 400 or not payload.get("success"):
        error = payload.get("error") or {}
        message = error.get("message") or payload.get("status_txt") or "ImgBB upload failed"
        raise ImgBBUploadError(str(message))

    data = payload.get("data") or {}
    url = (
        (data.get("image") or {}).get("url")
        or data.get("url")
        or data.get("display_url")
    )

    if not url:
        raise ImgBBUploadError("ImgBB rasm URL'ini qaytarmadi.")

    return {
        "url": url,
        "delete_url": data.get("delete_url") or "",
    }


def upload_image_to_imgbb(uploaded_file, *, name: str = "") -> dict:
    """Upload two optimized WebP variants to ImgBB.

    Menu cards use a very small 420px thumbnail. Product details use a 960px
    version. The original large admin upload is never served to Mini App users.
    """
    api_key = os.getenv("IMGBB_API_KEY", "").strip()
    if not api_key:
        raise ImgBBUploadError("IMGBB_API_KEY Render Environment ichida sozlanmagan.")

    filename = getattr(uploaded_file, "name", "image") or "image"
    safe_name = _safe_image_name(name or Path(filename).stem or "damirchi")

    try:
        if hasattr(uploaded_file, "seek"):
            uploaded_file.seek(0)
        source_bytes = uploaded_file.read()
    except (OSError, ValueError) as exc:
        raise ImgBBUploadError("Rasm faylini o‘qib bo‘lmadi.") from exc

    if not source_bytes:
        raise ImgBBUploadError("Rasm fayli bo‘sh.")

    # 420px is enough for 2x-density menu cards; 960px keeps detail view sharp.
    menu_bytes = _encode_webp(source_bytes, max_dimension=420, quality=68)
    detail_bytes = _encode_webp(source_bytes, max_dimension=960, quality=78)

    detail = _post_image(
        api_key,
        detail_bytes,
        filename=f"{safe_name}-detail.webp",
        name=f"{safe_name}-detail",
    )
    menu = _post_image(
        api_key,
        menu_bytes,
        filename=f"{safe_name}-menu.webp",
        name=f"{safe_name}-menu",
    )

    return {
        "url": detail["url"],
        "thumb_url": menu["url"],
        "delete_url": detail["delete_url"],
        "provider": "imgbb",
    }
