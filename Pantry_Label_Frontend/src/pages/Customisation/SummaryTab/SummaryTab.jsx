import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomisationContext } from '../../../context/CustomisationContext';
import { CartContext } from '../../../context/CartContext';
import useAuth from '../../../hooks/useAuth';
import Loader from '../../../components/Loader/Loader';
import './SummaryTab.css';

export const SummaryTab = ({ selectedProducts = [] }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { selectedFont, selectedShape, selectedBackground, proceedWithSelection, clearSelections } = useContext(CustomisationContext);
  const { addToCart } = useContext(CartContext);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
            <span>Font Style:</span>
            <strong>{selectedFont}</strong>
          </div>
          <div className="spec-row">
            <span>Label Shape:</span>
            <strong>{selectedShape}</strong>
          </div>
          <div className="spec-row">
            <span>Theme Background:</span>
            <strong>{selectedBackground}</strong>
          </div>
          <div className="spec-row">
            <span>Total Stickers:</span>
            <strong>{selectedProducts.length} labels</strong>
          </div>
        </div>

        <hr className="summary-hr" />

        <div className="selected-labels-review-list">
          <h4>Items to Customize:</h4>
          <ul>
            {selectedProducts.map(p => (
              <li key={p.id} className="summary-product-item">
                <span className="summary-item-name">
                  {p.name} {p.bilingualName && <span className="summary-hi">({p.bilingualName})</span>}
                </span>
                <span className="summary-item-price">
                  ₹2.00
                </span>
              </li>
            ))}
          </ul>
        </div>

        <hr className="summary-hr" />

        <div className="summary-price-dock">
          <span className="price-label">Estimated Label Cost (Rs. 2 / label):</span>
          <span className="price-value">{formattedEstimate}</span>
        </div>

        <div className="summary-action-btns">
          <button
            onClick={() => handleAction('addToCart')}
            className="summary-btn btn-cart"
            disabled={loading}
          >
            🛒 Add to Cart
          </button>
          <button
            onClick={() => handleAction('buyNow')}
            className="summary-btn btn-buynow"
            disabled={loading}
          >
            🔥 Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryTab;
