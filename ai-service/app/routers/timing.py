from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from ..services.timing_optimizer import TimingOptimizerService

router = APIRouter(prefix="/api", tags=["timing"])

class TimingRequest(BaseModel):
    platform: str
    content_type: str
    target_audience: Optional[dict] = None

class TimingResponse(BaseModel):
    best_times: List[dict]
    time_zone: str
    confidence: float

timing_service = TimingOptimizerService()

@router.post("/timing", response_model=TimingResponse)
async def optimize_timing(request: TimingRequest):
    """
    Get optimal posting times based on platform and content type.
    """
    try:
        result = await timing_service.get_optimal_times(
            platform=request.platform,
            content_type=request.content_type,
            target_audience=request.target_audience
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/timing/analyze")
async def analyze_posting_schedule(posts: List[dict]):
    """
    Analyze historical posting schedule and provide recommendations.
    """
    try:
        result = await timing_service.analyze_schedule(posts)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/timing/best-days")
async def get_best_days(platform: str):
    """
    Get the best days of the week for posting on a specific platform.
    """
    try:
        result = await timing_service.get_best_days(platform)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
