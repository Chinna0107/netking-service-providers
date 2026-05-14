import { useState, useEffect } from 'react';
import {
  MdArrowBack,
  MdCheckCircle,
  MdPersonSearch,
  MdSearch,
  MdCalendarToday,
} from 'react-icons/md';
import { FaVideo, FaWifi } from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` };
}

// Broadband packages
const BROADBAND_PACKAGES = [
  // 30 Mbps
  { speed: '30 Mbps', duration: 'Monthly', months: 1, freeMonths: 0 },
  { speed: '30 Mbps', duration: '3 Months', months: 3, freeMonths: 0 },
  { speed: '30 Mbps', duration: '6 Months', months: 6, freeMonths: 0 },
  { speed: '30 Mbps', duration: '12 Months', months: 12, freeMonths: 0 },
  { speed: '30 Mbps', duration: '6+1 Month Free', months: 6, freeMonths: 1 },
  { speed: '30 Mbps', duration: '12+2 Months Free', months: 12, freeMonths: 2 },
  
  // 50 Mbps
  { speed: '50 Mbps', duration: 'Monthly', months: 1, freeMonths: 0 },
  { speed: '50 Mbps', duration: '3 Months', months: 3, freeMonths: 0 },
  { speed: '50 Mbps', duration: '6 Months', months: 6, freeMonths: 0 },
  { speed: '50 Mbps', duration: '12 Months', months: 12, freeMonths: 0 },
  { speed: '50 Mbps', duration: '6+1 Month Free', months: 6, freeMonths: 1 },
  { speed: '50 Mbps', duration: '12+2 Months Free', months: 12, freeMonths: 2 },
  
  // 75 Mbps
  { speed: '75 Mbps', duration: 'Monthly', months: 1, freeMonths: 0 },
  { speed: '75 Mbps', duration: '3 Months', months: 3, freeMonths: 0 },
  { speed: '75 Mbps', duration: '6 Months', months: 6, freeMonths: 0 },
  { speed: '75 Mbps', duration: '12 Months', months: 12, freeMonths: 0 },
  { speed: '75 Mbps', duration: '6+1 Month Free', months: 6, freeMonths: 1 },
  { speed: '75 Mbps', duration: '12+2 Months Free', months: 12, freeMonths: 2 },
  
  // 100 Mbps
  { speed: '100 Mbps', duration: 'Monthly', months: 1, freeMonths: 0 },
  { speed: '100 Mbps', duration: '3 Months', months: 3, freeMonths: 0 },
  { speed: '100 Mbps', duration: '6 Months', months: 6, freeMonths: 0 },
  { speed: '100 Mbps', duration: '12 Months', months: 12, freeMonths: 0 },
  { speed: '100 Mbps', duration: '6+1 Month Free', months: 6, freeMonths: 1 },
  { speed: '100 Mbps', duration: '12+2 Months Free', months: 12, freeMonths: 2 },
  
  // 150 Mbps
  { speed: '150 Mbps', duration: 'Monthly', months: 1, freeMonths: 0 },
  { speed: '150 Mbps', duration: '3 Months', months: 3, freeMonths: 0 },
  { speed: '150 Mbps', duration: '6 Months', months: 6, freeMonths: 0 },
  { speed: '150 Mbps', duration: '12 Months', months: 12, freeMonths: 0 },
  { speed: '150 Mbps', duration: '6+1 Month Free', months: 6, freeMonths: 1 },
  { speed: '150 Mbps', duration: '12+2 Months Free', months: 12, freeMonths: 2 },
  
  // 300 Mbps
  { speed: '300 Mbps', duration: 'Monthly', months: 1, freeMonths: 0 },
  { speed: '300 Mbps', duration: '3 Months', months: 3, freeMonths: 0 },
  { speed: '300 Mbps', duration: '6 Months', months: 6, freeMonths: 0 },
  { speed: '300 Mbps', duration: '12 Months', months: 12, freeMonths: 0 },
  { speed: '300 Mbps', duration: '6+1 Month Free', months: 6, freeMonths: 1 },
  { speed: '300 Mbps', duration: '12+2 Months Free', months: 12, freeMonths: 2 },
];

export default function SubscriptionsSection() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await fetch(`${API}/api/admin/customers`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Load subscription count for each customer
      const customersWithSubs = await Promise.all(
        data.map(async (customer) => {
          const subRes = await fetch(`${API}/api/admin/customers/${customer.id}/subscription`, {
            headers: authHeaders(),
          });
          const subs = await subRes.json();
          return { ...customer, subscriptionCount: subs.length };
        })
      );
      
      setCustomers(customersWithSubs);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const loadCustomerSubscription = async (customerId) => {
    try {
      const res = await fetch(`${API}/api/admin/customers/${customerId}/subscription`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      if (data.length > 0) {
        const latest = data[0];
        // Parse notes to extract payment details
        const notesMatch = latest.notes?.match(/Total: ₹(\d+) \| Paid: ₹(\d+) \| Discount: ₹(\d+) \| Balance: ₹(\d+)/);
        
        setSubscription({
          package: latest.plan_name || '',
          renewalDate: latest.start_date || new Date().toISOString().split('T')[0],
          expireDate: latest.end_date || '',
          totalAmount: notesMatch ? Number(notesMatch[1]) : Number(latest.amount) || 0,
          paidAmount: notesMatch ? Number(notesMatch[2]) : 0,
          discount: notesMatch ? Number(notesMatch[3]) : 0,
          balanceAmount: notesMatch ? Number(notesMatch[4]) : Number(latest.amount) || 0,
          notes: latest.notes?.split(' | ').slice(4).join(' | ') || '',
        });
      } else {
        setSubscription(getEmptySubscription());
      }
    } catch (err) {
      setError(err.message);
      setSubscription(getEmptySubscription());
    }
  };

  const getEmptySubscription = () => ({
    package: '',
    renewalDate: new Date().toISOString().split('T')[0],
    expireDate: '',
    totalAmount: 0,
    paidAmount: 0,
    discount: 0,
    balanceAmount: 0,
    notes: '',
  });

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const totalSubscriptions = customers.reduce((sum, c) => sum + (c.subscriptionCount || 0), 0);
  const customersWithSubs = customers.filter(c => (c.subscriptionCount || 0) > 0).length;
  const customersMissingSubs = customers.filter(c => (c.subscriptionCount || 0) === 0).length;

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm) ||
      customer.city?.toLowerCase().includes(searchTerm.toLowerCase());
    // Include Broadband, CC Camera, and Both service types
    const matchesService = customer.service_type === 'Broadband' || customer.service_type === 'CC Camera' || customer.service_type === 'Both';
    return matchesSearch && matchesService;
  });

  const saveSubscription = async () => {
    if (!selectedCustomer || !subscription) return;

    if (!subscription.package || !subscription.renewalDate || !subscription.expireDate || subscription.totalAmount === 0) {
      alert('Please fill all required fields: Package, Renewal Date, Expire Date, and Total Amount');
      return;
    }

    try {
      // Delete existing subscriptions
      const existingRes = await fetch(`${API}/api/admin/customers/${selectedCustomer.id}/subscription`, {
        headers: authHeaders(),
      });
      const existingSubs = await existingRes.json();
      
      for (const sub of existingSubs) {
        await fetch(`${API}/api/admin/customer-subscriptions/${sub.id}`, {
          method: 'DELETE',
          headers: authHeaders(),
        });
      }

      // Create new subscription
      await fetch(`${API}/api/admin/customers/${selectedCustomer.id}/subscription`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          plan_name: subscription.package,
          start_date: subscription.renewalDate,
          end_date: subscription.expireDate,
          amount: subscription.totalAmount,
          auto_renew: false,
          notes: `Total: ₹${subscription.totalAmount} | Paid: ₹${subscription.paidAmount} | Discount: ₹${subscription.discount} | Balance: ₹${subscription.balanceAmount}${subscription.notes ? ' | ' + subscription.notes : ''}`,
        }),
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      loadCustomers();
    } catch (err) {
      alert('Failed to save subscription: ' + err.message);
    }
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomerId(customer.id);
    loadCustomerSubscription(customer.id);
  };

  const handlePackageChange = (packageName) => {
    const pkg = BROADBAND_PACKAGES.find(p => `${p.speed} ${p.duration}` === packageName);
    if (pkg) {
      const startDate = new Date(subscription.renewalDate);
      const totalMonths = pkg.months + pkg.freeMonths;
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + totalMonths);
      
      setSubscription({
        ...subscription,
        package: packageName,
        expireDate: endDate.toISOString().split('T')[0],
      });
    } else {
      setSubscription({
        ...subscription,
        package: packageName,
      });
    }
  };

  const handleRenewalDateChange = (date) => {
    setSubscription({ ...subscription, renewalDate: date });
    
    if (subscription.package) {
      const pkg = BROADBAND_PACKAGES.find(p => `${p.speed} ${p.duration}` === subscription.package);
      if (pkg) {
        const startDate = new Date(date);
        const totalMonths = pkg.months + pkg.freeMonths;
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + totalMonths);
        setSubscription(prev => ({ ...prev, renewalDate: date, expireDate: endDate.toISOString().split('T')[0] }));
      }
    }
  };

  const handleAmountChange = (field, value) => {
    const numValue = Number(value) || 0;
    const updated = { ...subscription, [field]: numValue };
    updated.balanceAmount = updated.totalAmount - updated.paidAmount - updated.discount;
    setSubscription(updated);
  };

  if (loading) return <div style={{ padding: 40 }}>Loading customers...</div>;
  if (error) return <div style={{ padding: 40, color: 'red' }}>Error: {error}</div>;

  return (
    <div className="workflow-section subscriptions-section">
      {showSuccess && (
        <div className="success-toast">
          <MdCheckCircle /> Subscription saved! Customer will see this in their portal.
        </div>
      )}

      {!selectedCustomer ? (
        <>
          <div className="workflow-hero">
            <div>
              <span className="section-eyebrow">Subscription Management</span>
              <h2>Assign Plans To Customers</h2>
              <p>
                Select a customer (Broadband, CC Camera, or Both) to assign a subscription package. All data is saved to the database and visible in customer portal.
              </p>
            </div>

            <div className="compact-stats-grid">
              <div className="compact-stat-card">
                <strong>{totalSubscriptions}</strong>
                <span>Total Subscriptions</span>
              </div>
              <div className="compact-stat-card">
                <strong>{customersWithSubs}</strong>
                <span>Customers With Plans</span>
              </div>
              <div className="compact-stat-card">
                <strong>{customersMissingSubs}</strong>
                <span>Customers Without Plans</span>
              </div>
            </div>
          </div>

          <div className="filter-toolbar">
            <div className="search-box-large">
              <MdSearch />
              <input
                type="text"
                placeholder="Search customers by name, phone, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="customer-select-grid">
            {filteredCustomers.length === 0 ? (
              <div className="empty-state-card">
                <MdPersonSearch />
                <h3>No customers found</h3>
                <p>Add customers first to assign subscription plans.</p>
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  className="customer-select-card"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <div className="csc-header">
                    <div>
                      <h3>{customer.name}</h3>
                      <p style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0 0' }}>
                        {customer.service_type === 'CC Camera' ? <FaVideo /> : customer.service_type === 'Both' ? <><FaWifi /> <FaVideo /></> : <FaWifi />}
                        {customer.service_type || 'Broadband'}
                      </p>
                    </div>
                    <span className="csc-badge" style={{ 
                      background: (customer.subscriptionCount || 0) > 0 ? '#dcfce7' : '#fee2e2',
                      color: (customer.subscriptionCount || 0) > 0 ? '#166534' : '#991b1b'
                    }}>
                      {(customer.subscriptionCount || 0) > 0 ? 'Active Plan' : 'No Plan'}
                    </span>
                  </div>

                  <div className="csc-info">
                    <span>📞 {customer.phone}</span>
                    <span>📍 {customer.city || '—'}</span>
                    {customer.user_id && <span>🆔 {customer.user_id}</span>}
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="products-editor">
          <div className="editor-hero-card">
            <div className="editor-hero-copy">
              <button
                type="button"
                className="ghost-action-btn"
                onClick={() => setSelectedCustomerId(null)}
              >
                <MdArrowBack /> Back To Customer List
              </button>
              <span className="section-eyebrow">Assigning Subscription To</span>
              <h2>{selectedCustomer.name}</h2>
              <p>
                📞 {selectedCustomer.phone} • 📍 {selectedCustomer.address || selectedCustomer.city}
              </p>
              {selectedCustomer.user_id && (
                <p style={{ marginTop: 8, fontSize: '0.9rem', color: '#6b7280' }}>
                  🆔 Customer Login ID: <strong>{selectedCustomer.user_id}</strong>
                </p>
              )}
            </div>

            <div className="editor-hero-metrics">
              <div className="compact-stat-card">
                <strong>
                  {selectedCustomer.service_type === 'CC Camera' ? <FaVideo /> : selectedCustomer.service_type === 'Both' ? <><FaWifi /> <FaVideo /></> : <FaWifi />}
                </strong>
                <span>{selectedCustomer.service_type || 'Broadband'}</span>
              </div>
              <div className="compact-stat-card">
                <strong>₹{subscription?.balanceAmount?.toLocaleString() || 0}</strong>
                <span>Balance Due</span>
              </div>
            </div>
          </div>

          {subscription && (
            <>
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <span className="admin-card-eyebrow">Package Selection</span>
                    <h3>Broadband Subscription Package</h3>
                    <p>Select a package and set dates. Payment details will be tracked below.</p>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                      Package *
                    </label>
                    <select
                      value={subscription.package}
                      onChange={(e) => handlePackageChange(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e7eb' }}
                    >
                      <option value="">Select Package</option>
                      {BROADBAND_PACKAGES.map((pkg, idx) => (
                        <option key={idx} value={`${pkg.speed} ${pkg.duration}`}>
                          {pkg.speed} - {pkg.duration}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                      <MdCalendarToday style={{ verticalAlign: 'middle' }} /> Renewal Date *
                    </label>
                    <input
                      type="date"
                      value={subscription.renewalDate}
                      onChange={(e) => handleRenewalDateChange(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e7eb' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                      <MdCalendarToday style={{ verticalAlign: 'middle' }} /> Expire Date *
                    </label>
                    <input
                      type="date"
                      value={subscription.expireDate}
                      onChange={(e) => setSubscription({ ...subscription, expireDate: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e7eb' }}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <span className="admin-card-eyebrow">Payment Details</span>
                    <h3>Billing & Payment Information</h3>
                    <p>Enter total amount, paid amount, and any discounts. Balance will auto-calculate.</p>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                      Total Amount *
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={subscription.totalAmount}
                      onChange={(e) => handleAmountChange('totalAmount', e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e7eb' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                      Paid Amount
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={subscription.paidAmount}
                      onChange={(e) => handleAmountChange('paidAmount', e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e7eb' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                      Discount
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={subscription.discount}
                      onChange={(e) => handleAmountChange('discount', e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e7eb' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                      Balance Amount
                    </label>
                    <input
                      type="number"
                      value={subscription.balanceAmount}
                      disabled
                      style={{ 
                        width: '100%', 
                        padding: '12px 14px', 
                        borderRadius: 12, 
                        border: '1px solid #e5e7eb',
                        background: '#f9fafb',
                        fontWeight: 700,
                        color: subscription.balanceAmount > 0 ? '#dc2626' : '#16a34a'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Additional notes or remarks..."
                    value={subscription.notes}
                    onChange={(e) => setSubscription({ ...subscription, notes: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e7eb', resize: 'vertical' }}
                  />
                </div>

                <div className="product-total-chip" style={{ marginTop: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                    <div>
                      <span>Total Amount</span>
                      <strong style={{ fontSize: 18, color: '#1e40af' }}>₹{subscription.totalAmount.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span>Paid Amount</span>
                      <strong style={{ fontSize: 18, color: '#16a34a' }}>₹{subscription.paidAmount.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span>Discount</span>
                      <strong style={{ fontSize: 18, color: '#f59e0b' }}>₹{subscription.discount.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span>Balance Due</span>
                      <strong style={{ fontSize: 20, color: '#dc2626' }}>₹{subscription.balanceAmount.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-submit-row">
                <button type="button" className="primary-action-btn" onClick={saveSubscription}>
                  <MdCheckCircle /> Save & Sync Subscription To Customer
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
