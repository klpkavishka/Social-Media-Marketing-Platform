"""
Test script to verify hashtag and caption generation via the AI service API
"""
import requests
import numpy as np
from PIL import Image
import io
import json

# Create a test image (simple 224x224 RGB image)
test_image = Image.new('RGB', (224, 224), color=(73, 109, 137))
img_bytes = io.BytesIO()
test_image.save(img_bytes, format='JPEG')
img_bytes.seek(0)

# API endpoint
url = "http://localhost:5001/predict"

# Send request
print("📤 Sending test image to AI service...")
files = {'file': ('test.jpg', img_bytes, 'image/jpeg')}

try:
    response = requests.post(url, files=files, timeout=30)
    print(f"📬 Response status: {response.status_code}")
    print(f"📬 Response headers: {response.headers}")
    
    if response.status_code == 200:
        data = response.json()
        print("\n✅ SUCCESS! AI service response:")
        print(json.dumps(data, indent=2))
        
        # Validate output format
        print("\n🔍 Validation:")
        print(f"  ✓ Category: {data.get('category', 'MISSING')}")
        print(f"  ✓ Confidence: {data.get('confidence', 'MISSING')}%")
        print(f"  ✓ Hashtag count: {data.get('hashtag_count', 0)}")
        print(f"  ✓ Caption: {data.get('caption', 'MISSING')}")
        
        # Check caption is single word
        caption = data.get('caption', '')
        if caption:
            word_count = len(caption.split())
            print(f"\n  Caption word count: {word_count}")
            if word_count == 1:
                print(f"  ✅ Caption is single word as required")
            else:
                print(f"  ⚠️ Caption has {word_count} words (expected 1)")
        
        # Check hashtags
        hashtags = data.get('hashtags', [])
        if hashtags:
            print(f"\n  Sample hashtags: {hashtags[:5]}")
        else:
            print(f"\n  ⚠️ No hashtags generated")
    else:
        print(f"\n❌ Error response:")
        print(response.text)
        
except requests.exceptions.ConnectionError:
    print("❌ Connection error - AI service not available at http://localhost:5001")
except Exception as e:
    print(f"❌ Error: {e}")
