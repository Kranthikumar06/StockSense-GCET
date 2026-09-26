from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.models.product import Product
from app.models.warehouse import Warehouse
from app.models.location import Location
from app.models.category import Category
from app.models.stock import StockQuant, StockMove
from app.schemas.dashboard import (
    DashboardSummary,
    LowStockItem,
    RecentActivityItem,
    CategoryBreakdownItem,
)


from app.models.operation import Operation


def get_dashboard_summary(
    db: Session,
    warehouse_id: Optional[int] = None,
    category_id: Optional[int] = None,
) -> DashboardSummary:
    prod_query = db.query(Product).filter(Product.is_active == True)
    if category_id:
        prod_query = prod_query.filter(Product.category_id == category_id)
    total_products = prod_query.count()

    total_warehouses = db.query(Warehouse).count()

    loc_query = db.query(Location).filter(Location.type == "internal")
    if warehouse_id:
        loc_query = loc_query.filter(Location.warehouse_id == warehouse_id)
    total_internal_locations = loc_query.count()

    # Sum of stock quantity across internal locations
    stock_query = (
        db.query(
            func.coalesce(func.sum(StockQuant.quantity), 0.0).label("total_qty"),
            func.coalesce(func.sum(StockQuant.quantity * Product.per_unit_cost), 0.0).label("total_val"),
        )
        .join(Product, StockQuant.product_id == Product.id)
        .join(Location, StockQuant.location_id == Location.id)
        .filter(Location.type == "internal")
    )
    if warehouse_id:
        stock_query = stock_query.filter(Location.warehouse_id == warehouse_id)
    if category_id:
        stock_query = stock_query.filter(Product.category_id == category_id)

    stock_res = stock_query.first()
    total_stock_qty = float(stock_res.total_qty) if stock_res else 0.0
    total_inv_val = float(stock_res.total_val) if stock_res else 0.0

    # Low stock count
    low_stock_query = (
        db.query(StockQuant)
        .join(Product, StockQuant.product_id == Product.id)
        .join(Location, StockQuant.location_id == Location.id)
        .filter(Location.type == "internal")
        .filter(StockQuant.quantity <= StockQuant.min_reorder_level)
    )
    if warehouse_id:
        low_stock_query = low_stock_query.filter(Location.warehouse_id == warehouse_id)
    if category_id:
        low_stock_query = low_stock_query.filter(Product.category_id == category_id)
    low_stock_count = low_stock_query.count()

    # Pending operations count by type
    pending_receipts = db.query(Operation).filter(
        Operation.type == "receipt",
        Operation.status.in_(["draft", "waiting", "ready"])
    ).count()

    pending_deliveries = db.query(Operation).filter(
        Operation.type == "delivery",
        Operation.status.in_(["draft", "waiting", "ready"])
    ).count()

    pending_transfers = db.query(Operation).filter(
        Operation.type == "internal",
        Operation.status.in_(["draft", "waiting", "ready"])
    ).count()

    total_pending = pending_receipts + pending_deliveries + pending_transfers

    return DashboardSummary(
        total_products=total_products,
        total_warehouses=total_warehouses,
        total_internal_locations=total_internal_locations,
        total_stock_quantity=total_stock_qty,
        total_inventory_value=round(total_inv_val, 2),
        low_stock_count=low_stock_count,
        pending_operations_count=total_pending,
        pending_receipts_count=pending_receipts,
        pending_deliveries_count=pending_deliveries,
        pending_transfers_count=pending_transfers,
    )


def get_low_stock_alerts(db: Session, limit: int = 20):
    results = (
        db.query(
            Product.id.label("product_id"),
            Product.name.label("product_name"),
            Product.sku.label("sku"),
            Location.name.label("location_name"),
            StockQuant.quantity.label("current_quantity"),
            StockQuant.min_reorder_level.label("min_reorder_level"),
        )
        .join(StockQuant, Product.id == StockQuant.product_id)
        .join(Location, StockQuant.location_id == Location.id)
        .filter(Location.type == "internal")
        .filter(StockQuant.quantity <= StockQuant.min_reorder_level)
        .limit(limit)
        .all()
    )

    return [
        LowStockItem(
            product_id=r.product_id,
            product_name=r.product_name,
            sku=r.sku,
            location_name=r.location_name,
            current_quantity=r.current_quantity,
            min_reorder_level=r.min_reorder_level,
        )
        for r in results
    ]


def get_recent_activities(db: Session, limit: int = 10):
    moves = db.query(StockMove).order_by(StockMove.created_at.desc()).limit(limit).all()

    items = []
    for move in moves:
        product_name = move.product.name if move.product else "Unknown Product"
        from_loc_name = move.from_location.name if move.from_location else "External / Supplier"
        to_loc_name = move.to_location.name if move.to_location else "Customer / Scrapped"

        items.append(
            RecentActivityItem(
                id=move.id,
                reference=move.reference,
                product_name=product_name,
                from_location_name=from_loc_name,
                to_location_name=to_loc_name,
                quantity=move.quantity,
                status=move.status,
                created_at=move.created_at,
            )
        )

    return items


def get_category_breakdown(db: Session):
    results = (
        db.query(
            Category.id.label("category_id"),
            Category.name.label("category_name"),
            func.count(Product.id.distinct()).label("product_count"),
            func.coalesce(func.sum(StockQuant.quantity), 0.0).label("total_quantity"),
            func.coalesce(func.sum(StockQuant.quantity * Product.per_unit_cost), 0.0).label("total_value"),
        )
        .outerjoin(Product, Category.id == Product.category_id)
        .outerjoin(StockQuant, Product.id == StockQuant.product_id)
        .group_by(Category.id, Category.name)
        .all()
    )

    return [
        CategoryBreakdownItem(
            category_id=r.category_id,
            category_name=r.category_name,
            product_count=r.product_count,
            total_quantity=float(r.total_quantity),
            total_value=round(float(r.total_value), 2),
        )
        for r in results
    ]
