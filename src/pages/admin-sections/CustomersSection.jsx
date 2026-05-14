import { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose } from 'react-icons/md';
import { FaVideo, FaWifi } from 'react-icons/fa';
import {
  buildCustomerPayload,
  getCustomers,
  getEmptyCustomerForm,
  saveCustomers as persistCustomers,
} from './adminData';

export default function CustomersSection({ serviceFilter = null }) {
  const [customers, setCustomers] = useState(() => getCustomers());
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState(serviceFilter || 'cctv');

  const saveCustomers = (data) => {
    const normalized = persistCustomers(data);
    setCustomers(normalized);
  };

  const handleAddCustomer = (formData) => {
    const existingCustomer = editingId ? customers.find(c => c.id === editingId) : null;
    const payload = buildCustomerPayload(formData, existingCustomer);

    if (editingId) {
      const updated = customers.map(c => c.id === editingId ? payload : c);
      saveCustomers(updated);
      setEditingId(null);
    } else {
      saveCustomers([...customers, payload]);
    }
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this customer?')) {
      saveCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setShowAddForm(true);
  };

  const filteredCustomers = customers.filter(c => {
    const matchesService = serviceFilter ? c.service === serviceFilter : c.service === activeTab;
    const matchesSearch = c.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.mobile?.includes(searchTerm);
    return matchesService && matchesSearch;
  });

  return (
    <div className="customers-section">
      {!serviceFilter && (
        <div className="section-tabs">
          <button 
            className={`tab-btn ${activeTab === 'cctv' ? 'active' : ''}`}
            onClick={() => setActiveTab('cctv')}
          >
            <FaVideo /> CCTV Clients [NKSS]
          </button>
          <button 
            className={`tab-btn ${activeTab === 'broadband' ? 'active' : ''}`}
            onClick={() => setActiveTab('broadband')}
          >
            <FaWifi /> Broadband Users [NKBB]
          </button>
        </div>
      )}

      <div className="section-header">
        <div className="search-box">
          <MdSearch />
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          <MdAdd /> Add Customer
        </button>
      </div>

      <div className="customers-grid">
        {filteredCustomers.length === 0 ? (
          <div className="no-data">No customers found</div>
        ) : (
          filteredCustomers.map(customer => (
            <CustomerCard 
              key={customer.id} 
              customer={customer}
              onEdit={() => handleEdit(customer)}
              onDelete={() => handleDelete(customer.id)}
            />
          ))
        )}
      </div>

      {showAddForm && (
        <CustomerForm 
          service={serviceFilter || activeTab}
          onSubmit={handleAddCustomer}
          onClose={() => { setShowAddForm(false); setEditingId(null); }}
          initialData={editingId ? customers.find(c => c.id === editingId) : null}
        />
      )}
    </div>
  );
}

