import json
import os
import re

CATALOG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "flavour_world_master_catalog.json")
JS_MAP_PATH = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "Pantry_Label_Frontend", "src", "utils", "ingredientImageMap.js"))

with open(CATALOG_PATH, "r", encoding="utf-8") as f:
    catalog = json.load(f)

# Collect all items from catalog that have slug and filename
new_entries = {}
for item in catalog:
    if 33 <= item.get("id", 0) <= 111:
        slug = item.get("slug")
        fn = item.get("filename")
        if slug and fn:
            new_entries[slug] = fn

print(f"Loaded {len(new_entries)} entries to register in JS image map.")

with open(JS_MAP_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# Generate formatted JS entries grouped cleanly
new_js_lines = []
new_js_lines.append("\n  // 80 New Catalog Ingredients (Grains, Flours, Nuts, Dried Vathal, Masalas & Powders)")
for slug, fn in sorted(new_entries.items()):
    new_js_lines.append(f"  '{slug}': '{fn}',")

joined_new_lines = "\n".join(new_js_lines)

# Inject before the closing bracket of AVAILABLE_INGREDIENT_IMAGES
pattern = r"(export const AVAILABLE_INGREDIENT_IMAGES = \{[\s\S]*?)(  'food-colour': 'food-colour\.jpg'\n)(\};)"
replacement = r"\1\2" + joined_new_lines + r"\n\3"

if re.search(pattern, content):
    updated_content = re.sub(pattern, replacement, content)
    with open(JS_MAP_PATH, "w", encoding="utf-8") as f:
        f.write(updated_content)
    print("Successfully updated ingredientImageMap.js!")
else:
    print("Could not find pattern in ingredientImageMap.js.")
