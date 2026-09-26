from pydantic import BaseModel, ConfigDict


class GoogleAuthRequest(BaseModel):
    """Payload sent by the frontend containing the Google ID token."""
    id_token: str


class UserResponse(BaseModel):
    """User response object returned after successful authentication."""
    id: int
    name: str
    email: str
    role: str
    auth_provider: str = "email"

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    """JWT response structure returned by StockSense authentication endpoints."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
