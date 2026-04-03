from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from bson import ObjectId
from bson.errors import InvalidId
from ..database import products_collection, document_to_dict
from ..utils.helpers import rate_limiter
from .. import schemas
from .. import oauth2

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


def get_object_id(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Invalid ID format: {id_str}"
        )


@router.get(
    "/",
    response_model=List[schemas.ProductResponse],
    dependencies=[Depends(rate_limiter(max_requests=3, window_seconds=60))]
)
async def list_products(
    limit: int = 10,
    skip: int = 0,
    search: Optional[str] = None,
    category: Optional[str] = None,
    in_stock: Optional[bool] = None
):
    query = {}
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    if category:
        query["category"] = category
    if in_stock is not None:
        query["in_stock"] = in_stock

    cursor = products_collection.find(query).skip(skip).limit(limit)
    products = await cursor.to_list(length=limit)
    return [document_to_dict(p) for p in products]


@router.get("/{product_id}", response_model=schemas.ProductResponse)
async def get_product(product_id: str):
    oid = get_object_id(product_id)
    product = await products_collection.find_one({"_id": oid})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {product_id} not found"
        )
    return document_to_dict(product)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.ProductResponse)
async def create_product(
    request: schemas.ProductCreate,
    current_user: schemas.TokenData = Depends(oauth2.get_current_user)
):
    product_data = request.model_dump()
    result = await products_collection.insert_one(product_data)
    new_product = await products_collection.find_one({"_id": result.inserted_id})
    return document_to_dict(new_product)


@router.patch("/{product_id}", response_model=schemas.ProductResponse)
async def update_product(
    product_id: str,
    request: schemas.ProductUpdate,
    current_user: schemas.TokenData = Depends(oauth2.get_current_user)
):
    """Partially update a product. Auth required."""
    oid = get_object_id(product_id)

    # Only include fields that were actually sent
    update_data = {k: v for k, v in request.model_dump().items() if v is not None}

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No fields provided to update"
        )

    result = await products_collection.update_one(
        {"_id": oid},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {product_id} not found"
        )

    updated = await products_collection.find_one({"_id": oid})
    return document_to_dict(updated)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    current_user: schemas.TokenData = Depends(oauth2.get_current_user)
):
    """Delete a product. Auth required."""
    oid = get_object_id(product_id)
    result = await products_collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
