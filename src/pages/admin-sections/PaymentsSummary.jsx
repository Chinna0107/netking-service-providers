import { useMemo, useState, useEffect } from 'react';
import {
  MdCheckCircle,
  MdPayment,
  MdSearch,
  MdTrendingUp,
  MdWarning,
  MdDownload,
  MdPrint,
} from 'react-icons/md';
import { FaVideo, FaWifi } from 'react-icons/fa';
import {
  PAYMENT_METHODS,
  formatCurrency,
  getCollectionRate,
  todayDate,
} from './adminData';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` };
}

export default function PaymentsSummary() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [balanceView, setBalanceView] = useState('all');
  const [paymentModal, setPaymentModal] = useState({
    customerId: null,
    amount: '',
    date: todayDate(),
    method: 'Cash',
    note: '',
  });

  const activeCustomer = useMemo(
    () => customers.find((customer) => customer.id === paymentModal.customerId) || null,
    [customers, paymentModal.customerId]
  );

  useEffect(() => {
    loadPaymentsSummary();
  }, []);

  const loadPaymentsSummary = async () => {
    try {
      const res = await fetch(`${API}/api/admin/payments-summary`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Failed to load payments summary');
      const data = await res.json();
      const mapped = data.map(c => ({
        ...c,
        service: c.service === 'Broadband' ? 'broadband' : 'cctv',
        mobile: c.mobile || '—',
        city: c.city || '—',
        totalAmount: Number(c.totalAmount || 0),
        paidAmount: Number(c.paidAmount || 0),
        balanceAmount: Number(c.balanceAmount || 0)
      }));
      setCustomers(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = customers.reduce((sum, customer) => sum + customer.totalAmount, 0);
  const totalPaid = customers.reduce((sum, customer) => sum + customer.paidAmount, 0);
  const totalBalance = customers.reduce((sum, customer) => sum + customer.balanceAmount, 0);
  const pendingCount = customers.filter((customer) => customer.balanceAmount > 0).length;
  const collectionRate = getCollectionRate(customers);

  const serviceSummary = ['cctv', 'broadband'].map((service) => {
    const serviceCustomers = customers.filter((customer) => customer.service === service);
    const billed = serviceCustomers.reduce((sum, customer) => sum + customer.totalAmount, 0);
    const received = serviceCustomers.reduce((sum, customer) => sum + customer.paidAmount, 0);
    const due = serviceCustomers.reduce((sum, customer) => sum + customer.balanceAmount, 0);

    return {
      service,
      count: serviceCustomers.length,
      billed,
      received,
      due,
    };
  });

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobile.includes(searchTerm) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = serviceFilter === 'all' || customer.service === serviceFilter;
    const matchesBalanceView =
      balanceView === 'all' ||
      (balanceView === 'outstanding' && customer.balanceAmount > 0) ||
      (balanceView === 'clear' && customer.balanceAmount === 0);

    return matchesSearch && matchesService && matchesBalanceView;
  });

  const exportToCSV = () => {
    const headers = ['Customer Name', 'Mobile', 'City', 'Service', 'Total Billed', 'Total Paid', 'Remaining Balance'];
    const rows = filteredCustomers.map(c => [
      `"${c.customerName}"`,
      `"${c.mobile}"`,
      `"${c.city}"`,
      `"${c.service === 'cctv' ? 'CCTV' : 'Broadband'}"`,
      c.totalAmount,
      c.paidAmount,
      c.balanceAmount
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payments_export_${todayDate()}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Payments Report - ${todayDate()}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          <h2>Payments Report</h2>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Mobile</th>
                <th>City</th>
                <th>Service</th>
                <th>Total Billed</th>
                <th>Total Paid</th>
                <th>Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              ${filteredCustomers.map(c => `
                <tr>
                  <td>${c.customerName}</td>
                  <td>${c.mobile}</td>
                  <td>${c.city}</td>
                  <td>${c.service === 'cctv' ? 'CCTV' : 'Broadband'}</td>
                  <td>₹${c.totalAmount}</td>
                  <td>₹${c.paidAmount}</td>
                  <td>₹${c.balanceAmount}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const openPaymentModal = (customer, amount = '') => {
    setPaymentModal({
      customerId: customer.id,
      amount,
      date: todayDate(),
      method: 'Cash',
      note: '',
    });
  };

  const closePaymentModal = () => {
    setPaymentModal({
      customerId: null,
      amount: '',
      date: todayDate(),
      method: 'Cash',
      note: '',
    });
  };

  const handlePaymentSave = async (event) => {
    event.preventDefault();

    if (!activeCustomer) {
      return;
    }

    try {
      const noteStr = `${paymentModal.method}${paymentModal.note ? ' - ' + paymentModal.note : ''}`;
      const res = await fetch(`${API}/api/admin/customers/${activeCustomer.id}/payments`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          amount: paymentModal.amount,
          note: noteStr
        })
      });

      if (!res.ok) throw new Error('Failed to save payment');

      await loadPaymentsSummary();
      closePaymentModal();
    } catch (err) {
      console.error(err);
      alert('Error saving payment');
    }
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Loading payments...</div>;
  }

  return (
    <div className="workflow-section payments-summary-section">
      <div className="workflow-hero">
        <div>
          <span className="section-eyebrow">Collections Overview</span>
          <h2>Total Payments & Remaining Balances</h2>
          <p>
            Track total billing, record incoming payments, and monitor outstanding balances from a
            single admin view.
          </p>
        </div>

        <div className="compact-stats-grid">
          <div className="compact-stat-card">
            <strong>{collectionRate}%</strong>
            <span>Collection Rate</span>
          </div>
          <div className="compact-stat-card">
            <strong>{pendingCount}</strong>
            <span>Accounts Due</span>
          </div>
          <div className="compact-stat-card">
            <strong>{formatCurrency(totalBalance)}</strong>
            <span>Outstanding</span>
          </div>
        </div>
      </div>

      <div className="payment-summary-grid">
        <div className="ps-card total">
          <div className="ps-icon">
            <MdTrendingUp />
          </div>
          <div className="ps-content">
            <div className="ps-value">{formatCurrency(totalAmount)}</div>
            <div className="ps-label">Total Billing</div>
          </div>
        </div>
        <div className="ps-card paid">
          <div className="ps-icon">
            <MdCheckCircle />
          </div>
          <div className="ps-content">
            <div className="ps-value">{formatCurrency(totalPaid)}</div>
            <div className="ps-label">Total Received</div>
          </div>
        </div>
        <div className="ps-card balance" style={{ cursor: 'pointer' }} onClick={() => setBalanceView('outstanding')}>
          <div className="ps-icon">
            <MdWarning />
          </div>
          <div className="ps-content">
            <div className="ps-value">{formatCurrency(totalBalance)}</div>
            <div className="ps-label">Remaining Balance (Click to view)</div>
          </div>
        </div>
        <div className="ps-card pending">
          <div className="ps-icon">
            <MdPayment />
          </div>
          <div className="ps-content">
            <div className="ps-value">{pendingCount}</div>
            <div className="ps-label">Pending Customers</div>
          </div>
        </div>
      </div>

      <div className="service-breakdown">
        {serviceSummary.map((summary) => (
          <div key={summary.service} className={`sb-card ${summary.service}`}>
            <div className="sb-header">
              {summary.service === 'cctv' ? <FaVideo /> : <FaWifi />}
              <div>
                <h3>{summary.service === 'cctv' ? 'CCTV Services [NKSS]' : 'Broadband Services [NKBB]'}</h3>
                <p>{summary.count} customers</p>
              </div>
            </div>

            <div className="sb-stats">
              <div className="sb-stat">
                <span>Billed</span>
                <strong>{formatCurrency(summary.billed)}</strong>
              </div>
              <div className="sb-stat">
                <span>Received</span>
                <strong className="paid">{formatCurrency(summary.received)}</strong>
              </div>
              <div className="sb-stat">
                <span>Balance</span>
                <strong className="balance">{formatCurrency(summary.due)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="filter-toolbar" style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>Search Customers</label>
            <input
              type="text"
              placeholder="Name, mobile, city..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>Service Type</label>
            <select
              value={serviceFilter}
              onChange={(event) => setServiceFilter(event.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db' }}
            >
              <option value="all">All Services</option>
              <option value="cctv">CCTV</option>
              <option value="broadband">Broadband</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>Balance Status</label>
            <select
              value={balanceView}
              onChange={(event) => setBalanceView(event.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db' }}
            >
              <option value="all">All Accounts</option>
              <option value="outstanding">Outstanding</option>
              <option value="clear">Cleared</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={exportToCSV} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600, color: '#374151' }}>
              <MdDownload /> CSV
            </button>
            <button type="button" onClick={exportToPDF} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600, color: '#374151' }}>
              <MdPrint /> PDF
            </button>
          </div>
        </div>
      </div>

      <div className="payment-list">
        {filteredCustomers.length === 0 ? (
          <div className="empty-state-card">
            <MdPayment />
            <h3>No customer accounts found</h3>
            <p>Try adjusting the filters or add a new customer to begin tracking payments.</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const recentPayments = [...customer.paymentHistory].slice(-2).reverse();
            const collectionPercent = customer.totalAmount
              ? Math.round((customer.paidAmount / customer.totalAmount) * 100)
              : 0;

            return (
              <div key={customer.id} className="payment-item">
                <div className="pi-left">
                  <div className="pi-avatar">{customer.customerName.charAt(0)}</div>
                  <div className="pi-info">
                    <div className="pi-heading">
                      <h4>{customer.customerName}</h4>
                      <span className={`pi-service ${customer.service}`}>
                        {customer.service === 'cctv' ? (
                          <>
                            <FaVideo /> NKSS
                          </>
                        ) : (
                          <>
                            <FaWifi /> NKBB
                          </>
                        )}
                      </span>
                    </div>
                    <p>
                      📞 {customer.mobile} • 📍 {customer.city}
                    </p>
                    <div className="payment-progress">
                      <div className="payment-progress-track">
                        <div
                          className="payment-progress-fill"
                          style={{ width: `${collectionPercent}%` }}
                        />
                      </div>
                      <span>{collectionPercent}% collected</span>
                    </div>
                    {recentPayments.length > 0 && (
                      <div className="recent-payments-list">
                        {recentPayments.map((payment) => (
                          <span key={payment.id} className="recent-payment-chip">
                            {payment.date} • {formatCurrency(payment.amount)} • {payment.method}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pi-right">
                  <div className="pi-amounts">
                    <div className="pi-amount-row">
                      <span>Total</span>
                      <strong>{formatCurrency(customer.totalAmount)}</strong>
                    </div>
                    <div className="pi-amount-row">
                      <span>Paid</span>
                      <strong className="paid">{formatCurrency(customer.paidAmount)}</strong>
                    </div>
                    <div className="pi-amount-row">
                      <span>Balance</span>
                      <strong className={customer.balanceAmount > 0 ? 'balance' : 'paid'}>
                        {formatCurrency(customer.balanceAmount)}
                      </strong>
                    </div>
                  </div>

                  <div className="pi-actions">
                    <button
                      type="button"
                      className="secondary-action-btn"
                      onClick={() => openPaymentModal(customer)}
                    >
                      <MdPayment /> Add Payment
                    </button>
                    {customer.balanceAmount > 0 && (
                      <button
                        type="button"
                        className="primary-action-btn compact"
                        onClick={() => openPaymentModal(customer, customer.balanceAmount)}
                      >
                        <MdCheckCircle /> Settle Balance
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {activeCustomer && (
        <div className="form-overlay">
          <div className="form-modal payment-modal">
            <div className="form-header">
              <h3>Record Payment For {activeCustomer.customerName}</h3>
              <button className="close-btn" onClick={closePaymentModal}>
                ×
              </button>
            </div>

            <form onSubmit={handlePaymentSave} className="payment-form">
              <div className="payment-modal-summary">
                <div>
                  <span>Total Billing</span>
                  <strong>{formatCurrency(activeCustomer.totalAmount)}</strong>
                </div>
                <div>
                  <span>Already Received</span>
                  <strong className="paid">{formatCurrency(activeCustomer.paidAmount)}</strong>
                </div>
                <div>
                  <span>Remaining Balance</span>
                  <strong className="balance">{formatCurrency(activeCustomer.balanceAmount)}</strong>
                </div>
              </div>

              <div className="form-grid">
                <input
                  type="number"
                  min="0"
                  max={activeCustomer.balanceAmount}
                  placeholder="Payment Amount"
                  value={paymentModal.amount}
                  onChange={(event) =>
                    setPaymentModal((previous) => ({ ...previous, amount: event.target.value }))
                  }
                  required
                />
                <input
                  type="date"
                  value={paymentModal.date}
                  onChange={(event) =>
                    setPaymentModal((previous) => ({ ...previous, date: event.target.value }))
                  }
                  required
                />
                <select
                  value={paymentModal.method}
                  onChange={(event) =>
                    setPaymentModal((previous) => ({ ...previous, method: event.target.value }))
                  }
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Payment note (optional)"
                rows="3"
                value={paymentModal.note}
                onChange={(event) =>
                  setPaymentModal((previous) => ({ ...previous, note: event.target.value }))
                }
              />

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closePaymentModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
