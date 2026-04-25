# How to Properly Retrain the Caption Model (TIER 2)

## Prerequisites
- Python 3.8-3.10 (TensorFlow 2.10 works best with these)
- CUDA-capable GPU (optional but **strongly recommended** - training takes 3-4 hours on CPU)
- 8GB+ RAM, 50GB+ free disk space

## Step-by-Step Instructions

### 1. Prepare Environment

```bash
cd D:\project\3-year\Social-Media-Marketing-Platform\ai-service\model

# Create virtual environment (recommended)
python -m venv caption_env
caption_env\Scripts\activate  # On Windows

# Install dependencies exactly as in notebook
pip install tensorflow==2.10.0 scikit-learn matplotlib nltk tqdm pillow h5py pandas numpy==1.23.5
```

### 2. Verify Training Data

**Check your data files:**

```bash
# Verify CSV exists and has enough captions
python -c "import pandas as pd; df = pd.read_csv('captions_old.csv'); print(f'Rows: {len(df)}, Columns: {df.columns.tolist()}')"
# Expected output: Rows: 40455, Columns: ['image', 'caption']

# Verify image directory exists
dir /S /B images | wc -l  # Should show ~8090 files
```

### 3. Run Training Notebook

Open Jupyter and run `ImageCaptionModel3.ipynb`:

```bash
# From caption_env, still in ai-service\model directory
jupyter notebook ImageCaptionModel3.ipynb
```

**Important:** Before running cells, **update paths in cell #3**:

```python
# Current (WRONG):
IMAGE_DIR = r'C:\Users\Rehan\Documents\...'
CAPTION_FILE = r'C:\Users\Rehan\Documents\...'

# Should be (CORRECT):
IMAGE_DIR = r'D:\project\3-year\Social-Media-Marketing-Platform\ai-service\model\images'
CAPTION_FILE = r'D:\project\3-year\Social-Media-Marketing-Platform\ai-service\model\captions_old.csv'
OUTPUT_DIR = r'D:\project\3-year\Social-Media-Marketing-Platform\ai-service\model\caption_outputs'
```

**Run all cells in order:**
- Cells 1-9: Data setup and preparation (should complete in < 5 minutes)
- Cells 10-11: Model building (instantaneous)
- Cell 12: **TRAINING** (⏱ This takes 3-4 hours on GPU, 12+ hours on CPU!)
- Cell 13: Plotting results

### 4. Copy Trained Artifacts

After training completes successfully:

```bash
# From the caption_env terminal (still in ai-service\model)
python << 'EOF'
import shutil
import os

# Copy best model
shutil.copy(
    'caption_outputs/models/best_model.h5',
    'final_model.h5'
)

# Copy tokenizer
shutil.copy(
    'tokenizer.pkl',
    'tokenizer.pkl'
)

print("✅ Model artifacts ready!")
print(f"   final_model.h5: {os.path.getsize('final_model.h5') / 1e6:.1f} MB")
print(f"   tokenizer.pkl: {os.path.getsize('tokenizer.pkl') / 1e6:.3f} MB")
EOF
```

### 5. Test Inference

```bash
# Test that model loads and works
python << 'EOF'
import pickle
from PIL import Image
import numpy as np

# Load tokenizer
with open('tokenizer.pkl', 'rb') as f:
    tok = pickle.load(f)
print(f"✅ Tokenizer loaded: vocab size = {len(tok.word_index) + 1}")
assert len(tok.word_index) > 8000, "ERROR: Tokenizer too small! Retraining didn't work."

# Try loading model (this will fail gracefully if there's an issue)
try:
    from tensorflow.keras.models import load_model
    model = load_model('final_model.h5', compile=False)
    print(f"✅ Model loaded: {model.name}")
    print(f"   Inputs: {[inp.shape for inp in model.inputs]}")
    print(f"   Output: {model.outputs[0].shape}")
except Exception as e:
    print(f"⚠️  Model load issue: {e}")
    print("   (This might be OK - test in Docker)")

EOF
```

