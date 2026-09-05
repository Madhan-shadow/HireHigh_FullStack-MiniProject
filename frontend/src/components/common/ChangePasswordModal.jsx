import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, clearPasswordStatus } from '../../store/slices/authSlice';

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M3 3l18 18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M10.6 5.2A10.9 10.9 0 0 1 12 5c7 0 10.5 7 10.5 7a13.4 13.4 0 0 1-2.9 3.9M6.6 6.6C3.3 8.6 1.5 12 1.5 12S5 19 12 19a10.6 10.6 0 0 0 3.9-.75"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.9 10a3.2 3.2 0 0 0 4.24 4.24"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Small wrapper that renders a password <input> with a toggle button to
// reveal/hide its value, matching the eye-icon pattern most sites use.
const PasswordField = ({ id, value, onChange, required }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-input-wrap">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required={required}
      />
      <button
        type="button"
        className="password-toggle-btn"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
};

const ChangePasswordModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { passwordLoading, passwordError, passwordSuccess } = useSelector((state) => state.auth);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    return () => dispatch(clearPasswordStatus());
  }, [dispatch]);

  useEffect(() => {
    if (passwordSuccess) {
      const timer = setTimeout(onClose, 1500);
      return () => clearTimeout(timer);
    }
  }, [passwordSuccess, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    if (newPassword.length < 8) {
      setLocalError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError('New passwords do not match.');
      return;
    }

    dispatch(changePassword({ oldPassword, newPassword }));
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>Change password</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {passwordSuccess && <div className="success-banner">{passwordSuccess}</div>}
        {(passwordError || localError) && (
          <div className="error-banner">{passwordError || localError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="oldPassword">Current password</label>
          <PasswordField
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <label htmlFor="newPassword">New password</label>
          <PasswordField
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Confirm new password</label>
          <PasswordField
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
              {passwordLoading ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;