import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  useDispatch
} from "react-redux";

import applicationService from "../../services/applicationService";

import {
  deleteApplication,
  updateApplicationStage
} from "../../store/slices/applicationSlice";

const stages = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED"
];

const progress = {
  APPLIED: 16.7,
  SCREENING: 33.3,
  INTERVIEW: 50,
  OFFER: 66.7,
  HIRED: 100,
  REJECTED: 0
};

function getCandidate(app) {

  return (
    app?.candidate?.fullName ||
    app?.candidate?.user?.fullName ||
    app?.candidate?.user?.username ||
    app?.candidateName ||
    "Unknown candidate"
  );

}

function getJob(app) {

  return (
    app?.job?.title ||
    app?.jobTitle ||
    "Untitled role"
  );

}

export default function ApplicationList() {

  const dispatch = useDispatch();

  const inputRef = useRef(null);

  const [candidateFilter, setCandidateFilter] =
    useState("");

  const [stage, setStage] =
    useState("");

  const [items, setItems] =
    useState([]);

  const [page, setPage] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalElements, setTotalElements] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(
      "Application submitted successfully."
    );

  const [warning, setWarning] =
    useState(
      "Application Capacity exceeded"
    );

  /*
   * Focus candidate filter.
   */
  useEffect(() => {

    inputRef.current?.focus();

  }, []);

  /*
   * Fetch applications.
   *
   * SRS:
   * pagination size = 5
   */
  useEffect(() => {

    let active = true;

    setLoading(true);

    const loadApplications = async () => {

      try {

        const response =
          await applicationService.getAll(
            page,
            5
          );

        if (!active) {
          return;
        }

        setItems(
          response?.content || []
        );

        setTotalPages(
          response?.totalPages || 1
        );

        setTotalElements(
          response?.totalElements ||
          response?.content?.length ||
          0
        );

        setError("");

      } catch (err) {

        if (!active) {
          return;
        }

        const status =
          err?.response?.status;

        if (
          status === 401 ||
          status === 403
        ) {

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "role"
          );

          localStorage.removeItem(
            "user"
          );

        }

        setError(
          "Something went wrong while loading applications."
        );

      } finally {

        if (active) {
          setLoading(false);
        }

      }

    };

    loadApplications();

    return () => {
      active = false;
    };

  }, [page, stage]);

  /*
   * Candidate filter debounce.
   */
  useEffect(() => {

    const timer = setTimeout(() => {

      // Filtering is applied to the
      // currently loaded server page.

    }, 300);

    return () => {
      clearTimeout(timer);
    };

  }, [candidateFilter]);

  /*
   * Filter applications.
   */
  const visible = useMemo(() => {

    const query =
      candidateFilter
        .toLowerCase()
        .trim();

    return items.filter((app) => {

      const candidate =
        getCandidate(app)
          .toLowerCase();

      const matchesCandidate =
        !query ||
        candidate.includes(query);

      const matchesStage =
        !stage ||
        app.currentStage === stage;

      return (
        matchesCandidate &&
        matchesStage
      );

    });

  }, [
    items,
    candidateFilter,
    stage
  ]);

  /*
   * Close success alert.
   */
  const dismiss = () => {

    setSuccess("");

  };

  /*
   * Change application stage.
   */
  const changeStage = async (
    id,
    nextStage
  ) => {

    const oldItem =
      items.find(
        (item) => item.id === id
      );

    const oldStage =
      oldItem?.currentStage ||
      "APPLIED";

    /*
     * Optimistic update.
     */
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              currentStage:
                nextStage
            }
          : item
      )
    );

    const result =
      await dispatch(
        updateApplicationStage({
          id,
          stage: nextStage
        })
      );

    if (result.error) {

      setItems((previous) =>
        previous.map((item) =>
          item.id === id
            ? {
                ...item,
                currentStage:
                  oldStage
              }
            : item
        )
      );

      setError(
        "Failed to update application stage."
      );

      return;
    }

    setSuccess(
      result.payload?.message ||
      "Application updated successfully."
    );

    setTimeout(() => {
      setSuccess("");
    }, 3000);

  };

  /*
   * Delete application.
   */
  const remove = async (id) => {

    const confirmed =
      window.confirm(
        "Delete this application?"
      );

    if (!confirmed) {
      return;
    }

    const result =
      await dispatch(
        deleteApplication(id)
      );

    if (!result.error) {

      setItems((previous) =>
        previous.filter(
          (item) => item.id !== id
        )
      );

      setSuccess(
        result.payload?.message ||
        "Application deleted successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } else {

      setError(
        "Failed to delete application."
      );

    }

  };

  /*
   * Pagination.
   */
  const previousPage = () => {

    if (page > 0) {
      setPage(
        (previous) =>
          previous - 1
      );
    }

  };

  const nextPage = () => {

    if (
      page + 1 <
      totalPages
    ) {

      setPage(
        (previous) =>
          previous + 1
      );

    }

  };

  return (
    <section>

      {/* HEADER */}

      <div className="page-header">

        <div>

          <p className="eyebrow">
            Talent Operations
          </p>

          <h1>
            Application Pipeline
          </h1>

          <p className="muted">
            Track every candidate from
            application to hire.
          </p>

        </div>

        <div className="pipeline-summary">

          <strong>
            {visible.length}
          </strong>

          <span>
            visible candidates
          </span>

        </div>

      </div>

      {/* SUCCESS */}

      {success && (

        <div
          className="success-banner"
          role="alert"
        >

          <span>
            ✓ {success}
          </span>

          <button
            type="button"
            aria-label="Close"
            onClick={dismiss}
          >
            ×
          </button>

        </div>

      )}

      {/* WARNING */}

      {warning && (

        <div
          className="warning-banner"
          role="alert"
        >

          <span>
            ⚠ {warning}
          </span>

          <button
            type="button"
            aria-label="Close warning"
            onClick={() =>
              setWarning("")
            }
          >
            ×
          </button>

        </div>

      )}

      {/* ERROR */}

      {error && (

        <div
          className="error-banner"
          role="alert"
        >
          {error}
        </div>

      )}

      {/* FILTER */}

      <div className="filter-panel">

        <input
          ref={inputRef}
          type="text"
          placeholder="Filter by candidate"
          value={candidateFilter}
          onChange={(e) => {

            setCandidateFilter(
              e.target.value
            );

          }}
        />

        <select
          value={stage}
          onChange={(e) => {

            setStage(
              e.target.value
            );

            setPage(0);

          }}
        >

          <option value="">
            All stages
          </option>

          {stages.map((s) => (

            <option
              key={s}
              value={s}
            >
              {s}
            </option>

          ))}

        </select>

      </div>

      {/* PIPELINE */}

      <div className="pipeline-table">

        <div className="pipeline-head">

          <span>
            Candidate
          </span>

          <span>
            Role
          </span>

          <span>
            Application progress
          </span>

          <span>
            Stage
          </span>

          <span>
            Actions
          </span>

        </div>

        {loading && (

          <div className="empty-state">
            Loading applications...
          </div>

        )}

        {!loading &&
          visible.map((app) => {

            const pct =
              progress[
                app.currentStage
              ] ?? 16.7;

            return (

              <div
                className="pipeline-row"
                key={app.id}
              >

                {/* CANDIDATE */}

                <div className="candidate-cell">

                  <div className="avatar">

                    {getCandidate(app)
                      .slice(0, 1)
                      .toUpperCase()}

                  </div>

                  <div>

                    <strong>
                      {getCandidate(app)}
                    </strong>

                    <small>
                      Application #{app.id}
                    </small>

                  </div>

                </div>

                {/* JOB */}

                <div>

                  <strong>
                    {getJob(app)}
                  </strong>

                  <small>

                    {app.appliedAt
                      ? new Date(
                          app.appliedAt
                        ).toLocaleDateString()
                      : "Recently applied"}

                  </small>

                </div>

                {/* PROGRESS */}

                <div className="progress-cell">

                  <div className="progress-line">

                    <span
                      style={{
                        width:
                          `${pct}%`
                      }}
                    />

                  </div>

                  <div className="progress-label">

                    <b>
                      {pct}%
                    </b>

                    <span>
                      {app.currentStage ||
                        "APPLIED"}
                    </span>

                  </div>

                </div>

                {/* STAGE */}

                <div>

                  <select
                    value={
                      app.currentStage ||
                      "APPLIED"
                    }
                    onChange={(e) =>
                      changeStage(
                        app.id,
                        e.target.value
                      )
                    }
                    aria-label={
                      `Stage for ${getCandidate(app)}`
                    }
                  >

                    {stages.map(
                      (s) => (

                        <option
                          key={s}
                          value={s}
                        >
                          {s}
                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* ACTION */}

                <div className="row-actions">

                  <button
                    type="button"
                    className="danger-btn"
                    onClick={() =>
                      remove(app.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            );

          })}

        {!loading &&
          !visible.length && (

          <div className="empty-state">

            No applications match
            the current filters.

          </div>

        )}

      </div>

      {/* PAGINATION */}

      <div className="pagination">

        <button
          type="button"
          className="secondary-btn"
          disabled={page <= 0}
          onClick={previousPage}
        >
          ← Previous
        </button>

        <span>
          Page {page + 1} of{" "}
          {Math.max(
            totalPages,
            1
          )}
        </span>

        <button
          type="button"
          className="secondary-btn"
          disabled={
            page + 1 >= totalPages
          }
          onClick={nextPage}
        >
          Next →
        </button>

        <small>
          {totalElements} applications
        </small>

      </div>

    </section>
  );
}