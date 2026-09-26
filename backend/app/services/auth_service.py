from sqlalchemy.orm import Session
from app.models.user import User


def get_or_create_google_user(db: Session, email: str, name: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user

    user_name = name if name else email.split("@")[0]
    new_user = User(
        login_id=user_name,
        name=user_name,
        email=email,
        password_hash=None,
        role="staff",
        auth_provider="google",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
