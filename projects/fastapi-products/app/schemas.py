from pydantic import BaseModel, Field
from typing import Optional


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1)
    price: int = Field(..., gt=0, description="Price in paise/cents, e.g. 999 = ₹9.99")
    in_stock: bool = True
    category: str = Field(default="general")

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    price: Optional[int] = Field(None, gt=0)
    in_stock: Optional[bool] = None
    category: Optional[str] = None

class ProductResponse(BaseModel):
    """Schema for the API response (output)"""
    id: str
    name: str
    description: str
    price: int
    in_stock: bool

class SellerCreate(BaseModel):
    """Schema for registering a new seller"""
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., description="Must be a valid email")
    password: str = Field(..., min_length=6)

class SellerResponse(BaseModel):
    """What we return for a seller (never includes password!)"""
    id: str
    username: str
    email: str