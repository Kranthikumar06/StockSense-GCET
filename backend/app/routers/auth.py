from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import GoogleAuthRequest, TokenResponse
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    verify_google_token,
)
from app.services.auth_service import get_or_create_google_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    if user_data.password != user_data.re_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )

    # Check duplicate name
    existing_name = db.query(User).filter(
        or_(User.name == user_data.name, User.login_id == user_data.name)
    ).first()
    if existing_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name is already registered in the database."
        )

    # Check duplicate email
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email ID is already registered in the database."
        )

    hashed_pwd = hash_password(user_data.password)
    new_user = User(
        login_id=user_data.name,
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_pwd,
        role="staff",
        auth_provider="email"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=TokenResponse)
def login(login_data: dict, db: Session = Depends(get_db)):
    identifier = login_data.get("email") or login_data.get("identifier") or login_data.get("name")
    password = login_data.get("password")

    if not identifier or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email/Name and password are required."
        )

    user = db.query(User).filter(
        or_(User.email == identifier, User.name == identifier, User.login_id == identifier)
    ).first()

    if not user or not user.password_hash or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please check your email/name and password."
        )

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


@router.post("/google", response_model=TokenResponse)
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)) -> TokenResponse:
    if not payload.id_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="id_token is required.",
        )

    id_info = verify_google_token(payload.id_token)
    email: str = id_info.get("email", "")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google token does not contain a valid email address.",
        )

    name: str = id_info.get("name", email.split("@")[0])
    user = get_or_create_google_user(db=db, email=email, name=name)

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
