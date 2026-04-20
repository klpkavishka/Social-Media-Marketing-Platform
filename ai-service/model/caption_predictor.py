"""
Image Caption Generator — EfficientNetB0 + LSTM

Loads the trained caption model (final_model.h5) and its tokenizer
to generate descriptive captions for uploaded images.

Architecture (from training notebook):
  - Feature Extractor: EfficientNetB0 (pretrained, frozen) → GlobalAveragePooling2D → 1280-dim
  - Caption Model: [image_features(1280), partial_seq(37)] → next word prediction
  - Decoding: greedy or beam search
"""

import os
import pickle
import logging
import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)

# ── Constants from training notebook ──────────────────────────────────
IMG_SIZE = 224
FEATURE_DIM = 1280
MAX_LENGTH = 37
VOCAB_SIZE = 8780


class CaptionPredictor:
    """
    Generates natural-language captions for images using an
    EfficientNetB0 encoder + LSTM decoder trained on Flickr8k.
    """

    def __init__(self):
        self.ready = False
        self.feature_extractor = None
        self.caption_model = None
        self.tokenizer = None
        self.idx_to_word = {}

        base = os.path.dirname(__file__)
        model_path = os.path.join(base, "final_model.h5")
        tokenizer_path = os.path.join(base, "tokenizer.pkl")

        # ── Check required files ──────────────────────────────────────
        if not os.path.exists(model_path):
            logger.warning(f"⚠️  Caption model not found at {model_path}")
            return

        if not os.path.exists(tokenizer_path):
            logger.warning(
                f"⚠️  Tokenizer not found at {tokenizer_path}. "
                f"Caption generation will be disabled. "
                f"Please place tokenizer.pkl in the model/ directory."
            )
            return

        try:
            self._load_models(model_path, tokenizer_path)
            self.ready = True
            logger.info("✅ Caption model loaded successfully")
        except Exception as e:
            logger.error(f"❌ Failed to load caption model: {e}", exc_info=True)

    def _load_models(self, model_path: str, tokenizer_path: str):
        """Load feature extractor, caption model, and tokenizer."""
        import tensorflow as tf
        from tensorflow.keras.applications import EfficientNetB0
        from tensorflow.keras.models import Model, load_model
        from tensorflow.keras.layers import GlobalAveragePooling2D

        # ── 1. Build feature extractor (same as training notebook) ────
        logger.info("🔧 Building EfficientNetB0 feature extractor...")
        base_cnn = EfficientNetB0(
            weights="imagenet",
            include_top=False,
            input_shape=(IMG_SIZE, IMG_SIZE, 3),
        )
        base_cnn.trainable = False
        self.feature_extractor = Model(
            inputs=base_cnn.input,
            outputs=GlobalAveragePooling2D()(base_cnn.output),
        )
        logger.info(
            f"   Feature extractor output shape: {self.feature_extractor.output_shape}"
        )

        # ── 2. Load trained caption model ─────────────────────────────
        logger.info(f"🔧 Loading caption model from {model_path}...")
        self.caption_model = load_model(model_path, compile=False)
        logger.info("   Caption model loaded")

        # ── 3. Load tokenizer ─────────────────────────────────────────
        logger.info(f"🔧 Loading tokenizer from {tokenizer_path}...")
        with open(tokenizer_path, "rb") as f:
            self.tokenizer = pickle.load(f)
        self.idx_to_word = {v: k for k, v in self.tokenizer.word_index.items()}
        logger.info(f"   Tokenizer loaded — vocab size: {len(self.tokenizer.word_index) + 1}")

    def extract_features(self, image: Image.Image) -> np.ndarray:
        """Extract a 1280-dim feature vector from an image using EfficientNetB0."""
        from tensorflow.keras.applications.efficientnet import preprocess_input

        img = image.convert("RGB").resize((IMG_SIZE, IMG_SIZE))
        arr = np.array(img, dtype=np.float32)
        arr = np.expand_dims(arr, axis=0)
        arr = preprocess_input(arr)
        feature = self.feature_extractor.predict(arr, verbose=0)
        return feature.flatten()

    def generate_caption_greedy(self, image: Image.Image) -> str:
        """Generate a caption using greedy decoding."""
        if not self.ready:
            return ""

        try:
            from tensorflow.keras.preprocessing.sequence import pad_sequences

            feature = self.extract_features(image)

            in_text = "startseq"
            for _ in range(MAX_LENGTH):
                seq = self.tokenizer.texts_to_sequences([in_text])[0]
                seq = pad_sequences([seq], maxlen=MAX_LENGTH, padding="post")
                pred = self.caption_model.predict(
                    [np.array([feature]), seq], verbose=0
                )
                word_idx = np.argmax(pred[0])
                word = self.idx_to_word.get(word_idx, "")
                if word == "endseq" or word == "":
                    break
                in_text += " " + word

            caption = in_text.replace("startseq", "").strip()
            return caption

        except Exception as e:
            logger.error(f"❌ Caption generation failed: {e}", exc_info=True)
            return ""

    def generate_caption_beam(
        self, image: Image.Image, beam_width: int = 3
    ) -> str:
        """Generate a caption using beam search for better quality."""
        if not self.ready:
            return ""

        try:
            from tensorflow.keras.preprocessing.sequence import pad_sequences

            feature = self.extract_features(image)
            sequences = [(["startseq"], 0.0)]

            for _ in range(MAX_LENGTH):
                all_candidates = []
                for seq_words, score in sequences:
                    if seq_words[-1] == "endseq":
                        all_candidates.append((seq_words, score))
                        continue

                    seq_encoded = self.tokenizer.texts_to_sequences(
                        [" ".join(seq_words)]
                    )[0]
                    seq_padded = pad_sequences(
                        [seq_encoded], maxlen=MAX_LENGTH, padding="post"
                    )
                    pred = self.caption_model.predict(
                        [np.array([feature]), seq_padded], verbose=0
                    )[0]

                    top_indices = np.argsort(pred)[-beam_width:]
                    for idx in top_indices:
                        word = self.idx_to_word.get(idx, "")
                        if word == "":
                            continue
                        new_score = score - np.log(pred[idx] + 1e-8)
                        all_candidates.append((seq_words + [word], new_score))

                if not all_candidates:
                    break
                sequences = sorted(all_candidates, key=lambda x: x[1])[
                    :beam_width
                ]

                if all(s[-1] == "endseq" for s, _ in sequences):
                    break

            best = sequences[0][0]
            caption = " ".join(
                w for w in best if w not in ("startseq", "endseq")
            )
            return caption

        except Exception as e:
            logger.error(f"❌ Beam caption generation failed: {e}", exc_info=True)
            return ""

    def predict(self, image: Image.Image, method: str = "beam") -> str:
        """
        Generate a caption for the given image.
        method: 'greedy' or 'beam' (default beam for better quality)
        """
        if not self.ready:
            return ""

        if method == "greedy":
            return self.generate_caption_greedy(image)
        else:
            return self.generate_caption_beam(image)


# ── Singleton instance — loads once at import time ────────────────────
caption_predictor = CaptionPredictor()
