import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Drawer = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = '560px'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="admin-drawer-overlay" onClick={onClose}>
      <div
        className="admin-drawer"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-drawer-header">
          <div>
            <div className="admin-modal-title">{title}</div>
            {subtitle && <div className="admin-breadcrumb">{subtitle}</div>}
          </div>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close panel">
            <X size={16} />
          </button>
        </div>
        <div className="admin-drawer-body">
          {children}
        </div>
        {footer && (
          <div className="admin-drawer-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;
