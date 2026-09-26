from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, ProductStockAdjust
from app.services import product_service

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("", response_model=List[ProductResponse])
def list_products(
    search: Optional[str] = Query(None, description="Search by product name or SKU"),
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """
    Retrieve list of products with optional search, category filter, and total stock quantity.
    """
    return product_service.get_products(
        db=db,
        search=search,
        category_id=category_id,
        is_active=is_active,
        skip=skip,
        limit=limit
    )


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Retrieve single product details by ID.
    """
    return product_service.get_product_by_id(db=db, product_id=product_id)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    """
    Create a new product. SKU must be unique.
    """
    return product_service.create_product(db=db, product_in=product_in)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product_in: ProductUpdate, db: Session = Depends(get_db)):
    """
    Update an existing product by ID.
    """
    return product_service.update_product(db=db, product_id=product_id, product_in=product_in)


@router.post("/{product_id}/adjust-stock", response_model=ProductResponse)
def adjust_stock(product_id: int, adjust_in: ProductStockAdjust, db: Session = Depends(get_db)):
    """
    Manually update inventory stock quantity for a product at a specific location.
    """
    return product_service.adjust_product_stock(
        db=db,
        product_id=product_id,
        location_id=adjust_in.location_id,
        new_quantity=adjust_in.new_quantity
    )


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    hard_delete: bool = Query(False, description="Set to true to permanently delete from DB"),
    db: Session = Depends(get_db)
):
    """
    Delete product (defaults to soft delete by setting is_active=False).
    """
    return product_service.delete_product(db=db, product_id=product_id, hard_delete=hard_delete)
