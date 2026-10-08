import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AttentionSection = ({ items = [] }) => {
  const navigate = useNavigate();

  const defaultItems = [
    { label: 'Orders awaiting processing', count: 42, type: 'warning', path: '/admin/orders' },
    { label: 'Payments requiring verification', count: 8, type: 'warning', path: '/admin/payments' },
    { label: 'Ingredients missing translations', count: 13, type: 'critical', path: '/admin/languages' },
    { label: 'Failed payments today', count: 5, type: 'critical', path: '/admin/payments' },
    { label: 'Deliveries requiring dispatch', count: 7, type: 'warning', path: '/admin/delivery' }
  ];

  const alertItems = items.length > 0 ? items : defaultItems;

  return (
    <div className="admin-alert-banner">
      <div className="admin-alert-header">
        <AlertTriangle size={14} />
        <span>Requires Immediate Operational Attention</span>
      </div>
      <div className="admin-alert-items">
        {alertItems.map((item, idx) => (
          <div
            key={idx}
            className={`admin-alert-chip ${item.type === 'critical' ? 'critical' : ''}`}
            onClick={() => item.path && navigate(item.path)}
            role="button"
            tabIndex={0}
          >
            <span className="count-badge">{item.count}</span>
            <span>{item.label}</span>
            <ArrowRight size={11} style={{ opacity: 0.5, marginLeft: 2 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttentionSection;
