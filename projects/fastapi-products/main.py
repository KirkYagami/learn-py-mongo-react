from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.routers import products, sellers, auth
from app.middleware import log_requests
import uuid


app = FastAPI(
    title="Products API",
    description="A complete CRUD API for products and sellers",
    version="0.4.0",
    contact={
        "name": "Nikhil Sharma",
        "email": "er.nikhilsharma7.com"
    }
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())[:8]
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


app.middleware("http")(log_requests)




app.include_router(products.router)
app.include_router(sellers.router)
app.include_router(auth.router)


@app.get("/")
def root():
    return "Welcome !!!"

@app.get("/health")
def root():
    return {"status":"healthy"}



