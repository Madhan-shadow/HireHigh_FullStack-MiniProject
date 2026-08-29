import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearAuthError } from '../store/slices/authSlice';

const ROLES = ['CANDIDATE', 'RECRUITER', 'HIRING_MANAGER', 'TA_LEAD'];

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
  const [successMessage, setSuccessMessage] = useState(null);

  const validate = (name, value) => {
    switch (name) {
      case 'fullName':
        return value.trim() ? '' : 'Full name is required.';
      case 'email':
        return /\S+@\S+\.\S+/.test(value) ? '' : 'Enter a valid email address.';
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
    dispatch(clearAuthError());
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
      setSuccessMessage('Account created successfully. Please login.');
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join HireHigh Talent Acquisition</p>

        {error && <div className="error-banner">{error}</div>}
        {successMessage && <div className="success-banner">{successMessage}</div>}

        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          className={fieldErrors.fullName ? 'input-error' : ''}
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
        />
        {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}

        <div className="form-row">
          <div className="form-col">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={fieldErrors.username ? 'input-error' : ''}
            />
            {fieldErrors.username && (
              <span className="field-error">{fieldErrors.username}</span>
            )}
          </div>
          <div className="form-col">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
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
          value={formData.password}
          onChange={handleChange}
          className={fieldErrors.password ? 'input-error' : ''}
        />
        {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;