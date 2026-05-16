import { useState, useEffect } from 'react';
import { MdSearch, MdClose, MdAssignment, MdEdit } from 'react-icons/md';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` };
}

export default function TicketsSection() {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { loadComplaints(); }, []);

  const loadComplaints = async () => {
    try {
      const res = await fetch(`${API}/api/admin/complaints`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComplaints(data);
    } catch (err) { setError(err.message); }
  };

  const updateComplaint = async (id, patch, onSuccess, onError) => {
    try {
      const res = await fetch(`${API}/api/admin/complaints/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComplaints(prev => prev.map(c => c.id === id ? data : c));
      setEditingId(null);
      if (onSuccess) onSuccess();
    } catch (err) { 
      setError(err.message); 
      if (onError) onError();
    }
  };

  const filtered = complaints.filter(c => {
    const matchSearch = c.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="tickets-section">
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="section-header">
        <div className="search-box">
          <MdSearch />
          <input type="text" placeholder="Search complaints..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {['all', 'open', 'in-progress', 'resolved'].map(s => (
            <button key={s} className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(s)}>
              {s.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="tickets-grid">
        {filtered.length === 0 ? (
          <div className="no-data">No complaints found</div>
        ) : filtered.map(c => (
          <ComplaintCard
            key={c.id}
            complaint={c}
            isEditing={editingId === c.id}
            onEdit={() => setEditingId(c.id)}
            onClose={() => setEditingId(null)}
            onUpdate={(patch, onSuccess, onError) => updateComplaint(c.id, patch, onSuccess, onError)}
          />
        ))}
      </div>
    </div>
  );
}

function ComplaintCard({ complaint: c, isEditing, onEdit, onClose, onUpdate }) {
  const [form, setForm] = useState({
    status: c.status,
    slot_description: c.slot_description || '',
    technician_name: c.technician_name || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = () => {
    setIsSaving(true);
    onUpdate(form, () => setIsSaving(false), () => setIsSaving(false));
  };

  const priorityColor = { high: '#dc2626', medium: '#f59e0b', low: '#10b981' }[c.priority] || '#6b7280';
  const statusColor = { open: '#f59e0b', 'in-progress': '#3b82f6', resolved: '#10b981' }[c.status] || '#6b7280';

  return (
    <div className="ticket-card">
      <div className="card-header">
        <div>
          <h3>{c.customer_name}</h3>
          <span className="customer-name">{c.subject}</span>
        </div>
        <div className="badges">
          <span className="priority-badge" style={{ backgroundColor: priorityColor }}>{c.priority}</span>
          <span className="status-badge" style={{ backgroundColor: statusColor }}>{c.status}</span>
        </div>
      </div>

      {c.description && (
        <div className="card-section">
          <h4>📝 Description</h4>
          <p className="description">{c.description}</p>
        </div>
      )}

      <div className="card-section">
        <h4>🔧 Schedule</h4>
        <div className="info-row"><span>Technician:</span><strong>{c.technician_name || '—'}</strong></div>
        <div className="info-row"><span>Slot:</span><strong>{c.slot_description || '—'}</strong></div>
        <div className="info-row"><span>Raised:</span><strong>{new Date(c.created_at).toLocaleDateString()}</strong></div>
      </div>

      {isEditing ? (
        <div className="card-section">
          <h4>✏️ Update</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <input type="text" placeholder="Technician Name"
              value={form.technician_name} onChange={e => setForm({ ...form, technician_name: e.target.value })} />
            <textarea rows={3} placeholder="Slot description (date, time, notes...)"
              value={form.slot_description} onChange={e => setForm({ ...form, slot_description: e.target.value })} />
          </div>
          <div className="card-actions" style={{ marginTop: 10 }}>
            <button className="edit-btn" onClick={handleUpdate} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button className="delete-btn" onClick={onClose}><MdClose /> Cancel</button>
          </div>
        </div>
      ) : (
        <div className="card-actions">
          <button className="edit-btn" onClick={onEdit}><MdEdit /> Update Slot</button>
        </div>
      )}
    </div>
  );
}
