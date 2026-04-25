"""Fix all issues in the ImageCaptionModel3 notebook."""
import json
import sys

path = r'D:\project\3-year\Social-Media-Marketing-Platform\ai-service\model\ImageCaptionModel3 (3).ipynb'

print("Loading notebook...")
with open(path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

cells_by_id = {c.get('id', ''): c for c in nb['cells']}

def set_source(cell_id, new_source):
    """Set the source of a cell, splitting into lines properly."""
    cell = cells_by_id[cell_id]
    lines = new_source.split('\n')
    cell['source'] = [line + '\n' for line in lines[:-1]] + [lines[-1]]
    # Clear old outputs so notebook is clean
    cell['outputs'] = []
    cell['execution_count'] = None

# ============================================================
# FIX 1: Cell 0725f527 - Disable mixed_float16 + add Add import
# ============================================================
print("Fix 1: Disabling mixed_float16...")
set_source('0725f527', r"""import os
import re
import pickle
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from tqdm import tqdm
import warnings
warnings.filterwarnings('ignore')

import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array, ImageDataGenerator
from tensorflow.keras.applications.efficientnet import preprocess_input, EfficientNetB0
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.utils import Sequence
from tensorflow.keras.layers import (
    Input, Dense, Dropout, Embedding, LSTM, Bidirectional,
    BatchNormalization, LayerNormalization, Concatenate, Add,
    GlobalAveragePooling2D, Layer, MultiHeadAttention
)

from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.regularizers import l2
from tensorflow.keras.callbacks import (
    EarlyStopping, ModelCheckpoint, ReduceLROnPlateau, LearningRateScheduler
)
from sklearn.model_selection import train_test_split
from nltk.translate.bleu_score import corpus_bleu, sentence_bleu
import nltk
nltk.download('punkt', quiet=True)

# Configure GPU
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        # DISABLED: mixed_float16 causes NaN with large softmax (7046 classes)
        # float16 max ~65504 overflows in logits -> NaN loss
        # set_global_policy('mixed_float16')
        print('GPU memory growth enabled. Mixed precision DISABLED to prevent NaN.')
    except RuntimeError as e:
        print(e)

print(f'GPU available: {tf.config.list_physical_devices("GPU")}')
print('All libraries imported successfully')""")

# ============================================================
# FIX 2: Cell 68d8138c - Remove unused augmentation, clean up
# ============================================================
print("Fix 2: Removing unused ImageDataGenerator...")
set_source('68d8138c', r"""# Extract and cache image features
feature_cache_path = os.path.join(OUTPUT_DIR, 'efficientnet_features.pkl')

if os.path.exists(feature_cache_path):
    with open(feature_cache_path, 'rb') as f:
        features = pickle.load(f)
    print(f'Loaded cached features for {len(features)} images')
else:
    print('Extracting features in BATCHES (GPU-accelerated)...')
    features = {}
    all_img_list = list(captions_dict.keys())
    EXTRACT_BATCH = 32

    for start in tqdm(range(0, len(all_img_list), EXTRACT_BATCH),
                      desc='Batch extracting'):
        batch_names = all_img_list[start:start + EXTRACT_BATCH]
        batch_imgs = []
        valid_names = []

        for img_name in batch_names:
            img_path = os.path.join(IMAGE_DIR, img_name)
            try:
                img = load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
                img = img_to_array(img)
                batch_imgs.append(img)
                valid_names.append(img_name)
            except Exception as e:
                print(f'Error loading {img_name}: {e}')

        if batch_imgs:
            batch_array = preprocess_input(np.array(batch_imgs))
            batch_feats = feature_extractor.predict(batch_array, verbose=0)
            for name, feat in zip(valid_names, batch_feats):
                features[name] = feat.flatten()

    with open(feature_cache_path, 'wb') as f:
        pickle.dump(features, f)
    print(f'Extracted and saved features for {len(features)} images')

print(f'Feature vector shape: {list(features.values())[0].shape}')""")

# ============================================================
# FIX 3: Cell c89d3920 - Replace dead simple model with the actual
# BiLSTM+Attention model (was defined inline in cell 111993f4 before)
# ============================================================
print("Fix 3: Replacing model definition with proper BiLSTM+Attention...")
set_source('c89d3920', r"""def build_caption_model(vocab_size, max_length, feature_dim=1280,
                       embed_dim=512, lstm_units=512, dense_units=512,
                       dropout_rate=0.3):
    \"\"\"Build image caption model: EfficientNetB0 features + BiLSTM + Attention.\"\"\"
    reg = l2(1e-4)

    # --- Image branch ---
    img_input = Input(shape=(feature_dim,), name='image_input')
    img_dense = Dense(dense_units, activation='relu', kernel_regularizer=reg, name='img_dense')(img_input)
    img_bn = BatchNormalization(name='img_bn')(img_dense)
    img_drop = Dropout(dropout_rate, name='img_dropout')(img_bn)

    # --- Text branch ---
    seq_input = Input(shape=(max_length,), name='seq_input')
    emb = Embedding(vocab_size, embed_dim, mask_zero=True, name='embedding')(seq_input)
    emb_drop = Dropout(dropout_rate, name='emb_dropout')(emb)

    # BiLSTM with return_sequences for attention
    bilstm = Bidirectional(LSTM(lstm_units, return_sequences=True, name='lstm'),
                           name='bidirectional')(emb_drop)
    lstm_norm = LayerNormalization(name='lstm_norm')(bilstm)

    # Attention over LSTM outputs
    text_attention = AttentionLayer(units=512, name='text_attention')(lstm_norm)
    attended_drop = Dropout(dropout_rate, name='attended_dropout')(text_attention)

    # Project image features to match LSTM dim
    img_proj = Dense(lstm_units * 2, activation='relu', kernel_regularizer=reg,
                     name='img_to_lstm_dim')(img_drop)

    # Fuse image + attended text
    merged = Concatenate(name='concat')([img_proj, attended_drop])

    # Fusion layers (gradual reduction)
    x = Dense(dense_units, activation='relu', kernel_regularizer=reg, name='fusion_dense1')(merged)
    x = BatchNormalization(name='fusion_bn1')(x)
    x = Dropout(dropout_rate, name='fusion_dropout1')(x)

    x = Dense(dense_units // 2, activation='relu', kernel_regularizer=reg, name='fusion_dense2')(x)
    x = BatchNormalization(name='fusion_bn2')(x)
    x = Dropout(dropout_rate, name='fusion_dropout2')(x)

    # Output layer - dtype=float32 for numerical stability
    output = Dense(vocab_size, activation='softmax', dtype='float32', name='output')(x)

    model = Model(inputs=[img_input, seq_input], outputs=output,
                  name='CaptionModel_EfficientNet_BiLSTM_Attention_v2')
    return model

print('Model builder function defined.')""")

# ============================================================
# FIX 4: Cell 111993f4 - Update model build call (was using params
# that didn't match the old dead definition)
# ============================================================
print("Fix 4: Updating model build call...")
set_source('111993f4', r"""# Build the model with improved hyperparameters
# Reduced capacity from 768 to 512 to reduce overfitting
# (train acc 73% vs val acc 41% showed severe overfitting with 768)
EMBED_DIM = 512      # Reduced from 768
LSTM_UNITS = 512     # Reduced from 768
DENSE_UNITS = 512    # Reduced from 768
DROPOUT_RATE = 0.35  # Increased from 0.2 for better regularization

model = build_caption_model(
    vocab_size=VOCAB_SIZE,
    max_length=MAX_LENGTH,
    feature_dim=FEATURE_DIM,
    embed_dim=EMBED_DIM,
    lstm_units=LSTM_UNITS,
    dense_units=DENSE_UNITS,
    dropout_rate=DROPOUT_RATE
)
print('Model built successfully!')
print(f'Model name: {model.name}')
model.summary()""")

# ============================================================
# FIX 5: Cell 4cba425a - Adjust compile for stability
# ============================================================
print("Fix 5: Adjusting compile settings...")
set_source('4cba425a', r"""model.compile(
    optimizer=Adam(learning_rate=LEARNING_RATE, clipvalue=5.0),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
print('Model compiled with Adam optimizer + gradient clipping')
print(f'Total parameters: {model.count_params():,}')""")

# ============================================================
# FIX 6: Cell 7bfdb66e - Add EarlyStopping, fix callbacks
# ============================================================
print("Fix 6: Adding EarlyStopping and fixing callbacks...")
set_source('7bfdb66e', r"""def cosine_annealed_lr(epoch, initial_lr=1e-4, total_epochs=60, min_lr=1e-6):
    \"\"\"Cosine annealing: Start high, gradually decay to min_lr.\"\"\"
    progress = epoch / total_epochs
    lr = min_lr + (initial_lr - min_lr) * (1 + np.cos(np.pi * progress)) / 2
    return lr

callbacks = [
    # Early stopping: stop if val_loss doesn't improve for 8 epochs
    EarlyStopping(
        monitor='val_loss', patience=8, restore_best_weights=True,
        verbose=1, min_delta=0.001
    ),
    # Cosine annealing LR schedule
    LearningRateScheduler(
        lambda e: cosine_annealed_lr(e, initial_lr=LEARNING_RATE,
                                     total_epochs=EPOCHS, min_lr=1e-7),
        verbose=1
    ),
    # Save best model based on val_loss (not val_accuracy which was unreliable)
    ModelCheckpoint(
        os.path.join(MODELS_DIR, 'best_model.h5'),
        monitor='val_loss', save_best_only=True, verbose=1, mode='min'
    )
]

print(f'Starting training with EarlyStopping + Cosine Annealing LR...')
print(f'Initial LR: {LEARNING_RATE}, Min LR: 1e-7')
print(f'Batch size: {BATCH_SIZE}')
print(f'Train batches: {len(train_gen)}, Val batches: {len(val_gen)}')
print(f'Device: {"/GPU:0" if gpus else "/CPU:0"}')
print('-' * 60)

history = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS,
    callbacks=callbacks,
    verbose=1
)

print('Training completed!')""")

# ============================================================
# Save the fixed notebook
# ============================================================
print("Saving fixed notebook...")
with open(path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, ensure_ascii=False, indent=1)

print("All fixes applied and saved successfully!")
print("Summary of fixes:")
print("  1. Disabled mixed_float16 (prevents NaN loss)")
print("  2. Removed unused ImageDataGenerator augmentation")
print("  3. Replaced dead model definition with proper BiLSTM+Attention")
print("  4. Reduced model capacity 768->512, increased dropout 0.2->0.35 (anti-overfitting)")
print("  5. Increased gradient clipping 1.0->5.0 for stability")
print("  6. Added EarlyStopping(patience=8), switched checkpoint to monitor val_loss")
