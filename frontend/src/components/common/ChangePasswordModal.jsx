import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, clearPasswordStatus } from '../../store/slices/authSlice';

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
          <input
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <label htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Confirm new password</label>
          <input
            id="confirmPassword"
            type="password"
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