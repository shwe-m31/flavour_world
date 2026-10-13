import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import CartBadge from '../CartBadge/CartBadge';
import logoImg from '../../assets/images/flavour-world-logo.jpg';
import './Header.css';

export const Header = ({ searchQuery, setSearchQuery }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';

  return (
    <header className="main-header">
      <div className="header-container">
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="logo-section">
          <img src={logoImg} alt="Flavour World" className="logo-img" style={{ height: '42px', width: '42px', borderRadius: '50%', objectFit: 'cover' }} />
          <span className="logo-text">Flavour World</span>
        </Link>

        {isDashboard && (
          <div className="search-bar-container">
            <span className="search-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search pantry ingredients..."
              className="search-input"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>
        )}

        <nav className="header-nav">
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="nav-cart-link" title="Shopping Cart">
                <CartBadge count={cartCount} />
              </Link>
              <div className="user-profile-menu">
                <Link to="/account" className="profile-btn" title="My Account">
                  <span className="user-avatar" style={{ display: 'flex', alignItems: 'center' }}>
                    <User size={16} />
                  </span>
                  <span className="user-name-label">{user?.name || 'Account'}</span>
                </Link>
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="login-nav-btn">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
