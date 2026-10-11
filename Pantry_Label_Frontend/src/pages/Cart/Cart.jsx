import React, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Loader from '../../components/Loader/Loader';
import { CartContext } from '../../context/CartContext';
import { currencyFormat } from '../../utils/currencyFormat';
import './Cart.css';

export const Cart = () => {
  const { cart, cartItems, cartCount, loading, removeFromCart, clearCart, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (cartItemId) => {
    await removeFromCart(cartItemId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to empty your cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page-container">
      <Header />

      <main className="cart-content-area">
        <div className="cart-top-nav-bar" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="cart-back-dashboard-btn-top"
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#ffffff',
              border: '1.5px solid #d1d5db',
              borderRadius: '8px',
              padding: '0.45rem 0.95rem',
              fontSize: '0.85rem',
              fontWeight: '700',
              color: '#374151',
              cursor: 'pointer'
            }}
          >
            ← Back to Dashboard / Add More Ingredients
          </button>
        </div>

        <div className="cart-header-title">
          <h2>Shopping Cart</h2>
          <p className="subtitle">Review the ingredients you selected for customized labels.</p>
        </div>

        {loading && <Loader message="Updating your cart..." />}

        {!loading && cartCount === 0 ? (
          <div className="cart-empty-state">
            <span className="empty-cart-icon">🛒</span>
            <h3>Your cart is empty</h3>
            <p>Go back to the dashboard to select some pantry ingredients.</p>
            <Link to="/dashboard" className="cart-back-dashboard-btn">
              Browse Ingredients
            </Link>
          </div>
        ) : (
          <div className="cart-grid-layout">
            <div className="cart-items-section">
              <div className="cart-list-header">
                <span>Sticker Items ({cartCount})</span>
                <button className="clear-cart-text-btn" onClick={handleClearCart}>
                  Clear All
                </button>
              </div>

              <div className="cart-items-list">
                {cartItems.map((item) => {
                  const { cartItemId, product } = item;
                  if (!product) return null;

                  return (
                    <div key={cartItemId} className="cart-item-card">
                      <div className="cart-item-preview">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="cart-item-img" />
                        ) : (
                          <div className="cart-item-placeholder">🍲</div>
                        )}
                      </div>

                      <div className="cart-item-details">
                        <h4 className="cart-item-name">{product.name}</h4>
                        {product.bilingualName && (
                          <span className="cart-item-bilingual">{product.bilingualName}</span>
                        )}
                      </div>

                      <div className="cart-item-price-block">
                        <span className="cart-item-price">{currencyFormat(product.price || 0)}</span>
                        <button
                          className="cart-item-delete-btn"
                          onClick={() => handleRemoveItem(cartItemId)}
                          title="Remove item"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="cart-summary-section">
              <div className="cart-summary-card">
                <h3>Order Price Details</h3>
                <hr className="cart-summary-hr" />

                <div className="cart-summary-rows">
                  <div className="summary-row">
                    <span>Selected Labels ({cartCount}):</span>
                    <span>{currencyFormat(cart?.subTotal || 0)}</span>
                  </div>
                  <div className="summary-row">
                    <span>GST (18%):</span>
                    <span>{currencyFormat(cart?.gst || 0)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery Charges:</span>
                    <span>
                      {cart?.shipping === 0 ? (
                        <span className="free-shipping">FREE</span>
                      ) : (
                        currencyFormat(cart?.shipping || 0)
                      )}
                    </span>
                  </div>
                </div>

                <hr className="cart-summary-hr" />

                <div className="summary-row cart-total-row">
                  <span>Grand Total:</span>
                  <span>{currencyFormat(cart?.grandTotal || 0)}</span>
                </div>

                <button className="cart-checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>

                <div className="cart-security-tag">
                  🔒 Safe and Secure Payments. 100% Satisfaction Guaranteed.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
