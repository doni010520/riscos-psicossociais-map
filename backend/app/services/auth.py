from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import os

SECRET_KEY = os.getenv("JWT_SECRET", "a3f8d9c2e1b4567890abcdef1234567890abcdef1234567890abcdef12345678")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

def decode_access_token(token: str) -> Optional[dict]:
    """Decodifica e valida token JWT"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
