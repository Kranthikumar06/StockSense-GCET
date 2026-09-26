from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.dashboard import (
    DashboardSummary,
    LowStockItem,
    RecentActivityItem,
    CategoryBreakdownItem,
)
from app.services.dashboard_service import (
    get_dashboard_summary,
    get_low_stock_alerts,
    get_recent_activities,
    get_category_breakdown,
)

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardSummary)
def read_dashboard_stats(db: Session = Depends(get_db)):
    """Fetch aggregated top-level Dashboard KPIs (Total Products, Stock Qty, Valuation, Low Stock Count, Pending Ops)."""
    return get_dashboard_summary(db)


@router.get("/low-stock", response_model=List[LowStockItem])
def read_low_stock_alerts(limit: int = 20, db: Session = Depends(get_db)):
    """Fetch items currently below or near their minimum reorder threshold."""
    return get_low_stock_alerts(db, limit=limit)


@router.get("/recent-activity", response_model=List[RecentActivityItem])
def read_recent_activity(limit: int = 10, db: Session = Depends(get_db)):
    """Fetch top recent stock movement transactions."""
    return get_recent_activities(db, limit=limit)


@router.get("/category-breakdown", response_model=List[CategoryBreakdownItem])
def read_category_breakdown(db: Session = Depends(get_db)):
    """Fetch product count, stock quantity, and total valuation grouped by Category."""
    return get_category_breakdown(db)
