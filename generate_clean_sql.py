import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('cleaned_catalog.json', encoding='utf-8') as f:
    items = json.load(f)

def esc(val):
    if val is None:
        return 'NULL'
    return "'" + str(val).replace("'", "''") + "'"

lines = []
lines.append('-- Insert States')
lines.append("INSERT INTO states (id, name) VALUES")
lines.append("(1, 'Delhi'), (2, 'Maharashtra'), (3, 'Karnataka'), (4, 'Tamil Nadu'), (5, 'West Bengal');")
lines.append('')
lines.append('-- Insert Categories (8 Standard Filter Categories)')
lines.append('INSERT INTO categories (id, name, description) VALUES')
lines.append("(1, 'Grains & Rice', 'Staple rice varieties, millets and whole grains'),")
lines.append("(2, 'Pulses & Lentils', 'Dals, legumes and split pulses'),")
lines.append("(3, 'Spices & Whole Masalas', 'Whole seeds, spice pods and aromatic bark'),")
lines.append("(4, 'Spice Powders & Blends', 'Ground chili, turmeric, sambar powders'),")
lines.append("(5, 'Flours & Atta', 'Wheat, rice, ragi and millet flours'),")
lines.append("(6, 'Oils & Ghee', 'Cold pressed edible oils and clarified butter'),")
lines.append("(7, 'Sweeteners & Salts', 'Jaggery, rock salt, table salt and sugars'),")
lines.append("(8, 'Nuts, Seeds & Dry Fruits', 'Cashews, almonds, mustard seeds, sesame');")
lines.append('')
lines.append('-- Insert Products (₹2.00 per sticker, cleaned regional translations)')
lines.append('INSERT INTO products (product_code, name, sub_category, bilingual_name, tamil_name, hindi_name, telugu_name, kannada_name, malayalam_name, bengali_name, marathi_name, gujarati_name, punjabi_name, odia_name, assamese_name, urdu_name, price, category_id) VALUES')

val_rows = []
for it in items:
    row = f"({esc(it['code'])}, {esc(it['name'])}, {esc(it['subCategory'])}, {esc(it['bilingual'])}, {esc(it['tamil'])}, {esc(it['hindi'])}, {esc(it['telugu'])}, {esc(it['kannada'])}, {esc(it['malayalam'])}, {esc(it['bengali'])}, {esc(it['marathi'])}, {esc(it['gujarati'])}, {esc(it['punjabi'])}, {esc(it['odia'])}, {esc(it['assamese'])}, {esc(it['urdu'])}, 2.00, {it['categoryId']})"
    val_rows.append(row)

lines.append(',\n'.join(val_rows) + ';')
sql_content = '\n'.join(lines) + '\n'

with open('Pantry_Label_Backend/src/main/resources/sample_data.sql', 'w', encoding='utf-8') as f:
    f.write(sql_content)

with open('database/sample_data.sql', 'w', encoding='utf-8') as f:
    f.write(sql_content)

print(f'Successfully wrote {len(items)} products into sample_data.sql in both locations.')
