import { useMemo, useState } from 'react';
import {
  MdCheckCircle,
  MdPayment,
  MdSearch,
  MdTrendingUp,
  MdWarning,
} from 'react-icons/md';
import { FaVideo, FaWifi } from 'react-icons/fa';
import {
  PAYMENT_METHODS,
  applyPaymentUpdate,
  formatCurrency,
  getCollectionRate,
  getCustomers,
  saveCustomers,
  todayDate,
} from './adminData';

export default function PaymentsSummary() {
  const [customers, setCustomers] = useState(() => getCustomers());
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

  const handlePaymentSave = (event) => {
    event.preventDefault();

    if (!activeCustomer) {
      return;
    }

    const updatedCustomer = applyPaymentUpdate(activeCustomer, paymentModal);
    const nextCustomers = customers.map((customer) =>
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    );

    const normalizedCustomers = saveCustomers(nextCustomers);
    setCustomers(normalizedCustomers);
    closePaymentModal();
  };

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
        <div className="ps-card balance">
          <div className="ps-icon">
            <MdWarning />
          </div>
          <div className="ps-content">
            <div className="ps-value">{formatCurrency(totalBalance)}</div>
            <div className="ps-label">Remaining Balance</div>
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

      <div className="filter-toolbar">
        <div className="search-box-large">
          <MdSearch />
          <input
            type="text"
            placeholder="Search customers by name, mobile, or city..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="segmented-group">
          <button
            type="button"
            className={serviceFilter === 'all' ? 'active' : ''}
            onClick={() => setServiceFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            className={serviceFilter === 'cctv' ? 'active' : ''}
            onClick={() => setServiceFilter('cctv')}
          >
            CCTV
          </button>
          <button
            type="button"
            className={serviceFilter === 'broadband' ? 'active' : ''}
            onClick={() => setServiceFilter('broadband')}
          >
            Broadband
          </button>
        </div>

        <div className="segmented-group">
          <button
            type="button"
            className={balanceView === 'all' ? 'active' : ''}
            onClick={() => setBalanceView('all')}
          >
            All Accounts
          </button>
          <button
            type="button"
            className={balanceView === 'outstanding' ? 'active' : ''}
            onClick={() => setBalanceView('outstanding')}
          >
            Outstanding
          </button>
          <button
            type="button"
            className={balanceView === 'clear' ? 'active' : ''}
            onClick={() => setBalanceView('clear')}
          >
            Cleared
          </button>
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
