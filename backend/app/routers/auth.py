from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.core.security import hash_password

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    # 1. Password confirmation check
    if user_data.password != user_data.re_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )

    # 2. Check if Name / Login ID is duplicate
    existing_name = db.query(User).filter(
        or_(User.name == user_data.name, User.login_id == user_data.name)
    ).first()
    if existing_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name is already taken in the database. Please choose another."
        )

    # 3. Check if Email ID is duplicate
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email ID is already registered in the database."
        )

    # 4. Create new user record
    hashed_pwd = hash_password(user_data.password)
    new_user = User(
        login_id=user_data.name,
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_pwd,
        role="staff"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.get("/check-availability")
def check_availability(name: str = None, email: str = None, db: Session = Depends(get_db)):
    result = {}
    if name:
        exists = db.query(User).filter(
            or_(User.name == name, User.login_id == name)
        ).first() is not None
        result["name_available"] = not exists
    if email:
        exists = db.query(User).filter(User.email == email).first() is not None
        result["email_available"] = not exists
    return result
