import os, json, pickle, logging
import numpy as np
from PIL import Image
import tensorflow as tf
from keras.models import load_model

logger = logging.getLogger(__name__)

class HashtagPredictor:
    def __init__(self):
        base = os.path.dirname(__file__)
        self.model      = load_model(os.path.join(base, "hashtag_model_v2.keras"))
        with open(os.path.join(base, "label_encoder_v2.pkl"), "rb") as f:
            self.le = pickle.load(f)
        with open(os.path.join(base, "hashtag_db_v2.json"), "r") as f:
            self.hashtag_db = json.load(f)
        self.img_size = 224
        print(f"Hashtag model loaded — classes: {list(self.le.classes_)}")

        # ── Load caption model (graceful — works without it) ──────────
        self.caption_predictor = None
        try:
            from model.caption_predictor import caption_predictor
            self.caption_predictor = caption_predictor
            if caption_predictor.ready:
                logger.info("✅ Caption predictor integrated into HashtagPredictor")
            else:
                logger.warning("⚠️  Caption predictor loaded but NOT ready (missing tokenizer?)")
        except Exception as e:
            logger.warning(f"⚠️  Caption predictor not available: {e}")

    def preprocess(self, image: Image.Image):
        image = image.convert("RGB").resize((self.img_size, self.img_size))
        arr   = np.array(image, dtype=np.float32)
        return np.expand_dims(arr, axis=0)

    def predict(self, image: Image.Image, n_tta: int = 5) -> dict:
        tensor = self.preprocess(image)

        # Test-time augmentation: average 5 slightly varied predictions
        preds = []
        for _ in range(n_tta):
            aug  = tf.image.random_flip_left_right(tensor)
            aug  = tf.image.random_brightness(aug, 0.1)
            preds.append(self.model.predict(aug, verbose=0)[0])

        avg = np.mean(preds, axis=0)

        top_idx = avg.argsort()[::-1][:3]
        top3 = [
            {"category": self.le.classes_[i], "confidence": round(float(avg[i]) * 100, 2)}
            for i in top_idx
        ]

        top_cat  = top3[0]["category"]
        top_conf = top3[0]["confidence"]

        # Build hashtag list from DB
        tags, seen = [], set()
        for tag in self.hashtag_db.get(top_cat, []):
            if tag not in seen:
                tags.append(tag); seen.add(tag)

        # Blend in secondary category if confident enough
        if len(top3) > 1 and top3[1]["confidence"] > 20:
            for tag in self.hashtag_db.get(top3[1]["category"], [])[:5]:
                if tag not in seen:
                    tags.append(tag); seen.add(tag)

        # ── Generate caption using the caption model ──────────────────
        caption = ""
        if self.caption_predictor and self.caption_predictor.ready:
            try:
                logger.info("🤖 Generating image caption...")
                caption = self.caption_predictor.predict(image, method="beam")
                logger.info(f"📝 Caption generated: {caption}")
            except Exception as e:
                logger.error(f"❌ Caption generation failed: {e}", exc_info=True)
                caption = ""

        return {
            "category":     top_cat,
            "confidence":   top_conf,
            "reliable":     top_conf >= 60.0,
            "top3":         top3,
            "hashtags":     ["#" + t for t in tags[:20]],
            "hashtag_count": len(tags[:20]),
            "caption":      caption,
        }

predictor = HashtagPredictor()   # loads once at import time
