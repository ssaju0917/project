import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import user_router
from app.routers import auth_router  # auth_router を追加
from app.routers import master_router  # master_router を追加

app = FastAPI(title="My API", version="1.0.0")

# アップロード先ディレクトリが存在しなければ作成
UPLOAD_DIR = "uploads/avatars"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Next.js のオリジンを許可
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(auth_router)  # auth_router を追加
app.include_router(master_router)  # master_router を追加

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}