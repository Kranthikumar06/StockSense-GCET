from sqlalchemy.orm import Session
from app.models.user import User


def get_or_create_google_user(db: Session, email: str, name: str) -> User:
    """Retrieve an existing user by email or register a new google-authenticated user.

    Args:
        db (Session): Database session.
        email (str): Verified email address from Google.
        name (str): Full name from Google token claims.

    Returns:
        User: SQLAlchemy User model instance.
    """
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user

    # Create new user record for google login
    new_user = User(
        email=email,
        name=name if name else email.split("@")[0],
        password_hash=None,
        role="staff",
        auth_provider="google",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
