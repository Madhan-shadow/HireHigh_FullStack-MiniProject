import api from './api';

const unwrap = (response) => response?.data ?? response;

const getMyAccount = async () => {
  const response = await api.get('/users/me');
  return unwrap(response);
};

const updateMyPhoto = async (photoUrl) => {
  const response = await api.put('/users/photo', { photoUrl });
  return unwrap(response);
};

const userService = { getMyAccount, updateMyPhoto };

export default userService;