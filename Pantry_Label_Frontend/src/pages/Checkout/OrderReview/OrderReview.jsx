import React, { useState, useContext } from 'react';
import { currencyFormat } from '../../../utils/currencyFormat';
import { getTranslatedName } from '../../../utils/translationHelper';
import orderService from '../../../services/orderService';
import Loader from '../../../components/Loader/Loader';
import { CustomisationContext } from '../../../context/CustomisationContext';
import './OrderReview.css';

export const OrderReview = ({ token, cart, addressId, onBack, onOrderCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const customContext = useContext(CustomisationContext) || {};
  const {
    consumerCategory,
    cookingPreference,
    sheetQuantity,
    selectedShape,
    selectedFont,
    selectedLanguage
  } = customContext;

  const handlePlaceOrder = async () => {
    if (!cart || !addressId) return;

    setLoading(true);
    setError('');

    const orderData = {
      addressId,
      cartId: cart.cartId
    };

    try {
      const response = await orderService.createOrder(orderData, token);
      const createdOrder = response.data;
      
      // Order created! Notify parent container to route to Payment
      onOrderCreated(createdOrder.orderId || createdOrder.id);
    } catch (err) {
      console.error('Failed to create order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cartItems = cart?.items || [];
  const totalItems = cartItems.length;

  return (
    <div className="order-review-sub-layout">
      {loading && <Loader fullPage={true} message="Creating your order..." />}

      {error && <div className="review-error-alert">{error}</div>}

      <div className="review-sections-container">
        {sheetQuantity && (
          <div className="review-section order-specs-review-card" style={{ marginBottom: '1.25rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0f172a' }}>Order Specifications</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', fontSize: '0.82rem' }}>
              <div><strong>Sticker Price:</strong> ₹2.00 / label</div>
              <div><strong>Capacity:</strong> {sheetQuantity} Containers (35 labels/sheet)</div>
              <div><strong>Shape:</strong> {selectedShape || 'Square'}</div>
              <div><strong>Script:</strong> {(selectedLanguage || 'Tamil').toUpperCase()} + English</div>
              <div><strong>Typography:</strong> {selectedFont || 'Playfair Display'}</div>
              <div><strong>Preference:</strong> {cookingPreference || 'Vegetarian'} ({consumerCategory || 'Home'})</div>
            </div>
          </div>
        )}

        <div className="review-section">
          <h3>Review Selected Stickers ({totalItems})</h3>
          <div className="review-items-list">
            {cartItems.map((item, idx) => {
              const translated = getTranslatedName(item.product, selectedLanguage) || (selectedLanguage === 'tamil' ? item.product?.bilingualName : '');
              return (
                <div key={item.cartItemId || idx} className="review-item-row">
                  <span className="review-item-name">
                    {item.product?.name}{' '}
                    {translated && translated !== item.product?.name && (
                      <span className="review-item-bilingual">({translated})</span>
                    )}
                  </span>
                  <span className="review-item-price">{currencyFormat(item.product?.price || 0)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="review-action-section">
          <button className="review-back-btn" onClick={onBack}>
            ← Edit Delivery Address
          </button>
          <button className="review-place-order-btn" onClick={handlePlaceOrder}>
            Proceed to Payment →
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;
