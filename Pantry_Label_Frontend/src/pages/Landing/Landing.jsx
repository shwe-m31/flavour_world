import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Menu,
  X,
  User,
  Users,
  ChefHat,
  UtensilsCrossed,
  Building2
} from 'lucide-react';
import officialLogo from '../../assets/images/label_logo2.png';
import heroImage from '../../assets/images/image.png';
import './Landing.css';

// 12+ Indian Languages Data (aligned with project's productService and catalog)
const LANGUAGES_DATA = [
  { code: 'tamil', name: 'Tamil', script: 'தமிழ்', exampleName: 'அரிசி', sub: 'பொன்னி அரிசி / Basmati' },
  { code: 'hindi', name: 'Hindi', script: 'हिन्दी', exampleName: 'चावल', sub: 'बासमती चावल / Raw Rice' },
  { code: 'telugu', name: 'Telugu', script: 'తెలుగు', exampleName: 'బియ్యం', sub: 'పచ్చి బియ్యం / Rice' },
  { code: 'kannada', name: 'Kannada', script: 'ಕನ್ನಡ', exampleName: 'ಅಕ್ಕಿ', sub: 'ಪೋನ್ನಿ ಅಕ್ಕಿ / Rice' },
  { code: 'malayalam', name: 'Malayalam', script: 'മലയാളം', exampleName: 'അരി', sub: 'പൊന്നി അരി / Matta Rice' },
  { code: 'bengali', name: 'Bengali', script: 'বাংলা', exampleName: 'চাল', sub: 'বাসমতী চাল / Gobindobhog' },
  { code: 'marathi', name: 'Marathi', script: 'मराठी', exampleName: 'तांदूळ', sub: 'बासमती तांदूळ / Kolam' },
  { code: 'gujarati', name: 'Gujarati', script: 'ગુજરાતી', exampleName: 'ચોખા', sub: 'બાસમતી ચોખા / Rice' },
  { code: 'punjabi', name: 'Punjabi', script: 'ਪੰਜਾਬੀ', exampleName: 'ਚੌਲ', sub: 'ਬਾਸਮਤੀ ਚੌਲ / Rice' },
  { code: 'odia', name: 'Odia', script: 'ଓଡ଼ିଆ', exampleName: 'ଚାଉଳ', sub: 'ବାସମତୀ ଚାଉଳ / Rice' },
  { code: 'assamese', name: 'Assamese', script: 'অসমীয়া', exampleName: 'চাউল', sub: 'বাসমতী চাউল / Joha' },
  { code: 'urdu', name: 'Urdu', script: 'اردو', exampleName: 'چاول', sub: 'باسنتی چاول / Basmati' },
  { code: 'english', name: 'English', script: 'English', exampleName: 'Rice', sub: 'Royal Long Grain Basmati' }
];

// Regional Culinary Profiles
const REGIONAL_KITCHENS = [
  {
    state: 'Tamil Nadu',
    lang: 'Tamil (தமிழ்)',
    desc: 'Deeply aromatic South Indian kitchen essentials centered on sambar spices, tempered lentils, and pure sesame oil.',
    ingredients: ['Ponni Rice', 'Toor Dal', 'Mustard Seeds', 'Curry Leaf Rice Powder', 'Crystal Salt', 'Gingelly Oil']
  },
  {
    state: 'Andhra Pradesh / Telangana',
    lang: 'Telugu (తెలుగు)',
    desc: 'Bold, robust, fiery flavour profiles characterized by Guntur chillies, fragrant gongura spices, and roasted podis.',
    ingredients: ['Sona Masoori', 'Guntur Chilli', 'Fenugreek', 'Tamarind', 'Garlic Podi', 'Urad Dal']
  },
  {
    state: 'Karnataka',
    lang: 'Kannada (ಕನ್ನಡ)',
    desc: 'Nutritious millet staples, signature aromatic bisi bele bath spices, dry coconut copra, and mineral-rich jaggery.',
    ingredients: ['Ragi Flour', 'Bisi Bele Bath Masala', 'Byadgi Chilli', 'Copra', 'Organic Jaggery', 'Chana Dal']
  },
  {
    state: 'Kerala',
    lang: 'Malayalam (മലയാളം)',
    desc: 'Malabar coast treasures driven by pungent whole black peppers, fragrant green cardamoms, and cold-pressed coconut oil.',
    ingredients: ['Matta Rice', 'Tellicherry Black Pepper', 'Green Cardamom', 'Cloves', 'Coconut Oil', 'Curry Leaves']
  },
  {
    state: 'Maharashtra',
    lang: 'Marathi (मराठी)',
    desc: 'Rustic stone-ground hearty flours, artisanal Goda masala blends, crunchy peanuts, and coarse rock salt crystals.',
    ingredients: ['Jowar Atta', 'Goda Masala', 'Groundnuts', 'Cumin Seeds', 'Rock Salt', 'Turmeric']
  },
  {
    state: 'West Bengal',
    lang: 'Bengali (বাংলা)',
    desc: 'Delicate aromatic rice, five-spice panch phoron harmony, pure pungent mustard oil, and velvety poppy seeds.',
    ingredients: ['Gobindobhog Rice', 'Panch Phoron', 'Kachi Ghani Mustard Oil', 'Posto (Poppy)', 'Kalojire']
  }
];

