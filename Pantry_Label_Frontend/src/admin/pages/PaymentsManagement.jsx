import React, { useState, useMemo } from 'react';
import { CreditCard, AlertCircle, Eye, Download } from 'lucide-react';
import { useAdmin } from '../data/AdminContext';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import StatusBadge from '../components/StatusBadge';
import KpiCard from '../components/KpiCard';
import Modal from '../components/Modal';

export const PaymentsManagement = () => {
  const { payments, verifyPayment, refundPayment } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState(null);
  const [refundConfirmPayment, setRefundConfirmPayment] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Payment Statuses' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Failed', label: 'Failed' },
    { value: 'Refunded', label: 'Refunded' }
  ];

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchSearch =
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.payment_method.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [payments, searchTerm, selectedStatus]);

  const columns = [
    {
      header: 'Payment ID',
      field: 'id',
      sortable: true,
      width: '120px',
      render: (val) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{val}</span>
    },
    {
      header: 'Order Ref',
      field: 'order_id',
      sortable: true,
      render: (val) => <strong>{val}</strong>
    },
    {
      header: 'Customer',
      field: 'customer',
      sortable: true
    },
    {
      header: 'Amount',
      field: 'amount',
      align: 'right',
      sortable: true,
      render: (val) => <strong>₹{Number(val).toFixed(2)}</strong>
    },
    {
      header: 'Gateway / Method',
      field: 'payment_method',
      sortable: true
    },
    {
      header: 'Transaction Date',
      field: 'transaction_date',
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
            onClick={() => setSelectedPaymentDetail(row)}
            title="Inspect Transaction"
          >
            <Eye size={12} />
          </button>
          {row.status === 'Pending' && (
            <button
              type="button"
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={() => verifyPayment(row.id)}
              title="Verify Payment"
            >
              Verify
            </button>
          )}
          {row.status === 'Paid' && (
            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => setRefundConfirmPayment(row)}
              title="Initiate Refund"
            >
              Refund
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-heading">Payment Monitor</h2>
          <p className="admin-page-subtitle">
            Razorpay gateway transactions, UPI reconciliation, net settlement and fee tracking.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => alert('Downloading Payment Settlement Report (CSV)')}
          >
            <Download size={13} />
            <span>Settlement Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <KpiCard
          label="Today's Revenue"
          value="₹14,500"
          trend="+11.4%"
          trendType="positive"
          context="vs yesterday"
          icon={CreditCard}
        />
        <KpiCard
          label="Successful Payments"
          value="542"
          trend="97.8% success"
          trendType="positive"
          context="Razorpay UPI / Cards"
        />
        <KpiCard
          label="Pending Verification"
          value="8"
          trend="Awaiting bank callback"
          trendType="neutral"
        />
        <KpiCard
          label="Failed Payments"
          value="5"
          trend="Timeout / OTP drop"
          trendType="negative"
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search by Payment ID, Order ID, Customer, Method..."
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
        data={filteredPayments}
        pageSize={8}
        keyField="id"
      />

      {/* Payment Inspection Modal */}
      <Modal
        isOpen={Boolean(selectedPaymentDetail)}
        onClose={() => setSelectedPaymentDetail(null)}
        title={`Payment Audit — ${selectedPaymentDetail?.id}`}
        size="md"
        footer={
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => setSelectedPaymentDetail(null)}
          >
            Close
          </button>
        }
      >
        {selectedPaymentDetail && (
          <table className="admin-table">
            <tbody>
              <tr>
                <td style={{ width: '40%', color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Transaction ID</td>
                <td><code style={{ fontSize: 12 }}>{selectedPaymentDetail.id}</code></td>
              </tr>
              <tr>
                <td style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Order ID</td>
                <td><strong>{selectedPaymentDetail.order_id}</strong></td>
              </tr>
              <tr>
                <td style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Customer</td>
                <td>{selectedPaymentDetail.customer}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Amount Paid</td>
                <td><strong style={{ fontSize: 14 }}>₹{Number(selectedPaymentDetail.amount).toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Payment Gateway</td>
                <td>{selectedPaymentDetail.payment_method}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Gateway Reference</td>
                <td><code style={{ fontSize: 11 }}>{selectedPaymentDetail.gateway_ref || 'pay_live_289182390'}</code></td>
              </tr>
              <tr>
                <td style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Gateway Processing Fee</td>
                <td>₹{selectedPaymentDetail.fee || '7.98'} (2% + GST)</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Status</td>
                <td><StatusBadge status={selectedPaymentDetail.status} /></td>
              </tr>
              <tr>
                <td style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-gray)' }}>Timestamp</td>
                <td>{selectedPaymentDetail.transaction_date}</td>
              </tr>
            </tbody>
          </table>
        )}
      </Modal>

      {/* Refund Confirmation Modal */}
      <Modal
        isOpen={Boolean(refundConfirmPayment)}
        onClose={() => setRefundConfirmPayment(null)}
        title="Confirm Payment Refund"
        size="md"
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setRefundConfirmPayment(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              onClick={() => {
                if (refundConfirmPayment) {
                  refundPayment(refundConfirmPayment.id);
                  setRefundConfirmPayment(null);
                }
              }}
            >
              Issue Refund (₹{refundConfirmPayment?.amount})
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <AlertCircle size={20} style={{ color: 'var(--admin-danger)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 600 }}>
              Initiate refund for {refundConfirmPayment?.id} ({refundConfirmPayment?.order_id})?
            </div>
            <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)', marginTop: 4 }}>
              This will refund ₹{refundConfirmPayment?.amount} to {refundConfirmPayment?.customer}'s original payment source via Razorpay API. The associated order will be marked as cancelled.
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentsManagement;
