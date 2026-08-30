import React from 'react';
import './EmptyState.css';

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state-mark" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="var(--hh-teal-200)" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="20" cy="20" r="4" fill="var(--hh-amber-500)" />
        </svg>
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {actionLabel && onAction && (
        <button className="btn btn-accent" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  );
}