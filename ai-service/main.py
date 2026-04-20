from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io, time, logging

from model.predictor import predictor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Hashtag AI Service", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class PredictionResult(BaseModel):
    category:      str
    confidence:    float
    reliable:      bool
    top3:          list
    hashtags:      list[str]
    hashtag_count: int
    processing_ms: float
    caption:       str

@app.get("/health")
def health():
    return {"status": "ok", "classes": list(predictor.le.classes_)}

@app.post("/predict", response_model=PredictionResult)
async def predict(file: UploadFile = File(...)):
    logger.info(f"📥 Received upload: {file.filename} (type: {file.content_type})")
    
    if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        logger.warning(f"❌ Invalid content type: {file.content_type}")
        raise HTTPException(400, f"Unsupported type: {file.content_type}")

    contents = await file.read()
    logger.info(f"📦 File size: {len(contents)} bytes")
    
    if len(contents) > 10 * 1024 * 1024:
        logger.warning(f"❌ File too large: {len(contents)} bytes")
        raise HTTPException(400, "File exceeds 10 MB limit")

    try:
        image = Image.open(io.BytesIO(contents))
        logger.info(f"🖼️ Image loaded: {image.size} {image.mode}")
    except Exception as e:
        logger.error(f"❌ Failed to open image: {e}")
        raise HTTPException(400, "Cannot read image — file may be corrupted")

    start = time.time()
    try:
        logger.info(f"🤖 Running prediction...")
        result = predictor.predict(image)
        logger.info(f"✅ Prediction complete: {result['category']} ({result['confidence']}%)")
    except Exception as e:
        logger.error(f"❌ Prediction failed: {e}", exc_info=True)
        raise HTTPException(500, f"Prediction failed: {str(e)}")

    ms = round((time.time() - start) * 1000, 2)
    logger.info(f"⏱️ Total time: {ms}ms")
    return {**result, "processing_ms": ms}
