from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import GoogleAuthRequest, TokenResponse, UserResponse
from app.core.security import verify_google_token, create_access_token
from app.services.auth_service import get_or_create_google_user

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/google", response_model=TokenResponse)
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)) -> TokenResponse:
    """Authenticate or register a user using a verified Google OAuth2 ID token.

    Args:
        payload (GoogleAuthRequest): Pydantic request body containing Google id_token.
        db (Session): SQLAlchemy database session.

    Returns:
        TokenResponse: StockSense JWT access token and user profile details.
    """
    if not payload.id_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="id_token is required.",
        )

    # Verify ID Token with Google's public certificates
    id_info = verify_google_token(payload.id_token)

    email: str = id_info.get("email", "")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google token does not contain a valid email address.",
        )

    name: str = id_info.get("name", email.split("@")[0])

    # Retrieve or register user in Postgres database
    user = get_or_create_google_user(db=db, email=email, name=name)

    # Issue StockSense JWT token
    token_payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
    }
    access_token = create_access_token(data=token_payload)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )
