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


def get_dashboard_summary(db: Session) -> DashboardSummary:
    total_products = db.query(Product).filter(Product.is_active == True).count()
    total_warehouses = db.query(Warehouse).count()
    total_internal_locations = db.query(Location).filter(Location.type == "internal").count()

    # Sum of stock quantity across internal locations
    stock_internal_query = (
        db.query(
            func.coalesce(func.sum(StockQuant.quantity), 0.0).label("total_qty"),
            func.coalesce(func.sum(StockQuant.quantity * Product.per_unit_cost), 0.0).label("total_val"),
        )
        .join(Product, StockQuant.product_id == Product.id)
        .join(Location, StockQuant.location_id == Location.id)
        .filter(Location.type == "internal")
        .first()
    )

    total_stock_qty = float(stock_internal_query.total_qty) if stock_internal_query else 0.0
    total_inv_val = float(stock_internal_query.total_val) if stock_internal_query else 0.0

    # Low stock count
    low_stock_count = (
        db.query(StockQuant)
        .join(Location, StockQuant.location_id == Location.id)
        .filter(Location.type == "internal")
        .filter(StockQuant.quantity <= StockQuant.min_reorder_level)
        .count()
    )

    # Pending operations
    pending_count = db.query(StockMove).filter(StockMove.status == "draft").count()

    return DashboardSummary(
        total_products=total_products,
        total_warehouses=total_warehouses,
        total_internal_locations=total_internal_locations,
        total_stock_quantity=total_stock_qty,
        total_inventory_value=round(total_inv_val, 2),
        low_stock_count=low_stock_count,
        pending_operations_count=pending_count,
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
