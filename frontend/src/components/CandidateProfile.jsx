import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import candidateService from '../services/candidateService';

const CandidateProfile = () => {
  const { role } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    resumeUrl: '',
    primarySkill: '',
    yearsExperience: '',
    photoUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    candidateService
      .getMyProfile()
      .then((data) => {
        if (cancelled) return;
        setFormData({
          resumeUrl: data.resumeUrl || '',
          primarySkill: data.primarySkill || '',
          yearsExperience: data.yearsExperience ?? '',
          photoUrl: data.photoUrl || '',
        });
      })
      .catch(() => {
        if (!cancelled) setError('Could not load your profile.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await candidateService.updateMyProfile({
        resumeUrl: formData.resumeUrl.trim() || null,
        primarySkill: formData.primarySkill.trim() || null,
        yearsExperience: formData.yearsExperience === '' ? null : Number(formData.yearsExperience),
        photoUrl: formData.photoUrl.trim() || null,
      });
      setSuccessMessage('Profile updated successfully.');
    } catch {
      setError('Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  if (role !== 'CANDIDATE') {
    return (
      <div className="page-container">
        <p>This page is only available to candidates.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My profile</h1>
      </div>

      {successMessage && <div className="success-banner">{successMessage}</div>}
      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p>Loading your profile...</p>
      ) : (
        <form className="auth-card" style={{ maxWidth: 480 }} onSubmit={handleSubmit}>
          <label htmlFor="photoUrl">Photo link</label>
          <input
            id="photoUrl"
            name="photoUrl"
            type="url"
            placeholder="https://drive.google.com/your-photo"
            value={formData.photoUrl}
            onChange={handleChange}
          />

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
            placeholder="e.g. Java, React"
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

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CandidateProfile;