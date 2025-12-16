from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from .base import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    firebase_uid = Column(String(128), unique=True, index=True, nullable=False)

    name = Column(String(100), nullable=True)
    email = Column(String(255), nullable=True)

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False
        )

# ④ Task 側と 1:N
    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")
