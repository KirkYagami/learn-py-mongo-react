from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from .. import schemas, oauth2
from ..database import sellers_collection


router = APIRouter(tags=["Authentication"])

@router.post("/login", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Login with username and password, get a JWT token back.
    """

    seller = await sellers_collection.find_one(
                {"username": form_data.username}
    )

    if not seller:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

    # Verify password
    if not oauth2.verify_password(
        form_data.password,
        seller["hashed_password"]
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
# Create JWT token
    access_token = oauth2.create_access_token(
        data={"sub": seller["username"]},
        expires_delta=timedelta(
            minutes=oauth2.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }




