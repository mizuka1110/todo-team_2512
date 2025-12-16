from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.database import SessionLocal
from app.routes.task_route import router as task_router

app = FastAPI()

# --------------------
# CORS
# --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://frontend:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# DB
# --------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --------------------
# health
# --------------------
@app.get("/health")
def health(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1"))
    return {"status": "ok", "db": result.scalar()}

# --------------------
# routes
# --------------------
app.include_router(task_router)

