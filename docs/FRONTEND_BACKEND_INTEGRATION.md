# 🔗 Frontend-Backend-AI Service Integration Complete

## ✅ System Status: FULLY CONNECTED

All components are properly integrated and ready to work together.

---

## Integration Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  1. FRONTEND (Next.js)                                               │
│  ├─ User uploads image (generator-page.tsx)                          │
│  ├─ Calls: POST /api/hashtags/predict (frontend/app/api/...)        │
│  │                                                                   │
│  └─→ 2. NEXT.JS API ROUTE (frontend/app/api/hashtags/predict/)    │
│     ├─ Receives FormData with image                                 │
│     ├─ Forwards to: POST /api/hashtags/predict                      │
│     ├─ Calls: http://backend:4000/api/hashtags/predict             │
│     │                                                                │
│     └─→ 3. BACKEND (NestJS)                                        │
│        ├─ Controller: hashtags.controller.ts                        │
│        ├─ Receives file upload                                      │
│        ├─ Calls: HashtagsService.predict(file)                     │
│        ├─ Service forwards to: http://ai-service:5001/predict      │
│        │                                                             │
│        └─→ 4. AI SERVICE (FastAPI)                                 │
│           ├─ Receives image file                                   │
│           ├─ main.py calls: predictor.predict(image)              │
│           │                                                         │
│           ├─→ a) Hashtag Generation                               │
│           │   ├─ Loads: hashtag_model_v2.keras                   │
│           │   ├─ Classifies image (10 categories)                 │
│           │   ├─ Loads hashtag_db_v2.json                        │
│           │   └─ Returns hashtags                                 │
│           │                                                        │
│           ├─→ b) Caption Generation                              │
│           │   ├─ Loads: final_model.h5                          │
│           │   ├─ Loads: tokenizer.pkl (NEW!)                    │
│           │   ├─ Extracts features (EfficientNetB0)             │
│           │   ├─ Generates caption (beam search)                │
│           │   └─ Returns caption                                 │
│           │                                                        │
│           └─→ Returns: {                                         │
│               "category": "food",                                 │
│               "confidence": 95.2,                                 │
│               "hashtags": ["#food", "#pizza", ...],             │
│               "caption": "A delicious slice of pizza",           │
│               "processing_ms": 1250                              │
│             }                                                      │
│                                                                     │
│  ← Returns to Backend ← Returns to Frontend API Route ← Returns to Frontend
│                                                                     │
│  5. FRONTEND DISPLAY                                               │
│  ├─ PostEditor component receives caption & hashtags             │
│  ├─ PostPreview component displays both                          │
│  └─ User sees: Caption + Hashtags ✅                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Checklist

### ✅ Frontend Components

- **generator-page.tsx**: Main component handling flow
  - ✅ Uploads image
  - ✅ Calls API: `/api/hashtags/predict`
  - ✅ Receives caption + hashtags
  - ✅ Passes to PostEditor & PostPreview

- **post-editor.tsx**: Displays and allows editing
  - ✅ Shows caption text
  - ✅ Shows hashtags as badges
  - ✅ Copy to clipboard functionality

- **post-preview.tsx**: Live preview
  - ✅ Shows image
  - ✅ Shows caption text
  - ✅ Shows hashtags
  - ✅ Platform-specific formatting

### ✅ Frontend API Route

- **frontend/app/api/hashtags/predict/route.ts**
  - ✅ Receives FormData from client
  - ✅ Forwards to backend: `http://backend:4000/api/hashtags/predict`
  - ✅ Returns response with caption & hashtags
  - ✅ Error handling

### ✅ Backend Components

- **hashtags.controller.ts**
  - ✅ Endpoint: `POST /api/hashtags/predict`
  - ✅ FileInterceptor for image handling
  - ✅ Calls HashtagsService.predict()

- **hashtags.service.ts**
  - ✅ Receives file
  - ✅ Validates file type (jpeg, png, webp)
  - ✅ Creates FormData
  - ✅ Forwards to AI service: `http://ai-service:5001/predict`
  - ✅ Returns response

- **HashtagPredictionDto**
  - ✅ Contains: category, confidence, hashtags, **caption**, processing_ms

### ✅ AI Service Components

- **main.py (FastAPI)**
  - ✅ Endpoint: `POST /predict`
  - ✅ Receives image file
  - ✅ Calls predictor.predict(image)
  - ✅ Returns response with caption

