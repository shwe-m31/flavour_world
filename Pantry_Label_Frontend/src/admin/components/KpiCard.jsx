import React from 'react';

export const KpiCard = ({ label, value, context, trend, trendType = 'neutral', icon: Icon }) => {
  return (
    <div className="admin-kpi-card">
      <div className="admin-kpi-label">
        <span>{label}</span>
        {Icon && <Icon size={14} className="text-muted" style={{ opacity: 0.6 }} />}
      </div>
      <div className="admin-kpi-value">{value}</div>
      {(context || trend) && (
        <div className="admin-kpi-context">
          {trend && (
            <span
              className={
                trendType === 'positive'
                  ? 'admin-kpi-trend-positive'
                  : trendType === 'negative'
                  ? 'admin-kpi-trend-negative'
                  : ''
              }
            >
              {trend}
            </span>
          )}
          {context && <span>{context}</span>}
        </div>
      )}
    </div>
  );
};

export default KpiCard;
