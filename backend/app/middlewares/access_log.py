import time
import uuid
from fastapi import Request
from app.core.logging import get_logger

logger = get_logger("todo_app.access")

async def access_log_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())[:8]
    start = time.time()

    logger.info(f"[{request_id}] start {request.method} {request.url.path}")

    try:
        response = await call_next(request)
    except Exception:
        logger.exception(f"[{request_id}] error {request.method} {request.url.path}")
        raise

    elapsed_ms = int((time.time() - start) * 1000)
    logger.info(
        f"[{request_id}] end {request.method} {request.url.path} "
        f"status={response.status_code} {elapsed_ms}ms"
    )
    return response
