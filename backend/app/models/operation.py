from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base


class Operation(Base):
    __tablename__ = "operations"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String, unique=True, index=True, nullable=False)  # e.g. WH/IN/0001
    type = Column(String, nullable=False, index=True)  # "receipt" | "delivery" | "internal" | "adjustment"
    supplier_or_customer = Column(String, nullable=True)
    product_name = Column(String, nullable=True)
    sku = Column(String, nullable=True, index=True)
    quantity = Column(Float, nullable=False, default=0.0)
    quantity_done = Column(Float, nullable=False, default=0.0)
    unit_of_measure = Column(String, nullable=False, default="pcs")
    from_location = Column(String, nullable=True)
    to_location = Column(String, nullable=True)
    po_or_bol_ref = Column(String, nullable=True)
    status = Column(String, nullable=False, default="draft", index=True)  # "draft" | "waiting" | "ready" | "done" | "canceled"
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    validated_at = Column(DateTime(timezone=True), nullable=True)
