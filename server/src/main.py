"""FastAPI server module."""

import os
import uuid
from datetime import datetime
from typing import List

import asyncpg  # type: ignore
from dotenv import load_dotenv
from fastapi import FastAPI, Request, Response, Query, HTTPException, status
from .utils.model import (
    EncryptRequest,
    EncryptResponse,
    DecryptRequest,
    DecryptResponse,
    LogItem,
    Health,
)
from .utils.logger import logger_factory, AsyncPostgresHandler
from .utils.encryption import encrypt, decrypt

load_dotenv(override=True)

HOST = os.getenv("PG_HOST")
DATABASE = os.getenv("PG_DATABASE")
USER = os.getenv("PG_USER")
PASSWORD = os.getenv("PG_PASSWORD")
PORT = os.getenv("PG_PORT")

POSTGRES_DSN = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}"

logger = logger_factory.setup_logger("server", postgres_dsn=POSTGRES_DSN)

app = FastAPI()


@app.middleware("http")
async def log_requests(request: Request, call_next) -> Response:
    """
    Wraps all HTTP requests, logs request as structure data, continues processing.
    """
    request_id = str(uuid.uuid4())
    ip = request.client.host if request.client else "unknown"
    timestamp = datetime.utcnow()

    logger.info(
        "Incoming request",
        extra={
            "id": request_id,
            "timestamp": timestamp,
            "ip": ip,
            "data": f"{request.method} {request.url.path}",
        },
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


@app.get(
    "/health",
    tags=["health"],
    summary="Health check endpoint.",
    response_description="Returns HTTP Status Code 200 (OK).",
    status_code=status.HTTP_200_OK,
    response_model=Health,
)
def health_check():
    """Health check for application"""
    return Health(status="OK")


@app.post(
    "/api/v1/encrypt",
    tags=["encrypt"],
    summary="Encrypt data",
    response_description="Returns encrypted data",
    status_code=status.HTTP_200_OK,
    response_model=EncryptResponse,
)
async def encrypt_endpoint(req: EncryptRequest):
    """
    Endpoint will encrypt payload.
    """
    try:
        encrypted = await encrypt(req.key, req.data)
        return EncryptResponse(data=encrypted)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@app.post(
    "/api/v1/decrypt",
    tags=["decrypt"],
    summary="Decrypt data",
    response_description="Returns decrypted data",
    status_code=status.HTTP_200_OK,
    response_model=DecryptResponse,
)
async def decrypt_endpoint(req: DecryptRequest):
    """
    Endpoint will decrypt payload.
    """
    try:
        decrypted = await decrypt(req.key, req.data)
        return DecryptResponse(data=decrypted)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@app.get(
    "/api/v1/logs",
    tags=["logs"],
    summary="Fetch log records",
    response_description="Returns list log records",
    status_code=status.HTTP_200_OK,
    response_model=List[LogItem],
)
async def get_logs(size: int = Query(10, ge=1, le=100), offset: int = Query(0, ge=0)):
    """Paginate los endpoint. Returns log records."""
    conn = await asyncpg.connect(POSTGRES_DSN)

    try:
        rows = await conn.fetch(
            "SELECT id, EXTRACT(EPOCH FROM timestamp) AS timestamp, ip, data "
            "FROM logs "
            "ORDER BY timestamp ASC "
            "LIMIT $1 OFFSET $2",
            size,
            offset,
        )

        logs = [
            LogItem(
                id=row["id"],
                timestamp=int(row["timestamp"]),
                ip=row["ip"],
                data=row["data"],
            )
            for row in rows
        ]

        return logs

    finally:
        await conn.close()
