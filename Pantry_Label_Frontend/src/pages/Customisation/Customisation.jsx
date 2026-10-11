import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../../components/Header/Header';
import Loader from '../../components/Loader/Loader';
import FeaturesTab from './FeaturesTab/FeaturesTab';
import LivePreviewTab from './LivePreviewTab/LivePreviewTab';
import SummaryTab from './SummaryTab/SummaryTab';
import { CustomisationContext } from '../../context/CustomisationContext';
import useAuth from '../../hooks/useAuth';
import productService from '../../services/productService';
import './Customisation.css';

export const Customisation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { selectedProductIds, selectedLanguage } = useContext(CustomisationContext);
  const [selectedProductsList, setSelectedProductsList] = useState([]);
  
  const [activeTab, setActiveTab] = useState('features'); // features, preview, summary
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect to dashboard if no products are selected
  useEffect(() => {
    if (selectedProductIds.length === 0) {
      navigate('/dashboard');
    }
  }, [selectedProductIds, navigate]);

  // Fetch full product details for selected product IDs
  useEffect(() => {
    const fetchSelectedProductsDetails = async () => {
      if (selectedProductIds.length === 0) {
        setSelectedProductsList([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError('');
      try {
        const lang = selectedLanguage || 'tamil';
        const response = await productService.getProducts(user?.stateId || null, null, '', lang);
        const allProducts = response?.data && response.data.length > 0
          ? response.data
          : productService.getAllProductsSync();
        
        // Preserve selection order and map to complete product objects
        const matched = selectedProductIds.map(id => {
          return allProducts.find(p => p.id === Number(id));
        }).filter(Boolean);
        
        setSelectedProductsList(matched);
      } catch (err) {
        console.error('Failed to load selected ingredients details:', err);
        const fallbackAll = productService.getAllProductsSync();
        const matched = selectedProductIds.map(id => {
          return fallbackAll.find(p => p.id === Number(id));
        }).filter(Boolean);
        setSelectedProductsList(matched);
      } finally {
        setLoading(false);
      }
    };
    fetchSelectedProductsDetails();
  }, [selectedProductIds, selectedLanguage, user]);

  if (loading) {
    return <Loader fullPage={true} message="Loading customisation suite..." />;
  }

  return (
    <div className="customisation-page-container">
      <Header />

      <main className="customisation-content-area">
        {/* Top Back Navigation Bar */}
        <div className="customisation-top-nav-bar">
          <button
            type="button"
            className="customisation-back-dashboard-btn"
            onClick={() => navigate('/dashboard')}
            title="Return to ingredients selection with all choices saved"
          >
            <ArrowLeft size={16} />
            <span>← Back to Dashboard (Selection)</span>
          </button>
          <div className="customisation-selection-pill">
            <span>{selectedProductIds.length} Labels Selected</span>
          </div>
        </div>

        <div className="customisation-header-block">
          <h2>Customize Your Pantry Labels</h2>
          <p className="subtitle">Design beautiful, bilingual labels tailored to your jars.</p>
        </div>

        {error && <div className="customisation-error">{error}</div>}

        <div className="tabs-navigation-bar">
          <button
            className={`tab-toggle-btn ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            🎨 Design Layout
          </button>
          <button
            className={`tab-toggle-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            👁️ Live Preview
          </button>
          <button
            className={`tab-toggle-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            📝 Order Summary
          </button>
        </div>

        <div className="active-tab-render-window">
          {activeTab === 'features' && (
            <FeaturesTab
              onNext={() => setActiveTab('preview')}
              onBack={() => navigate('/dashboard')}
            />
          )}
          {activeTab === 'preview' && (
            <LivePreviewTab
              selectedProducts={selectedProductsList}
              onNext={() => setActiveTab('summary')}
              onBack={() => setActiveTab('features')}
            />
          )}
          {activeTab === 'summary' && (
            <SummaryTab
              selectedProducts={selectedProductsList}
              onBack={() => setActiveTab('preview')}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Customisation;
