import React, { useState } from 'react';
import api from '../../services/api';

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.9 5.1A11 11 0 0 1 12 5c7 0 11 7 11 7a13.2 13.2 0 0 1-3.1 3.9M6.6 6.6C4 8.3 2 12 2 12s4 7 11 7a10.6 10.6 0 0 0 3.4-.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChangePasswordModal(props) {
  var onClose = props.onClose;

  var formState = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  var formData = formState[0];
  var setFormData = formState[1];

  var showState = useState({ old: false, next: false, confirm: false });
  var show = showState[0];
  var setShow = showState[1];

  var submittingState = useState(false);
  var submitting = submittingState[0];
  var setSubmitting = submittingState[1];

  var errorState = useState(null);
  var error = errorState[0];
  var setError = errorState[1];

  var successState = useState(false);
  var success = successState[0];
  var setSuccess = successState[1];

  function handleChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    setFormData(function (prev) {
      var next = Object.assign({}, prev);
      next[name] = value;
      return next;
    });
  }

  function toggleShow(field) {
    setShow(function (prev) {
      var next = Object.assign({}, prev);
      next[field] = !prev[field];
      return next;
    });
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSubmitting(true);

    api
      .put('/auth/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      })
      .then(function () {
        setSuccess(true);
        setTimeout(function () {
          onClose();
        }, 1200);
      })
      .catch(function (err) {
        var message =
          (err && err.response && err.response.data && err.response.data.message) ||
          'Could not change your password. Please check your current password and try again.';
        setError(message);
      })
      .finally(function () {
        setSubmitting(false);
      });
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>Change password</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">x</button>
        </div>

        {success ? (
          <div className="success-banner">Password updated successfully.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="error-banner">{error}</div>}

            <label htmlFor="oldPassword">Current password</label>
            <div className="password-input-wrap">
              <input
                id="oldPassword"
                name="oldPassword"
                type={show.old ? 'text' : 'password'}
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={function () { toggleShow('old'); }}
                aria-label={show.old ? 'Hide password' : 'Show password'}
              >
                {show.old ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <label htmlFor="newPassword">New password</label>
            <div className="password-input-wrap">
              <input
                id="newPassword"
                name="newPassword"
                type={show.next ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={function () { toggleShow('next'); }}
                aria-label={show.next ? 'Hide password' : 'Show password'}
              >
                {show.next ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <label htmlFor="confirmPassword">Confirm new password</label>
            <div className="password-input-wrap">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={show.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={function () { toggleShow('confirm'); }}
                aria-label={show.confirm ? 'Hide password' : 'Show password'}
              >
                {show.confirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ChangePasswordModal;