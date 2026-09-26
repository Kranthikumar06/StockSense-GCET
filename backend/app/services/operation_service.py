import random
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status

from app.models.operation import Operation
from app.models.product import Product
from app.models.stock import StockQuant, StockMove
from app.models.warehouse import Warehouse
from app.models.location import Location
from app.schemas.operation import OperationCreate, OperationResponse


def get_or_create_default_location(db: Session) -> Location:
    loc = db.query(Location).first()
    if loc:
        return loc

    # Create default warehouse
    wh = db.query(Warehouse).first()
    if not wh:
        wh = Warehouse(
            name="Main Distribution Center",
            short_code="WH-MAIN",
            address="Building 1, Industrial Hub"
        )
        db.add(wh)
        db.commit()
        db.refresh(wh)

    loc = Location(
        name="Main Store Bay A",
        short_code="BAY-A",
        warehouse_id=wh.id,
        type="internal"
    )
    db.add(loc)
    db.commit()
    db.refresh(loc)
    return loc


def generate_reference(op_type: str) -> str:
    num = random.randint(1000, 9999)
    if op_type.lower() == 'receipt':
        return f"WH/IN/{num}"
    elif op_type.lower() == 'delivery':
        return f"WH/OUT/{num}"
    elif op_type.lower() == 'internal':
        return f"WH/INT/{num}"
    else:
        return f"WH/ADJ/{num}"


def get_operations(
    db: Session,
    type_filter: Optional[str] = None,
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[OperationResponse]:
    query = db.query(Operation)

    if type_filter and type_filter != 'All':
        query = query.filter(Operation.type.ilike(type_filter.strip()))

    if status_filter and status_filter != 'All':
        query = query.filter(Operation.status.ilike(status_filter.strip()))

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Operation.reference.ilike(pattern),
                Operation.supplier_or_customer.ilike(pattern),
                Operation.product_name.ilike(pattern),
                Operation.sku.ilike(pattern),
                Operation.po_or_bol_ref.ilike(pattern)
            )
        )

    ops = query.order_by(Operation.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for op in ops:
        result.append(OperationResponse(
            id=op.id,
            reference=op.reference,
            type=op.type,
            supplier_or_customer=op.supplier_or_customer,
            product_name=op.product_name,
            sku=op.sku,
            quantity=op.quantity,
            quantity_done=op.quantity_done,
            unit_of_measure=op.unit_of_measure or "pcs",
            from_location=op.from_location,
            to_location=op.to_location,
            po_or_bol_ref=op.po_or_bol_ref,
            status=op.status,
            created_at=op.created_at,
            validated_at=op.validated_at
        ))

    return result


def get_operation_by_id(db: Session, op_id: int) -> OperationResponse:
    op = db.query(Operation).filter(Operation.id == op_id).first()
    if not op:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Operation with ID {op_id} not found."
        )

    return OperationResponse(
        id=op.id,
        reference=op.reference,
        type=op.type,
        supplier_or_customer=op.supplier_or_customer,
        product_name=op.product_name,
        sku=op.sku,
        quantity=op.quantity,
        quantity_done=op.quantity_done,
        unit_of_measure=op.unit_of_measure or "pcs",
        from_location=op.from_location,
        to_location=op.to_location,
        po_or_bol_ref=op.po_or_bol_ref,
        status=op.status,
        created_at=op.created_at,
        validated_at=op.validated_at
    )


def create_operation(db: Session, op_in: OperationCreate) -> OperationResponse:
    op_type = op_in.type.lower()
    ref = generate_reference(op_type)

    product_name = op_in.product_name or "General Item"
    product_sku = op_in.sku or f"SKU-{random.randint(1000, 9999)}"

    if op_in.sku:
        existing_prd = db.query(Product).filter(Product.sku.ilike(op_in.sku.strip())).first()
        if existing_prd:
            product_name = existing_prd.name
            product_sku = existing_prd.sku
        else:
            new_prd = Product(
                name=product_name,
                sku=product_sku,
                unit_of_measure=op_in.unit_of_measure,
                per_unit_cost=10.0,
                is_active=True
            )
            db.add(new_prd)
            db.commit()
            db.refresh(new_prd)

    from_loc = op_in.from_location or ("Vendor Location" if op_type == "receipt" else "Main Warehouse")
    to_loc = op_in.to_location or ("Main Warehouse" if op_type == "receipt" else "Customer Location")
    status_val = "ready" if op_type in ["receipt", "delivery"] else "draft"

    new_op = Operation(
        reference=ref,
        type=op_type,
        supplier_or_customer=op_in.supplier_or_customer,
        product_name=product_name,
        sku=product_sku,
        quantity=op_in.quantity,
        quantity_done=0.0,
        unit_of_measure=op_in.unit_of_measure,
        from_location=from_loc,
        to_location=to_loc,
        po_or_bol_ref=op_in.po_or_bol_ref or f"PO-2026-{random.randint(100, 999)}",
        status=status_val
    )

    db.add(new_op)
    db.commit()
    db.refresh(new_op)

    return get_operation_by_id(db, new_op.id)


