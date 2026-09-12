import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userService from '../services/userService';
import ChangePasswordModal from './common/ChangePasswordModal';
import { fetchCandidateProfile, saveCandidateProfile } from '../store/slices/candidateSlice';
import { openBase64Pdf } from '../utils/openBase64Pdf';

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
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [fileError, setFileError] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState(null);

  useEffect(function () {
    var cancelled = false;

    function load() {
      userService.getMyAccount()
        .then(function (accountData) {
          if (!cancelled) setAccount(accountData);
        })
        .catch(function () {
          if (!cancelled) setLoadError('Could not load your account details.');
        })
        .finally(function () {
          if (!cancelled) setLoading(false);
        });
    }

    load();
    return function () {
      cancelled = true;
    };
  }, []);

  useEffect(function () {
    if (isCandidate && !candidateLoaded) {
      dispatch(fetchCandidateProfile());
    }
  }, [dispatch, isCandidate, candidateLoaded]);

  useEffect(function () {
    if (candidateProfile) {
      setFormData({
        resumeUrl: candidateProfile.resumeUrl || '',
        resumeFileName: candidateProfile.resumeFileName || '',
        primarySkill: candidateProfile.primarySkill || '',
        yearsExperience: candidateProfile.yearsExperience != null ? candidateProfile.yearsExperience : '',
      });
    }
  }, [candidateProfile]);

  const handleChange = function (e) {
    var name = e.target.name;
    var value = e.target.value;
    setFormData(function (prev) {
      var next = Object.assign({}, prev);
      next[name] = value;
      return next;
    });
  };

  const handleAvatarFileChange = function (e) {
    var file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;

    setAvatarError(null);

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please choose an image file (JPG, PNG, etc).');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setAvatarError('That image is too large - please choose one under 2MB.');
      return;
    }

    setAvatarUploading(true);

    readFileAsDataUrl(file)
      .then(function (dataUrl) {
        return userService.updateMyPhoto(dataUrl);
      })
      .then(function (updatedAccount) {
        setAccount(updatedAccount);
        window.dispatchEvent(new CustomEvent('account-photo-updated', { detail: updatedAccount }));
      })
      .catch(function () {
        setAvatarError('Could not save your photo. Please try again.');
      })
      .finally(function () {
        setAvatarUploading(false);
      });
  };

  const handleRemoveAvatar = function () {
    setAvatarUploading(true);
    setAvatarError(null);

    userService.updateMyPhoto(null)
      .then(function (updatedAccount) {
        setAccount(updatedAccount);
        window.dispatchEvent(new CustomEvent('account-photo-updated', { detail: updatedAccount }));
      })
      .catch(function () {
        setAvatarError('Could not remove your photo. Please try again.');
      })
      .finally(function () {
        setAvatarUploading(false);
      });
  };

  const handleResumeFileChange = function (e) {
    var file = e.target.files && e.target.files[0];
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

    readFileAsDataUrl(file)
      .then(function (dataUrl) {
        setFormData(function (prev) {
          return Object.assign({}, prev, { resumeUrl: dataUrl, resumeFileName: file.name });
        });
      })
      .catch(function () {
        setFileError('Could not read that file. Please try another PDF.');
      });
  };

  const handleRemoveResume = function () {
    setFormData(function (prev) {
      return Object.assign({}, prev, { resumeUrl: '', resumeFileName: '' });
    });
  };

  const resetFormFromProfile = function () {
    if (candidateProfile) {
      setFormData({
        resumeUrl: candidateProfile.resumeUrl || '',
        resumeFileName: candidateProfile.resumeFileName || '',
        primarySkill: candidateProfile.primarySkill || '',
        yearsExperience: candidateProfile.yearsExperience != null ? candidateProfile.yearsExperience : '',
      });
    }
  };

  const handleSave = function (e) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    var payload = {
      resumeUrl: formData.resumeUrl || null,
      resumeFileName: formData.resumeFileName || null,
      primarySkill: formData.primarySkill.trim() || null,
      yearsExperience: formData.yearsExperience === '' ? null : Number(formData.yearsExperience),
    };

    dispatch(saveCandidateProfile(payload)).then(function (resultAction) {
      setSaving(false);

      if (saveCandidateProfile.fulfilled.match(resultAction)) {
        setSaveSuccess('Profile updated successfully.');
        setEditing(false);
      } else {
        setSaveError(resultAction.payload || 'Could not save your profile. Please try again.');
      }

      setTimeout(function () {
        setSaveSuccess(null);
      }, 3000);
    });
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

  var initial = (account.fullName || account.username || '?').charAt(0).toUpperCase();
  var accountPhotoUrl = account.photoUrl || null;

  return (
    <div className="page-container">
      <div className="profile-hero">
        <div className="profile-hero-avatar profile-hero-avatar--editable">
          {accountPhotoUrl ? <img src={accountPhotoUrl} alt="Profile" /> : <span>{initial}</span>}

          <label className="avatar-edit-btn" htmlFor="accountAvatarFile" title="Change photo">
            {avatarUploading ? '...' : '✎'}
          </label>
          <input
            id="accountAvatarFile"
            type="file"
            accept="image/*"
            onChange={handleAvatarFileChange}
            disabled={avatarUploading}
            style={{ display: 'none' }}
          />
        </div>
        <div>
          <h1 className="profile-hero-name">{account.fullName}</h1>
          <span className="profile-hero-role">{(account.role || '').toLowerCase()}</span>
          {accountPhotoUrl && (
            <div>
              <button
                type="button"
                className="btn btn-link"
                onClick={handleRemoveAvatar}
                disabled={avatarUploading}
              >
                Remove photo
              </button>
            </div>
          )}
          {avatarError && <div className="error-banner">{avatarError}</div>}
        </div>
      </div>

      <div className="profile-section">
        <div className="profile-section-header">
          <h2 className="profile-section-title">Account details</h2>
          <button className="btn btn-link" onClick={function () { setShowPasswordModal(true); }}>
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
              <button className="btn btn-link" onClick={function () { setEditing(true); }}>
                Edit
              </button>
            )}
          </div>

          {saveSuccess && <div className="success-banner">{saveSuccess}</div>}
          {saveError && <div className="error-banner">{saveError}</div>}

          {editing ? (
            <form onSubmit={handleSave}>
              {fileError && <div className="error-banner">{fileError}</div>}

              <label>Resume (PDF)</label>
              {formData.resumeUrl ? (
                <div className="resume-card">
                  <div className="resume-card-icon">PDF</div>
                  <div className="resume-card-info">
                    <span className="resume-card-name">
                      {formData.resumeFileName || 'Resume.pdf'}
                    </span>
                    <button
                      type="button"
                      className="btn-link-inline"
                      onClick={function () { openBase64Pdf(formData.resumeUrl); }}
                    >
                      View file
                    </button>
                  </div>
                  <button type="button" className="btn btn-link resume-card-remove" onClick={handleRemoveResume}>
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
                  onClick={function () {
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
                {candidateProfile && candidateProfile.resumeUrl ? (
                  <div className="resume-card resume-card--compact">
                    <div className="resume-card-icon">PDF</div>
                    <div className="resume-card-info">
                      <span className="resume-card-name">
                        {candidateProfile.resumeFileName || 'Resume.pdf'}
                      </span>
                      <button
                        type="button"
                        className="btn-link-inline"
                        onClick={function () { openBase64Pdf(candidateProfile.resumeUrl); }}
                      >
                        View file
                      </button>
                    </div>
                  </div>
                ) : (
                  <span className="profile-info-value">-</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {showPasswordModal && (
        <ChangePasswordModal onClose={function () { setShowPasswordModal(false); }} />
      )}
    </div>
  );
};

export default ProfilePage;