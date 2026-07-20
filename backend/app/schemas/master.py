from pydantic import BaseModel

class PersonalityOut(BaseModel):
    """性格の選択肢（表示用）"""
    id: int
    name: str

    class Config:
        from_attributes = True

class CharacterOut(BaseModel):
    """特徴の選択肢（表示用）"""
    id: int
    name: str

    class Config:
        from_attributes = True
