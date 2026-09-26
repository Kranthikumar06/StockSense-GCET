from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.stock import StockMove
from app.schemas.stock_move import StockMoveResponse

router = APIRouter(prefix="/api/stock-moves", tags=["Stock Moves & Ledger"])


@router.get("", response_model=List[StockMoveResponse])
def list_stock_moves(
    search: Optional[str] = Query(None, description="Search reference, product, SKU"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """Retrieve immutable stock moves audit ledger feed."""
    query = db.query(StockMove)
    if search:
        pattern = f"%{search}%"
        query = query.filter(StockMove.reference.ilike(pattern))

    moves = query.order_by(StockMove.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for m in moves:
        prod_name = m.product.name if m.product else "General Item"
        sku = m.product.sku if m.product else "SKU-001"
        from_loc = m.from_location.name if m.from_location else "External Vendor / Intake"
        to_loc = m.to_location.name if m.to_location else "Internal Stock / Customer"

        result.append(
            StockMoveResponse(
                id=m.id,
                reference=m.reference,
                product_id=m.product_id,
                product_name=prod_name,
                sku=sku,
                from_location_name=from_loc,
                to_location_name=to_loc,
                quantity=m.quantity,
                status=m.status,
                created_at=m.created_at,
            )
        )

    return result
