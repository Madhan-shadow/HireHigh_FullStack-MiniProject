import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userService from '../services/userService';
import ChangePasswordModal from './common/ChangePasswordModal';
import { fetchCandidateProfile, saveCandidateProfile } from '../store/slices/candidateSlice';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsDataURL(file);
  });

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);
  const { profile: candidateProfile, loaded: candidateLoaded } = useSelector(
    (state) => state.candidate
  );
  const isCandidate = role === 'CANDIDATE';

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    resumeUrl: '',
    resumeFileName: '',
    primarySkill: '',
    yearsExperience: '',
    photoUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [fileError, setFileError] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const accountData = await userService.getMyAccount();
        if (!cancelled) setAccount(accountData);
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
  }, []);

  useEffect(() => {
    if (isCandidate && !candidateLoaded) {
      dispatch(fetchCandidateProfile());
    }
  }, [dispatch, isCandidate, candidateLoaded]);

  useEffect(() => {
    if (candidateProfile) {
      setFormData({
        resumeUrl: candidateProfile.resumeUrl || '',
        resumeFileName: candidateProfile.resumeFileName || '',
        primarySkill: candidateProfile.primarySkill || '',
        yearsExperience: candidateProfile.yearsExperience != null ? candidateProfile.yearsExperience : '',
        photoUrl: candidateProfile.photoUrl || '',
      });
    }
  }, [candidateProfile]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;

    setFileError(null);

    if (!file.type.startsWith('image/')) {
      setFileError('Please choose an image file (JPG, PNG, etc).');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError('That image is too large - please choose one under 2MB.');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setFormData((prev) => ({ ...prev, photoUrl: dataUrl }));
    } catch {
      setFileError('Could not read that image. Please try another file.');
    }
  };

  const handleResumeFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;

    setFileError(null);

    if (file.type !== 'application/pdf') {
      setFileError('Please upload your resume as a PDF file.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError('That file is too large - please choose a PDF under 2MB.');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setFormData((prev) => ({ ...prev, resumeUrl: dataUrl, resumeFileName: file.name }));
    } catch {
      setFileError('Could not read that file. Please try another PDF.');
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photoUrl: '' }));
  };

  const handleRemoveResume = () => {
    setFormData((prev) => ({ ...prev, resumeUrl: '', resumeFileName: '' }));
  };

  const resetFormFromProfile = () => {
    if (candidateProfile) {
      setFormData({
        resumeUrl: candidateProfile.resumeUrl || '',
        resumeFileName: candidateProfile.resumeFileName || '',
        primarySkill: candidateProfile.primarySkill || '',
        yearsExperience: candidateProfile.yearsExperience != null ? candidateProfile.yearsExperience : '',
        photoUrl: candidateProfile.photoUrl || '',
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    const payload = {
      resumeUrl: formData.resumeUrl || null,
      resumeFileName: formData.resumeFileName || null,
      primarySkill: formData.primarySkill.trim() || null,
      yearsExperience: formData.yearsExperience === '' ? null : Number(formData.yearsExperience),
      photoUrl: formData.photoUrl || null,
    };

    const resultAction = await dispatch(saveCandidateProfile(payload));

    setSaving(false);

    if (saveCandidateProfile.fulfilled.match(resultAction)) {
      setSaveSuccess('Profile updated successfully.');
      setEditing(false);
    } else {
      setSaveError(resultAction.payload || 'Could not save your profile. Please try again.');
    }

    setTimeout(() => setSaveSuccess(null), 3000);
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
  const heroPhotoUrl = editing ? formData.photoUrl : (candidateProfile ? candidateProfile.photoUrl : null);

  return (
    <div className="page-container">
      <div className="profile-hero">
        <div className="profile-hero-avatar">
          {heroPhotoUrl ? (
            <img src={heroPhotoUrl} alt="Profile" />
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
        <div className="profile-section-header">
          <h2 className="profile-section-title">Account details</h2>
          <button className="btn btn-link" onClick={() => setShowPasswordModal(true)}>
            Change password
          </button>
        </div>
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
              {fileError && <div className="error-banner">{fileError}</div>}

              <label>Profile photo</label>
              <div className="profile-photo-upload">
                <div className="profile-photo-preview">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Preview" />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>
                <div className="profile-upload-controls">
                  {formData.photoUrl ? (
                    <React.Fragment>
                      <span className="profile-upload-current-label">Photo added</span>
                      <button type="button" className="btn btn-link" onClick={handleRemovePhoto}>
                        Remove photo
                      </button>
                    </React.Fragment>
                  ) : (
                    <input
                      id="photoFile"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFileChange}
                      className="profile-file-input"
                    />
                  )}
                </div>
              </div>
              <span className="profile-upload-hint">
                {formData.photoUrl
                  ? 'Remove the current photo to upload a different one.'
                  : 'JPG or PNG, up to 2MB.'}
              </span>

              <label>Resume (PDF)</label>
              {formData.resumeUrl ? (
                <div className="profile-resume-current">
                  <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer">
                    {formData.resumeFileName ? ('View ' + formData.resumeFileName) : 'View current resume'}
                  </a>
                  <button type="button" className="btn btn-link" onClick={handleRemoveResume}>
                    Remove
                  </button>
                </div>
              ) : (
                <input
                  id="resumeFile"
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeFileChange}
                  className="profile-file-input"
                />
              )}
              <span className="profile-upload-hint">
                {formData.resumeUrl
                  ? 'Remove the current resume to upload a different one.'
                  : 'PDF only, up to 2MB.'}
              </span>

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
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditing(false);
                    resetFormFromProfile();
                  }}
                >
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
                <span className="profile-info-value">
                  {candidateProfile && candidateProfile.primarySkill ? candidateProfile.primarySkill : '-'}
                </span>
              </div>
              <div className="profile-info-field">
                <span className="profile-info-label">Years of experience</span>
                <span className="profile-info-value">
                  {candidateProfile && candidateProfile.yearsExperience != null ? candidateProfile.yearsExperience : '-'}
                </span>
              </div>
              <div className="profile-info-field">
                <span className="profile-info-label">Resume</span>
                <span className="profile-info-value">
                  {candidateProfile && candidateProfile.resumeUrl ? (
                    <a href={candidateProfile.resumeUrl} target="_blank" rel="noopener noreferrer">
                      {candidateProfile.resumeFileName ? ('View ' + candidateProfile.resumeFileName) : 'View resume'}
                    </a>
                  ) : (
                    '-'
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

export default ProfilePage;