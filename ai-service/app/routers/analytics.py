from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ..services.analytics_service import AnalyticsService

router = APIRouter(prefix="/api", tags=["analytics"])

class AnalyticsRequest(BaseModel):
    content_id: Optional[str] = None
    platform: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

analytics_service = AnalyticsService()

@router.post("/analytics/predict")
async def predict_performance(content: str, platform: str):
    """
    Predict the performance of content before posting.
    """
    try:
        result = await analytics_service.predict_performance(content, platform)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analytics/insights")
async def get_insights(request: AnalyticsRequest):
    """
    Get AI-powered insights from analytics data.
    """
    try:
        result = await analytics_service.get_insights(
            content_id=request.content_id,
            platform=request.platform,
            start_date=request.start_date,
            end_date=request.end_date
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analytics/recommendations")
async def get_recommendations(historical_data: List[dict]):
    """
    Get personalized content recommendations based on historical performance.
    """
    try:
        result = await analytics_service.get_recommendations(historical_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analytics/trends")
async def analyze_trends(data: List[dict], metric: str):
    """
    Analyze trends in engagement metrics over time.
    """
    try:
        result = await analytics_service.analyze_trends(data, metric)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
