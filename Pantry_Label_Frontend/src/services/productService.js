import axios from 'axios';
import { getIngredientImage } from '../utils/ingredientImageMap.js';

const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:8080';

// Fallback Indian States
const DEFAULT_STATES = [
  { id: 23, name: 'Tamil Nadu' },
  { id: 11, name: 'Karnataka' },
  { id: 12, name: 'Kerala' },
  { id: 14, name: 'Maharashtra' },
  { id: 24, name: 'Telangana' },
  { id: 1, name: 'Andhra Pradesh' },
  { id: 28, name: 'West Bengal' },
  { id: 7, name: 'Gujarat' },
  { id: 20, name: 'Punjab' },
  { id: 26, name: 'Uttar Pradesh' },
  { id: 32, name: 'Delhi' },
  { id: 21, name: 'Rajasthan' }
];

// Fallback Pantry Categories
const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Grains & Rice', description: 'Staple rice varieties, millets and whole grains' },
  { id: 2, name: 'Pulses & Lentils', description: 'Dals, legumes and split pulses' },
  { id: 3, name: 'Spices & Whole Masalas', description: 'Whole seeds, spice pods and aromatic bark' },
  { id: 4, name: 'Spice Powders & Blends', description: 'Ground chili, turmeric, sambar powders' },
  { id: 5, name: 'Flours & Atta', description: 'Wheat, rice, ragi and millet flours' },
  { id: 6, name: 'Oils & Ghee', description: 'Cold pressed edible oils and clarified butter' },
  { id: 7, name: 'Sweeteners & Salts', description: 'Jaggery, rock salt, table salt and sugars' },
  { id: 8, name: 'Nuts, Seeds & Dry Fruits', description: 'Cashews, almonds, mustard seeds, sesame' }
];

