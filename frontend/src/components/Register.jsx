import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearAuthError } from '../store/slices/authSlice';

const ROLES = ['CANDIDATE', 'RECRUITER', 'TA_LEAD', 'HIRING_MANAGER'];

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const validate = (name, value) => {
    switch (name) {
      case 'fullName':
        return value.trim() ? '' : 'Enter your full name.';
      case 'email':
        return /^\S+@\S+\.\S+$/.test(value) ? '' : 'Enter a valid email address.';
      case 'username':
        return value.trim().length >= 3 ? '' : 'Username must be at least 3 characters.';
      case 'password':
        return value.length >= 8 ? '' : 'Password must be at least 8 characters.';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name !== 'role') {
      setFieldErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {
      fullName: validate('fullName', formData.fullName),
      email: validate('email', formData.email),
      username: validate('username', formData.username),
      password: validate('password', formData.password),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      setSubmitted(true);
      setTimeout(() => navigate('/login'), 1200);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <span className="auth-brand-eyebrow">Join HireHigh Talent Acquisition</span>
          <h1 className="auth-brand-headline">Build the pipeline.</h1>
          <p className="auth-brand-sub">
            Whether you're hiring or applying, HireHigh keeps every stage of recruitment in one
            place.
          </p>
        </div>
      </div>

      <div className="auth-form-panel">
        <form className="auth-card" onSubmit={handleSubmit} noValidate data-testid="register-form">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join HireHigh Talent Acquisition</p>

          {error && (
            <div className="error-banner" role="alert" data-testid="register-error-alert">
              {error}
            </div>
          )}

          {submitted && (
            <div className="success-banner" role="status" data-testid="register-success-alert">
              Account created successfully. Redirecting to login…
            </div>
          )}

          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            className={fieldErrors.fullName ? 'input-error' : ''}
            data-testid="register-fullname-input"
          />
          {fieldErrors.fullName && <span className="field-error">{fieldErrors.fullName}</span>}

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            className={fieldErrors.email ? 'input-error' : ''}
            data-testid="register-email-input"
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}

          <div className="auth-form-row">
            <div>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                value={formData.username}
                onChange={handleChange}
                className={fieldErrors.username ? 'input-error' : ''}
                data-testid="register-username-input"
              />
              {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
            </div>

            <div>
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                data-testid="register-role-select"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0) + r.slice(1).toLowerCase().replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={handleChange}
            className={fieldErrors.password ? 'input-error' : ''}
            data-testid="register-password-input"
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            data-testid="register-submit-button"
          >
            {loading ? 'Creating account…' : 'Register'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;