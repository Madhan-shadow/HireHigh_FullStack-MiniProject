import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../store/slices/authSlice';
import StageRail from '../common/StageRail';
import './Auth.css';

const ROLES = [
  { value: 'CANDIDATE', label: 'Candidate' },
  { value: 'RECRUITER', label: 'Recruiter' },
  { value: 'HIRING_MANAGER', label: 'Hiring Manager' },
  { value: 'TA_LEAD', label: 'TA Lead' },
];

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    role: 'CANDIDATE',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (!result.error) navigate('/login');
  };

  return (
    <div className="auth-shell">
      <aside className="auth-brand">
        <div className="auth-brand-inner">
          <span className="auth-brand-mark" aria-hidden="true" />
          <h1 className="auth-brand-title">HireHigh</h1>
          <p className="auth-brand-tag">Join the pipeline. Every seat filled is a name, not a percentage.</p>
          <div className="auth-brand-rail">
            <StageRail stage="APPLIED" size="sm" />
          </div>
        </div>
      </aside>

      <main className="auth-panel">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h2 className="auth-title">Create account</h2>
          <p className="auth-subtitle">Join HireHigh Talent Acquisition.</p>

          {error && <div className="error-banner">{error}</div>}

          <div className="field">
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" name="fullName" type="text" placeholder="John Doe" value={formData.fullName} onChange={handleChange} />
          </div>

          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
          </div>

          <div className="auth-row">
            <div className="field">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" type="text" placeholder="Username" value={formData.username} onChange={handleChange} />
            </div>

            <div className="field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange}>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Register;