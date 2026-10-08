import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Loader from '../../components/Loader/Loader';
import useAuth from '../../hooks/useAuth';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import { currencyFormat } from '../../utils/currencyFormat';
import './Payment.css';

export const Payment = () => {
  const { token, user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // 1. Load Razorpay script dynamically
  useEffect(() => {
    const loadRazorpayScript = () => {
      if (window.Razorpay) {
        setScriptLoaded(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => {
        console.error('Failed to load Razorpay SDK.');
        setError('Failed to load payment gateways. Please refresh the page.');
      };
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  // 2. Fetch Order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        navigate('/dashboard');
        return;
      }

      setLoading(true);
      setError('');
      try {
        const response = await orderService.getOrderDetails(orderId, token);
        setOrder(response.data);
      } catch (err) {
        console.error('Failed to load order details for payment:', err);
        setError('Failed to load order details. Please verify your order link.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId, token, navigate]);

  const handleRazorpayPayment = async () => {
    if (!order || !scriptLoaded) return;

    setPaying(true);
    setError('');

    try {
      // Create backend Razorpay order
      const response = await paymentService.createRazorpayOrder(orderId, token);
      const razorpayOrder = response.data; // should contain { id, amount, currency, ... }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'Flavour World',
        description: 'Order Custom Sticker Labels',
        order_id: razorpayOrder.id,
        handler: async function (paymentResponse) {
          // Verify payment on successful authorization
          setVerifying(true);
          try {
            const verificationPayload = {
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature
            };
            
            const verifyRes = await paymentService.verifyPayment(verificationPayload, token);
            if (verifyRes.status === 200 || verifyRes.data.success) {
              navigate(`/order-success?orderId=${orderId}`);
            } else {
              setError('Payment verification failed on the server.');
            }
          } catch (verifyErr) {
            console.error(verifyErr);
            setError('Payment verification error occurred. Contact support if debited.');
          } finally {
            setVerifying(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: order.deliveryAddress?.phone || order.address?.phone || ''
        },
        theme: {
          color: '#10b981'
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
            setError('Payment process was cancelled by the user.');
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (err) {
      console.error('Razorpay initialization failed:', err);
      setError(err.response?.data?.message || 'Failed to initialize payment gateway.');
      setPaying(false);
    }
  };

  if (loading) {
    return <Loader fullPage={true} message="Accessing payment details..." />;
  }

  if (verifying) {
    return <Loader fullPage={true} message="Verifying payment status..." />;
  }

  const finalAmount = order?.grandTotal !== undefined ? order.grandTotal : order?.totalAmount;

  return (
    <div className="payment-page-container">
      <Header />

      <main className="payment-content-area">
        <div className="payment-card-layout">
          <div className="payment-header-block">
            <span className="payment-header-icon">💳</span>
            <h2>Select Payment Method</h2>
            <p className="subtitle">Secure transaction via Razorpay gateway.</p>
          </div>

          {error && <div className="payment-error-alert">{error}</div>}

          <div className="payment-details-summary">
            <div className="detail-row">
              <span>Order Reference:</span>
              <strong>#{orderId}</strong>
            </div>
            <div className="detail-row">
              <span>Total Payable Amount:</span>
              <strong className="payment-total-value">{currencyFormat(finalAmount || 0)}</strong>
            </div>
          </div>

          <div className="payment-options-list">
            <div className="payment-option-item active">
              <input type="radio" id="razorpay-radio" checked readOnly />
              <label htmlFor="razorpay-radio" className="payment-option-label">
                <span className="gateway-logo">Razorpay</span>
                <span className="gateway-description">Cards, Netbanking, UPI, Wallet</span>
              </label>
            </div>
          </div>

          <button
            className="trigger-payment-btn"
            onClick={handleRazorpayPayment}
            disabled={paying || !scriptLoaded}
          >
            {paying ? 'Processing...' : `Pay ${currencyFormat(finalAmount || 0)} Now`}
          </button>

          <p className="payment-secure-badge">
            🔒 SSL Secured | 256-bit Encryption
          </p>
        </div>
      </main>
    </div>
  );
};

export default Payment;
