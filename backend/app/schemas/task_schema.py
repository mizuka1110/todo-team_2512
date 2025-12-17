from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None


class TaskOut(BaseModel):
    task_id: int
    title: str
    description: Optional[str]
    due_date: Optional[datetime]
    is_done: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
