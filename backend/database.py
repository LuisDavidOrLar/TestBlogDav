from motor.motor_asyncio import AsyncIOMotorClient
from bson.objectid import ObjectId
from datetime import datetime
from config import MONGO_DETAILS, DATABASE_NAME


client = AsyncIOMotorClient(MONGO_DETAILS)
database = client[DATABASE_NAME]

blog_collection = database.get_collection("posts")
user_collection = database.get_collection("users")


async def fetch_all_blog_posts():
    blog_posts = []
    await client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    async for post in blog_collection.find():
        post["_id"] = str(post["_id"])  
        post["published"] = post.get("published", True) 
        post["created_at"] = post.get("created_at", datetime.now()) 
        blog_posts.append(post)
    return blog_posts

async def fetch_user_blog_posts(email: str):
    blog_posts = []
    async for post in blog_collection.find({"author": email}):
        post["_id"] = str(post["_id"]) 
        post["published"] = post.get("published", True) 
        post["created_at"] = post.get("created_at", datetime.now()) 
        blog_posts.append(post)
    return blog_posts

async def add_blog_post(post_data):
    result = await blog_collection.insert_one(post_data)
    new_post = await blog_collection.find_one({"_id": result.inserted_id})
    return new_post

async def update_blog_post(id: str, data: dict) -> bool:
    if await blog_collection.find_one({"_id": ObjectId(id)}):
        updated_post = await blog_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if updated_post.modified_count:
            return True
        return False
    return False

async def delete_blog_post(id: str) -> bool:
    deleted_post = await blog_collection.delete_one({"_id": ObjectId(id)})
    if deleted_post.deleted_count:
        return True
    return False

async def create_user(user_data: dict):
    try:
        result = await user_collection.insert_one(user_data)
        await client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return result.inserted_id
    except Exception as e:
        print(f"Error inserting user: {e}")
        return None
    
async def get_user_by_email(email: str):
    try:
        user = await user_collection.find_one({"email": email})
        return user
    except Exception as e:
        print(f"Error retrieving user by email {email}: {e}")
        return None
