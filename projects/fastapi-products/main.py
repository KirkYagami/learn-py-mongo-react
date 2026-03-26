from fastapi import FastAPI
from app.routers import products, sellers


app = FastAPI(
    title="Products API",
    description="A complete CRUD API for products and sellers",
    version="0.4.0",
    contact={
        "name": "Your Name",
        "email": "you@example.com"
    }
)

app.include_router(products.router)
app.include_router(sellers.router)


@app.get("/")
def root():
    return "Welcome !!!"

@app.get("/health")
def root():
    return {"status":"healthy"}

