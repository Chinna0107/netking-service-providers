import { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdCheckCircle, MdWarning } from 'react-icons/md';
import { FaShieldAlt, FaCalendarAlt } from 'react-icons/fa';

export default function AMCSection() {
  const [amcContracts, setAmcContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadAMCContracts();
  }, []);

  const loadAMCContracts = () => {
    const saved = localStorage.getItem('netking_amc_contracts');
    if (saved) {
      setAmcContracts(JSON.parse(saved));
    } else {
      // Sample data
      const sampleAMC = [
        {
          id: 'AMC-001',
          customerName: 'ABC Corporation',
          mobile: '9876543210',
          service: 'CCTV Maintenance',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          amount: 25000,
          status: 'active',
          visits: 4,
          completedVisits: 2,
          nextVisit: '2024-06-15',
          description: '4 visits per year, includes cleaning and basic repairs'
        },
        {
          id: 'AMC-002',
          customerName: 'XYZ Retail Store',
          mobile: '9876543220',
          service: 'Network Maintenance',
          startDate: '2024-02-01',
          endDate: '2025-01-31',
          amount: 18000,
          status: 'active',
          visits: 6,
          completedVisits: 3,
          nextVisit: '2024-07-01',
          description: '6 visits per year, router maintenance and speed optimization'
        },
        {
          id: 'AMC-003',
          customerName: 'Tech Solutions Ltd',
          mobile: '9876543230',
          service: 'Complete IT Support',
          startDate: '2023-12-01',
          endDate: '2024-11-30',
          amount: 45000,
          status: 'expiring',
          visits: 12,
          completedVisits: 10,
          nextVisit: '2024-11-15',
          description: 'Monthly visits, complete IT infrastructure support'
        }
      ];
      localStorage.setItem('netking_amc_contracts', JSON.stringify(sampleAMC));
      setAmcContracts(sampleAMC);
    }
  };

  const saveAMCContracts = (data) => {
    localStorage.setItem('netking_amc_contracts', JSON.stringify(data));
    setAmcContracts(data);
  };

  const handleAddAMC = (formData) => {
    if (editingId) {
      const updated = amcContracts.map(amc => amc.id === editingId ? { ...formData, id: editingId } : amc);
      saveAMCContracts(updated);
      setEditingId(null);
    } else {
      const newAMC = { ...formData, id: `AMC-${Date.now()}` };
      saveAMCContracts([...amcContracts, newAMC]);
    }
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this AMC contract?')) {
      saveAMCContracts(amcContracts.filter(amc => amc.id !== id));
    }
  };

  const handleEdit = (amc) => {
    setEditingId(amc.id);
    setShowAddForm(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#10b981';
      case 'expiring': return '#f59e0b';
      case 'expired': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const filteredAMC = amcContracts.filter(amc => 
    amc.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amc.mobile.includes(searchTerm) ||
    amc.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="amc-section">
      <div className="section-header">
        <div className="search-box">
          <MdSearch />
          <input 
            type="text" 
            placeholder="Search AMC contracts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          <MdAdd /> Add AMC Contract
        </button>
      </div>

      <div className="amc-stats">
        <div className="stat-card active">
          <FaShieldAlt />
          <div>
            <h3>{amcContracts.filter(amc => amc.status === 'active').length}</h3>
            <p>Active Contracts</p>
          </div>
        </div>
        <div className="stat-card expiring">
          <MdWarning />
          <div>
            <h3>{amcContracts.filter(amc => amc.status === 'expiring').length}</h3>
            <p>Expiring Soon</p>
          </div>
        </div>
        <div className="stat-card revenue">
          <FaCalendarAlt />
          <div>
            <h3>₹{amcContracts.reduce((sum, amc) => sum + amc.amount, 0).toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="amc-grid">
        {filteredAMC.length === 0 ? (
          <div className="no-data">No AMC contracts found</div>
        ) : (
          filteredAMC.map(amc => (
            <AMCCard 
              key={amc.id} 
              amc={amc}
              onEdit={() => handleEdit(amc)}
              onDelete={() => handleDelete(amc.id)}
            />
          ))
        )}
      </div>

      {showAddForm && (
        <AMCForm 
          onSubmit={handleAddAMC}
          onClose={() => { setShowAddForm(false); setEditingId(null); }}
          initialData={editingId ? amcContracts.find(amc => amc.id === editingId) : null}
        />
      )}
    </div>
  );
}

function AMCCard({ amc, onEdit, onDelete }) {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <MdCheckCircle style={{color: '#10b981'}} />;
      case 'expiring': return <MdWarning style={{color: '#f59e0b'}} />;
      case 'expired': return <MdWarning style={{color: '#dc2626'}} />;
      default: return null;
    }
  };

  const progressPercentage = (amc.completedVisits / amc.visits) * 100;

  return (
    <div className="amc-card">
      <div className="card-header">
        <div>
          <h3>{amc.customerName}</h3>
          <span className="amc-id">{amc.id}</span>
        </div>
        <div className="status-badge" style={{backgroundColor: getStatusColor(amc.status)}}>
          {getStatusIcon(amc.status)}
          {amc.status}
        </div>
      </div>

      <div className="card-section">
        <h4>📋 Contract Details</h4>
        <div className="info-row">
          <span>Service:</span>
          <strong>{amc.service}</strong>
        </div>
        <div className="info-row">
          <span>Duration:</span>
          <strong>{amc.startDate} to {amc.endDate}</strong>
        </div>
        <div className="info-row">
          <span>Amount:</span>
          <strong>₹{amc.amount.toLocaleString()}</strong>
        </div>
      </div>

      <div className="card-section">
        <h4>🔧 Visit Progress</h4>
        <div className="progress-bar">
          <div className="progress-fill" style={{width: `${progressPercentage}%`}}></div>
        </div>
        <div className="progress-text">
          {amc.completedVisits} of {amc.visits} visits completed
        </div>
        <div className="info-row">
          <span>Next Visit:</span>
          <strong>{amc.nextVisit}</strong>
        </div>
      </div>

      <div className="card-section">
        <h4>📝 Description</h4>
        <p className="description">{amc.description}</p>
      </div>

      <div className="card-actions">
        <button className="edit-btn" onClick={onEdit}>
          <MdEdit /> Edit
        </button>
        <button className="delete-btn" onClick={onDelete}>
          <MdDelete /> Delete
        </button>
      </div>
    </div>
  );
}

