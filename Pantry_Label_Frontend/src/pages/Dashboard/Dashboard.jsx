import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import CategoryBar from '../../components/CategoryBar/CategoryBar';
import IngredientCard from '../../components/IngredientCard/IngredientCard';
import Loader from '../../components/Loader/Loader';
import useAuth from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import { useDebounce } from '../../hooks/useDebounce';
import { CustomisationContext } from '../../context/CustomisationContext';
import productService from '../../services/productService';
import './Dashboard.css';

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
  const { selectedProductIds, toggleProductSelection, clearSelections } = React.useContext(CustomisationContext);

  // Filter States
  const [states, setStates] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('tamil');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  // Set default state from user profile
  useEffect(() => {
    if (user && user.stateId) {
      setSelectedStateId(user.stateId.toString());
    }
  }, [user]);

  // Fetch initial filters (States & Categories)
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [statesRes, categoriesRes] = await Promise.all([
          productService.getStates(),
          productService.getCategories()
        ]);
        setStates(statesRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        console.error('Failed to fetch dashboard filters:', err);
        setError('Failed to fetch filter options. Please reload page.');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchFilters();
  }, []);

  // Use products hook with state, category, debounced search and selected language
  const { products, loading: productsLoading } = useProducts(
    selectedStateId,
    selectedCategoryId,
    debouncedSearch,
    selectedLanguage
  );

  const handleStateChange = (e) => {
    setSelectedStateId(e.target.value);
    clearSelections();
  };

  const handleProceed = () => {
    if (selectedProductIds.length === 0) return;
    navigate('/customisation');
  };

  if (initialLoading) {
    return <Loader fullPage={true} message="Loading platform dashboard..." />;
  }

  const selectedStateName = states.find(s => s.id.toString() === selectedStateId)?.name || 'All States';

  return (
    <div className="dashboard-page-container">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="dashboard-content">
        <div className="dashboard-filters-row">
          <div className="filter-controls-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="language-selector-wrapper">
              <label htmlFor="dashboard-lang-select">Language:</label>
              <select
                id="dashboard-lang-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="state-dropdown"
              >
                <option value="">Select a Language</option>
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="state-selector-wrapper">
              <label htmlFor="dashboard-state-select">Browsing State:</label>
              <select
                id="dashboard-state-select"
                value={selectedStateId}
                onChange={handleStateChange}
                className="state-dropdown"
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="selections-counter-box">
            Selected: <strong>{selectedProductIds.length}</strong> items
          </div>
        </div>

        {error && <div className="dashboard-error">{error}</div>}

        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />

        <div className="products-grid-section">
          {productsLoading ? (
            <Loader message="Fetching ingredients..." />
          ) : products.length === 0 ? (
            <div className="dashboard-empty-prompt">
              <h3>No ingredients found</h3>
              <p>Try changing your category filters, language option, or search term.</p>
            </div>
          ) : (
            <div className="ingredients-grid">
              {products.map(product => (
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
      </main>

      {selectedProductIds.length > 0 && (
        <div className="dashboard-sticky-dock">
          <div className="dock-container">
            <span>
              You have selected <strong>{selectedProductIds.length}</strong> ingredient label{selectedProductIds.length > 1 ? 's' : ''}.
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
