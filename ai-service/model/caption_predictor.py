"""
Image Caption Generator — EfficientNetB0 + LSTM

Loads the trained caption model (final_model.h5) and its tokenizer
to generate a single-word caption from uploaded images.

Architecture (from training notebook):
  - Feature Extractor: EfficientNetB0 (pretrained, frozen) → GlobalAveragePooling2D → 1280-dim
  - Caption Model: [image_features(1280), partial_seq(37)] → Bidirectional LSTM → next word prediction
  - Decoding: greedy or beam search
"""

import os
import pickle
import logging
import __main__
import numpy as np
from PIL import Image

# Force legacy tf.keras deserialization for final_model.h5 compatibility.
os.environ.setdefault("TF_USE_LEGACY_KERAS", "1")

logger = logging.getLogger(__name__)


class SimpleTokenizer:
    """Compatibility class for tokenizer.pkl created by gen_tokenizer.py."""

    def __init__(self):
        self.word_index = {}
        self.word_docs = {}
        self.document_count = 0
        self.oov_token = "<unk>"
        self.filters = '!"#$%&()*+,-./:;=?@[\\]^_`{|}~\t\n'
        self.lower = True

    def texts_to_sequences(self, texts):
        sequences = []
        for text in texts:
            t = text.lower() if self.lower else text
            for ch in self.filters:
                t = t.replace(ch, " ")
            seq = [self.word_index.get(w, 1) for w in t.split()]
            sequences.append(seq)
        return sequences


# Make class discoverable for legacy pickle entries pointing to __main__.SimpleTokenizer
__main__.SimpleTokenizer = SimpleTokenizer

# ── Constants from training notebook ──────────────────────────────────
IMG_SIZE = 224
FEATURE_DIM = 1280
MAX_LENGTH = 17
VOCAB_SIZE = 8110


