/**
 * Flavour World — Premium Luxury Pantry Label Design System
 * 
 * Centralized theme palettes, realistic border styles, sticker dimensions,
 * typography pairings, and supported regional languages.
 */

export const STICKER_THEMES = [
  {
    id: 'navy-gold',
    name: 'Royal Navy & Gold',
    subtitle: 'Deep midnight navy with warm antique gold',
    background: '#0d1a2d',
    paperTint: 'rgba(13, 26, 45, 0.98)',
    primaryColor: '#faf6ee',
    secondaryColor: '#d6b87d',
    borderColor: '#c59f53',
    accentColor: '#d9b668',
    badgeBg: 'rgba(217, 182, 104, 0.12)',
    previewBg: '#0d1a2d',
    previewBorder: '#c59f53',
    previewAccent: '#d6b87d',
    finish: 'matte-gold'
  },
  {
    id: 'forest-gold',
    name: 'Forest Green & Gold',
    subtitle: 'Regal botanical emerald with warm gold accents',
    background: '#10281e',
    paperTint: 'rgba(16, 40, 30, 0.98)',
    primaryColor: '#faf6ee',
    secondaryColor: '#d5bb82',
    borderColor: '#c4a259',
    accentColor: '#d6b46b',
    badgeBg: 'rgba(214, 180, 107, 0.12)',
    previewBg: '#10281e',
    previewBorder: '#c4a259',
    previewAccent: '#d5bb82',
    finish: 'matte-gold'
  },
  {
    id: 'ivory-bronze',
    name: 'Warm Ivory & Bronze',
    subtitle: 'Artisanal warm cream with deep espresso and bronze',
    background: '#f8f3e7',
    paperTint: 'rgba(248, 243, 231, 0.98)',
    primaryColor: '#241710',
    secondaryColor: '#725139',
    borderColor: '#876245',
    accentColor: '#8a6446',
    badgeBg: 'rgba(138, 100, 70, 0.1)',
    previewBg: '#f8f3e7',
    previewBorder: '#876245',
    previewAccent: '#725139',
    finish: 'parchment'
  },
  {
    id: 'lavender-plum',
    name: 'Rich Lavender & Plum',
    subtitle: 'Regal dusky lavender with deep plum accents',
    background: '#2b1736',
    paperTint: 'rgba(43, 23, 54, 0.98)',
    primaryColor: '#f8f2fb',
    secondaryColor: '#d7b5de',
    borderColor: '#be8dbf',
    accentColor: '#cb9fc9',
    badgeBg: 'rgba(203, 159, 201, 0.14)',
    previewBg: '#2b1736',
    previewBorder: '#be8dbf',
    previewAccent: '#d7b5de',
    finish: 'matte-rose'
  },
  {
    id: 'mustard-brown',
    name: 'Mustard & Dark Brown',
    subtitle: 'Heritage spice mustard with roasted umber',
    background: '#cf972e',
    paperTint: 'rgba(207, 151, 46, 0.98)',
    primaryColor: '#261205',
    secondaryColor: '#45230c',
    borderColor: '#3b1c09',
    accentColor: '#381a07',
    badgeBg: 'rgba(56, 26, 7, 0.12)',
    previewBg: '#cf972e',
    previewBorder: '#3b1c09',
    previewAccent: '#261205',
    finish: 'warm-spice'
  },
  {
    id: 'charcoal-gold',
    name: 'Charcoal Black & Gold',
    subtitle: 'Velvet obsidian charcoal with luminous antique gold',
    background: '#121417',
    paperTint: 'rgba(18, 20, 23, 0.98)',
    primaryColor: '#fdfaf3',
    secondaryColor: '#deb667',
    borderColor: '#caa04d',
    accentColor: '#d9b25f',
    badgeBg: 'rgba(217, 178, 95, 0.14)',
    previewBg: '#121417',
    previewBorder: '#caa04d',
    previewAccent: '#deb667',
    finish: 'obsidian-gold'
  },
  {
    id: 'muted-teal',
    name: 'Muted Teal & Brass',
    subtitle: 'Deep heritage ocean teal with polished brass',
    background: '#0f2f32',
    paperTint: 'rgba(15, 47, 50, 0.98)',
    primaryColor: '#f0f8f7',
    secondaryColor: '#c9b17c',
    borderColor: '#be9f5c',
    accentColor: '#cfb26f',
    badgeBg: 'rgba(207, 178, 111, 0.12)',
    previewBg: '#0f2f32',
    previewBorder: '#be9f5c',
    previewAccent: '#c9b17c',
    finish: 'ocean-brass'
  },
  {
    id: 'terracotta-clay',
    name: 'Dusty Terracotta & Clay',
    subtitle: 'Warm sun-baked clay with copper and terracotta',
    background: '#8c3d28',
    paperTint: 'rgba(140, 61, 40, 0.98)',
    primaryColor: '#fff5ee',
    secondaryColor: '#f2c6b3',
    borderColor: '#dd9f83',
    accentColor: '#e8af95',
    badgeBg: 'rgba(232, 175, 149, 0.14)',
    previewBg: '#8c3d28',
    previewBorder: '#dd9f83',
    previewAccent: '#f2c6b3',
    finish: 'earthen'
  },
  {
    id: 'sage-botanical',
    name: 'Sage Green & Pine',
    subtitle: 'Calming organic sage with deep botanical pine',
    background: '#dbe5dc',
    paperTint: 'rgba(219, 229, 220, 0.98)',
    primaryColor: '#123221',
    secondaryColor: '#2b583f',
    borderColor: '#1f4831',
    accentColor: '#1a412b',
    badgeBg: 'rgba(26, 65, 43, 0.1)',
    previewBg: '#dbe5dc',
    previewBorder: '#1f4831',
    previewAccent: '#123221',
    finish: 'botanical-sage'
  },
  {
    id: 'burgundy-wine',
    name: 'Burgundy & Rose Gold',
    subtitle: 'Deep vintage wine burgundy with metallic rose accents',
    background: '#390c17',
    paperTint: 'rgba(57, 12, 23, 0.98)',
    primaryColor: '#fbf4f0',
    secondaryColor: '#dcb39e',
    borderColor: '#cca088',
    accentColor: '#d6a890',
    badgeBg: 'rgba(214, 168, 144, 0.14)',
    previewBg: '#390c17',
    previewBorder: '#cca088',
    previewAccent: '#dcb39e',
    finish: 'wine-gold'
  }
];

