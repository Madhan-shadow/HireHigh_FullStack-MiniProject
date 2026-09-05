import React from 'react';

const CandidateProfileModal = ({ application, onClose }) => {
  const candidate = application.candidate || {};
  const user = candidate.user || {};
  const initial = (user.fullName || '?').charAt(0).toUpperCase();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>Applicant profile</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="candidate-profile-view">
          {candidate.photoUrl ? (
            <img
              src={candidate.photoUrl}
              alt={`${user.fullName || 'Candidate'}'s photo`}
              className="candidate-profile-photo"
            />
          ) : (
            <span className="candidate-profile-photo candidate-profile-photo--placeholder">
              {initial}
            </span>
          )}

          <div className="candidate-profile-field">
            <span className="candidate-profile-label">Full name</span>
            <span className="candidate-profile-value">{user.fullName || '—'}</span>
          </div>

          <div className="candidate-profile-field">
            <span className="candidate-profile-label">Email</span>
            <span className="candidate-profile-value">{user.email || '—'}</span>
          </div>

          <div className="candidate-profile-field">
            <span className="candidate-profile-label">Primary skill</span>
            <span className="candidate-profile-value">{candidate.primarySkill || '—'}</span>
          </div>

          <div className="candidate-profile-field">
            <span className="candidate-profile-label">Years of experience</span>
            <span className="candidate-profile-value">
              {candidate.yearsExperience != null ? candidate.yearsExperience : '—'}
            </span>
          </div>

          <div className="candidate-profile-field">
            <span className="candidate-profile-label">Resume</span>
            <span className="candidate-profile-value">
              {candidate.resumeUrl ? (
                <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                  {candidate.resumeFileName ? `View ${candidate.resumeFileName}` : 'View resume'}
                </a>
              ) : (
                '—'
              )}
            </span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileModal;