from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from fastapi import HTTPException, status

from app.models.product import Product
from app.models.category import Category
from app.models.stock import StockQuant
from app.models.location import Location
from app.models.warehouse import Warehouse
from app.models.operation import Operation
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    CategoryInfo,
    LocationStockInfo,
    ProductStockAdjust,
)


def _get_product_stock_details(db: Session, product_id: int, product_sku: str, product_name: str):
    # Total on-hand quantity
    total_qty = db.query(func.coalesce(func.sum(StockQuant.quantity), 0.0))\
        .filter(StockQuant.product_id == product_id).scalar() or 0.0
    total_qty = float(total_qty)

    # Reserved quantity: sum of outgoing pending deliveries
    reserved_qty = db.query(func.coalesce(func.sum(Operation.quantity), 0.0))\
        .filter(
            Operation.type == "delivery",
            Operation.status.in_(["draft", "waiting", "ready"]),
            or_(Operation.sku == product_sku, Operation.product_name.ilike(product_name))
        ).scalar() or 0.0
    reserved_qty = float(reserved_qty)
    free_to_use = max(0.0, total_qty - reserved_qty)

    # Location breakdown
    location_quants = (
        db.query(
            StockQuant.location_id,
            Location.name.label("location_name"),
            Warehouse.name.label("warehouse_name"),
            StockQuant.quantity,
            StockQuant.min_reorder_level,
        )
        .join(Location, StockQuant.location_id == Location.id)
        .outerjoin(Warehouse, Location.warehouse_id == Warehouse.id)
        .filter(StockQuant.product_id == product_id)
        .all()
    )

    location_stocks = [
        LocationStockInfo(
            location_id=q.location_id,
            location_name=q.location_name,
            warehouse_name=q.warehouse_name or "Main Warehouse",
            quantity=q.quantity,
            min_reorder_level=q.min_reorder_level,
        )
        for q in location_quants
    ]

    return total_qty, reserved_qty, free_to_use, location_stocks


def get_products(
    db: Session,
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    is_active: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100
) -> List[ProductResponse]:
    query = db.query(Product)

    if is_active is not None:
        query = query.filter(Product.is_active == is_active)

    if category_id is not None:
        query = query.filter(Product.category_id == category_id)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_pattern),
                Product.sku.ilike(search_pattern)
            )
        )

    products = query.order_by(Product.name.asc()).offset(skip).limit(limit).all()

    result = []
    for p in products:
        total_qty, reserved_qty, free_to_use, location_stocks = _get_product_stock_details(
            db, p.id, p.sku, p.name
        )
        cat_info = CategoryInfo(id=p.category.id, name=p.category.name) if p.category else None
        res = ProductResponse(
            id=p.id,
            name=p.name,
            sku=p.sku,
            category_id=p.category_id,
            unit_of_measure=p.unit_of_measure,
            per_unit_cost=p.per_unit_cost,
            is_active=p.is_active,
            created_at=p.created_at,
            category=cat_info,
            total_quantity=total_qty,
            reserved_quantity=reserved_qty,
            free_to_use_quantity=free_to_use,
            location_stocks=location_stocks,
        )
        result.append(res)

    return result


def get_product_by_id(db: Session, product_id: int) -> ProductResponse:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found."
        )

    total_qty, reserved_qty, free_to_use, location_stocks = _get_product_stock_details(
        db, product.id, product.sku, product.name
    )
    cat_info = CategoryInfo(id=product.category.id, name=product.category.name) if product.category else None

    return ProductResponse(
        id=product.id,
        name=product.name,
        sku=product.sku,
        category_id=product.category_id,
        unit_of_measure=product.unit_of_measure,
        per_unit_cost=product.per_unit_cost,
        is_active=product.is_active,
        created_at=product.created_at,
        category=cat_info,
        total_quantity=total_qty,
        reserved_quantity=reserved_qty,
        free_to_use_quantity=free_to_use,
        location_stocks=location_stocks,
    )


def create_product(db: Session, product_in: ProductCreate) -> ProductResponse:
    # Check if SKU already exists
    existing_sku = db.query(Product).filter(Product.sku.ilike(product_in.sku.strip())).first()
    if existing_sku:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product with SKU '{product_in.sku}' already exists."
        )

    # Check category validity if category_id provided
    if product_in.category_id:
        category = db.query(Category).filter(Category.id == product_in.category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with ID {product_in.category_id} does not exist."
            )

    new_product = Product(
        name=product_in.name.strip(),
        sku=product_in.sku.strip(),
        category_id=product_in.category_id,
        unit_of_measure=product_in.unit_of_measure,
        per_unit_cost=product_in.per_unit_cost,
        is_active=product_in.is_active
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return get_product_by_id(db, new_product.id)


def update_product(db: Session, product_id: int, product_in: ProductUpdate) -> ProductResponse:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found."
        )

    if product_in.sku is not None and product_in.sku.strip() != product.sku:
        existing_sku = db.query(Product).filter(
            Product.sku.ilike(product_in.sku.strip()),
            Product.id != product_id
        ).first()
        if existing_sku:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product with SKU '{product_in.sku}' already exists."
            )
        product.sku = product_in.sku.strip()

    if product_in.category_id is not None:
        if product_in.category_id > 0:
            category = db.query(Category).filter(Category.id == product_in.category_id).first()
            if not category:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Category with ID {product_in.category_id} does not exist."
                )
            product.category_id = product_in.category_id
        else:
            product.category_id = None

    if product_in.name is not None:
        product.name = product_in.name.strip()
    if product_in.unit_of_measure is not None:
        product.unit_of_measure = product_in.unit_of_measure
    if product_in.per_unit_cost is not None:
        product.per_unit_cost = product_in.per_unit_cost
    if product_in.is_active is not None:
        product.is_active = product_in.is_active

    db.commit()
    db.refresh(product)

    return get_product_by_id(db, product.id)


def delete_product(db: Session, product_id: int, hard_delete: bool = False) -> dict:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found."
        )

    if hard_delete:
        db.delete(product)
        db.commit()
        return {"message": f"Product with ID {product_id} permanently deleted."}
    else:
        product.is_active = False
        db.commit()
        return {"message": f"Product with ID {product_id} deactivated."}


def adjust_product_stock(
    db: Session,
    product_id: int,
    location_id: Optional[int],
    new_quantity: float
) -> ProductResponse:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found."
        )

    target_location_id = location_id
    if not target_location_id:
        loc = db.query(Location).filter(Location.type == "internal").first()
        if not loc:
            loc = Location(name="Main Stock Bay", code="WH-STOCK", type="internal")
            db.add(loc)
            db.commit()
            db.refresh(loc)
        target_location_id = loc.id

    quant = db.query(StockQuant).filter(
        StockQuant.product_id == product_id,
        StockQuant.location_id == target_location_id
    ).first()

    if quant:
        quant.quantity = max(0.0, float(new_quantity))
    else:
        quant = StockQuant(
            product_id=product_id,
            location_id=target_location_id,
            quantity=max(0.0, float(new_quantity))
        )
        db.add(quant)

    db.commit()
    return get_product_by_id(db, product_id)
