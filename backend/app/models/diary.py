from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

# タスク・日記共通のステータス定数
STATUS_UNRESOLVED = "未解決"
STATUS_IN_PROGRESS = "対応中"
STATUS_RESOLVED = "解決済"


class DiaryEntry(Base):
    """学習日記"""
    __tablename__ = "diary_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    entry_date = Column(Date, server_default=func.current_date(), nullable=False)
    learned_content = Column(Text, nullable=False)        # 今日勉強したこと
    key_learning_point = Column(Text, nullable=False)      # 一番の学びポイント
    unresolved_content = Column(Text, nullable=True)       # 未解決なこと
    status = Column(String, nullable=False, default=STATUS_RESOLVED)  # 未解決 / 解決済
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="diary_entries")
    tasks = relationship("Task", back_populates="diary_entry")


class Task(Base):
    """タスク（日記の未解決なことから自動生成、または手動作成）"""
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    diary_entry_id = Column(Integer, ForeignKey("diary_entries.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    study_time = Column(String, nullable=True)   # 学習時間・学習目安
    status = Column(String, nullable=False, default=STATUS_UNRESOLVED)  # 未解決 / 対応中 / 解決済
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="tasks")
    diary_entry = relationship("DiaryEntry", back_populates="tasks")
