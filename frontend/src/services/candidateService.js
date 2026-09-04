import api from './api';

const unwrap = (response) => response?.data ?? response;

const getMyProfile = async () => {
  const response = await api.get('/candidates/profile');
  return unwrap(response);
};

const updateMyProfile = async (profileData) => {
  const response = await api.put('/candidates/profile', profileData);
  return unwrap(response);
};

const candidateService = { getMyProfile, updateMyProfile };

export default candidateService;