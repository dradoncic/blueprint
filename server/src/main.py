""" FastAPI server module."""

import os
import uuid
from typing import Optional
from datetime import datetime

from fastapi import FastAPI, Request, Response, HTTPException, status
from dotenv import load_dotenv
from .utils.logger import logger_factory, AsyncPostgresHandler

load_dotenv(override=True)

HOST=os.getenv("PG_HOST")
DATABASE=os.getenv("PG_DATABASE")
USER=os.getenv("PG_USER")
PASSWORD=os.getenv("PG_PASSWORD")
PORT=os.getenv("PG_PORT")

logger = logger_factory.setup_logger(
    "server",
    postgres_dsn=f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}"
)

app = FastAPI()


@app.middleware("http")
async def log_requests(request: Request, call_next) -> Response:
    """
    Wraps all HTTP requests, logs request as structure data, continues processing.
    """
    request_id = str(uuid.uuid4())
    ip = request.client.host
    timestamp = datetime.utcnow()

    logger.info(
        "Incoming request",
        extra={
            "id": request_id,
            "timestamp": timestamp,
            "ip": ip,
            "data": f"{request.method} {request.url.path}"
        }
    )

    response = await call_next(request)
    return response

@app.on_event("shutdown")
async def shutdown_event() -> None:
    """
    Shutdown handlers for the logger.
    """
    for handler in logger.handlers:
        if isinstance(handler, AsyncPostgresHandler):
            await handler.shutdown()