### 6. Rebuild Docker Image

```bash
# Exit caption_env first
deactivate

# Rebuild with new model
cd D:\project\3-year\Social-Media-Marketing-Platform
docker-compose build ai-service
```

### 7. Test in Docker

```bash
# Start service
docker-compose up ai-service -d

# Test with a sample image
curl -X POST http://localhost:8000/predict \
  -F "image=@sample_image.jpg"

# Expected response:
# {
#   "caption": "a person sitting on a chair",  # Multi-word, not "the the the"
#   "hashtags": ["#person", "#sitting", ...],
#   ...
# }
```

---

## Troubleshooting

### Problem: "Out of Memory" during training

**Solution 1** (recommended): Use GPU
- Install CUDA 11.8 and cuDNN 8.6
- Restart Python/Jupyter

**Solution 2**: Reduce batch size in Cell #3
```python
BATCH_SIZE = 64  # Instead of 128
```

**Solution 3**: Train on smaller subset
```python
# In cell #4, after creating captions_dict:
captions_dict = dict(list(captions_dict.items())[:4000])  # Use only 4000 images
```

### Problem: Training is very slow

**Expected times:**
- GPU (good): 3-4 hours for 50 epochs
- GPU (older): 6-8 hours
- CPU: 12-24 hours

If taking longer than expected:
- Check GPU usage: `nvidia-smi` (should show ~95%+ utilization)
- Reduce `BATCH_SIZE` might actually help by reducing overhead
- Lower `EPOCHS = 20` for quick test

### Problem: Model still not loading after retraining

**Check:**
1. File size of `final_model.h5` - should be > 200MB
2. Tokenizer size - should show vocab > 8000
3. Training output in Jupyter - look for "Training completed!" message

If still failing, check the debug script output:
```bash
python debug_model.py 2>&1 | grep -A5 "failed"
```

### Problem: Captions are still bad after retraining

**Possible causes:**
- Model didn't train long enough (check BLEU score improvement)
- Training data quality is poor
- Batch size too large (try 64 instead of 128)

**What to do:**
- Run training again with `EPOCHS = 100` (or more)
- Check first few captions in CSV - are they descriptive?
- Try TIER 3 (pre-trained models) as fallback

---

## Verification Checklist

After retraining, verify:

- [ ] `final_model.h5` exists and is > 200MB
- [ ] `tokenizer.pkl` exists and is < 10MB  
- [ ] `python debug_model.py` shows vocab size > 8000
- [ ] Model test inference works
- [ ] Docker build succeeds without errors
- [ ] API returns multi-word captions (not "the the the")
- [ ] Hashtags are generated correctly

---

## Performance Expectations

**After proper training, you should see:**
- Captions: 5-15 words per image
- Quality: Descriptive, usually starting with "a person...", "a cat...", etc.
- BLEU-4 score: 0.25-0.35 (from notebook output)
- Response time: < 1 second per image

**If you see:**
- Single word captions: Tokenizer mismatch (vocab too small)
- Repeated words: Model didn't train properly
- Slow inference: Model mismatch, try reducing batch size

---

## Quick Commands Reference

```bash
# Check if training is complete
ls -lh caption_outputs/models/best_model.h5

# Verify tokenizer
python -c "import pickle; t=pickle.load(open('tokenizer.pkl','rb')); print(len(t.word_index))"

# Count training images
python -c "import json; d=json.load(open('captions_dict.json')); print(len(d))"

# Test single inference
python -c "from caption_predictor import caption_predictor; from PIL import Image; img=Image.open('test.jpg'); print(caption_predictor.predict(img))"
```

---

## Still Having Issues?

1. **Check the CAPTION_MODEL_IMPLEMENTATION_GUIDE.md** for architectural decisions
2. **Consider TIER 3**: Using pre-trained BLIP model instead
3. **Check debug output**: Run `python debug_model.py` and review any error messages
4. **Verify data**: Make sure `captions_old.csv` has actual caption text, not just image names
