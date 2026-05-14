import { useState, useEffect } from 'react';
import { MdAdd, MdClose, MdCheckCircle, MdCancel } from 'react-icons/md';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function authHeaders() {
  const token = localStorage.getItem('token');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, { ...options, headers: authHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export default function AttendanceSection() {
  const [staff, setStaff] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadStaff(); }, []);
  useEffect(() => { loadAttendance(); }, [selectedDate]);

  const loadStaff = async () => {
    try {
      const data = await apiFetch('/api/admin/staff');
      setStaff(data);
    } catch (err) { setError(err.message); }
  };

  const loadAttendance = async () => {
    try {
      const data = await apiFetch(`/api/admin/attendance?date=${selectedDate}`);
      setAttendance(data);
    } catch (err) { setError(err.message); }
  };

  const markAttendance = async (staffId, status, checkIn = null, checkOut = null) => {
    try {
      const record = await apiFetch('/api/admin/attendance', {
        method: 'POST',
        body: JSON.stringify({ staffId, date: selectedDate, status, checkIn, checkOut }),
      });
      setAttendance(prev => {
        const exists = prev.find(a => a.staff_id === staffId);
        if (exists) return prev.map(a => a.staff_id === staffId ? { ...a, ...record } : a);
        return [...prev, record];
      });
    } catch (err) { setError(err.message); }
  };

  const addStaff = async (form) => {
    try {
      const newStaff = await apiFetch('/api/admin/staff', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setStaff(prev => [...prev, newStaff]);
      setShowAddStaffForm(false);
    } catch (err) { setError(err.message); }
  };

  const deleteStaff = async (id) => {
    try {
      await apiFetch(`/api/admin/staff/${id}`, { method: 'DELETE' });
      setStaff(prev => prev.filter(s => s.id !== id));
      setAttendance(prev => prev.filter(a => a.staff_id !== id));
    } catch (err) { setError(err.message); }
  };

  const presentCount = attendance.filter(a => a.status === 'present').length;
  const absentCount = staff.length - presentCount;

  return (
    <div className="attendance-section">
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="section-header">
        <div className="date-selector">
          <label>Select Date:</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
        <button className="add-btn" onClick={() => setShowAddStaffForm(true)}>
          <MdAdd /> Add Staff
        </button>
      </div>

      <div className="attendance-stats">
        <div className="stat-card present">
          <MdCheckCircle />
          <div><h3>{presentCount}</h3><p>Present Today</p></div>
        </div>
        <div className="stat-card absent">
          <MdCancel />
          <div><h3>{absentCount}</h3><p>Absent Today</p></div>
        </div>
        <div className="stat-card total">
          <div><h3>{staff.length}</h3><p>Total Staff</p></div>
        </div>
      </div>

      <div className="attendance-grid">
        {staff.map(employee => {
          const record = attendance.find(a => a.staff_id === employee.id);
          return (
            <AttendanceCard
              key={employee.id}
              employee={employee}
              attendanceRecord={record}
              onMarkAttendance={(status, checkIn, checkOut) =>
                markAttendance(employee.id, status, checkIn, checkOut)
              }
              onDelete={() => deleteStaff(employee.id)}
            />
          );
        })}
      </div>

      {showAddStaffForm && (
        <StaffForm onSubmit={addStaff} onClose={() => setShowAddStaffForm(false)} />
      )}
    </div>
  );
}

function AttendanceCard({ employee, attendanceRecord, onMarkAttendance, onDelete }) {
  const [showTimeForm, setShowTimeForm] = useState(false);
  const [checkIn, setCheckIn] = useState(attendanceRecord?.check_in || '');
  const [checkOut, setCheckOut] = useState(attendanceRecord?.check_out || '');

  const calcHours = (ci, co) => {
    if (!ci || !co) return 0;
    const [ih, im] = ci.split(':').map(Number);
    const [oh, om] = co.split(':').map(Number);
    return (((oh * 60 + om) - (ih * 60 + im)) / 60).toFixed(2);
  };

  const handleMarkPresent = () => {
    if (!checkIn) { setShowTimeForm(true); return; }
    onMarkAttendance('present', checkIn, checkOut);
  };

  return (
    <div className="attendance-card">
      <div className="card-header">
        <div>
          <h3>{employee.name}</h3>
          <span className="role">{employee.role}</span>
        </div>
        <span className={`status-badge ${attendanceRecord?.status || 'absent'}`}>
          {attendanceRecord?.status || 'absent'}
        </span>
      </div>

      <div className="card-section">
        <h4>📞 Contact</h4>
        <div className="info-row"><span>Mobile:</span><strong>{employee.mobile || '—'}</strong></div>
      </div>

      {attendanceRecord && (
        <div className="card-section">
          <h4>⏰ Time</h4>
          <div className="info-row"><span>Check In:</span><strong>{attendanceRecord.check_in || '—'}</strong></div>
          <div className="info-row"><span>Check Out:</span><strong>{attendanceRecord.check_out || 'Not yet'}</strong></div>
          <div className="info-row"><span>Work Hours:</span><strong>{calcHours(attendanceRecord.check_in, attendanceRecord.check_out)}h</strong></div>
        </div>
      )}

      <div className="card-actions">
        <button className="present-btn" onClick={handleMarkPresent} disabled={attendanceRecord?.status === 'present'}>
          <MdCheckCircle /> Mark Present
        </button>
        <button className="absent-btn" onClick={() => onMarkAttendance('absent')} disabled={attendanceRecord?.status === 'absent'}>
          <MdCancel /> Mark Absent
        </button>
        <button className="absent-btn" onClick={onDelete} style={{ background: '#fee2e2', color: '#dc2626', border: 'none' }}>
          Remove
        </button>
      </div>

      {showTimeForm && (
        <div className="time-form">
          <h4>Set Time</h4>
          <div className="time-inputs">
            <input type="time" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
            <input type="time" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
          </div>
          <div className="time-actions">
            <button onClick={() => setShowTimeForm(false)}>Cancel</button>
            <button onClick={() => { onMarkAttendance('present', checkIn, checkOut); setShowTimeForm(false); }}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

function StaffForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({ name: '', role: 'Technician', mobile: '' });

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h3>Add Staff Member</h3>
          <button className="close-btn" onClick={onClose}><MdClose /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className="staff-form">
          <div className="form-grid">
            <input type="text" placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option>Technician</option>
              <option>Manager</option>
              <option>Support</option>
              <option>Sales</option>
            </select>
            <input type="tel" placeholder="Mobile" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Add Staff</button>
          </div>
        </form>
      </div>
    </div>
  );
}
