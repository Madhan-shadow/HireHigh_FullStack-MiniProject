import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchApplications,
  updateApplicationStage,
  deleteApplication,
  clearMessages,
} from '../../store/slices/applicationSlice';
import ConfirmModal from '../common/ConfirmModal';
import EmptyState from '../common/EmptyState';

const STAGES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];

const ApplicationList = () => {
  const dispatch = useDispatch();
  const {
    items,
    currentPage,
    totalPages,
    size,
    loading,
    successMessage,
    warningMessage,
    error,
  } = useSelector((state) => state.applications);
  const { role } = useSelector((state) => state.auth);

  const [candidateFilter, setCandidateFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    dispatch(fetchApplications({ page: 0, size, stage: stageFilter || undefined }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageFilter]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(fetchApplications({ page: 0, size, stage: stageFilter || undefined }));
    }, 300);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateFilter]);

  useEffect(() => {
    if (successMessage || warningMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, warningMessage, error, dispatch]);

  const handlePageChange = (newPage) => {
    dispatch(fetchApplications({ page: newPage, size, stage: stageFilter || undefined }));
  };

  const handleStageChange = (id, newStage) => {
    dispatch(updateApplicationStage({ id, stage: newStage }));
  };

  const handleDeleteRequest = (id) => setConfirmDeleteId(id);

  const handleConfirmDelete = () => {
    if (confirmDeleteId != null) {
      dispatch(deleteApplication(confirmDeleteId));
      setConfirmDeleteId(null);
    }
  };

  const canManage = role === 'RECRUITER' || role === 'TA_LEAD' || role === 'HIRING_MANAGER';

  const filteredItems = items.filter((app) =>
    (app.candidateName || app.candidate?.user?.fullName || '')
      .toLowerCase()
      .includes(candidateFilter.toLowerCase())
  );

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
        <h1>Application Pipeline</h1>
      </div>

      {canManage && (
        <div className="search-filter-bar">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Filter by candidate"
            value={candidateFilter}
            onChange={(e) => setCandidateFilter(e.target.value)}
          />
          <select
            className="stage-select"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="">All Stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <p>Loading applications...</p>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No applications yet"
          message="Applications will appear here once candidates apply."
        />
      ) : (
        <div className="row-list">
          <div className="row-list-head applications-grid">
            <span>Candidate</span>
            <span>Job</span>
            <span>Stage</span>
            <span></span>
          </div>
          {filteredItems.map((app) => (
            <div className="row-list-row applications-grid" key={app.id}>
              <span className="cell-title">
                {app.candidateName || app.candidate?.user?.fullName}
              </span>
              <span className="cell-muted">{app.jobTitle || app.job?.title}</span>
              <select
                className="stage-select"
                value={app.currentStage}
                onChange={(e) => handleStageChange(app.id, e.target.value)}
                disabled={!canManage}
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {canManage && (
                <button className="btn btn-danger" onClick={() => handleDeleteRequest(app.id)}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 0} onClick={() => handlePageChange(currentPage - 1)}>
            Prev
          </button>
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      {confirmDeleteId != null && (
        <ConfirmModal
          title="Delete this application?"
          message="This will permanently remove the application record."
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default ApplicationList;