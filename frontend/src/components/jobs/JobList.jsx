import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  applyToJob
} from "../../store/slices/applicationSlice";

import {
  createJob,
  deleteJob,
  fetchJobs,
  selectFilteredJobs,
  setSearchQuery,
  updateJob
} from "../../store/slices/jobSlice";

import JobCreateModal from "./JobCreateModal";

export default function JobList() {

  const dispatch = useDispatch();

  const role =
    useSelector(
      (state) => state.auth.role
    ) ||
    localStorage.getItem("role") ||
    "CANDIDATE";

  const jobs = useSelector(
    selectFilteredJobs
  );

  const loading = useSelector(
    (state) => state.jobs.loading
  );

  const error = useSelector(
    (state) => state.jobs.error
  );

  const [modal, setModal] =
    useState(false);

  const [editing, setEditing] =
    useState(null);

  const [notice, setNotice] =
    useState("");

  const normalizedRole =
    String(role).toUpperCase();

  const canManage = [
    "RECRUITER",
    "TA_LEAD",
    "ADMIN"
  ].includes(normalizedRole);

  const isCandidate =
    normalizedRole === "CANDIDATE";

  useEffect(() => {

    dispatch(fetchJobs());

  }, [dispatch]);

  const title = useMemo(
    () =>
      canManage
        ? "Open Roles"
        : "Find your next opportunity",
    [canManage]
  );

  const save = async (data) => {

    let result;

    if (editing) {

      result = await dispatch(
        updateJob({
          id: editing.id,
          data
        })
      );

    } else {

      result = await dispatch(
        createJob(data)
      );

    }

    if (
      result.meta?.requestStatus ===
      "fulfilled"
    ) {

      setModal(false);

      setEditing(null);

      dispatch(fetchJobs());

    }

  };

  const remove = async (id) => {

    const confirmed =
      window.confirm(
        "Delete this job?"
      );

    if (!confirmed) {
      return;
    }

    const result =
      await dispatch(
        deleteJob(id)
      );

    if (
      result.meta?.requestStatus ===
      "fulfilled"
    ) {

      setNotice(
        "Job deleted successfully."
      );

      setTimeout(() => {
        setNotice("");
      }, 3000);

    }

  };

  const apply = async (id) => {

    const result =
      await dispatch(
        applyToJob(id)
      );

    if (!result.error) {

      setNotice(
        result.payload?.message ||
        "Application submitted successfully."
      );

    } else {

      setNotice(
        "Application Capacity exceeded"
      );

    }

    setTimeout(() => {
      setNotice("");
    }, 3000);

  };

  const closeModal = () => {

    setModal(false);

    setEditing(null);

  };

  return (
    <section>

      <div className="page-header">

        <div>

          <p className="eyebrow">
            HireHigh
          </p>

          <h1>
            {title}
          </h1>

          <p className="muted">
            Discover active positions and
            keep hiring moving.
          </p>

        </div>

        {canManage && (

          <button
            className="primary-btn"
            type="button"
            onClick={() => {
              setEditing(null);
              setModal(true);
            }}
          >
            ＋ Post New Job
          </button>

        )}

      </div>

      {notice && (

        <div
          className="success-banner"
          role="alert"
        >

          <span>
            {notice}
          </span>

          <button
            type="button"
            aria-label="Close"
            onClick={() =>
              setNotice("")
            }
          >
            ×
          </button>

        </div>

      )}

      {error && (

        <div
          className="error-banner"
          role="alert"
        >
          {error}
        </div>

      )}

      <div className="toolbar">

        <input
          placeholder="Search jobs by title or department"
          onChange={(e) =>
            dispatch(
              setSearchQuery(
                e.target.value
              )
            )
          }
        />

        <span className="result-count">
          {jobs.length} roles
        </span>

      </div>

      {loading ? (

        <div className="empty-state">
          Loading open roles...
        </div>

      ) : (

        <div className="job-grid">

          {jobs.map((job) => (

            <article
              className="job-card"
              key={job.id}
            >

              <div className="job-icon">
                ↗
              </div>

              <div className="job-main">

                <div className="job-topline">

                  <span className="status-dot">
                    {job.status || "OPEN"}
                  </span>

                </div>

                <h2>
                  {job.title}
                </h2>

                <p className="job-meta">

                  {job.department ||
                    "Engineering"}

                  {" · "}

                  {job.hiringGoal || 0}

                  {" open seat"}

                  {job.hiringGoal === 1
                    ? ""
                    : "s"}

                </p>

                <p className="job-description">
                  {job.description ||
                    "Detailed job description."}
                </p>

              </div>

              <div className="job-actions">

                {isCandidate &&
                  job.status !== "CLOSED" && (

                  <button
                    className="primary-btn"
                    type="button"
                    onClick={() =>
                      apply(job.id)
                    }
                  >
                    Apply
                  </button>

                )}

                {canManage && (

                  <>

                    <button
                      className="secondary-btn"
                      type="button"
                      onClick={() => {
                        setEditing(job);
                        setModal(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="danger-btn"
                      type="button"
                      onClick={() =>
                        remove(job.id)
                      }
                    >
                      Delete
                    </button>

                  </>

                )}

              </div>

            </article>

          ))}

          {!jobs.length && (

            <div className="empty-state">
              No open roles found.
            </div>

          )}

        </div>

      )}

      <JobCreateModal
        open={modal}
        onClose={closeModal}
        initialData={editing}
        onSubmit={save}
      />

    </section>
  );
}