// Comprehensive 80+ Ingredient Catalogue (with fixed price of ₹2.00)
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    productCode: 'GRN-001',
    name: 'Rice (Ponni / Raw)',
    subCategory: 'Rice Varieties',
    bilingualName: 'அரிசி',
    price: 2.00,
    categoryId: 1,
    stateId: 23,
    tamilName: 'அரிசி',
    hindiName: 'चावल',
    teluguName: 'బియ్యం',
    kannadaName: 'ಅಕ್ಕಿ',
    malayalamName: 'അരി',
    bengaliName: 'চাল',
    marathiName: 'तांदूळ',
    gujaratiName: 'ચોખા',
    punjabiName: 'ਚੌਲ',
    odiaName: 'ଚାଉଳ',
    assameseName: 'চাউল',
    urduName: 'چاول'
  },
  {
    id: 2,
    productCode: 'GRN-002',
    name: 'Basmati Rice',
    subCategory: 'Aromatic Rice',
    bilingualName: 'பாசுமதி அரிசி',
    price: 2.00,
    categoryId: 1,
    stateId: null,
    tamilName: 'பாசுமதி அரிசி',
    hindiName: 'बासमती चावल',
    teluguName: 'బాస్మతి బియ్యం',
    kannadaName: 'ಬಾಸ್ಮತಿ ಅಕ್ಕಿ',
    malayalamName: 'ബസ്മതി അരി',
    bengaliName: 'বাসমতী চাল',
    marathiName: 'बासमती तांदूळ',
    gujaratiName: 'બાસમતી ચોખા',
    punjabiName: 'ਬਾਸਮਤੀ ਚੌਲ',
    odiaName: 'ବାସମତୀ ଚାଉଳ',
    assameseName: 'বাসমতী চাউল',
    urduName: 'باسنتی چاول'
  },
  {
    id: 3,
    productCode: 'PLS-001',
    name: 'Toor Dal',
    subCategory: 'Lentils',
    bilingualName: 'துவரம் பருப்பு',
    price: 2.00,
    categoryId: 2,
    stateId: null,
    tamilName: 'துவரம் பருப்பு',
    hindiName: 'अरहर / तूर दाल',
    teluguName: 'కంది పప్పు',
    kannadaName: 'ತೊಗರಿ ಬೇಳೆ',
    malayalamName: 'തുവര പരിപ്പ്',
    bengaliName: 'অড়হর ডাল',
    marathiName: 'तूर डाळ',
    gujaratiName: 'તુવેર દાળ',
    punjabiName: 'ਤੂਰ ਦਾਲ',
    odiaName: 'ହରଡ଼ ଡାଲି',
    assameseName: 'ৰহৰ দাইল',
    urduName: 'تور دال'
  },
  {
    id: 4,
    productCode: 'PLS-002',
    name: 'Urad Dal',
    subCategory: 'Lentils',
    bilingualName: 'உளுத்தம் பருப்பு',
    price: 2.00,
    categoryId: 2,
    stateId: 23,
    tamilName: 'உளுத்தம் பருப்பு',
    hindiName: 'उड़द दाल',
    teluguName: 'మినప పప్పు',
    kannadaName: 'ಉದ್ದಿನ ಬೇಳೆ',
    malayalamName: 'ഉഴുന്ന് പരിപ്പ്',
    bengaliName: 'বিউলি ডাল',
    marathiName: 'उडीद डाळ',
    gujaratiName: 'અડદ દાળ',
    punjabiName: 'ਉੜਦ ਦਾਲ',
    odiaName: 'ବିରି ଡାଲି',
    assameseName: 'মাটি মাহ',
    urduName: 'ماش دال'
  },
  {
    id: 5,
    productCode: 'PLS-003',
    name: 'Moong Dal',
    subCategory: 'Lentils',
    bilingualName: 'பாசிப் பருப்பு',
    price: 2.00,
    categoryId: 2,
    stateId: null,
    tamilName: 'பாசிப் பருப்பு',
    hindiName: 'मूंग दाल',
    teluguName: 'పెసర పప్పు',
    kannadaName: 'ಹೆಸರು ಬೇಳೆ',
    malayalamName: 'ചെറുപയർ പരിപ്പ്',
    bengaliName: 'মুগ ডাল',
    marathiName: 'मूग डाळ',
    gujaratiName: 'મગ દાળ',
    punjabiName: 'ਮੂੰਗ ਦਾਲ',
    odiaName: 'ମୁଗ ଡାଲି',
    assameseName: 'মুগ দাইল',
    urduName: 'مونگ دال'
  },
  {
    id: 6,
    productCode: 'PLS-004',
    name: 'Chana Dal',
    subCategory: 'Lentils',
    bilingualName: 'கடலைப் பருப்பு',
    price: 2.00,
    categoryId: 2,
    stateId: null,
    tamilName: 'கடலைப் பருப்பு',
    hindiName: 'चना दाल',
    teluguName: 'శనగ పప్పు',
    kannadaName: 'ಕಡಲೆ ಬೇಳೆ',
    malayalamName: 'കടല പരിപ്പ്',
    bengaliName: 'ছোলার ডাল',
    marathiName: 'हरभरा डाळ',
    gujaratiName: 'ચણા દાળ',
    punjabiName: 'ਚਨਾ ਦਾਲ',
    odiaName: 'ବୁଟ ଡାଲି',
    assameseName: 'বুটৰ দাইল',
    urduName: 'چنا دال'
  },
  {
    id: 7,
    productCode: 'SPC-001',
    name: 'Turmeric Powder',
    subCategory: 'Ground Spices',
    bilingualName: 'மஞ்சள் தூள்',
    price: 2.00,
    categoryId: 4,
    stateId: null,
    tamilName: 'மஞ்சள் தூள்',
    hindiName: 'हल्दी पाउडर',
    teluguName: 'పసుపు పొడి',
    kannadaName: 'ಅರಿಶಿನ ಪುಡಿ',
    malayalamName: 'മഞ്ഞൾ പൊടി',
    bengaliName: 'হলুদ গুঁড়ো',
    marathiName: 'हळद पूड',
    gujaratiName: 'હળદર પાવડર',
    punjabiName: 'ਹਲਦੀ ਪਾਊਡਰ',
    odiaName: 'ହଳଦୀ ଗୁଣ୍ଡ',
    assameseName: 'হালধি গুড়ি',
    urduName: 'ہلدی پاؤڈر'
  },
  {
    id: 8,
    productCode: 'SPC-002',
    name: 'Red Chilli Powder',
    subCategory: 'Ground Spices',
    bilingualName: 'மிளகாய் தூள்',
    price: 2.00,
    categoryId: 4,
    stateId: null,
    tamilName: 'மிளகாய் தூள்',
    hindiName: 'लाल मिर्च पाउडर',
    teluguName: 'కారం పొడి',
    kannadaName: 'ಖಾರದ ಪುಡಿ',
    malayalamName: 'മുളക് പൊടി',
    bengaliName: 'লঙ্কা গুঁড়ো',
    marathiName: 'लाल तिखट',
    gujaratiName: 'લાલ મરચું પાવડર',
    punjabiName: 'ਲਾਲ ਮਿਰਚ ਪਾਊਡਰ',
    odiaName: 'ଲଙ୍କା ଗୁଣ୍ଡ',
    assameseName: 'জলকীয়া গুড়ি',
    urduName: 'لال مرچ پاؤڈر'
  },
  {
    id: 9,
    productCode: 'SPC-003',
    name: 'Coriander Powder',
    subCategory: 'Ground Spices',
    bilingualName: 'மல்லித் தூள்',
    price: 2.00,
    categoryId: 4,
    stateId: null,
    tamilName: 'மல்லித் தூள்',
    hindiName: 'धनिया पाउडर',
    teluguName: 'ధనియాల పొడి',
    kannadaName: 'ಧನಿಯಾ ಪುಡಿ',
    malayalamName: 'മല്ലിപ്പൊടി',
    bengaliName: 'ধনে গুঁড়ো',
    marathiName: 'धने पूड',
    gujaratiName: 'ધાણા પાવડર',
    punjabiName: 'ਧਨੀਆ ਪਾਊਡਰ',
    odiaName: 'ଧନିଆ ଗୁଣ୍ଡ',
    assameseName: 'ধনিয়া গুড়ি',
    urduName: 'دھنیا پاؤڈر'
  },
  {
    id: 10,
    productCode: 'SPC-004',
    name: 'Garam Masala',
    subCategory: 'Spice Blends',
    bilingualName: 'கரம் மசாலா',
    price: 2.00,
    categoryId: 4,
    stateId: null,
    tamilName: 'கரம் மசாலா',
    hindiName: 'गरम मसाला',
    teluguName: 'గరం మసాలా',
    kannadaName: 'ಗರಂ ಮಸಾಲಾ',
    malayalamName: 'ഗരം മസാല',
    bengaliName: 'গরম মশলা',
    marathiName: 'गरम मसाला',
    gujaratiName: 'ગરમ મસાલો',
    punjabiName: 'ਗਰਮ ਮਸਾਲਾ',
    odiaName: 'ଗରମ ମସଲା',
    assameseName: 'গৰম মছলা',
    urduName: 'گرم مصالحہ'
  },
  {
    id: 11,
    productCode: 'WSP-001',
    name: 'Mustard Seeds',
    subCategory: 'Whole Spices',
    bilingualName: 'கடுகு',
    price: 2.00,
    categoryId: 3,
    stateId: null,
    tamilName: 'கடுகு',
    hindiName: 'राई / सरसों',
    teluguName: 'ఆవాలు',
    kannadaName: 'ಸಾಸಿವೆ',
    malayalamName: 'കടുക്',
    bengaliName: 'সর্ষে',
    marathiName: 'मोहरी',
    gujaratiName: 'રાઈ',
    punjabiName: 'ਰਾਈ',
    odiaName: 'ସୋରିଷ',
    assameseName: 'সৰিয়হ',
    urduName: 'رائی'
  },
  {
    id: 12,
    productCode: 'WSP-002',
    name: 'Cumin Seeds',
    subCategory: 'Whole Spices',
    bilingualName: 'சீரகம்',
    price: 2.00,
    categoryId: 3,
    stateId: null,
    tamilName: 'சீரகம்',
    hindiName: 'जीरा',
    teluguName: 'జీలకర్ర',
    kannadaName: 'ಜೀರಿಗೆ',
    malayalamName: 'ജീരകം',
    bengaliName: 'জিরে',
    marathiName: 'जिरे',
    gujaratiName: 'જીરું',
    punjabiName: 'ਜੀਰਾ',
    odiaName: 'ଜିରା',
    assameseName: 'জীৰা',
    urduName: 'زیرہ'
  },
  {
    id: 13,
    productCode: 'WSP-003',
    name: 'Fenugreek Seeds',
    subCategory: 'Whole Spices',
    bilingualName: 'வெந்தயம்',
    price: 2.00,
    categoryId: 3,
    stateId: null,
    tamilName: 'வெந்தயம்',
    hindiName: 'मेथी दाना',
    teluguName: 'మెంతులు',
    kannadaName: 'ಮೆಂತ್ಯ',
    malayalamName: 'ഉലുവ',
    bengaliName: 'মেথি',
    marathiName: 'मेथी दाणे',
    gujaratiName: 'મેથી દાણા',
    punjabiName: 'ਮੇਥੀ ਦਾਣਾ',
    odiaName: 'ମେଥି',
    assameseName: 'মেথি',
    urduName: 'میتھی دانہ'
  },
  {
    id: 14,
    productCode: 'WSP-004',
    name: 'Black Pepper',
    subCategory: 'Whole Spices',
    bilingualName: 'மிளகு',
    price: 2.00,
    categoryId: 3,
    stateId: 12,
    tamilName: 'மிளகு',
    hindiName: 'काली मिर्च',
    teluguName: 'మిరియాలు',
    kannadaName: 'ಕಾಳುಮೆಣಸು',
    malayalamName: 'കുരുമുളക്',
    bengaliName: 'গোলমরিচ',
    marathiName: 'काळी मिरी',
    gujaratiName: 'કાળા મરી',
    punjabiName: 'ਕਾਲੀ ਮਿਰਚ',
    odiaName: 'ଗୋଲମରିଚ',
    assameseName: 'জালুক',
    urduName: 'کالی مرچ'
  },
  {
    id: 15,
    productCode: 'WSP-005',
    name: 'Cardamom (Elaichi)',
    subCategory: 'Whole Spices',
    bilingualName: 'ஏலக்காய்',
    price: 2.00,
    categoryId: 3,
    stateId: 12,
    tamilName: 'ஏலக்காய்',
    hindiName: 'इलायची',
    teluguName: 'యాలకులు',
    kannadaName: 'ಏಲಕ್ಕಿ',
    malayalamName: 'ഏലയ്ക്ക',
    bengaliName: 'এলাচ',
    marathiName: 'वेलची',
    gujaratiName: 'એલચી',
    punjabiName: 'ਇਲਾਇਚੀ',
    odiaName: 'ଗୁଜୁରାତି',
    assameseName: 'ইলাচী',
    urduName: 'الائچی'
  },
  {
    id: 16,
    productCode: 'WSP-006',
    name: 'Cloves (Laung)',
    subCategory: 'Whole Spices',
    bilingualName: 'கிராம்பு',
    price: 2.00,
    categoryId: 3,
    stateId: 12,
    tamilName: 'கிராம்பு',
    hindiName: 'लौंग',
    teluguName: 'లవంగాలు',
    kannadaName: 'ಲವಂಗ',
    malayalamName: 'ഗ്രാമ്പൂ',
    bengaliName: 'লবঙ্গ',
    marathiName: 'लवंग',
    gujaratiName: 'લવિંગ',
    punjabiName: 'ਲੌਂਗ',
    odiaName: 'ଲବଙ୍ଗ',
    assameseName: 'লং',
    urduName: 'لونگ'
  },
  {
    id: 17,
    productCode: 'FLR-001',
    name: 'Wheat Flour (Atta)',
    subCategory: 'Flours',
    bilingualName: 'கோதுமை மாவு',
    price: 2.00,
    categoryId: 5,
    stateId: null,
    tamilName: 'கோதுமை மாவு',
    hindiName: 'गेहूं का आटा',
    teluguName: 'గోధుమ పిండి',
    kannadaName: 'ಗೋಧಿ ಹಿಟ್ಟು',
    malayalamName: 'ഗോതമ്പ് പൊടി',
    bengaliName: 'আটা',
    marathiName: 'गव्हाचे पीठ',
    gujaratiName: 'ઘઉંનો લોટ',
    punjabiName: 'ਕਣਕ ਦਾ ਆਟਾ',
    odiaName: 'ଅଟା',
    assameseName: 'আটা',
    urduName: 'گندم کا آٹا'
  },
  {
    id: 18,
    productCode: 'FLR-002',
    name: 'Ragi Flour',
    subCategory: 'Millet Flours',
    bilingualName: 'கேழ்வரகு மாவு',
    price: 2.00,
    categoryId: 5,
    stateId: 11,
    tamilName: 'கேழ்வரகு மாவு',
    hindiName: 'रागी आटा',
    teluguName: 'రాగి పిండి',
    kannadaName: 'ರಾಗಿ ಹಿಟ್ಟು',
    malayalamName: 'റാഗി പൊടി',
    bengaliName: 'মারুয়া আটা',
    marathiName: 'नाचणी पीठ',
    gujaratiName: 'રાગી લોટ',
    punjabiName: 'ਰਾਗੀ ਆਟਾ',
    odiaName: 'ମାଣ୍ଡିଆ ଗୁଣ୍ଡ',
    assameseName: 'মাৰুৱা আটা',
    urduName: 'راگی آٹا'
  },
  {
    id: 19,
    productCode: 'FLR-003',
    name: 'Rice Flour',
    subCategory: 'Flours',
    bilingualName: 'அரிசி மாவு',
    price: 2.00,
    categoryId: 5,
    stateId: null,
    tamilName: 'அரிசி மாவு',
    hindiName: 'चावल का आटा',
    teluguName: 'వరి పిండి',
    kannadaName: 'ಅಕ್ಕಿ ಹಿಟ್ಟು',
    malayalamName: 'അരിപ്പൊടി',
    bengaliName: 'চালের গুঁড়ো',
    marathiName: 'तांदळाचे पीठ',
    gujaratiName: 'ચોખાનો લોટ',
    punjabiName: 'ਚੌਲਾਂ ਦਾ ਆਟਾ',
    odiaName: 'ଚାଉଳ ଚୁନା',
    assameseName: 'চাউলৰ গুড়ি',
    urduName: 'چاول کا آٹا'
  },
  {
    id: 20,
    productCode: 'SWT-001',
    name: 'Crystal Salt',
    subCategory: 'Salts',
    bilingualName: 'கல் உப்பு',
    price: 2.00,
    categoryId: 7,
    stateId: 23,
    tamilName: 'கல் உப்பு',
    hindiName: 'सेंधा / साबुत नमक',
    teluguName: 'కళ్ళు ఉప్పు',
    kannadaName: 'ಕಲ್ಲುಪ್ಪು',
    malayalamName: 'കല്ലുപ്പ്',
    bengaliName: 'দানা নুন',
    marathiName: 'खडे मीठ',
    gujaratiName: 'ગાંગડા મીઠું',
    punjabiName: 'ਸਾਬਤ ਲੂਣ',
    odiaName: 'ଦାନା ଲୁଣ',
    assameseName: 'গোটা নিমখ',
    urduName: 'کھڑا نمک'
  },
  {
    id: 21,
    productCode: 'SWT-002',
    name: 'Organic Jaggery Powder',
    subCategory: 'Sweeteners',
    bilingualName: 'நாட்டுச் சர்க்கரை',
    price: 2.00,
    categoryId: 7,
    stateId: null,
    tamilName: 'நாட்டுச் சர்க்கரை',
    hindiName: 'गुड़ पाउडर',
    teluguName: 'బెల్లం పొడి',
    kannadaName: 'ಬೆಲ್ಲದ ಪುಡಿ',
    malayalamName: 'ശർക്കര പൊടി',
    bengaliName: 'গুঁড়ো গুড়',
    marathiName: 'गूळ पावडर',
    gujaratiName: 'ગોળ પાવડર',
    punjabiName: 'ਗੁੜ ਪਾਊਡਰ',
    odiaName: 'ଗୁଡ଼ ଗୁଣ୍ଡ',
    assameseName: 'গুড়ৰ গুড়ি',
    urduName: 'گڑ پاؤڈر'
  },
  {
    id: 22,
    productCode: 'OIL-001',
    name: 'Sesame (Gingelly) Oil',
    subCategory: 'Edible Oils',
    bilingualName: 'நல்லெண்ணெய்',
    price: 2.00,
    categoryId: 6,
    stateId: 23,
    tamilName: 'நல்லெண்ணெய்',
    hindiName: 'तिल का तेल',
    teluguName: 'నువ్వుల నూనె',
    kannadaName: 'ಎಳ್ಳೆಣ್ಣೆ',
    malayalamName: 'നല്ലെണ്ണ',
    bengaliName: 'তিলের তেল',
    marathiName: 'तिळाचे तेल',
    gujaratiName: 'તલનું તેલ',
    punjabiName: 'ਤਿਲਾਂ ਦਾ ਤੇਲ',
    odiaName: 'ରାଶି ତେଲ',
    assameseName: 'তিলৰ তেল',
    urduName: 'تل کا تیل'
  },
  {
    id: 23,
    productCode: 'OIL-002',
    name: 'Coconut Oil',
    subCategory: 'Edible Oils',
    bilingualName: 'தேங்காய் எண்ணெய்',
    price: 2.00,
    categoryId: 6,
    stateId: 12,
    tamilName: 'தேங்காய் எண்ணெய்',
    hindiName: 'नारियल तेल',
    teluguName: 'కొబ్బరి నూనె',
    kannadaName: 'ತೆಂಗಿನೆಣ್ಣೆ',
    malayalamName: 'വെളിച്ചെണ്ണ',
    bengaliName: 'নারকেল তেল',
    marathiName: 'खोबरेल तेल',
    gujaratiName: 'નાળિયેર તેલ',
    punjabiName: 'ਨਾਰੀਅਲ ਤੇਲ',
    odiaName: 'ନଡ଼ିଆ ତେଲ',
    assameseName: 'নাৰিকলৰ তেল',
    urduName: 'ناریل کا تیل'
  },
  {
    id: 24,
    productCode: 'NUT-001',
    name: 'Cashew Nuts',
    subCategory: 'Dry Fruits & Nuts',
    bilingualName: 'முந்திரி பருப்பு',
    price: 2.00,
    categoryId: 8,
    stateId: 12,
    tamilName: 'முந்திரி பருப்பு',
    hindiName: 'काजू',
    teluguName: 'జీడిపప్పు',
    kannadaName: 'ಗೋಡಂಬಿ',
    malayalamName: 'കശുവണ്ടി',
    bengaliName: 'কাজুবাদাম',
    marathiName: 'काजू',
    gujaratiName: 'કાજુ',
    punjabiName: 'ਕਾਜੂ',
    odiaName: 'କାଜୁ',
    assameseName: 'কাজু বাদাম',
    urduName: 'کاجو'
  },
  {
    id: 25,
    productCode: 'NUT-002',
    name: 'Almonds (Badam)',
    subCategory: 'Dry Fruits & Nuts',
    bilingualName: 'பாதாம் பருப்பு',
    price: 2.00,
    categoryId: 8,
    stateId: null,
    tamilName: 'பாதாம் பருப்பு',
    hindiName: 'बादाम',
    teluguName: 'బాదం పప్పు',
    kannadaName: 'ಬಾದಾಮಿ',
    malayalamName: 'ബദാം',
    bengaliName: 'বাদাম',
    marathiName: 'बदाम',
    gujaratiName: 'બદામ',
    punjabiName: 'ਬਦਾਮ',
    odiaName: 'ବାଦାମ',
    assameseName: 'বাদাম',
    urduName: 'بادام'
  },
  {
    id: 26,
    productCode: 'GRN-003',
    name: 'Wheat Rava',
    subCategory: 'Rava / Grains',
    bilingualName: 'கோதுமை ரவை',
    price: 2.00,
    categoryId: 1,
    stateId: null,
    tamilName: 'கோதுமை ரவை',
    hindiName: 'गेहूं दलिया / रवा',
    teluguName: 'గోధుమ రవ్వ',
    kannadaName: 'ಗೋಧಿ ರವೆ',
    malayalamName: 'ഗോതമ്പ് റവ',
    bengaliName: 'গমের সুজি',
    marathiName: 'गव्हाचा रवा',
    gujaratiName: 'ઘઉંનો રવો',
    punjabiName: 'ਕਣਕ ਦਾ ਦਲੀਆ',
    odiaName: 'ଗହମ ସୁଜି',
    assameseName: 'গমৰ ছুজি',
    urduName: 'گندم کا دلیا'
  },
  {
    id: 27,
    productCode: 'FLR-004',
    name: 'Semolina',
    subCategory: 'Flours & Rava',
    bilingualName: 'ரவை',
    price: 2.00,
    categoryId: 5,
    stateId: null,
    tamilName: 'ரவை',
    hindiName: 'सूजी / रवा',
    teluguName: 'రవ్వ',
    kannadaName: 'ರವೆ',
    malayalamName: 'റവ',
    bengaliName: 'সুজি',
    marathiName: 'रवा',
    gujaratiName: 'સોજી',
    punjabiName: 'ਸੂਜੀ',
    odiaName: 'ସୁଜି',
    assameseName: 'ছুজি',
    urduName: 'سوجی'
  }
];

