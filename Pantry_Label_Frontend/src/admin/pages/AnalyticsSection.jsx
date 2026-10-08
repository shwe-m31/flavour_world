import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, ShoppingBag, CreditCard, Tag, Globe } from 'lucide-react';
import { useAdmin } from '../data/AdminContext';
import KpiCard from '../components/KpiCard';
import { ClinicalBarChart, ClinicalDistributionBar } from '../components/ClinicalChart';

export const AnalyticsSection = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'revenue', 'users', 'labels'

  // Daily Order Trend (September 2026)
  const orderTrend = [
    { label: '01 Sep', value: 28 },
    { label: '03 Sep', value: 35 },
    { label: '05 Sep', value: 42 },
    { label: '07 Sep', value: 48 },
    { label: '09 Sep', value: 44 },
    { label: '11 Sep', value: 64 },
    { label: '12 Sep', value: 72 }
  ];

  // Daily Revenue Trend in Thousands (₹)
  const revenueTrend = [
    { label: '01 Sep', value: 11 },
    { label: '03 Sep', value: 14 },
    { label: '05 Sep', value: 17 },
    { label: '07 Sep', value: 19 },
    { label: '09 Sep', value: 18 },
    { label: '11 Sep', value: 26 },
    { label: '12 Sep', value: 29 }
  ];

  // Users by State Share
  const stateDistribution = [
    { label: 'Tamil Nadu', value: 33, count: '412 users', color: '#202124' },
    { label: 'Karnataka', value: 23, count: '285 users', color: '#4267A9' },
    { label: 'Kerala', value: 16, count: '194 users', color: '#238B5A' },
    { label: 'Maharashtra', value: 14, count: '178 users', color: '#B7791F' },
    { label: 'West Bengal', value: 8, count: '104 users', color: '#8A8F94' },
    { label: 'Others (TS/AP/DL)', value: 6, count: '75 users', color: '#D5D8DB' }
  ];

  // Top Selected Ingredients
  const topIngredients = [
    { label: 'Rice (Ponni)', value: 38, count: '1,460 labels', color: '#202124' },
    { label: 'Toor Dal', value: 32, count: '1,228 labels', color: '#4267A9' },
    { label: 'Mustard Seeds', value: 28, count: '1,075 labels', color: '#238B5A' },
    { label: 'Turmeric Powder', value: 25, count: '960 labels', color: '#B7791F' },
    { label: 'Cumin Seeds', value: 22, count: '845 labels', color: '#8A8F94' }
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-heading">Platform Analytics</h2>
          <p className="admin-page-subtitle">
            Operational telemetry, commercial volume, label customization metrics, and regional demographics.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid var(--admin-border)', paddingBottom: 8 }}>
        <button
          type="button"
          className={`admin-btn ${activeTab === 'orders' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag size={13} />
          <span>Order Analytics</span>
        </button>
        <button
          type="button"
          className={`admin-btn ${activeTab === 'revenue' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('revenue')}
        >
          <CreditCard size={13} />
          <span>Revenue Analytics</span>
        </button>
        <button
          type="button"
          className={`admin-btn ${activeTab === 'users' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={13} />
          <span>User Demographics</span>
        </button>
        <button
          type="button"
          className={`admin-btn ${activeTab === 'labels' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('labels')}
        >
          <Tag size={13} />
          <span>Label & Ingredient Analytics</span>
        </button>
      </div>

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div>
          <div className="admin-kpi-grid">
            <KpiCard label="Orders Today" value="72" trend="+12.5%" trendType="positive" context="vs yesterday" />
            <KpiCard label="Orders This Week" value="370" trend="+8.4%" trendType="positive" context="vs last week" />
            <KpiCard label="Orders This Month" value="586" trend="+14.2%" trendType="positive" context="Sep 2026 MTD" />
            <KpiCard label="Fulfillment Rate" value="92.8%" context="544 completed" />
          </div>
          <div className="admin-grid-2">
            <ClinicalBarChart
              title="Daily Order Trajectory (September 2026)"
              data={orderTrend}
              unit=" orders"
              height={190}
            />
            <div className="admin-card">
              <div className="admin-section-title" style={{ marginBottom: 12 }}>
                Order Status Distribution (Month to Date)
              </div>
              <table className="admin-table">
                <tbody>
                  <tr>
                    <td>Completed & Delivered</td>
                    <td className="num"><strong>512</strong></td>
                    <td className="num" style={{ color: 'var(--admin-success)' }}>87.4%</td>
                  </tr>
                  <tr>
                    <td>In Fulfillment (Packing/Transit)</td>
                    <td className="num"><strong>42</strong></td>
                    <td className="num" style={{ color: 'var(--admin-warning)' }}>7.2%</td>
                  </tr>
                  <tr>
                    <td>Payment Pending Verification</td>
                    <td className="num"><strong>8</strong></td>
                    <td className="num" style={{ color: 'var(--admin-text-muted)' }}>1.4%</td>
                  </tr>
                  <tr>
                    <td>Cancelled / Refunded</td>
                    <td className="num"><strong>24</strong></td>
                    <td className="num" style={{ color: 'var(--admin-danger)' }}>4.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Revenue */}
      {activeTab === 'revenue' && (
        <div>
          <div className="admin-kpi-grid">
            <KpiCard label="Today's Revenue" value="₹29,140" trend="+14.8%" trendType="positive" />
            <KpiCard label="Weekly Revenue" value="₹1,48,200" trend="+10.2%" trendType="positive" />
            <KpiCard label="Monthly Revenue" value="₹2,34,500" trend="+9.8%" trendType="positive" />
            <KpiCard label="Average Order Value" value="₹399.80" context="~24 labels per cart" />
          </div>
          <div className="admin-grid-2">
            <ClinicalBarChart
              title="Daily Gross Volume in Thousands ₹ (September 2026)"
              data={revenueTrend}
              unit="k ₹"
              height={190}
              barColor="#238B5A"
            />
            <div className="admin-card">
              <div className="admin-section-title" style={{ marginBottom: 12 }}>
                Payment Gateway & Method Breakdown
              </div>
              <table className="admin-table">
                <tbody>
                  <tr>
                    <td>UPI (Google Pay, PhonePe, Paytm)</td>
                    <td className="num"><strong>₹1,68,840</strong></td>
                    <td className="num">72.0%</td>
                  </tr>
                  <tr>
                    <td>Credit / Debit Cards (Razorpay)</td>
                    <td className="num"><strong>₹46,900</strong></td>
                    <td className="num">20.0%</td>
                  </tr>
                  <tr>
                    <td>NetBanking (HDFC, ICICI, SBI)</td>
                    <td className="num"><strong>₹18,760</strong></td>
                    <td className="num">8.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div>
          <div className="admin-kpi-grid">
            <KpiCard label="Total Registered Users" value="1,248" trend="+8.2%" trendType="positive" />
            <KpiCard label="Active Users (30d)" value="894" context="71.6% active" />
            <KpiCard label="Multi-Order Customers" value="418" context="33.5% repeat rate" />
            <KpiCard label="States Represented" value="12" context="South & West Hubs" />
          </div>
          <div className="admin-grid-2">
            <ClinicalDistributionBar
              title="User Distribution by State of Origin"
              items={stateDistribution}
            />
            <div className="admin-card">
              <div className="admin-section-title" style={{ marginBottom: 12 }}>
                Customer Kitchen Profiles
              </div>
              <table className="admin-table">
                <tbody>
                  <tr>
                    <td>Traditional South Indian Kitchen</td>
                    <td className="num"><strong>482</strong></td>
                    <td className="num">38.6%</td>
                  </tr>
                  <tr>
                    <td>Modern Minimalist Modular</td>
                    <td className="num"><strong>340</strong></td>
                    <td className="num">27.2%</td>
                  </tr>
                  <tr>
                    <td>Heritage Bengali / Regional</td>
                    <td className="num"><strong>224</strong></td>
                    <td className="num">17.9%</td>
                  </tr>
                  <tr>
                    <td>Organic Farmhouse / Glass Jar</td>
                    <td className="num"><strong>202</strong></td>
                    <td className="num">16.3%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Labels */}
      {activeTab === 'labels' && (
        <div>
          <div className="admin-kpi-grid">
            <KpiCard label="Total Labels Rendered" value="3,842" trend="+18.5%" trendType="positive" />
            <KpiCard label="Average Labels / Order" value="22.4" context="standard pantry set" />
            <KpiCard label="Top Language Pair" value="Tamil + English" context="36% of all orders" />
            <KpiCard label="Top Material" value="White Matte Vinyl" context="Waterproof & Oil-resistant" />
          </div>
          <div className="admin-grid-2">
            <ClinicalDistributionBar
              title="Most Frequently Ordered Pantry Ingredients"
              items={topIngredients}
            />
            <div className="admin-card">
              <div className="admin-section-title" style={{ marginBottom: 12 }}>
                Customization Feature Adoption
              </div>
              <table className="admin-table">
                <tbody>
                  <tr>
                    <td>Bilingual Vernacular + English Mode</td>
                    <td className="num"><strong>3,573</strong></td>
                    <td className="num">93.0%</td>
                  </tr>
                  <tr>
                    <td>Square Label Die-Cut</td>
                    <td className="num"><strong>1,844</strong></td>
                    <td className="num">48.0%</td>
                  </tr>
                  <tr>
                    <td>Inter Clean Typography</td>
                    <td className="num"><strong>1,997</strong></td>
                    <td className="num">52.0%</td>
                  </tr>
                  <tr>
                    <td>Kraft Paper Eco Aesthetic</td>
                    <td className="num"><strong>768</strong></td>
                    <td className="num">20.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsSection;
