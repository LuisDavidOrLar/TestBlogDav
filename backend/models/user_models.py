from pydantic import BaseModel, EmailStr
from bson import ObjectId


class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    is_active: bool

    class Config:
        from_attributes = True
        json_encoders = {
            ObjectId: str
        }
