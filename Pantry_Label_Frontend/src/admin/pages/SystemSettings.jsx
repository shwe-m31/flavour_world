import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Database, Shield, Bell } from 'lucide-react';
import { useAdmin } from '../data/AdminContext';

export const SystemSettings = () => {
  const { settings, setSettings, logActivity } = useAdmin();

  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(formData);
    logActivity('Updated platform system settings and commercial parameters', 'System');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-heading">System Settings</h2>
          <p className="admin-page-subtitle">
            Commercial tax configuration, default pricing thresholds, logistics rates, and database synchronization.
          </p>
        </div>
        <div className="admin-page-actions">
          {savedSuccess && (
            <span style={{ fontSize: 12, color: 'var(--admin-success)', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
              <CheckCircle2 size={14} /> Settings Saved
            </span>
          )}
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleSave}
          >
            <Save size={13} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Commercial & Tax Configuration */}
        <div className="admin-card">
          <div className="admin-section-title" style={{ marginBottom: 12 }}>
            Commercial & GST Rates
          </div>
          <div className="admin-grid-3">
            <div className="admin-form-group">
              <label className="admin-form-label">GST Tax Rate (%)</label>
              <input
                type="number"
                className="admin-form-input"
                value={formData.gstRate}
                onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
                required
              />
              <div className="admin-form-helper">Applied as 9% CGST + 9% SGST on printed goods.</div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                className="admin-form-input"
                value={formData.shippingFee}
                onChange={(e) => setFormData({ ...formData, shippingFee: Number(e.target.value) })}
                required
              />
              <div className="admin-form-helper">Applied to carts below free threshold.</div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                className="admin-form-input"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                required
              />
              <div className="admin-form-helper">Minimum order value for complimentary delivery.</div>
            </div>
          </div>
        </div>

        {/* Pricing Rules */}
        <div className="admin-card">
          <div className="admin-section-title" style={{ marginBottom: 12 }}>
            Label Catalogue Base Pricing
          </div>
          <div className="admin-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label">Default Label Unit Price (₹)</label>
              <input
                type="number"
                className="admin-form-input"
                value={formData.defaultLabelPrice}
                onChange={(e) => setFormData({ ...formData, defaultLabelPrice: Number(e.target.value) })}
                required
              />
              <div className="admin-form-helper">Base catalog unit price per ingredient label.</div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Payment Gateway Mode</label>
              <input
                type="text"
                className="admin-form-input"
                value={formData.razorpayEnvironment}
                onChange={(e) => setFormData({ ...formData, razorpayEnvironment: e.target.value })}
              />
              <div className="admin-form-helper">Razorpay API Key & Webhook Mode.</div>
            </div>
          </div>
        </div>

        {/* Database & Infrastructure Sync */}
        <div className="admin-card">
          <div className="admin-section-title" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Database size={15} />
            <span>Database Synchronization Status</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div style={{ padding: 10, background: 'var(--admin-surface-gray)', borderRadius: 4, border: '1px solid var(--admin-border)' }}>
              <div className="admin-form-label">Database Connection</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-success)' }}>
                ● {formData.dbSyncStatus}
              </div>
            </div>
            <div style={{ padding: 10, background: 'var(--admin-surface-gray)', borderRadius: 4, border: '1px solid var(--admin-border)' }}>
              <div className="admin-form-label">Last Automated Backup</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>
                {formData.lastDbBackup}
              </div>
            </div>
            <div style={{ padding: 10, background: 'var(--admin-surface-gray)', borderRadius: 4, border: '1px solid var(--admin-border)' }}>
              <div className="admin-form-label">Admin Support Endpoint</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>
                {formData.supportEmail}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;
