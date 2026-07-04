import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TIME_SLOTS = ['12:00-13:30', '13:30-15:00', '19:00-20:30', '20:30-22:00'];

const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" />
  </svg>
);
const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
  </svg>
);
const UsersIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="8" r="3" /><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6M16 8a3 3 0 100-6M17 14c2.8.4 5 2.5 5 6" />
  </svg>
);

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState({ tableId: '', date: '', timeSlot: '', guests: 1 });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    const [tablesRes, reservationsRes] = await Promise.all([
      api.get('/tables'),
      api.get('/reservations/my'),
    ]);
    setTables(tablesRes.data);
    setReservations(reservationsRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/reservations', form);
      setMessage('Reservation created successfully');
      setForm({ tableId: '', date: '', timeSlot: '', guests: 1 });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this reservation?')) return;
    await api.delete(`/reservations/${id}`);
    loadData();
  };

  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const upcomingCount = reservations.filter((r) => r.status === 'confirmed').length;
  const cancelledCount = reservations.filter((r) => r.status === 'cancelled').length;

  return (
    <div className="app-shell">
      <nav className="navbar">
        <span className="nav-brand">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: '-4px', marginRight: '6px' }}>
    <path d="M12 2v20M8 2v7a2 2 0 002 2h4a2 2 0 002-2V2M8 2v7" />
  </svg>
  Tavola
</span>
        <div className="nav-user">
          <div className="nav-id">
            <span className="nav-name">{user.name}</span>
            <span className="nav-role">Customer</span>
          </div>
          <div className="avatar">{initials}</div>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard">
       <div className="stats-row">
  <div className="stat-tile">
    <span className="stat-icon">📅</span>
    <span className="stat-value">{upcomingCount}</span>
    <span className="stat-label">Upcoming</span>
  </div>
  <div className="stat-tile">
    <span className="stat-icon">🪑</span>
    <span className="stat-value">{tables.length}</span>
    <span className="stat-label">Tables Available</span>
  </div>
  <div className="stat-tile">
    <span className="stat-icon">✕</span>
    <span className="stat-value">{cancelledCount}</span>
    <span className="stat-label">Cancelled</span>
  </div>
</div> 

        <div className="dashboard-grid">
          <aside className="booking-card">
            <h3>New Reservation</h3>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="stacked-form">
              <select name="tableId" value={form.tableId} onChange={handleChange} required>
                <option value="">Select a table</option>
                {tables.map((t) => (
                  <option key={t._id} value={t._id}>Table {t.tableNumber} (seats {t.capacity})</option>
                ))}
              </select>
              <input type="date" name="date" value={form.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
              <select name="timeSlot" value={form.timeSlot} onChange={handleChange} required>
                <option value="">Select time slot</option>
                {TIME_SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
              </select>
              <input type="number" name="guests" min={1} value={form.guests} onChange={handleChange} required />
              <button type="submit">Book Table</button>
            </form>
          </aside>

          <main className="reservations-panel">
            <h3>My Reservations</h3>
            {reservations.length === 0 && <p className="empty-note">No reservations yet.</p>}
            <ul className="reservation-list">
              {reservations.map((r) => (
                <li key={r._id} className={r.status}>
                  <div className="res-main">
                    <strong>Table {r.table.tableNumber}</strong>
                    <div className="res-meta">
                      <span><CalendarIcon /> {new Date(r.date).toLocaleDateString()}</span>
                      <span><ClockIcon /> {r.timeSlot}</span>
                      <span><UsersIcon /> {r.guests} guests</span>
                    </div>
                  </div>
                  <div className="res-actions">
                    <em style={{ background: r.status === 'confirmed' ? 'var(--success-soft)' : 'var(--danger-soft)', color: r.status === 'confirmed' ? 'var(--success)' : 'var(--danger)' }}>{r.status}</em>
                    {r.status === 'confirmed' && <button onClick={() => handleCancel(r._id)}>Cancel</button>}
                  </div>
                </li>
              ))}
            </ul>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;