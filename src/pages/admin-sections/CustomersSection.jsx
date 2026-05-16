import { useState, useEffect } from 'react';
import { MdSearch } from 'react-icons/md';
import { FaVideo, FaWifi } from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` };
}

export default function CustomersSection({ serviceFilter = null }) {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(serviceFilter || 'cctv');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await fetch(`${API}/api/admin/customers`, { headers: authHeaders() });
      const data = await res.json();
      setCustomers(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load customers:', err);
      setLoading(false);
    }
  };

  const getServiceType = (tab) => {
    if (tab === 'cctv') return 'CC Camera';
    if (tab === 'broadband') return 'Broadband';
    return null;
  };

  const filteredCustomers = customers.filter(c => {
    const targetService = serviceFilter ? getServiceType(serviceFilter) : getServiceType(activeTab);
    const matchesService = c.service_type === targetService || c.service_type === 'Both';
    const matchesSearch = !searchTerm || 
                         c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.phone?.includes(searchTerm) ||
                         c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.city?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesService && matchesSearch;
  });

  if (loading) {
    return <div style={{ padding: 40 }}>Loading customers...</div>;
  }

  return (
    <div className="workflow-section customers-section">
      <div className="workflow-hero">
        <div>
          <span className="section-eyebrow">Customer Management</span>
          <h2>{serviceFilter === 'cctv' ? 'CCTV Clients [NKSS]' : serviceFilter === 'broadband' ? 'Broadband Users [NKBB]' : 'All Customers'}</h2>
          <p>View and manage your customer database. Search by name, phone, or email.</p>
        </div>
      </div>

      {!serviceFilter && (
        <div className="filter-toolbar">
          <div className="segmented-group">
            <button 
              className={`${activeTab === 'cctv' ? 'active' : ''}`}
              onClick={() => setActiveTab('cctv')}
            >
              <FaVideo /> CCTV Clients
            </button>
            <button 
              className={`${activeTab === 'broadband' ? 'active' : ''}`}
              onClick={() => setActiveTab('broadband')}
            >
              <FaWifi /> Broadband Users
            </button>
          </div>
        </div>
      )}

      <div className="filter-toolbar">
        <div className="search-box-large">
          <MdSearch />
          <input 
            type="text" 
            placeholder="Search customers by name, phone, or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="customers-grid">
        {filteredCustomers.length === 0 ? (
          <div className="empty-state-card">
            <h3>No customers found</h3>
            <p>No customers match your search criteria.</p>
          </div>
        ) : (
          filteredCustomers.map(customer => (
            <CustomerCard key={customer.id} customer={customer} />
          ))
        )}
      </div>
    </div>
  );
}

function CustomerCard({ customer }) {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <h3>{customer.name}</h3>
          <span className={`service-badge ${customer.service_type === 'CC Camera' ? 'cctv' : 'broadband'}`}>
            {customer.service_type === 'CC Camera' ? <><FaVideo /> NKSS</> : customer.service_type === 'Both' ? <><FaVideo /> <FaWifi /> Both</> : <><FaWifi /> NKBB</>}
          </span>
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        <div className="info-row" style={{ marginBottom: 8 }}>
          <span>📞 Phone:</span>
          <strong>{customer.phone || '—'}</strong>
        </div>
        <div className="info-row" style={{ marginBottom: 8 }}>
          <span>📧 Email:</span>
          <strong>{customer.email}</strong>
        </div>
        <div className="info-row" style={{ marginBottom: 8 }}>
          <span>📍 Location:</span>
          <strong>{customer.city || '—'}</strong>
        </div>
        {customer.user_id && (
          <div className="info-row" style={{ marginBottom: 8 }}>
            <span>🆔 User ID:</span>
            <strong>{customer.user_id}</strong>
          </div>
        )}
        <div className="info-row">
          <span>📅 Added:</span>
          <strong>{new Date(customer.created_at).toLocaleDateString()}</strong>
        </div>
      </div>
    </div>
  );
}
