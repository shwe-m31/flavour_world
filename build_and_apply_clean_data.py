import re
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

# Import our curated map
from create_translations_db import TRANSLATIONS_MAP

# Load the parsed items
with open('all_parsed_items.json', encoding='utf-8') as f:
    items = json.load(f)

print(f"Loaded {len(items)} items from all_parsed_items.json")

# Clean CID regex
CID_PATTERN = re.compile(r'\(cid:\d+\)')
CORRUPT_PATTERN = re.compile(r'[\?]{2,}')

def clean_field(val, lang, english_name):
    # Check if curated translation exists
    if english_name in TRANSLATIONS_MAP and lang in TRANSLATIONS_MAP[english_name]:
        return TRANSLATIONS_MAP[english_name][lang]
    
    if not val:
        return english_name
    
    t = CID_PATTERN.sub('', val)
    t = CORRUPT_PATTERN.sub('', t)
    t = t.strip()
    
    # Strip leading/trailing junk
    t = re.sub(r'^\s*[\(\)\?\,\.\-]+\s*', '', t)
    t = re.sub(r'\s*[\(\)\?\,\.\-]+\s*$', '', t)
    t = t.strip()
    
    # If the text is empty or purely ASCII question marks or length < 2, fallback
    if not t or len(t) < 2 or all(c in '? !-()' for c in t):
        return english_name
    
    return t

def assign_category(name, sub_cat):
    nl = name.lower()
    sl = sub_cat.lower()
    
    # 7. Sweeteners & Salts
    if any(k in nl for k in ['salt', 'sugar', 'jaggery', 'honey', 'syrup', 'candy']):
        return 7
    # 6. Oils & Ghee
    if any(k in nl for k in ['oil', 'ghee', 'butter', 'vinegar', 'pickle', 'sauce', 'ketchup']):
        return 6
    # 2. Pulses & Lentils
    if any(k in nl for k in ['dal', 'lentil', 'chickpea', 'rajma', 'mochai', 'cowpea', 'soybean', 'sprout', 'soya chunks']) and not any(k in nl for k in ['flour', 'powder', 'oil', 'masala']):
        return 2
    # 5. Flours & Atta (Includes Rava, Vermicelli, Pasta, Macaroni, Baking ingredients)
    if any(k in nl for k in ['flour', 'atta', 'maida', 'besan', 'rava', 'semolina', 'vermicelli', 'macaroni', 'pasta', 'sevai', 'noodles', 'baking', 'yeast', 'cocoa', 'chocolate', 'custard', 'gelatin', 'agar agar', 'starch', 'breadcrumbs', 'food colour', 'vanilla']):
        return 5
    # 4. Spice Powders & Blends
    if any(k in nl for k in ['masala', 'powder', 'podi', 'mix', 'amchur', 'paste', 'garlic paste']) or any(k in sl for k in ['masala', 'powder', 'mix']):
        return 4
    # 8. Nuts, Seeds & Dry Fruits
    if any(k in nl for k in ['nut', 'almond', 'cashew', 'pista', 'walnut', 'hazelnut', 'raisin', 'date', 'fig', 'apricot', 'cranberry', 'seeds', 'makhana', 'vathal', 'dried', 'dry coconut', 'coconut cream', 'chips', 'murukku', 'fryums', 'vadam', 'papad', 'peanut']) or any(k in sl for k in ['nut', 'seed', 'vathal', 'dry fruits']):
        return 8
    # 1. Grains & Rice
    if any(k in nl for k in ['rice', 'poha', 'aval', 'millet', 'wheat', 'oats', 'corn', 'barley', 'quinoa', 'maize', 'sago', 'cereal', 'flake', 'crispie', 'muesli', 'grits']) or any(k in sl for k in ['rice', 'grain', 'millet', 'cereal']):
        return 1
    # 3. Spices & Whole Masalas
    if any(k in sl for k in ['spice', 'aromatic', 'herb', 'traditional', 'pepper', 'cardamom', 'clove', 'cinnamon']) or any(k in nl for k in ['seeds', 'pepper', 'cardamom', 'cloves', 'cinnamon', 'anise', 'bay leaf', 'ajwain', 'ginger', 'asafoetida', 'mustard', 'cumin', 'fennel', 'fenugreek', 'coriander', 'chilli']):
        return 3

    return 3

# Fix malformed English names
NAME_FIXES = {
    "e Gooseberry Pickle": "Gooseberry Pickle",
    "Multigrain Dosa Mix ம": "Multigrain Dosa Mix",
    "White Chickpeas ெ": "White Chickpeas"
}

cleaned_items = []
languages = ['tamil', 'hindi', 'telugu', 'kannada', 'malayalam', 'bengali', 'marathi', 'gujarati', 'punjabi', 'odia', 'assamese', 'urdu']

for item in items:
    name = item['name'].strip()
    if name in NAME_FIXES:
        name = NAME_FIXES[name]
    
    sub_category = item['subCategory'].strip()
    cat_id = assign_category(name, sub_category)
    
    cleaned_langs = {}
    for lang in languages:
        cleaned_langs[lang] = clean_field(item.get(lang, ''), lang, name)
    
    # Bilingual name is default regional (Tamil) or English
    bilingual = cleaned_langs.get('tamil', name)
    
    cleaned_item = {
        'code': item['code'],
        'name': name,
        'subCategory': sub_category,
        'bilingual': bilingual,
        'tamil': cleaned_langs['tamil'],
        'hindi': cleaned_langs['hindi'],
        'telugu': cleaned_langs['telugu'],
        'kannada': cleaned_langs['kannada'],
        'malayalam': cleaned_langs['malayalam'],
        'bengali': cleaned_langs['bengali'],
        'marathi': cleaned_langs['marathi'],
        'gujarati': cleaned_langs['gujarati'],
        'punjabi': cleaned_langs['punjabi'],
        'odia': cleaned_langs['odia'],
        'assamese': cleaned_langs['assamese'],
        'urdu': cleaned_langs['urdu'],
        'price': '2.00',
        'categoryId': cat_id
    }
    cleaned_items.append(cleaned_item)

print(f"Processed {len(cleaned_items)} items.")

# Verify the 8 test items
test_names = ['Wheat Rava', 'Fine Rava', 'Bombay Rava', 'Semolina', 'Vermicelli', 'Roasted Vermicelli', 'Macaroni', 'Pasta']
print("\nValidation of 8 Test Items:")
for ci in cleaned_items:
    if ci['name'] in test_names:
        print(f"\nItem: {ci['name']} (Cat {ci['categoryId']}) Price: {ci['price']}")
        print(f"  Tamil: {ci['tamil']}")
        print(f"  Hindi: {ci['hindi']}")
        print(f"  Telugu: {ci['telugu']}")
        print(f"  Kannada: {ci['kannada']}")
        print(f"  Malayalam: {ci['malayalam']}")
        print(f"  Bengali: {ci['bengali']}")
        print(f"  Marathi: {ci['marathi']}")
        print(f"  Gujarati: {ci['gujarati']}")
        print(f"  Punjabi: {ci['punjabi']}")
        print(f"  Odia: {ci['odia']}")
        print(f"  Assamese: {ci['assamese']}")
        print(f"  Urdu: {ci['urdu']}")

# Save cleaned items to JSON
with open('cleaned_catalog.json', 'w', encoding='utf-8') as out:
    json.dump(cleaned_items, out, indent=2, ensure_ascii=False)
print("\nSaved cleaned items to cleaned_catalog.json")
