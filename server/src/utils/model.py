"""Resposnse/Request models."""

from pydantic import BaseModel


class EncryptRequest(BaseModel):
    """
    Encrypt request model.
    """

    key: str
    data: str


class EncryptResponse(BaseModel):
    """
    Encrypt response model.
    """

    data: str


class DecryptRequest(BaseModel):
    """
    Decrypt request model.
    """

    key: str
    data: str


class DecryptResponse(BaseModel):
    """
    Decrypt response model.
    """

    data: str


class LogItem(BaseModel):
    """
    Log item model.
    """

    id: str
    timestamp: int
    ip: str
    data: str


class Health(BaseModel):
    status: str
