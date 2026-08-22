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
  fetchApplications,
  fetchMyApplications,
  updateStage,
  deleteApplication,
  clearMessages
} from "../../store/slices/applicationSlice";

function ApplicationList() {
  const dispatch = useDispatch();

  const {
    items,
    currentPage,
    totalPages,
    totalElements,
    loading,
    error,
    success,
    warning
  } = useSelector(
    (state) => state.applications
  );

  const { role } = useSelector(
    (state) => state.auth
  );

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {

      if (role === "CANDIDATE") {
        dispatch(fetchMyApplications());
      } else {
        dispatch(
          fetchApplications({
            page,
            size: 5,
            search
          })
        );
      }

    }, 300);

    return () => clearTimeout(timer);
  }, [
    dispatch,
    page,
    search,
    role
  ]);

  useEffect(() => {
    if (
      success ||
      warning ||
      error
    ) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [
    success,
    warning,
    error,
    dispatch
  ]);

  const handleStage = async (
    id,
    stage
  ) => {
    await dispatch(
      updateStage({
        id,
        stage
      })
    );

    setModal(null);
  };

  const handleDelete = async (id) => {
    await dispatch(
      deleteApplication(id)
    );

    setModal(null);
  };

  return (
    <div className="application-list">

      <h1>
        Applications
      </h1>

      {role !== "CANDIDATE" && (
        <input
          ref={inputRef}
          placeholder="Filter by candidate"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      )}

      {success && (
        <div className="success-banner">
          {success}
        </div>
      )}

      {warning && (
        <div className="warning-banner">
          {warning}
        </div>
      )}

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Job</th>
              <th>Stage</th>
              <th>Applied At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((application) => (
              <tr
                key={application.id}
              >
                <td>
                  {application.candidate
                    ?.user?.fullName ||
                    application.candidate
                    ?.user?.username ||
                    application.candidate
                    ?.user?.email ||
                    "Candidate"}
                </td>

                <td>
                  {application.job?.title}
                </td>

                <td>
                  {application.currentStage}
                </td>

                <td>
                  {application.appliedAt
                    ? new Date(
                        application.appliedAt
                      ).toLocaleString()
                    : ""}
                </td>

                <td>
                  {(role === "RECRUITER" ||
                    role === "TA_LEAD") && (
                    <>
                      <button
                        onClick={() =>
                          setModal({
                            type: "stage",
                            application
                          })
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          setModal({
                            type: "delete",
                            application
                          })
                        }
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {role !== "CANDIDATE" && (
        <div className="pagination">

          <button
            disabled={page === 0}
            onClick={() =>
              setPage((p) => p - 1)
            }
          >
            Previous
          </button>

          <span>
            Page {currentPage + 1} of{" "}
            {Math.max(totalPages, 1)}
          </span>

          <button
            disabled={
              page >= totalPages - 1
            }
            onClick={() =>
              setPage((p) => p + 1)
            }
          >
            Next
          </button>

          <span>
            Total: {totalElements}
          </span>

        </div>
      )}

      {modal && (
        <div
          className="modal-backdrop"
          onClick={() => setModal(null)}
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              aria-label="Close"
              onClick={() =>
                setModal(null)
              }
            >
              X
            </button>

            {modal.type === "stage" && (
              <>
                <h2>
                  Update Stage
                </h2>

                <label htmlFor="stage">
                  Stage
                </label>

                <select
                  id="stage"
                  value={
                    modal.application
                      .currentStage
                  }
                  onChange={(e) =>
                    handleStage(
                      modal.application.id,
                      e.target.value
                    )
                  }
                >
                  <option value="APPLIED">
                    APPLIED
                  </option>

                  <option value="SCREENING">
                    SCREENING
                  </option>

                  <option value="INTERVIEW">
                    INTERVIEW
                  </option>

                  <option value="OFFERED">
                    OFFERED
                  </option>

                  <option value="HIRED">
                    HIRED
                  </option>

                  <option value="REJECTED">
                    REJECTED
                  </option>
                </select>
              </>
            )}

            {modal.type === "delete" && (
              <>
                <h2>
                  Confirm Delete
                </h2>

                <p>
                  Are you sure you want to
                  delete this application?
                </p>

                <button
                  onClick={() =>
                    handleDelete(
                      modal.application.id
                    )
                  }
                >
                  Delete
                </button>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default ApplicationList;