from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime


class CategoryInfo(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class LocationStockInfo(BaseModel):
    location_id: int
    location_name: str
    warehouse_name: Optional[str] = None
    quantity: float = 0.0
    min_reorder_level: float = 0.0


class ProductStockAdjust(BaseModel):
    location_id: Optional[int] = None
    new_quantity: float


class ProductBase(BaseModel):
    name: str
    sku: str
    category_id: Optional[int] = None
    unit_of_measure: str = "pcs"
    per_unit_cost: float = 0.0
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    category_id: Optional[int] = None
    unit_of_measure: Optional[str] = None
    per_unit_cost: Optional[float] = None
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    category: Optional[CategoryInfo] = None
    total_quantity: float = 0.0
    reserved_quantity: float = 0.0
    free_to_use_quantity: float = 0.0
    location_stocks: List[LocationStockInfo] = []

    model_config = ConfigDict(from_attributes=True)
