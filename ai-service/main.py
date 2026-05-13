from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io, time, logging, os, base64, json, requests as http_requests

from model.predictor import predictor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Hashtag AI Service", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ── OpenRouter Configuration ─────────────────────────────────────────
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.environ.get("OPENROUTER_MODEL", "google/gemma-4-31b-it:free")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Fallback free models (tried in order if primary is rate-limited)
FALLBACK_MODELS = [
    OPENROUTER_MODEL,
    "openai/gpt-3.5-turbo",           # Paid but very cheap, always works
    "google/gemma-4-31b-it:free",
    "google/gemma-4-26b-a4b-it:free",
    "meta-llama/llama-3.3-70b-instruct:free",
]

# ── Response Schemas ──────────────────────────────────────────────────
class PredictionResult(BaseModel):
    category:      str
    confidence:    float
    reliable:      bool
    top3:          list
    hashtags:      list[str]
    hashtag_count: int
    processing_ms: float
    caption:       str

class CaptionResult(BaseModel):
    model_config = {"protected_namespaces": ()}
    caption:    str
    hashtags:   list[str]
    tone:       str
    model_used: str

# ── Tone Definitions ──────────────────────────────────────────────────
TONE_PROMPTS = {
    "chill": "relaxed, aesthetic, dreamy vibes. Use soft emojis like 🌊☀️🌅✨. Think golden hour and peaceful moments.",
    "fun": "energetic, exciting, playful. Use upbeat emojis like 🎉🔥💃🌴✨. Think good times with friends.",
    "trendy": "short, punchy, Gen-Z style. Use trendy emojis like 💅✨🫶💛. Think viral Twitter/TikTok posts. Keep it under 2 lines.",
    "emotional": "deep, cinematic, meaningful. Use thoughtful emojis like 🌅💫🤍. Think poetic and reflective.",
    "instagram": "POV style, relatable, viral Instagram format. Use emojis like 📸🌊✨. Start with 'POV:' or a hook.",
    "professional": "polished, brand-appropriate, authoritative. Use minimal emojis. Think LinkedIn or corporate brand voice.",
}

# ── Stage 1: ML Model Prediction (existing) ──────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "classes": list(predictor.le.classes_),
        "openrouter_configured": bool(OPENROUTER_API_KEY),
        "openrouter_model": OPENROUTER_MODEL,
    }

@app.post("/predict", response_model=PredictionResult)
async def predict(file: UploadFile = File(...)):
    logger.info(f"📥 Received upload: {file.filename} (type: {file.content_type})")
    
    # Relaxed validation: check for common image types OR trust filename extension if type is None
    allowed_types = {"image/jpeg", "image/png", "image/webp"}
    is_valid_type = file.content_type in allowed_types or file.content_type is None
    
    if not is_valid_type:
        logger.warning(f"❌ Invalid content type: {file.content_type}")
        raise HTTPException(400, f"Unsupported type: {file.content_type}")
    
    if file.content_type is None:
        logger.info(f"ℹ️ Content type is None, trusting filename: {file.filename}")

    try:
        contents = await file.read()
        logger.info(f"📦 File size: {len(contents)} bytes")
        
        if len(contents) > 10 * 1024 * 1024:
            logger.warning(f"❌ File too large: {len(contents)} bytes")
            raise HTTPException(400, "File exceeds 10 MB limit")

        image = Image.open(io.BytesIO(contents))
        logger.info(f"🖼️ Image loaded: {image.size} {image.mode}")
    except HTTPException:
        raise
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


