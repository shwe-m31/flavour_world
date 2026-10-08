import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export const FilterBar = ({
  searchPlaceholder = 'Search records...',
  searchValue = '',
  onSearchChange,
  filters = [],
  onReset,
  extraActions
}) => {
  const hasActiveFilters = searchValue || filters.some(f => f.value && f.value !== 'all' && f.value !== '');

  return (
    <div className="admin-filter-bar">
      {onSearchChange && (
        <div style={{ position: 'relative', minWidth: 220 }}>
          <input
            type="text"
            className="admin-filter-input"
            style={{ paddingLeft: 28, width: '100%' }}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search
            size={13}
            style={{
              position: 'absolute',
              left: 9,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--admin-text-muted)',
              pointerEvents: 'none'
            }}
          />
        </div>
      )}

      {filters.map((filter, idx) => (
        <select
          key={idx}
          className="admin-filter-select"
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
        >
          {filter.options.map((opt, optIdx) => (
            <option key={optIdx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}

      {hasActiveFilters && onReset && (
        <button
          type="button"
          className="admin-filter-reset"
          onClick={onReset}
          title="Reset all filters"
        >
          <RotateCcw size={11} style={{ display: 'inline', marginRight: 4 }} />
          Reset
        </button>
      )}

      {extraActions && (
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {extraActions}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
