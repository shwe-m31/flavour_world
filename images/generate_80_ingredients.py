"""
Flavour World - 80 Ingredient Photography Batch Generator
---------------------------------------------------------
Automated generation script for 80 pantry ingredients matching the strict visual standard:
- Pure/soft off-white seamless background
- Single centered round white ceramic bowl
- Soft realistic contact shadow underneath
- Professional studio diffused lighting (high angle 50° view, 1:1 square ratio)
- Accurate culinary and physical realism for each ingredient
- No spoons, no utensils, no hands, no text, no logos, no extra objects

Supports:
 1. Google AI Studio Imagen 3 (:generateImages)
 2. Gemini 2.0 / 2.5 Multi-Modal Image Generation (generateContent with IMAGE modality)

Usage:
  python generate_80_ingredients.py --api-key YOUR_API_KEY
  python generate_80_ingredients.py --api-key YOUR_API_KEY --single "Corn Meal"
  python generate_80_ingredients.py --api-key YOUR_API_KEY --limit 5
"""

import os
import sys
import json
import time
import shutil
import argparse
import urllib.request
import urllib.error
import base64

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
FRONTEND_PUBLIC_DIR = os.path.join(PROJECT_ROOT, "Pantry_Label_Frontend", "public", "ingredients")
CATALOG_PATH = os.path.join(SCRIPT_DIR, "flavour_world_master_catalog.json")

TARGET_80_INGREDIENTS = [
    "Corn Meal", "Rice Bran", "Wheat Bran", "Dry Coconut Powder", "Coconut Cream",
    "White Vinegar", "Apple Cider Vinegar", "Curd Chilli", "Cow Ghee", "Buffalo Ghee",
    "Butter", "Dried Turkey Berry", "Dried Brinjal", "Dried Cluster Beans", "Dried Bitter Gourd",
    "Dried Mango", "Dry Rose Petals", "Almond", "Cashew Nut", "Pistachio",
    "Walnut", "Hazelnut", "Macadamia Nut", "Brazil Nut", "Pine Nut",
    "Golden Raisins", "Black Raisins", "Seedless Dates", "Premium Dates", "Dried Fig",
    "Dried Apricot", "Dried Cranberry", "Dry Coconut", "Wheat Flour", "Rice Flour",
    "Maida", "Besan", "Corn Flour", "Ragi Flour", "Kambu Flour",
    "Thinai Flour", "Samai Flour", "Varagu Flour", "Kuthiraivali Flour", "Cholam Flour",
    "Multigrain Flour", "Oats Flour", "Coconut Flour", "Tapioca Flour", "Idiyappam Flour",
    "Puttu Flour", "Rava", "Bombay Rava", "Gram Flour", "Sattu Flour",
    "Sorghum Flour", "Arrowroot Powder", "Roasted Rice Flour", "Roasted Gram Flour", "Moringa Leaf Powder",
    "Banana Flower Powder", "Banana Stem Powder", "Curry Leaf Powder", "Mint Leaf Powder", "Coriander Leaf Powder",
    "Neem Flower Powder", "Psyllium Husk", "Dried Mint Leaves", "Dried Coriander Leaves", "Chettinad Masala",
    "Egg Masala", "Chole Masala", "Rajma Masala", "Tandoori Masala", "Sambar Masala",
    "Rasam Masala", "Kurma Masala", "Curry Masala", "Shahi Paneer Masala", "Meat Masala"
]

def load_catalog():
    if not os.path.exists(CATALOG_PATH):
        print(f"Error: Catalog not found at {CATALOG_PATH}")
        sys.exit(1)
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_catalog(catalog):
    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

def try_imagen_3(prompt, api_key):
    """Google AI Studio Imagen 3 via generateImages endpoint"""
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
                return base64.b64decode(images[0]["image"]["imageBytes"]), None
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8")
        return None, f"HTTP {e.code}: {err}"
    except Exception as e:
        return None, str(e)
    return None, "No image bytes returned"

