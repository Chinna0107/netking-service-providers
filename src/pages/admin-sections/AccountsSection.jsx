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
  const [sortBy, setSortBy] = useState('date_desc');

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

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount_desc') return b.amount - a.amount;
    if (sortBy === 'amount_asc') return a.amount - b.amount;
    return 0;
  });

  const exportToCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Type', 'Category', 'Description', 'Amount (₹)'];
    const rows = sortedTransactions.map(t => [
      `"${t.id}"`,
      `"${t.date}"`,
      `"${t.type.toUpperCase()}"`,
      `"${t.category}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const today = new Date().toISOString().split('T')[0];
    link.download = `transactions_report_${today}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const today = new Date().toLocaleDateString();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Accounts Ledger Report - ${today}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1f2937; }
            .header { border-bottom: 3px solid #e01020; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .header h1 { margin: 0; color: #e01020; font-size: 28px; }
            .header p { margin: 5px 0 0; color: #4b5563; font-size: 14px; }
            .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
            .card { background: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; text-align: center; }
            .card h3 { margin: 0 0 5px; font-size: 18px; color: #374151; }
            .card strong { font-size: 24px; color: #111827; }
            .card.income strong { color: #16a34a; }
            .card.expense strong { color: #dc2626; }
            .card.profit strong { color: #2563eb; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f3f4f6; text-align: left; padding: 12px; font-size: 13px; font-weight: 700; border-bottom: 2px solid #e5e7eb; }
            td { padding: 12px; font-size: 14px; border-bottom: 1px solid #e5e7eb; }
            .badge { display: inline-block; padding: 4px 8px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
            .badge.income { background: #dcfce7; color: #166534; }
            .badge.expense { background: #fee2e2; color: #991b1b; }
            .text-right { text-align: right; }
            .amount.income { color: #16a34a; font-weight: 700; }
            .amount.expense { color: #dc2626; font-weight: 700; }
            @media print {
              body { padding: 0; }
              button { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>NetKing Security Systems</h1>
              <p>Accounts & Financial Transactions Report</p>
            </div>
            <div style="text-align: right">
              <p><strong>Date Generated:</strong> ${today}</p>
              <p><strong>Scope:</strong> ${typeFilter.toUpperCase()} Transactions</p>
            </div>
          </div>

          <div class="summary-cards">
            <div class="card income">
              <h3>Total Income</h3>
              <strong>₹${totalIncome.toLocaleString()}</strong>
            </div>
            <div class="card expense">
              <h3>Total Expenditure</h3>
              <strong>₹${totalExpense.toLocaleString()}</strong>
            </div>
            <div class="card profit">
              <h3>Net Balance</h3>
              <strong>₹${netProfit.toLocaleString()}</strong>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${sortedTransactions.map(t => `
                <tr>
                  <td>${new Date(t.date).toLocaleDateString()}</td>
                  <td><span class="badge ${t.type}">${t.type}</span></td>
                  <td>${t.category}</td>
                  <td>${t.description}</td>
                  <td class="amount ${t.type} text-right">
                    ${t.type === 'income' ? '+' : '-'}₹${t.amount.toLocaleString()}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            This is a system generated accounts ledger report for NetKing.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="accounts-section">
      <div className="section-header">
        <h2>Accounts Overview</h2>
        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          <MdAdd /> Add Transaction
        </button>
      </div>

      <div className="filter-toolbar" style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>Search</label>
            <input 
              type="text" 
              placeholder="Category or description..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>Transaction Type</label>
            <select 
              value={typeFilter} 
              onChange={e => setTypeFilter(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box', background: '#fff' }}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>Sort By</label>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box', background: '#fff' }}
            >
              <option value="date_desc">Date (Newest First)</option>
              <option value="date_asc">Date (Oldest First)</option>
              <option value="amount_desc">Amount (High to Low)</option>
              <option value="amount_asc">Amount (Low to High)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>Start Date</label>
            <input 
              type="date" 
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>End Date</label>
            <input 
              type="date" 
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={exportToCSV}
              style={{ flex: 1, padding: '12px 12px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}
            >
              📊 Excel
            </button>
            <button 
              onClick={exportToPDF}
              style={{ flex: 1, padding: '12px 12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}
            >
              🖨️ PDF
            </button>
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
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                  No transactions match your filters.
                </td>
              </tr>
            ) : (
              sortedTransactions.map(transaction => (
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