import React, { useState, useMemo } from 'react';
import { Users, Eye, ShieldAlert, CheckCircle, MapPin, Mail, Phone, ShoppingBag, Download } from 'lucide-react';
import { useAdmin } from '../data/AdminContext';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import StatusBadge from '../components/StatusBadge';
import Drawer from '../components/Drawer';

export const UsersManagement = () => {
  const { users, toggleUserStatus, states, languages, orders } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUserForDetail, setSelectedUserForDetail] = useState(null);

  // Filter options
  const stateOptions = [
    { value: 'all', label: 'All States' },
    ...states.map(s => ({ value: s.name, label: s.name }))
  ];

  const languageOptions = [
    { value: 'all', label: 'All Languages' },
    ...languages.map(l => ({ value: l.name, label: l.name }))
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Deactivated', label: 'Deactivated' }
  ];

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm);
      const matchState = selectedState === 'all' || user.state === selectedState;
      const matchLanguage = selectedLanguage === 'all' || user.language === selectedLanguage;
      const matchStatus = selectedStatus === 'all' || user.status === selectedStatus;

      return matchSearch && matchState && matchLanguage && matchStatus;
    });
  }, [users, searchTerm, selectedState, selectedLanguage, selectedStatus]);

  const userOrders = useMemo(() => {
    if (!selectedUserForDetail) return [];
    return orders.filter(o => o.user_id === selectedUserForDetail.id || o.customer_name === selectedUserForDetail.name);
  }, [selectedUserForDetail, orders]);

  const columns = [
    {
      header: 'Customer Name',
      field: 'name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{row.email}</div>
        </div>
      )
    },
    {
      header: 'State',
      field: 'state',
      sortable: true
    },
    {
      header: 'Language',
      field: 'language',
      sortable: true
    },
    {
      header: 'Kitchen Type',
      field: 'kitchen_type',
      sortable: true
    },
    {
      header: 'Orders',
      field: 'orders_count',
      align: 'right',
      sortable: true,
      render: (val) => `${val} orders`
    },
    {
      header: 'Total Spent',
      field: 'total_spent',
      align: 'right',
      sortable: true,
      render: (val) => <strong>₹{val}</strong>
    },
    {
      header: 'Registered',
      field: 'registered_date',
      sortable: true
    },
    {
      header: 'Status',
      field: 'status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Actions',
      field: 'id',
      align: 'right',
      render: (val, row) => (
        <div style={{ display: 'inline-flex', gap: 6 }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => setSelectedUserForDetail(row)}
            title="View Full Profile"
          >
            <Eye size={12} />
            <span>Profile</span>
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${row.status === 'Active' ? 'admin-btn-secondary' : 'admin-btn-primary'}`}
            onClick={() => toggleUserStatus(row.id)}
            title={row.status === 'Active' ? 'Deactivate User' : 'Activate User'}
          >
            {row.status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-heading">User Management</h2>
          <p className="admin-page-subtitle">
            Customer directory, regional preferences, kitchen profiles and account status.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => alert(`Exporting ${filteredUsers.length} user records to CSV.`)}
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search by name, email, phone..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            value: selectedState,
            onChange: setSelectedState,
            options: stateOptions
          },
          {
            value: selectedLanguage,
            onChange: setSelectedLanguage,
            options: languageOptions
          },
          {
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: statusOptions
          }
        ]}
        onReset={() => {
          setSearchTerm('');
          setSelectedState('all');
          setSelectedLanguage('all');
          setSelectedStatus('all');
        }}
      />

      {/* Users DataTable */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        pageSize={8}
        keyField="id"
      />

      {/* User Profile Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedUserForDetail)}
        onClose={() => setSelectedUserForDetail(null)}
        title="Customer Profile & Preferences"
        subtitle={`ID: USR-00${selectedUserForDetail?.id} • Registered ${selectedUserForDetail?.registered_date}`}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <button
              type="button"
              className={`admin-btn ${selectedUserForDetail?.status === 'Active' ? 'admin-btn-danger' : 'admin-btn-primary'}`}
              onClick={() => {
                if (selectedUserForDetail) {
                  toggleUserStatus(selectedUserForDetail.id);
                  setSelectedUserForDetail(prev => ({
                    ...prev,
                    status: prev.status === 'Active' ? 'Deactivated' : 'Active'
                  }));
                }
              }}
            >
              {selectedUserForDetail?.status === 'Active' ? 'Deactivate Account' : 'Reactivate Account'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setSelectedUserForDetail(null)}
            >
              Close
            </button>
          </div>
        }
      >
        {selectedUserForDetail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Primary Profile Details */}
            <div style={{ border: '1px solid var(--admin-border)', borderRadius: 4, padding: 14, background: 'var(--admin-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{selectedUserForDetail.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mail size={12} /> {selectedUserForDetail.email}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <Phone size={12} /> {selectedUserForDetail.phone}
                  </div>
                </div>
                <StatusBadge status={selectedUserForDetail.status} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--admin-border)' }}>
                <div>
                  <div className="admin-form-label">State Origin</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{selectedUserForDetail.state}</div>
                </div>
                <div>
                  <div className="admin-form-label">Preferred Script</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{selectedUserForDetail.language}</div>
                </div>
                <div>
                  <div className="admin-form-label">Kitchen Setup</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{selectedUserForDetail.kitchen_type}</div>
                </div>
                <div>
                  <div className="admin-form-label">Lifetime Value</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>₹{selectedUserForDetail.total_spent}</div>
                </div>
              </div>
            </div>

            {/* Saved Delivery Address */}
            <div style={{ border: '1px solid var(--admin-border)', borderRadius: 4, padding: 14, background: 'var(--admin-surface)' }}>
              <div className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                <MapPin size={13} /> Saved Shipping Address
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--admin-text-primary)' }}>
                {selectedUserForDetail.address ? (
                  <>
                    <div>{selectedUserForDetail.address.flat}</div>
                    <div>{selectedUserForDetail.address.street}</div>
                    <div>{selectedUserForDetail.address.city}, {selectedUserForDetail.address.state} - <strong>{selectedUserForDetail.address.pincode}</strong></div>
                  </>
                ) : (
                  <div style={{ color: 'var(--admin-text-muted)' }}>No primary address saved yet.</div>
                )}
              </div>
            </div>

            {/* Order History */}
            <div style={{ border: '1px solid var(--admin-border)', borderRadius: 4, padding: 14, background: 'var(--admin-surface)' }}>
              <div className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                <ShoppingBag size={13} /> Order History ({userOrders.length})
              </div>
              {userOrders.length === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>No previous orders placed.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {userOrders.map(ord => (
                    <div
                      key={ord.id}
                      style={{
                        padding: '8px 10px',
                        background: 'var(--admin-surface-gray)',
                        borderRadius: 4,
                        border: '1px solid var(--admin-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 12
                      }}
                    >
                      <div>
                        <strong>{ord.order_number}</strong> • {ord.date}
                        <div style={{ fontSize: 11, color: 'var(--admin-text-secondary)' }}>
                          {ord.labels_count} labels ({ord.language})
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600 }}>₹{ord.amount}</div>
                        <StatusBadge status={ord.order_status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default UsersManagement;
