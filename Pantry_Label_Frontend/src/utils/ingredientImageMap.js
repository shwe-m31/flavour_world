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
  'turmeric-powder': 'turmeric-powder.jpg',
  'turmeric_powder': 'turmeric_powder.jpg',
  'red-chilli-powder': 'red-chilli-powder.png',
  'ajwain': 'ajwain-seed.jpeg',
  'ajwain-seed': 'ajwain-seed.jpeg',
  'ajwain-seeds': 'ajwain-seed.jpeg',
  'asafoetida': 'asafoetida.jpeg',
  'black-cumin': 'balck-cumin.jpeg',
  'black-cumin-seeds': 'balck-cumin.jpeg',
  'balck-cumin': 'balck-cumin.jpeg',
  'black-cardamom': 'black-cardamom.jpeg',
  'cassia-bark': 'cassia-bark.jpeg',
  'chettinad-masala': 'chettinad-masala.jpeg',
  'chole-masala': 'chole-masala.jpeg',
  'curry-masala': 'curry-masala.jpg',
  'dill-seeds': 'dill-seeds.jpeg',
  'dry-ginger': 'dry-ginger.jpeg',
  'egg-masala': 'egg-masala.jpeg',
  'kurma-masala': 'kurma-masala.jpg',
  'mace': 'mace-spice.jpeg',
  'mace-spice': 'mace-spice.jpeg',
  'meat-masala': 'meat-masala.jpg',
  'nutmeg': 'nutmeg.jpeg',
  'rajma-masala': 'rajma-masala.jpeg',
  'rasam-masala': 'rasam-masala.jpg',
  'sambar-masala': 'sambar-masala.jpg',
  'shahi-paneer-masala': 'shahi-paneer-masala.jpg',
  'sichuan-pepper': 'sichuan-pepper.jpeg',
  'tandoori-masala': 'tandoori-masala.jpg',
  'white-pepper': 'white-pepper.jpeg',
  'yellow-mustard': 'yellow-mustard.jpeg',
  'yellow-mustard-seeds': 'yellow-mustard.jpeg',

  // Grains, Rava & Cereals
  'wheat-rava': 'wheat-rava.jpg',
  'fine-rava': 'fine-rava.jpg',
  'bombay-rava': 'bombay-rava.jpg',
  'rava': 'rava.jpeg',
  'semolina': 'semolina.jpg',
  'rice-crispies': 'rice-crispies.jpg',
  'muesli': 'muesli.jpg',
  'rolled-oats': 'rolled-oats.jpg',
  'instant-oats': 'instant-oats.jpg',
  'vermicelli': 'vermicelli.png',
  'roasted-vermicelli': 'roasted-vermicelli.jpg',
  'macaroni': 'macaroni.jpg',
  'pasta': 'pasta.jpg',

  // Health Mixes & Herbal Powders
  'health-mix-powder': 'health-mix-powder.jpg',
  'multigrain-health-mix': 'multigrain-health-mix.jpg',
  'arrowroot-powder': 'arrowroot-powder.jpeg',
  'banana-flower-powder': 'banana-flower-powder.jpeg',
  'banana-stem-powder': 'banana-stem-powder.jpeg',
  'coriander-leaf-powder': 'coriander-leaf-powder.jpeg',
  'curry-leaf-powder': 'curry-leaf-powder.jpeg',
  'mint-leaf-powder': 'mint-leaf-powder.jpeg',
  'moringa-leaf-powder': 'moringa-leaf-powder.jpeg',
  'neem-flower-powder': 'neem-flower-powder.jpeg',

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

  // Flours & Atta
  'besan': 'besan.jpeg',
  'cholam-flour': 'cholam-flour.jpeg',
  'coconut-flour': 'coconut-flour.jpeg',
  'corn-flour': 'corn-flour.jpeg',
  'corn-meal': 'corn-meal.jpg',
  'gram-flour': 'gram-flour.jpeg',
  'idiyappam-flour': 'idiyappam-flour.jpeg',
  'kambu-flour': 'kambu-flour.jpeg',
  'kuthiraivali-flour': 'kuthiraivali-flour.jpeg',
  'maida': 'maida.jpeg',
  'multigrain-flour': 'multigrain-flour.jpeg',
  'oats-flour': 'oats-flour.jpeg',
  'psyllium-husk': 'psyllium-husk.jpeg',
  'puttu-flour': 'puttu-flour.jpeg',
  'ragi-flour': 'ragi-flour.jpeg',
  'rice-bran': 'rice-bran.jpg',
  'rice-flour': 'rice-flour.jpeg',
  'roasted-gram-flour': 'roasted-gram-flour.jpeg',
  'roasted-rice-flour': 'roasted-rice-flour.jpeg',
  'samai-flour': 'samai-flour.jpeg',
  'sattu-flour': 'sattu-flour.jpeg',
  'sorghum-flour': 'sorghum-flour.jpeg',
  'tapioca-flour': 'tapioca-flour.jpeg',
  'thinai-flour': 'thinai-flour.jpeg',
  'varagu-flour': 'varagu-flour.jpg',
  'wheat-bran': 'wheat-bran.jpg',
  'wheat-flour': 'wheat-flour.jpeg',

  // Nuts, Seeds & Dry Fruits
  'almond': 'almond.jpg',
  'almonds': 'almond.jpg',
  'black-raisins': 'black-raisins.jpg',
  'brazil-nut': 'brazil-nut.jpg',
  'brazil-nuts': 'brazil-nut.jpg',
  'cashew-nut': 'cashew-nut.jpg',
  'cashew-nuts': 'cashew-nut.jpg',
  'cashews': 'cashew-nut.jpg',
  'dried-apricot': 'dried-apricot.jpeg',
  'dried-apricots': 'dried-apricot.jpeg',
  'dried-cranberry': 'dried-cranberry.jpeg',
  'dried-cranberries': 'dried-cranberry.jpeg',
  'dried-fig': 'dried-fig.jpg',
  'dried-figs': 'dried-fig.jpg',
  'dry-coconut': 'dry-coconut.jpeg',
  'dry-coconut-powder': 'dry-coconut-powder.jpg',
  'golden-raisins': 'golden-raisins.jpg',
  'hazelnut': 'hazelnut.jpg',
  'hazelnuts': 'hazelnut.jpg',
  'macadamia-nut': 'macadamia-nut.jpg',
  'macadamia-nuts': 'macadamia-nut.jpg',
  'pine-nut': 'pine-nut.jpg',
  'pine-nuts': 'pine-nut.jpg',
  'pistachio': 'pistachio.jpg',
  'pistachios': 'pistachio.jpg',
  'premium-dates': 'premium-dates.jpg',
  'seedless-dates': 'seedless-dates.jpg',
  'walnut': 'walnut.jpg',
  'walnuts': 'walnut.jpg',

  // Oils, Ghee, Vinegars & Sundried / Vathal
  'apple-cider-vinegar': 'apple-cider-vinegar.jpg',
  'buffalo-ghee': 'buffalo-ghee.jpg',
  'butter': 'butter.jpg',
  'coconut-cream': 'coconut-cream.jpg',
  'cow-ghee': 'cow-ghee.jpg',
  'curd-chilli': 'curd-chilli.jpg',
  'curd-chillies': 'curd-chilli.jpg',
  'dried-bitter-gourd': 'dried-bitter-gourd.jpg',
  'dried-brinjal': 'dried-brinjal.jpg',
  'dried-cluster-beans': 'dried-cluster-beans.jpg',
  'dried-coriander-leaves': 'dried-coriander-leaves.jpeg',
  'dried-mango': 'dried-mango.jpg',
  'dried-mint-leaves': 'dried-mint-leaves.jpeg',
  'dried-turkey-berry': 'dried-turkey-berry.jpg',
  'dry-rose-petals': 'dry-rose-petals.jpg',
  'white-vinegar': 'white-vinegar.jpg',

  // Newly Available Ingredients (High-Density Images)
  'barnyard-millet-flour': 'barnyard-millet-flour.jpeg',
  'bay-leaf': 'bay-leaves.jpeg',
  'bay-leaves': 'bay-leaves.jpeg',
  'black-pepper': 'black-pepper.jpeg',
  'black-pepper-powder': 'black-pepper.jpeg',
  'black-salt': 'black-salt.jpeg',
  'brown-sugar': 'brown-sugar.jpeg',
  'canola-oil': 'canola-oil.jpeg',
  'carom-seeds': 'carom-seeds.jpeg',
  'cinnamon': 'cinnamon.jpeg',
  'cinnamon-powder': 'cinnamon.jpeg',
  'cloves': 'cloves.jpeg',
  'clove': 'cloves.jpeg',
  'coconut-cream-powder': 'coconut-cream-powder.jpeg',
  'coconut-milk-powder': 'coconut-milk-powder.jpeg',
  'coconut-oil': 'coconut-oil.jpeg',
  'coriander-seeds': 'coriander-seeds.jpeg',
  'cumin-seeds': 'cumin-seeds.jpeg',
  'curry-masala': 'curry-masala.jpeg',
  'desiccated-coconut': 'desiccated-coconut.jpeg',
  'dried-curry-leaves': 'dried-curry-leaves.jpeg',
  'dry-red-chilli': 'dry-red-chilli.jpeg',
  'fennel-seeds': 'fennel-seeds.jpeg',
  'fenugreek-seeds': 'fenugreek-seeds.jpeg',
  'flaxseed-powder': 'flackseeds-powder.jpeg',
  'flaxseeds-powder': 'flackseeds-powder.jpeg',
  'flackseeds-powder': 'flackseeds-powder.jpeg',
  'foxtail-millet-flour': 'foxtail-millet-flour.jpeg',
  'fried-garlic': 'fried-garlic.jpeg',
  'fried-onion': 'fried-onion.jpeg',
  'ghee': 'ghee.jpeg',
  'gingelly-oil': 'gingelly-oil.jpeg',
  'ginger-garlic-paste': 'ginger-garlic-paste.jpeg',
  'green-cardamom': 'green-cardamom.jpeg',
  'groundnut-oil': 'groundnut-oil.jpeg',
  'health-drink-mix': 'health-drink-mix.jpeg',
  'honey': 'honey.jpeg',
  'jaggery': 'jaggery.jpeg',
  'jaggery-powder': 'jaggery-powder.jpeg',
  'powdered-jaggery': 'jaggery-powder.jpeg',
  'kodo-millet-flour': 'kodo-millet-flour.jpeg',
  'kurma-masala': 'kurma-masala.jpeg',
  'lemon-pickle': 'lemon-pickle.jpeg',
  'little-millet-flour': 'little-millet-flour.jpeg',
  'long-pepper': 'long-pepper.jpeg',
  'mango-pickle': 'mango-pickle.jpeg',
  'maple-syrup': 'maple-syrup.jpeg',
  'meat-masala': 'meat-masala.jpeg',
  'mustard-oil': 'mustard-oil.jpeg',
  'mustard-seeds': 'mustard-seeds.jpeg',
  'nigella-seeds': 'nigella-seeds.jpeg',
  'kalonji': 'nigella-seeds.jpeg',
  'olive-oil': 'olive-oil.jpeg',
  'palm-jaggery': 'palm-jaggery.jpeg',
  'palm-oil': 'palm-oil.jpeg',
  'pearl-millet-flour': 'pearl-millet-flour.jpeg',
  'poppy-seeds': 'poppy-seeds.jpeg',
  'rasam-masala': 'rasam-masala.jpeg',
  'rice-bran-oil': 'rice-bran-oil.jpeg',
  'roasted-peanuts': 'roasted-peanuts.jpeg',
  'rock-salt': 'rock-salt.jpeg',
  'rock-sugar': 'rock-sugar.jpeg',
  'sambar-masala': 'sambar-masala.jpeg',
  'sea-salt': 'sea-salt.jpeg',
  'star-anise': 'star-anise.jpeg',
  'sugar': 'sugar.jpeg',
  'white-sugar': 'sugar.jpeg',
  'sunflower-oil': 'sunflower-oil.jpeg',
  'table-salt': 'table-salt.jpeg',
  'tamarind-paste': 'tamarind-paste.jpeg',
  'tandoori-masala': 'tandoori-masala.jpeg',
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
