import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Loader from '../../components/Loader/Loader';
import ProgressSteps from '../../components/ProgressSteps/ProgressSteps';
import AddressPage from './AddressPage/AddressPage';
import OrderReview from './OrderReview/OrderReview';
import { CartContext } from '../../context/CartContext';
import useAuth from '../../hooks/useAuth';
import { currencyFormat } from '../../utils/currencyFormat';
import './Checkout.css';

export const Checkout = () => {
  const { token } = useAuth();
  const { cart, cartCount, loading: cartLoading, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1); // 1 = Address, 2 = Review
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Sync cart on page mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Redirect if cart is empty after fetching
  useEffect(() => {
    if (!cartLoading && cartCount === 0) {
      navigate('/cart');
    }
  }, [cartCount, cartLoading, navigate]);

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
  };

  const handleNextStep = () => {
    if (!selectedAddressId) {
      alert('Please select or add a delivery address to proceed.');
      return;
    }
    setCurrentStep(2);
  };

  const handleBackStep = () => {
    setCurrentStep(1);
  };

  const handleOrderCreated = (orderId) => {
    navigate(`/payment?orderId=${orderId}`);
  };

  if (cartLoading && !cart) {
    return <Loader fullPage={true} message="Loading checkout details..." />;
  }

  return (
    <div className="checkout-page-container">
      <Header />

      <main className="checkout-content-area">
        <div className="checkout-top-nav-bar" style={{ marginBottom: '1rem' }}>
          <button
            type="button"
            className="checkout-back-cart-btn"
            onClick={() => navigate('/cart')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#ffffff',
              border: '1.5px solid #d1d5db',
              borderRadius: '8px',
              padding: '0.45rem 0.9rem',
              fontSize: '0.85rem',
              fontWeight: '700',
              color: '#374151',
              cursor: 'pointer'
            }}
          >
            ← Back to Cart
          </button>
        </div>

        <ProgressSteps currentStep={currentStep} />

        <div className="checkout-grid-layout">
          {/* Left Side: Checkout dynamic steps */}
          <div className="checkout-flow-card">
            {currentStep === 1 ? (
              <AddressPage
                token={token}
                selectedAddressId={selectedAddressId}
                onSelectAddress={handleSelectAddress}
              />
            ) : (
              <OrderReview
                token={token}
                cart={cart}
                addressId={selectedAddressId}
                onBack={handleBackStep}
                onOrderCreated={handleOrderCreated}
              />
            )}
          </div>

          {/* Right Side: Order summary details box */}
          <div className="checkout-summary-sidebar">
            <div className="checkout-summary-card">
              <h3>Order Pricing Detail</h3>
              <hr className="checkout-summary-hr" />
              
              <div className="checkout-summary-rows">
                <div className="checkout-summary-row">
                  <span>Custom Labels ({cartCount}):</span>
                  <span>{currencyFormat(cart?.subTotal || 0)}</span>
                </div>
                <div className="checkout-summary-row">
                  <span>GST (18%):</span>
                  <span>{currencyFormat(cart?.gst || 0)}</span>
                </div>
                <div className="checkout-summary-row">
                  <span>Delivery Charges:</span>
                  <span>
                    {cart?.shipping === 0 ? (
                      <span className="free-shipping">FREE</span>
                    ) : (
                      currencyFormat(cart?.shipping || 0)
                    )}
                  </span>
                </div>
                <hr className="checkout-summary-hr" />
                <div className="checkout-summary-row checkout-total-row">
                  <span>Grand Total:</span>
                  <span>{currencyFormat(cart?.grandTotal || 0)}</span>
                </div>
              </div>

              {currentStep === 1 && (
                <button
                  className="checkout-next-btn"
                  onClick={handleNextStep}
                  disabled={!selectedAddressId}
                >
                  Deliver to this Address →
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
