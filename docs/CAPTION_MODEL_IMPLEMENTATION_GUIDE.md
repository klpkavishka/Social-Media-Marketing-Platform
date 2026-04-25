# Caption Model Implementation Guide

## Current Status

Your caption generation system has a **critical artifact mismatch** that prevents the trained model from working:

### What We Found

**Tokenizer Analysis:**
- **Expected (from notebook)**: 8780 vocabulary size (40,455 captions)
- **Actual (tokenizer.pkl)**: 42 vocabulary size (only 41 words!)
- **Words in tokenizer**: startseq, endseq, a, the, on, in, sitting, is, chair, person, ...

**Model Status:**
- `final_model.h5` exists but **cannot be loaded** (Keras 3 compatibility issue with dtype policies)
- The saved model is incompatible with current TensorFlow/Keras versions
- Even if it loaded, the vocabulary mismatch would cause silent failures

### Root Cause

The saved `final_model.h5` and `tokenizer.pkl` were created with:
1. A **different, incomplete training run** that only used ~41 words instead of the full vocabulary
2. An **older Keras version** that doesn't match current TensorFlow 2.12+

---

## Solution: Three-Tier Approach

### TIER 1: Short-term (Current System - Use Fallback)
**Status**: ✅ Already implemented
- System uses fallback caption generator when trained model fails
- Captions are generated using image analysis (colors, brightness)
- Quality: Basic but functional
- **No action needed** - system is working with fallback

### TIER 2: Medium-term (Proper Model Training)
**Recommended approach** - retrain with the notebook code correctly

**Steps:**

#### 2.1 Prepare Training Environment
```bash
# In your training environment (with GPU if possible)
cd ai-service/model

# Install exact dependencies from notebook
pip install tensorflow==2.10.* scikit-learn matplotlib nltk tqdm pillow h5py
```

#### 2.2 Download/Prepare Training Data
- Verify `captions_old.csv` has 40,455 entries with image-caption pairs
- Ensure image directory contains corresponding images
- Update paths in `ImageCaptionModel3.ipynb` to point to your data

#### 2.3 Run Training Notebook
- Open `ImageCaptionModel3.ipynb` in Jupyter
- Set hyperparameters (batch size 128 is good for GPU):
  - `EPOCHS = 50`
  - `BATCH_SIZE = 128` (adjust down if GPU memory issues)
  - `LEARNING_RATE = 5e-4`
- Run all cells through "Train the Model"
- Output will be: `final_model.h5`, `tokenizer.pkl`, `label_encoder_v2.pkl`

#### 2.4 Replace Artifacts
```bash
# After training, copy new artifacts
cp caption_outputs/models/best_model.h5 ai-service/model/final_model.h5
cp tokenizer.pkl ai-service/model/tokenizer.pkl
```

#### 2.5 Deploy
```bash
# Rebuild Docker image
docker-compose build ai-service

# Test
docker-compose up ai-service
# Upload test image, verify multi-word caption
```

---

### TIER 3: Long-term (Production Improvements)

#### 3.1 Use Better Pre-trained Caption Models
Instead of building from scratch, consider using:
- **Hugging Face Transformers** (`image-to-text` models)
- **Visual Question Answering (VQA)** models
- **BLIP** (Bootstrapping Language Image Pre-training) - state-of-the-art
- **InstructBLIP** - instruction-tuned image captioning

Example (uses pre-trained model, no training needed):
```python
from transformers import pipeline

image_to_text = pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")
caption = image_to_text("path/to/image.jpg")[0]['generated_text']
```

#### 3.2 Fine-tune on Your Data
```python
from transformers import AutoProcessor, AutoModelForVision2Seq

processor = AutoProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = AutoModelForVision2Seq.from_pretrained("Salesforce/blip-image-captioning-base")

# Fine-tune with your captions_old.csv
# Training loop here...
```

---

## Current Implementation Details

### File: `caption_predictor.py`
**Lines 243-263**: Fallback model architecture
```python
# This is what should match final_model.h5 if it works
# If retraining, ensure this matches your architecture
```

### File: `predictor.py`
**Lines 109-131**: Fallback detection
```python
# Currently detects when model produces garbage
# After proper training, can remove this detection
```

---

## Testing Checklist

### For Tier 1 (Current - Fallback Mode)
- [x] Fallback caption generator works
- [x] Hashtag generator works
- [x] System handles image upload
- [ ] Test with various image types

### For Tier 2 (After Proper Retraining)
- [ ] Training completes without errors
- [ ] Model saves to `final_model.h5`
- [ ] Tokenizer matches (vocab size = 8780)
- [ ] Inference produces multi-word captions
- [ ] Captions are relevant to images
- [ ] BLEU score > 0.3 (evaluate on test set)
- [ ] Docker build succeeds
- [ ] End-to-end test with uploaded image

---

## Debugging Tips

### If Model Still Won't Load
```python
# In caption_predictor.py, add:
import h5py
with h5py.File("final_model.h5", "r") as f:
    print("Model config:", f.attrs.get('model_config'))
    print("Layers:", list(f.keys()))
```

### If Tokenizer is Wrong Size
```python
# Verify actual training data:
# In notebook cell 4, check `len(captions_dict)` 
# Should be ~8090 images
# And total captions should match tokenizer size
```

### If Captions Are Still Bad After Retraining
- Check BLEU score in notebook output (should improve over epochs)
- Verify training data quality (sample captions from CSV)
- Try longer training (more epochs)
- Increase LSTM units (512 → 768)
- Increase embedding dim (512 → 768)

---

##Quick Decision Tree

```
Does your system currently generate captions?
├─ YES (with fallback) → TIER 1 ✅ - Done!
└─ NO (model fails to load)
    ├─ Want quick fix?
    │  └─ Use TIER 1 fallback (recommended)
    └─ Want trained model?
        ├─ Have training data?
        │  ├─ YES → Follow TIER 2 steps
        │  └─ NO → Find/collect captions
        └─ Want production quality?
            └─ Use TIER 3 (pre-trained + fine-tune)
```

---

## Files Modified
- `ai-service/model/caption_predictor.py` - Decoder logic + fallback architecture
- `ai-service/model/predictor.py` - Fallback detection
- `ai-service/model/caption_fallback.py` - Rule-based fallback generator (TIER 1)

## Files to Create (if doing TIER 2)
- None - use existing `ImageCaptionModel3.ipynb` to retrain
- Replace `final_model.h5` and `tokenizer.pkl` with new outputs

---

## Contact/Questions
If caption quality is still poor after following this guide:
1. Check BLEU scores from training notebook (should see improvement)
2. Verify training data (sample captions, check for quality)
3. Consider TIER 3 approach with pre-trained models
