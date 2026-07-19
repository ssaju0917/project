import os
import uuid
from fastapi import UploadFile, HTTPException

UPLOAD_DIR = "uploads/avatars"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


def validate_image(file: UploadFile) -> str:
    """拡張子を検証し、拡張子を返す"""
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"許可されていないファイル形式です（許可: {', '.join(ALLOWED_EXTENSIONS)}）",
        )
    return ext


async def save_avatar_image(file: UploadFile) -> str:
    """
    アップロードされた画像を保存し、Next.js の public/ から見たパスを返す。
    戻り値の例: "/uploads/avatars/3f2a1b9c.jpg"
    """
    ext = validate_image(file)

    # ファイルサイズ検証
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="ファイルサイズは5MB以下にしてください")

    # ファイル名を UUID で一意化（既存ファイルは上書きしない）
    filename = f"{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(UPLOAD_DIR, filename)

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    with open(save_path, "wb") as f:
        f.write(contents)

    # Next.js 側で `public/uploads/avatars/xxx` として配信されるパス
    return f"/uploads/avatars/{filename}"