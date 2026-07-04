import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
          <p className="visual-quote">"Every seat begins with a booking."</p>
          <ul className="visual-features">
            <li><span className="feature-dot"></span> Real-time table availability</li>
            <li><span className="feature-dot"></span> Instant confirmation</li>
            <li><span className="feature-dot"></span> Manage bookings anywhere</li>
          </ul>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-page">
          <h2>Create account</h2>
          <p className="auth-sub">Book tables in seconds</p>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <button type="submit">Register</button>
          </form>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;