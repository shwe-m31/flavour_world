import React from 'react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';

export const LabelPreviewModal = ({ isOpen, onClose, labelData }) => {
  if (!labelData) return null;

  const {
    id,
    order_id,
    customer,
    ingredient_count,
    language,
    shape = 'Square',
    font = 'Inter',
    background = 'White',
    generated_date,
    status = 'Generated',
    sample_preview = {
      primary: 'அரிசி',
      secondary: 'PONNI RICE',
      category: 'Grains & Cereals'
    }
  } = labelData;

  const shapeClass = `shape-${shape.toLowerCase()}`;
  const bgClass = `bg-${background.toLowerCase()}`;
  const fontFamilyStyle = font === 'Playfair Display' ? 'serif' : 'sans-serif';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Label Generation Specification — ${id}`}
      size="md"
      footer={
        <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
          Close Preview
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0', background: 'var(--admin-surface-gray)', borderRadius: 4 }}>
          <div
            className={`admin-label-preview ${shapeClass} ${bgClass}`}
            style={{
              fontFamily: `${font}, ${fontFamilyStyle}`,
              minWidth: shape.toLowerCase() === 'circle' ? 150 : 180,
              minHeight: shape.toLowerCase() === 'circle' ? 150 : 130,
              padding: '16px 20px',
              borderWidth: 1,
              borderStyle: background.toLowerCase() === 'minimal' ? 'dashed' : 'solid'
            }}
          >
            <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.7, marginBottom: 4 }}>
              {sample_preview.category || 'Pantry Staple'}
            </div>
            <div style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.2, margin: '2px 0 4px' }}>
              {sample_preview.primary || 'அரிசி'}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.85 }}>
              {sample_preview.secondary || 'RAW RICE'}
            </div>
            <div style={{ fontSize: 8, opacity: 0.5, marginTop: 8, letterSpacing: 0.5 }}>
              PANTRY SPEC • 100% ORGANIC
            </div>
          </div>
        </div>

        {/* Configuration Details Table */}
        <div style={{ border: '1px solid var(--admin-border)', borderRadius: 4, overflow: 'hidden' }}>
          <table className="admin-table" style={{ fontSize: 12 }}>
            <tbody>
              <tr>
                <td style={{ width: '40%', color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Order ID</td>
                <td><strong>{order_id}</strong></td>
              </tr>
              <tr>
                <td style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Customer</td>
                <td>{customer}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Language Pair</td>
                <td>{language}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Shape</td>
                <td>{shape}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Typography / Font</td>
                <td>{font}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Material / Background</td>
                <td>{background}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Labels in Batch</td>
                <td>{ingredient_count} labels</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Generated Date</td>
                <td>{generated_date}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Status</td>
                <td><StatusBadge status={status} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default LabelPreviewModal;