// Audience Profiles (NO EMOJIS)
const AUDIENCE_TYPES = [
  {
    num: '01',
    title: 'Bachelors',
    icon: User,
    desc: 'Simple, fail-proof organization for compact kitchens and shared flats. Instant ingredient recognition that makes quick meals effortless.'
  },
  {
    num: '02',
    title: 'Families',
    icon: Users,
    desc: 'Keep high-traffic pantries completely organized so parents, children, grandparents, and domestic helpers identify ingredients effortlessly.'
  },
  {
    num: '03',
    title: 'Home Cooks',
    icon: ChefHat,
    desc: 'Personalize spice blends, heirloom grains, and specialty baking flours with bespoke typography matching your kitchen styling.'
  },
  {
    num: '04',
    title: 'Restaurants',
    icon: UtensilsCrossed,
    desc: 'Standardize bulk containers, canisters, and prep jars with durable, clear bilingual labeling for seamless staff execution.'
  },
  {
    num: '05',
    title: 'Food Businesses',
    icon: Building2,
    desc: 'Tailor storage solutions for artisan cloud kitchens, bakeries, and packaged culinary goods with uniform container labels.'
  }
];

// Curated Pantry Categories
const INGREDIENT_CATEGORIES = [
  { name: 'Grains & Rice', sub: 'Basmati, Ponni, Sona Masoori, Matta, Millets' },
  { name: 'Flours & Atta', sub: 'Chakki Wheat, Ragi, Rice Flour, Besan, Maida' },
  { name: 'Pulses & Lentils', sub: 'Toor Dal, Urad Dal, Moong Dal, Chana Dal, Rajma' },
  { name: 'Spices & Whole Masalas', sub: 'Mustard Seeds, Cumin, Cardamom, Cloves, Cinnamon' },
  { name: 'Spice Powders & Blends', sub: 'Turmeric, Red Chilli, Coriander, Garam Masala' },
  { name: 'Sweeteners & Salts', sub: 'Demerara Sugar, Jaggery Powder, Crystal Salt, Rock Salt' },
  { name: 'Baking Ingredients', sub: 'Baking Powder, Cocoa, Dry Yeast, Vanilla, Starch' },
  { name: 'Dry Fruits & Nuts', sub: 'Cashews, Almonds, Pistachios, Raisins, Walnuts' },
  { name: 'Oils & Clarified Butter', sub: 'Cold-Pressed Sesame, Coconut Oil, Pure Desi Ghee' }
];

// FAQ Items
const FAQ_ITEMS = [
  {
    q: 'What makes FLAVOUR WORLD different?',
    a: 'FLAVOUR WORLD is India’s first dedicated multilingual pantry labeling platform. Unlike generic stationery tags, our labels combine regional culinary nomenclature with modern typography, ensuring that traditional ingredients are recognized in your native language as well as English.'
  },
  {
    q: 'Which languages are supported?',
    a: 'We currently support 12+ Indian languages including Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia, Assamese, and Urdu, alongside English.'
  },
  {
    q: 'Can I customize my labels?',
    a: 'Yes. You can customize the typography font (Modern Sans, Elegant Serif, Charming Script), outer shape (Rectangle, Rounded, Circle), background theme (Minimal White, Classic Parchment, Floral, Modern Gradient), and dimensions to match your pantry jars.'
  },
  {
    q: 'What ingredients can I select?',
    a: 'You can choose from our comprehensive catalog of 80+ curated Indian kitchen staples spanning grains, flours, lentils, whole spices, curry powders, sweeteners, salts, and baking supplies, or add your own custom ingredient names.'
  },
  {
    q: 'Can I choose the label theme and font?',
    a: 'Yes. You have full control over the visual presentation. You can select between modern clean sans-serif fonts, classic serif fonts, and script handwriting styles, paired with distinct background frames.'
  },
  {
    q: 'Can different users such as bachelors, families and restaurants use the platform?',
    a: 'FLAVOUR WORLD is built for every kitchen scale. Whether you are a bachelor outfitting a compact starter pantry, a bustling family managing dozens of bulk jars, or a commercial kitchen organizing prep stations, our label system scales to your needs.'
  },
  {
    q: 'How do I create an account?',
    a: 'Click "Create Account" at the top of the page. You can register instantly using either Username & Password or Email & OTP verification. Once registered, set up your kitchen preferences and start selecting your labels.'
  }
];

