import { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdPrint } from 'react-icons/md';

export default function BillBookSection() {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = () => {
    const saved = localStorage.getItem('netking_bills');
    if (saved) {
      setBills(JSON.parse(saved));
    } else {
      const sampleBills = [
        {
          id: 'INV-001',
          customerName: 'ABC Corporation',
          mobile: '9876543210',
          service: 'CCTV Installation',
          amount: 125000,
          date: '2024-01-15',
          dueDate: '2024-02-15',
          status: 'paid',
          paymentDate: '2024-01-20'
        },
        {
          id: 'INV-002',
          customerName: 'XYZ Retail',
          mobile: '9876543220',
          service: 'AMC Contract',
          amount: 87500,
          date: '2024-01-14',
          dueDate: '2024-02-14',
          status: 'pending'
        }
      ];
      localStorage.setItem('netking_bills', JSON.stringify(sampleBills));
      setBills(sampleBills);
    }
  };

  const saveBills = (data) => {
    localStorage.setItem('netking_bills', JSON.stringify(data));
    setBills(data);
  };

  const handleAddBill = (formData) => {
    if (editingId) {
      const updated = bills.map(b => b.id === editingId ? { ...formData, id: editingId } : b);
      saveBills(updated);
      setEditingId(null);
    } else {
      const newBill = { ...formData, id: `INV-${Date.now()}` };
      saveBills([...bills, newBill]);
    }
    setShowAddForm(false);
  };

  const markAsPaid = (id) => {
    const updated = bills.map(bill => 
      bill.id === id 
        ? { ...bill, status: 'paid', paymentDate: new Date().toISOString().split('T')[0] }
        : bill
    );
    saveBills(updated);
  };

  const filteredBills = bills.filter(bill => 
    bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = bills.reduce((sum, b) => sum + b.amount, 0);
  const paidAmount = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="billbook-section">
      <div className="section-header">
        <div className="search-box">
          <MdSearch />
          <input 
            type="text" 
            placeholder="Search bills..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          <MdAdd /> Create Bill
        </button>
      </div>

      <div className="bill-stats">
        <div className="stat-card total">
          <div>
            <h3>₹{totalAmount.toLocaleString()}</h3>
            <p>Total Billed</p>
          </div>
        </div>
        <div className="stat-card paid">
          <div>
            <h3>₹{paidAmount.toLocaleString()}</h3>
            <p>Amount Received</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div>
            <h3>₹{pendingAmount.toLocaleString()}</h3>
            <p>Amount Pending</p>
          </div>
        </div>
      </div>

      <div className="bills-grid">
        {filteredBills.map(bill => (
          <BillCard 
            key={bill.id} 
            bill={bill}
            onEdit={() => { setEditingId(bill.id); setShowAddForm(true); }}
            onDelete={() => {
              if (window.confirm('Delete this bill?')) {
                saveBills(bills.filter(b => b.id !== bill.id));
              }
            }}
            onMarkPaid={() => markAsPaid(bill.id)}
          />
        ))}
      </div>

      {showAddForm && (
        <BillForm 
          onSubmit={handleAddBill}
          onClose={() => { setShowAddForm(false); setEditingId(null); }}
          initialData={editingId ? bills.find(b => b.id === editingId) : null}
        />
      )}
    </div>
  );
}

function BillCard({ bill, onEdit, onDelete, onMarkPaid }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'overdue': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <div className="bill-card">
      <div className="card-header">
        <div>
          <h3>{bill.id}</h3>
          <span className="customer-name">{bill.customerName}</span>
        </div>
        <span className="status-badge" style={{backgroundColor: getStatusColor(bill.status)}}>
          {bill.status}
        </span>
      </div>

      <div className="card-section">
        <h4>📋 Bill Details</h4>
        <div className="info-row">
          <span>Service:</span>
          <strong>{bill.service}</strong>
        </div>
        <div className="info-row">
          <span>Amount:</span>
          <strong>₹{bill.amount.toLocaleString()}</strong>
        </div>
        <div className="info-row">
          <span>Bill Date:</span>
          <strong>{bill.date}</strong>
        </div>
        <div className="info-row">
          <span>Due Date:</span>
          <strong>{bill.dueDate}</strong>
        </div>
        {bill.paymentDate && (
          <div className="info-row">
            <span>Paid On:</span>
            <strong>{bill.paymentDate}</strong>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button className="print-btn">
          <MdPrint /> Print
        </button>
        <button className="edit-btn" onClick={onEdit}>
          <MdEdit /> Edit
        </button>
        {bill.status !== 'paid' && (
          <button className="mark-paid-btn" onClick={onMarkPaid}>
            Mark Paid
          </button>
        )}
        <button className="delete-btn" onClick={onDelete}>
          <MdDelete /> Delete
        </button>
      </div>
    </div>
  );
}

function BillForm({ onSubmit, onClose, initialData }) {
  const [form, setForm] = useState(initialData || {
    customerName: '',
    mobile: '',
    service: 'CCTV Installation',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'pending'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h3>{initialData ? 'Edit' : 'Create'} Bill</h3>
          <button className="close-btn" onClick={onClose}><MdClose /></button>
        </div>

        <form onSubmit={handleSubmit} className="bill-form">
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
                placeholder="Mobile" 
                value={form.mobile} 
                onChange={(e) => setForm({...form, mobile: e.target.value})}
              />
            </div>
          </div>

          <div className="form-section">
            <h4>Bill Details</h4>
            <div className="form-grid">
              <select 
                value={form.service} 
                onChange={(e) => setForm({...form, service: e.target.value})}
              >
                <option>CCTV Installation</option>
                <option>Network Setup</option>
                <option>AMC Contract</option>
                <option>Maintenance Service</option>
              </select>
              <input 
                type="number" 
                placeholder="Amount *" 
                value={form.amount} 
                onChange={(e) => setForm({...form, amount: Number(e.target.value)})}
                required 
              />
              <input 
                type="date" 
                placeholder="Bill Date" 
                value={form.date} 
                onChange={(e) => setForm({...form, date: e.target.value})}
              />
              <input 
                type="date" 
                placeholder="Due Date" 
                value={form.dueDate} 
                onChange={(e) => setForm({...form, dueDate: e.target.value})}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Save Bill</button>
          </div>
        </form>
      </div>
    </div>
  );
}