from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..services.sentiment_analysis import SentimentAnalysisService

router = APIRouter(prefix="/api", tags=["sentiment-analysis"])

class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    sentiment: str
    score: float
    confidence: float
    emotions: Optional[dict] = None

sentiment_service = SentimentAnalysisService()

@router.post("/sentiment", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    """
    Analyze the sentiment of the provided text.
    Returns sentiment (positive/negative/neutral) with confidence scores.
    """
    try:
        result = await sentiment_service.analyze(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sentiment/batch")
async def analyze_sentiment_batch(texts: list[str]):
    """
    Analyze sentiment for multiple texts in batch.
    """
    try:
        results = await sentiment_service.analyze_batch(texts)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/emotions")
async def analyze_emotions(text: str):
    """
    Analyze emotional content of text (joy, anger, sadness, etc.).
    """
    try:
        result = await sentiment_service.analyze_emotions(text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
