import React, { useEffect, useState } from "react";

const EMPTY_JOB = {
  title: "",
  department: "",
  hiringGoal: 1,
  status: "OPEN",
  description: ""
};

export default function JobCreateModal({
  open,
  onClose,
  onSubmit,
  editingJob = null
}) {
  const [form, setForm] = useState(EMPTY_JOB);

  useEffect(() => {
    if (editingJob) {
      setForm({
        title: editingJob.title || "",
        department: editingJob.department || "",
        hiringGoal: editingJob.hiringGoal ?? 1,
        status: editingJob.status || "OPEN",
        description: editingJob.description || ""
      });
    } else {
      setForm(EMPTY_JOB);
    }
  }, [editingJob, open]);

  if (!open) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      hiringGoal: Number(form.hiringGoal) || 1
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={handleOverlayClick}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-modal-title"
      >

        <button
          type="button"
          className="modal-close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        <h2 id="job-modal-title">
          {editingJob ? "Edit Job" : "Post New Job"}
        </h2>

        <form onSubmit={handleSubmit}>

          <label htmlFor="job-title">
            Job Title
          </label>

          <input
            id="job-title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Senior Java Developer"
            required
          />

          <label htmlFor="job-department">
            Department
          </label>

          <input
            id="job-department"
            name="department"
            type="text"
            value={form.department}
            onChange={handleChange}
            placeholder="e.g. Engineering"
            required
          />

          <label htmlFor="job-goal">
            Hiring Goal (Open Seats)
          </label>

          <input
            id="job-goal"
            name="hiringGoal"
            type="number"
            min="1"
            value={form.hiringGoal}
            onChange={handleChange}
            required
          />

          {editingJob && (
            <>
              <label htmlFor="job-status">
                Status
              </label>

              <select
                id="job-status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="OPEN">
                  OPEN
                </option>

                <option value="CLOSED">
                  CLOSED
                </option>

                <option value="ON_HOLD">
                  ON_HOLD
                </option>
              </select>
            </>
          )}

          <label htmlFor="job-description">
            Description
          </label>

          <textarea
            id="job-description"
            name="description"
            rows="5"
            value={form.description}
            onChange={handleChange}
            placeholder="Detailed job description..."
          />

          <div className="modal-actions">

            <button
              type="button"
              className="secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit">
              {editingJob ? "Update Job" : "Post Job"}
            </button>

          </div>

        </form>
      </section>
    </div>
  );
}