from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_products: int
    total_warehouses: int
    total_internal_locations: int
    total_stock_quantity: float
    total_inventory_value: float
    low_stock_count: int
    pending_operations_count: int
    pending_receipts_count: int = 0
    pending_deliveries_count: int = 0
    pending_transfers_count: int = 0


class LowStockItem(BaseModel):
    product_id: int
    product_name: str
    sku: str
    location_name: str
    current_quantity: float
    min_reorder_level: float


class RecentActivityItem(BaseModel):
    id: int
    reference: str
    product_name: str
    from_location_name: Optional[str] = None
    to_location_name: Optional[str] = None
    quantity: float
    status: str
    created_at: datetime


class CategoryBreakdownItem(BaseModel):
    category_id: Optional[int] = None
    category_name: str
    product_count: int
    total_quantity: float
    total_value: float
