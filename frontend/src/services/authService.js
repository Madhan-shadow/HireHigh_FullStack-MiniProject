import api from './api';

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response?.data ?? response;
};

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response?.data ?? response;
};

const changePassword = async (oldPassword, newPassword) => {
  const response = await api.put('/auth/change-password', { oldPassword, newPassword });
  return response?.data ?? response;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  return Promise.resolve();
};

const authService = { login, register, changePassword, logout };

export default authService;