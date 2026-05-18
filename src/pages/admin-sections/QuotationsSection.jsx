import { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdPrint, MdRemove } from 'react-icons/md';
import logo from '../../assets/logo.jpeg';

export default function QuotationsSection() {
  const [quotations, setQuotations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [printView, setPrintView] = useState(null);

  useEffect(() => { loadQuotations(); }, []);

  const loadQuotations = () => {
    const saved = localStorage.getItem('netking_quotations');
    if (saved) {
      setQuotations(JSON.parse(saved));
    } else {
      const sample = [
        {
          id: 'QT-001',
          quotationNumber: 'NK/QT/2024/001',
          customerName: 'Metro Mall Pvt Ltd',
          customerAddress: '123 MG Road, Hyderabad',
          customerPhone: '9876543210',
          customerEmail: 'contact@metromall.com',
          date: '2024-01-15',
          validTill: '2024-02-15',
          preparedBy: 'Raj Kumar',
          status: 'pending',
          products: [
            { name: '4MP Bullet Camera', description: 'Outdoor weatherproof', quantity: 16, unitPrice: 3500, total: 56000 },
            { name: '8CH DVR', description: '4TB HDD included', quantity: 2, unitPrice: 12000, total: 24000 },
            { name: 'Installation & Cabling', description: 'Complete setup', quantity: 1, unitPrice: 25000, total: 25000 },
          ],
          subtotal: 105000,
          taxPercent: 18,
          taxAmount: 18900,
          grandTotal: 123900,
          advanceAmount: 50000,
          balanceAmount: 73900,
          termsAndConditions: 'Payment terms: 50% advance, 50% on completion.\nWarranty: 1 year on products, 6 months on installation.\nAMC available after warranty period.',
          notes: 'Installation to be completed within 7 working days from advance payment.'
        }
      ];
      localStorage.setItem('netking_quotations', JSON.stringify(sample));
      setQuotations(sample);
    }
  };

  const saveQuotations = (data) => {
    localStorage.setItem('netking_quotations', JSON.stringify(data));
    setQuotations(data);
  };

  const handleAddQuotation = (formData) => {
    if (editingId) {
      const updated = quotations.map(q => q.id === editingId ? { ...formData, id: editingId } : q);
      saveQuotations(updated);
      setEditingId(null);
    } else {
      const newQuotation = { ...formData, id: `QT-${Date.now()}` };
      saveQuotations([...quotations, newQuotation]);
    }
    setShowAddForm(false);
  };

  const handlePrint = (quotation) => {
    setPrintView(quotation);
    setTimeout(() => window.print(), 100);
  };

  const filtered = quotations.filter(q =>
    q.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.quotationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="quotations-section">
      {printView && <PrintableQuotation quotation={printView} onClose={() => setPrintView(null)} />}

      <div className="section-header">
        <div className="search-box">
          <MdSearch />
          <input type="text" placeholder="Search quotations..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          <MdAdd /> Create Quotation
        </button>
      </div>

      <div className="quotations-grid">
        {filtered.length === 0 ? (
          <div className="no-data">No quotations found</div>
        ) : filtered.map(q => (
          <QuotationCard
            key={q.id}
            quotation={q}
            onEdit={() => { setEditingId(q.id); setShowAddForm(true); }}
            onDelete={() => {
              if (window.confirm('Delete this quotation?')) {
                saveQuotations(quotations.filter(x => x.id !== q.id));
              }
            }}
            onPrint={() => handlePrint(q)}
          />
        ))}
      </div>

      {showAddForm && (
        <QuotationForm
          onSubmit={handleAddQuotation}
          onClose={() => { setShowAddForm(false); setEditingId(null); }}
          initialData={editingId ? quotations.find(q => q.id === editingId) : null}
        />
      )}
    </div>
  );
}

function QuotationCard({ quotation: q, onEdit, onDelete, onPrint }) {
  const statusColor = { pending: '#f59e0b', accepted: '#10b981', rejected: '#dc2626' }[q.status] || '#6b7280';

  return (
    <div className="quotation-card">
      <div className="card-header">
        <div>
          <h3>{q.quotationNumber}</h3>
          <span className="customer-name">{q.customerName}</span>
        </div>
        <span className="status-badge" style={{ backgroundColor: statusColor }}>{q.status}</span>
      </div>

      <div className="card-section">
        <h4>📋 Quotation Details</h4>
        <div className="info-row"><span>Prepared By:</span><strong>{q.preparedBy}</strong></div>
        <div className="info-row"><span>Date:</span><strong>{q.date}</strong></div>
        <div className="info-row"><span>Valid Till:</span><strong>{q.validTill}</strong></div>
        <div className="info-row"><span>Products:</span><strong>{q.products?.length || 0} items</strong></div>
      </div>

      <div className="card-section">
        <h4>💰 Payment Summary</h4>
        <div className="info-row"><span>Subtotal:</span><strong>₹{q.subtotal?.toLocaleString()}</strong></div>
        <div className="info-row"><span>Tax ({q.taxPercent}%):</span><strong>₹{q.taxAmount?.toLocaleString()}</strong></div>
        <div className="info-row"><span>Grand Total:</span><strong style={{ color: '#e01020' }}>₹{q.grandTotal?.toLocaleString()}</strong></div>
        <div className="info-row"><span>Advance Received:</span><strong>₹{q.advanceAmount?.toLocaleString()}</strong></div>
        <div className="info-row"><span>Balance Due:</span><strong style={{ color: '#f59e0b' }}>₹{q.balanceAmount?.toLocaleString()}</strong></div>
      </div>

      <div className="card-actions">
        <button className="print-btn" onClick={onPrint}><MdPrint /> Print</button>
        <button className="edit-btn" onClick={onEdit}><MdEdit /> Edit</button>
        <button className="delete-btn" onClick={onDelete}><MdDelete /> Delete</button>
      </div>
    </div>
  );
}

function QuotationForm({ onSubmit, onClose, initialData }) {
  const [form, setForm] = useState(initialData || {
    quotationNumber: `NK/QT/${new Date().getFullYear()}/${String(Date.now()).slice(-3)}`,
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    customerEmail: '',
    date: new Date().toISOString().split('T')[0],
    validTill: '',
    preparedBy: '',
    status: 'pending',
    products: [{ name: '', description: '', quantity: 1, unitPrice: 0, total: 0 }],
    subtotal: 0,
    taxPercent: 18,
    taxAmount: 0,
    grandTotal: 0,
    advanceAmount: 0,
    balanceAmount: 0,
    termsAndConditions: 'Payment terms: 50% advance, 50% on completion.\nWarranty: 1 year on products, 6 months on installation.\nAMC available after warranty period.',
    notes: ''
  });

  const updateProduct = (index, field, value) => {
    const updated = [...form.products];
    updated[index][field] = value;
    if (field === 'quantity' || field === 'unitPrice') {
      updated[index].total = (updated[index].quantity || 0) * (updated[index].unitPrice || 0);
    }
    setForm({ ...form, products: updated });
    recalculate({ ...form, products: updated });
  };

  const addProduct = () => {
    setForm({ ...form, products: [...form.products, { name: '', description: '', quantity: 1, unitPrice: 0, total: 0 }] });
  };

  const removeProduct = (index) => {
    const updated = form.products.filter((_, i) => i !== index);
    setForm({ ...form, products: updated });
    recalculate({ ...form, products: updated });
  };

  const recalculate = (data) => {
    const subtotal = data.products.reduce((sum, p) => sum + (p.total || 0), 0);
    const taxAmount = (subtotal * data.taxPercent) / 100;
    const grandTotal = subtotal + taxAmount;
    const balanceAmount = grandTotal - (data.advanceAmount || 0);
    setForm(prev => ({ ...prev, subtotal, taxAmount, grandTotal, balanceAmount }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="form-overlay">
      <div className="form-modal" style={{ maxWidth: 900 }}>
        <div className="form-header">
          <h3>{initialData ? 'Edit' : 'Create'} Quotation</h3>
          <button className="close-btn" onClick={onClose}><MdClose /></button>
        </div>

        <form onSubmit={handleSubmit} className="quotation-form" style={{ padding: 24 }}>
          {/* Basic Info */}
          <div className="form-section">
            <h4>Quotation Information</h4>
            <div className="form-grid">
              <input type="text" placeholder="Quotation Number *" value={form.quotationNumber}
                onChange={e => setForm({ ...form, quotationNumber: e.target.value })} required />
              <input type="text" placeholder="Prepared By (Employee Name) *" value={form.preparedBy}
                onChange={e => setForm({ ...form, preparedBy: e.target.value })} required />
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
              <input type="date" placeholder="Valid Till" value={form.validTill}
                onChange={e => setForm({ ...form, validTill: e.target.value })} />
            </div>
          </div>

          {/* Customer Details */}
          <div className="form-section">
            <h4>Customer Details</h4>
            <div className="form-grid">
              <input type="text" placeholder="Customer Name *" value={form.customerName}
                onChange={e => setForm({ ...form, customerName: e.target.value })} required />
              <input type="tel" placeholder="Phone Number" value={form.customerPhone}
                onChange={e => setForm({ ...form, customerPhone: e.target.value })} />
              <input type="email" placeholder="Email Address" value={form.customerEmail}
                onChange={e => setForm({ ...form, customerEmail: e.target.value })} />
            </div>
            <textarea rows={2} placeholder="Customer Address" value={form.customerAddress}
              onChange={e => setForm({ ...form, customerAddress: e.target.value })} />
          </div>

          {/* Products */}
          <div className="form-section">
            <h4>Products / Services</h4>
            {form.products.map((p, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1.2fr 1.2fr auto', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                <input type="text" placeholder="Product/Service Name *" value={p.name}
                  onChange={e => updateProduct(i, 'name', e.target.value)} required />
                <input type="text" placeholder="Description" value={p.description}
                  onChange={e => updateProduct(i, 'description', e.target.value)} />
                <input type="number" placeholder="Qty" min="1" value={p.quantity}
                  onChange={e => updateProduct(i, 'quantity', Number(e.target.value))} required />
                <input type="number" placeholder="Unit Price" min="0" value={p.unitPrice}
                  onChange={e => updateProduct(i, 'unitPrice', Number(e.target.value))} required />
                <input type="number" placeholder="Total" value={p.total} disabled
                  style={{ background: '#f3f4f6', fontWeight: 700 }} />
                <button type="button" onClick={() => removeProduct(i)}
                  style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>
                  <MdRemove />
                </button>
              </div>
            ))}
            <button type="button" onClick={addProduct} className="add-btn" style={{ marginTop: 10 }}>
              <MdAdd /> Add Product Line
            </button>
          </div>

          {/* Payment & Tax */}
          <div className="form-section">
            <h4>Payment & Tax Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, background: '#f9fafb', padding: 16, borderRadius: 12 }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 4, display: 'block' }}>Subtotal</label>
                <input type="number" value={form.subtotal} disabled style={{ background: '#fff', fontWeight: 700 }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 4, display: 'block' }}>Tax %</label>
                <input type="number" min="0" max="100" value={form.taxPercent}
                  onChange={e => { setForm({ ...form, taxPercent: Number(e.target.value) }); recalculate({ ...form, taxPercent: Number(e.target.value) }); }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 4, display: 'block' }}>Tax Amount</label>
                <input type="number" value={form.taxAmount} disabled style={{ background: '#fff', fontWeight: 700 }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 4, display: 'block' }}>Grand Total</label>
                <input type="number" value={form.grandTotal} disabled style={{ background: '#fff', fontWeight: 700, color: '#e01020' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 4, display: 'block' }}>Advance Received</label>
                <input type="number" min="0" value={form.advanceAmount}
                  onChange={e => { setForm({ ...form, advanceAmount: Number(e.target.value) }); recalculate({ ...form, advanceAmount: Number(e.target.value) }); }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 4, display: 'block' }}>Balance Due</label>
                <input type="number" value={form.balanceAmount} disabled style={{ background: '#fff', fontWeight: 700, color: '#f59e0b' }} />
              </div>
            </div>
          </div>

          {/* Terms & Notes */}
          <div className="form-section">
            <h4>Terms & Conditions</h4>
            <textarea rows={4} placeholder="Payment terms, warranty, etc..." value={form.termsAndConditions}
              onChange={e => setForm({ ...form, termsAndConditions: e.target.value })} />
          </div>

          <div className="form-section">
            <h4>Additional Notes</h4>
            <textarea rows={2} placeholder="Any additional notes..." value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Save Quotation</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PrintableQuotation({ quotation: q, onClose }) {
  return (
    <div className="print-overlay" onClick={onClose}>
      <div className="print-document" onClick={e => e.stopPropagation()}>
        <style>{`
          @media print {
            body * { visibility: hidden; }
            .print-document, .print-document * { visibility: visible; }
            .print-document { position: absolute; left: 0; top: 0; width: 100%; }
            .print-close-btn { display: none !important; }
          }
        `}</style>

        <button className="print-close-btn" onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontWeight: 700 }}>
          <MdClose /> Close
        </button>

        <div style={{ maxWidth: 800, margin: '0 auto', padding: 40, background: '#fff', fontFamily: 'Arial, sans-serif' }}>
          {/* Header */}
          <div style={{ borderBottom: '3px solid #e01020', paddingBottom: 20, marginBottom: 30, display: 'flex', gap: 20, alignItems: 'center' }}>
            <img src={logo} alt="NetKing Logo" style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 8 }} />
            <div>
              <h1 style={{ margin: 0, fontSize: 32, color: '#e01020', fontWeight: 800, lineHeight: 1.1 }}>NetKing Security Systems</h1>
              <p style={{ margin: '6px 0 0', color: '#1f2937', fontWeight: 600, fontSize: 15 }}>Professional CCTV & Security Solutions</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#4b5563', lineHeight: 1.4 }}>
                📍 H.No, 3/A, 2-3-35/K/3, beside Bata Show Room, Zinda Tilismath Nagar, Amberpet, Hyderabad, Telangana 500044
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280', fontWeight: 600 }}>📞 9248353592 | 📧 info@netking.in</p>
            </div>
          </div>

          {/* Quotation Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
            <div>
              <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#6b7280', textTransform: 'uppercase' }}>Bill To:</h3>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>{q.customerName}</p>
              {q.customerAddress && <p style={{ margin: '4px 0', fontSize: 14, color: '#6b7280' }}>{q.customerAddress}</p>}
              {q.customerPhone && <p style={{ margin: '4px 0', fontSize: 14 }}>📞 {q.customerPhone}</p>}
              {q.customerEmail && <p style={{ margin: '4px 0', fontSize: 14 }}>📧 {q.customerEmail}</p>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ margin: '0 0 12px', fontSize: 24, color: '#e01020' }}>QUOTATION</h2>
              <p style={{ margin: '4px 0', fontSize: 14 }}><strong>Quote #:</strong> {q.quotationNumber}</p>
              <p style={{ margin: '4px 0', fontSize: 14 }}><strong>Date:</strong> {q.date}</p>
              <p style={{ margin: '4px 0', fontSize: 14 }}><strong>Valid Till:</strong> {q.validTill}</p>
              <p style={{ margin: '4px 0', fontSize: 14 }}><strong>Prepared By:</strong> {q.preparedBy}</p>
            </div>
          </div>

          {/* Products Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 30 }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 13, fontWeight: 700 }}>Product / Service</th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 13, fontWeight: 700 }}>Description</th>
                <th style={{ padding: 12, textAlign: 'center', fontSize: 13, fontWeight: 700 }}>Qty</th>
                <th style={{ padding: 12, textAlign: 'right', fontSize: 13, fontWeight: 700 }}>Unit Price</th>
                <th style={{ padding: 12, textAlign: 'right', fontSize: 13, fontWeight: 700 }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {q.products?.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: 12, fontSize: 14 }}>{p.name}</td>
                  <td style={{ padding: 12, fontSize: 13, color: '#6b7280' }}>{p.description || '—'}</td>
                  <td style={{ padding: 12, textAlign: 'center', fontSize: 14 }}>{p.quantity}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontSize: 14 }}>₹{p.unitPrice.toLocaleString()}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontSize: 14, fontWeight: 700 }}>₹{p.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 30 }}>
            <div style={{ width: 300 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: 14 }}>Subtotal:</span>
                <strong style={{ fontSize: 14 }}>₹{q.subtotal?.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: 14 }}>Tax ({q.taxPercent}%):</span>
                <strong style={{ fontSize: 14 }}>₹{q.taxAmount?.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '2px solid #e01020', background: '#fef2f2', margin: '0 -12px', padding: '12px' }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>Grand Total:</span>
                <strong style={{ fontSize: 18, color: '#e01020' }}>₹{q.grandTotal?.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', marginTop: 8 }}>
                <span style={{ fontSize: 14 }}>Advance Received:</span>
                <strong style={{ fontSize: 14, color: '#10b981' }}>₹{q.advanceAmount?.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>Balance Due:</span>
                <strong style={{ fontSize: 16, color: '#f59e0b' }}>₹{q.balanceAmount?.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Terms */}
          {q.termsAndConditions && (
            <div style={{ marginBottom: 20, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
              <h4 style={{ margin: '0 0 8px', fontSize: 13, color: '#6b7280', textTransform: 'uppercase' }}>Terms & Conditions</h4>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{q.termsAndConditions}</p>
            </div>
          )}

          {/* Notes */}
          {q.notes && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 8px', fontSize: 13, color: '#6b7280', textTransform: 'uppercase' }}>Notes</h4>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{q.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: 20, marginTop: 30, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>Thank you for your business!</p>
            <p style={{ margin: '8px 0 0', fontSize: 12, color: '#9ca3af' }}>This is a computer-generated quotation and does not require a signature.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
