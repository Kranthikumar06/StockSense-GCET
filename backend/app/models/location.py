from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    short_code = Column(String, nullable=True)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id", ondelete="CASCADE"), nullable=True, index=True)
    type = Column(String, nullable=False, default="internal")  # "internal" | "vendor" | "customer"
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    warehouse = relationship("Warehouse", back_populates="locations")
