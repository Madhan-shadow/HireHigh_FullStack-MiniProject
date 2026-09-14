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
import EmptyState from '../common/EmptyState';

const guessDomain = (companyName) => {
  if (!companyName) return null;
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)[0] + '.com';
};

const CompanyLogo = ({ company }) => {
  const [failed, setFailed] = useState(false);
  const domain = guessDomain(company);
  const initial = (company || '?').charAt(0).toUpperCase();

  if (!domain || failed) {
    return (
      <span className="company-logo company-logo--fallback">{initial}</span>
    );
  }

  return (
    <img
      className="company-logo"
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt=""
      onError={() => setFailed(true)}
    />
  );
};

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
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
        <h1>Placements</h1>
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
          <div className="row-list-head placements-grid">
            <span>Company</span>
            <span>Department</span>
            <span>Interview Date</span>
            <span>Published On</span>
            <span>Last Date to Apply</span>
            <span>Status</span>
            <span></span>
          </div>
          {jobs.map((job) => {
            const appliedStage = appliedStageByJobId[job.id];

            return (
              <div className="row-list-row placements-grid" key={job.id}>
                <span className="cell-title cell-company">
                  <CompanyLogo company={job.company} />
                  <span className="company-info">
                    <span className="company-name">{job.company || job.title}</span>
                    <span className="company-role">{job.title}</span>
                  </span>
                </span>
                <span className="cell-muted">{job.department || '—'}</span>
                <span className="cell-mono">{formatDate(job.interviewDate)}</span>
                <span className="cell-mono">{formatDate(job.publishedOn)}</span>
                <span className="cell-mono">{formatDate(job.lastDateToApply)}</span>
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
    <span className="applied-check" title={`Applied — ${appliedStage}`}>
      ✓ Applied
    </span>
  ) : job.status === 'CLOSED' ? (
    <span className="closed-check" title="This role is closed">
      Closed
    </span>
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