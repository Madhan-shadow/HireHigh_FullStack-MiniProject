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
  createJob,
  deleteJob,
  fetchJobs,
  setSearchQuery,
  updateJob
} from "../../store/slices/jobSlice";

import {
  applyForJob
} from "../../store/slices/applicationSlice";

import JobCreateModal from "./JobCreateModal";

import SearchFilterBar from "../common/SearchFilterBar";

import CapacityBar from "../common/CapacityBar";

import EmptyState from "../common/EmptyState";

export default function JobList() {

  const dispatch = useDispatch();

  const {
    items = [],
    searchQuery = "",
    loading,
    error,
    successMessage
  } = useSelector((state) => state.jobs);

  const {
    role,
    user
  } = useSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingJob, setEditingJob] = useState(null);

  const [success, setSuccess] = useState("");

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {

    if (successMessage) {

      setSuccess(successMessage);

      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);

      return () => clearTimeout(timer);
    }

  }, [successMessage]);

  const filteredJobs = useMemo(() => {

    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((job) => {

      const text = `
        ${job.title || ""}
        ${job.department || ""}
        ${job.description || ""}
      `;

      return text
        .toLowerCase()
        .includes(query);
    });

  }, [items, searchQuery]);

  const normalizedRole =
    String(role || localStorage.getItem("role") || "")
      .toUpperCase();

  const isRecruiter = [
    "RECRUITER",
    "TA_LEAD",
    "ADMIN",
    "MANAGER"
  ].includes(normalizedRole);

  const isCandidate =
    normalizedRole === "CANDIDATE";

  const openCreateModal = () => {
    setEditingJob(null);
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingJob(null);
  };

  const saveJob = async (data) => {

    if (editingJob) {

      const result = await dispatch(
        updateJob({
          id: editingJob.id,
          jobData: data
        })
      );

      if (updateJob.fulfilled.match(result)) {
        closeModal();
        dispatch(fetchJobs());
      }

    } else {

      const result = await dispatch(
        createJob(data)
      );

      if (createJob.fulfilled.match(result)) {
        closeModal();
        dispatch(fetchJobs());
      }
    }
  };

  const removeJob = async (job) => {

    const confirmed = window.confirm(
      `Delete ${job.title || "this job"}?`
    );

    if (!confirmed) {
      return;
    }

    await dispatch(
      deleteJob(job.id)
    );
  };

  const apply = async (job) => {

    const username =
      user?.username ||
      localStorage.getItem("username");

    const result = await dispatch(
      applyForJob({
        jobId: job.id,
        username
      })
    );

    if (applyForJob.fulfilled.match(result)) {

      setSuccess(
        result.payload?.message ||
        "Application submitted successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);

    }
  };

  return (
    <main className="page">

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            HireHigh
          </p>

          <h1>
            Open Roles
          </h1>

          <p>
            Search and manage available opportunities.
          </p>

        </div>

        {isRecruiter && (
          <button
            type="button"
            onClick={openCreateModal}
          >
            Post New Job
          </button>
        )}

      </div>

      <SearchFilterBar
        value={searchQuery}
        onChange={(value) =>
          dispatch(setSearchQuery(value))
        }
        placeholder="Search jobs by title or department"
      />

      {success && (
        <div
          className="success-banner"
          role="alert"
        >
          {success}
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

      {loading ? (

        <div className="loading">
          Loading jobs...
        </div>

      ) : filteredJobs.length === 0 ? (

        <EmptyState
          message="No open roles found."
        />

      ) : (

        <div className="table-wrap">

          <table>

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

              {filteredJobs.map((job) => (

                <tr key={job.id}>

                  <td>

                    <strong>
                      {job.title}
                    </strong>

                    <div className="muted">
                      {job.description}
                    </div>

                  </td>

                  <td>
                    {job.department || "-"}
                  </td>

                  <td>

                    <CapacityBar
                      current={
                        job.currentFills ||
                        job.currentFilled ||
                        0
                      }
                      goal={
                        job.hiringGoal ||
                        0
                      }
                    />

                  </td>

                  <td>

                    <span className="status">
                      {job.status || "OPEN"}
                    </span>

                  </td>

                  <td className="actions">

                    {isCandidate &&
                      job.status === "OPEN" && (

                        <button
                          type="button"
                          onClick={() =>
                            apply(job)
                          }
                        >
                          Apply Now
                        </button>

                      )}

                    {isRecruiter && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(job)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="danger"
                          onClick={() =>
                            removeJob(job)
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

        </div>

      )}

      <JobCreateModal
        open={modalOpen}
        editingJob={editingJob}
        onClose={closeModal}
        onSubmit={saveJob}
      />

    </main>
  );
}