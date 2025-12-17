from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_firebase_uid
from app.schemas.task_schema import TaskCreate, TaskOut
from app.crud import task_crud
from app.core.logging import get_logger

router = APIRouter()
logger = get_logger("todo_app.tasks")


@router.get("/tasks", response_model=list[TaskOut])
def get_tasks(db: Session = Depends(get_db), firebase_uid: str = Depends(get_current_firebase_uid)):
    logger.info("get_tasks start")
    try:
        tasks = task_crud.get_tasks_by_uid(db, firebase_uid)
        logger.info(f"get_tasks success count={len(tasks)}")
        return tasks
    except Exception:
        logger.exception("get_tasks failed")
        raise


@router.post("/tasks", response_model=TaskOut)
def create_task(payload: TaskCreate, db: Session = Depends(get_db), firebase_uid: str = Depends(get_current_firebase_uid)):
    logger.info(f"create_task start title_len={len(payload.title)}")
    try:
        task = task_crud.create_task_by_uid(
            db,
            uid=firebase_uid,
            title=payload.title,
            description=payload.description,
            due_date=payload.due_date,
        )
        task_id = getattr(task, "task_id", None) or getattr(task, "id", None)
        logger.info(f"create_task success task_id={task_id}")
        return task
    except Exception:
        logger.exception("create_task failed")
        raise


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db), firebase_uid: str = Depends(get_current_firebase_uid)):
    logger.info(f"delete_task start task_id={task_id}")
    try:
        success = task_crud.delete_task_by_uid(db, firebase_uid, task_id)
        if not success:
            logger.info(f"delete_task not_found task_id={task_id}")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

        logger.info(f"delete_task success task_id={task_id}")
        return None
    except HTTPException:
        raise
    except Exception:
        logger.exception(f"delete_task failed task_id={task_id}")
        raise