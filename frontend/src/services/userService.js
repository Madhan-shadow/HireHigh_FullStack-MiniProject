import api from './api';

const unwrap = (response) => response?.data ?? response;

const getMyAccount = async () => {
  const response = await api.get('/users/me');
  return unwrap(response);
};

const userService = { getMyAccount };

export default userService;