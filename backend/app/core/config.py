import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

SECRET_KEY: str = os.getenv("SECRET_KEY", "stocksense_default_jwt_secret_key_change_in_production")
ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
