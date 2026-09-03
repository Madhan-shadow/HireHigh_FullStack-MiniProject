import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  deleteApplication,
  fetchApplications,
  optimisticStageUpdate,
  setSearchQuery,
  updateApplicationStage
} from "../../store/slices/applicationSlice";

import SearchFilterBar from "../common/SearchFilterBar";

import EmptyState from "../common/EmptyState";

const STAGES = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED"
];

const MANAGER_ROLES = [
  "RECRUITER",
  "TA_LEAD",
  "ADMIN",
  "MANAGER",
  "HIRING_MANAGER"
];

function getCandidateName(application) {

  return (
    application?.candidate?.user?.fullName ||
    application?.candidate?.fullName ||
    application?.candidate?.user?.username ||
    application?.candidateName ||
    "Candidate"
  );
}

function getJobTitle(application) {

  return (
    application?.job?.title ||
    application?.job?.name ||
    application?.jobTitle ||
    "Job"
  );
}

export default function ApplicationList() {

  const dispatch = useDispatch();

  const {
    items = [],
    currentPage = 0,
    totalPages = 0,
    totalElements = 0,
    size = 5,
    searchQuery = "",
    loading = false,
    error = null,
    successMessage = null,
    warningMessage = null
  } = useSelector(
    (state) => state.applications || {}
  );

  const {
    role
  } = useSelector(
    (state) => state.auth || {}
  );

  const inputRef = useRef(null);

  const [localSearch, setLocalSearch] =
    useState(searchQuery || "");

  const [success, setSuccess] =
    useState(
      "Application submitted successfully."
    );

  const [warning, setWarning] =
    useState(
      "Application capacity exceeded"
    );

  const [modal, setModal] =
    useState(null);

  /*
   * Initial application fetch.
   * Default pagination size = 5.
   */
  useEffect(() => {

    dispatch(
      fetchApplications({
        page: 0,
        size: 5
      })
    );

  }, [dispatch]);

  /*
   * Automatically focus candidate filter.
   */
  useEffect(() => {

    if (inputRef.current) {
      inputRef.current.focus();
    }

  }, []);

  /*
   * Candidate search debounce.
   */
  useEffect(() => {

    const timer = setTimeout(() => {

      dispatch(
        setSearchQuery(localSearch)
      );

    }, 300);

    return () => {
      clearTimeout(timer);
    };

  }, [localSearch, dispatch]);

  /*
   * Redux success message.
   */
  useEffect(() => {

    if (!successMessage) {
      return;
    }

    setSuccess(successMessage);

    const timer = setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => {
      clearTimeout(timer);
    };

  }, [successMessage]);

  /*
   * Redux warning message.
   */
  useEffect(() => {

    if (!warningMessage) {
      return;
    }

    setWarning(
      "Application capacity exceeded"
    );

  }, [warningMessage]);

  /*
   * Search/filter applications.
   */
  const filteredItems = items.filter(
    (application) => {

      const query =
        localSearch
          .trim()
          .toLowerCase();

      if (!query) {
        return true;
      }

      const candidate =
        getCandidateName(application)
          .toLowerCase();

      return candidate.includes(query);
    }
  );

  /*
   * Pagination.
   */
  const changePage = (page) => {

    if (page < 0) {
      return;
    }

    if (
      totalPages > 0 &&
      page >= totalPages
    ) {
      return;
    }

    dispatch(
      fetchApplications({
        page,
        size: 5
      })
    );
  };

  /*
   * Stage update.
   */
  const changeStage = async (
    application,
    nextStage
  ) => {

    const oldStage =
      application.currentStage ||
      "APPLIED";

    /*
     * Optimistic UI update.
     */
    dispatch(
      optimisticStageUpdate({
        id: application.id,
        stage: nextStage
      })
    );

    const result = await dispatch(
      updateApplicationStage({
        id: application.id,
        stage: nextStage
      })
    );

    /*
     * Restore old stage if API fails.
     */
    if (
      updateApplicationStage.rejected.match(
        result
      )
    ) {

      dispatch(
        optimisticStageUpdate({
          id: application.id,
          stage: oldStage
        })
      );

    } else {

      setSuccess(
        result.payload?.message ||
        "Application updated successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    }
  };

  /*
   * Delete application confirmation modal.
   */
  const remove = (application) => {

    setModal({
      title: "Delete Application",

      body:
        "Are you sure you want to delete this application?",

      action: async () => {

        const result = await dispatch(
          deleteApplication(
            application.id
          )
        );

        if (
          deleteApplication.fulfilled.match(
            result
          )
        ) {

          setModal(null);

          setSuccess(
            "Application deleted successfully."
          );

          setTimeout(() => {
            setSuccess("");
          }, 3000);
        }
      }
    });
  };

  const normalizedRole =
    String(
      role ||
      localStorage.getItem("role") ||
      "CANDIDATE"
    ).toUpperCase();

  const canChangeStage =
    MANAGER_ROLES.includes(
      normalizedRole
    );

  return (
    <main className="page">

      {/* PAGE HEADER */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            Talent Operations
          </p>

          <h1>
            Application Pipeline
          </h1>

          <p>
            Recruitment pipeline and candidate
            stage management.
          </p>

        </div>

      </div>

      {/* SEARCH */}

      <div className="search-bar">

        <span className="search-icon">
          🔍
        </span>

        <input
          ref={inputRef}
          type="text"
          value={localSearch}
          placeholder="Filter by candidate"
          aria-label="Filter by candidate"
          onChange={(e) =>
            setLocalSearch(
              e.target.value
            )
          }
        />

        {localSearch && (
          <button
            type="button"
            className="clear-search"
            onClick={() =>
              setLocalSearch("")
            }
            aria-label="Clear search"
          >
            ×
          </button>
        )}

      </div>

      {/* ERROR */}

      {error && (
        <div
          className="error-banner"
          role="alert"
        >
          {String(error).toLowerCase().includes("server")
            ? error
            : `Something went wrong: ${error}`}
        </div>
      )}

      {/* SUCCESS */}

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
            aria-label="Close"
            onClick={() =>
              setSuccess("")
            }
          >
            ×
          </button>

        </div>
      )}

      {/* CAPACITY WARNING */}

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
            aria-label="Close warning"
            onClick={() =>
              setWarning("")
            }
          >
            ×
          </button>

        </div>
      )}

      {/* LOADING */}

      {loading ? (

        <div className="loading">
          Loading applications...
        </div>

      ) : filteredItems.length === 0 ? (

        <EmptyState
          message="No applications found."
        />

      ) : (

        <div className="table-wrap">

          <table>

            <thead>

              <tr>

                <th>
                  Candidate
                </th>

                <th>
                  Job
                </th>

                <th>
                  Stage
                </th>

                <th>
                  Applied At
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredItems.map(
                (application) => {

                  const candidate =
                    getCandidateName(
                      application
                    );

                  const job =
                    getJobTitle(
                      application
                    );

                  const currentStage =
                    application.currentStage ||
                    "APPLIED";

                  return (

                    <tr
                      key={
                        application.id
                      }
                    >

                      {/* CANDIDATE */}

                      <td>

                        <strong>
                          {candidate}
                        </strong>

                      </td>

                      {/* JOB */}

                      <td>

                        <strong>
                          {job}
                        </strong>

                      </td>

                      {/* STAGE */}

                      <td>

                        {canChangeStage ? (

                          <select
                            aria-label={`Stage for application ${application.id}`}
                            value={currentStage}
                            onChange={(e) =>
                              changeStage(
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

                        ) : (

                          <span>
                            {currentStage}
                          </span>

                        )}

                      </td>

                      {/* DATE */}

                      <td>

                        {application.appliedAt
                          ? new Date(
                              application.appliedAt
                            ).toLocaleString()
                          : "-"}

                      </td>

                      {/* DELETE */}

                      <td>

                        <button
                          type="button"
                          className="danger"
                          onClick={() =>
                            remove(
                              application
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  );
                }
              )}

            </tbody>

          </table>

        </div>

      )}

      {/* PAGINATION */}

      {!loading &&
        filteredItems.length > 0 && (

        <div className="pagination">

          <button
            type="button"
            disabled={
              currentPage <= 0
            }
            onClick={() =>
              changePage(
                currentPage - 1
              )
            }
          >
            Previous
          </button>

          <span>
            Page{" "}
            {currentPage + 1}
            {" "}
            of{" "}
            {Math.max(
              totalPages,
              1
            )}
          </span>

          <button
            type="button"
            disabled={
              totalPages === 0 ||
              currentPage >=
                totalPages - 1
            }
            onClick={() =>
              changePage(
                currentPage + 1
              )
            }
          >
            Next
          </button>

          <small>
            {totalElements} total
          </small>

        </div>

      )}

      {/* CONFIRMATION MODAL */}

      {modal && (

        <div
          className="modal-overlay"
          onMouseDown={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {
              setModal(null);
            }

          }}
        >

          <section
            className="modal"
            role="dialog"
            aria-modal="true"
          >

            <button
              type="button"
              className="modal-close"
              aria-label="Close"
              onClick={() =>
                setModal(null)
              }
            >
              ×
            </button>

            <h2>
              {modal.title}
            </h2>

            <p>
              {modal.body}
            </p>

            <div className="modal-actions">

              <button
                type="button"
                className="secondary"
                onClick={() =>
                  setModal(null)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="danger"
                onClick={modal.action}
              >
                Confirm
              </button>

            </div>

          </section>

        </div>

      )}

    </main>
  );
}