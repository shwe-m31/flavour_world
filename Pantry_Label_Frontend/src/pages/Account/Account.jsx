import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Phone, Package, Truck } from 'lucide-react';
import Header from '../../components/Header/Header';
import Loader from '../../components/Loader/Loader';
import useAuth from '../../hooks/useAuth';
import addressService from '../../services/addressService';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import { currencyFormat } from '../../utils/currencyFormat';
import { dateFormat } from '../../utils/dateFormat';
import './Account.css';

export const Account = () => {
  const { token, user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [states, setStates] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccountData = async () => {
      setLoading(true);
      setError('');
      try {
        const [addrRes, ordersRes, statesRes] = await Promise.all([
          addressService.getAddresses(token),
          orderService.getOrders(token),
          productService.getStates()
        ]);
        setAddresses(addrRes.data || []);
        setOrders(ordersRes.data || []);
        setStates(statesRes.data || []);
      } catch (err) {
        console.error('Failed to load account details:', err);
        setError('Failed to fetch account info. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAccountData();
  }, [token]);

  if (loading) {
    return <Loader fullPage={true} message="Accessing account dashboard..." />;
  }

  const userStateName = states.find(s => s.id === user?.stateId)?.name || 'N/A';

  return (
    <div className="account-page-container">
      <Header />

      <main className="account-content-area">
        <div className="account-header-block">
          <h2>My Account Dashboard</h2>
          <p className="subtitle">Manage kitchen profile settings, delivery points, and order history.</p>
        </div>

        {error && <div className="account-error-alert">{error}</div>}

        <div className="account-grid-layout">
          {/* Left Column: Profile and Addresses */}
          <div className="account-details-column">
            <div className="account-card profile-card-info">
              <h3>Kitchen Profile</h3>
              <hr className="account-hr" />
              <div className="profile-details-grid">
                <div className="profile-detail-item">
                  <span>Full Name</span>
                  <strong>{user?.name || 'N/A'}</strong>
                </div>
                <div className="profile-detail-item">
                  <span>Email Address</span>
                  <strong>{user?.email || 'N/A'}</strong>
                </div>
                <div className="profile-detail-item">
                  <span>Gender</span>
                  <strong>{user?.gender || 'N/A'}</strong>
                </div>
                <div className="profile-detail-item">
                  <span>Age</span>
                  <strong>{user?.age ? `${user.age} years` : 'N/A'}</strong>
                </div>
                <div className="profile-detail-item">
                  <span>Kitchen Type</span>
                  <strong>{user?.kitchenType || 'N/A'}</strong>
                </div>
                <div className="profile-detail-item">
                  <span>Home State</span>
                  <strong>{userStateName}</strong>
                </div>
              </div>
              <Link to="/profile-setup" className="edit-profile-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Edit3 size={15} /> Edit Profile Settings
              </Link>
            </div>

            <div className="account-card saved-addresses-card">
              <h3>Saved Delivery Addresses</h3>
              <hr className="account-hr" />
              {addresses.length === 0 ? (
                <p className="empty-account-msg">No saved delivery points found.</p>
              ) : (
                <div className="saved-addresses-list">
                  {addresses.map(addr => (
                    <div key={addr.id} className="saved-address-item">
                      <strong>{addr.name}</strong>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Phone size={13} /> {addr.phone}</span>
                      <p>
                        {addr.flatHouseNo}, {addr.areaStreetName}
                        {addr.landmark && `, Landmark: ${addr.landmark}`}
                        <br />
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order History */}
          <div className="account-orders-column">
            <div className="account-card order-history-card">
              <h3>Custom Label Orders History</h3>
              <hr className="account-hr" />
              {orders.length === 0 ? (
                <div className="empty-orders-view">
                  <span className="empty-box-icon"><Package size={36} color="#94a3b8" /></span>
                  <p>You haven't ordered any custom labels yet.</p>
                  <Link to="/dashboard" className="start-selection-link">
                    Select Ingredients Now
                  </Link>
                </div>
              ) : (
                <div className="orders-history-list">
                  {orders.map(order => {
                    const finalAmount = order.grandTotal !== undefined ? order.grandTotal : order.totalAmount;
                    const orderDate = order.orderDate || order.createdDate;

                    return (
                      <div key={order.orderId || order.id} className="order-history-item">
                        <div className="order-item-header">
                          <div>
                            <span className="order-history-id">Order ID: #{order.orderId || order.id}</span>
                            <span className="order-history-date">{orderDate ? dateFormat(orderDate) : 'N/A'}</span>
                          </div>
                          <span className={`order-status-badge ${order.status.toLowerCase()}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="order-item-middle">
                          <span>Stickers Ordered: <strong>{order.items?.length || 0} labels</strong></span>
                          <span>Total Amount Paid: <strong>{currencyFormat(finalAmount || 0)}</strong></span>
                        </div>

                        <div className="order-item-footer">
                          <Link
                            to={`/order-tracking?orderId=${order.orderId || order.id}`}
                            className="order-history-track-btn"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Truck size={14} /> Live Tracking
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
