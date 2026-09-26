from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.models.warehouse import Warehouse
from app.models.location import Location
from app.models.operation import Operation
from app.models.stock import StockQuant, StockMove
from app.core.security import hash_password


def seed_database(db: Session):
    """
    Populate database with rich initial seed records across all modules so the app is 100% demo-ready.
    """
    try:
        # 1. Seed Categories if empty
        cat_count = db.query(Category).count()
        if cat_count == 0:
            categories = [
                Category(name="Raw Materials", description="Metals, plastics, and raw manufacturing inputs"),
                Category(name="Electronics", description="Motors, batteries, sensors, and controllers"),
                Category(name="Fasteners & Hardware", description="Nuts, bolts, screws, and brackets"),
                Category(name="Fluids & Lubricants", description="Oils, coolants, and hydraulic fluids"),
            ]
            db.add_all(categories)
            db.commit()

        raw_cat = db.query(Category).filter(Category.name == "Raw Materials").first()
        elec_cat = db.query(Category).filter(Category.name == "Electronics").first()
        fast_cat = db.query(Category).filter(Category.name == "Fasteners & Hardware").first()
        fluid_cat = db.query(Category).filter(Category.name == "Fluids & Lubricants").first()

        # 2. Seed Products if empty
        prod_count = db.query(Product).count()
        if prod_count == 0:
            products = [
                Product(
                    name="Galvanized Hex Nut M12",
                    sku="NUT-HX-M12",
                    category_id=fast_cat.id if fast_cat else None,
                    unit_of_measure="pcs",
                    per_unit_cost=0.45,
                    is_active=True
                ),
                Product(
                    name="Steel Rods 12mm - Grade 316",
                    sku="STL-ROD-012",
                    category_id=raw_cat.id if raw_cat else None,
                    unit_of_measure="kg",
                    per_unit_cost=12.80,
                    is_active=True
                ),
                Product(
                    name="Industrial Electric Motor 5HP",
                    sku="MOT-5HP-IND",
                    category_id=elec_cat.id if elec_cat else None,
                    unit_of_measure="Units",
                    per_unit_cost=450.00,
                    is_active=True
                ),
                Product(
                    name="Lithium-Ion Battery Pack 48V",
                    sku="SKU-BAT-9081",
                    category_id=elec_cat.id if elec_cat else None,
                    unit_of_measure="Units",
                    per_unit_cost=620.00,
                    is_active=True
                ),
                Product(
                    name="Hydraulic Oil ISO VG 46",
                    sku="OIL-VG-46",
                    category_id=fluid_cat.id if fluid_cat else None,
                    unit_of_measure="Drums",
                    per_unit_cost=85.50,
                    is_active=True
                ),
                Product(
                    name="Precision Ceramic Bearings 608",
                    sku="BRG-CER-608",
                    category_id=fast_cat.id if fast_cat else None,
                    unit_of_measure="Pcs",
                    per_unit_cost=4.25,
                    is_active=True
                ),
            ]
            db.add_all(products)
            db.commit()

        # 3. Seed Warehouses & Locations if empty
        wh_count = db.query(Warehouse).count()
        if wh_count == 0:
            wh1 = Warehouse(name="Main Distribution Center", short_code="DC-NORTH-01", address="104 Logistics Parkway, Building A")
            wh2 = Warehouse(name="Chicago South Depot", short_code="HUB-04", address="4500 Western Ave, Deep Bay")
            db.add_all([wh1, wh2])
            db.commit()

            loc1 = Location(name="Main Store Bay A", short_code="BAY-A", warehouse_id=wh1.id, type="internal")
            loc2 = Location(name="Production Rack (Assembly Line 2)", short_code="RACK-ASSY2", warehouse_id=wh1.id, type="internal")
            loc3 = Location(name="Cold Storage Unit B", short_code="COLD-B", warehouse_id=wh2.id, type="internal")
            db.add_all([loc1, loc2, loc3])
            db.commit()

        # 4. Seed Operations across all document types (Receipts, Delivery, Internal, Adjustment) if empty
        op_count = db.query(Operation).count()
        if op_count == 0:
            ops = [
                # Receipts
                Operation(
                    reference="WH/IN/00089",
                    type="receipt",
                    supplier_or_customer="Apex Industrial Metals",
                    product_name="Steel Rods 12mm - Grade 316",
                    sku="STL-ROD-012",
                    quantity=500.0,
                    quantity_done=500.0,
                    unit_of_measure="kg",
                    from_location="Vendor Intake Dock #02",
                    to_location="Main Store Bay A",
                    po_or_bol_ref="PO-94012",
                    status="done"
                ),
                Operation(
                    reference="WH/IN/00090",
                    type="receipt",
                    supplier_or_customer="Global Fasteners Corp",
                    product_name="Galvanized Hex Nut M12",
                    sku="NUT-HX-M12",
                    quantity=5000.0,
                    quantity_done=0.0,
                    unit_of_measure="pcs",
                    from_location="Vendor Intake Dock #01",
                    to_location="Main Store Bay A",
                    po_or_bol_ref="PO-94015",
                    status="ready"
                ),

                # Deliveries
                Operation(
                    reference="WH/OUT/00142",
                    type="delivery",
                    supplier_or_customer="Acme Heavy Machinery",
                    product_name="Industrial Electric Motor 5HP",
                    sku="MOT-5HP-IND",
                    quantity=5.0,
                    quantity_done=5.0,
                    unit_of_measure="Units",
                    from_location="Main Store Bay A",
                    to_location="Outbound Carrier Dock 04",
                    po_or_bol_ref="BOL-8842",
                    status="done"
                ),
                Operation(
                    reference="WH/OUT/00143",
                    type="delivery",
                    supplier_or_customer="Vortex Power Systems",
                    product_name="Lithium-Ion Battery Pack 48V",
                    sku="SKU-BAT-9081",
                    quantity=12.0,
                    quantity_done=0.0,
                    unit_of_measure="Units",
                    from_location="Cold Storage Unit B",
                    to_location="Outbound Carrier Dock 01",
                    po_or_bol_ref="BOL-8845",
                    status="ready"
                ),

                # Internal Transfers
                Operation(
                    reference="WH/INT/00094",
                    type="internal",
                    supplier_or_customer="Sarah Lin (Operator)",
                    product_name="Galvanized Hex Nut M12",
                    sku="NUT-HX-M12",
                    quantity=2000.0,
                    quantity_done=2000.0,
                    unit_of_measure="pcs",
                    from_location="Main Store Bay A",
                    to_location="Production Rack (Assembly Line 2)",
                    po_or_bol_ref="INT-REQ-101",
                    status="ready"
                ),
                Operation(
                    reference="WH/INT/00095",
                    type="internal",
                    supplier_or_customer="Alex Morgan (Lead)",
                    product_name="Steel Rods 12mm - Grade 316",
                    sku="STL-ROD-012",
                    quantity=50.0,
                    quantity_done=50.0,
                    unit_of_measure="kg",
                    from_location="Rack A (Floor 1)",
                    to_location="Rack B (Fast-Access Aisle)",
                    po_or_bol_ref="INT-REQ-102",
                    status="done"
                ),

                # Stock Adjustments
                Operation(
                    reference="WH/ADJ/00015",
                    type="adjustment",
                    supplier_or_customer="Audit Team (Cycle Count)",
                    product_name="Hydraulic Oil ISO VG 46",
                    sku="OIL-VG-46",
                    quantity=21.0,  # Counted Qty
                    quantity_done=25.0,  # Recorded Qty
                    unit_of_measure="Drums",
                    from_location="Cold Storage Vault #02",
                    to_location="Scrap / Damage Log",
                    po_or_bol_ref="ADJ-AUDIT-015",
                    status="done"
                ),
                Operation(
                    reference="WH/ADJ/00017",
                    type="adjustment",
                    supplier_or_customer="Audit Team (Cycle Count)",
                    product_name="Galvanized Hex Nut M12",
                    sku="NUT-HX-M12",
                    quantity=2050.0,  # Counted Qty
                    quantity_done=2000.0,  # Recorded Qty
                    unit_of_measure="pcs",
                    from_location="Rack B-18-04",
                    to_location="Inventory Adjustment Bin",
                    po_or_bol_ref="ADJ-AUDIT-017",
                    status="ready"
                ),
            ]
            db.add_all(ops)
            db.commit()

        # 5. Seed StockMoves (Audit Trail) if empty
        move_count = db.query(StockMove).count()
        if move_count == 0:
            first_product = db.query(Product).first()
            if first_product:
                moves = [
                    StockMove(
                        reference="WH/IN/00089",
                        product_id=first_product.id,
                        quantity=500.0,
                        status="done"
                    ),
                    StockMove(
                        reference="WH/OUT/00142",
                        product_id=first_product.id,
                        quantity=5.0,
                        status="done"
                    ),
                    StockMove(
                        reference="WH/INT/00095",
                        product_id=first_product.id,
                        quantity=50.0,
                        status="done"
                    ),
                ]
                db.add_all(moves)
                db.commit()

        print("[StockSense Database] Neon PostgreSQL database seed verified successfully.")
    except Exception as e:
        print(f"[StockSense Database] Seed warning: {e}")
        db.rollback()
