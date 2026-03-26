from pydantic import BaseModel, Field
from typing import List

class CreateUser(BaseModel):
    name: str
    email: str
    age: int

class UpdateUser(BaseModel):
    pass

class Image(BaseModel):
    url: str
    name: str

class CreateProduct(BaseModel):
    name: str
    price: int
    discount: int
    discounted_price: int

class Product(BaseModel):
    name: str
    price: int = Field(..., gt=0, title="Price of the item",description="Price must be greater than zero")
    discount: int
    discounted_price: int
    tags: List[str] = []
    images: List[Image]

