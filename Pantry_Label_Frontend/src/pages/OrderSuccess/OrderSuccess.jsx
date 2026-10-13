import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import Header from '../../components/Header/Header';
import Loader from '../../components/Loader/Loader';
import InvoiceCard from '../../components/InvoiceCard/InvoiceCard';
import useAuth from '../../hooks/useAuth';
import orderService from '../../services/orderService';
import './OrderSuccess.css';

export const OrderSuccess = () => {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const response = await orderService.getOrderDetails(orderId, token);
        setOrder(response.data);
      } catch (err) {
        console.error('Failed to fetch confirmed order details:', err);
        setError('Could not retrieve order receipt details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  if (loading) {
    return <Loader fullPage={true} message="Generating order confirmation details..." />;
  }

  return (
    <div className="order-success-page-container">
      <Header />

      <main className="success-content-area">
        <div className="success-animation-block">
          <div className="success-checkmark-circle">✓</div>
          <h2>Order Confirmed!</h2>
          <p className="subtitle">
            Your customized label order has been successfully placed. Your stickers are now sent to print!
          </p>
        </div>

        {error && <div className="success-error-banner">{error}</div>}

        {order && (
          <div className="invoice-display-wrapper">
            <InvoiceCard order={order} token={token} />
          </div>
        )}

        <div className="success-action-dock">
          <Link
            to={`/order-tracking?orderId=${orderId}`}
            className="track-order-link-btn"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Truck size={16} /> Track Order Dispatch
          </Link>
          <Link to="/dashboard" className="back-dashboard-link-btn">
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccess;
