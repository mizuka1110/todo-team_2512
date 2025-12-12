from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import SessionLocal

app = FastAPI()

# DB セッション依存関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ヘルスチェックルート
@app.get("/health")
def health(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1"))
        return {"status": "ok", "db": result.scalar()}
    except Exception as e:
        return {"status": "fail", "db": 0, "error": str(e)}
