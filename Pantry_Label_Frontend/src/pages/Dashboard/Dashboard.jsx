import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles, Utensils, Users, Home, Building, ChefHat, Leaf, Drumstick, RotateCcw, X, UtensilsCrossed } from 'lucide-react';
import Header from '../../components/Header/Header';
import CategoryBar from '../../components/CategoryBar/CategoryBar';
import IngredientCard from '../../components/IngredientCard/IngredientCard';
import Loader from '../../components/Loader/Loader';
import useAuth from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import { useDebounce } from '../../hooks/useDebounce';
import { CustomisationContext } from '../../context/CustomisationContext';
import productService from '../../services/productService';
import { INDIAN_STATES, getIndianStateById } from '../../data/indianStates';
import { getRecommendedProductIds } from '../../services/recommendationService';
import './Dashboard.css';

const CONSUMER_CATEGORIES = [
  { id: 'Bachelor', label: 'Bachelor', desc: 'Single / Student', icon: Utensils },
  { id: 'Couple', label: 'Couple', desc: '2 Persons', icon: Users },
  { id: 'Family', label: 'Family', desc: 'Standard Home', icon: Home },
  { id: 'Joint Family', label: 'Joint Family', desc: 'Large Household', icon: Building },
  { id: 'Restaurant', label: 'Restaurant', desc: 'Commercial Kitchen', icon: ChefHat }
];

