import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearAuthError } from '../store/slices/authSlice';
import AuthRail from './common/AuthRail';
import AuthQuote from './common/AuthQuote';

const ROLES = ['CANDIDATE', 'RECRUITER',  'HIRING MANAGER', 'TA_LEAD'];

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
    resumeUrl: '',
    primarySkill: '',
    yearsExperience: '',
    photoUrl: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  const isCandidate = formData.role === 'CANDIDATE';

  const validate = (name, value) => {
    switch (name) {
      case 'fullName':
        return value.trim() ? '' : 'Enter your full name.';
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
    if (['fullName', 'email', 'username', 'password'].includes(name)) {
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

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      username: formData.username,
      role: formData.role,
      password: formData.password,
    };

    if (isCandidate) {
      payload.resumeUrl = formData.resumeUrl.trim() || null;
      payload.primarySkill = formData.primarySkill.trim() || null;
      payload.yearsExperience =
        formData.yearsExperience === '' ? null : Number(formData.yearsExperience);
      payload.photoUrl = formData.photoUrl.trim() || null;
    }

    const result = await dispatch(register(payload));
    if (register.fulfilled.match(result)) {
      setSuccessMessage('Account created. Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <h1 className="auth-brand-headline">Join the pipeline.</h1>
          <p className="auth-brand-sub">
            One account, scoped to your role — apply to roles, manage
            postings, or move candidates forward.
          </p>
          <AuthRail activeStage="Applied" />
          <AuthQuote
            quote="Every application deserves to be seen."
            attribution="One account, every stage of the journey"
          />
        </div>
      </div>

      <div className="auth-form-panel">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join HireHigh</p>

          {error && <div className="error-banner">{error}</div>}
          {successMessage && <div className="success-banner">{successMessage}</div>}

          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Madhan R"
            value={formData.fullName}
            onChange={handleChange}
            className={fieldErrors.fullName ? 'input-error' : ''}
          />
          {fieldErrors.fullName && <span className="field-error">{fieldErrors.fullName}</span>}

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="madhanr@example.com"
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
                placeholder="Username"
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
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={fieldErrors.password ? 'input-error' : ''}
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}

          {isCandidate && (
            <>
              <div className="form-divider">
                <span>Candidate details (optional — you can add these later too)</span>
              </div>

              <label htmlFor="photoUrl">Photo link</label>
              <input
                id="photoUrl"
                name="photoUrl"
                type="url"
                placeholder="https://drive.google.com/your-photo"
                value={formData.photoUrl}
                onChange={handleChange}
              />

              <label htmlFor="resumeUrl">Resume link</label>
              <input
                id="resumeUrl"
                name="resumeUrl"
                type="url"
                placeholder="https://drive.google.com/your-resume"
                value={formData.resumeUrl}
                onChange={handleChange}
              />

              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="primarySkill">Primary skill</label>
                  <input
                    id="primarySkill"
                    name="primarySkill"
                    type="text"
                    placeholder="e.g. Java, React"
                    value={formData.primarySkill}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-col">
                  <label htmlFor="yearsExperience">Years of experience</label>
                  <input
                    id="yearsExperience"
                    name="yearsExperience"
                    type="number"
                    min="0"
                    placeholder="e.g. 3"
                    value={formData.yearsExperience}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
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