from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel

from app.core.database import SessionLocal
from app.core.security import verify_token
from app.firebase_admin import *
from app.crud.task_crud import get_tasks_by_uid, create_task_by_uid, delete_task_by_uid
from app.routes.task_route import router as task_router
from app.core.firebase_init import init_firebase

app = FastAPI()

app.include_router(task_router)


# --------------------
# CORS
# --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://frontend:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# DB セッション依存関数
# --------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --------------------
# Pydantic モデル
# --------------------
class TaskCreate(BaseModel):
    title: str
    description: str | None = None

# --------------------
# ヘルスチェック
# --------------------
@app.get("/health")
def health(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1"))
        return {"status": "ok", "db": result.scalar()}
    except Exception as e:
        return {"status": "fail", "db": 0, "error": str(e)}

# --------------------
# 認証テスト用
# --------------------
@app.get("/protected")
def protected(user=Depends(verify_token)):
    return {"uid": user["uid"], "email": user.get("email")}

# # --------------------　＠＠＠ルーター側と完全に重複のため削除
# # Tasks API
# # --------------------
# @app.get("/tasks")
# def get_tasks(db: Session = Depends(get_db), user=Depends(verify_token)):
#     uid = user["uid"]
#     tasks = get_tasks_by_uid(db, uid)
#     return tasks

# @app.post("/tasks")
# def create_task(task: TaskCreate, db: Session = Depends(get_db), user=Depends(verify_token)):
#     uid = user["uid"]
#     new_task = create_task_by_uid(db, uid, task)
#     return new_task

# @app.delete("/tasks/{task_id}")
# def delete_task(task_id: int, db: Session = Depends(get_db), user=Depends(verify_token)):
#     uid = user["uid"]
#     delete_task_by_uid(db, task_id, uid)
#     return {"status": "ok"}

# # --------------------
# # Startup
# # --------------------
@app.on_event("startup")
def startup():
    init_firebase()
