from bson.objectid import ObjectId
from datetime import datetime
from fastapi import Request

async def fetch_all_blog_posts(request: Request):
    blog_posts = []
    await request.app.mongodb_client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    async for post in request.app.mongodb["posts"].find():
        post["_id"] = str(post["_id"])
        post["published"] = post.get("published", True)
        post["created_at"] = post.get("created_at", datetime.now())
        blog_posts.append(post)
    return blog_posts

async def fetch_user_blog_posts(request: Request, email: str):
    blog_posts = []
    async for post in request.app.mongodb["posts"].find({"author": email}):
        post["_id"] = str(post["_id"])
        post["published"] = post.get("published", True)
        post["created_at"] = post.get("created_at", datetime.now())
        blog_posts.append(post)
    return blog_posts

async def add_blog_post(request: Request, post_data):
    result = await request.app.mongodb["posts"].insert_one(post_data)
    new_post = await request.app.mongodb["posts"].find_one({"_id": result.inserted_id})
    return new_post

async def update_blog_post(request: Request, id: str, data: dict) -> bool:
    if await request.app.mongodb["posts"].find_one({"_id": ObjectId(id)}):
        updated_post = await request.app.mongodb["posts"].update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if updated_post.modified_count:
            return True
        return False
    return False

async def delete_blog_post(request: Request, id: str) -> bool:
    deleted_post = await request.app.mongodb["posts"].delete_one({"_id": ObjectId(id)})
    if deleted_post.deleted_count:
        return True
    return False

async def create_user(request: Request, user_data: dict):
    try:
        result = await request.app.mongodb["users"].insert_one(user_data)
        await request.app.mongodb_client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return result.inserted_id
    except Exception as e:
        print(f"Error inserting user: {e}")
        return None

async def get_user_by_email(request: Request, email: str):
    try:
        user = await request.app.mongodb["users"].find_one({"email": email})
        return user
    except Exception as e:
        print(f"Error retrieving user by email {email}: {e}")
        return None
