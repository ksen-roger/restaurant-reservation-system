import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="visual-pattern"></div>
        <div className="visual-orb orb-1"></div>
        <div className="visual-orb orb-2"></div>
        <div className="visual-content">
          <span className="wordmark-light">Tavola</span>
          <p className="visual-quote">"A table, held just for you."</p>
          <ul className="visual-features">
            <li><span className="feature-dot"></span> Real-time table availability</li>
            <li><span className="feature-dot"></span> Instant confirmation</li>
            <li><span className="feature-dot"></span> Manage bookings anywhere</li>
          </ul>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-page">
          <h2>Welcome back</h2>
          <p className="auth-sub">Sign in to manage your reservations</p>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <p>No account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;