from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ReorderingRuleBase(BaseModel):
    product_id: int
    location_id: Optional[int] = None
    min_qty: float = 0.0
    max_qty: float = 0.0


class ReorderingRuleCreate(ReorderingRuleBase):
    pass


class ReorderingRuleUpdate(BaseModel):
    min_qty: Optional[float] = None
    max_qty: Optional[float] = None
    location_id: Optional[int] = None


class ReorderingRuleResponse(ReorderingRuleBase):
    id: int
    created_at: datetime
    product_name: Optional[str] = None
    location_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
