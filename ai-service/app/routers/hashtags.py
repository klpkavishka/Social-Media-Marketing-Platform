from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from ..services.hashtag_service import HashtagService

router = APIRouter(prefix="/api", tags=["hashtags"])

class HashtagRequest(BaseModel):
    text: str
    count: Optional[int] = 5
    platform: Optional[str] = None

class HashtagResponse(BaseModel):
    hashtags: List[str]
    trending: Optional[List[str]] = None
    relevance_scores: Optional[dict] = None

hashtag_service = HashtagService()

@router.post("/hashtags", response_model=HashtagResponse)
async def suggest_hashtags(request: HashtagRequest):
    """
    Generate relevant hashtags based on content.
    """
    try:
        result = await hashtag_service.suggest_hashtags(
            text=request.text,
            count=request.count,
            platform=request.platform
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/hashtags/trending")
async def get_trending_hashtags(platform: Optional[str] = None, limit: int = 10):
    """
    Get trending hashtags for a specific platform.
    """
    try:
        result = await hashtag_service.get_trending(platform, limit)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/hashtags/analyze")
async def analyze_hashtag_performance(hashtag: str, platform: Optional[str] = None):
    """
    Analyze the performance and reach of a specific hashtag.
    """
    try:
        result = await hashtag_service.analyze_hashtag(hashtag, platform)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