class CaptionPredictor:
    """
    Generates a one-word caption using an EfficientNetB0 encoder + LSTM decoder.
    """

    def __init__(self):
        self.ready = False
        self.feature_extractor = None
        self.caption_model = None
        self.tokenizer = None
        self.idx_to_word = {}
        # User requested: remove fallback functions

        base = os.path.dirname(__file__)
        keras_model_path = os.path.join(base, "caption_model.keras")
        model_path = keras_model_path if os.path.exists(keras_model_path) else os.path.join(base, "final_model.h5")
        tokenizer_path = os.path.join(base, "tokenizer.pkl")

        # ── Check required files ──────────────────────────────────────
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Caption model not found at {model_path}")

        if not os.path.exists(tokenizer_path):
            raise FileNotFoundError(f"Tokenizer not found at {tokenizer_path}")

        self._load_models(model_path, tokenizer_path)
        self.ready = True
        logger.info("✅ Caption model loaded successfully")

    # Fallback logic removed per user request

    def _load_models(self, model_path: str, tokenizer_path: str):
        """Load feature extractor, caption model, and tokenizer."""
        try:
            from tensorflow.keras.applications import EfficientNetB0
            from tensorflow.keras.models import Model, load_model
            from tensorflow.keras.layers import GlobalAveragePooling2D, Layer, Add
            from tensorflow.keras import mixed_precision
            import tensorflow as tf
        except ImportError:
            raise RuntimeError("TensorFlow not installed.")

        # ── 0. Define AttentionLayer ──────────────────────────────────
        class AttentionLayer(Layer):
            def __init__(self, units=256, **kwargs):
                super().__init__(**kwargs)
                self.units = units

            def build(self, input_shape):
                dim = input_shape[-1]
                self.W = self.add_weight(name='W', shape=(dim, self.units),
                                         initializer='glorot_uniform', trainable=True)
                self.b = self.add_weight(name='b', shape=(self.units,),
                                         initializer='zeros', trainable=True)
                self.V = self.add_weight(name='V', shape=(self.units, 1),
                                         initializer='glorot_uniform', trainable=True)
                super().build(input_shape)

            def call(self, inputs):
                score = tf.nn.tanh(tf.matmul(inputs, self.W) + self.b)
                weights = tf.nn.softmax(tf.matmul(score, self.V), axis=1)
                context = tf.reduce_sum(weights * inputs, axis=1)
                return context

            def get_config(self):
                cfg = super().get_config()
                cfg.update({'units': self.units})
                return cfg

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
        mixed_precision.set_global_policy("float32")
        try:
            # Compatibility patch for legacy H5 configs where dtype policy is serialized inconsistently.
            from keras.src import dtype_policies
            from keras.src.dtype_policies import dtype_policy as dtype_policy_module

            original_get = dtype_policies.get
            original_deserialize = dtype_policies.deserialize
            original_parse_name = dtype_policy_module.DTypePolicy._parse_name

            def patched_get(identifier):
                policy = original_get(identifier)
                if isinstance(policy, str):
                    if policy == "Policy":
                        return dtype_policies.DTypePolicy("float32")
                    return dtype_policies.DTypePolicy(policy)
                return policy

            def patched_deserialize(config, custom_objects=None):
                policy = original_deserialize(config, custom_objects=custom_objects)
                if isinstance(policy, str):
                    if policy == "Policy":
                        return dtype_policies.DTypePolicy("float32")
                    return dtype_policies.DTypePolicy(policy)
                return policy

            def patched_parse_name(self, name):
                # Some legacy exports serialize dtype policy as the literal word "Policy".
                if name == "Policy":
                    name = "float32"
                return original_parse_name(self, name)

            dtype_policies.get = patched_get
            dtype_policies.deserialize = patched_deserialize
            dtype_policy_module.DTypePolicy._parse_name = patched_parse_name
            from keras.layers import Embedding, LSTM, Bidirectional, LayerNormalization

            class LegacyEmbedding(Embedding):
                @classmethod
                def from_config(cls, config):
                    cfg = dict(config)
                    cfg.pop("batch_input_shape", None)
                    cfg.pop("input_length", None)
                    return super().from_config(cfg)

            custom_objects = {
                "Embedding": LegacyEmbedding,
                "LSTM": LSTM,
                "Bidirectional": Bidirectional,
                "LayerNormalization": LayerNormalization,
            }

            try:
                self.caption_model = load_model(
                    model_path,
                    compile=False,
                    custom_objects=custom_objects,
                    safe_mode=False,
                )
            except TypeError:
                self.caption_model = load_model(
                    model_path,
                    compile=False,
                    custom_objects=custom_objects,
                )
            logger.info("   Caption model loaded successfully with tf.keras.models.load_model")
        except Exception as first_err:
            logger.warning(f"   Standard load failed: {first_err}, attempting legacy H5 loader...")
            try:
                import h5py
                from tensorflow.python.keras.saving import hdf5_format
                from tensorflow.keras.layers import (
                    BatchNormalization,
                    Bidirectional,
                    Dense,
                    Dropout,
                    Embedding,
                    Input,
                    LSTM,
                    LayerNormalization,
                )

                class LegacyEmbedding(Embedding):
                    @classmethod
                    def from_config(cls, config):
                        cfg = dict(config)
                        cfg.pop("batch_input_shape", None)
                        cfg.pop("input_length", None)
                        if cfg.get("dtype") == "Policy":
                            cfg["dtype"] = "float32"
                        return super().from_config(cfg)

                custom_objects = {
                    "BatchNormalization": BatchNormalization,
                    "Bidirectional": Bidirectional,
                    "Dense": Dense,
                    "Dropout": Dropout,
                    "Embedding": LegacyEmbedding,
                    "Input": Input,
                    "LSTM": LSTM,
                    "LayerNormalization": LayerNormalization,
                    "AttentionLayer": AttentionLayer,
                    "Add": Add
                }

                with h5py.File(model_path, mode="r") as h5_file:
                    self.caption_model = hdf5_format.load_model_from_hdf5(
                        h5_file, custom_objects=custom_objects, compile=False
                    )
                logger.info("   Caption model loaded successfully with legacy H5 loader")
            except Exception as second_err:
                logger.warning(f"   Legacy load failed: {second_err}, attempting architecture+weights load...")
                try:
                    from tensorflow.keras.layers import (
                        Input,
                        Dense,
                        Dropout,
                        Embedding,
                        LSTM,
                        Bidirectional,
                        BatchNormalization,
                        LayerNormalization,
                        Add,
                    )
                    from tensorflow.keras.models import Model
                    from tensorflow.keras.regularizers import l2

                    reg = l2(1e-4)
                    
                    # Image Branch
                    img_input = Input(shape=(FEATURE_DIM,), name="image_input")
                    img_proj = Dense(512, activation="relu", kernel_regularizer=reg, name="img_proj")(img_input)
                    img_bn = BatchNormalization(name="img_bn")(img_proj)
                    img_drop = Dropout(0.3, name="img_drop")(img_bn)

                    # Sequence Branch
                    seq_input = Input(shape=(MAX_LENGTH,), name="seq_input")
                    emb = Embedding(VOCAB_SIZE, 512, mask_zero=True, name="embedding")(seq_input)
                    emb_drop = Dropout(0.3, name="emb_drop")(emb)
                    bilstm = Bidirectional(LSTM(512, return_sequences=True), name="bilstm")(emb_drop)
                    context = AttentionLayer(units=512, name="attention")(bilstm)
                    
                    seq_proj = Dense(512, activation="relu", kernel_regularizer=reg, name="seq_proj")(context)
                    seq_bn = BatchNormalization(name="seq_bn")(seq_proj)
                    seq_drop = Dropout(0.3, name="seq_drop")(seq_bn)

                    # Fusion
                    merged = Add(name="fusion_add")([img_drop, seq_drop])
                    x = Dense(512, activation="relu", kernel_regularizer=reg, name="fusion_dense")(merged)
                    x = BatchNormalization(name="fusion_bn")(x)
                    x = Dropout(0.3, name="fusion_drop")(x)
                    
                    output = Dense(VOCAB_SIZE, activation="softmax", dtype="float32", name="output")(x)

                    self.caption_model = Model(
                        inputs=[img_input, seq_input],
                        outputs=output,
                        name="ImageCaptionModel",
                    )
                    self.caption_model.load_weights(model_path, by_name=True, skip_mismatch=False)
                    logger.info("   Caption model loaded via architecture+weights fallback")
                except Exception as third_err:
                    logger.error(f"   All caption load methods failed: {third_err}")
                    raise RuntimeError(
                        f"Could not load caption model: {third_err}"
                    ) from third_err

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

    def generate_caption_greedy(self, image: Image.Image, max_words: int = 12) -> str:
        """Generate a multi-word caption using greedy decoding."""
        if not self.ready:
            return ""

        try:
            from tensorflow.keras.preprocessing.sequence import pad_sequences

            feature = self.extract_features(image)
            words = []
            seq = self.tokenizer.texts_to_sequences(["startseq"])[0]
            min_confidence = 0.001

            # Generate words greedily until endseq or max_words
            for step in range(max_words):
                seq_padded = pad_sequences([seq], maxlen=MAX_LENGTH, padding="post")
                pred = self.caption_model.predict([np.array([feature]), seq_padded], verbose=0)[0]
                word_idx = int(np.argmax(pred))
                confidence = float(pred[word_idx])
                word = self.idx_to_word.get(word_idx, "").strip()

                # Stop on special tokens or low confidence
                if not word or word in ("startseq", "endseq", "") or confidence < min_confidence:
                    break
                
                words.append(word)
                seq.append(word_idx)

            caption = " ".join(words).strip()
            return caption if caption else "image"

        except Exception as e:
            logger.error(f"❌ Caption generation failed: {e}", exc_info=True)
            return "image"

    def generate_caption_beam(
        self, image: Image.Image, beam_width: int = 5, max_words: int = 12
    ) -> str:
        """Generate a multi-word caption using beam search."""
        if not self.ready:
            return ""

        try:
            from tensorflow.keras.preprocessing.sequence import pad_sequences

            feature = self.extract_features(image)
            min_confidence = 0.001
            
            # Start with startseq token
            startseq_idx = self.tokenizer.word_index.get("startseq", 2)
            endseq_idx = self.tokenizer.word_index.get("endseq", -1)
            sequences = [([startseq_idx], 0.0)]  # (sequence of indices, cumulative score)
            
            logger.info(f"📊 Beam search: beam_width={beam_width}, max_words={max_words}")

            # Generate words step by step
            for step in range(max_words):
                all_candidates = []
                
                for seq_indices, score in sequences:
                    # Skip if sequence already ended with endseq
                    if seq_indices[-1] == endseq_idx:
                        all_candidates.append((seq_indices, score))
                        continue

                    # Predict next word
                    seq_padded = pad_sequences(
                        [seq_indices], maxlen=MAX_LENGTH, padding="post"
                    )
                    pred = self.caption_model.predict(
                        [np.array([feature]), seq_padded], verbose=0
                    )[0]

                    # Get top beam_width candidates
                    top_indices = np.argsort(pred)[-beam_width:]
                    
                    for idx in reversed(top_indices):
                        confidence = float(pred[idx])
                        
                        # Skip low confidence predictions
                        if confidence < min_confidence:
                            continue
                        
                        word = self.idx_to_word.get(idx, "").strip()
                        
                        # Skip empty, special start token, but allow endseq
                        if not word or word == "startseq":
                            continue
                        
                        new_seq = seq_indices + [idx]
                        new_score = score - np.log(confidence + 1e-8)
                        all_candidates.append((new_seq, new_score))

                if not all_candidates:
                    logger.warning(f"No valid candidates at step {step}, stopping")
                    break

                # Keep top beam_width sequences by score
                sequences = sorted(all_candidates, key=lambda x: x[1])[:beam_width]

                # Check if all sequences ended with endseq
                if all(seq[-1] == endseq_idx for seq, _ in sequences):
                    logger.info(f"All sequences ended at step {step}")
                    break

            # Decode best sequence from indices
            best_seq = sequences[0][0] if sequences else [startseq_idx]
            words = [
                self.idx_to_word.get(idx, "")
                for idx in best_seq
                if self.idx_to_word.get(idx, "") not in ("startseq", "endseq", "")
            ]
            
            caption = " ".join(words).strip()
            logger.info(f"✅ Beam search caption: '{caption}' ({len(words)} words)")
            return caption if caption else "image"

        except Exception as e:
            logger.error(f"❌ Beam caption generation failed: {e}", exc_info=True)
            return "image"

    def predict(self, image: Image.Image, method: str = "beam") -> str:
        """
        Generate a caption for the given image.
        method: 'greedy' or 'beam'
        """
        if not self.ready:
            return ""

        if method == "greedy":
            return self.generate_caption_greedy(image)
        else:
            return self.generate_caption_beam(image)


# ── Singleton instance — loads once at import time ────────────────────
caption_predictor = CaptionPredictor()
