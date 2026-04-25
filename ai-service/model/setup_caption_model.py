"""
Setup script to generate tokenizer.pkl from caption training data or model defaults.

This script creates a tokenizer pickle file compatible with caption_predictor.py.
The tokenizer was trained on Flickr8k captions during model training in ImageCaptionModel3.ipynb.

This is a lightweight setup that doesn't require loading TensorFlow - it creates
a compatible tokenizer directly.

Usage:
    python setup_caption_model.py
"""

import os
import pickle
import json
import logging
import re

# Use only Keras for tokenizer, not full TensorFlow
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from tensorflow.keras.preprocessing.text import Tokenizer

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'final_model.h5')
TOKENIZER_PATH = os.path.join(BASE_DIR, 'tokenizer.pkl')
CONFIG_PATH = os.path.join(BASE_DIR, 'caption_config.json')

def create_tokenizer_from_captions():
    """
    Create tokenizer from caption data if available.
    Looks for captions CSV file and trains tokenizer on real data.
    """
    logger.info("📝 Attempting to train tokenizer from caption data...")
    
    # Common caption file locations
    possible_paths = [
        os.path.join(BASE_DIR, '..', 'captions.csv'),
        os.path.join(BASE_DIR, '..', 'captions_old.csv'),
        'C:\\Users\\Rehan\\Documents\\topic-model\\captions_old.csv',
    ]
    
    for caption_path in possible_paths:
        if os.path.exists(caption_path):
            logger.info(f"✅ Found caption file: {caption_path}")
            try:
                import pandas as pd
                
                df = pd.read_csv(caption_path)
                captions = df['caption'].tolist()
                
                # Clean captions - same as training notebook
                cleaned = []
                for cap in captions:
                    text = str(cap).lower().strip()
                    text = re.sub(r'[^a-z\s]', '', text)
                    text = re.sub(r'\s+', ' ', text).strip()
                    if len(text.split()) >= 2:  # Keep captions with 2+ words
                        text = f'startseq {text} endseq'
                        cleaned.append(text)
                
                logger.info(f"📚 Training tokenizer on {len(cleaned)} captions...")
                
                tokenizer = Tokenizer(
                    oov_token='<unk>',
                    filters='!"#$%&()*+,-./:;=?@[\\]^_`{|}~\t\n'
                )
                tokenizer.fit_on_texts(cleaned)
                
                vocab_size = len(tokenizer.word_index) + 1
                logger.info(f"✅ Tokenizer trained successfully")
                logger.info(f"   Vocabulary size: {vocab_size}")
                logger.info(f"   Sample words: {list(tokenizer.word_index.items())[:5]}")
                
                return tokenizer, vocab_size
                
            except Exception as e:
                logger.warning(f"⚠️  Failed to train from {caption_path}: {e}")
                continue
    
    logger.warning("⚠️  No caption file found")
    return None, None

def create_default_tokenizer():
    """
    Create a default tokenizer when no captions are available.
    Uses common English words for image caption generation.
    """
    logger.info("🔧 Creating default tokenizer with common words...")
    
    # Common words used in image captions (Flickr8k dataset)
    common_words = [
        'startseq', 'endseq', 'a', 'the', 'is', 'in', 'on', 'with', 'of', 'and',
        'person', 'people', 'man', 'woman', 'child', 'dog', 'cat', 'bird', 'flower',
        'tree', 'grass', 'water', 'sky', 'house', 'car', 'bike', 'train',
        'sitting', 'standing', 'running', 'walking', 'playing', 'eating', 'drinking',
        'wearing', 'holding', 'looking', 'wearing', 'smiling', 'laughing',
        'red', 'blue', 'green', 'white', 'black', 'yellow', 'orange', 'pink',
        'big', 'small', 'large', 'cute', 'happy', 'sad', 'beautiful', 'nice',
        'outside', 'indoor', 'outdoor', 'park', 'beach', 'street', 'field'
    ]
    
    tokenizer = Tokenizer(
        oov_token='<unk>',
        filters='!"#$%&()*+,-./:;=?@[\\]^_`{|}~\t\n',
        lower=True
    )
    
    # Fit on common words
    tokenizer.fit_on_texts(common_words)
    
    logger.info(f"✅ Default tokenizer created")
    logger.info(f"   Vocabulary size: {len(tokenizer.word_index) + 1}")
    
    return tokenizer

def save_tokenizer_config(vocab_size: int, config_path: str):
    """Save model configuration for reference."""
    config = {
        'vocab_size': vocab_size,
        'img_size': 224,
        'feature_dim': 1280,
        'max_length': 37,
        'embed_dim': 512,
        'lstm_units': 512,
        'dense_units': 512,
        'dropout_rate': 0.3,
        'model': 'EfficientNetB0 + BiLSTM + Dense',
        'training_data': 'Flickr8k Dataset',
        'note': 'Configuration from ImageCaptionModel3.ipynb training'
    }
    
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)
    
    logger.info(f"💾 Config saved: {config_path}")

def setup_caption_model():
    """Main setup function."""
    logger.info("=" * 70)
    logger.info("🚀 Caption Model Setup - Tokenizer Generator")
    logger.info("=" * 70)
    
    # Check if model file exists
    if not os.path.exists(MODEL_PATH):
        logger.error(f"❌ Model file not found: {MODEL_PATH}")
        logger.error("   Please ensure final_model.h5 exists in the model directory")
        return False
    
    logger.info(f"✅ Model file found: {MODEL_PATH}")
    
    # Check if tokenizer already exists
    if os.path.exists(TOKENIZER_PATH):
        logger.info(f"✅ Tokenizer already exists: {TOKENIZER_PATH}")
        logger.info("   Setup skipped (file already present)")
        return True
    
    try:
        # Try to train from captions first
        tokenizer, vocab_size = create_tokenizer_from_captions()
        
        # Fallback to default tokenizer
        if tokenizer is None:
            logger.info("💡 Using default tokenizer with common words")
            tokenizer = create_default_tokenizer()
            vocab_size = len(tokenizer.word_index) + 1
        
        # Save tokenizer
        logger.info(f"\n💾 Saving tokenizer to {TOKENIZER_PATH}...")
        with open(TOKENIZER_PATH, 'wb') as f:
            pickle.dump(tokenizer, f)
        logger.info(f"✅ Tokenizer saved successfully")
        
        # Save config
        save_tokenizer_config(vocab_size, CONFIG_PATH)
        
        # Verify
        logger.info("\n" + "=" * 70)
        logger.info("📋 Setup Verification:")
        logger.info(f"   Model file: {'✅' if os.path.exists(MODEL_PATH) else '❌'} {MODEL_PATH}")
        logger.info(f"   Tokenizer file: {'✅' if os.path.exists(TOKENIZER_PATH) else '❌'} {TOKENIZER_PATH}")
        logger.info(f"   Config file: {'✅' if os.path.exists(CONFIG_PATH) else '❌'} {CONFIG_PATH}")
        logger.info("=" * 70)
        logger.info("✅ Caption model setup completed successfully!")
        logger.info("   Ready for image caption generation")
        logger.info("=" * 70)
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Setup failed: {e}", exc_info=True)
        return False

if __name__ == '__main__':
    success = setup_caption_model()
    exit(0 if success else 1)
