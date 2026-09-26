from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
from jose import jwt
from google.oauth2 import id_token
from google.auth.transport import requests

from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, GOOGLE_CLIENT_ID


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Generate a signed JWT access token for authentication.

    Args:
        data (Dict[str, Any]): Claims to encode into the JWT payload.
        expires_delta (Optional[timedelta]): Optional expiration duration.

    Returns:
        str: Encoded JWT string.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_google_token(id_token_str: str) -> Dict[str, Any]:
    """Verify a Google OAuth2 ID token using Google's public certificates.

    Args:
        id_token_str (str): Google ID token string received from the frontend client.

    Returns:
        Dict[str, Any]: Verified claims dictionary containing user email, name, etc.

    Raises:
        HTTPException: 401 Unauthorized if verification fails or token is expired/invalid.
    """
    try:
        request = requests.Request()
        audience = GOOGLE_CLIENT_ID if GOOGLE_CLIENT_ID else None
        id_info = id_token.verify_oauth2_token(id_token_str, request, audience=audience)

        if id_info.get("iss") not in ["accounts.google.com", "https://accounts.google.com"]:
            raise ValueError("Invalid issuer.")

        return id_info
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Google token",
            headers={"WWW-Authenticate": "Bearer"},
        )
