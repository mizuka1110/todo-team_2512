from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.task_route import router as task_router
from app.core.firebase_init import init_firebase
from app.core.logging import setup_logging, get_logger
from app.middlewares.access_log import access_log_middleware

# --------------------
# ログ初期化
# --------------------

setup_logging()
logger = get_logger("todo_app")

# --------------------
# FastAPI
# --------------------

app = FastAPI()

# --------------------
# アクセスログ（全リクエスト）
# --------------------
app.middleware("http")(access_log_middleware)

logger.info("FastAPI app started")

# --------------------
# CORS（必ず router より先）
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
# Routes
# --------------------
app.include_router(task_router)

# --------------------
# Health
# --------------------
@app.get("/health")
def health():
    return {"status": "ok"}

# --------------------
# Startup
# --------------------
@app.on_event("startup")
def startup():
    init_firebase()
