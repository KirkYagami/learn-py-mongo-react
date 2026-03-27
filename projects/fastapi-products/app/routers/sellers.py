from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from bson.errors import InvalidId
from typing import List
from .. import schemas
from ..database import sellers_collection, document_to_dict
from .. import oauth2

router = APIRouter(
    prefix="/sellers",
    tags=["Sellers"]
)


@router.get("/", response_model=List[schemas.SellerResponse])
async def list_sellers():
    """List all sellers (passwords excluded by response model)"""
    cursor = sellers_collection.find({})
    sellers = await cursor.to_list(length=100)
    return [document_to_dict(s) for s in sellers]


@router.get("/{seller_id}", response_model=schemas.SellerResponse)
async def get_seller(seller_id: str):
    """Get a seller by ID"""
    try:
        oid = ObjectId(seller_id)
    except InvalidId:
        raise HTTPException(status_code=404, detail="Invalid seller ID")
    
    seller = await sellers_collection.find_one({"_id": oid})
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")
    
    return document_to_dict(seller)


@router.post("/", status_code=201, response_model=schemas.SellerResponse)
async def create_seller(request: schemas.SellerCreate):
    """Register a new seller"""
    # Check for duplicate username
    existing = await sellers_collection.find_one({"username": request.username})
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    seller_data = {
        "username": request.username,
        "email": request.email,
        "hashed_password": oauth2.hash_password(request.password)
    }
    
    result = await sellers_collection.insert_one(seller_data)
    new_seller = await sellers_collection.find_one({"_id": result.inserted_id})
    
    return document_to_dict(new_seller)