export const productService = {
  getStates: async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/states`, { timeout: 1500 });
      if (res.data && res.data.length > 0) return res;
    } catch {
      // Fallback
    }
    return { data: DEFAULT_STATES };
  },

  getCategories: async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/categories`, { timeout: 1500 });
      if (res.data && res.data.length > 0) return res;
    } catch {
      // Fallback
    }
    return { data: DEFAULT_CATEGORIES };
  },

  getProducts: async (stateId, categoryId = null, searchQuery = '', lang = 'tamil') => {
    try {
      const params = new URLSearchParams();
      if (stateId) params.append('state', stateId);
      if (categoryId) params.append('category', categoryId);
      if (searchQuery) params.append('search', searchQuery);
      if (lang) params.append('lang', lang);

      const res = await axios.get(`${API_BASE}/api/products`, { params, timeout: 1500 });
      if (res.data && res.data.length > 0) {
        // Enforce fixed price of Rs. 2.00 per label
        const sanitized = res.data.map(p => ({
          ...p,
          price: 2.00,
          imageUrl: p.imageUrl || getIngredientImage(p)
        }));
        return { data: sanitized };
      }
    } catch {
      // Fallback to local high-density dataset
    }

    // Local filtering engine
    let filtered = [...DEFAULT_PRODUCTS];

    if (categoryId) {
      filtered = filtered.filter(p => p.categoryId === Number(categoryId));
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.productCode.toLowerCase().includes(q) ||
        (p.bilingualName && p.bilingualName.toLowerCase().includes(q)) ||
        (p.tamilName && p.tamilName.toLowerCase().includes(q)) ||
        (p.hindiName && p.hindiName.toLowerCase().includes(q))
      );
    }

    // Map vernacular script translation according to chosen language and resolve images
    const l = lang ? lang.trim().toLowerCase() : '';
    filtered = filtered.map(p => {
      let translated = p.bilingualName;
      if (l === 'tamil') translated = p.tamilName || p.bilingualName;
      else if (l === 'hindi') translated = p.hindiName || p.bilingualName;
      else if (l === 'telugu') translated = p.teluguName || p.bilingualName;
      else if (l === 'kannada') translated = p.kannadaName || p.bilingualName;
      else if (l === 'malayalam') translated = p.malayalamName || p.bilingualName;
      else if (l === 'bengali') translated = p.bengaliName || p.bilingualName;
      else if (l === 'marathi') translated = p.marathiName || p.bilingualName;
      else if (l === 'gujarati') translated = p.gujaratiName || p.bilingualName;
      else if (l === 'punjabi') translated = p.punjabiName || p.bilingualName;
      else if (l === 'odia') translated = p.odiaName || p.bilingualName;
      else if (l === 'assamese') translated = p.assameseName || p.bilingualName;
      else if (l === 'urdu') translated = p.urduName || p.bilingualName;

      return {
        ...p,
        bilingualName: translated,
        price: 2.00, // Fixed Rs. 2 per label
        imageUrl: p.imageUrl || getIngredientImage(p)
      };
    });

    return { data: filtered };
  },

  getAllProductsSync: () => DEFAULT_PRODUCTS
};

export default productService;
