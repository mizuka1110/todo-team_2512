from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from datetime import datetime, timezone
from .base import Base
from .user import User  # Userモデルをimport
from sqlalchemy.orm import relationship  # ← これが必要

class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # Firebase UID を外部キーとして紐付け
    user_firebase_uid = Column(String(128), ForeignKey("users.firebase_uid"), nullable=False)

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True)

    is_done = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="tasks")

