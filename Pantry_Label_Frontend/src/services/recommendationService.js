import { getIndianStateById } from '../data/indianStates';

const NON_VEG_KEYWORDS = [
  'chicken', 'mutton', 'fish', 'meat', 'egg', 'prawn', 'crab', 'pork', 'beef'
];

const REGIONAL_KEYWORDS = {
  South: [
    'sambar', 'rasam', 'curry leaves', 'mustard', 'urad', 'toor dal', 'chana dal',
    'idli', 'ponni', 'coconut oil', 'gingelly', 'sesame', 'tamarind', 'fenugreek',
    'asafoetida', 'cardamom', 'pepper', 'millet', 'ragi', 'rava', 'ghee'
  ],
  North: [
    'basmati', 'atta', 'rajma', 'chole', 'garam masala', 'kasuri methi', 'jeera',
    'cumin', 'amchur', 'ghee', 'mustard oil', 'coriander powder', 'cardamom',
    'cloves', 'bay leaf', 'cinnamon', 'ajwain', 'dal makhani', 'kabuli'
  ],
  West: [
    'poha', 'besan', 'groundnut', 'goda masala', 'pav bhaji', 'kokum', 'jaggery',
    'cumin', 'mustard', 'sesame', 'turmeric', 'chilli powder', 'ghee', 'sabudana'
  ],
  East: [
    'mustard oil', 'panch phoron', 'kalonji', 'cumin', 'posto', 'poppy',
    'gobindobhog', 'sattu', 'moong dal', 'masoor dal', 'turmeric', 'bay leaf', 'jaggery'
  ],
  Northeast: [
    'black sesame', 'ginger', 'garlic', 'mustard', 'turmeric', 'black pepper',
    'cardamom', 'bay leaf', 'rice', 'chilli'
  ],
  Central: [
    'poha', 'wheat', 'atta', 'coriander', 'garam masala', 'groundnut', 'turmeric',
    'chilli powder', 'toor dal', 'cumin', 'ghee'
  ]
};

// Universal Kitchen Essentials (Universal score bonus)
const UNIVERSAL_STAPLES = [
  'table salt', 'rock salt', 'sugar', 'turmeric powder', 'chilli powder',
  'coriander powder', 'cumin powder', 'mustard', 'toor dal', 'moong dal',
  'urad dal', 'chana dal', 'basmati rice', 'wheat rava', 'ghee', 'cardamom',
  'cloves', 'cinnamon', 'black pepper', 'jaggery'
];

/**
 * Recommends 30 tailored ingredients based on kitchen persona, region, and diet.
 *
 * @param {string} consumerCategory - 'Bachelor', 'Couple', 'Family', 'Joint Family', 'Restaurant'
 * @param {number|string} stateId - Indian State ID
 * @param {string} cookingPreference - 'Vegetarian', 'Non-Vegetarian', 'Both'
 * @param {Array} allProducts - Full product catalog
 * @param {number} targetCount - Defaults to 30
 * @returns {Array<number>} Array of product IDs
 */
