#!/usr/bin/env python3
"""
Integration Test Script - Verify all services are connected and working

Tests the complete flow:
Frontend API Route → Backend Service → AI Service
And verifies caption generation is included in the response.

Usage:
    python test_integration.py
"""

import requests
import json
import time
from pathlib import Path

# Configuration
FRONTEND_API = "http://localhost:3000"
BACKEND_API = "http://localhost:4000"
AI_SERVICE = "http://localhost:5001"

# Test image (you can use any valid image)
TEST_IMAGE_PATH = "test_image.jpg"

def print_section(title):
    """Print a formatted section header"""
    print(f"\n{'='*70}")
    print(f"🔍 {title}")
    print(f"{'='*70}")

def test_service_health(name, url):
    """Test if a service is running"""
    print(f"\n📡 Testing {name}: {url}")
    try:
        response = requests.get(f"{url}/health", timeout=5)
        if response.status_code == 200:
            print(f"   ✅ {name} is running")
            return True
        else:
            print(f"   ⚠️  {name} responded with {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Cannot connect to {name} - is it running?")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_ai_service_predict(image_path):
    """Test AI service /predict endpoint directly"""
    print(f"\n🤖 Testing AI Service Prediction")
    print(f"   Image: {image_path}")
    
    try:
        with open(image_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(
                f"{AI_SERVICE}/predict",
                files=files,
                timeout=30
            )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ AI Service responded")
            print(f"      Category: {data.get('category')}")
            print(f"      Confidence: {data.get('confidence')}%")
            print(f"      Hashtags: {len(data.get('hashtags', []))} tags")
            
            caption = data.get('caption', '')
            if caption:
                print(f"      ✅ Caption: {caption[:50]}...")
            else:
                print(f"      ⚠️  Caption is empty")
            
            return data
        else:
            print(f"   ❌ AI Service returned {response.status_code}")
            print(f"      Response: {response.text[:200]}")
            return None
    except FileNotFoundError:
        print(f"   ❌ Test image not found: {image_path}")
        return None
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return None

def test_backend_predict(image_path):
    """Test Backend /api/hashtags/predict endpoint"""
    print(f"\n🎯 Testing Backend Prediction")
    print(f"   Image: {image_path}")
    
    try:
        with open(image_path, 'rb') as f:
            files = {'image': f}
            response = requests.post(
                f"{BACKEND_API}/api/hashtags/predict",
                files=files,
                timeout=30
            )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Backend responded")
            print(f"      Category: {data.get('category')}")
            print(f"      Confidence: {data.get('confidence')}%")
            print(f"      Hashtags: {len(data.get('hashtags', []))} tags")
            
            caption = data.get('caption', '')
            if caption:
                print(f"      ✅ Caption: {caption[:50]}...")
            else:
                print(f"      ⚠️  Caption is empty")
            
            return data
        else:
            print(f"   ❌ Backend returned {response.status_code}")
            print(f"      Response: {response.text[:200]}")
            return None
    except FileNotFoundError:
        print(f"   ❌ Test image not found: {image_path}")
        return None
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return None

def test_frontend_predict(image_path):
    """Test Frontend /api/hashtags/predict endpoint"""
    print(f"\n🌐 Testing Frontend API Route")
    print(f"   Image: {image_path}")
    
    try:
        with open(image_path, 'rb') as f:
            files = {'image': f}
            response = requests.post(
                f"{FRONTEND_API}/api/hashtags/predict",
                files=files,
                timeout=30
            )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Frontend API responded")
            print(f"      Category: {data.get('category')}")
            print(f"      Confidence: {data.get('confidence')}%")
            print(f"      Hashtags: {len(data.get('hashtags', []))} tags")
            
            caption = data.get('caption', '')
            if caption:
                print(f"      ✅ Caption: {caption[:50]}...")
            else:
                print(f"      ⚠️  Caption is empty")
            
            return data
        else:
            print(f"   ❌ Frontend API returned {response.status_code}")
            print(f"      Response: {response.text[:200]}")
            return None
    except FileNotFoundError:
        print(f"   ❌ Test image not found: {image_path}")
        return None
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return None

def create_test_image():
    """Create a simple test image if it doesn't exist"""
    try:
        from PIL import Image
        import os
        
        if not os.path.exists(TEST_IMAGE_PATH):
            print(f"   Creating test image: {TEST_IMAGE_PATH}")
            img = Image.new('RGB', (100, 100), color='red')
            img.save(TEST_IMAGE_PATH)
            print(f"   ✅ Test image created")
            return True
    except ImportError:
        print(f"   ⚠️  PIL not installed, skipping test image creation")
        return False
    except Exception as e:
        print(f"   ❌ Failed to create test image: {e}")
        return False

def main():
    """Run all tests"""
    print_section("FRONTEND-BACKEND-AI SERVICE INTEGRATION TEST")
    
    # Step 1: Check services are running
    print_section("Step 1: Service Health Check")
    ai_ok = test_service_health("AI Service", AI_SERVICE)
    backend_ok = test_service_health("Backend", BACKEND_API)
    frontend_ok = test_service_health("Frontend", FRONTEND_API)
    
    if not (ai_ok and backend_ok and frontend_ok):
        print(f"\n❌ Not all services are running!")
        print(f"   Start them with: docker-compose up")
        return False
    
    print(f"\n✅ All services are running")
    
    # Step 2: Create test image
    print_section("Step 2: Test Image Preparation")
    if not create_test_image():
        print(f"   ⚠️  Could not create test image")
        print(f"   Please provide a test image: {TEST_IMAGE_PATH}")
        return False
    
    # Step 3: Test AI Service directly
    print_section("Step 3: Direct AI Service Test")
    ai_response = test_ai_service_predict(TEST_IMAGE_PATH)
    if not ai_response:
        print(f"\n❌ AI Service prediction failed!")
        return False
    
    # Step 4: Test Backend
    print_section("Step 4: Backend API Test")
    backend_response = test_backend_predict(TEST_IMAGE_PATH)
    if not backend_response:
        print(f"\n❌ Backend prediction failed!")
        return False
    
    # Step 5: Test Frontend
    print_section("Step 5: Frontend API Route Test")
    frontend_response = test_frontend_predict(TEST_IMAGE_PATH)
    if not frontend_response:
        print(f"\n❌ Frontend prediction failed!")
        return False
    
    # Step 6: Verify caption is present in all responses
    print_section("Step 6: Caption Presence Verification")
    
    tests_passed = 0
    tests_total = 3
    
    if ai_response.get('caption'):
        print(f"✅ AI Service includes caption")
        tests_passed += 1
    else:
        print(f"❌ AI Service caption is empty")
    
    if backend_response.get('caption'):
        print(f"✅ Backend includes caption")
        tests_passed += 1
    else:
        print(f"❌ Backend caption is empty")
    
    if frontend_response.get('caption'):
        print(f"✅ Frontend API route includes caption")
        tests_passed += 1
    else:
        print(f"❌ Frontend API route caption is empty")
    
    # Final summary
    print_section("Test Summary")
    print(f"\n✅ Tests Passed: {tests_passed}/{tests_total}")
    
    if tests_passed == tests_total:
        print(f"\n🎉 ALL TESTS PASSED!")
        print(f"\nThe entire system is working correctly:")
        print(f"  1. ✅ Frontend can call backend API")
        print(f"  2. ✅ Backend can call AI service")
        print(f"  3. ✅ AI service generates captions")
        print(f"  4. ✅ Captions flow through entire system")
        print(f"\nYou can now:")
        print(f"  1. Open http://localhost:3000")
        print(f"  2. Navigate to Content Generator")
        print(f"  3. Upload an image")
        print(f"  4. Click 'Generate Caption & Hashtags'")
        print(f"  5. See both caption and hashtags displayed ✅")
        return True
    else:
        print(f"\n⚠️  Some tests failed. Check the logs above.")
        return False

if __name__ == '__main__':
    import sys
    success = main()
    sys.exit(0 if success else 1)
