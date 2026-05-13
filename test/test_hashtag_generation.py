#!/usr/bin/env python3
"""
Diagnostic script to test hashtag generation end-to-end
"""
import sys
import os
import requests
from pathlib import Path

# Test configuration
AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8000")
BACKEND_API = os.getenv("BACKEND_API", "http://localhost:4000")
FRONTEND_API = os.getenv("FRONTEND_API", "http://localhost:3000")

# Use a simple test image (create one if needed)
TEST_IMAGE_PATH = Path("test_image.jpg")

def create_test_image():
    """Create a simple test image if one doesn't exist"""
    try:
        from PIL import Image
        import numpy as np
        
        # Create a simple 224x224 image
        arr = np.random.randint(0, 256, (224, 224, 3), dtype=np.uint8)
        img = Image.fromarray(arr)
        img.save(TEST_IMAGE_PATH)
        print(f"✅ Created test image: {TEST_IMAGE_PATH}")
        return TEST_IMAGE_PATH
    except Exception as e:
        print(f"❌ Failed to create test image: {e}")
        return None

def test_ai_service():
    """Test the AI service /predict endpoint directly"""
    print("\n🔍 Testing AI Service (/predict endpoint)...")
    print(f"   URL: {AI_SERVICE_URL}/predict")
    
    if not TEST_IMAGE_PATH.exists():
        print("❌ Test image not found. Creating one...")
        if not create_test_image():
            print("❌ Cannot create test image")
            return False
    
    try:
        with open(TEST_IMAGE_PATH, "rb") as f:
            files = {"file": f}
            response = requests.post(f"{AI_SERVICE_URL}/predict", files=files, timeout=30)
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success!")
            print(f"      Category: {data.get('category')}")
            print(f"      Confidence: {data.get('confidence')}%")
            print(f"      Hashtags: {len(data.get('hashtags', []))} tags")
            print(f"      Caption: {data.get('caption', 'N/A')}")
            return True
        else:
            print(f"   ❌ Error: {response.text}")
            return False
    except requests.exceptions.ConnectionError as e:
        print(f"   ❌ Connection failed: {e}")
        print(f"      Make sure AI service is running at {AI_SERVICE_URL}")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_backend():
    """Test the backend /api/hashtags/predict endpoint"""
    print("\n🔍 Testing Backend (/api/hashtags/predict endpoint)...")
    print(f"   URL: {BACKEND_API}/api/hashtags/predict")
    
    if not TEST_IMAGE_PATH.exists():
        print("❌ Test image not found. Creating one...")
        if not create_test_image():
            print("❌ Cannot create test image")
            return False
    
    try:
        with open(TEST_IMAGE_PATH, "rb") as f:
            files = {"image": f}
            response = requests.post(f"{BACKEND_API}/api/hashtags/predict", files=files, timeout=30)
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success!")
            print(f"      Category: {data.get('category')}")
            print(f"      Confidence: {data.get('confidence')}%")
            print(f"      Hashtags: {len(data.get('hashtags', []))} tags")
            print(f"      Caption: {data.get('caption', 'N/A')}")
            return True
        else:
            print(f"   ❌ Error: {response.text}")
            return False
    except requests.exceptions.ConnectionError as e:
        print(f"   ❌ Connection failed: {e}")
        print(f"      Make sure backend is running at {BACKEND_API}")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_frontend():
    """Test the frontend /api/hashtags/predict endpoint"""
    print("\n🔍 Testing Frontend (/api/hashtags/predict endpoint)...")
    print(f"   URL: {FRONTEND_API}/api/hashtags/predict")
    
    if not TEST_IMAGE_PATH.exists():
        print("❌ Test image not found. Creating one...")
        if not create_test_image():
            print("❌ Cannot create test image")
            return False
    
    try:
        with open(TEST_IMAGE_PATH, "rb") as f:
            files = {"image": f}
            response = requests.post(f"{FRONTEND_API}/api/hashtags/predict", files=files, timeout=30)
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success!")
            print(f"      Category: {data.get('category')}")
            print(f"      Confidence: {data.get('confidence')}%")
            print(f"      Hashtags: {len(data.get('hashtags', []))} tags")
            print(f"      Caption: {data.get('caption', 'N/A')}")
            return True
        else:
            print(f"   ❌ Error: {response.text}")
            return False
    except requests.exceptions.ConnectionError as e:
        print(f"   ❌ Connection failed: {e}")
        print(f"      Make sure frontend is running at {FRONTEND_API}")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    print("=" * 60)
    print("🧪 Hashtag Generation Diagnostic Test")
    print("=" * 60)
    
    print(f"\nConfiguration:")
    print(f"  AI Service: {AI_SERVICE_URL}")
    print(f"  Backend: {BACKEND_API}")
    print(f"  Frontend: {FRONTEND_API}")
    
    # Run tests
    ai_ok = test_ai_service()
    backend_ok = test_backend()
    frontend_ok = test_frontend()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Summary")
    print("=" * 60)
    print(f"AI Service:    {'✅ PASS' if ai_ok else '❌ FAIL'}")
    print(f"Backend:       {'✅ PASS' if backend_ok else '❌ FAIL'}")
    print(f"Frontend:      {'✅ PASS' if frontend_ok else '❌ FAIL'}")
    
    if ai_ok and backend_ok and frontend_ok:
        print("\n✅ All tests passed! Hashtag generation should work.")
        return 0
    else:
        print("\n❌ Some tests failed. Check the logs above for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