function AMCForm({ onSubmit, onClose, initialData }) {
  const [form, setForm] = useState(initialData || {
    customerName: '',
    mobile: '',
    service: 'CCTV Maintenance',
    startDate: '',
    endDate: '',
    amount: 0,
    status: 'active',
    visits: 4,
    completedVisits: 0,
    nextVisit: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h3>{initialData ? 'Edit' : 'Add'} AMC Contract</h3>
          <button className="close-btn" onClick={onClose}><MdClose /></button>
        </div>

        <form onSubmit={handleSubmit} className="amc-form">
          <div className="form-section">
            <h4>Customer Details</h4>
            <div className="form-grid">
              <input 
                type="text" 
                placeholder="Customer Name *" 
                value={form.customerName} 
                onChange={(e) => setForm({...form, customerName: e.target.value})}
                required 
              />
              <input 
                type="tel" 
                placeholder="Mobile *" 
                value={form.mobile} 
                onChange={(e) => setForm({...form, mobile: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="form-section">
            <h4>Contract Details</h4>
            <div className="form-grid">
              <select 
                value={form.service} 
                onChange={(e) => setForm({...form, service: e.target.value})}
              >
                <option>CCTV Maintenance</option>
                <option>Network Maintenance</option>
                <option>Complete IT Support</option>
                <option>Security System Support</option>
              </select>
              <input 
                type="date" 
                placeholder="Start Date" 
                value={form.startDate} 
                onChange={(e) => setForm({...form, startDate: e.target.value})}
                required 
              />
              <input 
                type="date" 
                placeholder="End Date" 
                value={form.endDate} 
                onChange={(e) => setForm({...form, endDate: e.target.value})}
                required 
              />
              <input 
                type="number" 
                placeholder="Amount" 
                value={form.amount} 
                onChange={(e) => setForm({...form, amount: Number(e.target.value)})}
                required 
              />
              <input 
                type="number" 
                placeholder="Total Visits" 
                value={form.visits} 
                onChange={(e) => setForm({...form, visits: Number(e.target.value)})}
                required 
              />
              <input 
                type="date" 
                placeholder="Next Visit Date" 
                value={form.nextVisit} 
                onChange={(e) => setForm({...form, nextVisit: e.target.value})}
              />
            </div>
            <textarea 
              placeholder="Service Description" 
              value={form.description} 
              onChange={(e) => setForm({...form, description: e.target.value})}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Save Contract</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  switch(status) {
    case 'active': return '#10b981';
    case 'expiring': return '#f59e0b';
    case 'expired': return '#dc2626';
    default: return '#6b7280';
  }
}