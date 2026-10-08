import json
import os

DESCRIPTIONS = {
    'corn-meal.jpg': 'golden-yellow coarse corn meal grains with gritty granular polenta texture filling the bowl',
    'rice-bran.jpg': 'fine light-tan silky rice bran meal with soft powdery texture and subtle warm tones',
    'wheat-bran.jpg': 'flaky golden-brown coarse wheat bran flakes with distinct fibrous cereal texture',
    'dry-coconut-powder.jpg': 'finely grated desiccated pure ivory-white dry coconut flakes and powder with soft shredded texture',
    'coconut-cream.jpg': 'luxurious thick velvety smooth pure white coconut cream with subtle glossy surface sheen',
    'white-vinegar.jpg': 'crystal clear transparent white vinegar liquid filling the bowl with soft surface reflections',
    'apple-cider-vinegar.jpg': 'clear translucent warm golden-amber apple cider vinegar liquid with soft ambient reflections',
    'curd-chilli.jpg': 'traditional sun-dried pale yellowish-tan curd chillies (mor milagai) with white salt-curd crust and wrinkled skin',
    'cow-ghee.jpg': 'rich golden-yellow clarified butter oil (cow ghee) with semi-solid granular texture and soft oily sheen',
    'buffalo-ghee.jpg': 'pure ivory-white clarified buffalo ghee with delicate granular fat texture and soft buttery surface',
    'butter.jpg': 'creamy pale-yellow fresh dairy butter block or soft smooth swirl with velvety texture',
    'dried-turkey-berry.jpg': 'small wrinkled sun-dried dark brownish-black turkey berries (sundakkai vathal) piled neatly',
    'dried-brinjal.jpg': 'sun-dried wrinkled dark purple-brown dried brinjal eggplant pieces (kathirikai vathal)',
    'dried-cluster-beans.jpg': 'slender wrinkled sun-dried pale greenish-brown salted cluster bean pods (kothavarangai vathal)',
    'dried-bitter-gourd.jpg': 'crisp sun-dried dark olive-green ridged bitter gourd round slices (pavakkai vathal)',
    'dried-mango.jpg': 'sun-dried chewy golden-amber amchur dried mango slices with wrinkled fibrous edges',
    'dry-rose-petals.jpg': 'delicate dried deep crimson and ruby-pink edible rose flower petals with crisp crinkled texture',
    'almond.jpg': 'premium whole unpeeled raw brown almonds with natural matte skin texture and pointed teardrop shape',
    'cashew-nut.jpg': 'plump whole creamy ivory-white raw cashew nut kernels with curved kidney shape',
    'pistachio.jpg': 'shelled vibrant green pistachio nut kernels with delicate purple-tinged skin accents',
    'walnut.jpg': 'whole halved golden-brown walnut kernels with deeply grooved convoluted brain-like ridges',
    'hazelnut.jpg': 'rounded whole raw hazelnut kernels with rich golden-brown papery skin and smooth contours',
    'macadamia-nut.jpg': 'smooth spherical pale ivory-cream buttery macadamia nut kernels',
    'brazil-nut.jpg': 'large crescent-shaped raw Brazil nut kernels with dark brown skin and ivory meat',
    'pine-nut.jpg': 'small slender tear-shaped ivory-cream raw pine nut kernels (pignoli)',
    'golden-raisins.jpg': 'plump translucent golden-amber dried kishmish raisins with wrinkled glossy skin',
    'black-raisins.jpg': 'deep dark purple-black wrinkled whole sun-dried raisins with rich matte surface',
    'seedless-dates.jpg': 'rich dark mahogany-brown pitted seedless dried dates with glossy wrinkled skin',
    'premium-dates.jpg': 'large plump succulent Medjool dates with glossy dark amber-brown textured skin and soft caramelized flesh',
    'dried-fig.jpg': 'round flattened chewy golden-brown sun-dried figs (anjeer) with tiny seeds visible under skin',
    'dried-apricot.jpg': 'plump chewy bright orange-amber sun-dried whole apricots with soft velvety surface',
    'dried-cranberry.jpg': 'deep ruby-crimson sweetened dried cranberry pieces with wrinkled glossy texture',
    'dry-coconut.jpg': 'halved dried coconut copra cups (sukha nariyal) with dark brown fibrous exterior and creamy white interior',
    'wheat-flour.jpg': 'soft light creamy-buff whole wheat atta flour powder forming a gentle mound',
    'rice-flour.jpg': 'ultra-fine silky pristine white rice flour powder with delicate powdery surface',
    'maida.jpg': 'pristine snow-white ultra-fine smooth all-purpose refined wheat flour (maida)',
    'besan.jpg': 'fine pastel golden-yellow chickpea gram flour powder with soft matte mounds',
    'corn-flour.jpg': 'silky smooth pure bright white corn flour starch powder with delicate velvety texture',
    'ragi-flour.jpg': 'earthy dark greyish-brown finger millet ragi flour powder with rustic fine texture',
    'kambu-flour.jpg': 'mottled pale greyish-green pearl millet (bajra/kambu) flour powder',
    'thinai-flour.jpg': 'pale warm yellow foxtail millet flour powder with delicate grainy softness',
    'samai-flour.jpg': 'soft off-white to ivory little millet flour powder with fine powdery texture',
    'varagu-flour.jpg': 'light greyish-beige kodo millet flour powder with fine organic milled texture',
    'kuthiraivali-flour.jpg': 'creamy ivory-white barnyard millet flour powder with soft subtle mounds',
    'cholam-flour.jpg': 'pale creamy off-white great millet (jowar/sorghum) flour powder',
    'multigrain-flour.jpg': 'wholesome rustic light beige-tan multigrain flour with subtle visible speckles of milled grains',
    'oats-flour.jpg': 'pale ivory-cream finely ground whole rolled oats flour powder with delicate matte surface',
    'coconut-flour.jpg': 'light airy ivory-white dried coconut flour powder with subtle fluffy fibrous texture',
    'tapioca-flour.jpg': 'ultra-fine pristine chalk-white tapioca starch flour powder with silky smooth finish',
    'idiyappam-flour.jpg': 'pristine snow-white finely sifted steamed rice flour for idiyappam string hoppers',
    'puttu-flour.jpg': 'coarsely milled textured white rice puttu podi flour with tiny granular beads and soft clumping',
    'rava.jpg': 'fine pale cream-colored durum wheat semolina granules with dry crystalline texture',
    'bombay-rava.jpg': 'coarse golden-cream wheat semolina rava granules with distinct granular texture',
    'gram-flour.jpg': 'rich bright sunny-yellow pure chana dal gram flour powder with velvety peaks',
    'sattu-flour.jpg': 'roasted golden-buff toasted Bengal gram sattu flour powder with fragrant nutty appearance',
    'sorghum-flour.jpg': 'fine pale off-white jowar sorghum flour powder with smooth soft texture',
    'arrowroot-powder.jpg': 'pure bright white silky arrowroot starch powder with delicate powdery surface',
    'roasted-rice-flour.jpg': 'light toasted ivory-tan fine roasted rice flour with subtle warm tint',
    'roasted-gram-flour.jpg': 'pale golden-yellow fine flour ground from roasted chana dal (pottukadalai powder)',
    'moringa-leaf-powder.jpg': 'vibrant deep olive-green fine organic moringa drumstick leaf powder with herbal matte texture',
    'banana-flower-powder.jpg': 'deep earthy brownish-grey fine dried banana blossom (vazhaipoo) powder',
    'banana-stem-powder.jpg': 'light fibrous pale buff-tan fine dried banana stem (vazhaithandu) powder',
    'curry-leaf-powder.jpg': 'rich dark forest-green fragrant dried curry leaf powder with fine herbal texture',
    'mint-leaf-powder.jpg': 'lively herbal moss-green fine dried mint leaf powder with delicate leafy specks',
    'coriander-leaf-powder.jpg': 'medium leafy green fragrant dried coriander cilantro leaf powder',
    'neem-flower-powder.jpg': 'light dried cream-brown speckled crushed neem flower blossom (veppam poo) powder',
    'psyllium-husk.jpg': 'delicate translucent pale ivory-white fibrous psyllium husk flakes (isabgol) with light feathery texture',
    'dried-mint-leaves.jpg': 'crumbled aromatic dark olive-green dried mint leaves with crinkled dry leafy fragments',
    'dried-coriander-leaves.jpg': 'crinkled aromatic dark green dried cilantro coriander leaf flakes',
    'chettinad-masala.jpg': 'rich dark reddish-brown coarsely ground Chettinad spice blend with visible roasted spice texture and dark peppercorn notes',
    'egg-masala.jpg': 'vibrant warm reddish-orange finely ground egg curry spice masala powder with rich spicy aroma appearance',
    'chole-masala.jpg': 'deep dark brown roasted Punjabi chole masala spice powder with earthy piquant texture',
    'rajma-masala.jpg': 'warm rustic reddish-brown aromatic rajma masala curry spice blend powder',
    'tandoori-masala.jpg': 'striking vibrant crimson-red tandoori spice blend powder with rich warm undertones',
    'sambar-masala.jpg': 'warm golden reddish-orange South Indian sambar podi masala powder with fine roasted coriander and dal texture',
    'rasam-masala.jpg': 'warm reddish-brown aromatic rasam podi powder with coarse ground coriander, cumin, and black pepper specks',
    'kurma-masala.jpg': 'pale warm golden-buff South Indian korma kurma masala powder with mild aromatic spice texture',
    'curry-masala.jpg': 'rich golden-brown all-purpose Indian curry masala powder with balanced turmeric, cumin, and coriander hues',
    'shahi-paneer-masala.jpg': 'warm golden-orange royal Shahi paneer masala powder with creamy yellow undertones and delicate spice texture',
    'meat-masala.jpg': 'deep dark reddish-brown robust meat masala spice powder with intensely roasted whole spice flecks'
}

catalog_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'flavour_world_master_catalog.json')
with open(catalog_path, 'r', encoding='utf-8') as f:
    catalog = json.load(f)

updated_count = 0
for item in catalog:
    fn = item.get('filename')
    if fn in DESCRIPTIONS:
        desc = DESCRIPTIONS[fn]
        item['description'] = desc
        item['prompt'] = (
            f"A professional catalog food product photograph in the exact same visual style, camera angle, lighting, and composition as the reference image. "
            f"In the center of the frame is the same round white ceramic bowl resting on a clean plain seamless off-white background with a soft subtle realistic contact shadow underneath. "
            f"Inside the bowl is {desc}. "
            f"Studio diffused lighting, sharp focus, 1:1 square aspect ratio, 50mm lens perspective, high angle 50 degree view. "
            f"No spoons, no utensils, no hands, no text, no labels, no branding, no other objects."
        )
        updated_count += 1

print(f"Updated {updated_count} items in catalog.")
with open(catalog_path, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)
print("Saved catalogue successfully.")
