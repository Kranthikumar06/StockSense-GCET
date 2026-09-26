from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.operation import OperationCreate, OperationResponse
from app.services import operation_service

router = APIRouter(prefix="/api/operations", tags=["Operations"])


@router.get("", response_model=List[OperationResponse])
def list_operations(
    type: Optional[str] = Query(None, description="Filter by operation type: receipt, delivery, internal, adjustment"),
    status: Optional[str] = Query(None, description="Filter by status: draft, waiting, ready, done"),
    search: Optional[str] = Query(None, description="Search reference, supplier, product, SKU"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """
    Retrieve list of inventory operations (Receipts, Deliveries, Internal Transfers).
    """
    return operation_service.get_operations(
        db=db,
        type_filter=type,
        status_filter=status,
        search=search,
        skip=skip,
        limit=limit
    )


@router.get("/{operation_id}", response_model=OperationResponse)
def get_operation(operation_id: int, db: Session = Depends(get_db)):
    """
    Retrieve details of a single operation by ID.
    """
    return operation_service.get_operation_by_id(db=db, op_id=operation_id)


@router.post("", response_model=OperationResponse, status_code=status.HTTP_201_CREATED)
def create_operation(op_in: OperationCreate, db: Session = Depends(get_db)):
    """
    Create a new inventory operation (e.g. Receipt or Delivery Order).
    """
    return operation_service.create_operation(db=db, op_in=op_in)


@router.post("/{operation_id}/validate", response_model=OperationResponse)
def validate_operation(operation_id: int, db: Session = Depends(get_db)):
    """
    Validate an operation (Receipt or Delivery Order).
    Automatically updates stock quantities in Neon PostgreSQL database.
    """
    return operation_service.validate_operation(db=db, op_id=operation_id)


@router.post("/{operation_id}/cancel", response_model=OperationResponse)
def cancel_operation(operation_id: int, db: Session = Depends(get_db)):
    """
    Cancel an operation. Sets status to 'canceled' without altering stock levels.
    """
    return operation_service.cancel_operation(db=db, op_id=operation_id)
