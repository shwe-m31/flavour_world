import React from 'react';

export const ClinicalBarChart = ({
  title,
  data = [], // [{ label: 'Mon', value: 45 }, ...]
  height = 160,
  barColor = '#202124',
  unit = ''
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 10);
  const chartHeight = height - 40;

  return (
    <div className="admin-chart-box">
      <div className="admin-chart-header">
        <span className="admin-chart-title">{title}</span>
      </div>
      <div style={{ position: 'relative', height: height, paddingTop: 10 }}>
        {/* Y Axis reference lines */}
        <div style={{ position: 'absolute', inset: '10px 0 30px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
          <div style={{ borderBottom: '1px dashed var(--admin-border)', width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
            <span style={{ fontSize: 9, color: 'var(--admin-text-muted)', transform: 'translateY(-50%)', marginLeft: -30 }}>{maxValue}</span>
          </div>
          <div style={{ borderBottom: '1px dashed var(--admin-border)', width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
            <span style={{ fontSize: 9, color: 'var(--admin-text-muted)', transform: 'translateY(-50%)', marginLeft: -30 }}>{Math.round(maxValue / 2)}</span>
          </div>
          <div style={{ borderBottom: '1px solid var(--admin-border)', width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
            <span style={{ fontSize: 9, color: 'var(--admin-text-muted)', transform: 'translateY(-50%)', marginLeft: -30 }}>0</span>
          </div>
        </div>

        {/* Bars */}
        <div style={{ marginLeft: 35, height: chartHeight, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6, position: 'relative', zIndex: 2 }}>
          {data.map((item, idx) => {
            const barHeightPct = (item.value / maxValue) * 100;
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: 10, color: 'var(--admin-text-secondary)', marginBottom: 2, fontWeight: 500 }}>
                  {item.value}{unit}
                </div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 32,
                    height: `${barHeightPct}%`,
                    background: barColor,
                    borderRadius: '2px 2px 0 0',
                    transition: 'height 0.3s ease'
                  }}
                  title={`${item.label}: ${item.value} ${unit}`}
                />
                <div style={{ fontSize: 10, color: 'var(--admin-text-muted)', marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const ClinicalDistributionBar = ({
  title,
  items = [] // [{ label: 'Tamil', value: 45, count: '1,383 labels', color: '#202124' }, ...]
}) => {
  return (
    <div className="admin-chart-box">
      <div className="admin-chart-header">
        <span className="admin-chart-title">{title}</span>
      </div>
      <div style={{ marginBottom: 12 }}>
        {/* Horizontal multi-segmented bar */}
        <div style={{ height: 14, width: '100%', display: 'flex', borderRadius: 2, overflow: 'hidden', border: '1px solid var(--admin-border)' }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                width: `${item.value}%`,
                background: item.color || '#5F6368',
                height: '100%'
              }}
              title={`${item.label}: ${item.value}% (${item.count})`}
            />
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px 12px' }}>
        {items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: item.color || '#5F6368' }} />
              <span style={{ color: 'var(--admin-text-primary)' }}>{item.label}</span>
            </div>
            <span style={{ color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
              {item.count ? `${item.count} (${item.value}%)` : `${item.value}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