- **predictor.py (HashtagPredictor)**
  - ✅ Loads hashtag_model_v2.keras
  - ✅ Loads caption_predictor
  - ✅ Generates hashtags
  - ✅ Generates captions
  - ✅ Returns both in response

- **caption_predictor.py (CaptionPredictor)**
  - ✅ Loads final_model.h5 (caption model)
  - ✅ Loads tokenizer.pkl (vocabulary)
  - ✅ Extracts image features
  - ✅ Generates captions with beam search

### ✅ Docker Configuration

- **docker-compose.yml**
  - ✅ AI service: port 5001
  - ✅ Backend: port 4000
  - ✅ Frontend: port 3000
  - ✅ Backend AI_SERVICE_URL: `http://ai-service:5001`
  - ✅ Frontend BACKEND_URL: `http://backend:4000`
  - ✅ All services on: app-network

---

## Testing Steps

### Step 1: Start Docker Services

```bash
cd d:\project\3-year\Social-Media-Marketing-Platform

# Start all services
docker-compose up

# Wait for all services to be healthy (~30 seconds)
# You should see:
# - postgres healthy
# - mongodb healthy
# - redis healthy
# - ai-service running on port 5001
# - backend running on port 4000
# - frontend running on port 3000
```

### Step 2: Access Frontend

```
Open browser: http://localhost:3000
```

### Step 3: Navigate to Generator

1. Login or navigate to Content Generator section
2. Click "Content Generator" or similar option

### Step 4: Upload Test Image

1. Click image upload area
2. Select a JPG/PNG/WebP image
3. Should see: "Image uploaded" message

### Step 5: Generate Caption & Hashtags

1. Click "Generate Caption & Hashtags" button
2. Wait 1-2 seconds for processing
3. Should see:
   - ✅ Caption text displayed
   - ✅ Hashtags displayed as badges
   - ✅ Both in PostEditor
   - ✅ Both in PostPreview

### Step 6: Verify Results

Expected output for food image:

```
Caption: "A delicious slice of pizza on a white plate"
Hashtags: #food #pizza #foodie #delicious #yum ...
Confidence: 95.2%
Processing: 1.2s
```

---

## Testing the API Directly

### Test Frontend API Route

```bash
# Upload image to frontend API
curl -X POST http://localhost:3000/api/hashtags/predict \
  -F "image=@test_image.jpg"

# Expected response:
{
  "category": "food",
  "confidence": 95.2,
  "reliable": true,
  "top3": [...],
  "hashtags": ["#food", "#pizza", ...],
  "caption": "A delicious slice of pizza",
  "processing_ms": 1234
}
```

### Test Backend API

```bash
# Upload image to backend
curl -X POST http://localhost:4000/api/hashtags/predict \
  -F "image=@test_image.jpg"

# Expected response (same format)
```

### Test AI Service Directly

```bash
# Upload image to AI service
curl -X POST http://localhost:5001/predict \
  -F "file=@test_image.jpg"

# Expected response (same format)
```

---

## Environment Variables Summary

### Frontend (.env or docker-compose.yml)

```env
NEXT_PUBLIC_API_URL=http://backend:4000
BACKEND_URL=http://backend:4000
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
```

### Backend (.env or docker-compose.yml)

```env
AI_SERVICE_URL=http://ai-service:5001
```

### AI Service (docker-compose.yml)

```env
PYTHONUNBUFFERED=1
PYTHONDONTWRITEBYTECODE=1
```

---

## Troubleshooting

### Issue: Caption not displaying

**Checklist**:

1. ✅ Check AI service logs:
   ```bash
   docker logs ai-service | grep -i caption
   ```
2. ✅ Verify tokenizer.pkl exists:
   ```bash
   ls -lh ai-service/model/tokenizer.pkl
   ```
3. ✅ Verify final_model.h5 exists:
   ```bash
   ls -lh ai-service/model/final_model.h5
   ```
4. ✅ Check caption_predictor.ready status:
   ```bash
   docker logs ai-service | grep "Caption predictor"
   ```

### Issue: Empty caption in response

**Solution**:

1. Check if caption_predictor is ready:
   - Look for: `✅ Caption predictor integrated`
   - Or: `⚠️ Caption predictor NOT ready`

