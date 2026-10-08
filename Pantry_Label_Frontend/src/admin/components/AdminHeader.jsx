import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X } from 'lucide-react';
import { useAdmin } from '../data/AdminContext';

export const AdminHeader = ({ onToggleMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    searchQuery,
    setSearchQuery,
    globalSearchResults,
    notifications,
    markNotificationsAsRead
  } = useAdmin();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Title and breadcrumb mapping
  const routeMeta = {
    '/admin': { title: 'Dashboard Overview', breadcrumb: 'Admin / Overview' },
    '/admin/overview': { title: 'Dashboard Overview', breadcrumb: 'Admin / Overview' },
    '/admin/users': { title: 'User Management', breadcrumb: 'Admin / Users' },
    '/admin/ingredients': { title: 'Ingredient Catalogue', breadcrumb: 'Admin / Ingredients' },
    '/admin/languages': { title: 'Language & Translation Management', breadcrumb: 'Admin / Languages' },
    '/admin/labels': { title: 'Label Generation & Customization Activity', breadcrumb: 'Admin / Labels' },
    '/admin/orders': { title: 'Order Management', breadcrumb: 'Admin / Orders' },
    '/admin/payments': { title: 'Payment Monitor', breadcrumb: 'Admin / Payments' },
    '/admin/invoices': { title: 'Invoice Management', breadcrumb: 'Admin / Invoices' },
    '/admin/delivery': { title: 'Delivery Tracking & Fulfillment', breadcrumb: 'Admin / Delivery' },
    '/admin/analytics': { title: 'Platform Analytics', breadcrumb: 'Admin / Analytics' },
    '/admin/recommendations': { title: 'Recommendation Activity', breadcrumb: 'Admin / Recommendations' },
    '/admin/activity': { title: 'System Activity Log', breadcrumb: 'Admin / Activity' },
    '/admin/settings': { title: 'System Settings', breadcrumb: 'Admin / Settings' }
  };

  const currentMeta = routeMeta[location.pathname] || {
    title: 'Pantry Administration',
    breadcrumb: 'Admin'
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchResultClick = (path) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  return (
    <header className="admin-header">
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="admin-menu-toggle" onClick={onToggleMobile} title="Toggle Menu">
          <Menu size={20} />
        </button>
        <div className="admin-header-left">
          <h1 className="admin-page-title">{currentMeta.title}</h1>
          <div className="admin-breadcrumb">{currentMeta.breadcrumb}</div>
        </div>
      </div>

      {/* Right: Search & Notifications */}
      <div className="admin-header-right">
        {/* Global Search */}
        <div className="admin-search-wrapper" ref={searchRef}>
          <Search className="admin-search-icon" size={14} />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search users, orders, labels..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
          />
          {searchQuery && (
            <button
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--admin-text-muted)'
              }}
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
            >
              <X size={12} />
            </button>
          )}

          {/* Search Dropdown Popover */}
          {isSearchOpen && globalSearchResults && (
            <div className="admin-search-results-popover">
              {globalSearchResults.totalCount === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: 12 }}>
                  No matching records found for "{searchQuery}"
                </div>
              ) : (
                <>
                  {/* Users */}
                  {globalSearchResults.users.length > 0 && (
                    <div>
                      <div className="admin-search-group-header">
                        Users ({globalSearchResults.users.length})
                      </div>
                      {globalSearchResults.users.slice(0, 3).map(u => (
                        <div
                          key={u.id}
                          className="admin-search-item"
                          onClick={() => handleSearchResultClick('/admin/users')}
                        >
                          <div>
                            <strong>{u.name}</strong> • <span style={{ color: 'var(--admin-text-secondary)' }}>{u.email}</span>
                          </div>
                          <span style={{ fontSize: 10, color: 'var(--admin-text-muted)' }}>{u.state}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Orders */}
                  {globalSearchResults.orders.length > 0 && (
                    <div>
                      <div className="admin-search-group-header">
                        Orders ({globalSearchResults.orders.length})
                      </div>
                      {globalSearchResults.orders.slice(0, 3).map(o => (
                        <div
                          key={o.id}
                          className="admin-search-item"
                          onClick={() => handleSearchResultClick('/admin/orders')}
                        >
                          <div>
                            <strong>{o.order_number}</strong> • <span>{o.customer_name}</span>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 600 }}>₹{o.amount}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Ingredients */}
                  {globalSearchResults.ingredients.length > 0 && (
                    <div>
                      <div className="admin-search-group-header">
                        Ingredients ({globalSearchResults.ingredients.length})
                      </div>
                      {globalSearchResults.ingredients.slice(0, 3).map(i => (
                        <div
                          key={i.id}
                          className="admin-search-item"
                          onClick={() => handleSearchResultClick('/admin/ingredients')}
                        >
                          <div>
                            <strong>{i.name}</strong> ({i.english_name})
                          </div>
                          <span style={{ fontSize: 10, color: 'var(--admin-text-muted)' }}>{i.category}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Labels */}
                  {globalSearchResults.labels.length > 0 && (
                    <div>
                      <div className="admin-search-group-header">
                        Labels ({globalSearchResults.labels.length})
                      </div>
                      {globalSearchResults.labels.slice(0, 3).map(l => (
                        <div
                          key={l.id}
                          className="admin-search-item"
                          onClick={() => handleSearchResultClick('/admin/labels')}
                        >
                          <div>
                            <strong>{l.id}</strong> • <span>{l.customer}</span>
                          </div>
                          <span style={{ fontSize: 10, color: 'var(--admin-text-muted)' }}>{l.language}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            type="button"
            className="admin-header-action-btn"
            onClick={() => {
              setIsNotifOpen(prev => !prev);
              if (!isNotifOpen) markNotificationsAsRead();
            }}
            title="System Notifications"
          >
            <Bell size={15} />
            {unreadCount > 0 && <span className="admin-unread-dot" />}
          </button>

          {isNotifOpen && (
            <div className="admin-notif-popover">
              <div className="admin-notif-header">
                <span>System Notifications</span>
                <span style={{ fontSize: 11, color: 'var(--admin-text-secondary)', fontWeight: 400 }}>
                  {notifications.length} updates
                </span>
              </div>
              <div className="admin-notif-list">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className="admin-notif-item"
                    onClick={() => {
                      setIsNotifOpen(false);
                      if (n.link) navigate(n.link);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: n.unread ? 600 : 400 }}>{n.text}</span>
                    </div>
                    <div className="admin-notif-time">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
