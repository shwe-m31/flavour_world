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

  // High-Density Dals & Pulses (Batch 2)
  'toor-dal': 'toor-dal.jpeg',
  'toor-dal-premium': 'toor-dal-premium.jpeg',
  'split-toor-dal': 'split-toor-dal.jpeg',
  'urad-dal': 'urad-dal.jpeg',
  'white-urad-dal': 'white-urad-dal.jpeg',
  'whole-black-urad': 'whole-black-urad.jpeg',
  'split-black-urad': 'split-black-urad.jpeg',
  'black-gram': 'black-gram.jpeg',
  'chana-dal': 'chana-dal.jpeg',
  'moong-dal': 'moong-dal.jpeg',
  'split-green-gram': 'split-green-gram.jpeg',
  'green-gram': 'green-gram.jpeg',
  'sprouted-green-gram': 'sprouted-green-gram.jpeg',
  'masoor-dal': 'masoor-dal.jpeg',
  'whole-masoor': 'whole-masoor.jpeg',
  'red-lentils': 'red-lentils.jpeg',
  'yellow-lentils': 'yellow-lentils.jpeg',
  'horse-gram': 'horse-gram.jpeg',
  'sprouted-horse-gram': 'sprouted-horse-gram.jpeg',
  'roasted-gram': 'roasted-gram.jpeg',
  'cowpea': 'cowpea.jpeg',
  'black-eyed-peas': 'black-eyed-peas.jpeg',
  'red-cowpea': 'red-cowpea.jpeg',
  'white-cowpea': 'white-cowpea.jpeg',
  'field-beans': 'field-beans.jpeg',
  'black-chickpeas': 'black-chickpeas.jpeg',
  'white-chickpeas': 'white-chickpeas.jpeg',
  'brown-chickpeas': 'brown-chickpeas.jpeg',
  'rajma': 'rajma.jpeg',
  'adzuki-beans': 'adzuki-beans.jpeg',
  'cannelina-beans': 'cannelina-beans.jpeg',
  'pinto-beans': 'pinto-beans.jpeg',
  'lima-beans': 'lima-beans.jpeg',
  'navy-beans': 'navy-beans.jpeg',
  'double-beans': 'double-beans.jpeg',
  'mixed-beans': 'mixed-beans.jpeg',
  'mixed-sprouts': 'mixed-sprouts.jpeg',
  'sprouting-beans': 'sprouting-beans.jpeg',
  'soybeans': 'soybeans.jpeg',
  'soya-chunks': 'soye-chunks.jpeg',
  'dry-peas': 'dry-peas.jpeg',
  'yellow-peas': 'yellow-peas.jpeg',
  'moth-beans': 'moth-beans.jpeg',

  // Spice Powders & Blends (Batch 2)
  'garam-masala': 'garam-masala.jpeg',
  'sambar-powder': 'sambar-powder.jpeg',
  'rasam-powder': 'rasam-powder.jpeg',
  'idli-podi': 'idli-podi.jpeg',
  'paruppu-podi': 'paruppu-podi.jpeg',
  'curry-powder': 'curry-powder.jpeg',
  'coriander-powder': 'coriander-powder.jpeg',
  'coriander-cumin-powder': 'coriander-cumin-powder.jpeg',
  'cumin-powder': 'cumin-powder.jpeg',
  'fennel-powder': 'fennel-powder.jpeg',
  'fenugreek-powder': 'fenugreek-powder.jpeg',
  'dry-ginger-powder': 'dry-ginger-powder.jpeg',
  'ginger-powder': 'ginger-powder.jpeg',
  'garlic-powder': 'garlic-powder.jpeg',
  'onion-powder': 'onion-powder.jpeg',
  'kashmiri-chilli-powder': 'kashmiri-chilli-powder.jpeg',
  'black-pepper-powder': 'black-pepper-powder.jpeg',
  'white-pepper-powder': 'white-pepper-powder.jpeg',
  'mustard-powder': 'mustard-powder.jpeg',
  'mace-powder': 'mace-powder.jpeg',
  'nutmeg-powder': 'nutmeg-powder.jpeg',
  'cardamom-powder': 'cardomom-powder.jpeg',
  'biryani-masala': 'biriyani-masala.jpeg',
  'chicken-masala': 'chicken-masala.jpeg',
  'mutton-masala': 'mutton-masala.jpeg',
  'fish-masala': 'fish-masala.jpeg',
  'paneer-masala': 'panner-masala.jpeg',
  'pav-bhaji-masala': 'pav-bhaji-masala.jpeg',
  'kitchen-king-masala': 'kitchen-kking-masalla.jpeg',
  'chaat-masala': 'chat-masala.jpeg',
  'tamarind-powder': 'tamarind-powder.jpeg',
  'mango-powder': 'mango-powder.jpeg',

  // Traditional Podis & Rice Powders
  'sesame-rice-powder': 'sesame-rice-powder.jpeg',
  'garlic-rice-powder': 'garlic-rice-powder.jpeg',
  'pepper-rice-powder': 'pepper-rice-powder.jpeg',
  'curry-leaf-rice-powder': 'curry-leaf-rice-powder.jpeg',
  'coriander-rice-powder': 'coriander-rice-powder.jpeg',

  // Seeds & Floral Aromatics
  'white-sesame-seeds': 'white-sesame-seeds.jpeg',
  'black-sesame-seeds': 'black-sesame-seeds.jpeg',
  'basil-seeds': 'basil-seeds.jpeg',
  'lotus-seeds': 'lotus-seed.jpeg',
  'lotus-seed': 'lotus-seed.jpeg',
  'dried-neem-flowers': 'dried-neem-flowers.jpeg',

  // Beverages & Natural Sweeteners
  'black-tea': 'black-tea.jpeg',
  'green-tea': 'green-tea.jpeg',
  'herbal-tea': 'herbal-tea.jpeg',
  'masala-tea': 'masala-tea.jpeg',
  'tea-powder': 'tea-powder.jpeg',
  'filter-coffee': 'filter-coffee.jpeg',
  'filter-coffee-powder': 'filter-coffee.jpeg',
  'instant-coffee': 'instant-coffee.jpeg',
  'chicory-powder': 'chicory-powder.jpeg',
  'sugar-candy': 'sugar-candy.jpeg',
  'palm-sugar-candy': 'palm-sugar-candy.jpeg',
  'powdered-sugar': 'powdered-sugar.jpeg',
  'date-syrup': 'date-syrup.jpeg',
  'peanut-butter': 'peanut-butter.jpeg',

  // Crisps, Vadam & Traditional Snacks
  'rice-papad': 'rice-papad.jpeg',
  'urad-papad': 'urad-papad.jpeg',
  'rice-vadam': 'rice-vadam.jpeg',
  'javvarisi-vadagam': 'javvarisi-vadagam.jpeg',
  'fryums': 'fryums.jpeg',
  'murukku': 'murukku.jpeg',
  'seedai': 'seedai.jpeg',
  'banana-chips': 'banana-chips.jpeg',
  'tapioca-chips': 'tapioca-chips.jpeg',

  // Pickles & Textured Protein
  'garlic-pickle': 'garlic-pickle.jpeg',
  'gooseberry-pickle': 'gooseberry-pickle.jpeg',
  'mixed-vegetable-pickle': 'mixed-vegetable-pickle.jpeg',
  'textured-vegetable-protein': 'textured-vegetable-protein.jpeg',

  // Natural Catalog Aliases
  'sesame-oil': 'gingelly-oil.jpeg',
  'tamarind': 'tamarind-paste.jpeg',
  'cannellini-beans': 'cannelina-beans.jpeg',
  'white-urad-whole': 'white-urad-dal.jpeg',
  'white-split-urad': 'white-urad-dal.jpeg',
  'whole-green-gram': 'green-gram.jpeg',
  'whole-bengal-gram': 'black-chickpeas.jpeg',
  'black-eyed-beans': 'black-eyed-peas.jpeg',
  'mochai': 'field-beans.jpeg',
  'white-mochai': 'field-beans.jpeg',
  'brown-mochai': 'field-beans.jpeg',
  'red-kidney-beans': 'rajma.jpeg',
  'white-kidney-beans': 'cannelina-beans.jpeg',
  'green-dry-peas': 'dry-peas.jpeg',
  'white-dry-peas': 'dry-peas.jpeg',
  'horse-gram-flour': 'horse-gram.jpeg',
  'green-gram-flour': 'green-gram.jpeg',
  'black-gram-flour': 'black-gram.jpeg',
  'sprouted-ragi-flour': 'ragi-flour.jpeg',
  'bread-crumbs': 'bread-crumbs.jpg',
  'corn-flakes': 'corn-flakes.jpg',
  'red-lobia': 'red-cowpea.jpeg',
  'white-lobia': 'white-cowpea.jpeg',
  'kulambu-chilli-powder': 'curry-powder.jpeg',
  'garlic-podi': 'garlic-rice-powder.jpeg',
  'curry-leaf-podi': 'curry-leaf-rice-powder.jpeg',
  'sesame-podi': 'sesame-rice-powder.jpeg',
  'mustard': 'mustard-seeds.jpeg',
  'cumin': 'cumin-seeds.jpeg',
  'fennel': 'fennel-seeds.jpeg',
  'fenugreek': 'fenugreek-seeds.jpeg',
  'coriander': 'coriander-seeds.jpeg',
  'cardamom': 'green-cardamom.jpeg',
  'chilli-powder': 'red-chilli-powder.png',

  // Ready Mixes & Powders
  'dosa-mix': 'dosa-mix-powder.png',
  'idli-mix': 'idli-mix.png',
  'dosa-mix-powder': 'dosa-mix-powder.png',
  'adai-mix': 'adai-mix.png',
  'ragi-dosa-mix': 'ragi-dosa-mix.png',
  'multigrain-dosa-mix': 'multigrain-dosa-mix.png',
  'lemon-rice-mix': 'lemon-rice-mix.png',
  'tamarind-rice-mix': 'tamarind-rice-mix.png',
  'coconut-rice-mix': 'coconut-rice-mix.png',
  'tomato-rice-mix': 'tomato-rice-mix.png',
  'curry-leaf-rice-mix': 'curry-leaf-rice-mix.png',
  'coriander-rice-mix': 'coriander-rice-mix.png',
  'sesame-rice-mix': 'sesame-rice-mix.png',
  'pepper-rice-mix': 'pepper-rice-powder.jpeg',
  'jeera-rice-mix': 'jeera-rice-mix.png',
  'mint-rice-mix': 'mint-rice-mix.png',
  'garlic-rice-mix': 'garlic-rice-mix.png',
  'pongal-mix': 'pongal-mix.png',
  'upma-mix': 'upma-mix.png',
  'kozhukattai-mix': 'kozhukattai-mix.png',
  'paniyaram-mix': 'paniyaram-mix.png',
  'appam-mix': 'appam-mix.png',
  'idiyappam-mix': 'idiyappam-mix.png',
  'puttu-mix': 'puttu-mix.png',
  'rice-porridge-mix': 'rice-porridge-mix.png',

  // Rice & Grains
  'rice': 'rice.png',
  'raw-rice': 'raw-rice.png',
  'boiled-rice': 'boiled-rice.png',
  'ponni-rice': 'ponni-rice.png',
  'basmati-rice': 'basmati-rice.png',
  'idli-rice': 'idli-rice.png',
  'seeraga-samba-rice': 'seeraga-samba-rice.png',
  'brown-rice': 'brown-rice.png',
  'red-rice': 'red-rice.png',
  'black-rice': 'black-rice.png',
  'sona-masoori-rice': 'sona-masoori-rice.png',
  'matta-rice': 'matta-rice.png',
  'broken-rice': 'broken-rice.png',
  'mapillai-samba-rice': 'mapillai-samba-rice.png',
  'karuppu-kavuni-rice': 'karuppu-kavuni-rice.png',
  'kichili-samba-rice': 'kichili-samba-rice.png',
  'kaikuthal-rice': 'kaikuthal-rice.png',
  'aval': 'aval.png',
  'aval-poha': 'aval.png',
  'red-aval': 'red-aval.png',
  'thick-poha': 'thick-poha.png',
  'thin-poha': 'thin-poha.png',
  'rice-flakes': 'rice-flakes.png',
  'puffed-rice': 'puffed-rice.png',
  'rice-rava': 'rice-rava.png',
  'rice-vermicelli': 'rice-vermicelli.png',
  'rice-sevai': 'rice-sevai.png',
  'rice-noodles': 'rice-noodles.png',
  'sago': 'sago.png',
  'nylon-sago': 'nylon-sago.png',

  // Millets & Whole Grains
  'ragi': 'ragi.png',
  'kambu': 'kambu.png',
  'thinai': 'thinai.png',
  'samai': 'samai.png',
  'varagu': 'varagu.png',
  'kuthiraivali': 'kuthiraivali.png',
  'wheat': 'wheat.png',
  'broken-wheat': 'broken-wheat.png',
  'oats': 'oats.png',
  'barley': 'barley.png',
  'quinoa': 'quinoa.png',
  'maize': 'maize.png',
  'corn-grits': 'corn-grits.png',
  'broken-corn': 'corn-grits.png',
  'cornmeal': 'corn-meal.png',

  // Condiments, Salts & Sauces
  'arrowroot': 'arrowroot.png',
  'pink-salt': 'pink-salt.png',
  'lemon-salt': 'lemon-salt.png',
  'tomato-ketchup': 'tomato-ketchup.png',
  'soy-sauce': 'soy-sauce.png',
  'green-chilli-sauce': 'green-chilli-sauce.png',
  'red-chilli-sauce': 'red-chilli-sauce.png',
  'schezwan-sauce': 'schezwan-sauce.png',
  'nutritional-yeast': 'dry-yeast.jpg',

  // Seeds & Specialty
  'pumpkin-seeds': 'pumpkin-seeds.png',
  'sunflower-seeds': 'sunflower-seeds.png',
  'flax-seeds': 'flax-seeds.png',
  'chia-seeds': 'chia-seeds.png',
  'watermelon-seeds': 'watermelon-seeds.png',
  'muskmelon-seeds': 'muskmelon-seeds.png',
  'black-sesame': 'black-sesame-seeds.jpeg',
  'white-sesame': 'white-sesame-seeds.jpeg',
  'fox-nuts-makhana': 'lotus-seed.jpeg',
  'sabja-seeds': 'basil-seeds.jpeg',
  'javvarisi-vadam': 'javvarisi-vadagam.jpeg',
  'mint-powder': 'mint-leaf-powder.jpeg',
  'clove-powder': 'clove-powder.jpeg',
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
