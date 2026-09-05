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