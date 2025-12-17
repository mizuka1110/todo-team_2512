# app/routes/task_route.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_firebase_uid
from app.schemas.task_schema import TaskCreate, TaskOut
from app.crud import task_crud

router = APIRouter()


@router.get("/tasks", response_model=list[TaskOut])
def get_tasks(
    db: Session = Depends(get_db),
    firebase_uid: str = Depends(get_current_firebase_uid),
):
    return task_crud.get_tasks_by_uid(db, firebase_uid)


@router.post("/tasks", response_model=TaskOut)
def create_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    firebase_uid: str = Depends(get_current_firebase_uid),
):
    task = task_crud.create_task_by_uid(
        db,
        uid=firebase_uid,
        title=payload.title,
        description=payload.description,
        due_date=payload.due_date,
    )
    return task


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    firebase_uid: str = Depends(get_current_firebase_uid),
):
    success = task_crud.delete_task_by_uid(
        db,
        firebase_uid,
        task_id,
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
