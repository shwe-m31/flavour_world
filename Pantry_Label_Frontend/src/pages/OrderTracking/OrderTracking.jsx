import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Header from '../../components/Header/Header';
import Loader from '../../components/Loader/Loader';
import useAuth from '../../hooks/useAuth';
import orderService from '../../services/orderService';
import { dateFormat } from '../../utils/dateFormat';
import './OrderTracking.css';

export const OrderTracking = () => {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      setLoading(true);
      setError('');
      try {
        const response = await orderService.getOrderDetails(orderId, token);
        setOrder(response.data);
      } catch (err) {
        console.error('Failed to fetch tracking details:', err);
        setError('Failed to fetch tracking status. Please check your order ID.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId, token]);

  if (loading) {
    return <Loader fullPage={true} message="Tracking order shipment status..." />;
  }

  if (error || !order) {
    return (
      <div className="tracking-page-container">
        <Header />
        <div className="tracking-error-container">
          <div className="tracking-error-card">
            <h3>Tracking Error</h3>
            <p>{error || 'Order not found.'}</p>
            <Link to="/dashboard" className="tracking-back-btn">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get active step index based on order status
  // Statuses: PENDING_PAYMENT, PLACED/PAID, PRINTING, SHIPPED, DELIVERED
  const statusSteps = [
    { key: 'PLACED', label: 'Order Placed', desc: 'Stickers received and verified' },
    { key: 'PRINTING', label: 'Printing Labels', desc: 'Customizing layout and waterproof ink print' },
    { key: 'SHIPPED', label: 'Dispatched', desc: 'Handed over to courier partner' },
    { key: 'DELIVERED', label: 'Out for Delivery / Delivered', desc: 'Stickers delivered to kitchen address' }
  ];

  const getActiveStepIndex = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return -1; // Payment pending
      case 'PLACED':
      case 'PAID':
      case 'CONFIRMED':
        return 0;
      case 'PRINTING':
      case 'PROCESSING':
        return 1;
      case 'SHIPPED':
      case 'DISPATCHED':
        return 2;
      case 'DELIVERED':
        return 3;
      default:
        return 0;
    }
  };

  const activeIndex = getActiveStepIndex(order.status);
  const actualDate = order.orderDate || order.createdDate;

  return (
    <div className="tracking-page-container">
      <Header />

      <main className="tracking-content-area">
        <div className="tracking-header-block">
          <h2>Track Your Stickers</h2>
          <p className="subtitle">Real-time status of Order #{orderId}</p>
        </div>

        <div className="tracking-main-card">
          <div className="order-basic-info-row">
            <div>
              <span className="info-label">Placed On</span>
              <strong className="info-val">{actualDate ? dateFormat(actualDate) : 'N/A'}</strong>
            </div>
            <div>
              <span className="info-label">Total Items</span>
              <strong className="info-val">{order.items?.length || 0} labels</strong>
            </div>
            <div>
              <span className="info-label">Current Status</span>
              <strong className={`status-badge-tracking ${order.status.toLowerCase()}`}>
                {order.status.replace('_', ' ')}
              </strong>
            </div>
          </div>

          <hr className="tracking-hr" />

          {order.status === 'PENDING_PAYMENT' ? (
            <div className="pending-payment-warning-box">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={18} /> Payment is Pending</h4>
              <p>This order has been created but payment is not verified. Please complete payment to send labels to print.</p>
              <Link to={`/payment?orderId=${orderId}`} className="complete-payment-direct-btn">
                Complete Razorpay Payment
              </Link>
            </div>
          ) : (
            <div className="tracking-timeline">
              {statusSteps.map((step, idx) => {
                const isCompleted = idx < activeIndex;
                const isActive = idx === activeIndex;
                const isPending = idx > activeIndex;

                let stateClass = 'pending';
                if (isCompleted) stateClass = 'completed';
                if (isActive) stateClass = 'active';

                return (
                  <div key={step.key} className={`timeline-step-item ${stateClass}`}>
                    <div className="timeline-badge-circle">
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <div className="timeline-step-info">
                      <h4 className="timeline-step-label">{step.label}</h4>
                      <p className="timeline-step-desc">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="tracking-footer-actions">
          <Link to="/dashboard" className="tracking-footer-btn-primary">
            Browse More Ingredients
          </Link>
          <Link to="/account" className="tracking-footer-btn-sec">
            View Order History
          </Link>
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