const LANGUAGES = [
  { code: 'tamil', name: 'Tamil (தமிழ்)' },
  { code: 'hindi', name: 'Hindi (हिंदी)' },
  { code: 'telugu', name: 'Telugu (తెలుగు)' },
  { code: 'kannada', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'malayalam', name: 'Malayalam (മലയാളം)' },
  { code: 'bengali', name: 'Bengali (বাংলা)' },
  { code: 'marathi', name: 'Marathi (मराठी)' },
  { code: 'gujarati', name: 'Gujarati (ગુજરાતી)' },
  { code: 'punjabi', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'odia', name: 'Odia (ଓଡ଼ିଆ)' },
  { code: 'assamese', name: 'Assamese (অসমীয়া)' },
  { code: 'urdu', name: 'Urdu (اردو)' }
];

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Customisation Context
  const {
    selectedProductIds,
    setSelectedProductIds,
    toggleProductSelection,
    consumerCategory,
    setConsumerCategory,
    selectedStateId,
    setSelectedStateId,
    cookingPreference,
    setCookingPreference,
    sheetQuantity,
    setSheetQuantity,
    selectedShape,
    handleSetShape,
    selectedLanguage = 'tamil',
    setSelectedLanguage
  } = useContext(CustomisationContext);

  // Filter States
  const [states, setStates] = useState(INDIAN_STATES);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 350);

  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch initial filters (States & Categories)
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [statesRes, categoriesRes] = await Promise.all([
          productService.getStates(),
          productService.getCategories()
        ]);
        if (statesRes.data && statesRes.data.length > 0) {
          setStates(statesRes.data);
        }
        setCategories(categoriesRes.data || []);
      } catch (err) {
        console.error('Failed to fetch dashboard filters:', err);
        setError('Using offline culinary catalog for 36 states and regions.');
        setStates(INDIAN_STATES);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchFilters();
  }, []);

  // Sync user state on first login if context state is still default
  useEffect(() => {
    if (user && user.stateId && (!selectedStateId || selectedStateId === '4')) {
      setSelectedStateId(String(user.stateId));
    }
  }, [user, selectedStateId, setSelectedStateId]);

  // Use products hook with state, category, debounced search and selected language
  const { products, loading: productsLoading } = useProducts(
    selectedStateId,
    selectedCategoryId,
    debouncedSearch,
    selectedLanguage
  );

  // Full product catalog for recommendations
  const allProducts = useMemo(() => {
    return productService.getAllProductsSync();
  }, []);

  // Compute recommended 30 items
  const applyRecommendedSelections = useCallback((categoryVal, stateVal, dietVal) => {
    if (!allProducts || allProducts.length === 0) return;
    const recommendedIds = getRecommendedProductIds(
      categoryVal,
      stateVal,
      dietVal,
      allProducts,
      30
    );
    setSelectedProductIds(recommendedIds);
  }, [allProducts, setSelectedProductIds]);

  // Auto-select 30 items on initial mount if none selected
  useEffect(() => {
    if (allProducts && allProducts.length > 0 && selectedProductIds.length === 0) {
      applyRecommendedSelections(consumerCategory, selectedStateId, cookingPreference);
    }
  }, [allProducts, selectedProductIds.length, applyRecommendedSelections, consumerCategory, selectedStateId, cookingPreference]);

  // Handle Persona Change
  const handleCategorySelect = (categoryId) => {
    setConsumerCategory(categoryId);
    applyRecommendedSelections(categoryId, selectedStateId, cookingPreference);
  };

  // Handle State Change
  const handleStateChange = (e) => {
    const newStateId = e.target.value;
    setSelectedStateId(newStateId);

    // Auto-align default language to state if supported
    const stateObj = getIndianStateById(newStateId);
    if (stateObj && stateObj.langCode) {
      setSelectedLanguage(stateObj.langCode);
    }

    applyRecommendedSelections(consumerCategory, newStateId, cookingPreference);
  };

  // Handle Cooking Preference Change
  const handlePreferenceChange = (pref) => {
    setCookingPreference(pref);
    applyRecommendedSelections(consumerCategory, selectedStateId, pref);
  };

  // Handle Shape Change (Square 35 / Rectangle 40)
  const handleShapeToggle = (shape) => {
    handleSetShape(shape);
  };

  // Handle Container Quantity Change
  const handleQuantitySelect = (qty) => {
    setSheetQuantity(qty);
  };

  // Reset to 30 Recommended Items
  const handleResetRecommendations = () => {
    applyRecommendedSelections(consumerCategory, selectedStateId, cookingPreference);
  };

  const handleProceed = () => {
    if (selectedProductIds.length === 0) {
      alert('Please select at least one ingredient label before proceeding.');
      return;
    }
    navigate('/customisation');
  };

  const currentStateObj = useMemo(() => {
    return getIndianStateById(selectedStateId) || INDIAN_STATES[3];
  }, [selectedStateId]);

  // Available container quantities based on shape
  const quantityOptions = useMemo(() => {
    if (selectedShape === 'rectangle') {
      return [40, 80, 120, 160];
    }
    return [35, 70, 105, 140];
  }, [selectedShape]);

  if (initialLoading) {
    return <Loader fullPage={true} message="Loading platform dashboard..." />;
  }

  const selectedCount = selectedProductIds.length;
  const progressPercent = Math.min(100, Math.round((selectedCount / sheetQuantity) * 100));

  return (
    <div className="dashboard-page-container">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Content Area */}
      <main className="dashboard-content">
        {error && <div className="dashboard-error">{error}</div>}

        {/* 4-Step Selection Flow based on Reference Image 3 */}
        <div className="dashboard-setup-grid">
          {/* STEP 1: I AM (Consumer Category) */}
          <section className="setup-step-card step-iam">
            <div className="step-header">
              <span className="step-number">1</span>
              <div>
                <h3 className="step-title">I am</h3>
                <p className="step-subtitle">Choose who you are setting up the kitchen for</p>
              </div>
            </div>

            <div className="persona-cards-row">
              {CONSUMER_CATEGORIES.map((cat) => {
                const isSelected = consumerCategory === cat.id;
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`persona-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(cat.id)}
                    aria-pressed={isSelected}
                  >
                    <div className="persona-icon-circle">
                      <IconComponent size={20} />
                    </div>
                    <span className="persona-title">{cat.label}</span>
                    <span className="persona-desc">{cat.desc}</span>
                    {isSelected && (
                      <span className="persona-check-badge">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 2: SELECT YOUR STATE */}
          <section className="setup-step-card step-state">
            <div className="step-header">
              <span className="step-number">2</span>
              <div>
                <h3 className="step-title">Select Your State</h3>
                <p className="step-subtitle">We will suggest popular pantry items in your state</p>
              </div>
            </div>

            <div className="state-selection-box">
              <div className="state-dropdown-wrapper">
                <select
                  id="dashboard-state-select"
                  value={selectedStateId}
                  onChange={handleStateChange}
                  className="state-select-dropdown"
                >
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.type === 'Union Territory' ? '(UT)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* State Metadata Card */}
              <div className="state-info-badge-card">
                <div className="state-meta-item">
                  <span className="meta-label">Language:</span>
                  <strong className="meta-value">{currentStateObj.language || 'Regional'}</strong>
                </div>
                <div className="state-meta-item">
                  <span className="meta-label">Popular Cuisine:</span>
                  <strong className="meta-value">{currentStateObj.cuisine || 'Traditional'}</strong>
                </div>
                <div className="state-meta-item">
                  <span className="meta-label">Top Ingredients:</span>
                  <span className="meta-ingredients">{currentStateObj.topIngredients || 'Pantry Staples'}</span>
                </div>
              </div>
            </div>
          </section>

          {/* STEP 3: COOKING PREFERENCE */}
          <section className="setup-step-card step-preference">
            <div className="step-header">
              <span className="step-number">3</span>
              <div>
                <h3 className="step-title">Cooking Preference</h3>
                <p className="step-subtitle">Helps us suggest better items for you</p>
              </div>
            </div>

            <div className="preference-pills-row">
              <button
                type="button"
                className={`preference-pill ${cookingPreference === 'Vegetarian' ? 'active' : ''}`}
                onClick={() => handlePreferenceChange('Vegetarian')}
              >
                <span className="pref-icon-leaf">
                  <Leaf size={16} />
                </span>
                <span className="pref-text">Vegetarian</span>
                {cookingPreference === 'Vegetarian' && <Check size={14} className="pref-check" />}
              </button>

              <button
                type="button"
                className={`preference-pill ${cookingPreference === 'Non-Vegetarian' ? 'active' : ''}`}
                onClick={() => handlePreferenceChange('Non-Vegetarian')}
              >
                <span className="pref-icon-meat">
                  <Drumstick size={16} />
                </span>
                <span className="pref-text">Non-Vegetarian</span>
                {cookingPreference === 'Non-Vegetarian' && <Check size={14} className="pref-check" />}
              </button>

              <button
                type="button"
                className={`preference-pill ${cookingPreference === 'Both' ? 'active' : ''}`}
                onClick={() => handlePreferenceChange('Both')}
              >
                <span className="pref-icon-both" style={{ display: 'flex', alignItems: 'center' }}>
                  <UtensilsCrossed size={16} />
                </span>
                <span className="pref-text">Both</span>
                {cookingPreference === 'Both' && <Check size={14} className="pref-check" />}
              </button>
            </div>
            <span className="pref-hint">You can change this later if needed.</span>
          </section>

          {/* STEP 4: CONTAINER QUANTITY & SHAPE */}
          <section className="setup-step-card step-containers">
            <div className="step-header">
              <span className="step-number">4</span>
              <div>
                <h3 className="step-title">How many containers do you have?</h3>
                <p className="step-subtitle">Choose label shape and sheet capacity</p>
              </div>
            </div>

            {/* Shape Switcher inline */}
            <div className="shape-switcher-row">
              <span className="shape-switch-label">Label Shape:</span>
              <div className="shape-switch-btns">
                <button
                  type="button"
                  className={`shape-btn ${selectedShape === 'square' ? 'active' : ''}`}
                  onClick={() => handleShapeToggle('square')}
                >
                  Square (5×7 Sheet)
                </button>
                <button
                  type="button"
                  className={`shape-btn ${selectedShape === 'rectangle' ? 'active' : ''}`}
                  onClick={() => handleShapeToggle('rectangle')}
                >
                  Rectangle (5×8 Sheet)
                </button>
              </div>
            </div>

            <div className="quantity-buttons-row">
              {quantityOptions.map((qty) => {
                const isSelected = sheetQuantity === qty;
                return (
                  <button
                    key={qty}
                    type="button"
                    className={`quantity-pill-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleQuantitySelect(qty)}
                  >
                    <span>{qty} Labels</span>
                    {isSelected && <Check size={12} />}
                  </button>
                );
              })}
            </div>

            <div className="container-suggestion-callout">
              <Sparkles size={16} className="callout-sparkle" />
              <span>
                <strong>Great!</strong> We auto-selected <strong>30 staple labels</strong> for your kitchen.
                Sheet capacity: <strong>{sheetQuantity} labels</strong> ({selectedShape === 'square' ? '35/sheet' : '40/sheet'}).
              </span>
            </div>
          </section>
        </div>

        {/* STEP 5: SELECT / UNSELECT ITEMS (Main Grid) */}
        <section className="setup-step-card step-ingredients-section">
          <div className="ingredients-section-header">
            <div className="step-header">
              <span className="step-number">5</span>
              <div>
                <h3 className="step-title">Select / Unselect Items</h3>
                <p className="step-subtitle">
                  We have auto-selected 30 items for you. You can unselect or add more.
                </p>
              </div>
            </div>

            <div className="header-actions-group">
              {/* Reset to 30 Defaults */}
              <button
                type="button"
                className="reset-recommended-btn"
                onClick={handleResetRecommendations}
                title="Restore default 30 recommended ingredients"
              >
                <RotateCcw size={14} />
                <span>Reset to 30 Defaults</span>
              </button>

              {/* Language Switcher */}
              <div className="lang-picker-wrapper">
                <label htmlFor="dashboard-lang-select">Script:</label>
                <select
                  id="dashboard-lang-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="lang-select-dropdown"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Counter Badge */}
              <div className="items-counter-badge">
                Selected: <strong>{selectedCount}</strong> / {sheetQuantity}
              </div>
            </div>
          </div>

          {/* Top Selected Ingredients Tray (Req 4) */}
          <div className="selected-ingredients-tray">
            <div className="tray-header">
              <div className="tray-title-badge">
                <span className="tray-count-text">{selectedCount} Selected</span>
                <span className="tray-capacity-info">
                  ({selectedCount} / {sheetQuantity} labels • {selectedShape === 'square' ? '35/sheet' : '40/sheet'})
                </span>
              </div>
              {selectedCount > 0 && (
                <button
                  type="button"
                  className="tray-clear-btn"
                  onClick={() => setSelectedProductIds([])}
                >
                  Clear All
                </button>
              )}
            </div>

            {selectedCount === 0 ? (
              <p className="tray-empty-text">
                No ingredients selected yet. Click any ingredient card below to add to your label sheet.
              </p>
            ) : (
              <div className="tray-chips-scroll">
                {selectedProductIds.map((id) => {
                  const item = allProducts.find((p) => p.id === id) || products.find((p) => p.id === id);
                  if (!item) return null;
                  const displayName = item.bilingualName && item.bilingualName !== item.name
                    ? `${item.bilingualName} (${item.name})`
                    : item.name;
                  return (
                    <div key={id} className="selected-tray-chip">
                      <span className="chip-name">{displayName}</span>
                      <button
                        type="button"
                        className="chip-remove-btn"
                        onClick={() => toggleProductSelection(id)}
                        aria-label={`Remove ${item.name}`}
                        title={`Remove ${item.name}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Category Filter Pills Bar */}
          <CategoryBar
            categories={categories}
            selectedCategory={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />

          {/* Main Layout: Products Grid (Full-width without sidebar, Req 5) */}
          <div className="dashboard-main-grid-layout full-width">
            <div className="products-grid-column">
              {productsLoading ? (
                <Loader message="Fetching regional pantry ingredients..." />
              ) : products.length === 0 ? (
                <div className="dashboard-empty-prompt">
                  <h3>No ingredients found</h3>
                  <p>Try clearing category filters or searching for another spice or grain.</p>
                </div>
              ) : (
                <div className="ingredients-grid">
                  {products.map((product) => (
                    <IngredientCard
                      key={product.id}
                      ingredient={product}
                      isChecked={selectedProductIds.includes(product.id)}
                      onToggle={toggleProductSelection}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Bottom Dock on Mobile/Tablet */}
      {selectedCount > 0 && (
        <div className="dashboard-sticky-dock">
          <div className="dock-container">
            <span>
              Selected <strong>{selectedCount}</strong> / {sheetQuantity} ingredients ({selectedShape} sheet).
            </span>
            <button className="dock-proceed-btn" onClick={handleProceed}>
              Customize Appearance & Proceed →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
