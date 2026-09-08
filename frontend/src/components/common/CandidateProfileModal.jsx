import React from 'react';
import { openBase64Pdf } from '../../utils/openBase64Pdf';

function CandidateProfileModal(props) {
  var application = props.application || {};
  var onClose = props.onClose;

  var candidate = application.candidate || {};
  var user = candidate.user || {};
  var initial = (user.fullName || '?').charAt(0).toUpperCase();

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>Applicant profile</h2>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            x
          </button>
        </div>

        <div className="candidate-profile-view">
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt="Candidate"
              className="candidate-profile-photo"
            />
          ) : (
            <span className="candidate-profile-photo candidate-profile-photo--placeholder">
              {initial}
            </span>
          )}

          <div className="candidate-profile-field">
            <span className="candidate-profile-label">
              Full name
            </span>
            <span className="candidate-profile-value">
              {user.fullName || '-'}
            </span>
          </div>

          <div className="candidate-profile-field">
            <span className="candidate-profile-label">
              Email
            </span>
            <span className="candidate-profile-value">
              {user.email || '-'}
            </span>
          </div>

          <div className="candidate-profile-field">
            <span className="candidate-profile-label">
              Primary skill
            </span>
            <span className="candidate-profile-value">
              {candidate.primarySkill || '-'}
            </span>
          </div>

          <div className="candidate-profile-field">
            <span className="candidate-profile-label">
              Years of experience
            </span>
            <span className="candidate-profile-value">
              {candidate.yearsExperience != null
                ? candidate.yearsExperience
                : '-'}
            </span>
          </div>

          <div className="candidate-profile-field">
            <span className="candidate-profile-label">
              Resume
            </span>

            {candidate.resumeUrl ? (
              <div className="resume-card resume-card--compact">
                <div className="resume-card-icon">
                  PDF
                </div>

                <div className="resume-card-info">
                  <span className="resume-card-name">
                    {candidate.resumeFileName || 'Resume.pdf'}
                  </span>

                  <button
                    type="button"
                    className="btn-link-inline"
                    onClick={function () {
                      openBase64Pdf(candidate.resumeUrl);
                    }}
                  >
                    View file
                  </button>
                </div>
              </div>
            ) : (
              <span className="candidate-profile-value">
                -
              </span>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateProfileModal;