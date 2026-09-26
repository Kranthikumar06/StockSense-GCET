import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables from .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found. Check your .env file.")

# Neon uses "postgresql://" - SQLAlchemy with psycopg2 needs this exact prefix
# (Some tools output "postgres://" - convert it if needed)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Session factory - each request gets its own DB session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all ORM models (Product, Warehouse, StockMove, etc.)
Base = declarative_base()


# Dependency to inject a DB session into route functions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()