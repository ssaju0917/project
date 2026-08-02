from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.diary import DiaryEntryCreate, DiaryEntryResponse
from app import crud

router = APIRouter(prefix="/diary", tags=["diary"])


@router.get("/", response_model=list[DiaryEntryResponse])
def read_diary_entries(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """ログイン中ユーザーの日記一覧取得"""
    return crud.get_diary_entries(db, user_id=current_user.id)


@router.post("/", response_model=DiaryEntryResponse, status_code=201)
def create_diary_entry(entry: DiaryEntryCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """日記作成（未解決なことがあれば自動でタスクを起票する）"""
    return crud.create_diary_entry(db, user_id=current_user.id, entry=entry)
