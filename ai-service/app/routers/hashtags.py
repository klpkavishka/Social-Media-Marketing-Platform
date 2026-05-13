from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import logging
from ..services.hashtag_service import HashtagService

logger = logging.getLogger(__name__)
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
        logger.info(f"📝 Generating hashtags for text: {request.text[:100]}...")
        result = await hashtag_service.suggest_hashtags(
            text=request.text,
            count=request.count,
            platform=request.platform
        )
        logger.info(f"✅ Hashtags generated: {len(result.get('hashtags', []))} tags")
        return result
    except Exception as e:
        logger.error(f"❌ Error generating hashtags: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/hashtags/trending")
async def get_trending_hashtags(platform: Optional[str] = None, limit: int = 10):
    """
    Get trending hashtags for a specific platform.
    """
    try:
        logger.info(f"📊 Fetching trending hashtags for {platform or 'all platforms'}")
        result = await hashtag_service.get_trending(platform, limit)
        logger.info(f"✅ Trending hashtags fetched: {len(result.get('trending', []))} tags")
        return result
    except Exception as e:
        logger.error(f"❌ Error fetching trending hashtags: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/hashtags/analyze")
async def analyze_hashtag_performance(hashtag: str, platform: Optional[str] = None):
    """
    Analyze the performance and reach of a specific hashtag.
    """
    try:
        logger.info(f"🔍 Analyzing hashtag performance for {hashtag}")
        result = await hashtag_service.analyze_hashtag(hashtag, platform)
        logger.info(f"✅ Analysis complete for {hashtag}")
        return result
    except Exception as e:
        logger.error(f"❌ Error analyzing hashtag: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

