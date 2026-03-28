import requests
import json

def test_misinfo_endpoints():
    print("Testing /api/misinfo-stats...")
    try:
        r = requests.get("http://localhost:8000/api/misinfo-stats")
        print(f"Status: {r.status_code}")
        data = r.json()
        print("Stats Keys:", data.get('data', {}).keys())
        
        print("\nTesting /api/search-misinfo?query=warming...")
        r2 = requests.get("http://localhost:8000/api/search-misinfo?query=the sun is causing warming")
        data2 = r2.json()
        print(f"Status: {r2.status_code}")
        print("First match:", data2.get('results', [{}])[0].get('claim'))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_misinfo_endpoints()
