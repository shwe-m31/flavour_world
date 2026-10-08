import React, { useState } from 'react';
import { invoiceService } from '../../services/invoiceService';
import { currencyFormat } from '../../utils/currencyFormat';
import { dateFormat } from '../../utils/dateFormat';
import './InvoiceCard.css';

export const InvoiceCard = ({ order, token }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!order || !token) return;
    setDownloading(true);
    try {
      const response = await invoiceService.downloadInvoice(order.orderId || order.id, token);
      
      // Create a blob URL from the PDF file response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary download link
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-Order-${order.orderId || order.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download invoice:', error);
      alert('Could not download invoice. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (!order) return null;

  const {
    orderId,
    id,
    orderDate,
    createdDate,
    items = [],
    subTotal,
    gst,
    shipping,
    grandTotal,
    totalAmount,
    deliveryAddress = {},
    address = {}
  } = order;

  const actualOrderId = orderId || id;
  const actualDate = orderDate || createdDate;
  const finalSubtotal = subTotal !== undefined ? subTotal : (totalAmount - (gst || 0) - (shipping || 0));
  const finalTotal = grandTotal !== undefined ? grandTotal : totalAmount;
  const actualAddress = Object.keys(deliveryAddress).length ? deliveryAddress : address;

  return (
    <div className="invoice-card-container">
      <div className="invoice-header">
        <div className="company-info">
          <h4 className="invoice-brand-name">Flavour World</h4>
          <p className="company-details">India | support@flavourworld.in</p>
        </div>
        <div className="invoice-meta">
          <span className="invoice-badge">INVOICE</span>
          <p className="meta-text"><strong>Order ID:</strong> #{actualOrderId}</p>
          <p className="meta-text"><strong>Date:</strong> {actualDate ? dateFormat(actualDate) : 'N/A'}</p>
        </div>
      </div>

      <hr className="invoice-divider" />

      <div className="invoice-billing-shipping">
        <div className="billing-section">
          <h5 className="section-title">Billed To</h5>
          <p className="address-detail-name"><strong>{actualAddress.name || 'Customer'}</strong></p>
          <p className="address-detail">{actualAddress.phone || 'N/A'}</p>
          <p className="address-detail">
            {actualAddress.flatHouseNo}, {actualAddress.areaStreetName}<br />
            {actualAddress.landmark && `${actualAddress.landmark}, `}
            {actualAddress.city}, {actualAddress.state} - {actualAddress.pincode}
          </p>
        </div>
      </div>

      <div className="invoice-items-table-container">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Ingredient Description</th>
              <th className="text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.cartItemId || item.id || idx}>
                <td>
                  <div className="item-name-block">
                    <span className="item-en">{item.product?.name}</span>
                    {item.product?.bilingualName && (
                      <span className="item-hi"> ({item.product?.bilingualName})</span>
                    )}
                  </div>
                </td>
                <td className="text-right">{currencyFormat(item.product?.price || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="invoice-summary-block">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{currencyFormat(finalSubtotal || 0)}</span>
        </div>
        <div className="summary-row">
          <span>GST (18%)</span>
          <span>{currencyFormat(gst || 0)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping Fee</span>
          <span>{currencyFormat(shipping || 0)}</span>
        </div>
        <hr className="summary-divider" />
        <div className="summary-row total-row">
          <span>Total Paid</span>
          <span>{currencyFormat(finalTotal || 0)}</span>
        </div>
      </div>

      <div className="invoice-footer">
        <p className="footer-thank-you">Thank you for customizing your pantry with us!</p>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="download-invoice-btn"
        >
          {downloading ? 'Downloading...' : 'Download Invoice PDF'}
        </button>
      </div>
    </div>
  );
};

export default InvoiceCard;
