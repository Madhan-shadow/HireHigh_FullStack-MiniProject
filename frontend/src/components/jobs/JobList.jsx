import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, deleteJob } from '../../store/slices/jobSlice';
import { applyToJob, clearMessages } from '../../store/slices/applicationSlice';
import CapacityBar from '../common/CapacityBar';
import SearchFilterBar from '../common/SearchFilterBar';
import EmptyState from '../common/EmptyState';
import JobCreateModal from './JobCreateModal';
import './JobList.css';

export default function JobList() {
  const dispatch = useDispatch();
  const { items = [], status } = useSelector((state) => state.jobs);
  const { role } = useSelector((state) => state.auth);
  const { successMessage, warningMessage, errorMessage } = useSelector(
    (state) => state.applications
  );

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Auto-dismiss banners after 3000ms
  useEffect(() => {
    if (successMessage || warningMessage || errorMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, warningMessage, errorMessage, dispatch]);

  const filtered = items.filter((job) => {
    const q = search.toLowerCase();
    return job.title?.toLowerCase().includes(q) || job.department?.toLowerCase().includes(q);
  });

  const canManage = role === 'RECRUITER' || role === 'TA_LEAD';
  const canApply = role === 'CANDIDATE';

  const handleApply = (jobId) => {
    dispatch(applyToJob(jobId));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this job posting? This cannot be undone.')) {
      dispatch(deleteJob(id));
    }
  };

  return (
    <div className="job-list-page">
      <div className="job-list-header">
        <div>
          <h2>Open Roles</h2>
          <p className="job-list-sub">Every open seat, tracked from posting to hire.</p>
        </div>
        {canManage && (
          <button className="btn btn-accent" onClick={() => { setEditingJob(null); setModalOpen(true); }}>
            Post New Job
          </button>
        )}
      </div>

      {successMessage && <div className="success-banner">{successMessage}</div>}
      {warningMessage && <div className="warning-banner">{warningMessage}</div>}
      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      <SearchFilterBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by job title or department"
      />

      {status === 'loading' && <p className="job-list-status">Loading roles…</p>}

      {status !== 'loading' && filtered.length === 0 && (
        <EmptyState
          title="No open roles match that search"
          description="Try a different title or department, or clear the search to see everything."
        />
      )}

      {filtered.length > 0 && (
        <div className="job-table-wrap">
          <table className="job-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Department</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr key={job.id}>
                  <td className="job-title-cell">{job.title}</td>
                  <td>{job.department}</td>
                  <td><CapacityBar currentFills={job.currentFills} hiringGoal={job.hiringGoal} /></td>
                  <td>
                    <span className={`status-chip status-chip--${(job.status || 'open').toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="job-actions">
                    {canManage && (
                      <>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditingJob(job); setModalOpen(true); }}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job.id)}>Delete</button>
                      </>
                    )}
                    {canApply && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleApply(job.id)}>Apply Now</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <JobCreateModal job={editingJob} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}