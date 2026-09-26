from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, UniqueConstraint, func
from sqlalchemy.orm import relationship
from app.database import Base


class StockQuantity(Base):
    __tablename__ = "stock_quantities"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    location_id = Column(Integer, ForeignKey("locations.id", ondelete="CASCADE"), nullable=False, index=True)
    on_hand = Column(Float, nullable=False, default=0.0)
    reserved = Column(Float, nullable=False, default=0.0)
    free_to_use = Column(Float, nullable=False, default=0.0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("product_id", "location_id", name="uq_stock_quantities_product_location"),
    )

    product = relationship("Product", backref="stock_quantities")
    location = relationship("Location", backref="stock_quantities")