def try_gemini_flash(prompt, api_key, model_name="gemini-2.0-flash-exp"):
    """Gemini multimodal generateContent with IMAGE response modality"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["IMAGE"]}
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
                        return base64.b64decode(p["inlineData"]["data"]), None
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8")
        return None, f"HTTP {e.code}: {err}"
    except Exception as e:
        return None, str(e)
    return None, "No inline image returned"

def detect_working_generator(api_key):
    test_prompt = "A simple white ceramic bowl with natural spices inside on a clean white background, square studio photography"
    print("\nProbing available image generation endpoints for your API key...")

    print(" - Checking Imagen 3 (imagen-3.0-generate-002)...", end=" ", flush=True)
    img, err = try_imagen_3(test_prompt, api_key)
    if img:
        print("ONLINE! (Using Imagen 3)")
        return "imagen-3", None
    print(f"Unavailable ({err})")

    print(" - Checking Gemini 2.0 Flash (IMAGE modality)...", end=" ", flush=True)
    img2, err2 = try_gemini_flash(test_prompt, api_key, "gemini-2.0-flash-exp")
    if img2:
        print("ONLINE! (Using Gemini 2.0 Flash)")
        return "gemini-2.0", None
    print(f"Unavailable ({err2})")

    return None, f"Imagen 3 error: {err} | Gemini 2.0 error: {err2}"

def main():
    parser = argparse.ArgumentParser(description="Flavour World 80 Ingredient Batch Image Generator")
    parser.add_argument("--api-key", default=os.getenv("GEMINI_API_KEY"), help="Google AI Studio Gemini API Key")
    parser.add_argument("--single", type=str, default=None, help="Generate only a single ingredient by name (e.g. 'Corn Meal')")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of images to generate in this run")
    args = parser.parse_args()

    if not args.api_key:
        print("=" * 70)
        print("FLAVOUR WORLD 80-INGREDIENT PRODUCT PHOTOGRAPHY GENERATOR")
        print("=" * 70)
        print("Usage:")
        print("  python generate_80_ingredients.py --api-key YOUR_GOOGLE_API_KEY")
        print("  python generate_80_ingredients.py --api-key YOUR_GOOGLE_API_KEY --single 'Corn Meal'")
        print("  python generate_80_ingredients.py --api-key YOUR_GOOGLE_API_KEY --limit 5")
        print("=" * 70)
        return

    method, probe_err = detect_working_generator(args.api_key)
    if not method:
        print("\n[Notice] Could not initialize image generation with provided API key:")
        print(f"Details: {probe_err}")
        return

    catalog = load_catalog()
    cat_by_name = {item["name"].lower(): item for item in catalog}

    os.makedirs(FRONTEND_PUBLIC_DIR, exist_ok=True)
    existing_files = set(os.listdir(SCRIPT_DIR))

    # Collect matched target items
    target_items = []
    for name in TARGET_80_INGREDIENTS:
        item = cat_by_name.get(name.lower())
        if not item:
            for k, v in cat_by_name.items():
                if name.lower() == k or name.lower() in k or k in name.lower():
                    item = v
                    break
        if item and item not in target_items:
            target_items.append(item)

    if args.single:
        target_items = [it for it in target_items if args.single.lower() in it["name"].lower()]
        if not target_items:
            print(f"Ingredient '{args.single}' not found in target list.")
            return

    pending_items = [it for it in target_items if it["filename"] not in existing_files]

    if args.limit and args.limit > 0:
        pending_items = pending_items[:args.limit]

    print(f"\nTarget items: {len(target_items)} | Existing: {len(target_items) - len(pending_items)} | To generate: {len(pending_items)}")

    if not pending_items:
        print("All target ingredients are already generated!")
        return

    success_count = 0
    for idx, item in enumerate(pending_items, 1):
        fn = item["filename"]
        target_local_path = os.path.join(SCRIPT_DIR, fn)
        target_frontend_path = os.path.join(FRONTEND_PUBLIC_DIR, fn)

        print(f"[{idx}/{len(pending_items)}] Generating {item['name']} -> {fn}...", end=" ", flush=True)

        img_bytes = None
        if method == "imagen-3":
            img_bytes, err = try_imagen_3(item["prompt"], args.api_key)
        elif method == "gemini-2.0":
            img_bytes, err = try_gemini_flash(item["prompt"], args.api_key, "gemini-2.0-flash-exp")

        if img_bytes:
            with open(target_local_path, "wb") as f:
                f.write(img_bytes)
            # Copy directly to frontend public directory
            shutil.copy2(target_local_path, target_frontend_path)

            item["status"] = "COMPLETED"
            existing_files.add(fn)
            success_count += 1
            print("✓ Saved & Synced to Frontend")
            save_catalog(catalog)
            time.sleep(1.5)
        else:
            print(f"✗ Failed ({err})")

    print(f"\nCompleted! Generated and synced {success_count} / {len(pending_items)} images.")

if __name__ == "__main__":
    main()
