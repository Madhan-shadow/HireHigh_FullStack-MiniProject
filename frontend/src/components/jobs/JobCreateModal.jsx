import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createJob, updateJob } from '../../store/slices/jobSlice';
import './JobCreateModal.css';

export default function JobCreateModal({ job, onClose }) {
  const dispatch = useDispatch();
  const isEdit = Boolean(job);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await dispatch(updateJob({ id: job.id, jobData: formData }));
    } else {
      await dispatch(createJob(formData));
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Job' : 'Post New Job'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
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
          </div>

          <div className="field">
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
          </div>

          <div className="field">
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
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange}>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>
          )}

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Detailed job description..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}