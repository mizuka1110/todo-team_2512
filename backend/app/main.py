from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import SessionLocal
from app.core.security import verify_token
from app.firebase_admin import *  # Firebase Admin 初期化

from app.crud.task_crud import (
    get_tasks_by_uid,
    create_task_by_uid,
    delete_task_by_uid,
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TaskCreate(BaseModel):
    title: str
    description: str | None = None

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
# データ取得
@app.get("/tasks")
def get_tasks(user=Depends(verify_token)):
    uid = user["uid"]
    tasks = get_tasks_by_uid(uid) 
    return tasks

# データ削除
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, user=Depends(verify_token)):
    uid = user["uid"]
    delete_task_by_uid(task_id, uid)
    return {"status": "ok"}

# データ作成
@app.post("/tasks")
def create_task(
    task: TaskCreate,
    user=Depends(verify_token)
):
    uid = user["uid"]
    new_task = create_task_by_uid(uid, task)
    return new_task


