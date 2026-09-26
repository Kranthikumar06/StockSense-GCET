from pydantic import BaseModel, ConfigDict, EmailStr


class GoogleAuthRequest(BaseModel):
    """Payload sent by the frontend containing the Google ID token."""
    id_token: str


class UserResponse(BaseModel):
    """User response object returned after successful authentication."""
    id: int
    name: str
    email: EmailStr
    role: str
    auth_provider: str

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    """JWT response structure returned by StockSense authentication endpoints."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
