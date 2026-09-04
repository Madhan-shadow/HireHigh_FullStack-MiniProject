import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import userService from '../services/userService';
import candidateService from '../services/candidateService';

const ProfilePage = () => {
  const { role } = useSelector((state) => state.auth);
  const isCandidate = role === 'CANDIDATE';

  const [account, setAccount] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    resumeUrl: '',
    primarySkill: '',
    yearsExperience: '',
    photoUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const accountData = await userService.getMyAccount();
        if (cancelled) return;
        setAccount(accountData);

        if (isCandidate) {
          try {
            const profileData = await candidateService.getMyProfile();
            if (cancelled) return;
            setCandidateProfile(profileData);
            setFormData({
              resumeUrl: profileData.resumeUrl || '',
              primarySkill: profileData.primarySkill || '',
              yearsExperience: profileData.yearsExperience ?? '',
              photoUrl: profileData.photoUrl || '',
            });
          } catch {
            // Candidate profile may not exist yet — not fatal.
          }
        }
      } catch {
        if (!cancelled) setLoadError('Could not load your account details.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [isCandidate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const updated = await candidateService.updateMyProfile({
        resumeUrl: formData.resumeUrl.trim() || null,
        primarySkill: formData.primarySkill.trim() || null,
        yearsExperience: formData.yearsExperience === '' ? null : Number(formData.yearsExperience),
        photoUrl: formData.photoUrl.trim() || null,
      });
      setCandidateProfile(updated);
      setSaveSuccess('Profile updated successfully.');
      setEditing(false);
    } catch {
      setSaveError('Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (loadError || !account) {
    return (
      <div className="page-container">
        <div className="error-banner">{loadError || 'Profile unavailable.'}</div>
      </div>
    );
  }

  const initial = (account.fullName || account.username || '?').charAt(0).toUpperCase();

  return (
    <div className="page-container">
      <div className="profile-hero">
        <div className="profile-hero-avatar">
          {candidateProfile?.photoUrl ? (
            <img src={candidateProfile.photoUrl} alt={`${account.fullName}'s photo`} />
          ) : (
            <span>{initial}</span>
          )}
        </div>
        <div>
          <h1 className="profile-hero-name">{account.fullName}</h1>
          <span className="profile-hero-role">{(account.role || '').toLowerCase()}</span>
        </div>
      </div>

      <div className="profile-section">
        <h2 className="profile-section-title">Account details</h2>
        <div className="profile-info-grid">
          <div className="profile-info-field">
            <span className="profile-info-label">Username</span>
            <span className="profile-info-value">{account.username}</span>
          </div>
          <div className="profile-info-field">
            <span className="profile-info-label">Email</span>
            <span className="profile-info-value">{account.email}</span>
          </div>
          <div className="profile-info-field">
            <span className="profile-info-label">Role</span>
            <span className="profile-info-value" style={{ textTransform: 'capitalize' }}>
              {(account.role || '').toLowerCase().replace('_', ' ')}
            </span>
          </div>
        </div>
        <p className="profile-note">Username and email cannot be changed here.</p>
      </div>

      {isCandidate && (
        <div className="profile-section">
          <div className="profile-section-header">
            <h2 className="profile-section-title">Candidate details</h2>
            {!editing && (
              <button className="btn btn-link" onClick={() => setEditing(true)}>
                Edit
              </button>
            )}
          </div>

          {saveSuccess && <div className="success-banner">{saveSuccess}</div>}
          {saveError && <div className="error-banner">{saveError}</div>}

          {editing ? (
            <form onSubmit={handleSave}>
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

              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="primarySkill">Primary skill</label>
                  <input
                    id="primarySkill"
                    name="primarySkill"
                    type="text"
                    placeholder="e.g. Java, React"
                    value={formData.primarySkill}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-col">
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
                </div>
              </div>

              <div className="modal-actions" style={{ justifyContent: 'flex-start', paddingLeft: 0 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info-grid">
              <div className="profile-info-field">
                <span className="profile-info-label">Primary skill</span>
                <span className="profile-info-value">{candidateProfile?.primarySkill || '—'}</span>
              </div>
              <div className="profile-info-field">
                <span className="profile-info-label">Years of experience</span>
                <span className="profile-info-value">
                  {candidateProfile?.yearsExperience != null ? candidateProfile.yearsExperience : '—'}
                </span>
              </div>
              <div className="profile-info-field">
                <span className="profile-info-label">Resume</span>
                <span className="profile-info-value">
                  {candidateProfile?.resumeUrl ? (
                    <a href={candidateProfile.resumeUrl} target="_blank" rel="noopener noreferrer">
                      View resume
                    </a>
                  ) : (
                    '—'
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;