# ── Stage 2: AI-Enhanced Caption Generation ──────────────────────────
@app.post("/generate-caption", response_model=CaptionResult)
async def generate_caption(
    file: UploadFile = File(...),
    tone: str = Form("chill"),
    hashtags: str = Form(""),
    category: str = Form(""),
):
    """
    Stage 2: Generate a social-media-ready caption using OpenRouter API.
    Takes the image + ML results from Stage 1 and enhances them with a selected tone.
    """
    logger.info(f"✨ Caption enhancement request: tone={tone}, category={category}")

    if not OPENROUTER_API_KEY:
        raise HTTPException(503, "OpenRouter API key not configured")

    if tone not in TONE_PROMPTS:
        raise HTTPException(400, f"Invalid tone: {tone}. Valid: {list(TONE_PROMPTS.keys())}")

    # Read and validate image
    try:
        contents = await file.read()
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(400, "File exceeds 10 MB limit")
        # Validate it's a real image
        Image.open(io.BytesIO(contents))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(400, f"Cannot read image: {e}")

    # Convert image to base64 for vision models
    img_b64 = base64.b64encode(contents).decode("utf-8")
    mime = file.content_type or "image/jpeg"

    # Build the prompt
    tone_desc = TONE_PROMPTS[tone]
    hashtag_list = hashtags if hashtags else "none provided"

    system_prompt = """You are a world-class social media content creator. 
You write viral captions for Instagram, Twitter, Facebook, and LinkedIn.
You always respond with ONLY valid JSON, no markdown, no code blocks."""

    user_prompt = f"""Analyze this image and write a social-media-ready caption.

Image classification: "{category}"
Existing hashtags: {hashtag_list}

Tone: "{tone}" — {tone_desc}

Rules:
1. Write a creative, engaging caption (2-4 lines max)
2. Include relevant emojis that match the tone
3. The caption should feel natural and human, not AI-generated
4. Include 10-15 relevant hashtags — use the provided ones and add more relevant ones
5. Each hashtag must start with #

Respond with ONLY this JSON format, no other text:
{{"caption": "your full caption text here with emojis", "hashtags": ["#tag1", "#tag2", "#tag3"]}}"""

    start = time.time()

    try:
        # Try with vision (image included)
        messages = [
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": user_prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{mime};base64,{img_b64}"},
                    },
                ],
            },
        ]

        logger.info(f"🚀 Sending to OpenRouter ({OPENROUTER_MODEL}) with vision...")
        response = _call_openrouter(messages)

        # If the model doesn't support vision, fall back to text-only
        if response is None:
            logger.warning("⚠️ Vision request failed, falling back to text-only...")
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ]
            response = _call_openrouter(messages)

        if response is None:
            raise HTTPException(503, "OpenRouter API request failed")

        # Parse the response
        result = _parse_caption_response(response, tone)
        ms = round((time.time() - start) * 1000, 2)
        logger.info(f"✅ Caption generated in {ms}ms: {result['caption'][:80]}...")

        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Caption generation failed: {e}", exc_info=True)
        raise HTTPException(500, f"Caption generation failed: {str(e)}")


def _call_openrouter(messages: list) -> str | None:
    """Call OpenRouter API with retry across fallback models on rate limits."""
    # Try each fallback model
    for model in FALLBACK_MODELS:
        try:
            logger.info(f"🔄 Trying model: {model}")
            resp = http_requests.post(
                OPENROUTER_API_URL,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model,
                    "messages": messages,
                    "max_tokens": 1000,
                    "temperature": 0.8,
                },
                timeout=60,
            )

            if resp.status_code == 429:
                logger.warning(f"⚠️ Model {model} rate-limited (429), trying next...")
                time.sleep(1)  # Brief pause before trying next model
                continue

            if resp.status_code != 200:
                logger.error(f"❌ OpenRouter API error ({resp.status_code}) for {model}: {resp.text[:300]}")
                continue

            data = resp.json()
            if "choices" in data and len(data["choices"]) > 0:
                content = data["choices"][0].get("message", {}).get("content", "")
                logger.info(f"✅ Got response from {model}: {content[:200]}")
                return content

            logger.error(f"❌ Unexpected response format from {model}: {data}")
            continue

        except Exception as e:
            logger.error(f"❌ Request to {model} failed: {e}")
            continue

    logger.error("❌ All models exhausted — no response obtained")
    return None


def _parse_caption_response(raw: str, tone: str) -> dict:
    """Parse the LLM response into a structured CaptionResult."""
    # Try to extract JSON from the response
    cleaned = raw.strip()

    # Remove markdown code block wrappers if present
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        # Remove first and last lines (``` markers)
        lines = [l for l in lines if not l.strip().startswith("```")]
        cleaned = "\n".join(lines).strip()

    try:
        data = json.loads(cleaned)
        caption = data.get("caption", "").strip()
        hashtags = data.get("hashtags", [])

        # Ensure hashtags start with #
        hashtags = [t if t.startswith("#") else f"#{t}" for t in hashtags if t.strip()]

        return {
            "caption": caption,
            "hashtags": hashtags,
            "tone": tone,
            "model_used": OPENROUTER_MODEL,
        }
    except json.JSONDecodeError:
        logger.warning(f"⚠️ Failed to parse JSON, extracting from raw text...")

        # Fallback: try to extract caption and hashtags from freeform text
        lines = raw.strip().split("\n")
        caption_lines = []
        hashtags = []

        for line in lines:
            stripped = line.strip()
            if stripped.startswith("#") and " " not in stripped:
                hashtags.append(stripped)
            elif "#" in stripped and len([w for w in stripped.split() if w.startswith("#")]) > 2:
                # Line with many hashtags
                for word in stripped.split():
                    if word.startswith("#"):
                        hashtags.append(word)
            else:
                if stripped:
                    caption_lines.append(stripped)

        return {
            "caption": "\n".join(caption_lines).strip() or raw.strip()[:500],
            "hashtags": hashtags[:20],
            "tone": tone,
            "model_used": OPENROUTER_MODEL,
        }
