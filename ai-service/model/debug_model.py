#!/usr/bin/env python3
"""
Debug script to inspect the trained caption model and tokenizer.
Run this to understand what architecture is actually loaded from final_model.h5.
"""

import os
import pickle
import sys
import numpy as np
from pathlib import Path

# Force legacy keras for compatibility
os.environ.setdefault("TF_USE_LEGACY_KERAS", "1")

print("=" * 80)
print("🔍 CAPTION MODEL & TOKENIZER DEBUG")
print("=" * 80)

# ============================================================================
# Define SimpleTokenizer for pickle compatibility
# ============================================================================
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

# Register for pickle compatibility
sys.modules[__name__].SimpleTokenizer = SimpleTokenizer

# ============================================================================
# PART 1: Inspect tokenizer.pkl
# ============================================================================
print("\n📦 PART 1: TOKENIZER INSPECTION")
print("-" * 80)

base_dir = os.path.dirname(__file__)
tokenizer_path = os.path.join(base_dir, "tokenizer.pkl")

if not os.path.exists(tokenizer_path):
    print(f"❌ Tokenizer not found at {tokenizer_path}")
    sys.exit(1)

try:
    with open(tokenizer_path, "rb") as f:
        tokenizer = pickle.load(f)
    
    print(f"✅ Tokenizer loaded from {tokenizer_path}")
    print(f"   Type: {type(tokenizer)}")
    print(f"   Tokenizer class: {tokenizer.__class__.__name__}")
    
    # Inspect word_index
    if hasattr(tokenizer, 'word_index'):
        vocab_size = len(tokenizer.word_index) + 1  # +1 for 0 (padding)
        print(f"   Word index size: {len(tokenizer.word_index)}")
        print(f"   Vocabulary size (with padding): {vocab_size}")
        
        # Print some sample words
        sample_words = sorted(tokenizer.word_index.items(), key=lambda x: x[1])[:10]
        print(f"   Sample words (first 10 by index):")
        for word, idx in sample_words:
            print(f"      {idx}: '{word}'")
        
        # Check for special tokens
        reverse_idx = {v: k for k, v in tokenizer.word_index.items()}
        if 1 in reverse_idx:
            print(f"   Token 1: '{reverse_idx[1]}'")
        if 2 in reverse_idx:
            print(f"   Token 2: '{reverse_idx[2]}'")
        
    else:
        print("   ❌ No word_index attribute found!")
    
    # Check for other attributes
    if hasattr(tokenizer, 'oov_token'):
        print(f"   OOV token: '{tokenizer.oov_token}'")
    
    if hasattr(tokenizer, 'filters'):
        print(f"   Filters: {tokenizer.filters[:50]}...")
        
