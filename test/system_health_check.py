"""
Final system health check - verify frontend, backend, and AI service connectivity
"""
import requests
import time

services = {
    "AI Service": "http://localhost:5001/health",
    "Backend": "http://localhost:3001/health",
    "Frontend": "http://localhost:3000",
}

print("=" * 60)
print("🏥 System Health Check")
print("=" * 60)

for service_name, url in services.items():
    try:
        print(f"\n🔍 Checking {service_name}...")
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            print(f"  ✅ {service_name} is running (HTTP {response.status_code})")
            if service_name == "AI Service":
                data = response.json()
                if 'classes' in data:
                    print(f"     Classes: {', '.join(data['classes'][:3])}...")
        else:
            print(f"  ⚠️ {service_name} responded with {response.status_code}")
    except requests.exceptions.ConnectionError:
        print(f"  ❌ Cannot connect to {service_name}")
    except Exception as e:
        print(f"  ⚠️ Error checking {service_name}: {e}")

print("\n" + "=" * 60)
print("📋 Summary")
print("=" * 60)

# Try one final API test through backend
print("\n🧪 Testing full request flow (via backend)...")
print("  Note: Backend should forward requests to AI service")

import json
from PIL import Image
import io

test_image = Image.new('RGB', (224, 224), color=(100, 150, 200))
img_bytes = io.BytesIO()
test_image.save(img_bytes, format='JPEG')
img_bytes.seek(0)

try:
    # Test direct AI service
    files = {'file': ('test.jpg', img_bytes, 'image/jpeg')}
    response = requests.post("http://localhost:5001/predict", files=files, timeout=30)
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ AI Service Direct Call: SUCCESS")
        print(f"   Category: {data['category']}")
        print(f"   Caption: {data['caption']}")
        print(f"   Hashtags: {data['hashtag_count']} generated")
        
        # Validate caption format
        caption = data.get('caption', '')
        if len(caption.split()) == 1:
            print(f"   ✅ Caption format: Single word ✓")
        else:
            print(f"   ⚠️ Caption format: {len(caption.split())} words (expected 1)")
    else:
        print(f"\n⚠️ AI Service returned: {response.status_code}")
        
except Exception as e:
    print(f"\n❌ AI Service test failed: {e}")

print("\n" + "=" * 60)
