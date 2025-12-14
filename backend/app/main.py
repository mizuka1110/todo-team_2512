from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.firebase import init_firebase

from app.core.database import SessionLocal
from app.core.security import verify_token
from app.firebase_admin import *  # Firebase Admin 初期化

app = FastAPI()

# =========================
# DB セッション依存関数
# =========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================
# ヘルスチェック
# =========================
@app.get("/health")
def health(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1"))
        return {
            "status": "ok",
            "db": result.scalar()
        }
    except Exception as e:
        return {
            "status": "fail",
            "db": 0,
            "error": str(e)
        }

# =========================
# 認証テスト用（Firebase）
# =========================
@app.get("/protected")
def protected(user=Depends(verify_token)):
    return {
        "uid": user["uid"],
        "email": user.get("email")
    }

@app.get("/tasks")
def get_tasks(user=Depends(verify_token)):
    uid = user["uid"]
    tasks = get_tasks_by_uid(uid)      # ←さるちゃんへ、ここからDBとの接続、多分
    return tasks

@app.on_event("startup")
def startup():
    init_firebase()