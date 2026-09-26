from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.warehouse import Warehouse
from app.models.location import Location
from app.schemas.warehouse import (
    WarehouseCreate,
    WarehouseUpdate,
    WarehouseResponse,
    LocationCreate,
    LocationResponse,
)

router = APIRouter(prefix="/api/warehouses", tags=["Warehouses & Locations Settings"])


@router.get("", response_model=List[WarehouseResponse])
def list_warehouses(db: Session = Depends(get_db)):
    """Retrieve all multi-warehouse facilities and linked locations."""
    return db.query(Warehouse).order_by(Warehouse.id.asc()).all()


@router.post("", response_model=WarehouseResponse, status_code=status.HTTP_201_CREATED)
def create_warehouse(wh_in: WarehouseCreate, db: Session = Depends(get_db)):
    """Create a new warehouse facility."""
    existing = db.query(Warehouse).filter(Warehouse.short_code.ilike(wh_in.short_code.strip())).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Warehouse with short code '{wh_in.short_code}' already exists."
        )

    wh = Warehouse(
        name=wh_in.name.strip(),
        short_code=wh_in.short_code.strip(),
        address=wh_in.address
    )
    db.add(wh)
    db.commit()
    db.refresh(wh)

    # Auto-create default internal bay location for this warehouse
    default_bay = Location(
        name=f"{wh.short_code} Main Stock Bay",
        code=f"{wh.short_code}-BAY-1",
        warehouse_id=wh.id,
        type="internal"
    )
    db.add(default_bay)
    db.commit()
    db.refresh(wh)

    return wh


@router.put("/{warehouse_id}", response_model=WarehouseResponse)
def update_warehouse(warehouse_id: int, wh_in: WarehouseUpdate, db: Session = Depends(get_db)):
    """Update warehouse facility details."""
    wh = db.query(Warehouse).filter(Warehouse.id == warehouse_id).first()
    if not wh:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Warehouse with ID {warehouse_id} not found."
        )

    if wh_in.name is not None:
        wh.name = wh_in.name.strip()
    if wh_in.short_code is not None:
        wh.short_code = wh_in.short_code.strip()
    if wh_in.address is not None:
        wh.address = wh_in.address

    db.commit()
    db.refresh(wh)
    return wh


@router.post("/locations", response_model=LocationResponse, status_code=status.HTTP_201_CREATED)
def create_location(loc_in: LocationCreate, db: Session = Depends(get_db)):
    """Create a new storage location / bin in a warehouse."""
    wh = db.query(Warehouse).filter(Warehouse.id == loc_in.warehouse_id).first() if loc_in.warehouse_id else None

    loc = Location(
        name=loc_in.name.strip(),
        code=loc_in.code or f"LOC-{loc_in.name[:3].upper()}",
        warehouse_id=loc_in.warehouse_id,
        type=loc_in.type
    )
    db.add(loc)
    db.commit()
    db.refresh(loc)
    return loc


@router.get("/locations", response_model=List[LocationResponse])
def list_locations(db: Session = Depends(get_db)):
    """Retrieve all storage locations across warehouses."""
    return db.query(Location).order_by(Location.name.asc()).all()