export const getRecommendedProductIds = (
  consumerCategory = 'Family',
  stateId = 4,
  cookingPreference = 'Vegetarian',
  allProducts = [],
  targetCount = 30
) => {
  if (!allProducts || allProducts.length === 0) return [];

  const stateObj = getIndianStateById(stateId);
  const region = stateObj?.region || 'South';
  const regionalWords = REGIONAL_KEYWORDS[region] || REGIONAL_KEYWORDS.South;

  const isVegOnly = cookingPreference === 'Vegetarian';
  const isNonVeg = cookingPreference === 'Non-Vegetarian';
  const isBoth = cookingPreference === 'Both';

  // 1. Filter out prohibited products
  const eligibleProducts = allProducts.filter((product) => {
    const text = `${product.name} ${product.subCategory || ''}`.toLowerCase();

    // Check if item contains non-veg keywords
    const isNonVegItem = NON_VEG_KEYWORDS.some((kw) => text.includes(kw));

    if (isVegOnly && isNonVegItem) {
      return false;
    }

    return true;
  });

  // 2. Score each product based on relevance
  const scoredProducts = eligibleProducts.map((product) => {
    const text = `${product.name} ${product.subCategory || ''}`.toLowerCase();
    let score = 0;

    // Check universal staple match
    if (UNIVERSAL_STAPLES.some((s) => text.includes(s))) {
      score += 25;
    }

    // Check regional affinity
    regionalWords.forEach((word) => {
      if (text.includes(word)) {
        score += 15;
      }
    });

    // Diet preference boost
    const isNonVegItem = NON_VEG_KEYWORDS.some((kw) => text.includes(kw));
    if ((isNonVeg || isBoth) && isNonVegItem) {
      score += 35; // Strongly recommend non-veg masala packs if preference selected
    }

    // Persona-based modifiers
    switch (consumerCategory) {
      case 'Bachelor':
        // Favor quick essentials, basic powders, salt, sugar, ready mixes
        if (text.includes('salt') || text.includes('sugar') || text.includes('chilli') || text.includes('turmeric')) {
          score += 20;
        }
        if (text.includes('tea') || text.includes('coffee') || text.includes('noodle') || text.includes('instant')) {
          score += 15;
        }
        if (product.categoryId === 8 || text.includes('whole masala')) {
          score -= 5; // Less complex whole spices for bachelors
        }
        break;

      case 'Couple':
        // Balanced home cooking
        if (product.categoryId === 2 || product.categoryId === 4) {
          score += 12; // Dals and Spice powders
        }
        break;

      case 'Family':
        // Well-rounded household pantry across all categories
        if ([1, 2, 3, 4, 5, 6, 7].includes(product.categoryId)) {
          score += 10;
        }
        break;

      case 'Joint Family':
        // High variety, nuts, dry fruits, multiple dals and whole spices
        if (product.categoryId === 8 || product.categoryId === 3) {
          score += 18;
        }
        break;

      case 'Restaurant':
        // Commercial spices, aromatic whole masalas, biryani spices, gravies
        if (text.includes('biryani') || text.includes('garam masala') || text.includes('cardamom') || text.includes('cinnamon') || text.includes('clove') || text.includes('oil')) {
          score += 30;
        }
        if (product.categoryId === 3 || product.categoryId === 4) {
          score += 20;
        }
        break;

      default:
        break;
    }

    // Ensure category diversity by adding slight baseline to underrepresented staple categories
    if ([2, 4, 7].includes(product.categoryId)) {
      score += 5;
    }

    return { product, score };
  });

  // 3. Sort by score descending, then by category for diversity
  scoredProducts.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.product.id - b.product.id;
  });

  // 4. Ensure balanced representation from each main category (dals, spices, grains, flours, oils, salts)
  const selectedIds = new Set();
  const categoryBucketCounts = {};

  // First pass: pick highest scoring items while keeping reasonable category spread
  const maxPerCategory = Math.max(8, Math.ceil(targetCount / 4));
  for (const item of scoredProducts) {
    if (selectedIds.size >= targetCount) break;
    const catId = item.product.categoryId || 0;
    const currentCount = categoryBucketCounts[catId] || 0;

    // Limit any single category to prevent domination while allowing diversity
    if (currentCount < maxPerCategory || selectedIds.size > Math.floor(targetCount * 0.8)) {
      selectedIds.add(item.product.id);
      categoryBucketCounts[catId] = currentCount + 1;
    }
  }

  // Second pass: fill remaining slots up to targetCount
  if (selectedIds.size < targetCount) {
    for (const item of scoredProducts) {
      if (selectedIds.size >= targetCount) break;
      selectedIds.add(item.product.id);
    }
  }

  return Array.from(selectedIds).slice(0, targetCount);
};

export default {
  getRecommendedProductIds
};
