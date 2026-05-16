import { useState, useEffect } from 'react';
import { MdAdd, MdTrendingUp, MdTrendingDown, MdAccountBalance } from 'react-icons/md';

export default function AccountsSection() {
  const [transactions, setTransactions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const saved = localStorage.getItem('netking_transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      const sampleTransactions = [
        {
          id: 'TXN-001',
          date: '2024-01-15',
          type: 'income',
          category: 'CCTV Installation',
          description: 'ABC Corporation - CCTV Setup',
          amount: 125000
        },
        {
          id: 'TXN-002',
          date: '2024-01-14',
          type: 'expense',
          category: 'Equipment Purchase',
          description: 'CCTV Cameras and DVR',
          amount: 45000
        },
        {
          id: 'TXN-003',
          date: '2024-01-13',
          type: 'income',
          category: 'AMC Payment',
          description: 'XYZ Retail - Annual Maintenance',
          amount: 25000
        }
      ];
      localStorage.setItem('netking_transactions', JSON.stringify(sampleTransactions));
      setTransactions(sampleTransactions);
    }
  };

  const saveTransactions = (data) => {
    localStorage.setItem('netking_transactions', JSON.stringify(data));
    setTransactions(data);
  };

  const addTransaction = (formData) => {
    const newTransaction = { ...formData, id: `TXN-${Date.now()}` };
    saveTransactions([newTransaction, ...transactions]); // Prepend new transactions
    setShowAddForm(false);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesStartDate = !startDate || t.date >= startDate;
    const matchesEndDate = !endDate || t.date <= endDate;
    return matchesSearch && matchesType && matchesStartDate && matchesEndDate;
  });

  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="accounts-section">
      <div className="section-header">
        <h2>Accounts Overview</h2>
        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          <MdAdd /> Add Transaction
        </button>
      </div>

      <div className="filter-toolbar" style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>Search</label>
            <input 
              type="text" 
              placeholder="Category or description..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>Transaction Type</label>
            <select 
              value={typeFilter} 
              onChange={e => setTypeFilter(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db' }}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>Start Date</label>
            <input 
              type="date" 
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>End Date</label>
            <input 
              type="date" 
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db' }}
            />
          </div>
        </div>
      </div>

      <div className="accounts-summary">
        <div className="summary-card income">
          <MdTrendingUp />
          <div>
            <h3>₹{totalIncome.toLocaleString()}</h3>
            <p>Total Income</p>
          </div>
        </div>
        <div className="summary-card expense">
          <MdTrendingDown />
          <div>
            <h3>₹{totalExpense.toLocaleString()}</h3>
            <p>Total Expenditure</p>
          </div>
        </div>
        <div className="summary-card profit">
          <MdAccountBalance />
          <div>
            <h3>₹{netProfit.toLocaleString()}</h3>
            <p>Net Profit</p>
          </div>
        </div>
      </div>

      <div className="transactions-table">
        <h3>Recent Transactions</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                  No transactions match your filters.
                </td>
              </tr>
            ) : (
              filteredTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`type-badge ${transaction.type}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td>{transaction.category}</td>
                  <td>{transaction.description}</td>
                  <td className={transaction.type} style={{ fontWeight: 700 }}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <TransactionForm 
          onSubmit={addTransaction}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

function TransactionForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'income',
    category: '',
    description: '',
    amount: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h3>Add Transaction</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-grid">
            <input 
              type="date" 
              value={form.date} 
              onChange={(e) => setForm({...form, date: e.target.value})}
              required 
            />
            <select 
              value={form.type} 
              onChange={(e) => setForm({...form, type: e.target.value})}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input 
              type="text" 
              placeholder="Category" 
              value={form.category} 
              onChange={(e) => setForm({...form, category: e.target.value})}
              required 
            />
            <input 
              type="number" 
              placeholder="Amount" 
              value={form.amount} 
              onChange={(e) => setForm({...form, amount: Number(e.target.value)})}
              required 
            />
          </div>
          <textarea 
            placeholder="Description" 
            value={form.description} 
            onChange={(e) => setForm({...form, description: e.target.value})}
            rows="3"
            required
          />

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Add Transaction</button>
          </div>
        </form>
      </div>
    </div>
  );
}