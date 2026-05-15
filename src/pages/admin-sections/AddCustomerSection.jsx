import { useMemo, useState } from 'react';
import {
  MdCheckCircle,
  MdInfoOutline,
  MdInventory,
  MdPayments,
  MdPeople,
} from 'react-icons/md';
import { FaVideo, FaWifi } from 'react-icons/fa';
import ProductLineEditor from './ProductLineEditor';
import {
  buildCustomerPayload,
  calculateBalance,
  countAssignedProducts,
  formatCurrency,
  getCustomers,
  getEmptyCustomerForm,
  getProductLineTotal,
  isMeaningfulProduct,
  saveCustomers,
  toNumber,
} from './adminData';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AddCustomerSection() {
  const [serviceType, setServiceType] = useState('cctv');
  const [form, setForm] = useState(() => getEmptyCustomerForm('cctv'));
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [portalStats, setPortalStats] = useState(() => {
    const customers = getCustomers();
    return {
      totalCustomers: customers.length,
      totalProducts: countAssignedProducts(customers),
      totalReceivables: customers.reduce((sum, c) => sum + c.balanceAmount, 0),
    };
  });

  const refreshPortalStats = () => {
    const customers = getCustomers();
    setPortalStats({
      totalCustomers: customers.length,
      totalProducts: countAssignedProducts(customers),
      totalReceivables: customers.reduce((sum, c) => sum + c.balanceAmount, 0),
    });
  };

  const installationOptions = useMemo(
    () =>
      serviceType === 'cctv'
        ? ['Home', 'Office', 'Shop', 'Building', 'School', 'Hospital']
        : ['Residential', 'Business', 'Office', 'Apartment', 'Enterprise', 'Campus'],
    [serviceType]
  );

  const productCount = form.products.filter((p) => isMeaningfulProduct(p, serviceType)).length;
  const suggestedProductValue = form.products.reduce((sum, p) => sum + getProductLineTotal(p), 0);
  const totalReceived = Math.max(toNumber(form.advancePay), toNumber(form.paidAmount));
  const remainingBalance = calculateBalance(form.totalAmount, totalReceived);

  const handleServiceChange = (type) => {
    setServiceType(type);
    setForm(getEmptyCustomerForm(type));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    // Save to localStorage (existing flow)
    const customers = getCustomers();
    const nextCustomer = buildCustomerPayload({ ...form, service: serviceType });
    saveCustomers([...customers, nextCustomer]);
    refreshPortalStats();

    // Also save to backend DB
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API}/api/admin/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.customerName,
          email: form.userId ? `${form.userId}@netking.in` : `${Date.now()}@netking.in`,
          password: form.password || 'NetKing@123',
          phone: form.mobile,
          service_type: serviceType === 'cctv' ? 'CC Camera' : 'Broadband',
          address: form.address,
          city: form.city,
          user_id: form.userId,
        }),
      });
    } catch { /* non-blocking */ }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setForm(getEmptyCustomerForm(serviceType));
    }, 1800);
  };

  return (
    <div className="workflow-section add-customer-section">
      {showSuccess && (
        <div className="success-toast">
          <MdCheckCircle /> Customer added successfully.
        </div>
      )}
      {apiError && <p style={{ color: 'red', marginBottom: 8 }}>{apiError}</p>}

      <div className="workflow-shell">
        <div className="workflow-main">
          <div className="workflow-hero">
            <div>
              <span className="section-eyebrow">Customer Onboarding</span>
              <h2>Add Customer</h2>
              <p>
                Create a customer profile, capture the installed products, and set the opening
                payment so the balance is tracked from day one.
              </p>
            </div>

            <div className="service-selector">
              <button
                type="button"
                className={`service-btn ${serviceType === 'cctv' ? 'active' : ''}`}
                onClick={() => handleServiceChange('cctv')}
              >
                <FaVideo /> CC Camera [NKSS]
              </button>
              <button
                type="button"
                className={`service-btn ${serviceType === 'broadband' ? 'active' : ''}`}
                onClick={() => handleServiceChange('broadband')}
              >
                <FaWifi /> Broadband [NKBB]
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="admin-form-stack">
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <span className="admin-card-eyebrow">Customer Profile</span>
                  <h3>Customer Details</h3>
                  <p>Capture the contact and location details for this account.</p>
                </div>
              </div>

              <div className="form-grid-2">
                <input
                  type="text"
                  name="customerName"
                  placeholder="Customer Name *"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number *"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="altMobile"
                  placeholder="Alternate Mobile"
                  value={form.altMobile}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address *"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
                <input
                  type="date"
                  name="installDate"
                  value={form.installDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <span className="admin-card-eyebrow">Access Setup</span>
                  <h3>Installation & Account</h3>
                  <p>Store service credentials and setup ownership for follow-up support.</p>
                </div>
              </div>

              <div className="form-grid-3">
                <select name="installType" value={form.installType} onChange={handleChange}>
                  {installationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="installTech"
                  placeholder="Assigned Technician"
                  value={form.installTech}
                  onChange={handleChange}
                />

                <input
                  type="date"
                  name="expireDate"
                  value={form.expireDate}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="userId"
                  placeholder="User ID *"
                  value={form.userId}
                  onChange={handleChange}
                  required
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password *"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                {serviceType === 'cctv' && (
                  <>
                    <input
                      type="text"
                      name="vendorCode"
                      placeholder="Vendor Code"
                      value={form.vendorCode}
                      onChange={handleChange}
                    />

                    <select name="appAccess" value={form.appAccess} onChange={handleChange}>
                      <option value="Yes - Mobile App Access">Yes - Mobile App Access</option>
                      <option value="No - No App Access">No - No App Access</option>
                    </select>
                  </>
                )}

                {serviceType === 'cctv' && (
                  <>
                    <select
                      name="currentLocation"
                      value={form.currentLocation}
                      onChange={handleChange}
                    >
                      <option value="Unit 1">Unit 1</option>
                      <option value="Unit 2">Unit 2</option>
                      <option value="Unit 3">Unit 3</option>
                    </select>

                    <select name="branch" value={form.branch} onChange={handleChange}>
                      <option value="Branch 1">Branch 1</option>
                      <option value="Branch 2">Branch 2</option>
                      <option value="Branch 3">Branch 3</option>
                    </select>
                  </>
                )}
              </div>
            </div>

            <ProductLineEditor
              service={serviceType}
              products={form.products}
              onChange={(products) => setForm((previous) => ({ ...previous, products }))}
              title={serviceType === 'cctv' ? 'Installed Products' : 'Service Items & Devices'}
              subtitle="You can add the initial items now, or continue managing them later from the Add Products page."
              actionLabel={serviceType === 'cctv' ? 'Add Device' : 'Add Service Item'}
            />

            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <span className="admin-card-eyebrow">Collections & Billing</span>
                  <h3>Customer Payment Details</h3>
                  <p>
                    Enter the customer billing amount, the advance already received, the total
                    amount collected so far, and the remaining balance to collect. The balance
                    will continue to update in the payments page.
                  </p>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="field-stack">
                  <label htmlFor="customer-total-billing">Customer Total Billing Amount</label>
                  <input
                    id="customer-total-billing"
                    type="number"
                    min="0"
                    name="totalAmount"
                    placeholder="Example: 85000"
                    value={form.totalAmount}
                    onChange={handleChange}
                  />
                </div>
                <div className="field-stack">
                  <label htmlFor="customer-advance-received">Advance Received From Customer</label>
                  <input
                    id="customer-advance-received"
                    type="number"
                    min="0"
                    name="advancePay"
                    placeholder="Example: 25000"
                    value={form.advancePay}
                    onChange={handleChange}
                  />
                </div>
                <div className="field-stack">
                  <label htmlFor="customer-total-received">Total Amount Collected So Far</label>
                  <input
                    id="customer-total-received"
                    type="number"
                    min="0"
                    name="paidAmount"
                    placeholder="Example: 40000"
                    value={form.paidAmount}
                    onChange={handleChange}
                  />
                </div>
                <div className="field-stack">
                  <label htmlFor="customer-balance-remaining">Remaining Balance To Collect</label>
                  <input
                    id="customer-balance-remaining"
                    type="text"
                    value={formatCurrency(remainingBalance)}
                    disabled
                  />
                </div>
              </div>

              {suggestedProductValue > 0 && (
                <div className="inline-note">
                  <MdInfoOutline />
                  <span>
                    Products added in this draft are worth {formatCurrency(suggestedProductValue)}.
                    {' '}
                    <button
                      type="button"
                      className="inline-link-btn"
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          totalAmount: suggestedProductValue,
                        }))
                      }
                    >
                      Use this as total billing
                    </button>
                  </span>
                </div>
              )}

              <textarea
                name="remark"
                placeholder="Remarks / notes"
                value={form.remark}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-submit-row">
              <button type="submit" className="primary-action-btn">
                <MdCheckCircle /> Save Customer
              </button>
            </div>
          </form>
        </div>

        <aside className="workflow-aside">
          <div className="sticky-summary-card">
            <span className="section-eyebrow">Live Summary</span>
            <h3>Customer Snapshot</h3>

            <div className="summary-stack">
              <div className="summary-metric">
                <span>Selected Service</span>
                <strong>{serviceType === 'cctv' ? 'CC Camera / NKSS' : 'Broadband / NKBB'}</strong>
              </div>
              <div className="summary-metric">
                <span>Products in Draft</span>
                <strong>{productCount}</strong>
              </div>
              <div className="summary-metric">
                <span>Total Received</span>
                <strong>{formatCurrency(totalReceived)}</strong>
              </div>
              <div className="summary-metric">
                <span>Remaining Balance</span>
                <strong className={remainingBalance > 0 ? 'warn' : 'ok'}>
                  {formatCurrency(remainingBalance)}
                </strong>
              </div>
            </div>

            <div className="summary-divider" />

            <div className="summary-highlight-grid">
              <div className="summary-highlight-card">
                <MdPeople />
                <div>
                  <strong>{portalStats.totalCustomers}</strong>
                  <span>Total Customers</span>
                </div>
              </div>
              <div className="summary-highlight-card">
                <MdInventory />
                <div>
                  <strong>{portalStats.totalProducts}</strong>
                  <span>Products Assigned</span>
                </div>
              </div>
              <div className="summary-highlight-card">
                <MdPayments />
                <div>
                  <strong>{formatCurrency(portalStats.totalReceivables)}</strong>
                  <span>Open Balance</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
