from sqlalchemy.orm import Session, joinedload
from app.models.master import Personality, Character, Userpersonality, Usercharacter
from app.models.user import User

def get_personalities(db: Session):
    """性格の選択肢一覧取得"""
    return db.query(Personality).order_by(Personality.id).all()

def get_characters(db: Session):
    """特徴の選択肢一覧取得"""
    return db.query(Character).order_by(Character.id).all()

def get_user_personalities_by_user_id(db: Session, user_id: int):
    """ユーザーが選択した性格の取得"""
    personalities = db.query(Userpersonality).options(joinedload(Userpersonality.personality)).filter(Userpersonality.user_id == user_id).all()
    return [{
        "id": up.personality.id,
        "name": up.personality.name
    } for up in personalities]

def get_user_characters_by_user_id(db: Session, user_id: int):
    """ユーザーが選択した特徴の取得"""
    characters = db.query(Usercharacter).options(joinedload(Usercharacter.character)).filter(Usercharacter.user_id == user_id).all()
    return [{
        "id": uc.character.id,
        "name": uc.character.name
    } for uc in characters]