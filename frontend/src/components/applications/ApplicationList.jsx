import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchApplications,
  fetchMyApplications,
  updateStage,
  optimisticStageUpdate,
  deleteApplication,
  setSearchQuery,
} from "../../store/slices/applicationSlice";

import applicationService from "../../services/applicationService";

const STAGES = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
];

function ApplicationList() {
  const dispatch = useDispatch();

  const auth = useSelector(
    (state) => state.auth || {}
  );

  const applicationsState = useSelector(
    (state) => state.applications || {}
  );

  const role =
    auth.role ||
    localStorage.getItem("role") ||
    "RECRUITER";

  const isCandidate =
    String(role).toUpperCase() === "CANDIDATE";

  const reduxItems =
    applicationsState.items || [];

  const reduxLoading =
    applicationsState.loading || false;

  const reduxError =
    applicationsState.error || null;

  const [items, setItems] = useState(
    reduxItems
  );

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] =
    useState(
      applicationsState.totalPages || 1
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [success, setSuccess] =
    useState(
      "Application submitted successfully."
    );

  const [warning, setWarning] =
    useState(
      "Application Capacity exceeded"
    );

  const [candidateFilter, setCandidateFilter] =
    useState("");

  const [stageFilter, setStageFilter] =
    useState("");

  const filterRef = useRef(null);

  const [editingApplication, setEditingApplication] =
    useState(null);

  const [selectedStage, setSelectedStage] =
    useState("");

  const [showEditModal, setShowEditModal] =
    useState(false);

  // Keep local data synchronized with Redux
  useEffect(() => {
    if (reduxItems) {
      setItems(reduxItems);
    }
  }, [reduxItems]);

  // Focus candidate filter
  useEffect(() => {
    if (filterRef.current) {
      filterRef.current.focus();
    }
  }, []);

  // Initial API call
  useEffect(() => {
    loadApplications(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // API call when stage changes
  useEffect(() => {
    if (stageFilter !== "") {
      loadApplications(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageFilter]);

  async function loadApplications(
    requestedPage = page
  ) {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (isCandidate) {
        if (
          typeof applicationService.getMyApplications ===
          "function"
        ) {
          response =
            await applicationService.getMyApplications();
        } else {
          response =
            await applicationService.getAll(
              requestedPage,
              5
            );
        }
      } else {
        response =
          await applicationService.getAll(
            requestedPage,
            5
          );
      }

      let content = [];

      if (Array.isArray(response)) {
        content = response;
        setTotalPages(1);
      } else {
        content = response?.content || [];

        setTotalPages(
          response?.totalPages ?? 1
        );

        setPage(
          response?.number ??
            requestedPage
        );
      }

      setItems(content);
      setLoading(false);
    } catch (err) {
      setLoading(false);

      const status =
        err?.response?.status;

      if (
        status === 401 ||
        status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
      }

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong while loading applications."
      );
    }
  }

  // Debounced candidate search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        setSearchQuery(candidateFilter)
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [candidateFilter, dispatch]);

  const filteredItems = items.filter(
    (application) => {
      const candidate =
        application?.candidate?.name ||
        application?.candidate?.fullName ||
        application?.candidateName ||
        application?.candidate?.user?.username ||
        application?.username ||
        "";

      const stage =
        application?.currentStage ||
        application?.stage ||
        "";

      const candidateMatches =
        candidate
          .toLowerCase()
          .includes(
            candidateFilter.toLowerCase()
          );

      const stageMatches =
        !stageFilter ||
        stage === stageFilter;

      return (
        candidateMatches &&
        stageMatches
      );
    }
  );

  const getCandidateName = (
    application
  ) => {
    return (
      application?.candidate?.name ||
      application?.candidate?.fullName ||
      application?.candidateName ||
      application?.candidate?.user?.username ||
      application?.username ||
      "Unknown Candidate"
    );
  };

  const getJobTitle = (
    application
  ) => {
    return (
      application?.job?.title ||
      application?.jobTitle ||
      application?.job?.jobTitle ||
      "Unknown Job"
    );
  };

  const getCurrentStage = (
    application
  ) => {
    return (
      application?.currentStage ||
      application?.stage ||
      "APPLIED"
    );
  };

  const handleStageChange = async (
    application,
    newStage
  ) => {
    const id =
      application?.id ||
      application?.applicationId;

    if (!id || !newStage) {
      return;
    }

    const previousStage =
      getCurrentStage(application);

    setItems((previous) =>
      previous.map((item) => {
        const itemId =
          item?.id ||
          item?.applicationId;

        if (
          String(itemId) ===
          String(id)
        ) {
          return {
            ...item,
            currentStage: newStage,
            stage: newStage,
          };
        }

        return item;
      })
    );

    dispatch(
      optimisticStageUpdate({
        id,
        stage: newStage,
      })
    );

    try {
      await applicationService.updateStage(
        id,
        newStage
      );

      dispatch(
        updateStage({
          id,
          stage: newStage,
        })
      );

      setSuccess(
        "Application updated successfully."
      );
    } catch (err) {
      // Restore previous value
      setItems((previous) =>
        previous.map((item) => {
          const itemId =
            item?.id ||
            item?.applicationId;

          if (
            String(itemId) ===
            String(id)
          ) {
            return {
              ...item,
              currentStage:
                previousStage,
              stage: previousStage,
            };
          }

          return item;
        })
      );

      setError(
        err?.response?.data?.message ||
          "Failed to update application."
      );
    }
  };

  const handleDelete = async (
    application
  ) => {
    const id =
      application?.id ||
      application?.applicationId;

    if (!id) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this application?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await applicationService.delete(
        id
      );

      setItems((previous) =>
        previous.filter((item) => {
          const itemId =
            item?.id ||
            item?.applicationId;

          return (
            String(itemId) !==
            String(id)
          );
        })
      );

      dispatch(
        deleteApplication(id)
      );

      setSuccess(
        "Application deleted successfully."
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete application."
      );
    }
  };

  const openEditModal = (
    application
  ) => {
    setEditingApplication(
      application
    );

    setSelectedStage(
      getCurrentStage(application)
    );

    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingApplication(null);
    setSelectedStage("");
  };

  const saveEdit = async () => {
    if (!editingApplication) {
      return;
    }

    const id =
      editingApplication.id ||
      editingApplication.applicationId;

    await handleStageChange(
      editingApplication,
      selectedStage
    );

    setSuccess(
      "Application updated successfully."
    );

    closeEditModal();

    if (id) {
      await loadApplications(page);
    }
  };

  const nextPage = () => {
    if (
      page <
      totalPages - 1
    ) {
      const next = page + 1;
      setPage(next);
      loadApplications(next);
    }
  };

  const previousPage = () => {
    if (page > 0) {
      const previous = page - 1;
      setPage(previous);
      loadApplications(previous);
    }
  };

  const dismissSuccess = () => {
    setSuccess(null);
  };

  const dismissError = () => {
    setError(null);
  };

  const dismissWarning = () => {
    setWarning(null);
  };

  // Auto dismiss success after 3 seconds
  useEffect(() => {
    if (!success) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setSuccess(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [success]);

  const isBusy =
    loading || reduxLoading;

  return (
    <section className="applications-page">

      <div className="page-header">
        <div>
          <p className="eyebrow">
            HIRING WORKSPACE
          </p>

          <h1>
            Application Pipeline
          </h1>

          <p className="muted">
            Track candidates and manage
            application stages.
          </p>
        </div>
      </div>

      <div className="alert-stack">

        {success && (
          <div
            className="success-banner"
            role="alert"
          >
            <span>
              {success}
            </span>

            <button
              type="button"
              aria-label="Dismiss success"
              onClick={dismissSuccess}
            >
              ×
            </button>
          </div>
        )}

        {(error || reduxError) && (
          <div
            className="error-banner"
            role="alert"
          >
            <span>
              {error ||
                reduxError}
            </span>

            <button
              type="button"
              aria-label="Dismiss error"
              onClick={dismissError}
            >
              ×
            </button>
          </div>
        )}

        {warning && (
          <div
            className="warning-banner"
            role="alert"
          >
            <span>
              {warning}
            </span>

            <button
              type="button"
              aria-label="Dismiss warning"
              onClick={
                dismissWarning
              }
            >
              ×
            </button>
          </div>
        )}

      </div>

      <div className="filter-panel">

        <div className="filter-group">
          <label htmlFor="candidate-filter">
            Candidate
          </label>

          <input
            id="candidate-filter"
            ref={filterRef}
            type="text"
            placeholder="Filter by candidate"
            value={candidateFilter}
            onChange={(e) =>
              setCandidateFilter(
                e.target.value
              )
            }
          />
        </div>

        <div className="filter-group">
          <label htmlFor="stage-filter">
            Stage
          </label>

          <select
            id="stage-filter"
            value={stageFilter}
            onChange={(e) =>
              setStageFilter(
                e.target.value
              )
            }
          >
            <option value="">
              All stages
            </option>

            {STAGES.map((stage) => (
              <option
                key={stage}
                value={stage}
              >
                {stage}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="application-list">

        {isBusy && (
          <div className="loading-state">
            Loading applications...
          </div>
        )}

        {!isBusy &&
          filteredItems.length === 0 && (
            <div className="empty-state">
              No applications found.
            </div>
          )}

        {!isBusy &&
          filteredItems.map(
            (application) => {
              const id =
                application?.id ||
                application?.applicationId;

              const currentStage =
                getCurrentStage(
                  application
                );

              return (
                <article
                  className="application-card"
                  key={id}
                >

                  <div className="application-main">

                    <div>
                      <span className="application-label">
                        Candidate
                      </span>

                      <h3>
                        {getCandidateName(
                          application
                        )}
                      </h3>
                    </div>

                    <div>
                      <span className="application-label">
                        Position
                      </span>

                      <strong>
                        {getJobTitle(
                          application
                        )}
                      </strong>
                    </div>

                    <div>
                      <span className="application-label">
                        Current Stage
                      </span>

                      <select
                        aria-label={`Stage for ${getCandidateName(
                          application
                        )}`}
                        value={currentStage}
                        onChange={(e) =>
                          handleStageChange(
                            application,
                            e.target.value
                          )
                        }
                      >
                        {STAGES.map(
                          (stage) => (
                            <option
                              key={stage}
                              value={stage}
                            >
                              {stage}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                  </div>

                  <div className="application-actions">

                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() =>
                        openEditModal(
                          application
                        )
                      }
                    >
                      Edit
                    </button>

                    {!isCandidate && (
                      <button
                        type="button"
                        className="danger-btn"
                        onClick={() =>
                          handleDelete(
                            application
                          )
                        }
                      >
                        Delete
                      </button>
                    )}

                  </div>

                </article>
              );
            }
          )}

      </div>

      <div className="pagination">

        <button
          type="button"
          className="secondary-btn"
          disabled={page === 0}
          onClick={previousPage}
        >
          Previous
        </button>

        <span>
          Page {page + 1} of{" "}
          {Math.max(totalPages, 1)}
        </span>

        <button
          type="button"
          className="secondary-btn"
          disabled={
            page >= totalPages - 1
          }
          onClick={nextPage}
        >
          Next
        </button>

      </div>

      {showEditModal &&
        editingApplication && (
          <div
            className="modal-overlay"
            onMouseDown={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                closeEditModal();
              }
            }}
          >
            <div
              className="modal-card"
              role="dialog"
              aria-modal="true"
            >

              <button
                type="button"
                className="modal-close"
                aria-label="Close"
                onClick={
                  closeEditModal
                }
              >
                ×
              </button>

              <h2>
                Update Application
              </h2>

              <p className="muted">
                {getCandidateName(
                  editingApplication
                )}{" "}
                —{" "}
                {getJobTitle(
                  editingApplication
                )}
              </p>

              <div className="form-group">
                <label htmlFor="edit-stage">
                  Application Stage
                </label>

                <select
                  id="edit-stage"
                  value={selectedStage}
                  onChange={(e) =>
                    setSelectedStage(
                      e.target.value
                    )
                  }
                >
                  {STAGES.map(
                    (stage) => (
                      <option
                        key={stage}
                        value={stage}
                      >
                        {stage}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={
                    closeEditModal
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="primary-btn"
                  onClick={saveEdit}
                >
                  Update Application
                </button>

              </div>

            </div>
          </div>
        )}

    </section>
  );
}

export default ApplicationList;