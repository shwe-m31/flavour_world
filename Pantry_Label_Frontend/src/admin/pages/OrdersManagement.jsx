import React, { useState, useMemo } from 'react';
import { Eye, Download, User, Tag, CreditCard } from 'lucide-react';
import { useAdmin } from '../data/AdminContext';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import StatusBadge from '../components/StatusBadge';
import Drawer from '../components/Drawer';
import Modal from '../components/Modal';

export const OrdersManagement = () => {
  const { orders, updateOrderStatus, updateDeliveryStatus } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status update modal
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [nextOrderStatus, setNextOrderStatus] = useState('Confirmed');
  const [nextDeliveryStatus, setNextDeliveryStatus] = useState('Processing');
  const [carrierInput, setCarrierInput] = useState('BlueDart Express');
  const [trackingInput, setTrackingInput] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All Order Statuses' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const paymentOptions = [
    { value: 'all', label: 'All Payments' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Failed', label: 'Failed' }
  ];

  const deliveryOptions = [
    { value: 'all', label: 'All Delivery Statuses' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' }
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      const matchSearch =
        ord.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ord.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ord.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = selectedStatus === 'all' || ord.order_status === selectedStatus;
      const matchPayment = selectedPaymentStatus === 'all' || ord.payment_status === selectedPaymentStatus;
      const matchDelivery = selectedDeliveryStatus === 'all' || ord.delivery_status === selectedDeliveryStatus;

      return matchSearch && matchStatus && matchPayment && matchDelivery;
    });
  }, [orders, searchTerm, selectedStatus, selectedPaymentStatus, selectedDeliveryStatus]);

  const handleOpenStatusUpdate = (order) => {
    setSelectedOrder(order);
    setNextOrderStatus(order.order_status);
    setNextDeliveryStatus(order.delivery_status);
    setCarrierInput(order.carrier || 'BlueDart Express');
    setTrackingInput(order.tracking_number || '');
    setIsUpdateStatusModalOpen(true);
  };

  const handleSaveStatus = (e) => {
    e.preventDefault();
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, nextOrderStatus);
      updateDeliveryStatus(selectedOrder.id, nextDeliveryStatus, carrierInput, trackingInput);
      setIsUpdateStatusModalOpen(false);
      // update current viewed order
      setSelectedOrder(prev => ({
        ...prev,
        order_status: nextOrderStatus,
        delivery_status: nextDeliveryStatus,
        carrier: carrierInput,
        tracking_number: trackingInput
      }));
    }
  };

  const columns = [
    {
      header: 'Order ID',
      field: 'order_number',
      sortable: true,
      width: '100px',
      render: (val) => <strong>{val}</strong>
    },
    {
      header: 'Customer',
      field: 'customer_name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{row.customer_email}</div>
        </div>
      )
    },
    {
      header: 'Date',
      field: 'date',
      sortable: true
    },
    {
      header: 'Labels',
      field: 'labels_count',
      align: 'right',
      sortable: true,
      render: (val) => `${val} labels`
    },
    {
      header: 'Amount',
      field: 'amount',
      align: 'right',
      sortable: true,
      render: (val) => <strong>₹{Number(val).toFixed(2)}</strong>
    },
    {
      header: 'Payment',
      field: 'payment_status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Order Status',
      field: 'order_status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Delivery',
      field: 'delivery_status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Action',
      field: 'id',
      align: 'right',
      render: (val, row) => (
        <button
          type="button"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          onClick={() => setSelectedOrder(row)}
        >
          <Eye size={12} />
          <span>Details</span>
        </button>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-heading">Order Management</h2>
          <p className="admin-page-subtitle">
            Customer order registry, payment verification, fulfillment pipeline and label dispatch.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => alert(`Exporting ${filteredOrders.length} orders`)}
          >
            <Download size={13} />
            <span>Export Orders</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search by Order ID, Customer, Email..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: statusOptions
          },
          {
            value: selectedPaymentStatus,
            onChange: setSelectedPaymentStatus,
            options: paymentOptions
          },
          {
            value: selectedDeliveryStatus,
            onChange: setSelectedDeliveryStatus,
            options: deliveryOptions
          }
        ]}
        onReset={() => {
          setSearchTerm('');
          setSelectedStatus('all');
          setSelectedPaymentStatus('all');
          setSelectedDeliveryStatus('all');
        }}
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        pageSize={10}
        keyField="id"
      />

      {/* Structured Order Detail View (Section 41 Layout) */}
      <Drawer
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details — ${selectedOrder?.order_number}`}
        subtitle={`Placed on ${selectedOrder?.date} • Amount ₹${selectedOrder?.amount}`}
        width="680px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => handleOpenStatusUpdate(selectedOrder)}
            >
              Update Order / Delivery Status
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        }
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Delivery Timeline (Section 17 & 41) */}
            <div style={{ border: '1px solid var(--admin-border)', borderRadius: 4, padding: 14, background: 'var(--admin-surface)' }}>
              <div className="admin-form-label" style={{ marginBottom: 12 }}>
                Fulfillment Timeline
              </div>
              <div className="admin-timeline">
                <div className="admin-timeline-line" />
                <div className={`admin-timeline-step ${['Confirmed', 'Shipped', 'Delivered'].includes(selectedOrder.delivery_status) ? 'completed' : ''}`}>
                  <div className="admin-timeline-dot">1</div>
                  <div className="admin-timeline-label">Confirmed</div>
                  <div className="admin-timeline-date">{selectedOrder.date}</div>
                </div>
                <div className={`admin-timeline-step ${['Shipped', 'Delivered'].includes(selectedOrder.delivery_status) ? 'completed' : selectedOrder.delivery_status === 'Processing' ? 'current' : ''}`}>
                  <div className="admin-timeline-dot">2</div>
                  <div className="admin-timeline-label">Shipped</div>
                  <div className="admin-timeline-date">{selectedOrder.delivery_status === 'Shipped' || selectedOrder.delivery_status === 'Delivered' ? 'In transit' : 'Pending'}</div>
                </div>
                <div className={`admin-timeline-step ${selectedOrder.delivery_status === 'Delivered' ? 'completed' : ''}`}>
                  <div className="admin-timeline-dot">3</div>
                  <div className="admin-timeline-label">Delivered</div>
                  <div className="admin-timeline-date">{selectedOrder.estimated_delivery}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--admin-text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Carrier: <strong>{selectedOrder.carrier || 'Unassigned'}</strong></span>
                <span>Tracking: <code>{selectedOrder.tracking_number || 'Awaiting dispatch'}</code></span>
              </div>
            </div>

            {/* Two-Column Information Layout */}
            <div className="admin-grid-2">
              {/* Customer Box */}
              <div style={{ border: '1px solid var(--admin-border)', borderRadius: 4, padding: 12, background: 'var(--admin-surface)' }}>
                <div className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                  <User size={12} /> Customer Information
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedOrder.customer_name}</div>
                <div style={{ fontSize: 11, color: 'var(--admin-text-secondary)', marginTop: 2 }}>{selectedOrder.customer_email}</div>
                <div style={{ fontSize: 11, color: 'var(--admin-text-secondary)', marginTop: 2 }}>{selectedOrder.customer_phone}</div>
                <div style={{ fontSize: 11, color: 'var(--admin-text-primary)', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--admin-border)' }}>
                  <strong>Shipping Address:</strong><br />
                  {selectedOrder.address}
                </div>
              </div>

              {/* Payment & Invoice Box */}
              <div style={{ border: '1px solid var(--admin-border)', borderRadius: 4, padding: 12, background: 'var(--admin-surface)' }}>
                <div className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                  <CreditCard size={12} /> Payment & Invoice
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--admin-text-secondary)' }}>Payment Status:</span>
                  <StatusBadge status={selectedOrder.payment_status} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--admin-text-secondary)' }}>
                  Method: <strong>{selectedOrder.payment_method}</strong>
                </div>
                <div style={{ fontSize: 11, color: 'var(--admin-text-secondary)', marginTop: 2 }}>
                  Ref: <code>{selectedOrder.payment_id}</code>
                </div>
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Invoice No:</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{selectedOrder.invoice_no}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Total Paid:</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>₹{selectedOrder.amount}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Label Customization Configuration */}
            <div style={{ border: '1px solid var(--admin-border)', borderRadius: 4, padding: 12, background: 'var(--admin-surface)' }}>
              <div className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                <Tag size={12} /> Label Print Specifications
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12, fontSize: 12 }}>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Language</span>
                  <div><strong>{selectedOrder.language}</strong></div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Shape</span>
                  <div><strong>{selectedOrder.shape}</strong></div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Font</span>
                  <div><strong>{selectedOrder.font}</strong></div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Material / Bg</span>
                  <div><strong>{selectedOrder.background}</strong></div>
                </div>
              </div>

              {/* Items Table */}
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--admin-text-secondary)', marginBottom: 6 }}>
                Items in Custom Set ({selectedOrder.items?.length || selectedOrder.labels_count} labels):
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>English Botanical</th>
                    <th>Script Translation</th>
                    <th style={{ textAlign: 'right' }}>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td><strong>{item.name}</strong></td>
                      <td>{item.english}</td>
                      <td><span style={{ fontSize: 13, fontWeight: 600 }}>{item.translated}</span></td>
                      <td style={{ textAlign: 'right' }}>{item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Drawer>

      {/* Status Update Modal */}
      <Modal
        isOpen={isUpdateStatusModalOpen}
        onClose={() => setIsUpdateStatusModalOpen(false)}
        title={`Update Order & Fulfillment Status — ${selectedOrder?.order_number}`}
        size="md"
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setIsUpdateStatusModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleSaveStatus}
            >
              Save Status Updates
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveStatus}>
          <div className="admin-form-group">
            <label className="admin-form-label">Order Processing Status</label>
            <select
              className="admin-form-select"
              value={nextOrderStatus}
              onChange={(e) => setNextOrderStatus(e.target.value)}
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing (Printing & Packing)</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Delivery Stage</label>
            <select
              className="admin-form-select"
              value={nextDeliveryStatus}
              onChange={(e) => setNextDeliveryStatus(e.target.value)}
            >
              <option value="Confirmed">Confirmed (Ready for Dispatch)</option>
              <option value="Processing">Processing (In Packing)</option>
              <option value="Shipped">Shipped (Handed to Carrier)</option>
              <option value="Delivered">Delivered (Completed)</option>
            </select>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Assigned Carrier</label>
              <select
                className="admin-form-select"
                value={carrierInput}
                onChange={(e) => setCarrierInput(e.target.value)}
              >
                <option value="BlueDart Express">BlueDart Express</option>
                <option value="Delhivery">Delhivery</option>
                <option value="India Post Speed">India Post Speed</option>
                <option value="Shadowfax">Shadowfax</option>
                <option value="DTDC Courier">DTDC Courier</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Tracking / AWB Number</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="e.g. BLUEDART-8829104"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OrdersManagement;