except Exception as e:
    print(f"❌ Failed to load tokenizer: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# ============================================================================
# PART 2: Inspect final_model.h5
# ============================================================================
print("\n🧠 PART 2: MODEL ARCHITECTURE INSPECTION")
print("-" * 80)

model_path = os.path.join(base_dir, "final_model.h5")

if not os.path.exists(model_path):
    print(f"❌ Model not found at {model_path}")
    sys.exit(1)

try:
    from tensorflow.keras.models import load_model
    from tensorflow.keras.layers import Embedding, LSTM, Bidirectional, LayerNormalization
    
    print(f"📂 Loading model from {model_path}...")
    
    # Set dtype policy to float32
    from tensorflow.keras import mixed_precision
    mixed_precision.set_global_policy("float32")
    
    # Patch for dtype policy deserialization error
    try:
        from keras.src import dtype_policies
        from keras.src.dtype_policies import dtype_policy as dtype_policy_module
        
        original_get = dtype_policies.get
        
        def patched_get(identifier):
            if isinstance(identifier, str) and identifier in ('Policy', 'mixed_float16'):
                return dtype_policies.DTypePolicy('float32')
            return original_get(identifier)
        
        dtype_policies.get = patched_get
    except ImportError:
        pass
    
    custom_objects = {
        "Embedding": Embedding,
        "LSTM": LSTM,
        "Bidirectional": Bidirectional,
        "LayerNormalization": LayerNormalization,
    }
    
    try:
        model = load_model(model_path, compile=False, custom_objects=custom_objects, safe_mode=False)
    except TypeError:
        model = load_model(model_path, compile=False, custom_objects=custom_objects)
    except AttributeError as e:
        if "quantization_mode" in str(e):
            print(f"   Attempting alternative load method due to dtype policy issue...")
            import h5py
            from tensorflow.python.keras.saving import hdf5_format
            with h5py.File(model_path, mode="r") as h5_file:
                model = hdf5_format.load_model_from_hdf5(
                    h5_file, custom_objects=custom_objects, compile=False
                )
        else:
            raise
    
    print(f"✅ Model loaded successfully!\n")
    
    # Print full summary
    print("📋 FULL MODEL SUMMARY:")
    print("-" * 80)
    model.summary()
    
    # Detailed layer inspection
    print("\n🔬 DETAILED LAYER INSPECTION:")
    print("-" * 80)
    
    for i, layer in enumerate(model.layers):
        print(f"\n{i}. {layer.name}")
        print(f"   Type: {layer.__class__.__name__}")
        print(f"   Output shape: {layer.output_shape}")
        
        if hasattr(layer, 'units'):
            print(f"   Units: {layer.units}")
        
        if hasattr(layer, 'input_dim'):
            print(f"   Input dim: {layer.input_dim}")
        
        if hasattr(layer, 'output_dim'):
            print(f"   Output dim: {layer.output_dim}")
        
        # For Embedding layers
        if layer.__class__.__name__ == 'Embedding':
            if hasattr(layer, 'input_dim'):
                print(f"   Vocab size (input_dim): {layer.input_dim}")
            if hasattr(layer, 'output_dim'):
                print(f"   Embedding dim (output_dim): {layer.output_dim}")
        
        # Print weights shape if available
        if layer.weights:
            print(f"   Weights: {len(layer.weights)} tensor(s)")
            for j, w in enumerate(layer.weights):
                print(f"      {j}: {w.shape}")
    
    # Check model inputs and outputs
    print("\n📥 MODEL INPUTS:")
    print("-" * 80)
    for i, inp in enumerate(model.inputs):
        print(f"Input {i}: {inp.name} -> shape {inp.shape}")
    
    print("\n📤 MODEL OUTPUTS:")
    print("-" * 80)
    for i, out in enumerate(model.outputs):
        print(f"Output {i}: {out.name} -> shape {out.shape}")
    
    # Get expected input/output dimensions
    print("\n📊 EXPECTED DIMENSIONS FOR INFERENCE:")
    print("-" * 80)
    print(f"Number of inputs: {len(model.inputs)}")
    print(f"Number of outputs: {len(model.outputs)}")
    
    if len(model.inputs) >= 2:
        print(f"Image feature shape: {model.inputs[0].shape}")
        print(f"Sequence shape: {model.inputs[1].shape}")
    
    if len(model.outputs) >= 1:
        print(f"Output (logits) shape: {model.outputs[0].shape}")
        if model.outputs[0].shape[-1]:
            print(f"Vocabulary size from output: {model.outputs[0].shape[-1]}")
    
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# ============================================================================
# PART 3: Test simple inference
# ============================================================================
print("\n⚡ PART 3: TEST INFERENCE")
print("-" * 80)

try:
    print("Testing inference with dummy inputs...")
    
    # Create dummy inputs matching expected shapes
    if len(model.inputs) >= 2:
        feature_shape = model.inputs[0].shape
        seq_shape = model.inputs[1].shape
        
        print(f"Creating dummy image features: {feature_shape}")
        dummy_features = np.random.randn(*feature_shape).astype(np.float32)
        
        print(f"Creating dummy sequence: {seq_shape}")
        dummy_seq = np.zeros(seq_shape, dtype=np.int32)
        dummy_seq[0, 0] = 2  # Start token
        
        print("Running prediction...")
        output = model.predict([dummy_features, dummy_seq], verbose=0)
        
        print(f"✅ Inference successful!")
        print(f"   Output shape: {output.shape}")
        print(f"   Output dtype: {output.dtype}")
        print(f"   Output range: [{output.min():.6f}, {output.max():.6f}]")
        print(f"   Sample logits (first token, first 10): {output[0, 0, :10]}")
        
        # Find top prediction
        top_idx = np.argmax(output[0, 0, :])
        top_conf = output[0, 0, top_idx]
        print(f"   Top prediction: token {top_idx} with confidence {top_conf:.6f}")
        
except Exception as e:
    print(f"❌ Inference test failed: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 80)
print("✅ DEBUG INSPECTION COMPLETE")
print("=" * 80)
