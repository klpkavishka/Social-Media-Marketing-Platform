from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from ..services.content_generation import ContentGenerationService

router = APIRouter(prefix="/api", tags=["content-generation"])

class ContentGenerationRequest(BaseModel):
    text: str
    type: str
    platform: Optional[str] = None
    tone: Optional[str] = "professional"
    max_length: Optional[int] = 500

class ContentGenerationResponse(BaseModel):
    content: str
    suggestions: List[str]
    metadata: Optional[dict] = None

content_service = ContentGenerationService()

@router.post("/generate", response_model=ContentGenerationResponse)
async def generate_content(request: ContentGenerationRequest):
    """
    Generate AI-powered content based on the provided prompt.
    """
    try:
        result = await content_service.generate_content(
            prompt=request.text,
            content_type=request.type,
            platform=request.platform,
            tone=request.tone,
            max_length=request.max_length
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/improve")
async def improve_content(text: str, suggestions: Optional[List[str]] = None):
    """
    Improve existing content with AI suggestions.
    """
    try:
        result = await content_service.improve_content(text, suggestions)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rewrite")
async def rewrite_content(text: str, style: Optional[str] = None):
    """
    Rewrite content in a different style or tone.
    """
    try:
        result = await content_service.rewrite_content(text, style)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
