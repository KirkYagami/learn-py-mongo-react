"""
Database seeder — populates MongoDB with sample data.
Run once: python seed.py

WARNING: This clears existing data! Don't run on production.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
# from passlib.context import CryptContext
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "products_api")

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


SELLERS = [
    {
        "username": "techstore",
        "email": "tech@store.com",
        "password": "password123"
    },
    {
        "username": "furnitureco",
        "email": "furniture@co.com",
        "password": "password123"
    }
]

# Products: seller_username is used to link them after sellers are created
PRODUCTS = [
    {
        "name": "Mechanical Keyboard",
        "description": "RGB backlit, tactile Brown switches. Great for typing and gaming.",
        "price": 8999,
        "in_stock": True,
        "category": "electronics",
        "seller_username": "techstore"
    },
    {
        "name": "Noise Cancelling Headphones",
        "description": "40hr battery, foldable, works with all devices.",
        "price": 14999,
        "in_stock": True,
        "category": "electronics",
        "seller_username": "techstore"
    },
    {
        "name": "USB-C Hub 7-in-1",
        "description": "HDMI 4K, 3x USB-A, SD card, 100W PD charging.",
        "price": 3499,
        "in_stock": True,
        "category": "electronics",
        "seller_username": "techstore"
    },
    {
        "name": "Standing Desk",
        "description": "Motorized height adjustment, 3 memory presets, 120x60cm top.",
        "price": 45000,
        "in_stock": False,
        "category": "furniture",
        "seller_username": "furnitureco"
    },
    {
        "name": "Ergonomic Chair",
        "description": "Lumbar support, adjustable armrests, breathable mesh back.",
        "price": 28000,
        "in_stock": True,
        "category": "furniture",
        "seller_username": "furnitureco"
    },
    {
        "name": "Monitor Light Bar",
        "description": "No screen glare, warm/cool temperature, touch controls.",
        "price": 2499,
        "in_stock": True,
        "category": "accessories",
        "seller_username": "techstore"
    },
]


async def seed():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    print(f"🌱 Seeding database: {DATABASE_NAME}")
    print(f"   Connected to: {MONGODB_URL[:30]}...")
    
    # Clear existing data
    await db.sellers.delete_many({})
    await db.products.delete_many({})
    print("🗑  Cleared existing data")
    
    # Insert sellers
    seller_map = {}  # username → inserted _id
    for seller_data in SELLERS:
        result = await db.sellers.insert_one({
            "username": seller_data["username"],
            "email": seller_data["email"],
            # "hashed_password": pwd_context.hash(seller_data["password"])
        })
        seller_map[seller_data["username"]] = str(result.inserted_id)
        print(f"  ✅ Seller: {seller_data['username']}")
    
    # Insert products (link to sellers)
    for product_data in PRODUCTS:
        seller_username = product_data.pop("seller_username")
        product_data["seller_id"] = seller_map.get(seller_username)
        
        await db.products.insert_one(product_data)
        print(f"  ✅ Product: {product_data['name']}")
    
    print("\n🎉 Done! Seeded:")
    print(f"   {len(SELLERS)} sellers (password: 'password123' for all)")
    print(f"   {len(PRODUCTS)} products")
    print("\n📚 Try the API at: http://localhost:8000/docs")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())