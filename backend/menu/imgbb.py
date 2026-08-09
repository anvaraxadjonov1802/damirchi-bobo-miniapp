import os
from pathlib import Path

import requests


class ImgBBUploadError(RuntimeError):
    pass


def upload_image_to_imgbb(uploaded_file, *, name: str = "") -> dict:
    api_key = os.getenv("IMGBB_API_KEY", "").strip()
    if not api_key:
        raise ImgBBUploadError("IMGBB_API_KEY Render Environment ichida sozlanmagan.")

    filename = getattr(uploaded_file, "name", "image") or "image"
    content_type = getattr(uploaded_file, "content_type", None) or "application/octet-stream"
    safe_name = (name or Path(filename).stem or "damirchi").strip()[:120]

    try:
        if hasattr(uploaded_file, "seek"):
            uploaded_file.seek(0)

        response = requests.post(
            "https://api.imgbb.com/1/upload",
            params={"key": api_key},
            data={"name": safe_name},
            files={"image": (filename, uploaded_file, content_type)},
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
    original_url = (
        (data.get("image") or {}).get("url")
        or data.get("url")
        or data.get("display_url")
    )
    optimized_url = (
        (data.get("medium") or {}).get("url")
        or data.get("display_url")
        or (data.get("thumb") or {}).get("url")
        or original_url
    )

    if not original_url:
        raise ImgBBUploadError("ImgBB rasm URL'ini qaytarmadi.")

    return {
        "url": original_url,
        "thumb_url": optimized_url,
        "delete_url": data.get("delete_url") or "",
        "provider": "imgbb",
    }
