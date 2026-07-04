import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [newTable, setNewTable] = useState({ tableNumber: '', capacity: '' });

  const loadReservations = async () => {
    const { data } = await api.get('/reservations', { params: dateFilter ? { date: dateFilter } : {} });
    setReservations(data);
  };

  const loadTables = async () => {
    const { data } = await api.get('/tables');
    setTables(data);
  };

  useEffect(() => {
    loadReservations();
    loadTables();
  }, [dateFilter]);

  const handleStatusChange = async (id, status) => {
    await api.put(`/reservations/${id}`, { status });
    loadReservations();
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    await api.post('/tables', { tableNumber: Number(newTable.tableNumber), capacity: Number(newTable.capacity) });
    setNewTable({ tableNumber: '', capacity: '' });
    loadTables();
  };

  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const confirmedCount = reservations.filter((r) => r.status === 'confirmed').length;

  return (
    <div className="app-shell">
      <nav className="navbar">
       <span className="nav-brand">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: '-4px', marginRight: '6px' }}>
    <path d="M12 2v20M8 2v7a2 2 0 002 2h4a2 2 0 002-2V2M8 2v7" />
  </svg>
  Tavola <span className="nav-badge">Admin</span>
</span> 
        <div className="nav-user">
          <div className="nav-id">
            <span className="nav-name">{user.name}</span>
            <span className="nav-role">Administrator</span>
          </div>
          <div className="avatar admin-avatar">{initials}</div>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard admin">
       <div className="stats-row">
  <div className="stat-tile"><span className="stat-icon">📋</span><span className="stat-value">{reservations.length}</span><span className="stat-label">Total Reservations</span></div>
  <div className="stat-tile"><span className="stat-icon">✓</span><span className="stat-value">{confirmedCount}</span><span className="stat-label">Confirmed</span></div>
  <div className="stat-tile"><span className="stat-icon">🪑</span><span className="stat-value">{tables.length}</span><span className="stat-label">Tables</span></div>
</div> 
        <section>
          <h3>All Reservations</h3>
          <label>
            Filter by date:
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
            {dateFilter && <button onClick={() => setDateFilter('')}>Clear</button>}
          </label>

          <table>
            <thead>
              <tr><th>Customer</th><th>Table</th><th>Date</th><th>Slot</th><th>Guests</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r._id}>
                  <td>{r.user?.name}<br /><span className="td-sub">{r.user?.email}</span></td>
                  <td>Table {r.table?.tableNumber}</td>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>{r.timeSlot}</td>
                  <td>{r.guests}</td>
                  <td><em style={{ background: r.status === 'confirmed' ? 'var(--success-soft)' : 'var(--danger-soft)', color: r.status === 'confirmed' ? 'var(--success)' : 'var(--danger)' }}>{r.status}</em></td>
                  <td>{r.status === 'confirmed' ? <button onClick={() => handleStatusChange(r._id, 'cancelled')}>Cancel</button> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h3>Manage Tables</h3>
          <form onSubmit={handleAddTable}>
            <input type="number" placeholder="Table number" value={newTable.tableNumber} onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })} required />
            <input type="number" placeholder="Capacity" value={newTable.capacity} onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })} required />
            <button type="submit">Add Table</button>
          </form>
          <ul>{tables.map((t) => <li key={t._id}>Table {t.tableNumber} — seats {t.capacity}</li>)}</ul>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;