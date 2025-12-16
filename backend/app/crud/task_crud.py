from sqlalchemy.orm import Session
from app.models.task import Task

def get_tasks_by_uid(db: Session, firebase_uid: str):
    return (
        db.query(Task)
        .filter(Task.user_id == firebase_uid)
        .order_by(Task.created_at.desc())
        .all()
    )
