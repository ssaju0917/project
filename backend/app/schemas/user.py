from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional
from app.schemas.master import PersonalityOut, CharacterOut

class UserCreate(BaseModel):
    """POST リクエスト時に受け取るデータ"""
    name: str
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    """PUT リクエスト時に受け取るデータ（全項目を一括更新）"""
    name: str
    email: EmailStr
    birth_date: Optional[date] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    permission_level: Optional[int] = None
    occupation: Optional[str] = None     # 追加：職業
    study_content: Optional[str] = None  # 追加：学習内容
    dream: Optional[str] = None          # 追加：将来の夢
    personality_ids: list[int] = []  # 追加：選択された性格IDの配列
    character_ids: list[int] = []    # 追加：選択された特徴IDの配列

class UserResponse(BaseModel):
    """レスポンスとして返すデータ"""
    id: int
    name: str
    email: str
    is_active: bool
    birth_date: Optional[date] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    permission_level: Optional[int] = None
    occupation: Optional[str] = None     # 追加：職業
    study_content: Optional[str] = None  # 追加：学習内容
    dream: Optional[str] = None          # 追加：将来の夢
    created_at: datetime
    personalities: list[PersonalityOut] = []  # 追加：選択済み性格（名前つき）
    characters: list[CharacterOut] = []       # 追加：選択済み特徴（名前つき）

    class Config:
        from_attributes = True