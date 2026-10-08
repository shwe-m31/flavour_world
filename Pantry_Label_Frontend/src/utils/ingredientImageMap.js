/**
 * Flavour World - Ingredient Image Mapping Utility
 * 
 * Maps English ingredient names to generated ceramic-bowl product photography.
 * Uses exact-match normalization to prevent accidental collisions (e.g. Rice vs Rice Crispies).
 */

const BASE_URL = import.meta.env?.BASE_URL || '/';

/**
 * Registry of available generated ingredient images stored in public/ingredients/
 * All images follow the reference style: single ingredient in a white ceramic bowl,
 * plain white background, soft shadow, centered, 1:1 aspect ratio.
 */
export const AVAILABLE_INGREDIENT_IMAGES = {
  // Spices & Powders
  'turmeric-powder': 'turmeric_powder.jpg',
  'turmeric_powder': 'turmeric_powder.jpg',
  'red-chilli-powder': 'red-chilli-powder.png',

  // Grains, Rava & Cereals
  'wheat-rava': 'wheat-rava.jpg',
  'fine-rava': 'fine-rava.jpg',
  'bombay-rava': 'bombay-rava.jpg',
  'semolina': 'semolina.jpg',
  'rice-crispies': 'rice-crispies.jpg',
  'muesli': 'muesli.jpg',
  'rolled-oats': 'rolled-oats.jpg',
  'instant-oats': 'instant-oats.jpg',
  'vermicelli': 'vermicelli.png',
  'roasted-vermicelli': 'roasted-vermicelli.jpg',
  'macaroni': 'macaroni.jpg',
  'pasta': 'pasta.jpg',

  // Health Mixes
  'health-mix-powder': 'health-mix-powder.jpg',
  'multigrain-health-mix': 'multigrain-health-mix.jpg',

  // Baking & Dessert Essentials
  'cocoa-powder': 'cocoa-powder.png',
  'drinking-chocolate': 'drinking-chocolate.jpg',
  'chocolate-chips': 'chocolate-chips.jpg',
  'baking-soda': 'baking-soda.jpg',
  'baking-powder': 'baking-powder.png',
  'dry-yeast': 'dry-yeast.jpg',
  'fresh-yeast': 'fresh-yeast.jpg',
  'vanilla-essence': 'vanilla-essence.jpg',
  'vanilla-extract': 'vanilla-extract.jpg',
  'corn-starch': 'corn-starch.jpg',
  'custard-powder': 'custard-powder.jpg',
  'agar-agar': 'agar-agar.jpg',
  'agar-agar-china-grass': 'agar-agar.jpg',
  'gelatin': 'gelatin.jpg',
  'food-colour': 'food-colour.jpg',

  // 80 New Catalog Ingredients (Grains, Flours, Nuts, Dried Vathal, Masalas & Powders)
  'almond': 'almond.jpg',
  'apple-cider-vinegar': 'apple-cider-vinegar.jpg',
  'arrowroot-powder': 'arrowroot-powder.jpg',
  'banana-flower-powder': 'banana-flower-powder.jpg',
  'banana-stem-powder': 'banana-stem-powder.jpg',
  'besan': 'besan.jpg',
  'black-raisins': 'black-raisins.jpg',
  'brazil-nut': 'brazil-nut.jpg',
  'buffalo-ghee': 'buffalo-ghee.jpg',
  'butter': 'butter.jpg',
  'cashew-nut': 'cashew-nut.jpg',
  'chettinad-masala': 'chettinad-masala.jpg',
  'cholam-flour': 'cholam-flour.jpg',
  'chole-masala': 'chole-masala.jpg',
  'coconut-cream': 'coconut-cream.jpg',
  'coconut-flour': 'coconut-flour.jpg',
  'coriander-leaf-powder': 'coriander-leaf-powder.jpg',
  'corn-flour': 'corn-flour.jpg',
  'corn-meal': 'corn-meal.jpg',
  'cow-ghee': 'cow-ghee.jpg',
  'curd-chilli': 'curd-chilli.jpg',
  'curry-leaf-powder': 'curry-leaf-powder.jpg',
  'curry-masala': 'curry-masala.jpg',
  'dried-apricot': 'dried-apricot.jpg',
  'dried-bitter-gourd': 'dried-bitter-gourd.jpg',
  'dried-brinjal': 'dried-brinjal.jpg',
  'dried-cluster-beans': 'dried-cluster-beans.jpg',
  'dried-coriander-leaves': 'dried-coriander-leaves.jpg',
  'dried-cranberry': 'dried-cranberry.jpg',
  'dried-fig': 'dried-fig.jpg',
  'dried-mango': 'dried-mango.jpg',
  'dried-mint-leaves': 'dried-mint-leaves.jpg',
  'dried-turkey-berry': 'dried-turkey-berry.jpg',
  'dry-coconut': 'dry-coconut.jpg',
  'dry-coconut-powder': 'dry-coconut-powder.jpg',
  'dry-rose-petals': 'dry-rose-petals.jpg',
  'egg-masala': 'egg-masala.jpg',
  'golden-raisins': 'golden-raisins.jpg',
  'gram-flour': 'gram-flour.jpg',
  'hazelnut': 'hazelnut.jpg',
  'idiyappam-flour': 'idiyappam-flour.jpg',
  'kambu-flour': 'kambu-flour.jpg',
  'kurma-masala': 'kurma-masala.jpg',
  'kuthiraivali-flour': 'kuthiraivali-flour.jpg',
  'macadamia-nut': 'macadamia-nut.jpg',
  'maida': 'maida.jpg',
  'meat-masala': 'meat-masala.jpg',
  'mint-leaf-powder': 'mint-leaf-powder.jpg',
  'moringa-leaf-powder': 'moringa-leaf-powder.jpg',
  'multigrain-flour': 'multigrain-flour.jpg',
  'neem-flower-powder': 'neem-flower-powder.jpg',
  'oats-flour': 'oats-flour.jpg',
  'pine-nut': 'pine-nut.jpg',
  'pistachio': 'pistachio.jpg',
  'premium-dates': 'premium-dates.jpg',
  'psyllium-husk': 'psyllium-husk.jpg',
  'puttu-flour': 'puttu-flour.jpg',
  'ragi-flour': 'ragi-flour.jpg',
  'rajma-masala': 'rajma-masala.jpg',
  'rasam-masala': 'rasam-masala.jpg',
  'rava': 'rava.jpg',
  'rice-bran': 'rice-bran.jpg',
  'rice-flour': 'rice-flour.jpg',
  'roasted-gram-flour': 'roasted-gram-flour.jpg',
  'roasted-rice-flour': 'roasted-rice-flour.jpg',
  'samai-flour': 'samai-flour.jpg',
  'sambar-masala': 'sambar-masala.jpg',
  'sattu-flour': 'sattu-flour.jpg',
  'seedless-dates': 'seedless-dates.jpg',
  'shahi-paneer-masala': 'shahi-paneer-masala.jpg',
  'sorghum-flour': 'sorghum-flour.jpg',
  'tandoori-masala': 'tandoori-masala.jpg',
  'tapioca-flour': 'tapioca-flour.jpg',
  'thinai-flour': 'thinai-flour.jpg',
  'varagu-flour': 'varagu-flour.jpg',
  'walnut': 'walnut.jpg',
  'wheat-bran': 'wheat-bran.jpg',
  'wheat-flour': 'wheat-flour.jpg',
  'white-vinegar': 'white-vinegar.jpg',
};

