from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from blog_routes import router as blog_router

app = FastAPI()

allowed_origins = [
    "http://localhost:5173",
    "https://test-blog-dav-frontend.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  
)

app.include_router(auth_router)
app.include_router(blog_router)
