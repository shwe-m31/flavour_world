import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShoppingBag,
  Tag,
  CreditCard,
  Globe,
  Package,
  Clock,
  ArrowRight,
  Eye
} from 'lucide-react';
import { useAdmin } from '../data/AdminContext';
import KpiCard from '../components/KpiCard';
import AttentionSection from '../components/AttentionSection';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import LabelPreviewModal from '../components/LabelPreviewModal';
import { ClinicalBarChart, ClinicalDistributionBar } from '../components/ClinicalChart';

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const { orders, users, ingredients, languages, labelActivities, activityLog } = useAdmin();
  const [selectedLabelForPreview, setSelectedLabelForPreview] = useState(null);

  const orderColumns = [
    {
      header: 'Order ID',
      field: 'order_number',
      sortable: true,
      width: '100px',
      render: (val) => <strong>{val}</strong>
    },
    {
      header: 'Customer',
      field: 'customer_name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{val}</div>
          <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{row.customer_email}</div>
        </div>
      )
    },
    {
      header: 'Date',
      field: 'date',
      sortable: true,
      width: '110px'
    },
    {
      header: 'Labels',
      field: 'labels_count',
      align: 'right',
      sortable: true,
      render: (val) => `${val} labels`
    },
    {
      header: 'Amount',
      field: 'amount',
      align: 'right',
      sortable: true,
      render: (val) => <strong>₹{Number(val).toFixed(2)}</strong>
    },
    {
      header: 'Payment',
      field: 'payment_status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Order Status',
      field: 'order_status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Delivery',
      field: 'delivery_status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Action',
      field: 'id',
      align: 'right',
      render: () => (
        <button
          type="button"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          onClick={() => navigate('/admin/orders')}
        >
          <Eye size={12} />
          <span>View</span>
        </button>
      )
    }
  ];

  // Daily orders chart data dynamically computed from orders
  const weeklyOrderTrend = useMemo(() => {
    const countsByDate = {};
    orders.forEach(o => {
      const d = o.date || 'Today';
      const shortDate = d.split(' ').slice(0, 2).join(' ');
      countsByDate[shortDate] = (countsByDate[shortDate] || 0) + 1;
    });
    const entries = Object.entries(countsByDate).slice(0, 7).reverse();
    if (entries.length > 0) {
      return entries.map(([label, value]) => ({ label, value }));
    }
    return [
      { label: '06 Sep', value: 3 },
      { label: '07 Sep', value: 4 },
      { label: '08 Sep', value: 5 },
      { label: '09 Sep', value: 4 },
      { label: '10 Sep', value: 6 },
      { label: '11 Sep', value: 7 },
      { label: '12 Sep', value: 8 }
    ];
  }, [orders]);

  // Language distribution data dynamically computed from orders
  const languageDistribution = useMemo(() => {
    const langCounts = {};
    orders.forEach(o => {
      let lang = (o.language || 'Tamil').split('+')[0].trim();
      langCounts[lang] = (langCounts[lang] || 0) + (Number(o.labels_count) || 30);
    });
    const totalCount = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
    const colors = ['#202124', '#4267A9', '#238B5A', '#B7791F', '#8A8F94', '#9333EA', '#DC2626'];
    const nativeNames = {
      'Tamil': 'தமிழ்',
      'Kannada': 'ಕನ್ನಡ',
      'Malayalam': 'മലയാളം',
      'Marathi': 'मराठी',
      'Bengali': 'বাংলা',
      'Telugu': 'తెలుగు',
      'Hindi': 'हिन्दी',
      'Gujarati': 'ગુજરાતી',
      'Punjabi': 'ਪੰਜਾਬੀ',
      'Odia': 'ଓଡ଼ିଆ'
    };

    return Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang, count], idx) => {
        const pct = Math.round((count / totalCount) * 100);
        const native = nativeNames[lang] ? ` (${nativeNames[lang]})` : '';
        return {
          label: `${lang}${native}`,
          value: pct,
          count: `${count.toLocaleString()} labels`,
          color: colors[idx % colors.length]
        };
      });
  }, [orders]);

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-heading">Dashboard Overview</h2>
          <p className="admin-page-subtitle">
            Monitor users, labels, orders, payments and delivery activity across the platform.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => navigate('/admin/analytics')}
          >
            Detailed Analytics
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => navigate('/admin/ingredients')}
          >
            + Manage Catalogue
          </button>
        </div>
      </div>

      {/* Operational Attention Alert */}
      <AttentionSection />

      {/* 8 KPI Summary Cards */}
      <div className="admin-kpi-grid">
        <KpiCard
          label="Total Users"
          value={users.length.toLocaleString()}
          trend="+8.2%"
          trendType="positive"
          context="active platform"
          icon={Users}
        />
        <KpiCard
          label="New Users"
          value={String(users.filter(u => !u.isDemo).length || 1)}
          trend="+14%"
          trendType="positive"
          context="live members"
          icon={Users}
        />
        <KpiCard
          label="Total Labels Generated"
          value={orders.reduce((acc, o) => acc + (Number(o.labels_count) || 30), 0).toLocaleString()}
          trend="+18.5%"
          trendType="positive"
          context="all orders"
          icon={Tag}
        />
        <KpiCard
          label="Total Orders"
          value={orders.length.toLocaleString()}
          trend="+12.4%"
          trendType="positive"
          context="all time"
          icon={ShoppingBag}
        />
        <KpiCard
          label="Pending Orders"
          value={orders.filter(o => o.order_status === 'Confirmed' || o.order_status === 'Processing' || o.delivery_status !== 'Delivered').length.toLocaleString()}
          trend={orders.some(o => o.order_status === 'Confirmed') ? 'Action required' : 'Up to date'}
          trendType={orders.some(o => o.order_status === 'Confirmed') ? 'negative' : 'positive'}
          context="in fulfillment"
          icon={Clock}
        />
        <KpiCard
          label="Revenue"
          value={`₹${Math.round(orders.reduce((acc, o) => acc + (Number(o.amount || o.total_amount) || 0), 0)).toLocaleString()}`}
          trend="+9.8%"
          trendType="positive"
          context="gross volume"
          icon={CreditCard}
        />
        <KpiCard
          label="Active Languages"
          value={languages.filter(l => l.status === 'Active').length.toString()}
          trend={`${languages.filter(l => l.status === 'Active').length}/12`}
          trendType="positive"
          context="regional coverage"
          icon={Globe}
        />
        <KpiCard
          label="Products / Ingredients"
          value={`${ingredients.length}+`}
          context="mapped catalogue"
          icon={Package}
        />
      </div>

      {/* Section: Recent Orders Monitoring */}
      <div className="admin-section">
        <div className="admin-section-header">
          <div>
            <div className="admin-section-title">
              <ShoppingBag size={16} />
              <span>Recent Orders</span>
            </div>
            <div className="admin-section-subtitle">
              Live incoming customer pantry label orders with payment and delivery states
            </div>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => navigate('/admin/orders')}
          >
            <span>View all orders</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <DataTable
          columns={orderColumns}
          data={orders.slice(0, 6)}
          pageSize={6}
          keyField="id"
        />
      </div>

      {/* Grid: Charts & Operational Activity */}
      <div className="admin-grid-2" style={{ marginBottom: 24 }}>
        <ClinicalBarChart
          title="Daily Orders Volume (Last 7 Days)"
          data={weeklyOrderTrend}
          unit=" orders"
          height={170}
        />
        <ClinicalDistributionBar
          title="Language Selection Share"
          items={languageDistribution}
        />
      </div>

      {/* Grid: Recent Label Generation Activity & Audit Trail */}
      <div className="admin-grid-2">
        {/* Label Activity Sample */}
        <div className="admin-card">
          <div className="admin-section-header" style={{ marginBottom: 10 }}>
            <div className="admin-section-title">
              <Tag size={15} />
              <span>Recent Label Customizations</span>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => navigate('/admin/labels')}
            >
              All Labels
            </button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Label ID</th>
                <th>Customer</th>
                <th>Language</th>
                <th>Style</th>
                <th style={{ textAlign: 'right' }}>Preview</th>
              </tr>
            </thead>
            <tbody>
              {labelActivities.slice(0, 4).map(lbl => (
                <tr key={lbl.id}>
                  <td><strong>{lbl.id}</strong></td>
                  <td>{lbl.customer}</td>
                  <td>{lbl.language}</td>
                  <td>
                    <span style={{ fontSize: 11, color: 'var(--admin-text-secondary)' }}>
                      {lbl.shape} • {lbl.font}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => setSelectedLabelForPreview(lbl)}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chronological Activity Feed */}
        <div className="admin-card">
          <div className="admin-section-header" style={{ marginBottom: 10 }}>
            <div className="admin-section-title">
              <Clock size={15} />
              <span>System Activity Stream</span>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => navigate('/admin/activity')}
            >
              Full Log
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activityLog.slice(0, 5).map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '6px 8px',
                  borderRadius: 4,
                  background: 'var(--admin-surface-subtle)',
                  border: '1px solid var(--admin-border)',
                  fontSize: 12
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'var(--admin-text-muted)',
                    fontFamily: 'monospace',
                    marginTop: 1
                  }}
                >
                  {item.time}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--admin-text-primary)' }}>{item.action}</div>
                  <div style={{ fontSize: 10, color: 'var(--admin-text-secondary)' }}>
                    Actor: {item.user} • Category: {item.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Label Preview Modal */}
      <LabelPreviewModal
        isOpen={Boolean(selectedLabelForPreview)}
        onClose={() => setSelectedLabelForPreview(null)}
        labelData={selectedLabelForPreview}
      />
    </div>
  );
};

export default DashboardOverview;