def validate_operation(db: Session, op_id: int) -> OperationResponse:
    op = db.query(Operation).filter(Operation.id == op_id).first()
    if not op:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Operation with ID {op_id} not found."
        )

    if op.status == "done":
        return get_operation_by_id(db, op.id)

    # Ensure a valid default location exists in PostgreSQL
    default_loc = get_or_create_default_location(db)

    # Find product in DB or create fallback
    product = db.query(Product).filter(
        or_(Product.sku.ilike(op.sku), Product.name.ilike(op.product_name))
    ).first()

    if not product:
        product = Product(
            name=op.product_name or "General Item",
            sku=op.sku or f"SKU-{op.id}",
            unit_of_measure=op.unit_of_measure or "pcs",
            per_unit_cost=15.0,
            is_active=True
        )
        db.add(product)
        db.commit()
        db.refresh(product)

    # Find or create StockQuant for product
    quant = db.query(StockQuant).filter(
        StockQuant.product_id == product.id,
        StockQuant.location_id == default_loc.id
    ).first()

    if not quant:
        quant = StockQuant(
            product_id=product.id,
            location_id=default_loc.id,
            quantity=0.0,
            min_reorder_level=10.0
        )
        db.add(quant)
        db.commit()
        db.refresh(quant)

    # Execute stock movement
    move_qty = op.quantity
    if op.type == "receipt":
        # Increments stock for incoming receipts
        quant.quantity += op.quantity
        move_qty = op.quantity
    elif op.type == "delivery":
        # Block validation if stock is insufficient
        if quant.quantity < op.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock available for '{product.name}' (SKU: {product.sku}). On Hand: {quant.quantity}, Requested: {op.quantity}."
            )
        quant.quantity -= op.quantity
        move_qty = -op.quantity
    elif op.type == "internal":
        # Location Shift: Decrements source, increments destination (Total stock 100% unchanged)
        if quant.quantity < op.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock at source location for transfer '{op.reference}'. On Hand: {quant.quantity}, Requested: {op.quantity}."
            )
        quant.quantity -= op.quantity

        dest_loc = db.query(Location).filter(Location.type == "internal", Location.id != default_loc.id).first()
        if not dest_loc:
            dest_loc = Location(name=op.to_location or "Assembly Rack B", code="WH-RACK-B", warehouse_id=default_loc.warehouse_id, type="internal")
            db.add(dest_loc)
            db.commit()
            db.refresh(dest_loc)

        dest_quant = db.query(StockQuant).filter(StockQuant.product_id == product.id, StockQuant.location_id == dest_loc.id).first()
        if not dest_quant:
            dest_quant = StockQuant(product_id=product.id, location_id=dest_loc.id, quantity=0.0)
            db.add(dest_quant)
        dest_quant.quantity += op.quantity
        move_qty = op.quantity
    elif op.type == "adjustment":
        # Cycle Count Adjustment: Supports positive and negative deltas
        actual_counted = op.quantity_done if op.quantity_done > 0 else op.quantity
        delta = actual_counted - quant.quantity
        quant.quantity = max(0.0, float(actual_counted))
        move_qty = delta

    # Record StockMove audit log
    move = StockMove(
        reference=op.reference,
        product_id=product.id,
        quantity=move_qty,
        status="done"
    )
    db.add(move)

    # Mark operation as done and validated
    op.status = "done"
    op.quantity_done = op.quantity if op.type != "adjustment" else actual_counted
    op.validated_at = datetime.utcnow()

    db.commit()
    db.refresh(op)

    return get_operation_by_id(db, op.id)


def cancel_operation(db: Session, op_id: int) -> OperationResponse:
    op = db.query(Operation).filter(Operation.id == op_id).first()
    if not op:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Operation with ID {op_id} not found."
        )

    if op.status == "done":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel operation {op.reference} because it has already been validated and marked as Done."
        )

    op.status = "canceled"
    db.commit()
    db.refresh(op)

    return get_operation_by_id(db, op.id)
