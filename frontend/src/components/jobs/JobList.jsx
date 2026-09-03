import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
  setSearchQuery,
  selectFilteredJobs,
} from "../../store/slices/jobSlice";

import {
  applyToJob,
  clearMessages,
} from "../../store/slices/applicationSlice";

import JobCreateModal from "./JobCreateModal";

const JobList = () => {
  const dispatch = useDispatch();

  const jobs = useSelector(selectFilteredJobs);
  const searchQuery = useSelector(
    (state) => state.jobs.searchQuery
  );

  const {
    loading: jobLoading,
    error: jobError,
  } = useSelector((state) => state.jobs);

  const applicationState = useSelector(
    (state) => state.applications || {}
  );

  const auth = useSelector((state) => state.auth || {});

  const role =
    auth.role ||
    localStorage.getItem("role") ||
    "";

  const normalizedRole = role.toUpperCase();

  const canManage =
    normalizedRole === "RECRUITER" ||
    normalizedRole === "TA_LEAD" ||
    normalizedRole === "ADMIN";

  const isCandidate =
    normalizedRole === "CANDIDATE";

  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [notice, setNotice] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    if (applicationState.successMessage) {
      setNotice(applicationState.successMessage);

      const timer = setTimeout(() => {
        setNotice("");
        dispatch(clearMessages());
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (applicationState.error) {
      setWarning(applicationState.error);
    }
  }, [
    applicationState.successMessage,
    applicationState.error,
    dispatch,
  ]);

  const normalizedJobs = useMemo(() => {
    if (Array.isArray(jobs)) {
      return jobs;
    }

    if (jobs?.content) {
      return jobs.content;
    }

    return [];
  }, [jobs]);

  const openCreate = () => {
    setEditingJob(null);
    setModalOpen(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingJob(null);
  };

  const handleSaveJob = async (formData) => {
    setModalLoading(true);

    try {
      if (editingJob) {
        await dispatch(
          updateJob({
            id: editingJob.id || editingJob.jobId,
            jobData: formData,
          })
        ).unwrap();
      } else {
        await dispatch(createJob(formData)).unwrap();
      }

      closeModal();
      dispatch(fetchJobs());
    } catch (error) {
      setWarning(
        error?.message ||
          "Something went wrong while saving the job."
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (job) => {
    const id = job.id || job.jobId;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        job.title || job.jobTitle
      }"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteJob(id)).unwrap();
      dispatch(fetchJobs());
      setNotice("Job deleted successfully.");
    } catch (error) {
      setWarning(
        error?.message ||
          "Something went wrong while deleting the job."
      );
    }
  };

  const handleApply = async (job) => {
    const id = job.id || job.jobId;

    setNotice("");
    setWarning("");

    const result = await dispatch(applyToJob(id));

    if (result.error) {
      setWarning(
        result.payload ||
          result.error.message ||
          "Unable to submit application."
      );
    } else {
      setNotice(
        result.payload?.message ||
          "Application submitted successfully."
      );
    }
  };

  return (
    <div className="page-container">
      <section className="page-hero">
        <div>
          <p className="eyebrow">HIRING PLATFORM</p>

          <h1>Open Roles</h1>

          <p className="hero-description">
            Discover opportunities and manage your recruitment
            pipeline from one place.
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            className="primary-btn"
            onClick={openCreate}
          >
            + Post New Job
          </button>
        )}
      </section>

      <div className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(event) =>
            dispatch(setSearchQuery(event.target.value))
          }
        />
      </div>

      {notice && (
        <div className="success-banner" role="alert">
          <span>{notice}</span>

          <button
            type="button"
            aria-label="Close"
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      )}

      {warning && (
        <div className="warning-banner" role="alert">
          <span>{warning}</span>

          <button
            type="button"
            aria-label="Close"
            onClick={() => setWarning("")}
          >
            ×
          </button>
        </div>
      )}

      {jobError && (
        <div className="error-banner" role="alert">
          {jobError}
        </div>
      )}

      {jobLoading ? (
        <div className="loading-card">
          <div className="spinner"></div>
          <p>Loading jobs...</p>
        </div>
      ) : normalizedJobs.length === 0 ? (
        <div className="empty-card">
          <div className="empty-icon">⌁</div>
          <h3>No jobs found</h3>
          <p>
            Try another search or create a new job opening.
          </p>
        </div>
      ) : (
        <div className="job-grid">
          {normalizedJobs.map((job) => {
            const jobId = job.id || job.jobId;

            const title =
              job.title ||
              job.jobTitle ||
              "Untitled Position";

            const department =
              job.department || "Engineering";

            const status =
              job.status || "OPEN";

            const goal =
              job.hiringGoal ||
              job.hiringTarget ||
              0;

            const description =
              job.description ||
              "No description available.";

            return (
              <article
                className="job-card"
                key={jobId}
              >
                <div className="job-card-top">
                  <span
                    className={`status-badge ${status.toLowerCase()}`}
                  >
                    {status}
                  </span>
                </div>

                <h2>{title}</h2>

                <p className="job-department">
                  {department}
                </p>

                <p className="job-description">
                  {description}
                </p>

                <div className="job-meta">
                  <div>
                    <span>Hiring goal</span>
                    <strong>{goal}</strong>
                  </div>

                  <div>
                    <span>Position</span>
                    <strong>Open</strong>
                  </div>
                </div>

                <div className="job-actions">
                  {isCandidate && (
                    <button
                      type="button"
                      className="primary-btn full-width"
                      onClick={() => handleApply(job)}
                    >
                      Apply Now
                    </button>
                  )}

                  {canManage && (
                    <>
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => openEdit(job)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="danger-btn"
                        onClick={() => handleDelete(job)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <JobCreateModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSaveJob}
        initialData={editingJob}
        loading={modalLoading}
      />
    </div>
  );
};

export default JobList;