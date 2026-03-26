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
def get_category(category:str):
    return f'this page is for {category} category.'





@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
