import React, { useState } from 'react';
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
  const { orders, labelActivities, activityLog } = useAdmin();
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

  // Daily orders chart data
  const weeklyOrderTrend = [
    { label: '06 Sep', value: 38 },
    { label: '07 Sep', value: 42 },
    { label: '08 Sep', value: 49 },
    { label: '09 Sep', value: 44 },
    { label: '10 Sep', value: 58 },
    { label: '11 Sep', value: 64 },
    { label: '12 Sep', value: 72 }
  ];

  // Language distribution data
  const languageDistribution = [
    { label: 'Tamil (தமிழ்)', value: 36, count: '1,383 labels', color: '#202124' },
    { label: 'Kannada (ಕನ್ನಡ)', value: 24, count: '922 labels', color: '#4267A9' },
    { label: 'Malayalam (മലയാളം)', value: 18, count: '691 labels', color: '#238B5A' },
    { label: 'Marathi (मराठी)', value: 14, count: '537 labels', color: '#B7791F' },
    { label: 'Bengali (বাংলা)', value: 8, count: '309 labels', color: '#8A8F94' }
  ];

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
          value="1,248"
          trend="+8.2%"
          trendType="positive"
          context="this month"
          icon={Users}
        />
        <KpiCard
          label="New Users"
          value="86"
          trend="+14%"
          trendType="positive"
          context="vs last week"
          icon={Users}
        />
        <KpiCard
          label="Total Labels Generated"
          value="3,842"
          trend="+18.5%"
          trendType="positive"
          context="this month"
          icon={Tag}
        />
        <KpiCard
          label="Total Orders"
          value="586"
          trend="+12.4%"
          trendType="positive"
          context="this month"
          icon={ShoppingBag}
        />
        <KpiCard
          label="Pending Orders"
          value="42"
          trend="Action required"
          trendType="negative"
          context="awaiting print/ship"
          icon={Clock}
        />
        <KpiCard
          label="Revenue"
          value="₹2,34,500"
          trend="+9.8%"
          trendType="positive"
          context="gross volume"
          icon={CreditCard}
        />
        <KpiCard
          label="Active Languages"
          value="5"
          trend="80/80"
          trendType="positive"
          context="full coverage"
          icon={Globe}
        />
        <KpiCard
          label="Products / Ingredients"
          value="80+"
          context="8 categories mapped"
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
