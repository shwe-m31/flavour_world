import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap } from 'lucide-react';
import { CustomisationContext } from '../../../context/CustomisationContext';
import { CartContext } from '../../../context/CartContext';
import useAuth from '../../../hooks/useAuth';
import { getIndianStateById } from '../../../data/indianStates';
import {
  getThemeById,
  getShapeById,
  getCornerById,
  getBorderById
} from '../labelCustomisationData';
import Loader from '../../../components/Loader/Loader';
import './SummaryTab.css';

export const SummaryTab = ({ selectedProducts = [], onBack }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const {
    consumerCategory,
    selectedStateId,
    cookingPreference,
    sheetQuantity,
    selectedTheme,
    selectedShape,
    selectedCorner,
    selectedBorderStyle,
    selectedFont,
    showIllustration,
    selectedLanguage,
    selectedBackground,
    proceedWithSelection,
    clearSelections
  } = useContext(CustomisationContext);
  const { addToCart } = useContext(CartContext);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const stateObj = getIndianStateById(selectedStateId);
  const themeObj = getThemeById(selectedTheme);
  const shapeObj = getShapeById(selectedShape);
  const cornerObj = getCornerById(selectedCorner);
  const borderObj = getBorderById(selectedBorderStyle);

  const capacityPerSheet = 35;
  const sheetCount = Math.max(1, Math.ceil((sheetQuantity || 35) / capacityPerSheet));

  const handleAction = async (actionType) => {
    setLoading(true);
    setError('');
    try {
      // 1. Send selection details (POST selections)
      await proceedWithSelection(token);

      // 2. Add each product to the cart
      for (const product of selectedProducts) {
        await addToCart(product.id);
      }

      // 3. Clear customization state
      clearSelections();

      // 4. Redirect based on action
      if (actionType === 'buyNow') {
        navigate('/checkout');
      } else {
        navigate('/cart');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to complete customisation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fixed price Rs. 2.00 per label
  const totalEstimate = selectedProducts.length * 2.00;
  const formattedEstimate = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(totalEstimate);

  return (
    <div className="summary-tab-container">
      {loading && <Loader fullPage={true} message="Finalizing selection & adding to cart..." />}

      <div className="summary-card">
        <h3>Customisation Summary</h3>
        <p className="summary-card-desc">Review your choice of styling and labels before ordering.</p>
        
        {error && <div className="summary-error">{error}</div>}

        <div className="summary-specs-list">
          <div className="spec-row">
            <span>Kitchen Persona:</span>
            <strong>{consumerCategory || 'Standard Household'}</strong>
          </div>
          <div className="spec-row">
            <span>Region / State:</span>
            <strong>{stateObj?.name || 'Tamil Nadu'}</strong>
          </div>
          <div className="spec-row">
            <span>Cooking Preference:</span>
            <strong>{cookingPreference || 'Vegetarian'}</strong>
          </div>
          <div className="spec-row">
            <span>Sheet Capacity:</span>
            <strong>{sheetQuantity} Containers ({selectedShape === 'square' ? '7×5 Sheet • 35/sheet' : '5×7 Sheet • 35/sheet'}, {sheetCount} Sheet{sheetCount > 1 ? 's' : ''})</strong>
          </div>
          <div className="spec-row">
            <span>Sticker Palette:</span>
            <strong>{themeObj?.name || selectedBackground}</strong>
          </div>
          <div className="spec-row">
            <span>Shape & Finish:</span>
            <strong>{shapeObj?.name || selectedShape} ({cornerObj?.name || selectedCorner})</strong>
          </div>
          <div className="spec-row">
            <span>Border Style:</span>
            <strong>{borderObj?.name || selectedBorderStyle}</strong>
          </div>
          <div className="spec-row">
            <span>Typography:</span>
            <strong>{selectedFont}</strong>
          </div>
          <div className="spec-row">
            <span>Primary Script:</span>
            <strong style={{ textTransform: 'capitalize' }}>{selectedLanguage || 'Tamil'} + English</strong>
          </div>
          <div className="spec-row">
            <span>Ingredient Artwork:</span>
            <strong>{showIllustration ? 'Botanical Line Art' : 'Text-Only'}</strong>
          </div>
          <div className="spec-row">
            <span>Selected Stickers:</span>
            <strong>{selectedProducts.length} labels (₹2.00 / sticker)</strong>
          </div>
        </div>

        <hr className="summary-hr" />

        <div className="selected-labels-review-list">
          <h4>Items to Customize:</h4>
          <ul>
            {selectedProducts.map(p => {
              const langKey = (selectedLanguage || 'tamil').toLowerCase().trim();
              const regText = p[langKey] || p[`${langKey}Name`] || (langKey === 'tamil' ? (p.tamilName || p.bilingualName) : '');
              const cleanReg = regText ? String(regText).replace(/\(cid:\d+\)/g, '').trim() : '';
              return (
                <li key={p.id} className="summary-product-item">
                  <span className="summary-item-name">
                    {p.name} {cleanReg && cleanReg !== p.name && <span className="summary-hi">({cleanReg})</span>}
                  </span>
                  <span className="summary-item-price">
                    ₹2.00
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <hr className="summary-hr" />

        <div className="summary-price-dock">
          <span className="price-label">Estimated Label Cost (₹2.00 / label):</span>
          <span className="price-value">{formattedEstimate}</span>
        </div>

        <div className="summary-action-btns">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="summary-btn btn-back-step"
              disabled={loading}
            >
              ← Back to Live Preview
            </button>
          )}
          <button
            onClick={() => handleAction('addToCart')}
            className="summary-btn btn-cart"
            disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
          <button
            onClick={() => handleAction('buyNow')}
            className="summary-btn btn-buynow"
            disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Zap size={16} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryTab;
