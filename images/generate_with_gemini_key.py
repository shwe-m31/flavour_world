"""
Flavour World Automated Ingredient Photography Generator
---------------------------------------------------------
Multi-method generator that supports:
 1. Google AI Studio Imagen 3 (:generateImages)
 2. Gemini Multi-Modal Image Generation (gemini-2.0-flash-exp / gemini-2.5-flash-image)
 3. Vertex AI / Enterprise predict endpoints

Usage:
  python generate_with_gemini_key.py --api-key YOUR_API_KEY
"""

import os
import sys
import json
import time
import argparse
import urllib.request
import urllib.error
import base64

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MANIFEST_PATH = os.path.join(SCRIPT_DIR, "flavour_world_master_catalog.json")
OUTPUT_DIR = SCRIPT_DIR

def load_manifest():
    if not os.path.exists(MANIFEST_PATH):
        print(f"Error: Manifest not found at {MANIFEST_PATH}")
        sys.exit(1)
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_manifest(catalog):
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

def try_imagen_3_generate_images(prompt, api_key):
    """Method 1: Google AI Studio Imagen 3 via generateImages endpoint"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "prompt": prompt,
        "numberOfImages": 1,
        "aspectRatio": "1:1",
        "outputMimeType": "image/jpeg"
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            images = data.get("generatedImages", [])
            if images and "image" in images[0] and "imageBytes" in images[0]["image"]:
                return base64.b64decode(images[0]["image"]["imageBytes"])
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8")
        return None, f"HTTP {e.code}: {err}"
    except Exception as e:
        return None, str(e)
    return None, "No image in response"

def try_gemini_generate_content(prompt, api_key, model_name="gemini-2.0-flash-exp"):
    """Method 2: Gemini multimodal generateContent with IMAGE response modality"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "responseModalities": ["IMAGE"]
        }
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            candidates = data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                for p in parts:
                    if "inlineData" in p and "data" in p["inlineData"]:
                        return base64.b64decode(p["inlineData"]["data"])
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8")
        return None, f"HTTP {e.code}: {err}"
    except Exception as e:
        return None, str(e)
    return None, "No inline image in response"

def detect_working_generator(api_key):
    """Probe available methods with a test prompt to find which one the API key supports"""
    test_prompt = "A simple white ceramic bowl with natural spices inside on a white background, square catalog photography"
    print("\nProbing available image generation methods for your API key...")

    # Probe 1: Imagen 3 generateImages
    print(" - Checking Imagen 3 (:generateImages)...", end=" ", flush=True)
    res = try_imagen_3_generate_images(test_prompt, api_key)
    if isinstance(res, bytes):
        print("SUCCESS! (Using Imagen 3)")
        return "imagen-3", None
    else:
        print("Unavailable")
        err1 = res[1] if isinstance(res, tuple) else "Error"

    # Probe 2: Gemini 2.0 Flash Exp with IMAGE modality
    print(" - Checking Gemini 2.0 Flash Image Modality...", end=" ", flush=True)
    res2 = try_gemini_generate_content(test_prompt, api_key, "gemini-2.0-flash-exp")
    if isinstance(res2, bytes):
        print("SUCCESS! (Using Gemini 2.0 Flash)")
        return "gemini-2.0", None
    else:
        print("Unavailable")
        err2 = res2[1] if isinstance(res2, tuple) else "Error"

    # Probe 3: Check list of models to see what is on this key
    print(" - Querying ModelService.ListModels...")
    try:
        list_url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
        with urllib.request.urlopen(list_url, timeout=15) as resp:
            models_data = json.loads(resp.read().decode("utf-8")).get("models", [])
            image_capable = [m["name"] for m in models_data if "image" in m["name"].lower() or "imagen" in m["name"].lower()]
            print(f"   Available models with image capabilities: {image_capable}")
    except Exception as e:
        print(f"   Could not list models: {e}")

    return None, f"Imagen 3: {err1} | Gemini 2.0: {err2}"

def main():
    parser = argparse.ArgumentParser(description="Flavour World Batch Image Generator")
    parser.add_argument("--api-key", default=os.getenv("GEMINI_API_KEY"), help="Google AI Studio Gemini API Key")
    parser.add_argument("--batch", type=int, default=None, help="Generate only a specific batch (1-20)")
    args = parser.parse_args()

    if not args.api_key:
        print("=" * 60)
        print("FLAVOUR WORLD INGREDIENT CATALOG BATCH GENERATOR")
        print("=" * 60)
        print("Usage:")
        print("  python generate_with_gemini_key.py --api-key YOUR_API_KEY")
        print("=" * 60)
        return

    method, err_probe = detect_working_generator(args.api_key)
    if not method:
        print("\n[Configuration Notice]")
        print("Neither direct Imagen 3 nor Gemini 2.0 Flash image generation is enabled")
        print("for this specific API key.")
        print(f"Details: {err_probe}")
        print("\nNote: On Google AI Studio (free tier), direct image generation endpoints")
        print("frequently require a billing account attached (pay-as-you-go tier) or Vertex AI.")
        return

    catalog = load_manifest()
    existing_files = set(os.listdir(OUTPUT_DIR))

    pending_items = [
        item for item in catalog 
        if item["filename"] not in existing_files and (args.batch is None or item["batch"] == args.batch)
    ]

    print(f"\nCatalog: {len(catalog)} total | {len(existing_files)} existing | {len(pending_items)} pending to generate.")

    success_count = 0
    for idx, item in enumerate(pending_items, 1):
        filename = item["filename"]
        target_path = os.path.join(OUTPUT_DIR, filename)
        print(f"[{idx}/{len(pending_items)}] Generating: {item['name']} -> {filename}...", end=" ", flush=True)

        img_bytes = None
        if method == "imagen-3":
            res = try_imagen_3_generate_images(item["prompt"], args.api_key)
            if isinstance(res, bytes):
                img_bytes = res
        elif method == "gemini-2.0":
            res = try_gemini_generate_content(item["prompt"], args.api_key, "gemini-2.0-flash-exp")
            if isinstance(res, bytes):
                img_bytes = res

        if img_bytes:
            with open(target_path, "wb") as f:
                f.write(img_bytes)
            print("✓ Saved")
            item["status"] = "COMPLETED"
            success_count += 1
            existing_files.add(filename)
            save_manifest(catalog)
            time.sleep(1.5)
        else:
            print("✗ Failed")

    print(f"\nFinished! Generated {success_count} images.")

if __name__ == "__main__":
    main()
