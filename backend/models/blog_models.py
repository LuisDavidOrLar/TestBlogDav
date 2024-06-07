from pydantic import BaseModel, Field
from bson import ObjectId
from typing import Optional
from datetime import datetime

class BlogPost(BaseModel):
    title: str
    content: str
    imageUrl: str 
    author: str  
    published: Optional[bool] = True
    created_at: datetime = datetime.now()

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    imageUrl: Optional[str] = None 
    author: Optional[str] = None  
    published: Optional[bool] = None

class BlogPostResponse(BaseModel):
    id: str = Field(..., alias="_id")
    title: str
    content: str
    imageUrl: str
    author: str
    published: bool
    created_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            ObjectId: str
        }