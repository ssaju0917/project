from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.master import PersonalityOut, CharacterOut
from app import crud

router = APIRouter(tags=["master"])

@router.get("/personalities", response_model=list[PersonalityOut])
def read_personalities(db: Session = Depends(get_db)):
    """性格の選択肢一覧取得"""
    return crud.get_personalities(db)

@router.get("/characters", response_model=list[CharacterOut])
def read_characters(db: Session = Depends(get_db)):
    """特徴の選択肢一覧取得"""
    return crud.get_characters(db)
