import os
import sys
import json
import urllib.request
import urllib.error

def check_models(api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            models = data.get("models", [])
            print(f"Total models returned: {len(models)}")
            
            image_models = []
            for m in models:
                name = m.get("name", "")
                methods = m.get("supportedGenerationMethods", [])
                if "image" in name.lower() or "predict" in methods or "imagen" in name.lower():
                    image_models.append((name, methods))
            
            print("\nCandidate Image Models:")
            for name, methods in image_models:
                print(f" - {name} -> Methods: {methods}")
            
            if not image_models:
                print("No image/predict models found in standard list. All model names:")
                for m in models:
                    print(f"   {m.get('name')}")
                    
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python diagnose_models.py YOUR_API_KEY")
    else:
        check_models(sys.argv[1])
