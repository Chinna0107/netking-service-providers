import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MdLogout, MdDashboard, MdInventory, MdWarning,
  MdPhone, MdEmail, MdLocationOn, MdCalendarToday, MdSend,
} from 'react-icons/md';
import { FaVideo, FaWifi } from 'react-icons/fa';
import './CustomerPanel.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` };
}

export default function CustomerPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    // First check URL params, then localStorage, then default to dashboard
    return searchParams.get('tab') || localStorage.getItem('customerActiveTab') || 'dashboard';
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { nav('/login'); return; }
    fetch(`${API}/api/admin/customers/me`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => { setProfile(data); setLoading(false); })
      .catch(() => { setError('Failed to load profile'); setLoading(false); });
  }, [nav]);

  // Set initial URL param if not present
  useEffect(() => {
    if (!searchParams.get('tab')) {
      const savedTab = localStorage.getItem('customerActiveTab') || 'dashboard';
      setSearchParams({ tab: savedTab }, { replace: true });
    }
  }, []);

  // Sync URL params with active tab
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  // Update URL and localStorage when active tab changes
  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    localStorage.setItem('customerActiveTab', tab);
  };

  const logout = () => {
    ['token', 'userRole', 'userEmail', 'customerActiveTab'].forEach(k => localStorage.removeItem(k));
    nav('/');
  };

  if (loading) return <main className="customer-panel-page"><p style={{ padding: 40 }}>Loading...</p></main>;
  if (error) return <main className="customer-panel-page"><p style={{ padding: 40, color: 'red' }}>{error}</p></main>;

  const serviceIcon = profile?.service_type === 'Broadband' ? <FaWifi /> : <FaVideo />;

  return (
    <main className="customer-panel-page">
      {/* Header */}
      <section className="cp-header">
        <div className="container cp-header-inner">
          <div className="cp-title">
            <h1>My Dashboard</h1>
            <p>Welcome back, {profile?.name}!</p>
          </div>
          <button className="cp-logout" onClick={logout}><MdLogout /> Logout</button>
        </div>
      </section>

      {/* Profile Card */}
      <section className="cp-info-sec">
        <div className="container">
          <div className="cp-info-card">
            <div className="cic-header">
              <div className="cic-avatar">{profile?.name?.charAt(0)}</div>
              <div className="cic-details">
                <h2>{profile?.name}</h2>
                <p className="cic-amc">
                  Service: <span className="amc-badge">{serviceIcon} {profile?.service_type || '—'}</span>
                </p>
                {profile?.user_id && (
                  <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 4 }}>
                    User ID: <strong>{profile.user_id}</strong>
                  </p>
                )}
              </div>
            </div>
            <div className="cic-grid">
              {profile?.email && <div className="cic-item"><MdEmail /><span>{profile.email}</span></div>}
              {profile?.phone && <div className="cic-item"><MdPhone /><span>{profile.phone}</span></div>}
              {profile?.city && <div className="cic-item"><MdLocationOn /><span>{profile.address ? `${profile.address}, ` : ''}{profile.city}</span></div>}
              {profile?.created_at && <div className="cic-item"><MdCalendarToday /><span>Member since {new Date(profile.created_at).toLocaleDateString()}</span></div>}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="cp-stats">
        <div className="container">
          <div className="stats-grid">
            {[
              { label: 'Products Assigned', val: profile?.products?.length || 0, ico: '📦', color: '#8b5cf6' },
              { label: 'Active Subscriptions', val: profile?.subscriptions?.filter(s => s.status === 'active').length || 0, ico: '📅', color: '#6366f1' },
              { label: 'Open Complaints', val: profile?.complaints?.filter(c => c.status !== 'resolved').length || 0, ico: '⏳', color: '#f59e0b' },
              { label: 'Resolved', val: profile?.complaints?.filter(c => c.status === 'resolved').length || 0, ico: '✅', color: '#10b981' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ '--sc': s.color }}>
                <div className="stat-ico">{s.ico}</div>
                <div className="stat-body">
                  <span className="stat-label">{s.label}</span>
                  <div className="stat-val">{s.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="cp-tabs-sec">
        <div className="container">
          <div className="cp-tabs">
            <button className={`cp-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleSetActiveTab('dashboard')}>
              <MdDashboard /> Dashboard
            </button>
            <button className={`cp-tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => handleSetActiveTab('products')}>
              <MdInventory /> My Products
            </button>
            <button className={`cp-tab ${activeTab === 'subscriptions' ? 'active' : ''}`} onClick={() => handleSetActiveTab('subscriptions')}>
              <MdCalendarToday /> Subscriptions
            </button>
            <button className={`cp-tab ${activeTab === 'complaints' ? 'active' : ''}`} onClick={() => handleSetActiveTab('complaints')}>
              <MdWarning /> Complaints
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="cp-content">
        <div className="container">

          {activeTab === 'dashboard' && (
            <div className="cp-dashboard">
              <div className="cd-grid">
                <div className="cd-card">
                  <h3>🎯 Quick Actions</h3>
                  <div className="quick-actions">
                    <a href="tel:9248353592" className="qa-btn"><MdPhone /> Call Support</a>
                    <a href="https://wa.me/919248353592" className="qa-btn wa" target="_blank" rel="noreferrer">
                      <span>💬</span> WhatsApp
                    </a>
                    <button className="qa-btn" onClick={() => handleSetActiveTab('complaints')}>
                      <MdWarning /> Raise Complaint
                    </button>
                  </div>
                </div>
                <div className="cd-card">
                  <h3>📦 My Products & Devices</h3>
                  {!profile?.products || profile.products.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', background: '#f9fafb', borderRadius: 8 }}>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                        No products assigned yet.
                        <br />Contact admin to assign products to your account.
                      </p>
                    </div>
                  ) : (
                    <>
                      <p style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#6b7280' }}>
                        <strong>{profile.products.length}</strong> product(s) assigned to your account
                      </p>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #1e40af', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                            <th style={{ textAlign: 'left', padding: '10px 8px', color: '#ffffff', fontWeight: 700 }}>Product</th>
                            <th style={{ textAlign: 'right', padding: '10px 8px', color: '#ffffff', fontWeight: 700 }}>Qty</th>
                            <th style={{ textAlign: 'right', padding: '10px 8px', color: '#ffffff', fontWeight: 700 }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {profile.products.slice(0, 5).map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb', background: '#ffffff' }}>
                              <td style={{ padding: '10px 8px', color: '#1e40af', fontWeight: 700, fontSize: '0.95rem' }}>{p.product_name}</td>
                              <td style={{ textAlign: 'right', padding: '10px 8px', fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{p.quantity}</td>
                              <td style={{ textAlign: 'right', padding: '10px 8px', fontWeight: 800, color: '#7c3aed', fontSize: '1rem' }}>₹{Number(p.total).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {profile.products.length > 5 && (
                        <p style={{ margin: '12px 0 0', fontSize: '0.85rem', color: '#6b7280', textAlign: 'center' }}>
                          +{profile.products.length - 5} more products. <button onClick={() => handleSetActiveTab('products')} style={{ color: '#8b5cf6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}>View all</button>
                        </p>
                      )}
                      
                      {/* Payment Due Alert in Dashboard */}
                      {profile.balance_due > 0 && (
                        <div style={{ marginTop: 16, padding: '14px 18px', background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', borderRadius: 12, border: '3px solid #dc2626', boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#7f1d1d', fontWeight: 800, fontSize: '1rem' }}>⚠️ Payment Due:</span>
                            <strong style={{ color: '#b91c1c', fontSize: '1.4rem', fontWeight: 900 }}>₹{Number(profile.balance_due).toLocaleString()}</strong>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="cp-table">
              <h3><MdInventory /> My Assigned Products & Devices</h3>
              {!profile?.products || profile.products.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f9fafb', borderRadius: 12, margin: '20px 0' }}>
                  <MdInventory style={{ fontSize: 48, color: '#d1d5db', marginBottom: 12 }} />
                  <h4 style={{ margin: '0 0 8px', color: '#6b7280' }}>No Products Assigned Yet</h4>
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem' }}>
                    Your admin will assign products, devices, or services to your account soon.
                    <br />Once assigned, they will appear here with full details.
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 16, padding: 12, background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e40af' }}>
                      📦 <strong>{profile.products.length}</strong> product(s) assigned to your account
                    </p>
                  </div>
                  <table>
                    <thead>
                      <tr style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                        <th style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>Product / Device</th>
                        <th style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>Description</th>
                        <th style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>Quantity</th>
                        <th style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>Unit Price</th>
                        <th style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>Total Amount</th>
                        <th style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>Assigned Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.products.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb', background: '#ffffff' }}>
                          <td><strong style={{ color: '#1e40af', fontSize: '0.95rem' }}>{p.product_name}</strong></td>
                          <td style={{ color: '#475569', fontSize: '0.9rem' }}>{p.description || '—'}</td>
                          <td style={{ textAlign: 'center', fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{p.quantity}</td>
                          <td style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>₹{Number(p.price).toLocaleString()}</td>
                          <td><strong style={{ color: '#7c3aed', fontSize: '1.1rem', fontWeight: 800 }}>₹{Number(p.total).toLocaleString()}</strong></td>
                          <td style={{ color: '#64748b', fontSize: '0.9rem' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', fontWeight: 800 }}>
                        <td colSpan="4" style={{ textAlign: 'right', color: '#ffffff', fontSize: '1.1rem', padding: '14px' }}>Total Value:</td>
                        <td style={{ color: '#ffffff', fontSize: '1.3rem', fontWeight: 900, padding: '14px' }}>₹{profile.products.reduce((sum, p) => sum + Number(p.total), 0).toLocaleString()}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                  
                  {/* Payment Due Alert */}
                  {profile.balance_due > 0 && (
                    <div style={{ marginTop: 24, padding: '20px 24px', background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', borderRadius: 16, border: '3px solid #dc2626', boxShadow: '0 8px 24px rgba(220, 38, 38, 0.4)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                        <span style={{ fontSize: 36 }}>⚠️</span>
                        <div>
                          <h4 style={{ margin: 0, color: '#7f1d1d', fontSize: '1.3rem', fontWeight: 900 }}>Payment Due</h4>
                          <p style={{ margin: '6px 0 0', color: '#991b1b', fontSize: '1rem', fontWeight: 600 }}>You have an outstanding balance</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, padding: '16px 20px', background: 'white', borderRadius: 12, border: '2px solid #dc2626' }}>
                        <span style={{ color: '#7f1d1d', fontWeight: 800, fontSize: '1.1rem' }}>Amount Due:</span>
                        <strong style={{ color: '#b91c1c', fontSize: '1.8rem', fontWeight: 900 }}>₹{Number(profile.balance_due).toLocaleString()}</strong>
                      </div>
                      <a href="tel:9248353592" style={{ display: 'block', marginTop: 16, padding: '16px', background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: 'white', textAlign: 'center', borderRadius: 12, textDecoration: 'none', fontWeight: 900, fontSize: '1.05rem', boxShadow: '0 6px 20px rgba(220, 38, 38, 0.5)', transition: 'transform 0.2s' }}>
                        📞 Contact Admin to Pay
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="cp-table">
              <h3><MdCalendarToday /> My Subscriptions</h3>
              {!profile?.subscriptions || profile.subscriptions.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f9fafb', borderRadius: 12, margin: '20px 0' }}>
                  <MdCalendarToday style={{ fontSize: 48, color: '#d1d5db', marginBottom: 12 }} />
                  <h4 style={{ margin: '0 0 8px', color: '#6b7280' }}>No Active Subscriptions</h4>
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem' }}>
                    You don't have any subscription plans assigned yet.
                    <br />Contact admin to subscribe to a plan.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 20, marginTop: 20 }}>
                  {profile.subscriptions.map(sub => (
                    <div key={sub.id} style={{ 
                      border: '3px solid #3b82f6', 
                      borderRadius: 16, 
                      padding: 24, 
                      background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
                      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.2)',
                      transition: 'transform 0.3s ease'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16, paddingBottom: 16, borderBottom: '2px solid #dbeafe' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#1e40af' }}>{sub.plan_name}</h4>
                          <p style={{ margin: '8px 0 0', fontSize: '0.95rem', color: '#1e3a8a', fontWeight: 600, background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>
                            📅 {new Date(sub.start_date).toLocaleDateString()} - {new Date(sub.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#7c3aed', marginBottom: 8 }}>₹{Number(sub.amount).toLocaleString()}</div>
                          <span style={{ 
                            fontSize: '0.85rem', 
                            padding: '6px 14px', 
                            borderRadius: 999, 
                            background: sub.status === 'active' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                            color: '#ffffff',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            boxShadow: sub.status === 'active' ? '0 4px 12px rgba(16, 185, 129, 0.4)' : '0 4px 12px rgba(239, 68, 68, 0.4)',
                            letterSpacing: '0.5px'
                          }}>
                            {sub.status}
                          </span>
                        </div>
                      </div>
                      {sub.notes && (
                        <div style={{ margin: '16px 0 0', padding: '16px 18px', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderRadius: 12, fontSize: '0.95rem', color: '#78350f', fontWeight: 600, border: '2px solid #fbbf24', boxShadow: '0 4px 12px rgba(251, 191, 36, 0.2)' }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'start' }}>
                            <span style={{ fontSize: '1.2rem' }}>📝</span>
                            <div style={{ flex: 1 }}>
                              {sub.notes.split('|').map((item, idx) => {
                                const trimmed = item.trim();
                                if (trimmed.startsWith('Total:') || trimmed.startsWith('Paid:') || trimmed.startsWith('Discount:') || trimmed.startsWith('Balance:')) {
                                  const [label, value] = trimmed.split(':');
                                  const isBalance = label === 'Balance';
                                  return (
                                    <div key={idx} style={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between', 
                                      padding: '8px 12px', 
                                      background: isBalance && Number(value.replace(/[^0-9]/g, '')) > 0 ? 'linear-gradient(135deg, #fee2e2, #fecaca)' : '#ffffff',
                                      borderRadius: 8,
                                      marginBottom: idx < sub.notes.split('|').length - 1 ? 8 : 0,
                                      border: isBalance && Number(value.replace(/[^0-9]/g, '')) > 0 ? '2px solid #dc2626' : '1px solid #fbbf24'
                                    }}>
                                      <span style={{ fontWeight: 700, color: isBalance && Number(value.replace(/[^0-9]/g, '')) > 0 ? '#7f1d1d' : '#92400e' }}>{label}:</span>
                                      <strong style={{ 
                                        fontSize: '1.05rem', 
                                        color: isBalance && Number(value.replace(/[^0-9]/g, '')) > 0 ? '#b91c1c' : label === 'Paid' ? '#059669' : '#92400e',
                                        fontWeight: 900
                                      }}>{value}</strong>
                                    </div>
                                  );
                                }
                                return <p key={idx} style={{ margin: '4px 0', color: '#78350f', fontWeight: 600 }}>{trimmed}</p>;
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                      {sub.auto_renew && (
                        <div style={{ margin: '12px 0 0', padding: '10px 14px', background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', borderRadius: 10, fontSize: '0.9rem', color: '#065f46', fontWeight: 700, border: '2px solid #10b981', display: 'inline-block' }}>
                          ✅ Auto-renewal enabled
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'complaints' && (
            <ComplaintsTab
              complaints={profile?.complaints || []}
              onRaised={(newC) => setProfile(prev => ({ ...prev, complaints: [newC, ...prev.complaints] }))}
            />
          )}

        </div>
      </section>
    </main>
  );
}

function ComplaintsTab({ complaints, onRaised }) {
  const [form, setForm] = useState({ subject: '', description: '', priority: 'medium' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');
    try {
      const res = await fetch(`${API}/api/admin/complaints`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onRaised(data);
      setForm({ subject: '', description: '', priority: 'medium' });
      setMsg('Complaint raised successfully!');
    } catch (err) {
      setMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = { open: '#f59e0b', 'in-progress': '#3b82f6', resolved: '#10b981' };
  const priorityColor = { high: '#dc2626', medium: '#f59e0b', low: '#10b981' };

  return (
    <div className="cp-complaints">
      {/* Raise Complaint Form */}
      <div className="cd-card" style={{ marginBottom: 24 }}>
        <h3><MdSend /> Raise a Complaint</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          <input
            type="text" placeholder="Subject *" required
            value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
            style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e7eb', fontSize: '0.95rem' }}
          />
          <textarea
            rows={3} placeholder="Describe your issue..."
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e7eb', fontSize: '0.95rem', resize: 'vertical' }}
          />
          <select
            value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
            style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e7eb', fontSize: '0.95rem' }}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          {msg && <p style={{ color: msg.includes('success') ? '#10b981' : '#dc2626', fontSize: '0.9rem', fontWeight: 600 }}>{msg}</p>}
          <button type="submit" disabled={submitting}
            style={{ padding: '11px 20px', borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s ease' }}>
            {submitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>

      {/* Complaints List */}
      <h3><MdWarning /> My Complaints</h3>
      {complaints.length === 0 ? (
        <p style={{ color: '#6b7280', padding: '16px 0' }}>No complaints raised yet.</p>
      ) : (
        <div className="complaints-grid">
          {complaints.map(c => (
            <div key={c.id} className="complaint-card">
              <div className="cc-header">
                <div>
                  <h4>{c.subject}</h4>
                  <span className="cc-id">#{c.id}</span>
                </div>
                <span className="cc-priority" style={{ background: priorityColor[c.priority] + '22', color: priorityColor[c.priority], padding: '4px 10px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700 }}>
                  {c.priority}
                </span>
              </div>
              {c.description && <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: '8px 0' }}>{c.description}</p>}
              <div className="cc-body">
                <span className="cc-date">📅 {new Date(c.created_at).toLocaleDateString()}</span>
                <span style={{ background: statusColor[c.status] + '22', color: statusColor[c.status], padding: '4px 10px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700 }}>
                  {c.status}
                </span>
              </div>
              {(c.technician_name || c.slot_description) && (
                <div style={{ marginTop: 12, padding: '14px 16px', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', borderRadius: 12, fontSize: '0.95rem', border: '2px solid #10b981', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)' }}>
                  {c.technician_name && <p style={{ margin: '0 0 6px', color: '#064e3b', fontWeight: 700, fontSize: '1rem' }}>👷 Technician: <strong style={{ color: '#065f46', fontSize: '1.05rem' }}>{c.technician_name}</strong></p>}
                  {c.slot_description && <p style={{ margin: 0, color: '#064e3b', fontWeight: 700, fontSize: '1rem' }}>🗓️ Slot: <strong style={{ color: '#065f46', fontSize: '1.05rem' }}>{c.slot_description}</strong></p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
