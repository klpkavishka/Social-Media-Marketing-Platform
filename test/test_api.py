import requests

try:
    with open('test_image.png', 'rb') as f:
        files = {'file': f}
        r = requests.post('http://localhost:5001/predict', files=files, timeout=15)
        print('Status:', r.status_code)
        print('Response:', r.text)
except Exception as e:
    print(f"Error: {e}")
