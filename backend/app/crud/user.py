from sqlalchemy.orm import Session
from app.models.user import User
from app.models.master import Personality, Character
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password
from app.models.master import Userpersonality, Usercharacter

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """ユーザー一覧取得"""
    return db.query(User).offset(skip).limit(limit).all()

def get_user(db: Session, user_id: int):
    """ユーザー1件取得"""
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(name=user.name,email=user.email,hashed_password=hash_password(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: UserUpdate):
    """ユーザー更新（PUT: 全項目を一括更新）"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    db_user.name = user.name
    db_user.email = user.email
    db_user.birth_date = user.birth_date
    db_user.bio = user.bio
    db_user.avatar_url = user.avatar_url
    db_user.permission_level = user.permission_level
    db_user.occupation = user.occupation
    db_user.study_content = user.study_content
    db_user.dream = user.dream
    # 選択された性格・特徴IDから対象レコードを取得し、関連をまとめて置き換える
    for personality_id in user.personality_ids:
        if not db.query(Userpersonality).filter(Userpersonality.user_id == user_id, Userpersonality.personality_id == personality_id).first():
            db_user_personalities = Userpersonality(user_id=user_id, personality_id=personality_id)
            db.add(db_user_personalities)
    for character_id in user.character_ids:
        if not db.query(Usercharacter).filter(Usercharacter.user_id == user_id, Usercharacter.character_id == character_id).first():
            db_user_characters = Usercharacter(user_id=user_id, character_id=character_id)
            db.add(db_user_characters)
    # 既存の関連を削除する（選択されなかった性格・特徴を削除）
    db.query(Userpersonality).filter(Userpersonality.user_id == user_id, ~Userpersonality.personality_id.in_(user.personality_ids)).delete(synchronize_session=False)
    db.query(Usercharacter).filter(Usercharacter.user_id == user_id, ~Usercharacter.character_id.in_(user.character_ids)).delete(synchronize_session=False)
    
    db.commit()
    db.refresh(db_user)
    return db_user  

def delete_user(db: Session, user_id: int):
    """ユーザー削除"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

def get_user_by_email(db: Session, email: str):
    """メールアドレスでユーザーを検索（ログイン時に使用）"""
    return db.query(User).filter(User.email == email).first()