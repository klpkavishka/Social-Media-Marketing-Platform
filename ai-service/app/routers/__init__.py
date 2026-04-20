"""
FastAPI routers for AI Marketing Service
"""

from fastapi import APIRouter
from . import (
    content_generation,
    sentiment_analysis,
    hashtags,
    timing,
    image_generation,
    analytics,
)

# Create main API router
api_router = APIRouter()

# Include all routers
api_router.include_router(content_generation.router)
api_router.include_router(sentiment_analysis.router)
api_router.include_router(hashtags.router)
api_router.include_router(timing.router)
api_router.include_router(image_generation.router)
api_router.include_router(analytics.router)

__all__ = ["api_router"]
