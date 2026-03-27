
'''
In FastAPI, middleware is a function or class that runs with every request before it is processed by a path operation, and again with the response before it is returned.

This allows developers to implement logic for cross-cutting concerns like logging, authentication, and performance monitoring in a single place. 
'''
"""
## Key Concepts

- **Request and Response Interception**: Middleware sits in the HTTP pipeline, processing both the incoming request and the outgoing response.

- **Global Application**: Middleware logic applies globally to all requests, unlike dependencies which can be applied to specific routes.

- **Execution Order**: Multiple middlewares form a stack. The last middleware added is the first to run during the request phase, and the last to run during the response phase (an "onion model").

- **Asynchronous Support**: Middleware in FastAPI is built on Starlette and uses the ASGI specification, meaning it should be asynchronous (`async`/`await`) to avoid blocking the application's event loop.
"""

# logging middleware


from fastapi import Request
import logging
import time


import os

logger = logging.getLogger("app_logger")
logger.setLevel(logging.INFO)
logger.propagate = False

log_path = os.path.abspath("app.log")

if not logger.handlers:
    file_handler = logging.FileHandler(log_path, mode="a",)
    file_handler.setLevel(logging.INFO)

    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(message)s"
    )
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
    print("Logging to:", log_path)



async def log_requests(request: Request, call_next):
    """log every request with method, path, status code and duration"""

    start_time = time.time()
    logger.info(f"-> {request.method} {request.url.path} | {request.client.host}")

    response = await call_next(request) # pass to next handler

    duration = (time.time() - start_time) * 1000 # convert to MS

    logger.info(
        f"<- {request.method} {request.url.path} "
        f"| {response.status_code} "
        f"| {duration:.2f}ms"
    )

    return response

# TODO: create a rate limiting middleware, which has different limit for different routes
# e.g. 5 requests per 60 sec for products and 2 req/m for sellers

# api/v1/places?lat=...&long=...&type=restaurants

# plans - basic-5, pro-20, ultra-300 

# sent = "I am learning fastapi..."

# {'i':3, }




