import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  INITIAL_STATES,
  INITIAL_LANGUAGES,
  INITIAL_CATEGORIES,
  INITIAL_INGREDIENTS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_LABEL_ACTIVITIES,
  INITIAL_PAYMENTS,
  INITIAL_INVOICES,
  INITIAL_DELIVERIES,
  INITIAL_RECOMMENDATIONS,
  INITIAL_ACTIVITY_LOG,
  INITIAL_SETTINGS
} from './mockAdminData';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [states, setStates] = useState(INITIAL_STATES);
  const [languages, setLanguages] = useState(INITIAL_LANGUAGES);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [ingredients, setIngredients] = useState(INITIAL_INGREDIENTS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [labelActivities, setLabelActivities] = useState(INITIAL_LABEL_ACTIVITIES);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [recommendations, setRecommendations] = useState(INITIAL_RECOMMENDATIONS);
  const [activityLog, setActivityLog] = useState(INITIAL_ACTIVITY_LOG);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, text: '8 payments require manual verification', time: '10m ago', unread: true, link: '/admin/payments' },
    { id: 2, text: 'Order ORD-1024 ready for label dispatch', time: '25m ago', unread: true, link: '/admin/delivery' },
    { id: 3, text: 'Tamil translations complete (80/80 items)', time: '1h ago', unread: false, link: '/admin/languages' }
  ]);

  // Add audit log entry
  const logActivity = (action, category = 'System') => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const newEntry = {
      id: Date.now(),
      time: `${hours}:${minutes}`,
      date: 'Today',
      user: 'Admin',
      action,
      category
    };
    setActivityLog(prev => [newEntry, ...prev]);
  };

  // User Actions
  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Deactivated' : 'Active';
        logActivity(`User ${u.name} status changed to ${nextStatus}`, 'User');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Ingredient Actions
  const addIngredient = (ingredientData) => {
    const newId = ingredients.length > 0 ? Math.max(...ingredients.map(i => i.id)) + 1 : 1;
    const newProductCode = `PRD-${String(newId).padStart(3, '0')}`;
    const newIng = {
      ...ingredientData,
      id: newId,
      product_code: newProductCode,
      status: 'Active',
      available_languages: 7,
      last_updated: 'Just now'
    };
    setIngredients(prev => [newIng, ...prev]);
    logActivity(`Added new ingredient: "${newIng.name}"`, 'Catalogue');
  };

  const updateIngredient = (updatedData) => {
    setIngredients(prev => prev.map(item => {
      if (item.id === updatedData.id) {
        return { ...item, ...updatedData, last_updated: 'Just now' };
      }
      return item;
    }));
    logActivity(`Updated ingredient specifications for "${updatedData.name}"`, 'Catalogue');
  };

  const deleteIngredient = (ingredientId) => {
    const target = ingredients.find(i => i.id === ingredientId);
    setIngredients(prev => prev.filter(i => i.id !== ingredientId));
    if (target) {
      logActivity(`Deleted ingredient "${target.name}" from catalogue`, 'Catalogue');
    }
  };

  // Language Actions
  const toggleLanguageStatus = (languageId) => {
    setLanguages(prev => prev.map(lang => {
      if (lang.id === languageId) {
        const next = lang.status === 'Active' ? 'Disabled' : 'Active';
        logActivity(`Language ${lang.name} (${lang.code}) changed to ${next}`, 'Language');
        return { ...lang, status: next };
      }
      return lang;
    }));
  };

  const addLanguage = (langData) => {
    const newId = languages.length + 1;
    const newLang = {
      ...langData,
      id: newId,
      coverage: '0/80',
      coveragePct: 0,
      productsCount: 0,
      lastUpdated: 'Just now',
      status: 'Active'
    };
    setLanguages(prev => [...prev, newLang]);
    logActivity(`Added new platform language: ${newLang.name} (${newLang.code})`, 'Language');
  };

  const updateTranslation = (productId, languageKey, translationValue) => {
    setIngredients(prev => prev.map(item => {
      if (item.id === productId) {
        return {
          ...item,
          [languageKey]: translationValue,
          last_updated: 'Just now'
        };
      }
      return item;
    }));
    const product = ingredients.find(i => i.id === productId);
    logActivity(`Updated ${languageKey} translation for "${product ? product.name : 'Ingredient'}"`, 'Translation');
  };

  // Order & Delivery Actions
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId || ord.order_number === orderId) {
        logActivity(`Order ${orderId} status changed to ${newStatus}`, 'Order');
        return { ...ord, order_status: newStatus };
      }
      return ord;
    }));
  };

  const updateDeliveryStatus = (orderId, newStatus, carrier, trackingNumber) => {
    const stageMap = { 'Confirmed': 1, 'Processing': 1, 'Shipped': 2, 'Delivered': 3 };
    const stage = stageMap[newStatus] || 1;

    setDeliveries(prev => prev.map(del => {
      if (del.order_id === orderId) {
        const historyEntry = {
          time: 'Just now',
          status: `Shipment status updated to ${newStatus}`,
          location: 'Hub Admin'
        };
        return {
          ...del,
          current_status: newStatus,
          stage,
          last_updated: 'Just now',
          carrier: carrier || del.carrier,
          tracking_number: trackingNumber || del.tracking_number,
          history: [historyEntry, ...del.history]
        };
      }
      return del;
    }));

    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId || ord.order_number === orderId) {
        return {
          ...ord,
          delivery_status: newStatus,
          carrier: carrier || ord.carrier,
          tracking_number: trackingNumber || ord.tracking_number
        };
      }
      return ord;
    }));

    logActivity(`Delivery status for ${orderId} updated to ${newStatus}`, 'Delivery');
  };

  // Payment Actions
  const verifyPayment = (paymentId) => {
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        logActivity(`Verified transaction ${paymentId} for ${p.order_id}`, 'Payment');
        return { ...p, status: 'Paid' };
      }
      return p;
    }));
    const p = payments.find(pay => pay.id === paymentId);
    if (p) {
      setOrders(prev => prev.map(ord => ord.id === p.order_id ? { ...ord, payment_status: 'Paid' } : ord));
      setInvoices(prev => prev.map(inv => inv.order_id === p.order_id ? { ...inv, payment_status: 'Paid', invoice_status: 'Generated' } : inv));
    }
  };

  const refundPayment = (paymentId) => {
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        logActivity(`Initiated refund for transaction ${paymentId} (${p.order_id})`, 'Payment');
        return { ...p, status: 'Refunded' };
      }
      return p;
    }));
    const p = payments.find(pay => pay.id === paymentId);
    if (p) {
      setOrders(prev => prev.map(ord => ord.id === p.order_id ? { ...ord, order_status: 'Cancelled', payment_status: 'Refunded' } : ord));
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Global Search
  const globalSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    const matchedUsers = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    const matchedOrders = orders.filter(o => o.order_number.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q));
    const matchedIngredients = ingredients.filter(i => i.name.toLowerCase().includes(q) || i.english_name.toLowerCase().includes(q));
    const matchedLabels = labelActivities.filter(l => l.id.toLowerCase().includes(q) || l.customer.toLowerCase().includes(q));

    return {
      users: matchedUsers,
      orders: matchedOrders,
      ingredients: matchedIngredients,
      labels: matchedLabels,
      totalCount: matchedUsers.length + matchedOrders.length + matchedIngredients.length + matchedLabels.length
    };
  }, [searchQuery, users, orders, ingredients, labelActivities]);

  const value = {
    states,
    languages,
    categories,
    ingredients,
    users,
    orders,
    labelActivities,
    payments,
    invoices,
    deliveries,
    recommendations,
    activityLog,
    settings,
    setSettings,
    searchQuery,
    setSearchQuery,
    globalSearchResults,
    notifications,
    markNotificationsAsRead,
    logActivity,
    toggleUserStatus,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    toggleLanguageStatus,
    addLanguage,
    updateTranslation,
    updateOrderStatus,
    updateDeliveryStatus,
    verifyPayment,
    refundPayment
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
