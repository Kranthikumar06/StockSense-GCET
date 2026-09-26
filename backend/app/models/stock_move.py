from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base


class StockMove(Base):
    __tablename__ = "stock_moves"

    id = Column(Integer, primary_key=True, index=True)
    operation_id = Column(Integer, ForeignKey("operations.id", ondelete="SET NULL"), nullable=True, index=True)
    operation_line_id = Column(Integer, ForeignKey("operation_lines.id", ondelete="SET NULL"), nullable=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="RESTRICT"), nullable=False, index=True)
    from_location_id = Column(Integer, ForeignKey("locations.id", ondelete="RESTRICT"), nullable=True, index=True)
    to_location_id = Column(Integer, ForeignKey("locations.id", ondelete="RESTRICT"), nullable=True, index=True)
    quantity = Column(Float, nullable=False)
    moved_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

    operation = relationship("Operation", back_populates="stock_moves")
    operation_line = relationship("OperationLine")
    product = relationship("Product")
    from_location = relationship("Location", foreign_keys=[from_location_id])
    to_location = relationship("Location", foreign_keys=[to_location_id])