/**
 * Normalizes an English ingredient name into a safe, consistent hyphenated slug.
 * Strips out parenthetical qualifiers: e.g. "Agar Agar (China Grass)" -> "agar-agar"
 */
export const normalizeIngredientSlug = (name) => {
  if (!name || typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Normalizes including parenthetical text: e.g. "Agar Agar (China Grass)" -> "agar-agar-china-grass"
 */
export const normalizeIngredientSlugWithParens = (name) => {
  if (!name || typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Resolves the image URL for an ingredient.
 * 
 * Rules:
 * 1. If ingredient.imageUrl is already populated (from DB/API), use it.
 * 2. Look up the normalized English name slug against registered generated images.
 * 3. Never match partial words (e.g. Rice will never match Rice Crispies or Turmeric).
 * 4. Return null if no image is available, allowing graceful placeholder fallback.
 * 
 * @param {Object} ingredient - Ingredient data object with name, id, imageUrl, etc.
 * @returns {string|null} Resolved image URL or null
 */
export const getIngredientImage = (ingredient) => {
  if (!ingredient) return null;

  // 1. Existing image field from DB / API
  if (ingredient.imageUrl && typeof ingredient.imageUrl === 'string' && ingredient.imageUrl.trim() !== '') {
    return ingredient.imageUrl.trim();
  }

  const englishName = ingredient.name;
  if (!englishName || typeof englishName !== 'string') return null;

  const base = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;

  // 2. Exact slug lookup (without parentheses)
  const slugWithoutParens = normalizeIngredientSlug(englishName);
  if (slugWithoutParens && AVAILABLE_INGREDIENT_IMAGES[slugWithoutParens]) {
    return `${base}ingredients/${AVAILABLE_INGREDIENT_IMAGES[slugWithoutParens]}`;
  }

  // 3. Exact slug lookup (with parentheses)
  const slugWithParens = normalizeIngredientSlugWithParens(englishName);
  if (slugWithParens && AVAILABLE_INGREDIENT_IMAGES[slugWithParens]) {
    return `${base}ingredients/${AVAILABLE_INGREDIENT_IMAGES[slugWithParens]}`;
  }

  return null;
};

export default getIngredientImage;