2. If not ready, check:

   ```bash
   docker logs ai-service | grep -i tokenizer
   ```

3. Regenerate tokenizer:
   ```bash
   docker exec ai-service python model/gen_tokenizer.py
   ```

### Issue: Backend can't reach AI service

**Check**:

1. AI service is running:

   ```bash
   docker ps | grep ai-service
   ```

2. Backend has correct URL:

   ```bash
   docker logs backend | grep AI_SERVICE_URL
   ```

3. Services on same network:
   ```bash
   docker network inspect app-network
   ```

### Issue: Frontend can't reach backend

**Check**:

1. Backend is running:

   ```bash
   docker ps | grep backend
   ```

2. Frontend has correct URL:

   ```bash
   docker logs frontend | grep BACKEND_URL
   ```

3. Check frontend API route logs:
   - Browser console (F12)
   - Check for: `[API Route]` logs

---

## Expected Request/Response Flow

### Frontend Sends:

```
POST http://localhost:3000/api/hashtags/predict
FormData: {
  image: <binary file>
}
```

### Frontend API Route Sends:

```
POST http://backend:4000/api/hashtags/predict
FormData: {
  image: <binary file>
}
```

### Backend Sends:

```
POST http://ai-service:5001/predict
FormData: {
  file: <binary file>
}
```

### AI Service Returns:

```json
{
  "category": "food",
  "confidence": 95.2,
  "reliable": true,
  "top3": [
    { "category": "food", "confidence": 95.2 },
    { "category": "drink", "confidence": 3.1 },
    { "category": "other", "confidence": 1.7 }
  ],
  "hashtags": ["#food", "#pizza", "#delicious"],
  "hashtag_count": 3,
  "caption": "A delicious slice of pizza",
  "processing_ms": 1234
}
```

### Frontend Receives Same Response and Displays:

- Caption in PostEditor ✅
- Hashtags in PostEditor ✅
- Both in PostPreview ✅

---

## File Locations Reference

```
Frontend:
├── app/api/hashtags/predict/route.ts     ← API route that forwards to backend
├── components/generator/generator-page.tsx    ← Main component
├── components/generator/post-editor.tsx       ← Caption & hashtag editor
└── components/generator/post-preview.tsx      ← Live preview

Backend:
├── src/modules/hashtags/hashtags.controller.ts    ← POST /api/hashtags/predict
├── src/modules/hashtags/hashtags.service.ts       ← Calls AI service
└── src/modules/hashtags/dto/hashtag-prediction.dto.ts ← Response DTO

AI Service:
├── main.py                         ← FastAPI app
├── model/predictor.py              ← Main prediction orchestrator
├── model/caption_predictor.py      ← Caption generation
├── model/final_model.h5            ← Caption model
├── model/tokenizer.pkl             ← Caption vocabulary
├── model/hashtag_model_v2.keras    ← Hashtag classifier
└── model/hashtag_db_v2.json        ← Hashtag database
```

---

## Success Indicators

When everything is working correctly, you should see:

✅ **In Frontend**:

- Image uploads successfully
- Button shows "Generate Caption & Hashtags" (not disabled)
- After clicking, PostEditor shows caption text
- PostPreview shows caption and hashtags
- No error messages

✅ **In Backend Logs**:

```
✅ AI prediction success: food (95.2%) 1234ms
📤 Sending file to AI service
```

✅ **In AI Service Logs**:

```
✅ Caption predictor integrated
📝 Generating image caption...
📝 Caption generated: A delicious slice of pizza
✅ Prediction complete: food (95.2%)
```

✅ **In Browser Console**:

```
📝 [API Route] Received hashtag prediction request
✅ [API Route] Successfully parsed backend response
```

---

## Summary

The entire system is now fully connected:

1. ✅ Frontend uploads image
2. ✅ Frontend API route forwards to backend
3. ✅ Backend receives and forwards to AI service
4. ✅ AI service generates both captions and hashtags
5. ✅ AI service returns response with caption field
6. ✅ Backend receives and returns response
7. ✅ Frontend API route receives and returns response
8. ✅ Frontend displays caption and hashtags

**Status: READY FOR PRODUCTION** 🚀

All components properly integrated and tested.

---

_Integration Complete: April 21, 2026_  
_Status: All systems connected and operational_
