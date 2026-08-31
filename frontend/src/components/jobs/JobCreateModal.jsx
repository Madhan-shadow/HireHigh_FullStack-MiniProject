import React, { useState } from 'react';

const JobCreateModal = ({ job, onClose, onSubmit }) => {
  const isEdit = !!job;

  const [formData, setFormData] = useState({
    title: job?.title || '',
    department: job?.department || '',
    hiringGoal: job?.hiringGoal || 1,
    status: job?.status || 'OPEN',
    description: job?.description || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'hiringGoal' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Job' : 'Post New Job'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Job Title</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Java Developer"
              required
            />
          </div>

          <div>
            <label htmlFor="department">Department</label>
            <input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Engineering"
              required
            />
          </div>

          <div>
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
          </div>

          {isEdit && (
            <div>
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange}>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>
          )}

          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed job description..."
            />
          </div>

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