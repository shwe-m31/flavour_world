import React, { useState, useMemo } from 'react';
import { Send, Eye, Printer, Check } from 'lucide-react';
import { useAdmin } from '../data/AdminContext';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

export const InvoiceManagement = () => {
  const { invoices, orders, logActivity } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [resentSuccess, setResentSuccess] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Invoice Statuses' },
    { value: 'Generated', label: 'Generated' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Dispatched', label: 'Dispatched' }
  ];

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchSearch =
        inv.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = selectedStatus === 'all' || inv.invoice_status === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [invoices, searchTerm, selectedStatus]);

  const handleResend = (inv) => {
    setResentSuccess(inv.invoice_no);
    logActivity(`Resent tax invoice ${inv.invoice_no} to ${inv.customer}`, 'Invoice');
    setTimeout(() => {
      setResentSuccess(null);
    }, 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const matchedOrder = useMemo(() => {
    if (!selectedInvoice) return null;
    return orders.find(o => o.order_number === selectedInvoice.order_id || o.id === selectedInvoice.order_id);
  }, [selectedInvoice, orders]);

  const columns = [
    {
      header: 'Invoice No.',
      field: 'invoice_no',
      sortable: true,
      width: '130px',
      render: (val) => <strong>{val}</strong>
    },
    {
      header: 'Order Ref',
      field: 'order_id',
      sortable: true,
      render: (val) => <span style={{ fontFamily: 'monospace' }}>{val}</span>
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
      header: 'Tax Date',
      field: 'date',
      sortable: true
    },
    {
      header: 'Payment',
      field: 'payment_status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Invoice Status',
      field: 'invoice_status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Actions',
      field: 'invoice_no',
      align: 'right',
      render: (val, row) => (
        <div style={{ display: 'inline-flex', gap: 4 }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => setSelectedInvoice(row)}
            title="View GST Tax Invoice"
          >
            <Eye size={12} />
            <span>View</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => handleResend(row)}
            title="Resend to Customer Email"
          >
            {resentSuccess === row.invoice_no ? <Check size={12} style={{ color: 'var(--admin-success)' }} /> : <Send size={12} />}
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
          <h2 className="admin-page-heading">Invoice Management</h2>
          <p className="admin-page-subtitle">
            GST-compliant electronic tax invoices, HSN code reconciliation, and customer billing archives.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search by Invoice No., Order ID, Customer..."
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
        data={filteredInvoices}
        pageSize={8}
        keyField="invoice_no"
      />

      {/* Tax Invoice Modal (GST-Compliant Print View) */}
      <Modal
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        title={`Tax Invoice — ${selectedInvoice?.invoice_no}`}
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={handlePrint}
            >
              <Printer size={13} />
              <span>Print / Save as PDF</span>
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => handleResend(selectedInvoice)}
              >
                <Send size={13} />
                <span>Resend Invoice Email</span>
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={() => setSelectedInvoice(null)}
              >
                Close
              </button>
            </div>
          </div>
        }
      >
        {selectedInvoice && (
          <div style={{ padding: 12, background: '#FFFFFF', color: '#171717', border: '1px solid var(--admin-border)', borderRadius: 4 }}>
            {/* Invoice Top Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--admin-border)', paddingBottom: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>TAX INVOICE</div>
                <div style={{ fontSize: 11, color: 'var(--admin-text-secondary)', marginTop: 2 }}>Original for Recipient</div>
                <div style={{ fontSize: 12, marginTop: 6 }}>
                  <strong>PANTRY LABEL ENTERPRISES PVT LTD</strong><br />
                  GSTIN: 33AABCP1234F1Z8 • PAN: AABCP1234F<br />
                  Chennai, Tamil Nadu, India
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedInvoice.invoice_no}</div>
                <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>Date: {selectedInvoice.date}</div>
                <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>Order ID: <strong>{selectedInvoice.order_id}</strong></div>
                <div style={{ marginTop: 4 }}><StatusBadge status={selectedInvoice.payment_status} /></div>
              </div>
            </div>

            {/* Bill To */}
            <div style={{ marginBottom: 14, fontSize: 12 }}>
              <div className="admin-form-label" style={{ marginBottom: 4 }}>Billed To:</div>
              <div style={{ fontWeight: 600 }}>{selectedInvoice.customer}</div>
              <div style={{ color: 'var(--admin-text-secondary)' }}>
                {matchedOrder ? matchedOrder.address : 'Tamil Nadu, India'}
              </div>
            </div>

            {/* Itemized Table */}
            <table className="admin-table" style={{ marginBottom: 14 }}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>HSN Code</th>
                  <th style={{ textAlign: 'right' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Taxable Value</th>
                  <th style={{ textAlign: 'right' }}>GST (18%)</th>
                  <th style={{ textAlign: 'right' }}>Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Custom Multilingual Pantry Labels</strong>
                    <div style={{ fontSize: 11, color: 'var(--admin-text-secondary)' }}>
                      Waterproof Vinyl • {matchedOrder?.language || 'Tamil + English'} • {matchedOrder?.shape || 'Square'}
                    </div>
                  </td>
                  <td><code>49119990</code></td>
                  <td style={{ textAlign: 'right' }}>{matchedOrder?.labels_count || 24}</td>
                  <td style={{ textAlign: 'right' }}>₹{Number(selectedInvoice.subtotal).toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}>₹{Number(selectedInvoice.gst).toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}><strong>₹{Number(selectedInvoice.amount).toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>

            {/* Tax Breakdown */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: 260, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Taxable Subtotal:</span>
                  <span>₹{Number(selectedInvoice.subtotal).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: 'var(--admin-text-secondary)' }}>
                  <span>CGST (9%):</span>
                  <span>₹{(Number(selectedInvoice.gst) / 2).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: 'var(--admin-text-secondary)' }}>
                  <span>SGST (9%):</span>
                  <span>₹{(Number(selectedInvoice.gst) / 2).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: 'var(--admin-text-secondary)' }}>
                  <span>Shipping & Handling:</span>
                  <span>₹0.00 (Free)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px solid var(--admin-border)', fontSize: 14, fontWeight: 600 }}>
                  <span>Grand Total (INR):</span>
                  <span>₹{Number(selectedInvoice.amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InvoiceManagement;