export const Landing = () => {
  // Navigation scroll state
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Multilingual Section State
  const [selectedLang, setSelectedLang] = useState(LANGUAGES_DATA[0]);

  // Label Customizer Mockup Interactive State
  const [customTheme, setCustomTheme] = useState('modern'); // 'classic', 'modern', 'minimal'
  const [customFont, setCustomFont] = useState('sans'); // 'serif', 'sans', 'script'
  const [customColor, setCustomColor] = useState('green'); // 'neutral', 'green', 'warm'
  const [customShape, setCustomShape] = useState('rounded'); // 'rectangle', 'rounded', 'circle'
  const [customSize, setCustomSize] = useState('medium'); // 'small', 'medium', 'large'

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(prev => (prev === index ? -1 : index));
  };

  return (
    <div className="fw-landing-page">
      {/* ==================================================
          1. STICKY HEADER / NAVIGATION
          ================================================== */}
      <header className={`fw-header ${scrolled ? 'fw-header-scrolled' : ''}`}>
        <div className="fw-header-inner">
          <Link to="/" className="fw-brand-link" aria-label="FLAVOUR WORLD Home">
            <img src={officialLogo} alt="FLAVOUR WORLD" className="fw-header-logo" />
            <div>
              <span className="fw-brand-name">FLAVOUR WORLD</span>
              <span className="fw-brand-sub">PANTRY LABELS</span>
            </div>
          </Link>

          <nav className="fw-nav-menu" aria-label="Primary Navigation">
            <a href="#about" className="fw-nav-link">About</a>
            <a href="#features" className="fw-nav-link">Features</a>
            <a href="#languages" className="fw-nav-link">Languages</a>
            <a href="#how-it-works" className="fw-nav-link">How It Works</a>
            <a href="#customization" className="fw-nav-link">Customization</a>
          </nav>

          <div className="fw-header-actions">
            <button
              type="button"
              className="fw-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="fw-mobile-drawer" style={{ display: 'flex' }}>
            <a href="#about" className="fw-nav-link" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#features" className="fw-nav-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#languages" className="fw-nav-link" onClick={() => setMobileMenuOpen(false)}>Languages</a>
            <a href="#how-it-works" className="fw-nav-link" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#customization" className="fw-nav-link" onClick={() => setMobileMenuOpen(false)}>Customization</a>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Link to="/login" className="fw-btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
                Sign In
              </Link>
              <Link to="/register" className="fw-btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                Create Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ==================================================
          2. HERO SECTION (Using image.png as Primary Hero)
          ================================================== */}
      <section className="fw-hero" aria-label="Hero Overview">
        <div className="fw-hero-bg-container">
          <img
            src={heroImage}
            alt="Pantry containers labeled Plain Flour, Brown Sugar, Rice, and Pasta"
            className="fw-hero-img"
          />
        </div>
        <div className="fw-hero-overlay" />

        <div className="fw-hero-content">
          <div className="fw-hero-badge">
            <span className="fw-hero-badge-dot" />
            FLAVOUR WORLD • ARTISANAL PANTRY LABELS
          </div>

          <h1 className="fw-hero-title">
            Your Pantry. Your Language. Your Labels.
          </h1>

          <p className="fw-hero-subheadline">
            Personalized pantry labels designed around your ingredients, language and style.
          </p>

          <p className="fw-hero-description">
            Select your ingredients, choose your preferred language, customize your label and create a pantry that feels uniquely yours.
          </p>

          <div className="fw-hero-cta-group">
            <Link to="/register" className="fw-hero-btn-primary">
              CREATE YOUR ACCOUNT
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="fw-hero-btn-secondary">
              SIGN IN
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================
          3. UNIQUE VALUE PROPOSITION ("More Than Just a Pantry Label")
          ================================================== */}
      <section id="about" className="fw-section">
        <div className="fw-section-header">
          <span className="fw-section-eyebrow">Information Architecture & Identity</span>
          <h2 className="fw-section-title">More Than Just a Pantry Label</h2>
          <p className="fw-section-desc">
            FLAVOUR WORLD brings multilingual ingredient labeling, regional food identity and personal label customization into one simple experience.
          </p>
        </div>

        <div className="fw-uvp-list">
          <div className="fw-uvp-item">
            <span className="fw-uvp-num">01</span>
            <span className="fw-uvp-title">MULTILINGUAL LABELS</span>
            <p className="fw-uvp-text">
              Bridge generational and cultural kitchens with authentic vernacular Indian scripts. Clear, elegant bilingual typography so everyone in your home recognizes every staple container at a single glance.
            </p>
          </div>

          <div className="fw-uvp-item">
            <span className="fw-uvp-num">02</span>
            <span className="fw-uvp-title">REGIONAL FLAVOURS</span>
            <p className="fw-uvp-text">
              Culinary traditions across India call ingredients by distinct regional names. We celebrate state-wise authenticity—from Tamil Nadu’s heirloom rices to West Bengal’s delicate five-spice pantries.
            </p>
          </div>

          <div className="fw-uvp-item">
            <span className="fw-uvp-num">03</span>
            <span className="fw-uvp-title">PERSONALIZED INGREDIENT SELECTION</span>
            <p className="fw-uvp-text">
              Curate only the ingredients you actually stock. Choose from over 80 pantry staples or define custom kitchen blends without purchasing redundant generic pre-printed sticker sheets.
            </p>
          </div>

          <div className="fw-uvp-item">
            <span className="fw-uvp-num">04</span>
            <span className="fw-uvp-title">CUSTOM LABEL DESIGN</span>
            <p className="fw-uvp-text">
              Transform your spice racks and storage jars into an interior design statement. Match typography, border shapes, color tones, and millimeter-precise dimensions to your container dimensions.
            </p>
          </div>

          <div className="fw-uvp-item">
            <span className="fw-uvp-num">05</span>
            <span className="fw-uvp-title">PERSONALIZED PRODUCT EXPERIENCE</span>
            <p className="fw-uvp-text">
              Interactive digital previews let you inspect each label in real time before printing. Produced on premium, waterproof, oil-resistant matte vinyl engineered specifically for kitchen longevity.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          4. MULTILINGUAL LANGUAGES ("Your Ingredients. Your Language.")
          ================================================== */}
      <section id="languages" className="fw-section">
        <div className="fw-multilingual-wrapper">
          <div className="fw-multilingual-header">
            <div>
              <span className="fw-section-eyebrow">Multilingual Kitchen Heritage</span>
              <h2 className="fw-section-title">Your Ingredients. Your Language.</h2>
              <p className="fw-section-desc" style={{ maxWidth: '620px' }}>
                Choose the language that feels natural in your kitchen and create labels that are easy to recognize and personalize.
              </p>
            </div>

            <div className="fw-stat-callout">
              <div className="fw-stat-num">12+</div>
              <div className="fw-stat-label">Indian Languages Configured</div>
            </div>
          </div>

          {/* Interactive Language Selection Pills */}
          <div className="fw-lang-tabs-grid" role="tablist">
            {LANGUAGES_DATA.map((lang) => (
              <button
                key={lang.code}
                type="button"
                role="tab"
                aria-selected={selectedLang.code === lang.code}
                className={`fw-lang-tab-pill ${selectedLang.code === lang.code ? 'active' : ''}`}
                onClick={() => setSelectedLang(lang)}
              >
                <span>{lang.name}</span>
                <span style={{ opacity: 0.8, fontSize: '0.8rem' }}>({lang.script})</span>
              </button>
            ))}
          </div>

          {/* Dynamic Showcase Card */}
          <div className="fw-multilingual-preview-card">
            <div className="fw-label-visual-mockup">
              <span className="fw-mockup-tag">FLAVOUR WORLD • PREVIEW</span>
              <div className="fw-mockup-eng">RICE</div>
              <div className="fw-mockup-vernacular">{selectedLang.exampleName}</div>
              <div className="fw-mockup-divider" />
              <div className="fw-mockup-footer">{selectedLang.sub}</div>
            </div>

            <div className="fw-lang-preview-details">
              <h3>{selectedLang.name} Pantry Edition</h3>
              <p>
                Labels rendered with precision typography tailored for native {selectedLang.name} ({selectedLang.script}) script readability alongside English.
              </p>
              <ul className="fw-lang-features-list">
                <li className="fw-lang-feature-item">
                  <span className="fw-check-icon"><Check size={14} /></span>
                  Authentic vernacular naming validated by regional culinary conventions
                </li>
                <li className="fw-lang-feature-item">
                  <span className="fw-check-icon"><Check size={14} /></span>
                  Bilingual clarity for household assistants, guests, and family members
                </li>
                <li className="fw-lang-feature-item">
                  <span className="fw-check-icon"><Check size={14} /></span>
                  High-contrast typography readable through glass container jars
                </li>
                <li className="fw-lang-feature-item">
                  <span className="fw-check-icon"><Check size={14} /></span>
                  Synchronized with our master database of 80+ pantry ingredients
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          5. REGIONAL FLAVOURS ("Labels Inspired by Regional Kitchens")
          ================================================== */}
      <section className="fw-section">
        <div className="fw-section-header">
          <span className="fw-section-eyebrow">Culinary Identity</span>
          <h2 className="fw-section-title">Labels Inspired by Regional Kitchens</h2>
          <p className="fw-section-desc">
            Pantry terminology and spice blends reflect diverse regional traditions across India. Choose your home culinary state to tailor your labels effortlessly.
          </p>
        </div>

        <div className="fw-regional-grid">
          {REGIONAL_KITCHENS.map((rk, idx) => (
            <div key={idx} className="fw-regional-card">
              <div>
                <h3 className="fw-regional-state">{rk.state}</h3>
                <span className="fw-regional-lang-tag">{rk.lang}</span>
                <p className="fw-regional-desc">{rk.desc}</p>
              </div>

              <div>
                <div className="fw-regional-ingredients-title">Specialty Ingredients</div>
                <div className="fw-regional-pills">
                  {rk.ingredients.map((ing, i) => (
                    <span key={i} className="fw-ingredient-pill">{ing}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          6. AUDIENCE / WHO IT'S FOR ("Designed for Different Kitchens")
          ================================================== */}
      <section className="fw-section">
        <div className="fw-section-header">
          <span className="fw-section-eyebrow">Versatile Applications</span>
          <h2 className="fw-section-title">Designed for Different Kitchens</h2>
          <p className="fw-section-desc">
            Whether organizing a compact bachelor flat or standardizing a busy commercial kitchen, FLAVOUR WORLD adapts to your storage workflow.
          </p>
        </div>

        <div className="fw-audience-grid">
          {AUDIENCE_TYPES.map((aud) => {
            const IconComp = aud.icon;
            return (
              <div key={aud.num} className="fw-audience-card">
                <span className="fw-audience-num">{aud.num}</span>
                <div className="fw-audience-icon-wrapper">
                  <IconComp size={24} />
                </div>
                <h3 className="fw-audience-title">{aud.title}</h3>
                <p className="fw-audience-desc">{aud.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================
          7. INGREDIENT SELECTION ("Start With What You Actually Use")
          ================================================== */}
      <section id="features" className="fw-section">
        <div className="fw-ingredient-section">
          <div className="fw-section-header" style={{ textAlign: 'center', margin: '0 auto 3rem auto' }}>
            <span className="fw-section-eyebrow">Tailored Curation</span>
            <h2 className="fw-section-title">Start With What You Actually Use</h2>
            <p className="fw-section-desc">
              Choose from the available pantry ingredients and build a label collection around your own kitchen.
            </p>
          </div>

          <div className="fw-category-grid">
            {INGREDIENT_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="fw-category-card">
                <div className="fw-category-name">{cat.name}</div>
                <div className="fw-category-sub">{cat.sub}</div>
              </div>
            ))}
          </div>

          <div className="fw-ingredient-cta-box">
            <h3>Ready to explore all 80+ pantry ingredients?</h3>
            <p>Access our comprehensive categorized ingredient directory with bilingual translations and fixed pricing.</p>
            <Link to="/login" className="fw-btn-primary">
              Explore Ingredients
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================
          8. LABEL / PRODUCT OPTIONS ("Find Labels That Fit Your Pantry")
          ================================================== */}
      <section className="fw-section">
        <div className="fw-section-header">
          <span className="fw-section-eyebrow">Product Collection</span>
          <h2 className="fw-section-title">Find Labels That Fit Your Pantry</h2>
          <p className="fw-section-desc">
            Explore durable label formats created specifically to withstand grease, moisture, and kitchen wear.
          </p>
        </div>

        <div className="fw-options-grid">
          <div className="fw-option-card">
            <div className="fw-option-sample">
              <div style={{ padding: '12px 24px', border: '2px solid #10b981', borderRadius: '30px', background: '#fff', textAlign: 'center' }}>
                <strong style={{ display: 'block', fontSize: '1.1rem' }}>RICE LABEL</strong>
                <span style={{ fontSize: '0.8rem', color: '#059669' }}>அரிசி • Oval Classic</span>
              </div>
            </div>
            <span className="fw-option-tag">Staples & Grains</span>
            <h3 className="fw-option-title">Rice & Grain Labels</h3>
            <p className="fw-option-desc">
              Wide format labels optimized for large 2L–5L canisters, clear glass jars, and airtight bins.
            </p>
          </div>

          <div className="fw-option-card">
            <div className="fw-option-sample">
              <div style={{ padding: '10px 18px', border: '1.5px solid #111827', borderRadius: '12px', background: '#fff', textAlign: 'center' }}>
                <strong style={{ display: 'block', fontSize: '1rem' }}>SPICE LABEL</strong>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>हल्दी • Rounded Square</span>
              </div>
            </div>
            <span className="fw-option-tag">Spice Racks</span>
            <h3 className="fw-option-title">Spice & Masala Labels</h3>
            <p className="fw-option-desc">
              Compact dimensions engineered for spice racks, masala dabbas, and mini cylindrical shakers.
            </p>
          </div>

          <div className="fw-option-card">
            <div className="fw-option-sample">
              <div style={{ padding: '14px 28px', border: '1.5px solid #d97706', borderRadius: '8px', background: '#fffdfa', textAlign: 'center' }}>
                <strong style={{ display: 'block', fontSize: '1.1rem' }}>FLOUR LABEL</strong>
                <span style={{ fontSize: '0.8rem', color: '#b45309' }}>Atta • Minimal Rectangle</span>
              </div>
            </div>
            <span className="fw-option-tag">Baking & Flours</span>
            <h3 className="fw-option-title">Flour & Atta Labels</h3>
            <p className="fw-option-desc">
              Large prominent labels providing instant distinction between whole wheat, maida, and specialty flours.
            </p>
          </div>

          <div className="fw-option-card">
            <div className="fw-option-sample">
              <div style={{ padding: '12px 20px', border: '2px dashed #10b981', borderRadius: '16px', background: '#fff', textAlign: 'center' }}>
                <strong style={{ display: 'block', fontSize: '1rem' }}>SUGAR LABEL</strong>
                <span style={{ fontSize: '0.75rem', color: '#059669' }}>Demerara • Artisanal</span>
              </div>
            </div>
            <span className="fw-option-tag">Sweeteners</span>
            <h3 className="fw-option-title">Sugar & Sweetener Labels</h3>
            <p className="fw-option-desc">
              Clearly differentiate brown sugar, organic jaggery powder, white sugar, and honey canisters.
            </p>
          </div>

          <div className="fw-option-card">
            <div className="fw-option-sample">
              <div style={{ padding: '12px 22px', border: '2px solid #6366f1', borderRadius: '20px', background: '#fff', textAlign: 'center' }}>
                <strong style={{ display: 'block', fontSize: '1rem' }}>CUSTOM LABEL</strong>
                <span style={{ fontSize: '0.75rem', color: '#4f46e5' }}>Personalized Nomenclature</span>
              </div>
            </div>
            <span className="fw-option-tag">Specialty Pantry</span>
            <h3 className="fw-option-title">Custom Ingredient Labels</h3>
            <p className="fw-option-desc">
              Type custom ingredient titles, grandmother’s spice blend recipes, and bespoke pantry items.
            </p>
          </div>

          <div className="fw-option-card">
            <div className="fw-option-sample">
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ padding: '6px 12px', background: '#f0fdf4', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#15803d' }}>Waterproof</span>
                <span style={{ padding: '6px 12px', background: '#f0fdf4', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#15803d' }}>Oil-Resistant</span>
              </div>
            </div>
            <span className="fw-option-tag">Materials</span>
            <h3 className="fw-option-title">Premium Matte Vinyl</h3>
            <p className="fw-option-desc">
              Printed on high-durability waterproof vinyl with peel-and-stick backing that removes cleanly without adhesive residue.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          9. LABEL CUSTOMIZATION ("Make Every Label Your Own")
          ================================================== */}
      <section id="customization" className="fw-section">
        <div className="fw-section-header">
          <span className="fw-section-eyebrow">Interactive Studio Preview</span>
          <h2 className="fw-section-title">Make Every Label Your Own</h2>
          <p className="fw-section-desc">
            Customize your labels to match your kitchen, container style and personal preference. Try the live preview controls below.
          </p>
        </div>

        <div className="fw-customizer-wrapper">
          {/* Controls Column */}
          <div className="fw-customizer-controls">
            <div className="fw-control-group">
              <span className="fw-control-label">Theme</span>
              <div className="fw-btn-pills-row">
                {['classic', 'modern', 'minimal'].map((th) => (
                  <button
                    key={th}
                    type="button"
                    className={`fw-pill-btn ${customTheme === th ? 'active' : ''}`}
                    onClick={() => setCustomTheme(th)}
                  >
                    {th.charAt(0).toUpperCase() + th.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="fw-control-group">
              <span className="fw-control-label">Typography Font</span>
              <div className="fw-btn-pills-row">
                {[
                  { id: 'serif', label: 'Serif (Playfair)' },
                  { id: 'sans', label: 'Sans (Poppins)' },
                  { id: 'script', label: 'Script (Artisan)' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`fw-pill-btn ${customFont === f.id ? 'active' : ''}`}
                    onClick={() => setCustomFont(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="fw-control-group">
              <span className="fw-control-label">Color Palette</span>
              <div className="fw-btn-pills-row">
                {[
                  { id: 'neutral', label: 'Neutral Charcoal' },
                  { id: 'green', label: 'Fresh Green' },
                  { id: 'warm', label: 'Warm Amber' }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`fw-pill-btn ${customColor === c.id ? 'active' : ''}`}
                    onClick={() => setCustomColor(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="fw-control-group">
              <span className="fw-control-label">Label Shape</span>
              <div className="fw-btn-pills-row">
                {[
                  { id: 'rectangle', label: 'Rectangle' },
                  { id: 'rounded', label: 'Rounded Edge' },
                  { id: 'circle', label: 'Circle' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`fw-pill-btn ${customShape === s.id ? 'active' : ''}`}
                    onClick={() => setCustomShape(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="fw-control-group">
              <span className="fw-control-label">Physical Size</span>
              <div className="fw-btn-pills-row">
                {[
                  { id: 'small', label: 'Small (50mm)' },
                  { id: 'medium', label: 'Medium (75mm)' },
                  { id: 'large', label: 'Large (100mm)' }
                ].map((sz) => (
                  <button
                    key={sz.id}
                    type="button"
                    className={`fw-pill-btn ${customSize === sz.id ? 'active' : ''}`}
                    onClick={() => setCustomSize(sz.id)}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Updating Sticker Stage */}
          <div className="fw-sticker-stage">
            <div
              className={`fw-live-sticker fw-shape-${customShape} fw-theme-${customTheme} fw-font-${customFont} fw-color-${customColor}`}
              style={{
                transform: customSize === 'small' ? 'scale(0.88)' : customSize === 'large' ? 'scale(1.12)' : 'scale(1)'
              }}
            >
              <div className="fw-sticker-brand">FLAVOUR WORLD</div>
              <div className="fw-sticker-title">RICE</div>
              <div className="fw-sticker-native">அரிசி</div>
              <div className="fw-sticker-sub">Royal Aged Basmati • 100% Pure</div>
            </div>

            <p className="fw-stage-caption">
              Live Mockup Preview: {customTheme.toUpperCase()} • {customFont.toUpperCase()} • {customShape.toUpperCase()} ({customSize.toUpperCase()})
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          10. HOW IT WORKS ("From Ingredient to Finished Label")
          ================================================== */}
      <section id="how-it-works" className="fw-section">
        <div className="fw-section-header">
          <span className="fw-section-eyebrow">Seamless Workflow</span>
          <h2 className="fw-section-title">From Ingredient to Finished Label</h2>
          <p className="fw-section-desc">
            A simple, transparent 6-step journey from creating your profile to receiving your custom pantry stickers.
          </p>
        </div>

        <div className="fw-workflow-track">
          <div className="fw-workflow-step">
            <div className="fw-step-indicator">01</div>
            <h3 className="fw-step-title">Create Your Account</h3>
            <p className="fw-step-desc">Register with your email or username in under 30 seconds.</p>
          </div>

          <div className="fw-workflow-step">
            <div className="fw-step-indicator">02</div>
            <h3 className="fw-step-title">Set Up Your Profile</h3>
            <p className="fw-step-desc">Choose your home kitchen type and regional culinary preferences.</p>
          </div>

          <div className="fw-workflow-step">
            <div className="fw-step-indicator">03</div>
            <h3 className="fw-step-title">Select Ingredients</h3>
            <p className="fw-step-desc">Pick only the ingredients you actually stock in your home pantry.</p>
          </div>

          <div className="fw-workflow-step">
            <div className="fw-step-indicator">04</div>
            <h3 className="fw-step-title">Choose Your Language</h3>
            <p className="fw-step-desc">Select your preferred vernacular Indian script for bilingual recognition.</p>
          </div>

          <div className="fw-workflow-step">
            <div className="fw-step-indicator">05</div>
            <h3 className="fw-step-title">Customize Your Label</h3>
            <p className="fw-step-desc">Tailor font, shape, theme colors, and physical sticker sizes.</p>
          </div>

          <div className="fw-workflow-step">
            <div className="fw-step-indicator">06</div>
            <h3 className="fw-step-title">Preview and Order</h3>
            <p className="fw-step-desc">Review your stickers, verify the print proofs, and complete checkout.</p>
          </div>
        </div>
      </section>

      {/* ==================================================
          11. ACCOUNT ENTRY SECTION
          ================================================== */}
      <section className="fw-section" style={{ paddingBottom: '2rem' }}>
        <div className="fw-account-cta-section">
          <div className="fw-account-cta-content">
            <h2 className="fw-account-cta-title">Ready to Organize Your Pantry?</h2>
            <p className="fw-account-cta-desc">
              Create your account and start building personalized multilingual pantry labels.
            </p>
            <div className="fw-hero-cta-group">
              <Link to="/register" className="fw-btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}>
                CREATE NEW ACCOUNT
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="fw-btn-secondary" style={{ padding: '0.9rem 2.2rem', fontSize: '1rem', background: '#fff' }}>
                SIGN IN
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          12. FAQ ACCORDION SECTION
          ================================================== */}
      <section className="fw-section">
        <div className="fw-section-header" style={{ textAlign: 'center', margin: '0 auto 3.5rem auto' }}>
          <span className="fw-section-eyebrow">Clear Answers</span>
          <h2 className="fw-section-title">Frequently Asked Questions</h2>
          <p className="fw-section-desc">
            Everything you need to know about our multilingual labels, materials, and customization.
          </p>
        </div>

        <div className="fw-faq-container">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className={`fw-faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="fw-faq-question-btn"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <span className="fw-faq-icon">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>
                {isOpen && (
                  <div className="fw-faq-answer">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================
          13. FINAL CTA SECTION
          ================================================== */}
      <section className="fw-final-cta">
        <div className="fw-final-cta-content">
          <h2 className="fw-final-cta-title">Bring Your Pantry Together.</h2>
          <p className="fw-final-cta-desc">
            Choose your ingredients, personalize your labels and organize your kitchen your way.
          </p>
          <div className="fw-hero-cta-group">
            <Link to="/register" className="fw-hero-btn-primary" style={{ padding: '1rem 2.5rem' }}>
              CREATE NEW ACCOUNT
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="fw-hero-btn-secondary" style={{ padding: '1rem 2.2rem' }}>
              SIGN IN
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================
          14. FOOTER
          ================================================== */}
      <footer className="fw-footer">
        <div className="fw-footer-inner">
          <div className="fw-footer-brand-col">
            <div className="fw-footer-logo-row">
              <img src={officialLogo} alt="FLAVOUR WORLD" className="fw-footer-logo" />
              <span className="fw-footer-brand-title">FLAVOUR WORLD</span>
            </div>
            <p className="fw-footer-desc">
              Personalized multilingual pantry labels for organized kitchens.
            </p>
          </div>

          <div className="fw-footer-links-col">
            <span className="fw-footer-links-title">Navigation</span>
            <a href="#about" className="fw-footer-link">Home</a>
            <a href="#features" className="fw-footer-link">Features</a>
            <a href="#languages" className="fw-footer-link">Languages</a>
            <a href="#customization" className="fw-footer-link">Customization</a>
            <a href="#how-it-works" className="fw-footer-link">How It Works</a>
          </div>

          <div className="fw-footer-links-col">
            <span className="fw-footer-links-title">Get Started</span>
            <Link to="/login" className="fw-footer-link">Sign In</Link>
            <Link to="/register" className="fw-footer-link">Create Account</Link>
            <Link to="/profile-setup" className="fw-footer-link">Profile Setup</Link>
            <Link to="/dashboard" className="fw-footer-link">Ingredient Dashboard</Link>
          </div>
        </div>

        <div className="fw-footer-bottom">
          <span>&copy; {new Date().getFullYear()} FLAVOUR WORLD. All rights reserved.</span>
          <span>Crafted for organized, beautiful Indian kitchens.</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
