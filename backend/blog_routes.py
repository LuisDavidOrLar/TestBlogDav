from fastapi import APIRouter, HTTPException, Body, UploadFile, File, Form, Depends, Request
from fastapi.responses import FileResponse
from typing import List
from datetime import datetime
import os
from uuid import uuid4
from database import add_blog_post, update_blog_post, delete_blog_post, fetch_all_blog_posts, fetch_user_blog_posts, create_user
from auth import get_current_user
from models.user_models import UserCreate, User
from models.blog_models import BlogPost, BlogPostUpdate, BlogPostResponse 
from utils import hash_password

router = APIRouter()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.get("/posts", response_model=List[BlogPostResponse])
async def read_posts(request: Request):
    posts = await fetch_all_blog_posts(request)
    return [BlogPostResponse(**post) for post in posts]

@router.post("/posts", response_model=BlogPostResponse)
async def create_post(
    request: Request,
    title: str = Form(...),
    content: str = Form(...),
    author: str = Form(...),
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    unique_filename = f"{uuid4()}-{image.filename}"
    image_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        os.makedirs(os.path.dirname(image_path), exist_ok=True)
        with open(image_path, "wb") as f:
            f.write(await image.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")

    post_data = {
        "title": title,
        "content": content,
        "author": current_user.email,
        "imageUrl": f"/images/{unique_filename}",
        "published": True,
        "created_at": datetime.now()
    }

    new_post = await add_blog_post(request, post_data)
    if new_post is None:
        raise HTTPException(status_code=400, detail="Failed to create post")
    
    new_post["_id"] = str(new_post["_id"])
    
    return BlogPostResponse(**new_post)

@router.get("/user-posts", response_model=List[BlogPostResponse])
async def read_user_posts(request: Request, current_user: User = Depends(get_current_user)):
    posts = await fetch_user_blog_posts(request, current_user.email)
    return posts

@router.put("/posts/{id}")
async def update_post(request: Request, id: str, post: dict):
    if await update_blog_post(request, id, post):
        return {"message": "Post updated successfully"}
    raise HTTPException(status_code=404, detail="Post not found")

@router.delete("/posts/{id}")
async def remove_post(request: Request, id: str):
    if await delete_blog_post(request, id):
        return {"message": "Post deleted successfully"}
    raise HTTPException(status_code=404, detail="Post not found")

@router.get("/images/{image_path:path}")
async def get_image(image_path: str):
    file_path = os.path.join(UPLOAD_DIR, image_path)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(file_path)

@router.post("/users/", response_model=UserCreate)
async def create_user_endpoint(request: Request, user: UserCreate = Body(...)):
    user_dict = user.dict()
    hashed_password = hash_password(user_dict.pop('password'))
    user_dict['hashed_password'] = hashed_password
    await create_user(request, user_dict)
    return {**user_dict, "password": "hidden"}
