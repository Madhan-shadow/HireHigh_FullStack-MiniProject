import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
  setSearchQuery,
  selectFilteredJobs,
} from '../../store/slices/jobSlice';
import { applyToJob, clearMessages } from '../../store/slices/applicationSlice';
import JobCreateModal from './JobCreateModal';
import ConfirmModal from '../common/ConfirmModal';
import SearchFilterBar from '../common/SearchFilterBar';
import CapacityBar from '../common/CapacityBar';
import EmptyState from '../common/EmptyState';

const JobList = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectFilteredJobs);
  const { loading, error: jobError, searchQuery } = useSelector((state) => state.jobs);
  const { role } = useSelector((state) => state.auth);
  const { successMessage, warningMessage, error: appError } = useSelector(
    (state) => state.applications
  );

  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const isRecruiter = role === 'RECRUITER' || role === 'TA_LEAD';
  const isCandidate = role === 'CANDIDATE';

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || warningMessage || appError) {
      const timer = setTimeout(() => dispatch(clearMessages()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, warningMessage, appError, dispatch]);

  const handleOpenCreate = () => {
    setEditingJob(null);
    setShowModal(true);
  };

  const handleOpenEdit = (job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  const handleModalSubmit = (formData) => {
    if (editingJob) {
      dispatch(updateJob({ id: editingJob.id, jobData: formData }));
    } else {
      dispatch(createJob(formData));
    }
    setShowModal(false);
  };

  const handleApply = (jobId) => {
    dispatch(applyToJob(jobId));
  };

  const handleDeleteRequest = (jobId) => {
    setConfirmDeleteId(jobId);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId != null) {
      dispatch(deleteJob(confirmDeleteId));
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
      {(appError || jobError) && (
        <div className="error-banner" role="alert" data-testid="error-alert">
          {appError || jobError}
        </div>
      )}

      <div className="page-header">
        <h1>Open Roles</h1>
        {isRecruiter && (
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            Post New Job
          </button>
        )}
      </div>

      <SearchFilterBar
        placeholder="Search by job title or department"
        value={searchQuery}
        onChange={(v) => dispatch(setSearchQuery(v))}
      />

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No open roles"
          message="There are no job postings matching your search."
        />
      ) : (
        <div className="row-list">
          <div className="row-list-head jobs-grid">
            <span>Job Title</span>
            <span>Department</span>
            <span>Capacity</span>
            <span>Status</span>
            <span></span>
          </div>
          {jobs.map((job) => (
            <div className="row-list-row jobs-grid" key={job.id}>
              <span className="cell-title">{job.title}</span>
              <span className="cell-muted">{job.department}</span>
              <CapacityBar currentFills={job.currentFills} hiringGoal={job.hiringGoal} />
              <span className={`status-chip status-${(job.status || '').toLowerCase()}`}>
                {job.status}
              </span>
              <div className="cell-actions">
                {isRecruiter && (
                  <>
                    <button className="btn btn-link" onClick={() => handleOpenEdit(job)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteRequest(job.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
                {isCandidate && (
                  <button
                    className="btn btn-success"
                    data-testid={`apply-button-${job.id}`}
                    onClick={() => handleApply(job.id)}
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <JobCreateModal
          job={editingJob}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}

      {confirmDeleteId != null && (
        <ConfirmModal
          title="Delete this job posting?"
          message="This will permanently remove the job and its associated applications."
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default JobList;