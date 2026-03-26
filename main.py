"""
FastAPI is a modern Python web framework for building APIs with minimal code. It leverages Python type hints for validation and documentation.
"""
# API = Application Programming Interface
# communication between services 
# FE send a request to BE
# Microservices




from fastapi import FastAPI

# Create an app instance
# This app variable is the main point of interaction to create all your API endpoints
app = FastAPI()

 # @ -> is the path operation decorator and its job is to associate the path with the func

@app.get("/")
def read_root(): # path operation function
    return {"Hello": "World"}

# GET /users
@app.get("/users") # '/users' is the path
def read_root():
    return [{'id':10, 'name':"Stark"},
            {'id':20, 'name':"Peter"}]

# HTTP Method + Path -> linked to -> function below it 



"""

## Path Parameters

Path parameters allow you to create dynamic routes in your API, making your endpoints more flexible and reusable. They're essential for RESTful API design and are commonly used to identify specific resources.

### Basic Path Parameters

Path parameters are parts of the URL path that are variable and can be captured as function parameters. They're defined by enclosing the parameter name in curly braces `{}` within the path string.

@app.get("/users/{id}/")
def read_users(id):
    return [{'id':id, 'name':"Guest"}]


"""

@app.get("/users/{id}")
def read_users(id:int):
    return [{'id':id, 'name':"Guest"}]


@app.get('/property/{id}')
def get_property(id:int): # sqlite3
    # query = f"""
    # select * from properties
    # where property_id={id}
    # """
    # res = db.execute(query) 
    # return res.fetchone()
    return f'This is the property page for id: {id}'

"""
### Path Parameters with Type Validation

One of the most powerful features of FastAPI is its automatic validation system. By adding type hints to your path parameters, FastAPI will:

1. Validate the input according to the type
2. Convert the parameter to the specified type
3. Generate OpenAPI documentation that includes the type information
4. Provide better editor support with autocomplete
"""

# Models
from enum import Enum
class CategoryName(str, Enum):
    electronics = "electronics"
    books = "books"
    clothing = "clothing"

## Advanced Path params using Enums

@app.get("/categories/{category}")
def get_category(category:CategoryName):
    return f'this page is for {category} category.'


"""
## Query Parameters

Query parameters are used to filter, sort, or provide additional information to an API endpoint without being part of the resource identification.
They're especially useful for optional parameters or when you need to include many parameters.


"""
@app.get('/products')
def list_products(max_price:int, min_price:int=0, sort_by:str='brand'):
    return{
        "min_price": min_price,
        "max_price": max_price,
        "sort_by": sort_by,
        "products": f"List of products filtered by price between {min_price} and {max_price}, sorted by {sort_by}"
    }

# http://127.0.0.1:8000/products?min_price=100&max_price=2000



@app.get('/search/')
def search_items(query: str, category: str = None, page: int = 1, items_per_page: int = 10):
    results = f"Search results for '{query}'"
    if category:
        results += f" in category '{category}'"
    
    results += f" (Page {page}, showing {items_per_page} items per page)"
    
    return {"results": results}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

"""
## Request Body

In API development, a request body is data sent by the client to your API. Request bodies are crucial when clients need to send larger structured data sets to the server.

The key points to understand:

- A response body is what your API sends back to clients
- A request body is what clients send to your API
- APIs always need to send response bodies, but clients don't always need to send request bodies
- POST requests typically include request bodies for creating or submitting data

"""


# @app.post('/users')
# def create_user():
#     return {'id':10, 'name':"Peter"}

"""
This example defines a POST endpoint that doesn't yet process any incoming data - it simply returns a hardcoded user object. To actually process client data, we need to implement request body handling.
"""


'''
### Using Pydantic Models for Request Bodies

Pydantic is a data validation library that allows us to define custom data types with validation rules. It's the foundation of FastAPI's request body handling.

'''

from models import CreateUser, CreateProduct
from fastapi import Request


@app.post('/users')
def create_user(user:CreateUser, req:Request):
    data = user.model_dump()
    
    # print(type(user))
    return {"status":"success",
        
            "host": req.client.host,
             'user':data}

@app.post('/products/{product_id}')
def create_product(product: CreateProduct, product_id):
    product.discounted_price= product.price - 50
    return {"product_id":product_id,
            "product":product}

# TASK: add query params to the mix above



# Nested Models
# Project Structure
# small e-com api - mongodb


'''
# Nested Models
## Introduction to Nested Models

When modeling complex data structures, we often need to represent relationships between different entities. Pydantic, a data validation library for Python, provides elegant ways to create nested models that reflect these relationships. This approach allows us to build sophisticated data schemas with proper type validation and clear structure.

## Basic List Fields

Let's start with adding a simple collection field to a model. Consider a `Product` model that needs to store multiple tags:

'''

from models import Product

@app.post('/products/{product_id}')
def create_product(product: Product, product_id):
    product.discounted_price= product.price - 50
    return {"product_id":product_id,
            "product":product}