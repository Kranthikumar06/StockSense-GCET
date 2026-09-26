from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime


class LocationBase(BaseModel):
    name: str
    code: Optional[str] = None
    type: str = "internal"
    warehouse_id: Optional[int] = None


class LocationCreate(LocationBase):
    pass


class LocationResponse(LocationBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WarehouseBase(BaseModel):
    name: str
    short_code: str
    address: Optional[str] = None


class WarehouseCreate(WarehouseBase):
    pass


class WarehouseUpdate(BaseModel):
    name: Optional[str] = None
    short_code: Optional[str] = None
    address: Optional[str] = None


class WarehouseResponse(WarehouseBase):
    id: int
    created_at: datetime
    locations: List[LocationResponse] = []

    model_config = ConfigDict(from_attributes=True)