function CustomerCard({ customer, onEdit, onDelete }) {
  return (
    <div className="customer-card">
      <div className="card-header">
        <h3>{customer.customerName}</h3>
        <span className={`service-badge ${customer.service}`}>
          {customer.service === 'cctv' ? 'NKSS' : 'NKBB'}
        </span>
      </div>

      <div className="card-section">
        <h4>📞 Contact</h4>
        <div className="info-row">
          <span>Mobile:</span>
          <strong>{customer.mobile}</strong>
        </div>
        <div className="info-row">
          <span>Address:</span>
          <strong>{customer.address}, {customer.city}</strong>
        </div>
      </div>

      {customer.products?.length > 0 && (
        <div className="card-section">
          <h4>🎥 Products ({customer.products.length})</h4>
          {customer.products.slice(0, 2).map((p, i) => (
            <div key={i} className="info-row">
              <span>{p.type}:</span>
              <strong>{p.model} (x{p.quantity})</strong>
            </div>
          ))}
          {customer.products.length > 2 && (
            <div className="more-products">+{customer.products.length - 2} more</div>
          )}
        </div>
      )}

      <div className="card-section">
        <h4>💰 Payment</h4>
        <div className="info-row">
          <span>Total:</span>
          <strong>₹{(customer.totalAmount || 0).toLocaleString()}</strong>
        </div>
        <div className="info-row">
          <span>Balance:</span>
          <strong className={customer.balanceAmount > 0 ? 'pending' : 'paid'}>
            ₹{(customer.balanceAmount || 0).toLocaleString()}
          </strong>
        </div>
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

function CustomerForm({ service, onSubmit, onClose, initialData }) {
  const [form, setForm] = useState(initialData || getEmptyCustomerForm(service));

  const handleSubmit = (e) => {
    e.preventDefault();
    const balance = (form.totalAmount || 0) - (form.paidAmount || 0);
    onSubmit({ ...form, balanceAmount: balance });
  };

  const addProduct = () => {
    setForm(prev => ({
      ...prev,
      products: [...(prev.products || []), { type: 'DVR/NVR Model', model: '', quantity: 1 }]
    }));
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h3>Add {service === 'cctv' ? 'CCTV' : 'Broadband'} Customer</h3>
          <button className="close-btn" onClick={onClose}><MdClose /></button>
        </div>

        <form onSubmit={handleSubmit} className="customer-form">
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
              <input 
                type="tel" 
                placeholder="Alt Mobile" 
                value={form.altMobile} 
                onChange={(e) => setForm({...form, altMobile: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Address *" 
                value={form.address} 
                onChange={(e) => setForm({...form, address: e.target.value})}
                required 
              />
              <input 
                type="text" 
                placeholder="City *" 
                value={form.city} 
                onChange={(e) => setForm({...form, city: e.target.value})}
                required 
              />
              <input 
                type="date" 
                placeholder="Install Date" 
                value={form.installDate} 
                onChange={(e) => setForm({...form, installDate: e.target.value})}
              />
            </div>
          </div>

          {service === 'cctv' && (
            <div className="form-section">
              <h4>Products</h4>
              {form.products?.map((prod, idx) => (
                <div key={idx} className="product-row">
                  <select 
                    value={prod.type} 
                    onChange={(e) => {
                      const updated = [...form.products];
                      updated[idx].type = e.target.value;
                      setForm({...form, products: updated});
                    }}
                  >
                    <option>DVR/NVR Model</option>
                    <option>Bullet Camera (Outdoor)</option>
                    <option>Dome Camera (Indoor)</option>
                    <option>Hard Disk</option>
                    <option>Cable</option>
                    <option>Power Supply</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Model" 
                    value={prod.model}
                    onChange={(e) => {
                      const updated = [...form.products];
                      updated[idx].model = e.target.value;
                      setForm({...form, products: updated});
                    }}
                  />
                  <input 
                    type="number" 
                    placeholder="Qty" 
                    value={prod.quantity}
                    onChange={(e) => {
                      const updated = [...form.products];
                      updated[idx].quantity = e.target.value;
                      setForm({...form, products: updated});
                    }}
                  />
                  <button 
                    type="button" 
                    className="remove-btn"
                    onClick={() => {
                      const updated = form.products.filter((_, i) => i !== idx);
                      setForm({...form, products: updated});
                    }}
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
              <button type="button" className="add-product-btn" onClick={addProduct}>
                <MdAdd /> Add Product
              </button>
            </div>
          )}

          <div className="form-section">
            <h4>Payment Details</h4>
            <div className="form-grid">
              <div className="field-stack">
                <label htmlFor="edit-customer-total-amount">Customer Total Billing Amount</label>
                <input 
                  id="edit-customer-total-amount"
                  type="number" 
                  placeholder="Example: 85000" 
                  value={form.totalAmount} 
                  onChange={(e) => setForm({...form, totalAmount: Number(e.target.value)})}
                />
              </div>
              <div className="field-stack">
                <label htmlFor="edit-customer-paid-amount">Total Amount Collected So Far</label>
                <input 
                  id="edit-customer-paid-amount"
                  type="number" 
                  placeholder="Example: 40000" 
                  value={form.paidAmount} 
                  onChange={(e) => setForm({...form, paidAmount: Number(e.target.value)})}
                />
              </div>
            </div>
            <textarea 
              placeholder="Remarks" 
              value={form.remark} 
              onChange={(e) => setForm({...form, remark: e.target.value})}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Save Customer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
