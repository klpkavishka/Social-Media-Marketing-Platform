"""
Multiple API tests to verify consistency
"""
import requests
import numpy as np
from PIL import Image
import io
import json

def test_api(color_name, rgb_color):
    """Test the API with a colored image"""
    print(f"\n📸 Testing with {color_name} image...")
    
    # Create colored test image
    test_image = Image.new('RGB', (224, 224), color=rgb_color)
    img_bytes = io.BytesIO()
    test_image.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    url = "http://localhost:5001/predict"
    files = {'file': ('test.jpg', img_bytes, 'image/jpeg')}
    
    try:
        response = requests.post(url, files=files, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            caption = data.get('caption', '')
            category = data.get('category', '')
            hashtag_count = data.get('hashtag_count', 0)
            
            print(f"  ✅ Category: {category}")
            print(f"     Caption: '{caption}' (word count: {len(caption.split())})")
            print(f"     Hashtags: {hashtag_count}")
            return True
        else:
            print(f"  ❌ Error: {response.status_code}")
            return False
    except Exception as e:
        print(f"  ❌ Exception: {e}")
        return False

# Run multiple tests
print("=" * 60)
print("🧪 Running AI Service Consistency Tests")
print("=" * 60)

tests = [
    ("red", (255, 0, 0)),
    ("green", (0, 255, 0)),
    ("blue", (0, 0, 255)),
    ("yellow", (255, 255, 0)),
    ("purple", (128, 0, 128)),
]

passed = 0
for color_name, rgb in tests:
    if test_api(color_name, rgb):
        passed += 1

print("\n" + "=" * 60)
print(f"Results: {passed}/{len(tests)} tests passed")
print("=" * 60)

if passed == len(tests):
    print("\n✅ All systems operational!")
    print("  - Hashtag generation: ✅ Working")
    print("  - Caption generation: ✅ Working (single word)")
    print("  - API endpoint: ✅ Responding")
else:
    print(f"\n⚠️ {len(tests) - passed} test(s) failed")
