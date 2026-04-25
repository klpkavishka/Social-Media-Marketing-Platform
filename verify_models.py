#!/usr/bin/env python3
"""
Verification script - Test if caption and hashtag generation is properly set up.
Run this to verify all models and configurations are in place before deploying.

Usage:
    python verify_models.py
"""

import os
import sys
import pickle
from pathlib import Path

BASE_DIR = Path(__file__).parent / 'ai-service' / 'model'

def check_file(filepath, description):
    """Check if a file exists."""
    exists = filepath.exists()
    status = "✅" if exists else "❌"
    size_info = f" ({filepath.stat().st_size / 1024 / 1024:.1f}MB)" if exists else ""
    print(f"{status} {description}: {filepath.name}{size_info}")
    return exists

def check_tokenizer_loadable(filepath):
    """Check if tokenizer can be loaded."""
    try:
        with open(filepath, 'rb') as f:
            tokenizer = pickle.load(f)
        
        # Check expected attributes
        has_word_index = hasattr(tokenizer, 'word_index')
        has_oov_token = hasattr(tokenizer, 'oov_token')
        
        if has_word_index and has_oov_token:
            vocab_size = len(tokenizer.word_index)
            print(f"   ✅ Tokenizer loadable: vocab_size={vocab_size}")
            return True
        else:
            print(f"   ❌ Tokenizer missing expected attributes")
            return False
    except Exception as e:
        print(f"   ❌ Error loading tokenizer: {e}")
        return False

def check_model_file(filepath):
    """Check if H5 model file is valid."""
    try:
        # Just check if it's a valid HDF5 file
        with open(filepath, 'rb') as f:
            magic = f.read(8)
            if magic.startswith(b'\x89HDF'):
                print(f"   ✅ Model file is valid HDF5 format")
                return True
            else:
                print(f"   ❌ Model file is not valid HDF5 format")
                return False
    except Exception as e:
        print(f"   ❌ Error reading model: {e}")
        return False

def main():
    """Run verification."""
    print("\n" + "=" * 70)
    print("🔍 CAPTION & HASHTAG GENERATION - VERIFICATION REPORT")
    print("=" * 70 + "\n")
    
    results = {}
    
    # Check caption model files
    print("📚 Caption Model Files:")
    print("-" * 70)
    
    model_h5 = BASE_DIR / 'final_model.h5'
    results['model_h5'] = check_file(model_h5, "Caption model")
    if results['model_h5']:
        check_model_file(model_h5)
    
    tokenizer_pkl = BASE_DIR / 'tokenizer.pkl'
    results['tokenizer'] = check_file(tokenizer_pkl, "Tokenizer")
    if results['tokenizer']:
        results['tokenizer_loadable'] = check_tokenizer_loadable(tokenizer_pkl)
    
    caption_predictor = BASE_DIR / 'caption_predictor.py'
    results['caption_code'] = check_file(caption_predictor, "Caption predictor code")
    
    caption_config = BASE_DIR / 'caption_config.json'
    results['caption_config'] = check_file(caption_config, "Caption config")
    
    # Check hashtag model files
    print("\n🏷️  Hashtag Model Files:")
    print("-" * 70)
    
    hashtag_model = BASE_DIR / 'hashtag_model_v2.keras'
    results['hashtag_model'] = check_file(hashtag_model, "Hashtag model")
    if results['hashtag_model']:
        check_model_file(hashtag_model)
    
    label_encoder = BASE_DIR / 'label_encoder_v2.pkl'
    results['label_encoder'] = check_file(label_encoder, "Label encoder")
    if results['label_encoder']:
        results['label_encoder_loadable'] = check_tokenizer_loadable(label_encoder)
    
    hashtag_db = BASE_DIR / 'hashtag_db_v2.json'
    results['hashtag_db'] = check_file(hashtag_db, "Hashtag database")
    
    predictor_code = BASE_DIR / 'predictor.py'
    results['predictor_code'] = check_file(predictor_code, "Predictor code")
    
    # Check main API files
    print("\n🔌 AI Service API Files:")
    print("-" * 70)
    
    main_py = BASE_DIR.parent / 'main.py'
    results['main_api'] = check_file(main_py, "Main API (main.py)")
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 SUMMARY")
    print("=" * 70)
    
    critical_files = [
        ('model_h5', 'final_model.h5 (caption model)'),
        ('tokenizer', 'tokenizer.pkl (vocabulary)'),
        ('hashtag_model', 'hashtag_model_v2.keras (hashtag classifier)'),
        ('label_encoder', 'label_encoder_v2.pkl (hashtag categories)'),
    ]
    
    all_critical_present = True
    for key, name in critical_files:
        status = "✅" if results.get(key, False) else "❌"
        print(f"{status} {name}")
        if not results.get(key, False):
            all_critical_present = False
    
    # Check loadability
    print("\n📋 Model Loadability:")
    print("-" * 70)
    
    tokenizer_ok = results.get('tokenizer_loadable', False)
    label_encoder_ok = results.get('label_encoder_loadable', False)
    
    print(f"{'✅' if tokenizer_ok else '❌'} Tokenizer can be loaded")
    print(f"{'✅' if label_encoder_ok else '❌'} Label encoder can be loaded")
    
    # Final status
    print("\n" + "=" * 70)
    if all_critical_present and tokenizer_ok and label_encoder_ok:
        print("✅ ALL CHECKS PASSED - READY FOR DEPLOYMENT")
        print("\nCaption & Hashtag generation should work correctly!")
        print("Next steps:")
        print("  1. docker-compose up")
        print("  2. Open http://localhost:3000")
        print("  3. Upload an image to test")
        return 0
    else:
        print("❌ SOME CHECKS FAILED - SETUP INCOMPLETE")
        print("\nPlease check the missing files above.")
        print("Missing critical files:")
        for key, name in critical_files:
            if not results.get(key, False):
                print(f"  - {name}")
        return 1
        
if __name__ == '__main__':
    sys.exit(main())
