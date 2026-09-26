from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class StockMoveResponse(BaseModel):
    id: int
    reference: str
    product_id: int
    product_name: str
    sku: str
    from_location_name: Optional[str] = None
    to_location_name: Optional[str] = None
    quantity: float
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
