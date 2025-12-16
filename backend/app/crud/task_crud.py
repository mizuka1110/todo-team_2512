# backend/app/crud/task_crud.py

from typing import List
from sqlalchemy.orm import Session
from models.task import Task
from models.user import User
from core.database import get_db


# タスク取得
def get_tasks_by_uid(db: Session, uid: str) -> List[Task]:
    return db.query(Task).filter(Task.user_firebase_uid == uid).all()

# タスク作成
def create_task_by_uid(db: Session, uid: str, title: str, description: str = None, due_date = None) -> Task:
    new_task = Task(
        user_firebase_uid=uid,
        title=title,
        description=description,
        due_date=due_date
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)  # IDなど自動生成値を取得
    return new_task

# タスク削除
def delete_task_by_uid(db: Session, uid: str, task_id: int) -> bool:
    task = db.query(Task).filter(Task.task_id == task_id, Task.user_firebase_uid == uid).first()
    if task:
        db.delete(task)
        db.commit()
        return True
    return False
