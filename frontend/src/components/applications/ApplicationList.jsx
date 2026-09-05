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
import ApplicationProgress from '../common/ApplicationProgress';
import CandidateProfileModal from '../common/CandidateProfileModal';

const STAGES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];
const PAGE_SIZE = 5;

const StageEditModal = (props) => {
  const application = props.application;
  const onClose = props.onClose;
  const onSubmit = props.onSubmit;
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
          <h2>Update application stage</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">x</button>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="edit-stage">Current stage</label>
          <select id="edit-stage" value={stage} onChange={(e) => setStage(e.target.value)}>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CandidateAvatar = (props) => {
  const candidate = props.candidate || {};
  const user = candidate.user || {};
  const name = user.fullName || '?';
  const initial = name.charAt(0).toUpperCase();
  const photoUrl = candidate.photoUrl;

  return (
    <span className="row-avatar">
      {photoUrl ? <img src={photoUrl} alt="" /> : initial}
    </span>
  );
};

const ApplicationList = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const role = auth.role;

  const appsState = useSelector((state) => state.applications);
  const items = appsState.items;
  const currentPage = appsState.currentPage;
  const totalPages = appsState.totalPages;
  const loading = appsState.loading;
  const successMessage = appsState.successMessage;
  const warningMessage = appsState.warningMessage;
  const error = appsState.error;

  const [page, setPage] = useState(0);
  const [stageFilter, setStageFilter] = useState('');
  const [candidateFilter, setCandidateFilter] = useState('');
  const [editingApplication, setEditingApplication] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [viewingApplication, setViewingApplication] = useState(null);

  const isCandidate = role === 'CANDIDATE';
  const canEditStage = role === 'RECRUITER' || role === 'TA_LEAD';

  useEffect(() => {
    if (isCandidate) {
      dispatch(fetchMyApplications());
    } else {
      dispatch(fetchApplications({ page: page, size: PAGE_SIZE, stage: stageFilter || undefined }));
    }
  }, [dispatch, isCandidate, page, stageFilter]);

  useEffect(() => {
    if (successMessage || warningMessage || error) {
      const timer = setTimeout(() => dispatch(clearMessages()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, warningMessage, error, dispatch]);

  const filteredItems = items.filter((app) => {
    const fullName = app.candidate && app.candidate.user ? app.candidate.user.fullName : null;
    const matchesCandidate =
      !candidateFilter ||
      (fullName && fullName.toLowerCase().indexOf(candidateFilter.toLowerCase()) !== -1);
    const matchesStage = !stageFilter || app.currentStage === stageFilter;
    return matchesCandidate && matchesStage;
  });

  const handleStageFilterChange = (e) => {
    setStageFilter(e.target.value);
    setPage(0);
  };

  const handleStageSave = (id, stage) => {
    dispatch(updateStage({ id: id, stage: stage }));
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
      {successMessage && (
        <div className="success-banner" role="status" data-testid="success-alert">
          {successMessage}
        </div>
      )}
      {warningMessage && (
        <div className="warning-banner" role="alert" data-testid="warning-alert">
          {warningMessage}
        </div>
      )}
      {error && (
        <div className="error-banner" role="alert" data-testid="error-alert">
          {error}
        </div>
      )}

      <div className="page-header">
        <h1>Application pipeline</h1>
      </div>

      <div className="pipeline-filters">
        <SearchFilterBar placeholder="Filter by candidate" onSearch={setCandidateFilter} autoFocus />
        <select
          className="stage-select"
          value={stageFilter}
          onChange={handleStageFilterChange}
          aria-label="Filter by stage"
        >
          <option value="">All stages</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading applications...</p>
      ) : filteredItems.length === 0 ? (
        <EmptyState title="No applications found" message="There are no applications matching this view." />
      ) : (
        <div className="row-list">
          <div className={'row-list-head applications-grid' + (canEditStage ? '' : ' no-actions')}>
            <span>Candidate</span>
            <span>Job title</span>
            <span>Progress</span>
            <span>Applied</span>
            {canEditStage && <span></span>}
          </div>

          {filteredItems.map((app) => {
            const candidate = app.candidate || {};
            const user = candidate.user || {};
            const jobTitle = app.job ? app.job.title : null;
            const appliedDate = app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '-';
            const resumeUrl = candidate.resumeUrl;

            return (
              <div className={'row-list-row applications-grid' + (canEditStage ? '' : ' no-actions')} key={app.id}>
                <span className="cell-title cell-candidate">
                  <CandidateAvatar candidate={candidate} />
                  {user.fullName || '-'}
                </span>
                <span className="cell-muted">{jobTitle || '-'}</span>
                <ApplicationProgress stage={app.currentStage} />
                <span className="cell-mono">{appliedDate}</span>
                {canEditStage && (
                  <div className="cell-actions">
                    <button className="btn btn-link" onClick={() => setViewingApplication(app)}>View</button>
                    {resumeUrl ? (
                      <a className="btn btn-link" href={resumeUrl} target="_blank" rel="noopener noreferrer">
                        Resume
                      </a>
                    ) : null}
                    <button className="btn btn-link" onClick={() => setEditingApplication(app)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => setConfirmDeleteId(app.id)}>Delete</button>
                  </div>
                )}
              </div>
            );
          })}
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
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button
            className="btn btn-secondary"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            Next
          </button>
        </div>
      )}

      {viewingApplication && (
        <CandidateProfileModal
          application={viewingApplication}
          onClose={() => setViewingApplication(null)}
        />
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
              <button className="btn btn-secondary" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationList;