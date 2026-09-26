from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db, Base, engine
import app.models  # load all models into Base.metadata

# Create tables in Neon PostgreSQL database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="StockSense API")


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