"""
JWT Authentication helpers.

This module handles:
- Password hashing & verification
- JWT token creation
- Token decoding & user extraction
"""

from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from . import schemas
import os
from dotenv import load_dotenv

load_dotenv()




# openssl rand -hex 32 (use gitbash)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# CryptContext handles all password hashing
# bcrypt is the recommended algorithm (slow = harder to brute-force)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """Hash a plain text password. Call this when registering a user."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hash. Call this during login."""
    return pwd_context.verify(plain_password, hashed_password)



# JWT Token Creation

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a signed JWT access token.
    
    Args:
        data: The payload to encode. Usually {"sub": username}
        expires_delta: How long until the token expires
    
    Returns:
        A signed JWT token string
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # "exp" is a standard JWT claim for expiration time
    to_encode.update({"exp": expire})
    
    # Encode the payload with our secret key
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Token Verification and User Extraction

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str = Depends(oauth2_scheme)) -> schemas.TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
        # The WWW-Authenticate header tells clients what auth scheme to use
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        username: str = payload.get("sub")
        
        if username is None:
            raise credentials_exception
        
        return schemas.TokenData(username=username)
    
    except JWTError:
        # Catches: expired tokens, invalid signature, malformed token
        raise credentials_exception