export const STICKER_BORDERS = [
  {
    id: 'decorative',
    name: 'Regal Decorative',
    subtitle: 'Dual framing with ornate corner flourishes'
  },
  {
    id: 'double',
    name: 'Elegant Double',
    subtitle: 'Classic parallel dual-line framing'
  },
  {
    id: 'inset',
    name: 'Thin Inset',
    subtitle: 'Outer hairline edge with inset inner frame'
  },
  {
    id: 'single',
    name: 'Fine Single',
    subtitle: 'Crisp, delicate hairline border'
  },
  {
    id: 'stitched',
    name: 'Subtle Stitched',
    subtitle: 'Artisanal dashed border detailing'
  },
  {
    id: 'minimal',
    name: 'Contemporary Minimal',
    subtitle: 'Clean minimalist hairline with corner accents'
  }
];

export const STICKER_SHAPES = [
  {
    id: 'square',
    name: 'Square',
    ratio: '1 / 1',
    aspectLabel: '1:1 Ratio',
    description: 'Equal width & height — ideal for spice jars, square canisters, and cubical containers'
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    ratio: '1.4 / 1',
    aspectLabel: '1.4:1 Wide',
    description: 'Wider proportion — ideal for pantry bins, storage tubs, and mason jars'
  }
];

export const CORNER_STYLES = [
  {
    id: 'rounded',
    name: 'Softly Rounded',
    description: 'Smooth die-cut radius corners',
    radiusSquare: '16px',
    radiusRectangle: '18px'
  },
  {
    id: 'sharp',
    name: 'Sharp Corners',
    description: 'Crisp, classic 90° straight corners',
    radiusSquare: '0px',
    radiusRectangle: '0px'
  }
];

export const TYPOGRAPHY_FONTS = [
  {
    id: 'Playfair Display',
    name: 'Playfair Heritage',
    category: 'Regal Serif',
    description: 'Stately high-contrast serif for luxury packaging',
    fontFamily: "'Playfair Display', 'Noto Serif Devanagari', 'Noto Serif Tamil', 'Noto Serif Telugu', serif"
  },
  {
    id: 'Cinzel',
    name: 'Cinzel Royal Luxury',
    category: 'Classical Monumental',
    description: 'Timeless Roman proportions with royal elegance',
    fontFamily: "'Cinzel', 'Playfair Display', 'Noto Serif', serif"
  },
  {
    id: 'Poppins',
    name: 'Poppins Modern Sans',
    category: 'Clean Geometric',
    description: 'Warm, balanced contemporary sans with superb legibility',
    fontFamily: "'Poppins', 'Noto Sans Devanagari', 'Noto Sans Tamil', sans-serif"
  },
  {
    id: 'Montserrat',
    name: 'Montserrat Sleek',
    category: 'Architectural Sans',
    description: 'Geometric modern sans with bold editorial poise',
    fontFamily: "'Montserrat', 'Poppins', sans-serif"
  },
  {
    id: 'Cormorant Garamond',
    name: 'Garamond Artisanal',
    category: 'Traditional Serif',
    description: 'Delicate fine-press serif inspired by heritage apothecary labels',
    fontFamily: "'Cormorant Garamond', 'Lora', serif"
  },
  {
    id: 'Lora',
    name: 'Lora Editorial',
    category: 'Rooted Serif',
    description: 'Warm, calligraphy-infused serif with organic curves',
    fontFamily: "'Lora', 'Playfair Display', serif"
  }
];

export const LANGUAGES_LIST = [
  { code: 'tamil', name: 'Tamil', native: 'தமிழ்' },
  { code: 'hindi', name: 'Hindi', native: 'हिंदी' },
  { code: 'telugu', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kannada', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'malayalam', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'bengali', name: 'Bengali', native: 'বাংলা' },
  { code: 'marathi', name: 'Marathi', native: 'मराठी' },
  { code: 'gujarati', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'punjabi', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'odia', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'assamese', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'urdu', name: 'Urdu', native: 'اردو' }
];

export const getThemeById = (id) => {
  return STICKER_THEMES.find(t => t.id === id) || STICKER_THEMES[0];
};

export const getBorderById = (id) => {
  return STICKER_BORDERS.find(b => b.id === id) || STICKER_BORDERS[0];
};

export const getShapeById = (id) => {
  return STICKER_SHAPES.find(s => s.id === id) || STICKER_SHAPES[0];
};

export const getCornerById = (id) => {
  return CORNER_STYLES.find(c => c.id === id) || CORNER_STYLES[0];
};

export const getFontById = (id) => {
  return TYPOGRAPHY_FONTS.find(f => f.id === id) || TYPOGRAPHY_FONTS[0];
};
