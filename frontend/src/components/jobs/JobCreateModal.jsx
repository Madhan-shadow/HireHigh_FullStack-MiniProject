import React, { useState, useEffect } from 'react';

const emptyForm = {
  title: '',
  department: '',
  hiringGoal: 1,
  description: '',
  status: 'OPEN',
};

/**
 * Shared create/edit modal.
 * - If `job` is passed, the form is pre-populated for editing.
 * - onClose closes via the × button or clicking the overlay.
 */
const JobCreateModal = ({ job, onClose, onSubmit }) => {
  const isEdit = Boolean(job);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        department: job.department || '',
        hiringGoal: job.hiringGoal || 1,
        description: job.description || '',
        status: job.status || 'OPEN',
      });
    } else {
      setFormData(emptyForm);
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'hiringGoal' ? Number(value) : value,
    }));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Job' : 'Post New Job'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Job Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Senior Java Developer"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label htmlFor="department">Department</label>
          <input
            id="department"
            name="department"
            type="text"
            placeholder="e.g. Engineering"
            value={formData.department}
            onChange={handleChange}
            required
          />

          <label htmlFor="hiringGoal">Hiring Goal (Open Seats)</label>
          <input
            id="hiringGoal"
            name="hiringGoal"
            type="number"
            min="1"
            value={formData.hiringGoal}
            onChange={handleChange}
            required
          />

          {isEdit && (
            <>
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange}>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </>
          )}

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Detailed job description..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobCreateModal;