from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.master import Userpersonality, Usercharacter

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False) # 追加
    is_active  = Column(Boolean, default=True)
    birth_date = Column(Date, nullable=True)          # 追加：生年月日
    bio = Column(Text, nullable=True)           # 追加：自己紹介
    avatar_url = Column(String, nullable=True)         # 追加：プロフィール画像URL
    permission_level = Column(Integer, default=1)        # 追加：権限レベル(1:一般ユーザー, 2:管理者)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # リレーションシップの定義
    user_personalities = relationship("Userpersonality", back_populates="user", cascade="all, delete-orphan")
    user_characters = relationship("Usercharacter", back_populates="user", cascade="all, delete-orphan")