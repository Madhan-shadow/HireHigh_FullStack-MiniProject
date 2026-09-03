import React, { useEffect, useState } from "react";

const initialForm = {
  title: "",
  department: "",
  hiringGoal: "",
  description: "",
};

const JobCreateModal = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || initialData.jobTitle || "",
        department: initialData.department || "",
        hiringGoal: initialData.hiringGoal || "",
        description: initialData.description || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [initialData, open]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit(form);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={handleOverlayClick}
    >
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <p className="eyebrow">JOB MANAGEMENT</p>
            <h2>
              {initialData ? "Edit Job" : "Post New Job"}
            </h2>
          </div>

          <button
            type="button"
            className="icon-btn"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="job-title">Job Title</label>

            <input
              id="job-title"
              name="title"
              placeholder="Senior Java Developer"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="job-department">
              Department
            </label>

            <input
              id="job-department"
              name="department"
              placeholder="Engineering"
              value={form.department}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="job-goal">
              Hiring Goal
            </label>

            <input
              id="job-goal"
              name="hiringGoal"
              type="number"
              min="1"
              placeholder="5"
              value={form.hiringGoal}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="job-description">
              Description
            </label>

            <textarea
              id="job-description"
              name="description"
              rows="5"
              placeholder="Describe the role..."
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : initialData
                ? "Update Job"
                : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobCreateModal;