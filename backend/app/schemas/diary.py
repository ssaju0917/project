from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class DiaryEntryCreate(BaseModel):
    """日記作成時に受け取るデータ（固定3問）"""
    learned_content: str        # 今日勉強したこと
    key_learning_point: str     # 一番の学びポイント
    unresolved_content: Optional[str] = None  # 未解決なこと


class DiaryEntryResponse(BaseModel):
    id: int
    entry_date: date
    learned_content: str
    key_learning_point: str
    unresolved_content: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class TaskCreate(BaseModel):
    """タスク手動作成時に受け取るデータ"""
    title: str
    description: Optional[str] = None
    study_time: Optional[str] = None
    status: str = "未解決"


class TaskUpdate(BaseModel):
    """タスク更新時に受け取るデータ（ステータス変更など）"""
    title: Optional[str] = None
    description: Optional[str] = None
    study_time: Optional[str] = None
    status: Optional[str] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    study_time: Optional[str] = None
    status: str
    diary_entry_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TaskStatusSummary(BaseModel):
    """トップ画面の円グラフ用：ステータス別タスク件数"""
    unresolved: int
    in_progress: int
    resolved: int
    total: int
