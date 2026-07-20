from sqlalchemy import Column, Integer, String, Table, ForeignKey
from app.database import Base
from sqlalchemy.orm import relationship

# 中間テーブル：どのユーザーがどの性格を選んだか
class Userpersonality(Base):
    __tablename__ = "user_personalities"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    personality_id = Column(Integer, ForeignKey("personalities.id", ondelete="CASCADE"), primary_key=True)

    personality = relationship("Personality", back_populates="user_personalities")
    user = relationship("User", back_populates="user_personalities")

# 中間テーブル：どのユーザーがどの特徴を選んだか
class Usercharacter(Base):
    __tablename__ = "user_characters"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    character_id = Column(Integer, ForeignKey("characters.id", ondelete="CASCADE"), primary_key=True)

    character = relationship("Character", back_populates="user_characters")
    user = relationship("User", back_populates="user_characters")

class Personality(Base):
    """性格マスタ（選択肢一覧）"""
    __tablename__ = "personalities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    user_personalities = relationship("Userpersonality", back_populates="personality")


class Character(Base):
    """特徴マスタ（選択肢一覧）"""
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    user_characters = relationship("Usercharacter", back_populates="character")
