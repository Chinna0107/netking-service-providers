import { useState, useEffect } from 'react';
import { MdAdd, MdTrendingUp, MdTrendingDown, MdAccountBalance } from 'react-icons/md';

export default function AccountsSection() {
  const [transactions, setTransactions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

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
    saveTransactions([...transactions, newTransaction]);
    setShowAddForm(false);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="accounts-section">
      <div className="section-header">
        <h2>Accounts Overview</h2>
        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          <MdAdd /> Add Transaction
        </button>
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
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>
                  <span className={`type-badge ${transaction.type}`}>
                    {transaction.type}
                  </span>
                </td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td className={transaction.type}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </td>
              </tr>
            ))}
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