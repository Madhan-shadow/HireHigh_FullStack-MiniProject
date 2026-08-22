import React, { useEffect, useMemo, useState } from "react";
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

  const { role } = useSelector((state) => state.auth);

  const [form, setForm] = useState(null);
  const [deleteJobData, setDeleteJobData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const filteredJobs = useMemo(() => {
    return items.filter((job) => {
      const text = `
        ${job.title || ""}
        ${job.department || ""}
        ${job.description || ""}
      `.toLowerCase();

      return text.includes(searchQuery.toLowerCase());
    });
  }, [items, searchQuery]);

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
      deleteJob(deleteJobData.id)
    );

    if (deleteJob.fulfilled.match(result)) {
      setDeleteJobData(null);
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

      <h1>Jobs</h1>

      <input
        type="text"
        placeholder="Search jobs"
        value={searchQuery}
        onChange={(e) =>
          dispatch(setSearchQuery(e.target.value))
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
        <button
          onClick={() =>
            setForm({
              title: "",
              department: "",
              description: "",
              hiringGoal: 1
            })
          }
        >
          Create Job
        </button>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
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
                Hiring Goal: {job.hiringGoal}
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
                      setForm(job)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setDeleteJobData(job)
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
          className="modal"
          role="dialog"
        >
          <button
            onClick={() => setForm(null)}
          >
            X
          </button>

          <form onSubmit={handleSubmit}>

            <label htmlFor="title">
              Title
            </label>

            <input
              id="title"
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
              value={form.department}
              onChange={(e) =>
                setForm({
                  ...form,
                  department: e.target.value
                })
              }
              required
            />

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value
                })
              }
              required
            />

            <label htmlFor="hiringGoal">
              Hiring Goal
            </label>

            <input
              id="hiringGoal"
              type="number"
              value={form.hiringGoal}
              onChange={(e) =>
                setForm({
                  ...form,
                  hiringGoal: e.target.value
                })
              }
              required
            />

            <button type="submit">
              Save
            </button>

          </form>
        </div>
      )}

      {deleteJobData && (
        <div
          className="modal"
          role="dialog"
        >
          <h2>
            Confirm Delete
          </h2>

          <p>
            Are you sure you want to delete{" "}
            {deleteJobData.title}?
          </p>

          <button onClick={handleDelete}>
            Delete
          </button>

          <button
            onClick={() =>
              setDeleteJobData(null)
            }
          >
            Cancel
          </button>
        </div>
      )}

    </div>
  );
}

export default JobList;