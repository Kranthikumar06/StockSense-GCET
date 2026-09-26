from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db, Base, engine
import app.models  # load all models into Base.metadata
from app.routers.auth import router as auth_router, google_auth
from app.routers.dashboard import router as dashboard_router
from app.routers.products import router as products_router
from app.routers.operations import router as operations_router
from app.routers.categories import router as categories_router
from app.routers.reordering_rules import router as reordering_rules_router
from app.routers.stock_moves import router as stock_moves_router
from app.routers.warehouses import router as warehouses_router
from app.schemas.auth import TokenResponse

# Create tables in Neon PostgreSQL database
Base.metadata.create_all(bind=engine)

# Safely migrate existing users table schema in Neon
try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR DEFAULT 'email';"))
        conn.execute(text("ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;"))
        conn.commit()
except Exception as e:
    print(f"Database schema check notice: {e}")

app = FastAPI(title="StockSense API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include main routers
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(products_router)
app.include_router(operations_router)
app.include_router(categories_router)
app.include_router(reordering_rules_router)
app.include_router(stock_moves_router)
app.include_router(warehouses_router)

# Alias route to handle both /auth/google and /api/auth/google
app.post("/auth/google", response_model=TokenResponse, tags=["Auth"])(google_auth)


@app.get("/")
def read_root():
    return {"message": "StockSense API is running"}


@app.get("/health/db")
def check_db_connection(db: Session = Depends(get_db)):
    """Quick check that the app can actually reach Neon."""
    try:
        db.execute(text("SELECT 1"))
        return {"status": "connected to Neon Postgres"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}