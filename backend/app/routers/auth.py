import random
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import (
    GoogleAuthRequest,
    TokenResponse,
    ForgotPasswordRequest,
    VerifyOTPRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
)
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

    assigned_role = user_data.role.lower() if user_data.role and user_data.role.lower() in ["manager", "staff"] else "staff"
    hashed_pwd = hash_password(user_data.password)
    new_user = User(
        login_id=user_data.name,
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_pwd,
        role=assigned_role,
        auth_provider="email"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from app.core.config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SENDER_EMAIL


def send_otp_email(to_email: str, otp_code: str):
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"[StockSense Mailer] SMTP credentials not set in .env. OTP for {to_email}: {otp_code}")
        return False

    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL or SMTP_USER
        msg['To'] = to_email
        msg['Subject'] = f"StockSense Password Reset OTP: {otp_code}"

        body = f"""Hello,

You requested a password reset for your StockSense Inventory System account.

Your 6-digit Verification OTP Code is: {otp_code}

This OTP is valid for 15 minutes. If you did not request this, please ignore this email.

Best regards,
StockSense Security Team
"""
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"[StockSense Mailer] OTP Email successfully sent to {to_email}")
        return True
    except Exception as e:
        print(f"[StockSense Mailer] Error sending email to {to_email}: {e}")
        return False


@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.strip()).first()
    if not user:
        return {"message": "If an account with that email exists, an OTP code has been generated.", "otp_sent": True}

    otp_code = f"{random.randint(100000, 999999)}"
    user.otp_code = otp_code
    user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
    db.commit()

    # Dispatch email sending background task
    background_tasks.add_task(send_otp_email, user.email, otp_code)

    return {
        "message": f"An OTP verification code has been sent to {user.email}.",
        "email": user.email,
        "expires_in_minutes": 15
    }


@router.post("/verify-otp")
def verify_otp(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.strip()).first()
    if not user or not user.otp_code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email or OTP request.")

    if user.otp_code != req.otp_code.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect OTP code.")

    if user.otp_expires_at:
        now = datetime.now(timezone.utc)
        expires = user.otp_expires_at if user.otp_expires_at.tzinfo else user.otp_expires_at.replace(tzinfo=timezone.utc)
        if now > expires:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP code has expired. Please request a new one.")

    return {"message": "OTP verified successfully.", "verified": True}


@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    if req.new_password != req.re_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match.")

    user = db.query(User).filter(User.email == req.email.strip()).first()
    if not user or not user.otp_code or user.otp_code != req.otp_code.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP code or request.")

    user.password_hash = hash_password(req.new_password)
    user.otp_code = None
    user.otp_expires_at = None
    db.commit()

    return {"message": "Password updated successfully. You can now login with your new password."}


@router.post("/change-password")
def change_password(req: ChangePasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user or not user.password_hash:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if not verify_password(req.current_password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect.")

    user.password_hash = hash_password(req.new_password)
    db.commit()

    return {"message": "Password updated successfully."}



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
