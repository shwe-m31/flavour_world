import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = String(status).toLowerCase().trim();

  let variant = 'neutral';

  // Payment & general operational statuses
  if (['paid', 'completed', 'active', 'delivered', 'generated', 'success', 'live customer', 'live order', 'live'].includes(normalized)) {
    variant = 'success';
  } else if (['pending', 'processing', 'draft', 'viewed'].includes(normalized)) {
    variant = 'warning';
  } else if (['failed', 'cancelled', 'deactivated', 'disabled', 'critical'].includes(normalized)) {
    variant = 'danger';
  } else if (['confirmed', 'shipped', 'dispatched', 'in transit', 'info', 'demo user', 'demo order', 'demo'].includes(normalized)) {
    variant = 'info';
  }

  return (
    <span className={`admin-badge admin-badge-${variant}`}>
      <span className="admin-badge-dot" />
      {status}
    </span>
  );
};

export default StatusBadge;
