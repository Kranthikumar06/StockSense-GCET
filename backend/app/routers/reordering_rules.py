from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.reordering_rule import ReorderingRule
from app.models.product import Product
from app.models.location import Location
from app.schemas.reordering_rule import (
    ReorderingRuleCreate,
    ReorderingRuleUpdate,
    ReorderingRuleResponse,
)

router = APIRouter(prefix="/api/reordering-rules", tags=["Reordering Rules"])


@router.get("", response_model=List[ReorderingRuleResponse])
def list_reordering_rules(
    product_id: Optional[int] = Query(None, description="Filter by product ID"),
    db: Session = Depends(get_db)
):
    """Retrieve reordering rules with optional product filter."""
    query = db.query(ReorderingRule)
    if product_id:
        query = query.filter(ReorderingRule.product_id == product_id)
    rules = query.order_by(ReorderingRule.id.desc()).all()

    results = []
    for r in rules:
        results.append(
            ReorderingRuleResponse(
                id=r.id,
                product_id=r.product_id,
                location_id=r.location_id,
                min_qty=r.min_qty,
                max_qty=r.max_qty,
                created_at=r.created_at,
                product_name=r.product.name if r.product else None,
                location_name=r.location.name if r.location else "All Locations",
            )
        )
    return results


@router.post("", response_model=ReorderingRuleResponse, status_code=status.HTTP_201_CREATED)
def create_reordering_rule(rule_in: ReorderingRuleCreate, db: Session = Depends(get_db)):
    """Create or update a reordering rule for a product and location."""
    product = db.query(Product).filter(Product.id == rule_in.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {rule_in.product_id} not found."
        )

    # Upsert logic if rule already exists for product + location
    existing = db.query(ReorderingRule).filter(
        ReorderingRule.product_id == rule_in.product_id,
        ReorderingRule.location_id == rule_in.location_id,
    ).first()

    if existing:
        existing.min_qty = rule_in.min_qty
        existing.max_qty = rule_in.max_qty
        db.commit()
        db.refresh(existing)
        rule = existing
    else:
        rule = ReorderingRule(
            product_id=rule_in.product_id,
            location_id=rule_in.location_id,
            min_qty=rule_in.min_qty,
            max_qty=rule_in.max_qty,
        )
        db.add(rule)
        db.commit()
        db.refresh(rule)

    return ReorderingRuleResponse(
        id=rule.id,
        product_id=rule.product_id,
        location_id=rule.location_id,
        min_qty=rule.min_qty,
        max_qty=rule.max_qty,
        created_at=rule.created_at,
        product_name=rule.product.name if rule.product else None,
        location_name=rule.location.name if rule.location else "All Locations",
    )


@router.put("/{rule_id}", response_model=ReorderingRuleResponse)
def update_reordering_rule(rule_id: int, rule_in: ReorderingRuleUpdate, db: Session = Depends(get_db)):
    """Update reordering rule thresholds."""
    rule = db.query(ReorderingRule).filter(ReorderingRule.id == rule_id).first()
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reordering rule with ID {rule_id} not found."
        )

    if rule_in.min_qty is not None:
        rule.min_qty = rule_in.min_qty
    if rule_in.max_qty is not None:
        rule.max_qty = rule_in.max_qty
    if rule_in.location_id is not None:
        rule.location_id = rule_in.location_id

    db.commit()
    db.refresh(rule)

    return ReorderingRuleResponse(
        id=rule.id,
        product_id=rule.product_id,
        location_id=rule.location_id,
        min_qty=rule.min_qty,
        max_qty=rule.max_qty,
        created_at=rule.created_at,
        product_name=rule.product.name if rule.product else None,
        location_name=rule.location.name if rule.location else "All Locations",
    )


@router.delete("/{rule_id}")
def delete_reordering_rule(rule_id: int, db: Session = Depends(get_db)):
    """Delete a reordering rule by ID."""
    rule = db.query(ReorderingRule).filter(ReorderingRule.id == rule_id).first()
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reordering rule with ID {rule_id} not found."
        )

    db.delete(rule)
    db.commit()
    return {"message": f"Reordering rule {rule_id} deleted successfully."}
