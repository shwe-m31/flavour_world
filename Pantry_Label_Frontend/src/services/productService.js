import axios from 'axios';
import { getIngredientImage } from '../utils/ingredientImageMap.js';
import catalogData from './catalogData.json';

const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:8080';

import { INDIAN_STATES } from '../data/indianStates.js';

// Fallback Indian States (all 28 states and 8 union territories)
const DEFAULT_STATES = INDIAN_STATES;

// 8 Standard Filter Categories (Preserve exact labels, ordering, and layout)
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

// Full catalog with ₹2.00 per sticker and clean translations across 12 regional languages
const DEFAULT_PRODUCTS = catalogData;

const sanitizeText = (text, fallback) => {
  if (!text) return fallback;
  const cleaned = String(text)
    .replace(/\(cid:\d+\)/g, '')
    .replace(/[?]{2,}/g, '')
    .trim()
    .replace(/^[()?,.-]+|[()?,.-]+$/g, '')
    .trim();
  if (!cleaned || cleaned.length < 2 || /^[?\s\-()]+$/.test(cleaned)) {
    return fallback;
  }
  return cleaned;
};

export const productService = {
  getStates: async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/states`, { timeout: 10000 });
      if (res.data && res.data.length > 0) return res;
    } catch {
      // Fallback
    }
    return { data: DEFAULT_STATES };
  },

  getCategories: async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/categories`, { timeout: 10000 });
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

      const res = await axios.get(`${API_BASE}/api/products`, { params, timeout: 10000 });
      if (res.data && res.data.length > 0) {
        // Enforce fixed price of Rs. 2.00 per label and sanitize names
        const sanitized = res.data.map(p => {
          const cleanName = sanitizeText(p.name, 'Ingredient');
          const cleanBilingual = sanitizeText(p.bilingualName, cleanName);
          return {
            ...p,
            name: cleanName,
            bilingualName: cleanBilingual,
            price: 2.00,
            imageUrl: p.imageUrl || getIngredientImage(p)
          };
        });
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
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
        (p.productCode && p.productCode.toLowerCase().includes(q)) ||
        (p.bilingualName && p.bilingualName.toLowerCase().includes(q)) ||
        (p.tamilName && p.tamilName.toLowerCase().includes(q)) ||
        (p.hindiName && p.hindiName.toLowerCase().includes(q))
      );
    }

    // Map vernacular script translation according to chosen language and resolve images
    const l = lang ? lang.trim().toLowerCase() : 'tamil';
    filtered = filtered.map(p => {
      let translated = '';
      if (l === 'tamil') {
        translated = p.tamilName || p.tamil || p.bilingualName;
      } else {
        translated = p[`${l}Name`] || p[l];
      }

      const cleanName = sanitizeText(p.name, 'Ingredient');
      const cleanBilingual = sanitizeText(translated, cleanName);

      return {
        ...p,
        name: cleanName,
        bilingualName: cleanBilingual,
        price: 2.00, // Fixed Rs. 2 per label
        imageUrl: p.imageUrl || getIngredientImage(p)
      };
    });

    return { data: filtered };
  },

  getAllProductsSync: () => DEFAULT_PRODUCTS
};

export default productService;
