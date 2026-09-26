from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class OperationLine(Base):
    __tablename__ = "operation_lines"

    id = Column(Integer, primary_key=True, index=True)
    operation_id = Column(Integer, ForeignKey("operations.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="RESTRICT"), nullable=False, index=True)
    quantity_planned = Column(Float, nullable=False, default=0.0)
    quantity_done = Column(Float, nullable=True)  # filled at validation

    operation = relationship("Operation", back_populates="lines")
    product = relationship("Product")
