from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class OperationLineBase(BaseModel):
    product_id: int
    quantity_demand: float
    quantity_done: float = 0.0


class OperationLineCreate(OperationLineBase):
    pass


class OperationLineResponse(OperationLineBase):
    id: int
    product_name: Optional[str] = None
    product_sku: Optional[str] = None
    unit_of_measure: Optional[str] = "pcs"

    model_config = ConfigDict(from_attributes=True)


class OperationBase(BaseModel):
    reference: str
    type: str  # "receipt" | "delivery" | "internal" | "adjustment"
    from_location_id: Optional[int] = None
    to_location_id: Optional[int] = None
    contact_name: Optional[str] = None
    schedule_date: Optional[datetime] = None
    status: str = "draft"  # "draft" | "waiting" | "ready" | "done" | "canceled"


class OperationCreate(BaseModel):
    type: str  # "receipt" | "delivery" | "internal" | "adjustment"
    supplier_or_customer: Optional[str] = None
    product_id: Optional[int] = None
    product_name: Optional[str] = None
    sku: Optional[str] = None
    quantity: float = 1.0
    unit_of_measure: str = "pcs"
    from_location: Optional[str] = None
    to_location: Optional[str] = None
    po_or_bol_ref: Optional[str] = None


class OperationUpdate(BaseModel):
    status: Optional[str] = None
    schedule_date: Optional[datetime] = None


class OperationResponse(BaseModel):
    id: int
    reference: str
    type: str
    supplier_or_customer: Optional[str] = None
    product_name: Optional[str] = None
    sku: Optional[str] = None
    quantity: float = 0.0
    quantity_done: float = 0.0
    unit_of_measure: str = "pcs"
    from_location: Optional[str] = None
    to_location: Optional[str] = None
    po_or_bol_ref: Optional[str] = None
    status: str
    created_at: datetime
    validated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
