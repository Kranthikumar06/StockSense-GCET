from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base


class Operation(Base):
    __tablename__ = "operations"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String, unique=True, index=True, nullable=False)  # e.g. WH/IN/0001
    type = Column(String, nullable=False, index=True)  # "receipt" | "delivery" | "internal" | "adjustment"
    from_location_id = Column(Integer, ForeignKey("locations.id", ondelete="SET NULL"), nullable=True, index=True)
    to_location_id = Column(Integer, ForeignKey("locations.id", ondelete="SET NULL"), nullable=True, index=True)
    contact_id = Column(Integer, ForeignKey("contacts.id", ondelete="SET NULL"), nullable=True, index=True)  # null for internal/adjustment
    responsible_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    schedule_date = Column(DateTime(timezone=True), nullable=True, index=True)
    status = Column(String, nullable=False, default="draft", index=True)  # "draft" | "waiting" | "ready" | "done" | "canceled"
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    validated_at = Column(DateTime(timezone=True), nullable=True)

    from_location = relationship("Location", foreign_keys=[from_location_id])
    to_location = relationship("Location", foreign_keys=[to_location_id])
    contact = relationship("Contact")
    responsible_user = relationship("User")

    lines = relationship("OperationLine", back_populates="operation", cascade="all, delete-orphan")
    stock_moves = relationship("StockMove", back_populates="operation")
