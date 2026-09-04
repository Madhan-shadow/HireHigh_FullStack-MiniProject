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
import {
  applyToJob,
  applyToJobWithDetails,
  fetchMyApplications,
  clearMessages,
} from '../../store/slices/applicationSlice';
import JobCreateModal from './JobCreateModal';
import ApplyDetailsModal from './ApplyDetailsModal';
import ConfirmModal from '../common/ConfirmModal';
import SearchFilterBar from '../common/SearchFilterBar';
import CapacityBar from '../common/CapacityBar';
import ApplicationProgress from '../common/ApplicationProgress';
import EmptyState from '../common/EmptyState';

const DEPT_COLORS = ['#3B6FA0', '#C1592E', '#6B4F9E', '#1F5E4A', '#B8862F'];

const deptColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return DEPT_COLORS[Math.abs(hash) % DEPT_COLORS.length];
};

const JobList = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectFilteredJobs);
  const { loading, error: jobError } = useSelector((state) => state.jobs);
  const { role } = useSelector((state) => state.auth);
  const {
    successMessage,
    warningMessage,
    error: appError,
    items: myApplications,
  } = useSelector((state) => state.applications);

  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [applySubmitting, setApplySubmitting] = useState(false);

  const isRecruiter = role === 'RECRUITER' || role === 'TA_LEAD';
  const isCandidate = role === 'CANDIDATE';

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    if (isCandidate) {
      dispatch(fetchMyApplications());
    }
  }, [dispatch, isCandidate]);

  useEffect(() => {
    if (successMessage || warningMessage || appError) {
      const timer = setTimeout(() => dispatch(clearMessages()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, warningMessage, appError, dispatch]);

  // Map of jobId -> currentStage for jobs this candidate has already applied to.
  const appliedStageByJobId = {};
  if (isCandidate && Array.isArray(myApplications)) {
    myApplications.forEach((app) => {
      const jobId = app.job?.id;
      if (jobId != null) {
        appliedStageByJobId[jobId] = app.currentStage;
      }
    });
  }

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

  const handleOpenApply = (job) => {
    setApplyingJob(job);
  };

  const handleApplySubmit = async (profile) => {
    if (!applyingJob) return;
    setApplySubmitting(true);
    await dispatch(applyToJobWithDetails({ jobId: applyingJob.id, profile }));
    setApplySubmitting(false);
    setApplyingJob(null);
  };

  const handleApplySkip = async () => {
    if (!applyingJob) return;
    setApplySubmitting(true);
    await dispatch(applyToJob(applyingJob.id));
    setApplySubmitting(false);
    setApplyingJob(null);
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
        onSearch={(v) => dispatch(setSearchQuery(v))}
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
          {jobs.map((job) => {
            const appliedStage = appliedStageByJobId[job.id];

            return (
              <div className="row-list-row jobs-grid" key={job.id}>
                <span className="cell-title">{job.title}</span>
                <span className="cell-muted dept-tag">
                  <span
                    className="dept-dot"
                    style={{ background: deptColor(job.department) }}
                  />
                  {job.department}
                </span>
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
                    appliedStage ? (
                      <ApplicationProgress stage={appliedStage} />
                    ) : (
                      <button
                        className="btn btn-success"
                        data-testid={`apply-button-${job.id}`}
                        onClick={() => handleOpenApply(job)}
                      >
                        Apply Now
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <JobCreateModal
          job={editingJob}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}

      {applyingJob && (
        <ApplyDetailsModal
          jobTitle={applyingJob.title}
          onClose={() => setApplyingJob(null)}
          onSubmit={handleApplySubmit}
          onSkip={handleApplySkip}
          submitting={applySubmitting}
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