import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Globe,
  Tag,
  ShoppingBag,
  CreditCard,
  FileText,
  Truck,
  BarChart3,
  Lightbulb,
  Clock,
  Settings,
  LogOut,
  Layers
} from 'lucide-react';
import { useAdmin } from '../data/AdminContext';

export const AdminSidebar = ({ isMobileOpen, onCloseMobile }) => {
  const navigate = useNavigate();
  const { orders, payments } = useAdmin();

  const pendingOrdersCount = orders.filter(o => o.order_status === 'Confirmed' || o.order_status === 'Processing').length;
  const pendingPaymentsCount = payments.filter(p => p.status === 'Pending').length;

  const handleLogout = () => {
    navigate('/admin/login');
  };

  return (
    <>
      {isMobileOpen && <div className="admin-sidebar-backdrop" onClick={onCloseMobile} />}
      <aside className={`admin-sidebar ${isMobileOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-title">
            <Layers size={18} style={{ color: 'var(--admin-action-dark)' }} />
            <span>FLAVOUR WORLD ADMIN</span>
          </div>
          <div className="admin-sidebar-subtitle">Label Management Platform</div>
        </div>

        {/* Navigation Sections */}
        <nav className="admin-sidebar-nav">
          {/* MAIN */}
          <div className="admin-nav-group">
            <div className="admin-nav-group-title">Main</div>
            <NavLink
              to="/admin/overview"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <LayoutDashboard />
              <span>Overview</span>
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <Users />
              <span>Users</span>
            </NavLink>
            <NavLink
              to="/admin/ingredients"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <Package />
              <span>Ingredients</span>
            </NavLink>
            <NavLink
              to="/admin/languages"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <Globe />
              <span>Languages</span>
            </NavLink>
            <NavLink
              to="/admin/labels"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <Tag />
              <span>Labels</span>
            </NavLink>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <ShoppingBag />
              <span>Orders</span>
              {pendingOrdersCount > 0 && (
                <span className="admin-nav-badge alert">{pendingOrdersCount}</span>
              )}
            </NavLink>
          </div>

          {/* COMMERCE */}
          <div className="admin-nav-group">
            <div className="admin-nav-group-title">Commerce</div>
            <NavLink
              to="/admin/payments"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <CreditCard />
              <span>Payments</span>
              {pendingPaymentsCount > 0 && (
                <span className="admin-nav-badge">{pendingPaymentsCount}</span>
              )}
            </NavLink>
            <NavLink
              to="/admin/invoices"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <FileText />
              <span>Invoices</span>
            </NavLink>
            <NavLink
              to="/admin/delivery"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <Truck />
              <span>Delivery Tracking</span>
            </NavLink>
          </div>

          {/* ANALYTICS */}
          <div className="admin-nav-group">
            <div className="admin-nav-group-title">Analytics</div>
            <NavLink
              to="/admin/analytics"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <BarChart3 />
              <span>Analytics</span>
            </NavLink>
            <NavLink
              to="/admin/recommendations"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <Lightbulb />
              <span>Recommendations</span>
            </NavLink>
            <NavLink
              to="/admin/activity"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <Clock />
              <span>Activity Log</span>
            </NavLink>
          </div>

          {/* SYSTEM */}
          <div className="admin-nav-group">
            <div className="admin-nav-group-title">System</div>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <Settings />
              <span>Settings</span>
            </NavLink>
          </div>
        </nav>

        {/* Sidebar Bottom Profile */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-profile">
            <div className="admin-avatar">A</div>
            <div className="admin-user-info">
              <span className="admin-user-name">ADMINISTRATOR</span>
              <span className="admin-user-role">admin@platform</span>
            </div>
          </div>
          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Log out of Admin"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
