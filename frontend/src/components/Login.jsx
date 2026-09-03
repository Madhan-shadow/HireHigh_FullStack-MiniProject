import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearAuthError } from '../store/slices/authSlice';
import AuthRail from './common/AuthRail';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/jobs');
    }
  }, [isAuthenticated, navigate]);

  React.useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const validate = (name, value) => {
    if (name === 'username' && !value.trim()) return 'Enter your username.';
    if (name === 'password' && value.length < 1) return 'Enter your password.';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {
      username: validate('username', formData.username),
      password: validate('password', formData.password),
    };
    setFieldErrors(errors);
    if (errors.username || errors.password) return;
    dispatch(login(formData));
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <h1 className="auth-brand-headline">Find who's next.</h1>
          <p className="auth-brand-sub">
            One pipeline for every open role, from the first application to the
            signed offer.
          </p>
          <AuthRail activeStage="Hired" />
        </div>
      </div>

      <div className="auth-form-panel">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Log in to HireHigh</p>

          {error && <div className="error-banner">{error}</div>}

          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={fieldErrors.username ? 'input-error' : ''}
          />
          {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={fieldErrors.password ? 'input-error' : ''}
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>

          <p className="auth-switch">
            Don&apos;t have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;