"""Logging configuration module."""

import logging
from datetime import datetime
from typing import Optional
import asyncio

import asyncpg  # type: ignore
from attrs import define, field


@define
class AsyncPostgresHandler(logging.Handler):
    """
    Logger handler that writes log records into Postgres table.
    """

    dsn: str
    task: Optional[asyncio.Task] = field(default=None)
    table: Optional[str] = field(default="logs")
    loop: Optional[asyncio.EventLoop] = field(default=asyncio.get_event_loop())  # type: ignore
    queue: Optional[asyncio.Queue] = field(default=asyncio.Queue())

    def __attrs_post_init__(self):
        super().__init__()
        self.task = self.loop.create_task(self._log_worker())

    async def _ensure_table(self, conn: asyncpg.connection) -> None:
        """
        Ensures the table exists within the database.
        """
        await conn.execute(
            f"""
            CREATE TABLE IF NOT EXISTS {self.table} (
                id TEXT PRIMARY KEY,
                timestamp TIMESTAMPTZ NOT NULL,
                ip TEXT,
                data TEXT
            )
        """
        )

    async def _log_worker(self) -> None:
        """
        Ingest and processes the logs from the queue.
        """
        conn = await asyncpg.connect(self.dsn)
        await self._ensure_table(conn)

        try:
            while True:
                record = await self.queue.get()  # type: ignore
                if record is None:
                    break

                log_id = getattr(record, "id", None)
                ts = getattr(record, "timestamp", datetime.utcnow())
                ip = getattr(record, "ip", None)
                data = getattr(record, "data", record.getMessage())

                await conn.execute(
                    f"INSERT INTO {self.table} (id, timestamp, ip, data) VALUES ($1, $2, $3, $4) "
                    f"ON CONFLICT (id) DO NOTHING",
                    log_id,
                    ts,
                    ip,
                    data,
                )
        finally:
            await conn.close()

    def emit(self, record: logging.LogRecord):
        """
        Called by the logging framework (sync).
        """
        try:
            self.queue.put_nowait(record)  # type: ignore
        except Exception as _:  # pylint: disable=W0718
            self.handleError(record)

    async def shutdown(self):
        """Gracefully stop the worker and flush logs."""
        await self.queue.put(None)  # type: ignore
        await self.task


@define
class LoggerFactory:
    """
    A factory for creating structured or colored loggers.
    """

    level: int = logging.INFO

    def setup_logger(
        self, name: Optional[str], postgres_dsn: Optional[str]
    ) -> logging.Logger:
        """
        Sets up a logger with the specified name. The logger is configured to log
        messages at the DEBUG level and outputs to the console with a colored format.

        Args:
            name (str): The name of the logger.

        Returns:
            logging.Logger: The configured logger instance.
        """
        logger = logging.getLogger(name)
        logger.setLevel(self.level)

        if not logger.hasHandlers() and postgres_dsn:
            pg_handler = AsyncPostgresHandler(postgres_dsn)
            formatter = logging.Formatter("%(message)s")
            pg_handler.setFormatter(formatter)
            logger.addHandler(pg_handler)

        return logger


logger_factory = LoggerFactory()
