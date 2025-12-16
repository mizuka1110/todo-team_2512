from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import get_current_user
from app.crud.task_crud import get_tasks_by_uid

router = APIRouter(prefix="/tasks", tags=["tasks"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_tasks(
    db: Session = Depends(get_db),
    firebase_uid: str = Depends(get_current_user),
):
    return get_tasks_by_uid(db, firebase_uid)
