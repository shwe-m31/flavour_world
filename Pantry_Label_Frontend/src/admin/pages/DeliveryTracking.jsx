import React, { useState, useMemo } from 'react';
import { Eye } from 'lucide-react';
import { useAdmin } from '../data/AdminContext';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

export const DeliveryTracking = () => {
  const { deliveries, updateDeliveryStatus } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Modal form states
  const [newStatus, setNewStatus] = useState('Shipped');
  const [newCarrier, setNewCarrier] = useState('BlueDart Express');
  const [newTracking, setNewTracking] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All Delivery Statuses' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' }
  ];

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(del => {
      const matchSearch =
        del.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        del.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        del.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (del.tracking_number && del.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = selectedStatus === 'all' || del.current_status === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [deliveries, searchTerm, selectedStatus]);

  const handleOpenUpdate = (delivery) => {
    setSelectedDelivery(delivery);
    setNewStatus(delivery.current_status);
    setNewCarrier(delivery.carrier || 'BlueDart Express');
    setNewTracking(delivery.tracking_number || '');
    setIsUpdateModalOpen(true);
  };

  const handleSaveDeliveryUpdate = (e) => {
    e.preventDefault();
    if (selectedDelivery) {
      updateDeliveryStatus(selectedDelivery.order_id, newStatus, newCarrier, newTracking);
      setIsUpdateModalOpen(false);
      setSelectedDelivery(prev => ({
        ...prev,
        current_status: newStatus,
        carrier: newCarrier,
        tracking_number: newTracking
      }));
    }
  };

  const columns = [
    {
      header: 'Order Ref',
      field: 'order_id',
      sortable: true,
      width: '110px',
      render: (val) => <strong>{val}</strong>
    },
    {
      header: 'Customer',
      field: 'customer',
      sortable: true
    },
    {
      header: 'Destination',
      field: 'destination',
      sortable: true
    },
    {
      header: 'Assigned Carrier',
      field: 'carrier',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{val || 'Unassigned'}</div>
          <div style={{ fontSize: 10, color: 'var(--admin-text-muted)' }}>{row.tracking_number || 'Pending AWB'}</div>
        </div>
      )
    },
    {
      header: 'Order Date',
      field: 'order_date',
      sortable: true
    },
    {
      header: 'Current Status',
      field: 'current_status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Last Updated',
      field: 'last_updated',
      sortable: true
    },
    {
      header: 'Est. Delivery',
      field: 'estimated_delivery',
      sortable: true
    },
    {
      header: 'Action',
      field: 'order_id',
      align: 'right',
      render: (val, row) => (
        <div style={{ display: 'inline-flex', gap: 6 }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => setSelectedDelivery(row)}
            title="Inspect Shipment"
          >
            <Eye size={12} />
            <span>Timeline</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={() => handleOpenUpdate(row)}
            title="Update Shipment Status"
          >
            Update
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
          <h2 className="admin-page-heading">Delivery Tracking & Logistics</h2>
          <p className="admin-page-subtitle">
            Courier API integration, real-time shipment checkpoints, and delivery fulfillment monitoring.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search by Order ID, Customer, Carrier, Destination..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: statusOptions
          }
        ]}
        onReset={() => {
          setSearchTerm('');
          setSelectedStatus('all');
        }}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredDeliveries}
        pageSize={8}
        keyField="order_id"
      />

      {/* Timeline Modal */}
      <Modal
        isOpen={Boolean(selectedDelivery && !isUpdateModalOpen)}
        onClose={() => setSelectedDelivery(null)}
        title={`Shipment Progress — ${selectedDelivery?.order_id}`}
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => handleOpenUpdate(selectedDelivery)}
            >
              Update Shipment Status
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setSelectedDelivery(null)}
            >
              Close
            </button>
          </div>
        }
      >
        {selectedDelivery && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Horizontal Timeline (Section 17) */}
            <div style={{ border: '1px solid var(--admin-border)', borderRadius: 4, padding: 16, background: 'var(--admin-surface)' }}>
              <div className="admin-timeline">
                <div className="admin-timeline-line" />
                <div className={`admin-timeline-step ${['Confirmed', 'Shipped', 'Delivered'].includes(selectedDelivery.current_status) ? 'completed' : ''}`}>
                  <div className="admin-timeline-dot">1</div>
                  <div className="admin-timeline-label">Confirmed</div>
                  <div className="admin-timeline-date">{selectedDelivery.order_date}</div>
                </div>
                <div className={`admin-timeline-step ${['Shipped', 'Delivered'].includes(selectedDelivery.current_status) ? 'completed' : selectedDelivery.current_status === 'Confirmed' ? 'current' : ''}`}>
                  <div className="admin-timeline-dot">2</div>
                  <div className="admin-timeline-label">Shipped</div>
                  <div className="admin-timeline-date">{selectedDelivery.current_status === 'Shipped' || selectedDelivery.current_status === 'Delivered' ? 'In transit' : 'Awaiting'}</div>
                </div>
                <div className={`admin-timeline-step ${selectedDelivery.current_status === 'Delivered' ? 'completed' : ''}`}>
                  <div className="admin-timeline-dot">3</div>
                  <div className="admin-timeline-label">Delivered</div>
                  <div className="admin-timeline-date">{selectedDelivery.estimated_delivery}</div>
                </div>
              </div>
            </div>

            {/* Shipment Metadata & Checkpoints */}
            <div className="admin-grid-2">
              <div style={{ border: '1px solid var(--admin-border)', borderRadius: 4, padding: 12, background: 'var(--admin-surface)' }}>
                <div className="admin-form-label">Shipment Details</div>
                <table className="admin-table">
                  <tbody>
                    <tr>
                      <td style={{ color: 'var(--admin-text-secondary)' }}>Carrier</td>
                      <td><strong>{selectedDelivery.carrier || 'Unassigned'}</strong></td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--admin-text-secondary)' }}>Waybill No.</td>
                      <td><code style={{ fontSize: 11 }}>{selectedDelivery.tracking_number || 'Pending'}</code></td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--admin-text-secondary)' }}>Recipient</td>
                      <td>{selectedDelivery.customer}</td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--admin-text-secondary)' }}>Delivery Hub</td>
                      <td>{selectedDelivery.destination}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ border: '1px solid var(--admin-border)', borderRadius: 4, padding: 12, background: 'var(--admin-surface)' }}>
                <div className="admin-form-label">Checkpoint History</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(selectedDelivery.history || []).map((h, idx) => (
                    <div key={idx} style={{ padding: '6px 8px', background: 'var(--admin-surface-gray)', borderRadius: 4, fontSize: 11 }}>
                      <div style={{ fontWeight: 600 }}>{h.status}</div>
                      <div style={{ color: 'var(--admin-text-secondary)', display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <span>{h.location}</span>
                        <span>{h.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Shipment Status Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title={`Update Logistics — ${selectedDelivery?.order_id}`}
        size="md"
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleSaveDeliveryUpdate}
            >
              Save Logistics Update
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveDeliveryUpdate}>
          <div className="admin-form-group">
            <label className="admin-form-label">Shipment Lifecycle Stage</label>
            <select
              className="admin-form-select"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Confirmed">Confirmed (Label printed & packed)</option>
              <option value="Shipped">Shipped (In transit with courier)</option>
              <option value="Delivered">Delivered (Successfully handed to recipient)</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Courier Logistics Partner</label>
            <select
              className="admin-form-select"
              value={newCarrier}
              onChange={(e) => setNewCarrier(e.target.value)}
            >
              <option value="BlueDart Express">BlueDart Express</option>
              <option value="Delhivery">Delhivery</option>
              <option value="India Post Speed">India Post Speed</option>
              <option value="Shadowfax">Shadowfax</option>
              <option value="DTDC Courier">DTDC Courier</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Airway Bill / Tracking Code</label>
            <input
              type="text"
              className="admin-form-input"
              placeholder="e.g. BLUEDART-8829104"
              value={newTracking}
              onChange={(e) => setNewTracking(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DeliveryTracking;
