import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()


MONGO_URL = os.environ.get("MONGO_URL", "mongodb://127.0.0.1:27017/")

DATABASE_NAME = os.getenv("DATABASE_NAME", "products_api")
MONGO_USER = os.getenv("MONGO_USER")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")

MONGO_CLUSTER_URL = f"mongodb+srv://{MONGO_USER}:{MONGO_PASSWORD}@cluster01.rkhk5fj.mongodb.net/?appName=Cluster01"



"""
In a FastAPI application, the primary difference is that AsyncIOMotorClient is non-blocking and ideal for asynchronous environments, while MongoClient is blocking and will significantly hinder performance. FastAPI, being an asynchronous framework, is designed to work with asynchronous drivers to handle concurrent requests efficiently.
"""
# mongodb async driver -> pip install motor
client = AsyncIOMotorClient(MONGO_URL)

db = client[DATABASE_NAME]
products_collection = db["products"]
sellers_collection = db["sellers"]


def document_to_dict(doc:dict)->dict:
    if doc is None:
        return None
    
    doc = dict(doc) # shallow copy - Do not work with the raw doc db object

    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

