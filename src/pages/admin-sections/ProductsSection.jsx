import { useState, useEffect } from 'react';
import {
  MdArrowBack,
  MdCheckCircle,
  MdPersonSearch,
  MdSearch,
  MdAdd,
  MdRemove,
} from 'react-icons/md';
import { FaVideo, FaWifi } from 'react-icons/fa';
import { PAYMENT_METHODS } from './adminData';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` };
}

export default function ProductsSection() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [pastProducts, setPastProducts] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await fetch(`${API}/api/admin/customers`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Load product count for each customer
      const customersWithProducts = await Promise.all(
        data.map(async (customer) => {
          const prodRes = await fetch(`${API}/api/admin/customers/${customer.id}/products`, {
            headers: authHeaders(),
          });
          const products = await prodRes.json();
          return { ...customer, productCount: products.length };
        })
      );
      
      setCustomers(customersWithProducts);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const loadCustomerProducts = async (customerId) => {
    try {
      const res = await fetch(`${API}/api/admin/customers/${customerId}/products`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Convert API format to editor format
      const editorProducts = data.map(p => ({
        type: p.product_name,
        model: p.product_description || '',
        quantity: p.quantity,
        unitPrice: Number(p.price),
        serialNo: p.serial_number || '',
        vendorCode: p.vendor_code || '',
      }));
      
      setPastProducts(editorProducts);
      setProducts([getEmptyProduct()]);
    } catch (err) {
      setError(err.message);
      setPastProducts([]);
      setProducts([getEmptyProduct()]);
    }
  };

  const getEmptyProduct = () => ({
    type: '',
    model: '',
    serialNo: '',
    vendorCode: '',
    quantity: 1,
    unitPrice: 0,
  });

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const totalAssignedProducts = customers.reduce((sum, c) => sum + (c.productCount || 0), 0);
  const customersWithProducts = customers.filter(c => (c.productCount || 0) > 0).length;
  const customersMissingProducts = customers.filter(c => (c.productCount || 0) === 0).length;

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm) ||
      customer.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = serviceFilter === 'all' || 
      (serviceFilter === 'cctv' && customer.service_type === 'CC Camera') ||
      (serviceFilter === 'broadband' && customer.service_type === 'Broadband');
    return matchesSearch && matchesService;
  });

  const saveProductsToCustomer = async () => {
    if (!selectedCustomer) return;

    // Check if at least one meaningful product is being added
    const productsToAdd = products.filter(p => p.type && p.unitPrice > 0);
    if (productsToAdd.length === 0) {
      alert('Please add at least one product with a Name and Unit Price.');
      return;
    }

    setIsSaving(true);
    try {
      // Add all new products
      for (const product of productsToAdd) {
        // Check if product exists in catalog
        const catalogRes = await fetch(`${API}/api/admin/products`, { headers: authHeaders() });
        const catalog = await catalogRes.json();
        let dbProduct = catalog.find(p => p.name === product.type);
        
        if (!dbProduct) {
          // Create product in catalog
          const res = await fetch(`${API}/api/admin/products`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({
              name: product.type,
              description: product.model || '',
              price: product.unitPrice,
            }),
          });
          dbProduct = await res.json();
        }

        // Assign product to customer
        await fetch(`${API}/api/admin/customers/${selectedCustomer.id}/products`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            productId: dbProduct.id,
            quantity: product.quantity,
            price: product.unitPrice,
            serialNumber: product.serialNo,
            vendorCode: product.vendorCode,
          }),
        });
      }

      // Process payment if entered
      if (Number(paymentAmount) > 0) {
        await fetch(`${API}/api/admin/customers/${selectedCustomer.id}/payments`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ 
            amount: Number(paymentAmount), 
            note: `${paymentMethod} - Payment for assigned products on ${paymentDate}` 
          }),
        });
        setPaymentAmount('');
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      // Reload customers to update counts
      loadCustomers();
      // Reload past products list and reset draft
      loadCustomerProducts(selectedCustomer.id);
    } catch (err) {
      alert('Failed to save products: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomerId(customer.id);
    loadCustomerProducts(customer.id);
  };

  const updateProduct = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([...products, getEmptyProduct()]);
  };

  const removeProduct = (index) => {
    if (products.length === 1) {
      setProducts([getEmptyProduct()]);
    } else {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);

  if (loading) return <div style={{ padding: 40 }}>Loading customers...</div>;
  if (error) return <div style={{ padding: 40, color: 'red' }}>Error: {error}</div>;

  return (
    <div className="workflow-section products-section">
      {showSuccess && (
        <div className="success-toast">
          <MdCheckCircle /> Products saved! Customer will see these in their portal.
        </div>
      )}

      {!selectedCustomer ? (
        <>
          <div className="workflow-hero">
            <div>
              <span className="section-eyebrow">Product Assignment</span>
              <h2>Assign Products To Customers</h2>
              <p>
                Select a customer to assign products, devices, or services. All data is saved to the database and visible in customer portal.
              </p>
            </div>

            <div className="compact-stats-grid">
              <div className="compact-stat-card">
                <strong>{totalAssignedProducts}</strong>
                <span>Total Products Assigned</span>
              </div>
              <div className="compact-stat-card">
                <strong>{customersWithProducts}</strong>
                <span>Customers With Products</span>
              </div>
              <div className="compact-stat-card">
                <strong>{customersMissingProducts}</strong>
                <span>Customers Without Products</span>
              </div>
            </div>
          </div>

          <div className="filter-toolbar">
            <div className="search-box-large">
              <MdSearch />
              <input
                type="text"
                placeholder="Search by customer name, phone, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="segmented-group">
              <button
                type="button"
                className={serviceFilter === 'all' ? 'active' : ''}
                onClick={() => setServiceFilter('all')}
              >
                All Services
              </button>
              <button
                type="button"
                className={serviceFilter === 'cctv' ? 'active' : ''}
                onClick={() => setServiceFilter('cctv')}
              >
                <FaVideo /> CC Camera
              </button>
              <button
                type="button"
                className={serviceFilter === 'broadband' ? 'active' : ''}
                onClick={() => setServiceFilter('broadband')}
              >
                <FaWifi /> Broadband
              </button>
            </div>
          </div>

          <div className="customer-select-grid">
            {filteredCustomers.length === 0 ? (
              <div className="empty-state-card">
                <MdPersonSearch />
                <h3>No matching customers</h3>
                <p>Try a different search term or adjust the filters above.</p>
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  className="customer-select-card"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <div className="csc-header">
                    <div>
                      <h3>{customer.name}</h3>
                      <p style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0 0' }}>
                        {customer.service_type === 'Broadband' ? <FaWifi /> : <FaVideo />}
                        {customer.service_type}
                      </p>
                    </div>
                    <span className="csc-badge" style={{ 
                      background: (customer.productCount || 0) > 0 ? '#dcfce7' : '#fee2e2',
                      color: (customer.productCount || 0) > 0 ? '#166534' : '#991b1b'
                    }}>
                      {customer.productCount || 0} products
                    </span>
                  </div>

                  <div className="csc-info">
                    <span>📞 {customer.phone}</span>
                    <span>📍 {customer.city || '—'}</span>
                    {customer.user_id && <span>🆔 {customer.user_id}</span>}
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="products-editor">
          <div className="editor-hero-card">
            <div className="editor-hero-copy">
              <button
                type="button"
                className="ghost-action-btn"
                onClick={() => setSelectedCustomerId(null)}
              >
                <MdArrowBack /> Back To Customer List
              </button>
              <span className="section-eyebrow">Assigning Products To</span>
              <h2>{selectedCustomer.name}</h2>
              <p>
                📞 {selectedCustomer.phone} • 📍 {selectedCustomer.address || selectedCustomer.city}
              </p>
              {selectedCustomer.user_id && (
                <p style={{ marginTop: 8, fontSize: '0.9rem', color: '#6b7280' }}>
                  🆔 Customer Login ID: <strong>{selectedCustomer.user_id}</strong>
                </p>
              )}
            </div>

            <div className="editor-hero-metrics">
              <div className="compact-stat-card">
                <strong>{products.filter(p => p.type).length}</strong>
                <span>Product Lines</span>
              </div>
              <div className="compact-stat-card">
                <strong>₹{totalValue.toLocaleString()}</strong>
                <span>Total Value</span>
              </div>
            </div>
          </div>

          {/* Past Assigned Products (Read Only) */}
          <div className="admin-card" style={{ marginBottom: 24, borderLeft: '4px solid #3b82f6' }}>
            <div className="admin-card-header">
              <div>
                <span className="admin-card-eyebrow" style={{ color: '#3b82f6' }}>History</span>
                <h3>Past Added Products & Devices</h3>
                <p>These products are already assigned to the customer and cannot be edited.</p>
              </div>
            </div>

            {pastProducts.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280', background: '#f9fafb', borderRadius: 8 }}>
                No products have been assigned in the past.
              </div>
            ) : (
              <div className="table-wrapper" style={{ overflowX: 'auto', marginTop: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700 }}>Product Name</th>
                      <th style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700 }}>Model / Description</th>
                      <th style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700 }}>Serial No</th>
                      <th style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700 }}>Vendor</th>
                      <th style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>Qty</th>
                      <th style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, textAlign: 'right' }}>Unit Price</th>
                      <th style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastProducts.map((p, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '10px 12px', fontSize: 14, fontWeight: 600 }}>{p.type}</td>
                        <td style={{ padding: '10px 12px', fontSize: 13, color: '#4b5563' }}>{p.model || '—'}</td>
                        <td style={{ padding: '10px 12px', fontSize: 13, fontFamily: 'monospace' }}>{p.serialNo || '—'}</td>
                        <td style={{ padding: '10px 12px', fontSize: 13 }}>{p.vendorCode || '—'}</td>
                        <td style={{ padding: '10px 12px', fontSize: 14, textAlign: 'center' }}>{p.quantity}</td>
                        <td style={{ padding: '10px 12px', fontSize: 14, textAlign: 'right' }}>₹{p.unitPrice.toLocaleString()}</td>
                        <td style={{ padding: '10px 12px', fontSize: 14, fontWeight: 700, textAlign: 'right', color: '#111827' }}>
                          ₹{(p.quantity * p.unitPrice).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {pastProducts.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, padding: '10px 12px', background: '#eff6ff', borderRadius: 8 }}>
                <span style={{ fontSize: 14, color: '#1e40af', fontWeight: 600 }}>
                  Total Past Value: ₹{pastProducts.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Add New Products (Editable Form) */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <span className="admin-card-eyebrow">Action Required</span>
                <h3>Add New Products & Devices</h3>
                <p>Fill out details below to assign new products. Outstanding balances are updated and calculated on the <strong>Payments Page</strong>.</p>
              </div>
            </div>

            <div className="product-line-list">
              {products.map((product, index) => (
                <div key={index} className="product-line-row">
                  <input
                    type="text"
                    placeholder="Product Name *"
                    value={product.type}
                    onChange={(e) => updateProduct(index, 'type', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Model / Description"
                    value={product.model}
                    onChange={(e) => updateProduct(index, 'model', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Serial No"
                    value={product.serialNo}
                    onChange={(e) => updateProduct(index, 'serialNo', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Vendor Code"
                    value={product.vendorCode}
                    onChange={(e) => updateProduct(index, 'vendorCode', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => updateProduct(index, 'quantity', Number(e.target.value))}
                  />
                  <input
                    type="number"
                    placeholder="Unit Price"
                    min="0"
                    value={product.unitPrice}
                    onChange={(e) => updateProduct(index, 'unitPrice', Number(e.target.value))}
                  />
                  <div className="product-line-total">
                    <span>Total</span>
                    <strong>₹{(product.quantity * product.unitPrice).toLocaleString()}</strong>
                  </div>
                  <button
                    type="button"
                    className="icon-action-btn danger"
                    onClick={() => removeProduct(index)}
                  >
                    <MdRemove />
                  </button>
                </div>
              ))}
            </div>

            <button type="button" className="secondary-action-btn" onClick={addProduct}>
              <MdAdd /> Add Product Line
            </button>

            <div className="product-total-chip" style={{ marginTop: 20 }}>
              <span>New Products Value</span>
              <strong style={{ fontSize: 20, color: '#e01020' }}>₹{totalValue.toLocaleString()}</strong>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <span className="admin-card-eyebrow">Collections</span>
                <h3>Record Payment</h3>
                <p>Optionally record a payment received from the customer for these products.</p>
              </div>
            </div>
            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <input
                type="number"
                min="0"
                placeholder="Amount Received (₹)"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="form-submit-row">
            <button type="button" className="primary-action-btn" onClick={saveProductsToCustomer} disabled={isSaving}>
              <MdCheckCircle /> {isSaving ? 'Saving...' : 'Save & Sync Products To Customer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
