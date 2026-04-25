from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import api_router

app = FastAPI(
    title="AI Marketing Service",
    description="AI-powered content generation and analytics for social media marketing",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:4000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)

@app.get("/")
async def root():
    return {
        "service": "AI Marketing Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "content_generation": "/api/generate",
            "sentiment_analysis": "/api/sentiment",
            "hashtags": "/api/hashtags",
            "timing_optimization": "/api/timing",
            "image_generation": "/api/image",
            "analytics": "/api/analytics",
            "docs": "/docs",
        },
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
