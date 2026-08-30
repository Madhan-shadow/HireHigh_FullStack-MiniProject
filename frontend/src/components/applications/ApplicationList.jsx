import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchApplications,
  updateStage,
  deleteApplication,
  clearMessages,
} from '../../store/slices/applicationSlice';
import SearchFilterBar from '../common/SearchFilterBar';
import EmptyState from '../common/EmptyState';

const STAGES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];
const PAGE_SIZE = 5;

const StageEditModal = ({ application, onClose, onSubmit }) => {
  const [stage, setStage] = useState(application.currentStage);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
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
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="edit-stage">Current Stage</label>
          <select id="edit-stage" value={stage} onChange={(e) => setStage(e.target.value)}>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
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

  const canEditStage = role === 'RECRUITER' || role === 'TA_LEAD';

  useEffect(() => {
    dispatch(fetchApplications({ page, size: PAGE_SIZE, stage: stageFilter || undefined }));
  }, [dispatch, page, stageFilter]);

  useEffect(() => {
    if (successMessage || warningMessage || error) {
      const timer = setTimeout(() => dispatch(clearMessages()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, warningMessage, error, dispatch]);

  const filteredItems = items.filter((app) => {
    if (!candidateFilter) return true;
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

  return (
    <div className="page-container">
      {successMessage && <div className="success-banner">{successMessage}</div>}
      {warningMessage && <div className="warning-banner">{warningMessage}</div>}
      {error && <div className="error-banner">{error}</div>}

      <div className="page-header">
        <h1>Application Pipeline</h1>
      </div>

      <div className="pipeline-filters">
        <SearchFilterBar
          placeholder="Filter by candidate"
          onSearch={setCandidateFilter}
          autoFocus
        />
        <select value={stageFilter} onChange={handleStageFilterChange} aria-label="Filter by stage">
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
        <table className="data-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Job Title</th>
              <th>Current Stage</th>
              <th>Applied At</th>
              {canEditStage && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((app) => (
              <tr key={app.id}>
                <td>{app.candidate?.user?.fullName || '—'}</td>
                <td>{app.job?.title || '—'}</td>
                <td>
                  <span className={`stage-badge stage-${(app.currentStage || '').toLowerCase()}`}>
                    {app.currentStage}
                  </span>
                </td>
                <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleString() : '—'}</td>
                {canEditStage && (
                  <td>
                    <button className="btn btn-link" onClick={() => setEditingApplication(app)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => setConfirmDeleteId(app.id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
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
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
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
        <div className="modal-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this application?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setConfirmDeleteId(null)}>
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