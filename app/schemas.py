from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

# --- User Schemas ---

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    traffic_limit_gb: Optional[float] = 100
    due_date: Optional[datetime] = None
    is_admin: Optional[bool] = False

class UserUpdate(BaseModel):
    password: Optional[str] = None
    traffic_limit_gb: Optional[float] = None
    due_date: Optional[datetime] = None
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None

class UserInDB(UserBase):
    id: int
    uuid: uuid.UUID
    traffic_limit: int
    traffic_used: int
    due_date: Optional[datetime]
    is_active: bool
    is_admin: bool

    class Config:
        orm_mode = True

# --- Node Schemas ---

class NodeBase(BaseModel):
    name: str
    address: str
    port: int
    protocol: str
    config_details: Optional[str] = None

class NodeCreate(NodeBase):
    pass

class NodeUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    port: Optional[int] = None
    protocol: Optional[str] = None
    config_details: Optional[str] = None
    is_active: Optional[bool] = None

class NodeInDB(NodeBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

# --- Token Schemas ---

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
