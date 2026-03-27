from fastapi import FastAPI
from app.routers import products, sellers
from app.middleware import log_requests


app = FastAPI(
    title="Products API",
    description="A complete CRUD API for products and sellers",
    version="0.4.0",
    contact={
        "name": "Nikhil Sharma",
        "email": "er.nikhilsharma7.com"
    }
)

app.middleware("http")(log_requests)
app.include_router(products.router)
app.include_router(sellers.router)


@app.get("/")
def root():
    return "Welcome !!!"

@app.get("/health")
def root():
    return {"status":"healthy"}

