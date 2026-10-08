import React, { useState, useMemo } from 'react';
import { Clock, Search, Filter, ShieldCheck, Download } from 'lucide-react';
import { useAdmin } from '../data/AdminContext';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';

export const ActivityLog = () => {
  const { activityLog } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'Order', label: 'Order' },
    { value: 'Payment', label: 'Payment' },
    { value: 'Delivery', label: 'Delivery' },
    { value: 'Translation', label: 'Translation' },
    { value: 'Catalogue', label: 'Catalogue' },
    { value: 'User', label: 'User' },
    { value: 'System', label: 'System' }
  ];

  const filteredLogs = useMemo(() => {
    return activityLog.filter(log => {
      const matchSearch =
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.time.includes(searchTerm);
      const matchCat = selectedCategory === 'all' || log.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [activityLog, searchTerm, selectedCategory]);

  const columns = [
    {
      header: 'Time',
      field: 'time',
      width: '90px',
      render: (val, row) => (
        <div>
          <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 12 }}>{val}</span>
          <div style={{ fontSize: 10, color: 'var(--admin-text-muted)' }}>{row.date}</div>
        </div>
      )
    },
    {
      header: 'Administrative Event / Action',
      field: 'action',
      render: (val) => <span style={{ fontWeight: 500 }}>{val}</span>
    },
    {
      header: 'Actor / Source',
      field: 'user',
      sortable: true,
      render: (val) => (
        <span style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>
          {val}
        </span>
      )
    },
    {
      header: 'Category',
      field: 'category',
      sortable: true,
      render: (val) => (
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            padding: '2px 6px',
            borderRadius: 3,
            background: 'var(--admin-surface-gray)',
            border: '1px solid var(--admin-border)'
          }}
        >
          {val}
        </span>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-heading">System Activity Log</h2>
          <p className="admin-page-subtitle">
            Immutable chronological audit stream of all administrator actions, translation updates, and system events.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => alert(`Exported ${filteredLogs.length} audit trail rows.`)}
          >
            <Download size={13} />
            <span>Export Audit Log</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search audit events, actors, timestamps..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            value: selectedCategory,
            onChange: setSelectedCategory,
            options: categoryOptions
          }
        ]}
        onReset={() => {
          setSearchTerm('');
          setSelectedCategory('all');
        }}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        pageSize={12}
        keyField="id"
      />
    </div>
  );
};

export default ActivityLog;
