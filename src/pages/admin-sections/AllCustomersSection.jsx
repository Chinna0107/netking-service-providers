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

  useEffect(() => {
    loadCustomers();
  }, []);

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
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                    }}
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
    </div>
  );
}

export default AllCustomersSection;