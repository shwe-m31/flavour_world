import React from 'react';

/**
 * Clean SVG Line-Art Illustrations for Premium Indian Pantry Stickers.
 * Styled with stroke="currentColor" and delicate line weights matching luxury packaging.
 * NEVER renders emojis or photographic images.
 */
export const IngredientIllustration = ({ ingredientName = '', _categoryId = null, color = 'currentColor', size = 32 }) => {
  const name = (ingredientName || '').toLowerCase().trim();

  // 1. Wheat, Rava, Semolina, Grains, Flours, Pastas
  if (
    name.includes('wheat') ||
    name.includes('rava') ||
    name.includes('semolina') ||
    name.includes('vermicelli') ||
    name.includes('macaroni') ||
    name.includes('pasta') ||
    name.includes('flour') ||
    name.includes('atta') ||
    name.includes('maida') ||
    name.includes('oat') ||
    name.includes('barley') ||
    name.includes('cereal') ||
    name.includes('muesli') ||
    name.includes('sooji') ||
    name.includes('suji')
  ) {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Wheat Stalk */}
        <path d="M20 36V12" />
        <path d="M20 12C20 8 16 4 16 4C16 4 20 8 20 12Z" />
        <path d="M20 16C16 14 13 10 13 10C15 14 20 16 20 16Z" />
        <path d="M20 16C24 14 27 10 27 10C25 14 20 16 20 16Z" />
        <path d="M20 22C15 20 11 16 11 16C14 20 20 22 20 22Z" />
        <path d="M20 22C25 20 29 16 29 16C26 20 20 22 20 22Z" />
        <path d="M20 28C15 26 12 23 12 23C15 26 20 28 20 28Z" />
        <path d="M20 28C25 26 28 23 28 23C25 26 20 28 20 28Z" />
      </svg>
    );
  }

  // 2. Rice & Rice Products
  if (
    name.includes('rice') ||
    name.includes('poha') ||
    name.includes('aval') ||
    name.includes('basmati') ||
    name.includes('ponni') ||
    name.includes('idiyappam') ||
    name.includes('puttu') ||
    name.includes('sago')
  ) {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Rice Panicle */}
        <path d="M14 36C15 28 18 20 26 12" />
        <ellipse cx="27" cy="11" rx="4" ry="2" transform="rotate(-35 27 11)" />
        <ellipse cx="23" cy="15" rx="3.5" ry="1.8" transform="rotate(-40 23 15)" />
        <ellipse cx="20" cy="20" rx="3.5" ry="1.8" transform="rotate(-45 20 20)" />
        <ellipse cx="28" cy="18" rx="3.5" ry="1.8" transform="rotate(-25 28 18)" />
        <ellipse cx="24" cy="24" rx="3.5" ry="1.8" transform="rotate(-30 24 24)" />
        <path d="M13 32C10 27 11 22 13 18" />
        <ellipse cx="13" cy="18" rx="3" ry="1.5" transform="rotate(-60 13 18)" />
        <ellipse cx="11" cy="23" rx="3" ry="1.5" transform="rotate(-55 11 23)" />
      </svg>
    );
  }

  // 3. Dals, Lentils, Pulses & Beans
  if (
    name.includes('dal') ||
    name.includes('lentil') ||
    name.includes('chickpea') ||
    name.includes('chana') ||
    name.includes('rajma') ||
    name.includes('moong') ||
    name.includes('urad') ||
    name.includes('toor') ||
    name.includes('gram') ||
    name.includes('pea') ||
    name.includes('bean') ||
    name.includes('soybean') ||
    name.includes('sprout')
  ) {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Botanical Legume Pod */}
        <path d="M8 32C11 27 18 24 28 24C32 24 34 22 35 20C33 16 28 14 20 16C12 18 8 24 8 32Z" />
        <circle cx="16" cy="20" r="2" />
        <circle cx="22" cy="19.5" r="2" />
        <circle cx="28" cy="20" r="2" />
        <path d="M6 34C8 33 10 32 12 30" />
      </svg>
    );
  }

  // 4. Chillies & Hot Spices
  if (
    name.includes('chilli') ||
    name.includes('chili') ||
    name.includes('pepper') ||
    name.includes('milagai') ||
    name.includes('mirch')
  ) {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Whole Chilli Pepper */}
        <path d="M22 6C23 10 24 13 22 17C20 22 16 28 14 34C13 36 11 36 11 34C10 29 11 22 14 17C16 13 18 9 18 6Z" />
        <path d="M20 7C22 5 24 4 27 4" />
        <path d="M17 9C19 8 23 8 24 10" />
      </svg>
    );
  }

  // 5. Turmeric, Ginger & Rhizomes
  if (
    name.includes('turmeric') ||
    name.includes('manjal') ||
    name.includes('haldi') ||
    name.includes('ginger') ||
    name.includes('amchur')
  ) {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Rhizome / Ginger Root */}
        <path d="M12 28C10 25 10 20 14 17C16 15 16 11 20 10C24 9 26 13 28 15C31 16 33 20 31 23C29 25 29 28 26 30C22 32 15 31 12 28Z" />
        <path d="M17 19C19 20 22 20 24 19" />
        <path d="M15 24C18 25 21 25 25 23" />
      </svg>
    );
  }

  // 6. Herbs, Leaves & Greens
  if (
    name.includes('coriander') ||
    name.includes('curry') ||
    name.includes('mint') ||
    name.includes('pudina') ||
    name.includes('methi') ||
    name.includes('leaf') ||
    name.includes('leaves') ||
    name.includes('herb') ||
    name.includes('bay') ||
    name.includes('neem') ||
    name.includes('moringa')
  ) {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Botanical Herb Sprig */}
        <path d="M20 35V12" />
        <path d="M20 12C20 6 25 6 25 6C25 6 25 11 20 12Z" />
        <path d="M20 17C15 15 13 9 13 9C13 9 19 11 20 17Z" />
        <path d="M20 22C26 20 28 14 28 14C28 14 22 16 20 22Z" />
        <path d="M20 27C15 26 12 21 12 21C12 21 18 22 20 27Z" />
      </svg>
    );
  }

  // 7. Whole Spices & Masalas (Cardamom, Clove, Star Anise, Cinnamon, Cumin, Mustard, Fennel)
  if (
    name.includes('cardamom') ||
    name.includes('clove') ||
    name.includes('cinnamon') ||
    name.includes('anise') ||
    name.includes('cumin') ||
    name.includes('mustard') ||
    name.includes('fennel') ||
    name.includes('fenugreek') ||
    name.includes('masala') ||
    name.includes('spice') ||
    name.includes('asafoetida') ||
    name.includes('ajwain')
  ) {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Star Anise & Spice Blossom */}
        <circle cx="20" cy="20" r="3" />
        <path d="M20 13V7" />
        <path d="M20 27V33" />
        <path d="M13 20H7" />
        <path d="M27 20H33" />
        <path d="M15 15L10 10" />
        <path d="M25 25L30 30" />
        <path d="M25 15L30 10" />
        <path d="M15 25L10 30" />
      </svg>
    );
  }

  // 8. Oils, Ghee, Butter & Liquids
  if (
    name.includes('oil') ||
    name.includes('ghee') ||
    name.includes('butter') ||
    name.includes('vinegar') ||
    name.includes('sauce') ||
    name.includes('ketchup') ||
    name.includes('pickle')
  ) {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Oil Droplet with Olive Sprig */}
        <path d="M20 7C20 7 13 18 13 24C13 28 16 31 20 31C24 31 27 28 27 24C27 18 20 7 20 7Z" />
        <path d="M17 25C17 27 18.5 28.5 20 28.5" />
      </svg>
    );
  }

  // 9. Honey, Sugar, Jaggery, Sweeteners & Salts
  if (
    name.includes('honey') ||
    name.includes('sugar') ||
    name.includes('jaggery') ||
    name.includes('salt') ||
    name.includes('syrup') ||
    name.includes('candy')
  ) {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Hexagonal Honeycomb & Crystal */}
        <polygon points="20,10 28,14.5 28,23.5 20,28 12,23.5 12,14.5" />
        <polygon points="20,14 25,17 25,22 20,25 15,22 15,17" />
        <circle cx="20" cy="19.5" r="1.5" />
      </svg>
    );
  }

  // 10. Nuts, Dry Fruits & Seeds
  if (
    name.includes('nut') ||
    name.includes('almond') ||
    name.includes('cashew') ||
    name.includes('pista') ||
    name.includes('walnut') ||
    name.includes('raisin') ||
    name.includes('date') ||
    name.includes('fig') ||
    name.includes('apricot') ||
    name.includes('cranberry') ||
    name.includes('seed') ||
    name.includes('makhana') ||
    name.includes('coconut') ||
    name.includes('peanut')
  ) {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Almond / Botanical Nut */}
        <path d="M20 7C20 7 10 17 10 24C10 29 14.5 33 20 33C25.5 33 30 29 30 24C30 17 20 7 20 7Z" />
        <path d="M20 14C17 20 17 25 18 29" />
        <path d="M20 14C23 20 23 25 22 29" />
      </svg>
    );
  }

  // 11. Tea, Coffee, Cocoa & Beverages
  if (
    name.includes('tea') ||
    name.includes('coffee') ||
    name.includes('cocoa') ||
    name.includes('chocolate')
  ) {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Ceramic Teacup & Steam */}
        <path d="M10 16H28V24C28 27.5 25 30 21 30H17C13 30 10 27.5 10 24V16Z" />
        <path d="M28 18H31C32.5 18 33.5 19 33.5 20.5C33.5 22 32.5 23 31 23H28" />
        <path d="M8 33H30" />
        <path d="M15 12C15 10 17 9 17 7" />
        <path d="M21 12C21 10 23 9 23 7" />
      </svg>
    );
  }

  // 12. Baking, Yeast, Essences & Essentials
  if (
    name.includes('baking') ||
    name.includes('yeast') ||
    name.includes('vanilla') ||
    name.includes('custard') ||
    name.includes('gelatin') ||
    name.includes('agar') ||
    name.includes('starch') ||
    name.includes('colour') ||
    name.includes('color') ||
    name.includes('crumb')
  ) {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Chef Whisk */}
        <path d="M19 26V35" />
        <path d="M21 26V35" />
        <path d="M20 6C15 10 14 17 17 24C18 26 22 26 23 24C26 17 25 10 20 6Z" />
        <path d="M20 6V26" />
        <path d="M17 12C18 16 19 20 19 25" />
        <path d="M23 12C22 16 21 20 21 25" />
      </svg>
    );
  }

  // 13. Default Universal Heritage Pantry Emblem (graceful botanical flourish)
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Heritage Botanical Flourish */}
      <circle cx="20" cy="20" r="2.5" />
      <path d="M20 11C20 15 17 17 14 17C14 14 16 11 20 11Z" />
      <path d="M20 11C20 15 23 17 26 17C26 14 24 11 20 11Z" />
      <path d="M20 29C20 25 17 23 14 23C14 26 16 29 20 29Z" />
      <path d="M20 29C20 25 23 23 26 23C26 26 24 29 20 29Z" />
      <path d="M11 20H8" />
      <path d="M32 20H29" />
    </svg>
  );
};

export default IngredientIllustration;
