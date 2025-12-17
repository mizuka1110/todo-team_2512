# backend/app/routes/task_route.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services import task_service
from app.core.database import get_db
from app.core.security import verify_token
from pydantic import BaseModel
from typing import List

router = APIRouter()

# =========================
# Pydantic モデル
# =========================
class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    due_date: str | None = None  # ISO形式文字列

# =========================
# helper（★ここに書く）
# =========================
def task_to_dict(t):
    return {
        "task_id": t.task_id,
        "title": t.title,
        "description": t.description,
        "due_date": t.due_date,
        "is_done": t.is_done,
        "created_at": t.created_at,
    }

# =========================
# ルート
# =========================

@router.get("/tasks", response_model=List[dict])
def get_tasks(db: Session = Depends(get_db), user=Depends(verify_token)):
    uid = user["uid"]
    tasks = task_service.list_tasks(db, uid)
    return [task_to_dict(t) for t in tasks]

@router.post("/tasks", response_model=dict)
def create_task(task: TaskCreate, db: Session = Depends(get_db), user=Depends(verify_token)):
    uid = user["uid"]
    new_task = task_service.add_task(db, uid, task.title, task.description, task.due_date)
    return new_task.__dict__

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), user=Depends(verify_token)):
    uid = user["uid"]
    success = task_service.remove_task(db, uid, task_id)
    return {"status": "ok" if success else "task not found"}
