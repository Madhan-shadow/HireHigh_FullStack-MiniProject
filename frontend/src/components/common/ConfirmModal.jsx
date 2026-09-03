import React from 'react';

const ConfirmModal = ({ title, message, onCancel, onConfirm, confirmLabel = 'Delete' }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;