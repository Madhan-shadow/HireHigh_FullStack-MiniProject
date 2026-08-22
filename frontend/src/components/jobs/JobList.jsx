import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
  setSearchQuery
} from "../../store/slices/jobSlice";

import { applyJob } from "../../store/slices/applicationSlice";

function JobList() {
  const dispatch = useDispatch();

  const {
    items,
    loading,
    error,
    searchQuery
  } = useSelector((state) => state.jobs);

  const { role } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const filteredJobs = items.filter((job) => {
    const value = `
      ${job.title || ""}
      ${job.department || ""}
      ${job.description || ""}
    `.toLowerCase();

    return value.includes(
      searchQuery.toLowerCase()
    );
  });

  const openCreate = () => {
    setForm({
      title: "",
      department: "",
      description: "",
      hiringGoal: ""
    });
  };

  const openEdit = (job) => {
    setForm({
      ...job
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobData = {
      title: form.title,
      department: form.department,
      description: form.description,
      hiringGoal: Number(form.hiringGoal)
    };

    let result;

    if (form.id) {
      result = await dispatch(
        updateJob({
          id: form.id,
          jobData
        })
      );
    } else {
      result = await dispatch(
        createJob(jobData)
      );
    }

    if (
      createJob.fulfilled.match(result) ||
      updateJob.fulfilled.match(result)
    ) {
      setForm(null);

      setMessage(
        result.payload?.message ||
        "Job saved successfully."
      );
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(
      deleteJob(deleteItem.id)
    );

    if (deleteJob.fulfilled.match(result)) {
      setDeleteItem(null);

      setMessage(
        result.payload?.message ||
        "Job deleted successfully."
      );
    }
  };

  const handleApply = async (jobId) => {
    const result = await dispatch(
      applyJob(jobId)
    );

    if (applyJob.fulfilled.match(result)) {
      setMessage(
        result.payload?.message ||
        "Application submitted successfully."
      );
    }
  };

  return (
    <div className="job-list">

      <h1>Open Roles</h1>

      <input
        type="text"
        placeholder="Search jobs"
        value={searchQuery}
        onChange={(e) =>
          dispatch(
            setSearchQuery(e.target.value)
          )
        }
      />

      {message && (
        <div className="success-banner">
          {message}
        </div>
      )}

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {(role === "RECRUITER" ||
        role === "TA_LEAD") && (
        <button onClick={openCreate}>
          Post New Job
        </button>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="job-container">

          {filteredJobs.map((job) => (
            <div
              className="job-card"
              key={job.id}
            >

              <h2>{job.title}</h2>

              <p>
                Department: {job.department}
              </p>

              <p>
                {job.description}
              </p>

              <p>
                Hiring Goal (Open Seats):{" "}
                {job.hiringGoal}
              </p>

              <p>
                Status: {job.status}
              </p>

              {role === "CANDIDATE" && (
                <button
                  onClick={() =>
                    handleApply(job.id)
                  }
                >
                  Apply
                </button>
              )}

              {(role === "RECRUITER" ||
                role === "TA_LEAD") && (
                <>
                  <button
                    onClick={() =>
                      openEdit(job)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setDeleteItem(job)
                    }
                  >
                    Delete
                  </button>
                </>
              )}

            </div>
          ))}

        </div>
      )}

      {form && (
        <div
          className="modal-backdrop"
          onClick={() => setForm(null)}
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              aria-label="Close"
              onClick={() => setForm(null)}
            >
              X
            </button>

            <h2>
              {form.id
                ? "Edit Job"
                : "Post New Job"}
            </h2>

            <form onSubmit={handleSubmit}>

              <label htmlFor="title">
                Job Title
              </label>

              <input
                id="title"
                name="title"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value
                  })
                }
                required
              />

              <label htmlFor="department">
                Department
              </label>

              <input
                id="department"
                name="department"
                value={form.department}
                onChange={(e) =>
                  setForm({
                    ...form,
                    department:
                      e.target.value
                  })
                }
                required
              />

              <label htmlFor="hiringGoal">
                Hiring Goal (Open Seats)
              </label>

              <input
                id="hiringGoal"
                name="hiringGoal"
                type="number"
                min="1"
                value={form.hiringGoal}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hiringGoal:
                      e.target.value
                  })
                }
                required
              />

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value
                  })
                }
                required
              />

              <button type="submit">
                Save
              </button>

            </form>

          </div>
        </div>
      )}

      {deleteItem && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setDeleteItem(null)
          }
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h2>
              Confirm Delete
            </h2>

            <p>
              Are you sure you want to
              delete this job?
            </p>

            <button onClick={handleDelete}>
              Delete
            </button>

            <button
              onClick={() =>
                setDeleteItem(null)
              }
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default JobList;