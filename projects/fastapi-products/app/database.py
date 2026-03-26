import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://127.0.0.1:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "products_api")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]
products_collection = db["products"]
sellers_collection = db["sellers"]

def document_to_dict(doc:dict)->dict:
    if doc is None:
        return None
    
    doc = dict(doc)

    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

