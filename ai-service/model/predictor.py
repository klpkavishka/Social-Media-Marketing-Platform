import os, json, pickle, logging, sys
import numpy as np
from PIL import Image
from keras.models import load_model

logger = logging.getLogger(__name__)

class HashtagPredictor:
    def __init__(self):
        base = os.path.dirname(__file__)
        self.model      = load_model(os.path.join(base, "hashtag_model_v2.keras"))
        
        # Load trained label encoder strictly (no mock fallback).
        le_path = os.path.join(base, "label_encoder_v2.pkl")
        if not os.path.exists(le_path):
            raise FileNotFoundError(f"Label encoder not found at {le_path}")
        try:
            # Compatibility shim: some pickles reference numpy._core (NumPy 2 layout).
            import numpy

            if "numpy._core" not in sys.modules:
                sys.modules["numpy._core"] = numpy.core
            if "numpy._core.multiarray" not in sys.modules:
                sys.modules["numpy._core.multiarray"] = numpy.core.multiarray

            with open(le_path, "rb") as f:
                self.le = pickle.load(f)
            logger.info(f"✅ Label encoder loaded from {le_path}")
        except Exception as e:
            raise RuntimeError(f"Failed to load label encoder from {le_path}: {e}") from e
        
        with open(os.path.join(base, "hashtag_db_v2.json"), "r") as f:
            self.hashtag_db = json.load(f)
        self.img_size = 224
        print(f"Hashtag model loaded — classes: {list(self.le.classes_)}")

        self.caption_predictor = None
        try:
            from model.caption_predictor import caption_predictor

            self.caption_predictor = caption_predictor
            if caption_predictor.ready:
                logger.info("✅ Caption predictor integrated into HashtagPredictor")
            else:
                logger.warning("⚠️ Caption predictor loaded but not ready")
        except Exception as e:
            logger.error(f"❌ Caption predictor failed to initialize: {e}")

    def preprocess(self, image: Image.Image):
        image = image.convert("RGB").resize((self.img_size, self.img_size))
        arr   = np.array(image, dtype=np.float32)
        return np.expand_dims(arr, axis=0)

    def _augment(self, tensor: np.ndarray) -> np.ndarray:
        """Simple deterministic-free TTA without TensorFlow dependency."""
        aug = np.array(tensor, copy=True)
        if np.random.rand() > 0.5:
            aug = np.flip(aug, axis=2)
        # Brightness jitter in [0.9, 1.1]
        factor = 0.9 + (0.2 * np.random.rand())
        aug = np.clip(aug * factor, 0, 255)
        return aug.astype(np.float32)

    def predict(self, image: Image.Image, n_tta: int = 5) -> dict:
        tensor = self.preprocess(image)

        # Test-time augmentation: average 5 slightly varied predictions
        preds = []
        for _ in range(n_tta):
            aug = self._augment(tensor)
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
            logger.info("🤖 Generating caption with trained model...")
            caption = self.caption_predictor.predict(image, method="beam")
            logger.info(f"📝 Model output: {caption}")
        else:
            logger.warning("⚠️ Caption model not available")
        
        logger.info(f"✅ Final caption: {caption}")

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
