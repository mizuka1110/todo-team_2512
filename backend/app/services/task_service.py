# backend/app/services/task_service.py

from typing import List
from sqlalchemy.orm import Session
from app.crud.task_crud import (
    get_tasks_by_uid,
    create_task_by_uid,
    update_task_by_uid,
    delete_task_by_uid
)
from app.models.task import Task

# タスク一覧取得
def list_tasks(db: Session, uid: str) -> List[Task]:
    return get_tasks_by_uid(db, uid)

# タスク作成
def add_task(db: Session, uid: str, title: str, description: str = None, due_date = None) -> Task:
    return create_task_by_uid(db, uid, title, description, due_date)

# タスク更新
def edit_task(db: Session, uid: str, task_id: int, title: str = None, description: str = None, due_date = None, is_done: bool = None) -> Task | None:
    return update_task_by_uid(db, uid, task_id, title, description, due_date, is_done)

# タスク削除
def remove_task(db: Session, uid: str, task_id: int) -> bool:
    return delete_task_by_uid(db, uid, task_id)
