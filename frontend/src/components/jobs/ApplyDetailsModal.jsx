import React, { useState } from 'react';

const ApplyDetailsModal = ({ jobTitle, onClose, onSubmit, onSkip, submitting }) => {
  const [formData, setFormData] = useState({
    resumeUrl: '',
    primarySkill: '',
    yearsExperience: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      resumeUrl: formData.resumeUrl.trim(),
      primarySkill: formData.primarySkill.trim(),
      yearsExperience: formData.yearsExperience === '' ? null : Number(formData.yearsExperience),
    });
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>Apply to {jobTitle}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="resumeUrl">Resume link</label>
          <input
            id="resumeUrl"
            name="resumeUrl"
            type="url"
            placeholder="https://drive.google.com/your-resume"
            value={formData.resumeUrl}
            onChange={handleChange}
          />

          <label htmlFor="primarySkill">Primary skill</label>
          <input
            id="primarySkill"
            name="primarySkill"
            type="text"
            placeholder="e.g. Java, React, Data Analysis"
            value={formData.primarySkill}
            onChange={handleChange}
          />

          <label htmlFor="yearsExperience">Years of experience</label>
          <input
            id="yearsExperience"
            name="yearsExperience"
            type="number"
            min="0"
            placeholder="e.g. 3"
            value={formData.yearsExperience}
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onSkip} disabled={submitting}>
              Skip and apply
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyDetailsModal;