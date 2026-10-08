import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Customer Pages imports
import Landing from '../pages/Landing/Landing';
import Register from '../pages/Register/Register';
import Login from '../pages/Login/Login';
import ProfileSetup from '../pages/ProfileSetup/ProfileSetup';
import Dashboard from '../pages/Dashboard/Dashboard';
import Customisation from '../pages/Customisation/Customisation';
import Cart from '../pages/Cart/Cart';
import Checkout from '../pages/Checkout/Checkout';
import Payment from '../pages/Payment/Payment';
import OrderSuccess from '../pages/OrderSuccess/OrderSuccess';
import OrderTracking from '../pages/OrderTracking/OrderTracking';
import Account from '../pages/Account/Account';
import NotFound from '../pages/NotFound/NotFound';

// Admin Imports
import { AdminProvider } from '../admin/data/AdminContext';
import AdminLayout from '../admin/components/AdminLayout';
import AdminLogin from '../admin/pages/AdminLogin';
import DashboardOverview from '../admin/pages/DashboardOverview';
import UsersManagement from '../admin/pages/UsersManagement';
import IngredientsManagement from '../admin/pages/IngredientsManagement';
import LanguageManagement from '../admin/pages/LanguageManagement';
import LabelActivity from '../admin/pages/LabelActivity';
import OrdersManagement from '../admin/pages/OrdersManagement';
import PaymentsManagement from '../admin/pages/PaymentsManagement';
import InvoiceManagement from '../admin/pages/InvoiceManagement';
import DeliveryTracking from '../admin/pages/DeliveryTracking';
import AnalyticsSection from '../admin/pages/AnalyticsSection';
import RecommendationsManagement from '../admin/pages/RecommendationsManagement';
import ActivityLog from '../admin/pages/ActivityLog';
import SystemSettings from '../admin/pages/SystemSettings';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Application Routes */}
      <Route
        path="/admin"
        element={
          <AdminProvider>
            <AdminLayout />
          </AdminProvider>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="overview" element={<DashboardOverview />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="ingredients" element={<IngredientsManagement />} />
        <Route path="languages" element={<LanguageManagement />} />
        <Route path="labels" element={<LabelActivity />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="payments" element={<PaymentsManagement />} />
        <Route path="invoices" element={<InvoiceManagement />} />
        <Route path="delivery" element={<DeliveryTracking />} />
        <Route path="analytics" element={<AnalyticsSection />} />
        <Route path="recommendations" element={<RecommendationsManagement />} />
        <Route path="activity" element={<ActivityLog />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>

      {/* Protected routes that DO NOT require profile completion to get in (but require auth) */}
      <Route
        path="/profile-setup"
        element={
          <ProtectedRoute requiresProfileCompleted={false}>
            <ProfileSetup />
          </ProtectedRoute>
        }
      />

      {/* Protected routes that REQUIRE profile completion */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customisation"
        element={
          <ProtectedRoute>
            <Customisation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-tracking"
        element={
          <ProtectedRoute>
            <OrderTracking />
          </ProtectedRoute>
        }
      />

      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
