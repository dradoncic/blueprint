"""Encryption Handler"""

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes


async def encrypt(key: str, data: str) -> str:
    """
    Encrypts incoming data with the public key.
    """
    public_key = serialization.load_pem_public_key(key.encode("utf-8"))

    encrypted = public_key.encrypt(
        data.encode("utf-8"),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None,
        ),
    )

    return encrypted.hex()


async def decrypt(key: str, data: str) -> str:
    """
    Encrypts incoming data with the public key.
    """
    private_key = serialization.load_pem_private_key(key.encode("utf-8"), password=None)

    decrypted = private_key.decrypt(
        bytes.fromhex(data),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None,
        ),
    )

    return decrypted.decode("utf-8")
