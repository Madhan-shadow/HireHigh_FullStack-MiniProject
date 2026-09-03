import React, { useState, useEffect } from 'react';

const emptyForm = {
  title: '',
  department: '',
  hiringGoal: 1,
  description: '',
  status: 'OPEN',
};

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
          <h2>{isEdit ? 'Edit job' : 'Post a new role'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Job title</label>
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

          <label htmlFor="hiringGoal">Hiring goal (open seats)</label>
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
                <option value="ON_HOLD">On hold</option>
              </select>
            </>
          )}

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="What the role involves, day to day..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Save changes' : 'Post role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobCreateModal;