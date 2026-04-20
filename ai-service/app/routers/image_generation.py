from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..services.image_generation import ImageGenerationService

router = APIRouter(prefix="/api", tags=["image-generation"])

class ImageGenerationRequest(BaseModel):
    text: str
    style: Optional[str] = "realistic"
    width: Optional[int] = 1024
    height: Optional[int] = 1024
    negative_prompt: Optional[str] = None

class ImageGenerationResponse(BaseModel):
    image_url: str
    prompt: str
    style: str
    metadata: Optional[dict] = None

image_service = ImageGenerationService()

@router.post("/image", response_model=ImageGenerationResponse)
async def generate_image(request: ImageGenerationRequest):
    """
    Generate AI images based on text prompts.
    """
    try:
        result = await image_service.generate_image(
            prompt=request.text,
            style=request.style,
            width=request.width,
            height=request.height,
            negative_prompt=request.negative_prompt
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/image/edit")
async def edit_image(image_url: str, prompt: str, mask_url: Optional[str] = None):
    """
    Edit an existing image using AI.
    """
    try:
        result = await image_service.edit_image(image_url, prompt, mask_url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/image/variations")
async def create_variations(image_url: str, count: int = 3):
    """
    Create variations of an existing image.
    """
    try:
        result = await image_service.create_variations(image_url, count)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
