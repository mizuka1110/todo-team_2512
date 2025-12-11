from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from app.models.base import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    firebase_uid = Column(String(128), unique=True, index=True, nullable=False)

    name = Column(String(100), nullable=True)
    email = Column(String(255), nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
