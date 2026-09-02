import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchApplications,
  fetchMyApplications,
  updateStage,
  deleteApplication,
  clearMessages,
} from '../../store/slices/applicationSlice';

import SearchFilterBar from '../common/SearchFilterBar';
import EmptyState from '../common/EmptyState';
import StageRail from '../common/StageRail';

// Matches the backend enum exactly (JobApplication.currentStage):
// APPLIED, SCREENING, INTERVIEW, OFFER, HIRED, REJECTED.
// NOTE: this was previously "OFFERED", which does not match the backend
// enum and silently broke the stage filter and stage-edit modal.
const STAGES = [
  'APPLIED',
  'SCREENING',
  'INTERVIEW',
  'OFFER',
  'HIRED',
  'REJECTED',
];

const PAGE_SIZE = 5;

const StageEditModal = ({ application, onClose, onSubmit }) => {
  const [stage, setStage] = useState(application.currentStage);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(application.id, stage);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>Update Application Stage</h2>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="edit-stage">Current Stage</label>

          <select
            id="edit-stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ApplicationList = () => {
  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.auth);

  const {
    items,
    currentPage,
    totalPages,
    loading,
    successMessage,
    warningMessage,
    error,
  } = useSelector((state) => state.applications);

  const [page, setPage] = useState(0);
  const [stageFilter, setStageFilter] = useState('');
  const [candidateFilter, setCandidateFilter] = useState('');
  const [editingApplication, setEditingApplication] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const isCandidate = role === 'CANDIDATE';

  // Per the SRS, GET /api/applications is available to ROLE_RECRUITER,
  // ROLE_TA_LEAD, and ROLE_HIRING_MANAGER — but only RECRUITER/TA_LEAD may
  // change a stage or delete a record.
  const canEditStage = role === 'RECRUITER' || role === 'TA_LEAD';

  useEffect(() => {
    if (isCandidate) {
      dispatch(fetchMyApplications());
    } else {
      // Default to the pipeline view for RECRUITER, TA_LEAD,
      // HIRING_MANAGER, or any role not explicitly CANDIDATE — the
      // backend enforces the real authorization boundary.
      dispatch(
        fetchApplications({
          page,
          size: PAGE_SIZE,
          stage: stageFilter || undefined,
        })
      );
    }
  }, [dispatch, isCandidate, page, stageFilter]);

  useEffect(() => {
    if (successMessage || warningMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, warningMessage, error, dispatch]);

  const filteredItems = items.filter((app) => {
    if (!candidateFilter) {
      return true;
    }

    const q = candidateFilter.toLowerCase();

    return app.candidate?.user?.fullName?.toLowerCase().includes(q);
  });

  const handleStageFilterChange = (e) => {
    setStageFilter(e.target.value);
    setPage(0);
  };

  const handleStageSave = (id, stage) => {
    dispatch(updateStage({ id, stage }));
    setEditingApplication(null);
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteId != null) {
      dispatch(deleteApplication(confirmDeleteId));
      setConfirmDeleteId(null);
    }
  };
console.log('DEBUG ApplicationList banners:', { successMessage, warningMessage, error });
  return (
    <div className="page-container">
      {successMessage && (
        <div
          className="success-banner"
          role="status"
          data-testid="success-alert"
        >
          {successMessage}
        </div>
      )}

      {warningMessage && (
        <div
          className="warning-banner"
          role="alert"
          data-testid="warning-alert"
        >
          {warningMessage}
        </div>
      )}

      {error && (
        <div className="error-banner" role="alert" data-testid="error-alert">
          {error}
        </div>
      )}

      <div className="page-header">
        <h1>Application Pipeline</h1>
      </div>

      <div className="pipeline-filters">
        <SearchFilterBar
          placeholder="Filter by candidate"
          onSearch={setCandidateFilter}
          autoFocus
        />

        <select
          className="stage-select"
          value={stageFilter}
          onChange={handleStageFilterChange}
          aria-label="Filter by stage"
        >
          <option value="">All Stages</option>

          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading applications...</p>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No applications found"
          message="There are no applications matching this view."
        />
      ) : (
        <div className="row-list">
          <div
            className={`row-list-head applications-grid${
              canEditStage ? '' : ' no-actions'
            }`}
          >
            <span>Candidate</span>
            <span>Job Title</span>
            <span>Stage</span>
            <span>Applied</span>

            {canEditStage && <span></span>}
          </div>

          {filteredItems.map((app) => (
            <div
              className={`row-list-row applications-grid${
                canEditStage ? '' : ' no-actions'
              }`}
              key={app.id}
            >
              <span className="cell-title">
                {app.candidate?.user?.fullName || '—'}
              </span>

              <span className="cell-muted">{app.job?.title || '—'}</span>

              <StageRail stage={app.currentStage} />

              <span className="cell-mono">
                {app.appliedAt
                  ? new Date(app.appliedAt).toLocaleDateString()
                  : '—'}
              </span>

              {canEditStage && (
                <div className="cell-actions">
                  <button
                    className="btn btn-link"
                    onClick={() => setEditingApplication(app)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => setConfirmDeleteId(app.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            disabled={currentPage <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Previous
          </button>

          <span>
            Page {currentPage + 1} of {totalPages}
          </span>

          <button
            className="btn btn-secondary"
            disabled={currentPage >= totalPages - 1}
            onClick={() =>
              setPage((p) => Math.min(totalPages - 1, p + 1))
            }
          >
            Next
          </button>
        </div>
      )}

      {editingApplication && (
        <StageEditModal
          application={editingApplication}
          onClose={() => setEditingApplication(null)}
          onSubmit={handleStageSave}
        />
      )}

      {confirmDeleteId != null && (
        <div
          className="modal-overlay"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this application?</h3>

            <p>This action cannot be undone.</p>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>

              <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationList;