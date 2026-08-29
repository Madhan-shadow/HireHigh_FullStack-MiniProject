import React, {
  useEffect,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

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
  clearMessages,
} from '../../store/slices/applicationSlice';

import JobCreateModal from './JobCreateModal';
import SearchFilterBar from '../common/SearchFilterBar';
import CapacityBar from '../common/CapacityBar';
import EmptyState from '../common/EmptyState';

const JobList = () => {
  const dispatch = useDispatch();

  const jobs =
    useSelector(selectFilteredJobs);

  const { loading } =
    useSelector(
      (state) => state.jobs
    );

  const { role } =
    useSelector(
      (state) => state.auth
    );

  const {
    successMessage,
    warningMessage,
    error,
  } = useSelector(
    (state) => state.applications
  );

  const [showModal, setShowModal] =
    useState(false);

  const [editingJob, setEditingJob] =
    useState(null);

  const [confirmDeleteId, setConfirmDeleteId] =
    useState(null);

  const isRecruiter =
    role === 'RECRUITER' ||
    role === 'TA_LEAD';

  const isCandidate =
    role === 'CANDIDATE';

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Keep messages visible long enough for UI tests/users
  useEffect(() => {
    if (
      successMessage ||
      warningMessage ||
      error
    ) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [
    successMessage,
    warningMessage,
    error,
    dispatch,
  ]);

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
      dispatch(
        updateJob({
          id: editingJob.id,
          jobData: formData,
        })
      );
    } else {
      dispatch(
        createJob(formData)
      );
    }

    setShowModal(false);
  };

  // ====================================================
  // T21 + T23
  // ====================================================

  const handleApply = (jobId) => {
    dispatch(
      applyToJob(jobId)
    );
  };

  const handleDeleteRequest = (jobId) => {
    setConfirmDeleteId(jobId);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId != null) {
      dispatch(
        deleteJob(confirmDeleteId)
      );

      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="page-container">

      {/* T21 - SUCCESS ALERT */}
      {successMessage && (
        <div
          role="alert"
          className="success-banner"
          data-testid="application-success"
        >
          {successMessage}
        </div>
      )}

      {/* T23 - CAPACITY WARNING */}
      {warningMessage && (
        <div
          role="alert"
          className="warning-banner"
          data-testid="application-capacity-warning"
        >
          {warningMessage}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="error-banner"
        >
          {error}
        </div>
      )}

      <div className="page-header">
        <h1>
          Open Roles
        </h1>

        {isRecruiter && (
          <button
            className="btn btn-primary"
            onClick={handleOpenCreate}
          >
            Post New Job
          </button>
        )}
      </div>

      <SearchFilterBar
        placeholder="Search by job title or department"
        onSearch={(q) =>
          dispatch(
            setSearchQuery(q)
          )
        }
      />

      {loading ? (
        <p>
          Loading jobs...
        </p>
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No open roles"
          message="There are no job postings matching your search."
        />
      ) : (
        <table className="data-table">

          <thead>
            <tr>
              <th>
                Job Title
              </th>

              <th>
                Department
              </th>

              <th>
                Capacity
              </th>

              <th>
                Status
              </th>

              <th>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>

                <td>
                  {job.title}
                </td>

                <td>
                  {job.department}
                </td>

                <td>
                  <CapacityBar
                    currentFills={
                      job.currentFills
                    }
                    hiringGoal={
                      job.hiringGoal
                    }
                  />
                </td>

                <td>
                  <span
                    className={`status-badge status-${(
                      job.status || ''
                    ).toLowerCase()}`}
                  >
                    {job.status}
                  </span>
                </td>

                <td>

                  {isRecruiter && (
                    <>
                      <button
                        className="btn btn-link"
                        onClick={() =>
                          handleOpenEdit(
                            job
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          handleDeleteRequest(
                            job.id
                          )
                        }
                      >
                        Delete
                      </button>
                    </>
                  )}

                  {isCandidate && (
                    <button
                      className="btn btn-success"
                      disabled={
                        job.status !== 'OPEN'
                      }
                      onClick={() =>
                        handleApply(
                          job.id
                        )
                      }
                    >
                      Apply Now
                    </button>
                  )}

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      )}

      {showModal && (
        <JobCreateModal
          job={editingJob}
          onClose={() =>
            setShowModal(false)
          }
          onSubmit={
            handleModalSubmit
          }
        />
      )}

      {confirmDeleteId != null && (
        <div
          className="modal-overlay"
          onClick={() =>
            setConfirmDeleteId(null)
          }
        >
          <div
            className="modal confirm-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3>
              Delete this job posting?
            </h3>

            <p>
              This will permanently
              remove the job and its
              associated applications.
            </p>

            <div className="modal-actions">

              <button
                className="btn btn-secondary"
                onClick={() =>
                  setConfirmDeleteId(null)
                }
              >
                Cancel
              </button>

              <button
                className="btn btn-danger"
                onClick={
                  handleConfirmDelete
                }
              >
                Delete
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default JobList;