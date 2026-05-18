import { useState, useEffect } from 'react';
import { MdSearch, MdDelete, MdPerson, MdPhone, MdEmail, MdLocationOn } from 'react-icons/md';
import { FaVideo, FaWifi } from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
}

function AllCustomersSection() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({
    products: [],
    subscriptions: [],
    payments: [],
    summary: null,
    loading: false,
    error: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleViewCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setPasswordSuccess('');
    setPasswordError('');
    setNewPassword('');
    setCustomerDetails({
      products: [],
      subscriptions: [],
      payments: [],
      summary: null,
      loading: true,
      error: ''
    });

    try {
      const [productsRes, subsRes, paymentsRes, summaryRes] = await Promise.all([
        fetch(`${API}/api/admin/customers/${customer.id}/products`, { headers: authHeaders() }),
        fetch(`${API}/api/admin/customers/${customer.id}/subscription`, { headers: authHeaders() }),
        fetch(`${API}/api/admin/customers/${customer.id}/payments`, { headers: authHeaders() }),
        fetch(`${API}/api/admin/payments-summary`, { headers: authHeaders() })
      ]);

      const products = await productsRes.json();
      const subscriptions = await subsRes.json();
      const payments = await paymentsRes.json();
      const allSummaries = await summaryRes.json();

      const summary = allSummaries.find(s => s.id === customer.id) || {
        totalAmount: 0,
        paidAmount: 0,
        balanceAmount: 0
      };

      setCustomerDetails({
        products: Array.isArray(products) ? products : [],
        subscriptions: Array.isArray(subscriptions) ? subscriptions : [],
        payments: Array.isArray(payments) ? payments : [],
        summary,
        loading: false,
        error: ''
      });
    } catch (err) {
      setCustomerDetails(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load details: ' + err.message
      }));
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      alert('Please enter a password');
      return;
    }
    setIsUpdatingPassword(true);
    setPasswordSuccess('');
    setPasswordError('');
    try {
      const res = await fetch(`${API}/api/admin/customers/${selectedCustomer.id}/password`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ password: newPassword }),
      });

      let data = {};
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        throw new Error(`The live server does not have the new backend changes yet (Status ${res.status}). Please restart your frontend dev server (npm run dev) to automatically switch to the local backend, or redeploy your backend code.`);
      }

      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      setPasswordSuccess('Password updated successfully!');
      setNewPassword('');
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await fetch(`${API}/api/admin/customers`, {
        headers: authHeaders(),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setCustomers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deleteCustomer = async (e, id, name) => {
    e.stopPropagation();

    if (
      !window.confirm(
        `Are you sure you want to delete customer "${name}"?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`${API}/api/admin/customers/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error('Failed to delete customer');

      setCustomers((prev) => prev.filter((c) => c.id !== id));

      setSuccess(`Customer "${name}" deleted successfully`);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);

      setTimeout(() => setError(''), 3000);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm) ||
      customer.user_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesService =
      serviceFilter === 'all' ||
      (serviceFilter === 'cctv' &&
        customer.service_type === 'CC Camera') ||
      (serviceFilter === 'broadband' &&
        customer.service_type === 'Broadband');

    return matchesSearch && matchesService;
  });

  if (loading) {
    return <div style={{ padding: 40 }}>Loading customers...</div>;
  }

  return (
    <div className="customers-section">
      {error && (
        <div
          style={{
            padding: 12,
            background: '#fee',
            color: '#c00',
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {success && <div className="success-toast">{success}</div>}

      <div className="workflow-hero">
        <div>
          <span className="section-eyebrow">
            Customer Management
          </span>

          <h2>All Customers</h2>

          <p>
            View, search, and manage all customer accounts.
          </p>
        </div>

        <div className="compact-stats-grid">
          <div className="compact-stat-card">
            <strong>{customers.length}</strong>
            <span>Total Customers</span>
          </div>

          <div className="compact-stat-card">
            <strong>
              {
                customers.filter(
                  (c) => c.service_type === 'CC Camera'
                ).length
              }
            </strong>
            <span>CC Camera</span>
          </div>

          <div className="compact-stat-card">
            <strong>
              {
                customers.filter(
                  (c) => c.service_type === 'Broadband'
                ).length
              }
            </strong>
            <span>Broadband</span>
          </div>
        </div>
      </div>

      <div className="filter-toolbar">
        <div className="search-box-large">
          <MdSearch />

          <input
            type="text"
            placeholder="Search by name, email, phone, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="segmented-group">
          <button
            className={serviceFilter === 'all' ? 'active' : ''}
            onClick={() => setServiceFilter('all')}
          >
            All Services
          </button>

          <button
            className={serviceFilter === 'cctv' ? 'active' : ''}
            onClick={() => setServiceFilter('cctv')}
          >
            <FaVideo /> CC Camera
          </button>

          <button
            className={serviceFilter === 'broadband' ? 'active' : ''}
            onClick={() => setServiceFilter('broadband')}
          >
            <FaWifi /> Broadband
          </button>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="empty-state-card">
          <MdPerson
            style={{ fontSize: 48, color: '#d1d5db' }}
          />

          <h3>No customers found</h3>

          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px' }}>
            Customer List ({filteredCustomers.length})
          </h3>

          <div
            className="table-wrapper"
            style={{ overflowX: 'auto' }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '2px solid #e5e7eb',
                    background: '#f9fafb',
                  }}
                >
                  <th
                    style={{
                      padding: 12,
                      textAlign: 'left',
                      fontWeight: 700,
                    }}
                  >
                    Name
                  </th>

                  <th
                    style={{
                      padding: 12,
                      textAlign: 'left',
                      fontWeight: 700,
                    }}
                  >
                    Service
                  </th>

                  <th
                    style={{
                      padding: 12,
                      textAlign: 'left',
                      fontWeight: 700,
                    }}
                  >
                    Email
                  </th>

                  <th
                    style={{
                      padding: 12,
                      textAlign: 'left',
                      fontWeight: 700,
                    }}
                  >
                    Phone
                  </th>

                  <th
                    style={{
                      padding: 12,
                      textAlign: 'left',
                      fontWeight: 700,
                    }}
                  >
                    User ID
                  </th>

                  <th
                    style={{
                      padding: 12,
                      textAlign: 'left',
                      fontWeight: 700,
                    }}
                  >
                    Location
                  </th>

                  <th
                    style={{
                      padding: 12,
                      textAlign: 'left',
                      fontWeight: 700,
                    }}
                  >
                    Joined
                  </th>

                  <th
                    style={{
                      padding: 12,
                      textAlign: 'center',
                      fontWeight: 700,
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => handleViewCustomer(customer)}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: 12 }}>
                      <strong>{customer.name}</strong>
                    </td>

                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          background:
                            customer.service_type ===
                            'Broadband'
                              ? '#dcfce7'
                              : '#dbeafe',
                          color:
                            customer.service_type ===
                            'Broadband'
                              ? '#166534'
                              : '#1e40af',
                        }}
                      >
                        {customer.service_type ===
                        'Broadband' ? (
                          <FaWifi />
                        ) : (
                          <FaVideo />
                        )}

                        {customer.service_type}
                      </span>
                    </td>

                    <td style={{ padding: 12, fontSize: 14 }}>
                      {customer.email}
                    </td>

                    <td style={{ padding: 12, fontSize: 14 }}>
                      {customer.phone || '—'}
                    </td>

                    <td style={{ padding: 12, fontSize: 14 }}>
                      <code
                        style={{
                          background: '#f3f4f6',
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}
                      >
                        {customer.user_id || '—'}
                      </code>
                    </td>

                    <td style={{ padding: 12, fontSize: 14 }}>
                      {customer.city || '—'}
                    </td>

                    <td style={{ padding: 12, fontSize: 14 }}>
                      {new Date(
                        customer.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td
                      style={{
                        padding: 12,
                        textAlign: 'center',
                      }}
                    >
                      <button
                        onClick={(e) =>
                          deleteCustomer(
                            e,
                            customer.id,
                            customer.name
                          )
                        }
                        style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          border: '1px solid #fecaca',
                          background: '#fee2e2',
                          color: '#dc2626',
                          cursor: 'pointer',
                          fontSize: 13,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <MdDelete /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedCustomer && (
        <div className="form-overlay" onClick={() => setSelectedCustomer(null)} style={{ display: 'flex', justifyContent: 'flex-end', padding: 0 }}>
          <div 
            className="form-modal" 
            onClick={e => e.stopPropagation()} 
            style={{ 
              maxWidth: 700, 
              width: '100%', 
              height: '100vh', 
              borderRadius: 0, 
              margin: 0, 
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
              background: '#fff',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {/* Modal CSS */}
            <style>{`
              @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
              .modal-body::-webkit-scrollbar {
                width: 6px;
              }
              .modal-body::-webkit-scrollbar-thumb {
                background: #d1d5db;
                border-radius: 999px;
              }
            `}</style>

            {/* Header */}
            <div className="form-header" style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="section-eyebrow" style={{ color: '#e01020', fontWeight: 700 }}>Customer Profile</span>
                <h2 style={{ margin: '4px 0 0', fontSize: '24px', color: '#111827' }}>{selectedCustomer.name}</h2>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '24px', 
                  cursor: 'pointer', 
                  color: '#6b7280',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              
              {/* Core Customer Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f9fafb', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Login ID (User ID)</span>
                  <code style={{ fontSize: '14px', background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{selectedCustomer.user_id || '—'}</code>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Service Type</span>
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>{selectedCustomer.service_type}</span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Phone</span>
                  <span style={{ fontSize: '14px' }}>{selectedCustomer.phone || '—'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Email</span>
                  <span style={{ fontSize: '14px' }}>{selectedCustomer.email || '—'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>City / District</span>
                  <span style={{ fontSize: '14px' }}>{selectedCustomer.city || '—'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Joined Date</span>
                  <span style={{ fontSize: '14px' }}>{new Date(selectedCustomer.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, display: 'block', textTransform: 'uppercase', marginBottom: 4 }}>Installation/Billing Address</span>
                  {(() => {
                    const addr = selectedCustomer.address;
                    const isUrl = addr?.startsWith('http://') || addr?.startsWith('https://');
                    if (isUrl) {
                      return (
                        <a 
                          href={addr} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ 
                            fontSize: '14px', 
                            color: '#2563eb', 
                            fontWeight: 700, 
                            textDecoration: 'underline',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          🗺️ Click here to view Address/Location on Map
                        </a>
                      );
                    }
                    return <span style={{ fontSize: '14px', color: '#374151' }}>{addr || '—'}</span>;
                  })()}
                </div>
              </div>

              {/* Create/Update Customer Password */}
              <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#111827', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                  <span>🔑 Update Security Password</span>
                </h4>
                <form onSubmit={handleUpdatePassword} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="password"
                    placeholder="Enter new password..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    style={{
                      padding: '10px 18px',
                      background: '#1f2937',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 700,
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isUpdatingPassword ? 'Updating...' : 'Set Password'}
                  </button>
                </form>
                {passwordSuccess && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>{passwordSuccess}</p>
                )}
                {passwordError && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#dc2626', fontWeight: 600 }}>{passwordError}</p>
                )}
              </div>

              {customerDetails.loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <span>Loading customer records...</span>
                </div>
              ) : customerDetails.error ? (
                <div style={{ color: '#dc2626', padding: '16px', background: '#fef2f2', borderRadius: '12px', textAlign: 'center' }}>
                  {customerDetails.error}
                </div>
              ) : (
                <>
                  {/* Financial Summary */}
                  {customerDetails.summary && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                      <div style={{ background: '#eff6ff', padding: '12px 16px', borderRadius: '12px', textAlign: 'center', border: '1px solid #bfdbfe' }}>
                        <span style={{ fontSize: '12px', color: '#1e40af', fontWeight: 600, display: 'block' }}>Total Billed</span>
                        <strong style={{ fontSize: '18px', color: '#1e3a8a', marginTop: 4, display: 'block' }}>₹{Number(customerDetails.summary.totalAmount).toLocaleString()}</strong>
                      </div>
                      <div style={{ background: '#ecfdf5', padding: '12px 16px', borderRadius: '12px', textAlign: 'center', border: '1px solid #a7f3d0' }}>
                        <span style={{ fontSize: '12px', color: '#065f46', fontWeight: 600, display: 'block' }}>Total Paid</span>
                        <strong style={{ fontSize: '18px', color: '#064e3b', marginTop: 4, display: 'block' }}>₹{Number(customerDetails.summary.paidAmount).toLocaleString()}</strong>
                      </div>
                      <div style={{ background: Number(customerDetails.summary.balanceAmount) > 0 ? '#fef2f2' : '#f0fdf4', padding: '12px 16px', borderRadius: '12px', textAlign: 'center', border: Number(customerDetails.summary.balanceAmount) > 0 ? '1px solid #fecaca' : '1px solid #bbf7d0' }}>
                        <span style={{ fontSize: '12px', color: Number(customerDetails.summary.balanceAmount) > 0 ? '#991b1b' : '#166534', fontWeight: 600, display: 'block' }}>Remaining Balance</span>
                        <strong style={{ fontSize: '18px', color: Number(customerDetails.summary.balanceAmount) > 0 ? '#7f1d1d' : '#14532d', marginTop: 4, display: 'block' }}>₹{Number(customerDetails.summary.balanceAmount).toLocaleString()}</strong>
                      </div>
                    </div>
                  )}

                  {/* Products Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 10px', display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f3f4f6', paddingBottom: '6px' }}>
                      <span>📦 Products Bought ({customerDetails.products.length})</span>
                    </h4>
                    {customerDetails.products.length === 0 ? (
                      <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>No products assigned to this customer.</p>
                    ) : (
                      <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        {customerDetails.products.map((p, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx < customerDetails.products.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                            <div>
                              <strong style={{ fontSize: '14px', color: '#111827' }}>{p.product_name}</strong>
                              <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>{p.product_description || 'No description'}</span>
                              {p.serial_number && <span style={{ fontSize: '11px', color: '#4b5563', background: '#e5e7eb', padding: '1px 4px', borderRadius: '4px', marginRight: '6px', fontFamily: 'monospace' }}>SN: {p.serial_number}</span>}
                              {p.vendor_code && <span style={{ fontSize: '11px', color: '#4b5563', background: '#e5e7eb', padding: '1px 4px', borderRadius: '4px', fontFamily: 'monospace' }}>VC: {p.vendor_code}</span>}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '14px', fontWeight: 600 }}>₹{Number(p.price).toLocaleString()}</span>
                              <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>Qty: {p.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Subscriptions Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 10px', display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f3f4f6', paddingBottom: '6px' }}>
                      <span>📶 Subscriptions ({customerDetails.subscriptions.length})</span>
                    </h4>
                    {customerDetails.subscriptions.length === 0 ? (
                      <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>No subscriptions assigned to this customer.</p>
                    ) : (
                      <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        {customerDetails.subscriptions.map((s, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx < customerDetails.subscriptions.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                            <div>
                              <strong style={{ fontSize: '14px', color: '#111827' }}>{s.plan_name}</strong>
                              <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>
                                📅 {new Date(s.start_date).toLocaleDateString()} to {new Date(s.end_date).toLocaleDateString()}
                              </span>
                              {s.notes && <span style={{ fontSize: '11px', color: '#4b5563', display: 'block', marginTop: 4 }}>📝 {s.notes}</span>}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '14px', fontWeight: 700, color: '#2563eb' }}>₹{Number(s.amount).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Payments Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 10px', display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f3f4f6', paddingBottom: '6px' }}>
                      <span>💳 Payments History ({customerDetails.payments.length})</span>
                    </h4>
                    {customerDetails.payments.length === 0 ? (
                      <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>No payments recorded for this customer.</p>
                    ) : (
                      <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        {customerDetails.payments.map((p, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx < customerDetails.payments.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                            <div>
                              <strong style={{ fontSize: '14px', color: '#16a34a' }}>Payment Received</strong>
                              <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>📅 {new Date(p.paid_at).toLocaleDateString()}</span>
                              {p.note && <span style={{ fontSize: '11px', color: '#4b5563', display: 'block', marginTop: 4 }}>📝 {p.note}</span>}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '14px', fontWeight: 700, color: '#16a34a' }}>+₹{Number(p.amount).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Share Feedback Quick Link */}
                  <div style={{ marginTop: '32px', padding: '16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#1e40af', display: 'block' }}>Quick Share Feedback link</strong>
                      <span style={{ fontSize: '12px', color: '#1e40af' }}>Share the Google Review link with this customer</span>
                    </div>
                    <a 
                      href="https://share.google/g6LhSXfz1LeSd6Zv8" 
                      target="_blank" 
                      rel="noreferrer"
                      style={{
                        padding: '8px 16px',
                        background: '#2563eb',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      Copy/Open Link 🔗
                    </a>
                  </div>

                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllCustomersSection;