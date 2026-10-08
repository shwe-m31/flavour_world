import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@platform');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      navigate('/admin/overview');
    }, 400);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--admin-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        fontFamily: 'var(--admin-font)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          background: 'var(--admin-surface)',
          border: '1px solid var(--admin-border)',
          borderRadius: 'var(--admin-radius-md)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '24px 24px 18px', borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-surface-gray)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--admin-action-dark)', marginBottom: 4 }}>
            <ShieldCheck size={20} />
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: 0.5 }}>FLAVOUR WORLD ADMIN</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>
            Pantry Label Management Platform
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {error && (
            <div style={{ padding: '8px 12px', background: 'var(--admin-danger-bg)', color: 'var(--admin-danger)', border: '1px solid var(--admin-danger-border)', borderRadius: 4, fontSize: 12, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div className="admin-form-group">
            <label className="admin-form-label">Administrator ID / Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="admin-form-input"
                style={{ paddingLeft: 30 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            </div>
          </div>

          <div className="admin-form-group" style={{ marginBottom: 20 }}>
            <label className="admin-form-label">Access Token / Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="admin-form-input"
                style={{ paddingLeft: 30 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', height: 36, fontSize: 13 }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : (
              <>
                <span>Sign in to Administration</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--admin-border)', fontSize: 11, color: 'var(--admin-text-muted)', textAlign: 'center' }}>
            Authorized Personnel Only • Session Audit Enabled
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
