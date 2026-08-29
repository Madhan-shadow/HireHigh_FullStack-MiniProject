import api from './api';

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');

  return Promise.resolve();
};

const authService = {
  login,
  register,
  logout,
};

export default authService;